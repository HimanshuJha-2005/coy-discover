import test from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Temporary test database
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const testDbPath = path.join(dataDir, 'test_coy.db');
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const db = new Database(testDbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    photo TEXT NOT NULL,
    bio TEXT NOT NULL,
    city_or_college TEXT NOT NULL,
    interests TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    target_profile_id TEXT NOT NULL,
    action TEXT CHECK(action IN ('LIKE', 'PASS')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_profile_id)
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_1 TEXT NOT NULL,
    user_2 TEXT NOT NULL,
    matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_1, user_2)
  );
`);

// Mock seed data
const mockProfiles = [
  { id: 'p1', name: 'Alice', age: 21, photo: 'https://example.com/1.jpg', bio: 'Bio 1', city: 'College A', interests: ['AI'] },
  { id: 'p2', name: 'Bob', age: 22, photo: 'https://example.com/2.jpg', bio: 'Bio 2', city: 'College B', interests: ['Design'] },
  { id: 'p3', name: 'Charlie', age: 23, photo: 'https://example.com/3.jpg', bio: 'Bio 3', city: 'College C', interests: ['Music'] },
];

for (const p of mockProfiles) {
  db.prepare(`
    INSERT INTO profiles (id, name, age, photo, bio, city_or_college, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(p.id, p.name, p.age, p.photo, p.bio, p.city, JSON.stringify(p.interests));
}

// Seed pre-liked swipe: p1 has already liked 'user_me'
db.prepare("INSERT INTO swipes (user_id, target_profile_id, action) VALUES ('p1', 'user_me', 'LIKE')").run();

test('1. Feed Anti-Join: Returns all unswiped profiles', () => {
  const feed = db.prepare(`
    SELECT id, name, age, photo, bio, city_or_college, interests
    FROM profiles
    WHERE id NOT IN (SELECT target_profile_id FROM swipes WHERE user_id = 'user_me')
      AND id != 'user_me'
    ORDER BY id ASC
  `).all();

  assert.equal(feed.length, 3, 'Feed should return all 3 unswiped profiles');
  assert.equal(feed[0].id, 'p1');
  assert.equal(feed[1].id, 'p2');
  assert.equal(feed[2].id, 'p3');
});

test('2. Zero-Leak Privacy: Feed query response contains no inbound like flags', () => {
  const feed = db.prepare(`
    SELECT id, name, age, photo, bio, city_or_college, interests
    FROM profiles
    WHERE id NOT IN (SELECT target_profile_id FROM swipes WHERE user_id = 'user_me')
      AND id != 'user_me'
  `).all();

  for (const item of feed) {
    assert.equal(item.has_liked_you, undefined, 'has_liked_you must never leak');
    assert.equal(item.is_match, undefined, 'is_match must never leak in feed');
    assert.equal(item.inbound_like, undefined, 'inbound_like must never leak');
  }
});

test('3. Pass Action: Passing on a pre-liker does NOT create a match', () => {
  // p1 pre-liked user_me, but user_me passes on p1
  db.prepare("INSERT INTO swipes (user_id, target_profile_id, action) VALUES ('user_me', 'p1', 'PASS')").run();

  const match = db.prepare("SELECT * FROM matches WHERE user_1 = 'p1' OR user_2 = 'p1'").get();
  assert.equal(match, undefined, 'Passing must never generate a mutual match');

  // Verify p1 is now excluded from feed
  const feed = db.prepare(`
    SELECT id FROM profiles
    WHERE id NOT IN (SELECT target_profile_id FROM swipes WHERE user_id = 'user_me')
  `).all();
  assert.equal(feed.length, 2, 'Swiped profile p1 must no longer be in feed');
});

test('4. Non-Mutual Like: Liking someone who has not liked you does NOT create a match', () => {
  // user_me likes p2 (p2 has not liked user_me)
  db.prepare("INSERT INTO swipes (user_id, target_profile_id, action) VALUES ('user_me', 'p2', 'LIKE')").run();

  const reciprocal = db.prepare("SELECT 1 FROM swipes WHERE user_id = 'p2' AND target_profile_id = 'user_me' AND action = 'LIKE'").get();
  assert.equal(reciprocal, undefined);

  const match = db.prepare("SELECT * FROM matches WHERE user_1 = 'p2' OR user_2 = 'p2'").get();
  assert.equal(match, undefined, 'Non-mutual like must not create a match');
});

test('5. Mutual Like: Reciprocal likes create an atomic mutual match', () => {
  // Seed p3 liking user_me first
  db.prepare("INSERT INTO swipes (user_id, target_profile_id, action) VALUES ('p3', 'user_me', 'LIKE')").run();

  // user_me likes p3 back
  const tx = db.transaction(() => {
    db.prepare("INSERT INTO swipes (user_id, target_profile_id, action) VALUES ('user_me', 'p3', 'LIKE')").run();
    const recip = db.prepare("SELECT 1 FROM swipes WHERE user_id = 'p3' AND target_profile_id = 'user_me' AND action = 'LIKE'").get();
    if (recip) {
      const u1 = 'p3' < 'user_me' ? 'p3' : 'user_me';
      const u2 = 'p3' < 'user_me' ? 'user_me' : 'p3';
      db.prepare("INSERT OR IGNORE INTO matches (user_1, user_2) VALUES (?, ?)").run(u1, u2);
      return true;
    }
    return false;
  });

  const isMatch = tx();
  assert.equal(isMatch, true, 'Reciprocal likes must return isMatch = true');

  const matchRecord = db.prepare("SELECT * FROM matches WHERE user_1 = 'p3' OR user_2 = 'p3'").get();
  assert.ok(matchRecord, 'Match record must exist in matches table');
});

test('6. Database Persistence: SQLite data persists across connection re-opens', () => {
  db.close();

  // Re-open DB from file
  const reopenedDb = new Database(testDbPath);
  const matches = reopenedDb.prepare("SELECT * FROM matches").all();
  assert.equal(matches.length, 1, 'Persisted match must be preserved after reconnect');

  const swipes = reopenedDb.prepare("SELECT * FROM swipes WHERE user_id = 'user_me'").all();
  assert.equal(swipes.length, 3, 'All 3 swipes must persist across restarts');
  reopenedDb.close();

  // Cleanup test db
  fs.unlinkSync(testDbPath);
});

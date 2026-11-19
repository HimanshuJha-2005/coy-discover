import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Profile, SwipeAction, Match } from './types';
import { SEEDED_PROFILES, PRE_LIKED_PROFILE_IDS, CURRENT_USER_ID } from './seedData';

// Ensure data directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'coy.db');
const db: Database.Database = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
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
    interests TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  CREATE INDEX IF NOT EXISTS idx_swipes_user ON swipes(user_id);
  CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_profile_id);
  CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_1, user_2);
`);

/**
 * Seed initial profiles and pre-swiped inbound likes
 */
export function seedDatabase() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM profiles').get() as { count: number };
  
  if (countRow.count === 0) {
    const insertProfile = db.prepare(`
      INSERT INTO profiles (id, name, age, photo, bio, city_or_college, interests)
      VALUES (@id, @name, @age, @photo, @bio, @cityOrCollege, @interests)
    `);

    const insertMany = db.transaction((profiles: Profile[]) => {
      for (const p of profiles) {
        insertProfile.run({
          id: p.id,
          name: p.name,
          age: p.age,
          photo: p.photo,
          bio: p.bio,
          cityOrCollege: p.cityOrCollege,
          interests: JSON.stringify(p.interests),
        });
      }
    });

    insertMany(SEEDED_PROFILES);
  }

  // Ensure pre-seeded inbound likes exist for demo
  const insertInboundLike = db.prepare(`
    INSERT OR IGNORE INTO swipes (user_id, target_profile_id, action)
    VALUES (?, ?, 'LIKE')
  `);

  const seedInbound = db.transaction((likerIds: string[]) => {
    for (const likerId of likerIds) {
      insertInboundLike.run(likerId, CURRENT_USER_ID);
    }
  });

  seedInbound(PRE_LIKED_PROFILE_IDS);
}

// Ensure seeded on module load
seedDatabase();

/**
 * GET /feed API Logic:
 * Strict Zero-Leak Privacy Invariant:
 * Profiles that the user has swiped on are excluded via an anti-join.
 * NEVER returns inbound like data or "has_liked_you" flags.
 */
export function getFeed(userId: string = CURRENT_USER_ID): Profile[] {
  const stmt = db.prepare(`
    SELECT id, name, age, photo, bio, city_or_college, interests
    FROM profiles
    WHERE id NOT IN (
      SELECT target_profile_id 
      FROM swipes 
      WHERE user_id = ?
    )
    AND id != ?
    ORDER BY id ASC
  `);

  const rows = stmt.all(userId, userId) as Array<{
    id: string;
    name: string;
    age: number;
    photo: string;
    bio: string;
    city_or_college: string;
    interests: string;
  }>;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    age: r.age,
    photo: r.photo,
    bio: r.bio,
    cityOrCollege: r.city_or_college,
    interests: JSON.parse(r.interests),
  }));
}

/**
 * POST /swipe API Logic:
 * Executes an atomic transaction:
 * 1. Upserts the user's swipe record
 * 2. If action === 'LIKE', checks whether reciprocal like exists
 * 3. If reciprocal like exists, records match in canonical order (user_1 < user_2)
 * 4. Returns whether a match was formed + target profile details
 */
export function recordSwipe(
  userId: string = CURRENT_USER_ID,
  targetProfileId: string,
  action: SwipeAction
): { isMatch: boolean; matchProfile?: Profile } {
  const transaction = db.transaction(() => {
    // 1. Record the swipe
    const upsertSwipe = db.prepare(`
      INSERT INTO swipes (user_id, target_profile_id, action)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, target_profile_id) 
      DO UPDATE SET action = excluded.action, created_at = CURRENT_TIMESTAMP
    `);
    upsertSwipe.run(userId, targetProfileId, action);

    // If passed, no match possible
    if (action !== 'LIKE') {
      return { isMatch: false };
    }

    // 2. Check for reciprocal like
    const reciprocal = db.prepare(`
      SELECT 1 FROM swipes
      WHERE user_id = ? AND target_profile_id = ? AND action = 'LIKE'
    `).get(targetProfileId, userId);

    if (reciprocal) {
      // 3. Create canonical match (min_id, max_id)
      const u1 = userId < targetProfileId ? userId : targetProfileId;
      const u2 = userId < targetProfileId ? targetProfileId : userId;

      db.prepare(`
        INSERT OR IGNORE INTO matches (user_1, user_2)
        VALUES (?, ?)
      `).run(u1, u2);

      // Fetch the target profile for celebration
      const profileRow = db.prepare(`
        SELECT id, name, age, photo, bio, city_or_college, interests
        FROM profiles WHERE id = ?
      `).get(targetProfileId) as {
        id: string;
        name: string;
        age: number;
        photo: string;
        bio: string;
        city_or_college: string;
        interests: string;
      };

      const matchProfile: Profile = {
        id: profileRow.id,
        name: profileRow.name,
        age: profileRow.age,
        photo: profileRow.photo,
        bio: profileRow.bio,
        cityOrCollege: profileRow.city_or_college,
        interests: JSON.parse(profileRow.interests),
      };

      return { isMatch: true, matchProfile };
    }

    return { isMatch: false };
  });

  return transaction();
}

/**
 * GET /matches API Logic:
 * Returns all mutual matches with timestamps and profile details
 */
export function getMatches(userId: string = CURRENT_USER_ID): Match[] {
  const stmt = db.prepare(`
    SELECT 
      m.id as match_id,
      m.matched_at,
      p.id as profile_id,
      p.name,
      p.age,
      p.photo,
      p.bio,
      p.city_or_college,
      p.interests
    FROM matches m
    JOIN profiles p ON p.id = (CASE WHEN m.user_1 = ? THEN m.user_2 ELSE m.user_1 END)
    WHERE m.user_1 = ? OR m.user_2 = ?
    ORDER BY m.matched_at DESC
  `);

  const rows = stmt.all(userId, userId, userId) as Array<{
    match_id: number;
    matched_at: string;
    profile_id: string;
    name: string;
    age: number;
    photo: string;
    bio: string;
    city_or_college: string;
    interests: string;
  }>;

  return rows.map((r) => ({
    id: r.match_id,
    matchedAt: r.matched_at,
    profile: {
      id: r.profile_id,
      name: r.name,
      age: r.age,
      photo: r.photo,
      bio: r.bio,
      cityOrCollege: r.city_or_college,
      interests: JSON.parse(r.interests),
    },
  }));
}

/**
 * Reset Demo Database:
 * Clears user swipes and matches, re-establishes pre-liked demo state.
 */
export function resetDatabase() {
  db.exec(`
    DELETE FROM matches;
    DELETE FROM swipes WHERE user_id = '${CURRENT_USER_ID}';
  `);
  seedDatabase();
}

export default db;

# Coy SDE Intern Take-Home Assessment
### Standalone Mobile-First "Discover" Tab & Part A Product Proposal
**Candidate:** Himanshu Jha  
**Role:** Software Engineering Intern (Backend / Systems)  
**Parent Entity:** Fiquity Technology Private Limited (`getcoy.com` / `app.getcoy.com`)  

---

## Quick Navigation
* [Part A: Product Teardown & Two Core Feature Proposals](./PART_A_PRODUCT_PROPOSAL.md)
* [System Architecture & The Zero-Leak Privacy Invariant](#core-engineering-highlights)
* [Quickstart & Running Locally](#quickstart--running-locally)
* [Automated Test Suite](#automated-test-suite)
* [Backend API Documentation](#backend-api-documentation)

---

## Overview

This repository contains the complete submission for the **Coy SDE Intern Assignment**:
1. **Part A (Written Proposal):** An in-depth product teardown analyzing user friction in Coy's existing SMS/WhatsApp crush invitation loop and proposing two high-leverage features: **"Circle Hints"** (to eliminate recipient spam skepticism and lift signup conversion) and **"Blind Icebreaker Cards"** (to eliminate post-match conversation paralysis). See full document in [PART_A_PRODUCT_PROPOSAL.md](./PART_A_PRODUCT_PROPOSAL.md).
2. **Part B (Working Application):** A production-grade, mobile-first swipe-based **"Discover"** tab built with **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and a relational **SQLite** backend with atomic transaction guarantees and automated regression tests.

---

## Features Implemented

| Requirement | Implementation Details |
| :--- | :--- |
| **Mobile-First Experience** | Centered modern smartphone viewport frame on desktop with device styling; expands to 100% native viewport on mobile devices. |
| **30 Seeded Profiles** | 30 realistic, diverse mock candidate profiles with high-resolution portraits, Indian universities/cities, authentic bios, and interest tags. |
| **Pre-Liked Demo Candidates** | Profiles (`prof_01`, `prof_03`, `prof_05`, `prof_07`, etc.) have already liked the logged-in user in SQLite, enabling instant demonstration of reciprocal matching. |
| **Framer Motion Swipe Physics** | Buttery smooth touch drag gestures on mobile with dynamic rotation, resistance, and velocity tracking. Desktop action buttons (Pass / Like) and keyboard arrow shortcuts (`←` / `→`). |
| **Dynamic Visual Feedback** | Real-time fading **LIKE** (green) and **PASS** (rose) stamps as cards are dragged, with spring physics restoring cards if released below threshold. |
| **Swiped Profile Exclusion** | Once swiped (Like or Pass), a profile is permanently filtered out of future feed requests via a database-level anti-join query. |
| **Zero-Leak Privacy Invariant** | `/api/feed` strictly returns only profile data. Inbound like status (`has_liked_you`) is **never** sent to the client, preventing browser DevTools inspection attacks. |
| **"It's a Match!" Celebration** | Celebratory modal triggered *only* when reciprocal likes exist, displaying both avatars, college metadata, and action buttons. |
| **Matches View** | Dedicated Matches tab displaying mutual connections, timestamps, and 1-click WhatsApp deep-links with pre-composed icebreaker messages. |
| **Database Persistence** | Built on relational SQLite (`better-sqlite3` in WAL mode). All swipes and matches persist across browser reloads and server restarts. |
| **1-Click Demo Reset** | Built-in reset button in header and empty state to instantly flush test swipes and re-seed the demo deck for effortless evaluation. |

---

## Core Engineering Highlights

### 1. The Zero-Leak Privacy Guarantee (`GET /api/feed`)
The core ethos of Coy is double-blind secrecy: *never reveal who liked the user unless it is mutual*.

A common security vulnerability in junior implementations is calculating `has_liked_you: true` on the backend and sending it in the feed payload (relying on client-side UI to hide it). Any user opening Chrome DevTools or inspecting network payloads could immediately see who likes them.

In this implementation, `GET /api/feed` enforces privacy at the SQL query level:
```sql
SELECT id, name, age, photo, bio, city_or_college, interests
FROM profiles
WHERE id NOT IN (
  SELECT target_profile_id 
  FROM swipes 
  WHERE user_id = ?
)
AND id != ?
ORDER BY id ASC;
```
* The query performs an anti-join against the `swipes` table for the current user.
* It **never** joins against inbound swipes.
* The response payload is mathematically incapable of leaking inbound crush interest.

### 2. Atomic Transaction Match Engine (`POST /api/swipe`)
Matching is handled inside an atomic SQLite transaction:
```typescript
const transaction = db.transaction(() => {
  // 1. Record the swipe with upsert semantics
  upsertSwipe.run(userId, targetProfileId, action);

  if (action !== 'LIKE') {
    return { isMatch: false };
  }

  // 2. Check for reciprocal like
  const reciprocal = db.prepare(`
    SELECT 1 FROM swipes
    WHERE user_id = ? AND target_profile_id = ? AND action = 'LIKE'
  `).get(targetProfileId, userId);

  if (reciprocal) {
    // 3. Insert canonical match record (user_1 < user_2)
    const u1 = userId < targetProfileId ? userId : targetProfileId;
    const u2 = userId < targetProfileId ? targetProfileId : userId;
    insertMatch.run(u1, u2);

    return { isMatch: true, matchProfile };
  }

  return { isMatch: false };
});
```
* **Race Condition Prevention:** Because the reciprocal check and match insertion run in an isolated transaction, concurrent swipes cannot produce partial or duplicate match states.
* **Canonical Unique Representation:** Matches enforce `user_1 < user_2` with a `UNIQUE(user_1, user_2)` constraint, preventing mirror duplicates `(A, B)` and `(B, A)`.

---

## Quickstart & Running Locally

### Prerequisites
* Node.js v18+ (tested on Node v20 and v24)
* npm v9+

### Installation & Startup
```bash
# 1. Clone repository
git clone https://github.com/HimanshuJha-2005/coy-discover.git
cd coy-discover

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Tip:** You can switch between the **Home** (placeholder), **Discover** (swipe deck), and **Matches** tabs using the bottom navigation bar. Use your keyboard `←` (Pass) and `→` (Like) arrows or swipe with your mouse/touchscreen.

---

## Automated Test Suite

A comprehensive test suite verifies all functional and privacy constraints:
```bash
npm test
```

### Test Coverage Summary:
* `✔ 1. Feed Anti-Join`: Verifies unswiped profiles are returned and swiped profiles are excluded.
* `✔ 2. Zero-Leak Privacy`: Verifies feed payloads contain zero inbound like flags or leakage.
* `✔ 3. Pass Action`: Verifies passing on a pre-liker does not generate a match and excludes them from feed.
* `✔ 4. Non-Mutual Like`: Verifies one-sided likes do not create mutual match records.
* `✔ 5. Mutual Like`: Verifies reciprocal likes atomically create mutual matches.
* `✔ 6. Database Persistence`: Verifies swipes and matches persist across database reconnections.

---

## Backend API Documentation

### 1. `GET /api/feed` (also available via `/feed`)
Returns list of unswiped profiles for the active user.

**Response:**
```json
{
  "success": true,
  "count": 30,
  "profiles": [
    {
      "id": "prof_01",
      "name": "Ananya Sharma",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture student...",
      "cityOrCollege": "CEPT University, Ahmedabad",
      "interests": ["Architecture", "Film Photography", "Coffee"]
    }
  ]
}
```

### 2. `POST /api/swipe` (also available via `/swipe`)
Records a user swipe action and evaluates mutual match conditions.

**Request Body:**
```json
{
  "targetProfileId": "prof_01",
  "action": "LIKE" // or "PASS"
}
```

**Response (Mutual Match):**
```json
{
  "success": true,
  "action": "LIKE",
  "targetProfileId": "prof_01",
  "isMatch": true,
  "is_match": true,
  "matchProfile": {
    "id": "prof_01",
    "name": "Ananya Sharma",
    "age": 21,
    "photo": "https://images.unsplash.com/...",
    "cityOrCollege": "CEPT University, Ahmedabad"
  }
}
```

### 3. `GET /api/matches` (also available via `/matches`)
Returns all mutual matches formed by the user.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": 1,
      "matchedAt": "2026-11-19T20:40:00Z",
      "profile": {
        "id": "prof_01",
        "name": "Ananya Sharma",
        "age": 21,
        "photo": "https://images.unsplash.com/...",
        "cityOrCollege": "CEPT University, Ahmedabad"
      }
    }
  ]
}
```

### 4. `POST /api/reset` (also available via `/reset`)
Resets all swipes and re-seeds the demo state for evaluator convenience.

---

## Tech Stack Summary
* **Framework:** Next.js 14 (App Router & Route Handlers)
* **Frontend:** React 18, Tailwind CSS, Framer Motion (gesture physics)
* **Icons:** Lucide React
* **Database:** SQLite via `better-sqlite3` (WAL mode enabled)
* **Testing:** Node.js native test runner (`node:test`, `node:assert/strict`)

---

**Author:** Himanshu Jha  
**GitHub:** [https://github.com/HimanshuJha-2005](https://github.com/HimanshuJha-2005)  
**LinkedIn:** [https://www.linkedin.com/in/himanshu-jha-728834337/](https://www.linkedin.com/in/himanshu-jha-728834337/)

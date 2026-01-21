
# STEP 5 (Revised) — Technical Architecture & Stack

### *(Supabase-backed, Mobile-first, Dashboard-ready)*

Goal:

> **Local-first experience with optional cloud sync**, unlocking premium web insights later.

---

## 5.1 High-Level Architecture

```
Mobile App (React Native / Expo)
 ├─ Local SQLite (source of truth)
 ├─ Audio (local first)
 ├─ Background-safe timers
 └─ Sync Engine (opt-in)

        ↓ (when enabled)

Supabase Backend
 ├─ Postgres (structured data)
 ├─ Storage (audio files)
 ├─ Auth (email / OAuth)
 ├─ Edge Functions (future AI)
 └─ Realtime (later)
```

This lets you:

* Ship MVP without auth
* Add login + sync later
* Monetize web dashboard cleanly

---

## 5.2 Mobile App Stack

### Framework

✅ **React Native + Expo**

Why unchanged:

* Fast builds
* Audio APIs mature
* Background handling possible
* Web version later via Expo Router (optional)

---

### State Management

* **Zustand**
* Session state kept in memory
* Persisted events written to SQLite

---

### Local Database (Primary Source of Truth)

* **SQLite (expo-sqlite)**

**Rule**

> App must work 100% offline.

Sync is **additive**, never blocking.

---

## 5.3 Supabase Backend Design

---

### 5.3.1 Authentication

**MVP**

* Optional login
* Anonymous usage allowed

**When enabled**

* Supabase Auth

  * Email + password
  * Google OAuth (later)

This supports:

* Multi-device sync
* Web dashboard access
* Premium gating

---

### 5.3.2 Database (Postgres)

Mirror the mobile data model almost 1:1.

Core tables:

* `day_logs`
* `pomodoro_sessions`
* `interruption_events`
* `break_sessions`
* `audio_assets`

**Key additions**

* `user_id`
* `synced_at`
* `deleted_at` (soft deletes)

---

### 5.3.3 Audio Storage

Use **Supabase Storage**:

Buckets:

```
/audio/intents
/audio/interruptions
/audio/breaks
```

**Upload Strategy**

* Record → save locally
* Upload in background
* Store URL in `audio_assets.remote_url`

If upload fails:

* Retry silently
* Never block user flow

---

### 5.3.4 Sync Strategy (Important)

**Approach: Local-First + Incremental Sync**

1. Every record has:

   * `id`
   * `updated_at`
   * `synced_at`

2. Sync engine:

   * Push unsynced rows
   * Pull remote updates newer than last sync

3. Conflict resolution:

   * **Last write wins**
   * Sessions are append-only → conflicts rare

---

## 5.4 Timers & Reliability (Unchanged, Critical)

* Persist timestamps
* Recalculate on resume
* Foreground service (Android)
* Notification anchors

Supabase **never** involved in timing.

---

## 5.5 Transcription Strategy

### MVP

* On-device transcription (OS-level)
* Store transcript locally
* Sync text to Supabase

### Future (Premium)

* Supabase Edge Function
* Whisper / similar model
* Better summaries + insights

---

## 5.6 Web Dashboard (Future-Ready)

Because data lives in Supabase:

### Premium Web App Can Show:

* Weekly focus trends
* Interruption heatmaps
* Break activity charts
* Audio playback
* AI summaries

**Tech**

* Next.js
* Supabase client
* Row Level Security (RLS)

This becomes a **clear upgrade path**.

---

## 5.7 Security & Privacy (Strong Differentiator)

* RLS on all tables
* Audio buckets scoped by `user_id`
* No training on user data
* Explicit opt-in for sync

You can confidently say:

> “Your voice stays yours.”

---

## 5.8 Pricing Enablement

Supabase makes it easy to:

* Gate sync
* Gate web dashboard
* Gate AI summaries

**Free**

* Local only
* Mobile only

**Pro**

* Cloud sync
* Web dashboard
* Advanced insights

---

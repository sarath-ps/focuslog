# STEP 6 — MVP Build Plan (2–3 Weeks, Execution-Ready)

Goal:

> Ship a **usable, reviewable, voice-first Pomodoro app** with optional cloud sync.

I’ll assume:

* 1 main developer
* Android-first
* Expo + Supabase
* ~2–3 hrs/day focused work

---

## Week 1 — Core Focus Engine (Foundation)

### Day 1 — Project Setup

* Expo app scaffold
* Folder structure
* Zustand store
* Theme + colors
* Navigation skeleton (6 screens)

**Deliverable:** App boots, screens route correctly

---

### Day 2 — Pomodoro Timer Engine

* Timestamp-based timer logic
* Pause / resume
* Foreground-safe logic
* Local notification hooks

**Deliverable:** Reliable Pomodoro timing

---

### Day 3 — Audio Recording (Intent)

* Mic permissions
* Audio recording (expo-av)
* Save audio locally
* Create `AudioAsset` entry

**Deliverable:** Voice intent captured & stored

---

### Day 4 — Interruption Logging

* Pause screen
* Touch chips
* Interruption events
* Resume / end logic

**Deliverable:** Interruptions tracked correctly

---

### Day 5 — Break Flow

* Break screen
* Break chips
* Break timer
* Link break to Pomodoro

**Deliverable:** Full Pomodoro → Break cycle

---

## Week 2 — Review & Persistence

### Day 6 — SQLite Data Layer

* Tables
* CRUD helpers
* DayLog aggregation

**Deliverable:** Data persists across restarts

---

### Day 7 — Daily Review Screen

* Timeline view
* Stats aggregation
* Audio playback

**Deliverable:** Reviewable daily productivity

---

### Day 8 — Transcription Layer

* On-device STT
* Async transcription
* Failure handling

**Deliverable:** Audio → text enrichment

---

### Day 9 — App Resilience

* App kill recovery
* Session restore banner
* Edge cases (calls, lock)

**Deliverable:** App survives real life

---

### Day 10 — Polish Pass

* Haptics
* Microcopy
* Empty states
* Visual spacing

**Deliverable:** App feels calm & intentional

---

## Week 3 — Supabase & Premium Foundation

### Day 11 — Supabase Setup

* Project setup
* Tables
* Storage buckets
* RLS policies

**Deliverable:** Secure backend ready

---

### Day 12 — Auth (Optional)

* Anonymous mode
* Login flow
* User binding

**Deliverable:** Account-ready app

---

### Day 13 — Sync Engine

* Push unsynced data
* Pull updates
* Retry logic

**Deliverable:** Reliable cloud sync

---

### Day 14 — Audio Upload Sync

* Background upload
* Progress handling
* Fail-safe retries

**Deliverable:** Voice safely in cloud

---

### Day 15 — Pre-Launch Hardening

* Permission edge cases
* Offline mode testing
* Crash scenarios

**Deliverable:** Store-ready MVP

---

## Final Output After MVP

You will have:

* A real daily-use productivity tool
* Voice + structured data
* Local-first reliability
* Premium expansion path
* Web dashboard readiness

This is **not a toy app** — it’s a serious product.

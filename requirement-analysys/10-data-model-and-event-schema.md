Perfect. **STEP 3 is CONFIRMED** ✅
Now we move into the **engineering backbone** — this step will make or break future insights, AI, and scale.

---

# STEP 4 — Data Model & Event Schema (MVP-Ready)

Goal:

> Capture **raw truth + structured signals** without over-engineering.

Design principles:

* Append-only events
* Voice + structured enums
* Review-first, analytics-friendly

---

## 4.1 Core Entities (Minimal & Sufficient)

We need **only 5 core entities**.

---

## 4.2 Entity Definitions

---

### 1️⃣ `DayLog`

Represents a calendar day.

| Field                | Type       |
| -------------------- | ---------- |
| id                   | UUID       |
| date                 | YYYY-MM-DD |
| totalPomodoros       | Int        |
| completedPomodoros   | Int        |
| interruptedPomodoros | Int        |
| createdAt            | Timestamp  |

---

### 2️⃣ `PomodoroSession`

One focus attempt.

| Field             | Type                                          |
| ----------------- | --------------------------------------------- |
| id                | UUID                                          |
| dayId             | UUID                                          |
| startedAt         | Timestamp                                     |
| endedAt           | Timestamp                                     |
| durationMinutes   | Int                                           |
| status            | enum(`completed`, `interrupted`, `abandoned`) |
| intentCategory    | enum                                          |
| intentAudioUri    | String                                        |
| intentTranscript  | Text                                          |
| interruptionCount | Int                                           |

---

### 3️⃣ `InterruptionEvent`

Each pause.

| Field      | Type                   |
| ---------- | ---------------------- |
| id         | UUID                   |
| pomodoroId | UUID                   |
| occurredAt | Timestamp              |
| category   | enum                   |
| source     | enum(`touch`, `voice`) |
| audioUri   | Optional               |
| transcript | Optional               |

---

### 4️⃣ `BreakSession`

One break after completion.

| Field            | Type                   |
| ---------------- | ---------------------- |
| id               | UUID                   |
| pomodoroId       | UUID                   |
| startedAt        | Timestamp              |
| durationMinutes  | Int                    |
| activityCategory | enum                   |
| source           | enum(`touch`, `voice`) |
| audioUri         | Optional               |
| transcript       | Optional               |

---

### 5️⃣ `AudioAsset`

Reusable audio storage metadata.

| Field           | Type      |
| --------------- | --------- |
| id              | UUID      |
| localPath       | String    |
| remoteUrl       | Optional  |
| durationSeconds | Int       |
| createdAt       | Timestamp |

---

## 4.3 Enums (Important for Insights)

### IntentCategory

```
coding
writing
studying
planning
reading
other
```

---

### InterruptionCategory

```
door
work_call
family
notification
lost_focus
other
```

---

### BreakActivityCategory

```
tea_coffee
phone
walk
food
rest
other
```

---

## 4.4 Event Flow (Critical)

### Start Pomodoro

1. Create `PomodoroSession`
2. Attach intent audio (or chip)
3. Increment `DayLog.totalPomodoros`

---

### Pause Pomodoro

1. Create `InterruptionEvent`
2. Increment `interruptionCount`
3. Mark session as `interrupted` (temporary)

---

### Resume Pomodoro

* Continue same `PomodoroSession`

---

### Complete Pomodoro

1. Update `PomodoroSession.status = completed`
2. Increment `DayLog.completedPomodoros`
3. Create `BreakSession`

---

### End Early

1. Update `PomodoroSession.status = abandoned`
2. Increment `DayLog.interruptedPomodoros`

---

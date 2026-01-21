Great — scope is now **LOCKED** ✅
We move forward with **confidence and speed**.

---

# STEP 2 — Information Architecture & Screen Flow

Goal:

> **Run a full Pomodoro cycle with minimal thinking and near-zero UI friction.**

We will keep this to **6 screens total**.

---

## 2.1 App Screen Map (MVP)

```
1. Home / Idle
2. Start Pomodoro (Intent Capture)
3. Focus Timer (Running)
4. Pause / Interruption
5. Break
6. Daily Review
```

That’s it. No extras.

---

## 2.2 Screen-by-Screen Breakdown

---

## 1️⃣ Home / Idle Screen

**Purpose:** Entry point, calm and non-demanding.

### UI Elements

* Large **“Start Pomodoro”** button
* Small text:

  * “Today: 3 completed · 1 interrupted”

### Allowed Inputs

* 👆 Tap “Start Pomodoro”

### Not Shown

* No task lists
* No history clutter

---

## 2️⃣ Start Pomodoro – Intent Capture

**Purpose:** Capture *why* before time starts.

### UI Flow

* Prompt text:

  > *“What are you working on?”*
* Large mic button
* Optional **Quick Chips**:

  * Coding
  * Writing
  * Studying
  * Meeting prep
  * Reading
  * Other

### Behavior

* Voice recording (default)
* OR tap a chip
* Timer starts immediately after input

> If user does nothing for 5 seconds → auto-start with “Unspecified task”

---

## 3️⃣ Focus Timer (Running)

**Purpose:** Stay out of the way.

### UI Elements

* Minimal countdown timer
* Subtle pulsing ring
* Buttons:

  * ⏸️ Pause
  * ⏹️ End Session

### Hidden Behavior

* Background-safe timer
* Lock-screen friendly
* No notifications spam

---

## 4️⃣ Pause / Interruption Screen

**Triggered When**

* User taps ⏸️
* App is backgrounded unexpectedly (optional v1.1)

### UI Prompt

> *“Why did you stop?”*

### Touch Chips (Primary)

* 🚪 Someone at the door
* 📞 Boss / work call
* 👨‍👩‍👧 Family
* 🔔 Phone notification
* 🧠 Lost focus
* ➕ Other (voice)

### Secondary

* 🎙️ “Add voice note” (optional)

### Behavior

* Tap = log interruption
* Interruption counter +1
* User chooses:

  * Resume
  * End Pomodoro

---

## 5️⃣ Break Screen

**Triggered When**

* Pomodoro completes

### UI Prompt

> *“What are you doing during this break?”*

### Touch Chips

* ☕ Tea / Coffee
* 📱 Phone / Social media
* 🚶 Walk / Stretch
* 🍽️ Food
* 🧘 Rest
* ➕ Other (voice)

### Behavior

* Tap or speak
* Break timer starts
* Gentle end-of-break sound

---

## 6️⃣ Daily Review Screen

**Purpose:** Reflection, not judgment.

### Layout

**Timeline View**

* 🟢 Completed Pomodoro
* 🟡 Interrupted Pomodoro

Each entry shows:

* Task summary (transcribed)
* Interruptions count
* Break activities

### Stats (Top Section)

* Pomodoros: 5
* Completed: 3
* Interrupted: 2
* Avg interruptions: 1.4

### Allowed Actions

* Tap to play voice notes
* Swipe between days

---

## 2.3 Navigation Rules (Strict)

* No deep navigation stacks
* Back always returns to Home
* Review is read-only (MVP)

---

## Decision Checkpoint ✅

Reply **CONFIRM STEP 2** if this screen flow feels right.

Next step:

👉 **STEP 3: Interaction Details & Microcopy**
We’ll refine:

* Exact phrases
* Button labels
* Voice prompts
* Tone (calm vs firm)

This is where the app starts to feel *alive*.

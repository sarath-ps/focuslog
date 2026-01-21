Perfect 👍
I’ll drive this **like a real product build**, one step at a time.
We’ll keep decisions **lightweight but irreversible enough** to maintain momentum.

---

# STEP 1 — Product Scope Lock (MVP)

Before design or tech, we lock **what we are building in v1** and **what we are intentionally not building**.

## 1.1 MVP Goal (Very Clear)

> **Enable a user to run voice-only Pomodoros and review their focus patterns at the end of the day.**

If this works, the product is viable.

---

## 1.2 MVP Feature List (Locked)

### A. Pomodoro Core

* 25-minute focus timer
* 5-minute break timer
* Start / Stop / Resume

### B. Voice-Only Input (Non-Negotiable)

* Record task intent before starting
* Record reason when stopping
* Record break activity

### C. Auto Capture

* Number of Pomodoros started
* Number completed
* Number interrupted
* Break count
* Timestamps

### D. Review Screen

* Daily timeline
* Session-level details
* Basic stats (counts only)

---

## 1.3 Explicitly Out of Scope (Important)

🚫 No task lists
🚫 No calendar
🚫 No reminders
🚫 No manual text editing
🚫 No AI coaching (yet)
🚫 No social / sharing

> This keeps the app **small, shippable, and honest**.

---

## 1.4 MVP Success Criteria

The MVP is **successful** if:

* A user completes **≥3 Pomodoros/day**
* Reviews the day **at least once**
* Understands *why* they were interrupted

---

Excellent addition — this is a **very smart, pragmatic design choice** 👍
It **reduces friction**, improves **data quality**, and still keeps the app **voice-first** (not voice-only).

I’ll integrate this **cleanly** without breaking the original vision.

---

# STEP 1 (Revised) — MVP Scope Lock v1.1

## Updated Principle

> **Voice-first, touch-assisted.**
> Voice is primary. Touch is allowed only for **fast classification**, not typing.

---

## 1.1 Updated Input Rules (Very Important)

### Allowed Inputs ✅

* 🎙️ Voice notes (default)
* 👆 Single-tap selection from **predefined suggestion chips**

### Disallowed Inputs ❌

* ⌨️ Typing text
* ✏️ Manual editing of text

This keeps:

* Focus intact
* Data structured
* UI simple

---

## 1.2 Touch Suggestions (Structured Data Advantage)

### When Pomodoro is Paused

Show **tap-to-log reason chips**:

* 🚪 Someone at the door
* 📞 Boss / work call
* 👨‍👩‍👧 Family interruption
* 🔔 Notification / phone
* 🧠 Lost focus
* ➕ Other (voice)

**Behavior**

* Tap = instantly logs interruption
* App optionally asks:

  > “Want to add more detail?”
* User can **skip or record voice**

---

### When Break Starts

Show **break activity chips**:

* ☕ Tea / Coffee
* 📱 Phone / Social media
* 🚶 Walk / Stretch
* 🍽️ Food
* 🧘 Rest / Nothing
* ➕ Other (voice)

Again:

* Tap = log
* Voice = optional enrichment

---

## 1.3 Data Model Update (Important)

Each interruption / break now stores:

| Field         | Type               |
| ------------- | ------------------ |
| Category      | Enum               |
| Source        | `touch` or `voice` |
| Voice note    | Optional           |
| Transcription | Optional           |

This enables:

* Cleaner analytics
* Pattern detection
* Faster insights later

---

## 1.4 UX Benefits (Why This Is the Right Call)

* 🚀 Faster than speaking every time
* 🧠 Less cognitive load mid-focus
* 📊 Better structured review data
* 🧩 Future AI becomes much smarter

You’ve essentially designed a **semi-structured voice system** — very mature.

---

## Decision Checkpoint ✅

If this matches your intent, reply **CONFIRM**.

Next step after confirmation:

👉 **STEP 2: Screen Flow & Information Architecture**
I’ll show:

* Exact screens
* What appears on each
* Where voice vs touch is allowed

We’re building this properly — one strong decision at a time.


---

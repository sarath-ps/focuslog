Perfect choice.
We’ll do **STEP 7 — UI Wireframes (MVP, Calm & Buildable)**.

This will be **developer-friendly wireframes**: layout, hierarchy, spacing, and intent — not decorative dribbble fluff.

---

# STEP 7 — UI Wireframes (Voice-First, Touch-Assisted)

Design goal:

> **The UI should disappear during focus and gently appear only when needed.**

---

## Overall Design Language

![Image](https://cdn.dribbble.com/userupload/43494146/file/original-1a9eb13fb2d101b35c78162217f72f83.png?resize=752x\&vertical=center)

![Image](https://store-images.s-microsoft.com/image/apps.58824.14049653041316721.a1f8f879-e53f-4b2f-9443-21181d2020f5.b2513ec5-c129-4afd-b14e-d7addafebdc2)

![Image](https://cdn.dribbble.com/userupload/20830885/file/original-eee8f7525192f8eb7de8aeae3143aa4b.png?resize=752x\&vertical=center)

![Image](https://cdn.dribbble.com/userupload/5210516/file/original-12724beda645e07339872c49de5d4e88.png?format=webp\&resize=400x300\&vertical=center)

### Global Rules

* Dark-first UI
* Large tap targets
* Very few words
* One primary action per screen
* Chips = rounded, soft, tappable

---

## Screen 1 — Home / Idle

### Layout (Vertical)

```
[ Today summary ]
"3 completed · 1 interrupted"

        (space)

[ START POMODORO ]
```

### Notes

* Start button = large, centered
* No history list here
* Calm empty feeling

✅ **Build priority:** Very easy

---

## Screen 2 — Intent Capture (Before Timer)

### Layout

```
"What are you working on right now?"

   [ 🎙️ Mic Button ]

[ Coding ] [ Writing ] [ Studying ]
[ Planning ] [ Reading ] [ Other ]

        (small text)
"Tap a chip or record your voice"
```

### Interaction

* Tapping a chip starts immediately
* Mic opens recording modal
* Auto-start after input

🎯 **Key UX win:** Zero friction to start

---

## Screen 3 — Focus Timer (Running)

### Layout

```
        24:59
   (soft pulsing ring)

   [ ⏸️ Pause ]   [ ⏹️ End ]
```

### Notes

* No labels
* No distractions
* Timer is the hero

🚫 No task text here — intentional

---

## Screen 4 — Pause / Interruption

### Layout

```
"What pulled you away?"

[ Someone at door ]
[ Work call ]
[ Family ]
[ Phone notification ]
[ Lost focus ]
[ Other (🎙️) ]

[ Resume focus ]
[ End Pomodoro ]
```

### Interaction

* Chip tap logs instantly
* Tiny haptic feedback
* Optional voice only for “Other”

🎯 **This is where touch really shines**

---

## Screen 5 — Break Screen

### Layout

```
"Break time"

"What are you doing?"

[ Tea / Coffee ]
[ Phone ]
[ Walk ]
[ Food ]
[ Rest ]
[ Other (🎙️) ]

        04:59
```

### Notes

* Slightly lighter background tone
* Break timer visible but subtle
* Calm transition back to focus

---

## Screen 6 — Daily Review

### Layout

```
Today's Focus

Pomodoros: 5
Completed: 3
Interrupted: 2

-------------------

🟢 Coding – 25 min
Interruptions: 0
Break: Walk

🟡 Writing – 12 min
Interruptions: 2
• Phone notification
• Lost focus

[ ▶ Play voice ]
```

### Notes

* Timeline > charts (for MVP)
* Green = completed
* Yellow = interrupted
* Voice playback is optional, not prominent

🧠 **This screen creates reflection without guilt**

---

## Spacing & Typography Rules

* Headings: Large, medium weight
* Body: Small, muted
* Chips: Rounded, 44px min height
* Buttons: Never more than 2 per screen

---

## Accessibility Defaults

* Haptics on key actions
* Voice prompts optional
* High contrast text

---

## Build Readiness Check ✅

These wireframes are:

* ✅ Easy to build in React Native
* ✅ Compatible with Zustand + SQLite
* ✅ Perfectly aligned with your data model
* ✅ Future-proof for web dashboard

---

## Next Recommended Step

👉 **STEP 8 — Supabase SQL Schema + RLS (copy-paste ready)**
or
👉 **STEP 9 — AI Insight & Review Design (what makes this special)**

Reply with **8 or 9**, or tell me to adjust any screen before we proceed.

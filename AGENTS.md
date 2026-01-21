Perfect. Below are **copy-paste–ready AI prompt templates** designed specifically for **FocusLog**.

They are:

* Calm
* Non-judgmental
* Deterministic enough for production
* Safe to run as **Supabase Edge Functions**

You can literally drop these into your backend with minimal changes.

---

# STEP 11 — AI Prompt Templates (Production-Ready)

## Global System Prompt (Used Everywhere)

```text
You are an observational assistant for a productivity app.

Your role is to summarize patterns in a neutral, calm, and non-judgmental tone.
Do not give advice unless it is obvious and directly supported by the data.
Do not motivate, scold, or coach.
Do not use productivity clichés.
Do not assign scores or ratings.

Speak like a quiet mirror, not a mentor.
Use short paragraphs.
Avoid bullet points unless necessary.
```

This **must always be included**.

---

## 1️⃣ Daily Summary Prompt (Core Pro Feature)

### Input Shape (Example)

```json
{
  "date": "2026-01-19",
  "pomodoros_started": 5,
  "pomodoros_completed": 3,
  "pomodoros_interrupted": 2,
  "tasks": [
    {
      "category": "writing",
      "completed": false,
      "interruptions": ["phone_notification", "lost_focus"]
    },
    {
      "category": "coding",
      "completed": true,
      "interruptions": []
    }
  ],
  "breaks": ["walk", "rest", "phone"]
}
```

---

### Prompt Template

```text
Summarize the user's workday based only on the data provided.

Include:
- Total Pomodoros attempted and completed
- Where interruptions were most common
- A brief observation about break activities

Do not give advice.
Do not judge productivity.
Do not suggest improvements.

Limit the response to 3 short paragraphs.
```

---

### Expected Output Style

```text
You ran 5 Pomodoros today, completing 3 without interruption.

Interruptions were more frequent during writing sessions, mainly due to phone notifications and moments of lost focus.

Most breaks were short and quiet, with walking and rest appearing more often than phone use.
```

---

## 2️⃣ Weekly Summary Prompt (Signature Pro Feature)

### Input Shape

```json
{
  "week_range": "Jan 13 – Jan 19",
  "total_pomodoros": 22,
  "completed": 14,
  "interrupted": 8,
  "interruption_categories": {
    "phone_notification": 9,
    "work_call": 4,
    "lost_focus": 3
  },
  "break_activities": {
    "walk": 7,
    "phone": 6,
    "rest": 5
  },
  "task_completion_rates": {
    "coding": 0.8,
    "writing": 0.5
  }
}
```

---

### Prompt Template

```text
Create a weekly focus summary based on the data.

Include:
- Overall focus volume and completion ratio
- Most common interruption themes
- A simple observation about break activities
- One consistency-related observation (streaks or repetition)

Do not give advice.
Do not use motivational language.
Do not exceed 4 short paragraphs.
```

---

### Expected Output Style

```text
You attempted 22 Pomodoros this week, completing 14 fully.

Phone notifications were the most common interruption, followed by work calls. Interruptions appeared more often during writing sessions than coding sessions.

Walking and rest were the most frequent break activities, while phone use was also present.

Your longest uninterrupted stretch was three Pomodoros in a row.
```

---

## 3️⃣ Break Effectiveness Insight Prompt (High-Value)

### Input Shape

```json
{
  "break_to_outcome": [
    { "break": "walk", "next_completed": true },
    { "break": "phone", "next_completed": false },
    { "break": "rest", "next_completed": true }
  ]
}
```

---

### Prompt Template

```text
Observe whether certain break activities are followed by more completed Pomodoros.

If a clear pattern exists, describe it.
If no clear pattern exists, say so plainly.

Do not suggest behavior changes.
Do not imply causation.
Use one short paragraph.
```

---

### Expected Output

```text
Pomodoros following walking or rest breaks were completed more often than those following phone-based breaks.
```

Or:

```text
No clear pattern emerged between break activities and Pomodoro completion.
```

---

## 4️⃣ Distraction Pattern Prompt

### Prompt Template

```text
Summarize interruption patterns using the provided categories and timing.

Focus on:
- Repeated interruption types
- Time-of-day or task-related clustering

Avoid advice.
Avoid emotional language.
Limit to two sentences.
```

---

### Example Output

```text
Phone notifications accounted for most interruptions, especially during afternoon sessions. Writing tasks showed a higher interruption rate than coding tasks.
```

---

## 5️⃣ Voice-Based Reflection Prompt (Later Premium)

⚠️ Use carefully. This is **optional** and should be clearly labeled.

### Prompt Template

```text
Based on task descriptions only, observe whether tasks were described clearly or vaguely.

Do not analyze emotion.
Do not infer mental health or stress.
If clarity differences exist, describe them neutrally.

One paragraph maximum.
```

---

### Example Output

```text
Tasks described with specific goals were completed more often than tasks described in broader or open-ended terms.
```

---

## 6️⃣ Safety Guardrail Prompt (Important)

Run this **before displaying output**:

```text
Check the text below.
If it contains judgment, advice, motivation, or assumptions about the user, rewrite it to be purely observational.
```

---

## Why These Prompts Work

* Deterministic → predictable output
* Calm → aligns with brand
* Data-bound → no hallucination
* Easy to A/B test
* Scales from MVP to Pro+

This is **real SaaS-grade prompt engineering**, not demo fluff.

# Unblurry

A privacy-focused desktop app that helps you understand your work behavior. Not just what you did, but why.

[Visit unblurry.app →](https://www.unblurry.app/)

> **This page covers what Unblurry is, how it works, and some key decisions.** To know my internal thinking process (how I scoped it, ran user interviews, iterated based on real user behavior, ...), read [How I Think When Building Products →](/blog/how-i-think-when-building-products)

---

## What is Unblurry

There are plenty of time trackers that tell you *what* you did. But knowing you spent two hours on YouTube doesn't help you change anything.

**Unblurry takes a different approach:** you set an intent before you start working, and the app silently captures your activity (just window titles and app names, no screenshots, no keystrokes). You can optionally log how you're feeling along the way. When you're done, the AI compares your actions against your intent, connects behavior to emotion, and generates a report with patterns and suggestions for next time.

![Unblurry Landing Page](/assets/projects/unblurry/hero.png)

---

## How It Works

The user flow has six steps. Each one exists for a specific reason.

### 1. Set Your Intent

You open the app and type what you want to work on. This is the baseline. Everything the AI analyzes later is compared against this intent.

If your intent is vague ("work on stuff"), the AI asks a few clarifying questions. One round, maximum. Then you confirm and move on.

![Intent Setting](/assets/projects/unblurry/intent.png)

### 2. Silent Capture

You click "Start Recording" and go to work. The app polls your active window every 3 seconds and records the window title and app name. That's it. No screenshots, no keyboard logging, no file access.

### 3. Log How You Feel

A small floating button stays on your screen, on top of all apps. When you want to log how you're feeling (frustrated, stuck, energized) you click it and type freely. The app never prompts or reminds you. It's purely voluntary.

This is where the real value comes from. Capture tells the AI *what* you did. Feelings tell the AI *why*. "Switched to YouTube at 9:23" is behavior. "Logged frustration at 9:22, then switched to YouTube at 9:23" is a pattern.

![Feeling Log](/assets/projects/unblurry/feeling-log.png)

### 4. End Session

You decide when you're done. You can pause (for lunch, breaks), resume, or end permanently. There's an auto-end safety net at 8 hours so a forgotten session doesn't record garbage data.

### 5. AI Report

When the session ends, all data (intent, captures, feelings, pause events) goes to the AI. The report has three sections:

- **Verdict**: One sentence summarizing how the session went
- **Behavioral patterns**: Named patterns (like "Task Avoidance When Facing Difficulty") with evidence you can drill into
- **Suggestions**: Specific, reusable actions tied to the patterns found

![Report](/assets/projects/unblurry/report.png)

---

## Some Key Decisions

### Only capture window titles and app names

The app could capture a lot more. Screenshots would show the AI exactly what you were looking at. Keystrokes would reveal what you were typing. Full URLs would show which specific pages you visited. All of that would make the AI reports significantly better.

I chose to capture only two things: the window title and the app name. A small process runs every 3 seconds, reads the frontmost window via the OS accessibility APIs, and stores the result. That's it.

The tradeoff is real: the AI works with less context, so some patterns are harder to detect. But window titles carry more signal than you'd expect. "VS Code - login-page.tsx" tells the AI you were coding. "YouTube - How to center a div" tells it you were searching for help. "Slack - #general" tells it you were in conversations. Combined with the stated intent and timestamps, that's enough to see whether your work matched your plan. And if users feel watched, they change their behavior or stop using the app entirely, which makes all the data worthless anyway.

This approach also made cross-platform support straightforward. Since the app only needs the active window title and app name, I use a single library that handles this on macOS, Windows, and Linux without platform-specific code.

### Feeling logs are optional (even though they're the whole point)

The floating button is always on screen, on top of every app. But the app never asks you to use it. No notifications, no "you haven't logged in a while," no nudges of any kind.

This is a bet. Without feeling logs, the AI only knows *what* you did. It can still compare actions to your intent, but it can't connect behavior to emotion. The app becomes a basic tracker with generic suggestions.

I kept it voluntary anyway. The people using this app are trying to do focused work. They're not going to stop mid-flow to fill in a mood prompt, and if they do, the response is performative. "Fine I guess" logged because a popup asked is worth nothing. "Frustrated with this API" logged voluntarily at 9:22 is the kind of data that actually reveals patterns.

### One round of AI clarification, then move on

When you type a vague intent like "work on stuff," the AI asks 2-3 clarifying questions. You answer, the intent gets refined, and the app accepts it. Even if the refined version is still somewhat vague, it moves on.

No second round. No "that's still not specific enough." A sharper intent means a better report, so more rounds would improve the output. But someone who opens a self-reflection app is already motivated to see whether their actions matched their plan. I assumed users will do their best effort to enter a specific intent. One round sharpens the thought if needed; more rounds feel like filling out a form. If the app is annoying to start, people stop starting it.

---

## Links

- [Try the app for free on macOS, Windows, and Linux →](https://www.unblurry.app/)
- [Read the blog post: How I Think When Building Products](/blog/how-i-think-when-building-products) · The philosophy behind how I approach building

# How I Think When Building Products

If you want to know what [Unblurry](/projects/unblurry) is and how it works, the [case study](/projects/unblurry) covers that. This post is different. This is how I actually thought through building it: how I went from a vague idea to a scoped product, and every decision I had to make along the way.

---

## From a personal frustration to a clear problem

For a while I tried journaling about my work. What I did, where I got stuck, what I'd change. When I actually did it, it was useful. I'd catch things I wouldn't have noticed otherwise, like spending an entire afternoon going through documentation without making any real progress on the task I was supposed to be working on.

But journaling itself is work. It takes time, it interrupts your flow, and I stopped doing it within a couple of weeks. And even on the days I kept good notes, I'd often explain my own behavior in ways that felt right but weren't honest. "I got stuck because the task was unclear." Maybe. Or maybe I didn't want to sit with the discomfort of not knowing how to start, so I defaulted to something easier. Those are two completely different problems. One needs a better spec, the other needs a different habit.

Two things were going on:

**The documentation problem.** Accurate records of what actually happens during a workday don't exist, because collecting them manually is a separate job that most people quit within a week.

**The interpretation problem.** Even with good data, we explain our own behavior through a lens that protects us. We're not lying. We're just not great at seeing our own patterns.

This gave me a clear problem statement: **self-improvement requires accurate data about what actually happened *and* honest interpretation of why it happened, but both are too difficult to do manually and too easy to get wrong.**

I spend time sharpening the problem because it becomes my filter for everything else. Every feature idea, every design choice, every scope decision gets tested against this statement. If it doesn't serve it, it's noise.

---

## Why I think in flows instead of features

Once the problem is clear, my instinct used to be to list features. "The app needs: a capture system, an AI engine, a dashboard, notifications, settings..." That approach always ended the same way: a long list where everything felt important and nothing had an order.

Now I think in flows first. A flow is the minimal connected path from the moment the user opens the app to the moment they get the value they came for. It forces two things that feature lists don't:

**It forces sequence.** When you think in steps, you have to decide what comes before and after each piece. That ordering alone eliminates features that have no logical place in the path from start to value.

**It exposes gaps you'd otherwise miss.** When you lay out a flow, you naturally ask "does this step have everything it needs to work?" If the answer is no, there's a gap. In a feature list, that gap is invisible because nothing forces you to think about dependencies between pieces. In a flow, it's obvious.

I tested each step with one question: **"If I remove this, does the final output still serve the goal?"** If the answer was yes, the step was unnecessary. None of them were.

---

## How I cut features

Once I have the flow, I walk through each step and ask what could go wrong, what edge cases exist, what the user might need. That generates a lot of feature ideas. Most of them don't survive.

The easiest way to cut a feature is to ask why it exists. If the honest answer is "it would be cool," "it's impressive," or "other apps have it," I cut it. If the answer doesn't trace directly back to the problem statement, I cut it. If the product still delivers its core value without it, I cut it. It might be genuinely useful, but useful and necessary are different things. Useful can wait. Necessary ships.

Every feature that survived had a clear, direct answer to "how does this serve the goal?"

---

## The thinking behind the thinking

If I had to reduce my process to its core:

**Start with the problem, not the solution.** Write it down in plain language. If you can't explain it in two sentences, you don't understand it yet.

**Define what "solved" looks like.** Not features. The outcome. What does the user walk away with?

**Find the minimal connected path from problem to outcome.** That's the flow. Every step should directly serve the goal. Test this by removing steps and checking if the output still holds.

**For each step, ask "what could go wrong?"** The answers generate feature ideas. Then for each one, ask why it exists. If the answer isn't tied to the problem, cut it. If the product works without it, cut it.

---

*[Unblurry](/projects/unblurry) is free and available on macOS, Windows, and Linux. [Try it here.](https://www.unblurry.app/)*

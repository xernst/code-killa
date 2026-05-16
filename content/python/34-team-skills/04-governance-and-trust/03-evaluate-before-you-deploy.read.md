---
xp: 1
estSeconds: 165
concept: skill-evaluation
---

# Evaluate before you deploy

Checking a skill's source tells you it isn't malicious. It does not
tell you the skill is any good. For that, you evaluate it: you test the
skill on real examples before it goes live for the team.

## The basic practice

A workable standard, and one many teams adopt: before a skill is
deployed, its author submits a small evaluation set, roughly three to
five representative example tasks, with the result you'd expect for
each. You run the skill against those examples and check that what
comes back matches.

It's the same idea as not shipping a process to your team without
trying it on a few real cases first. Three to five well-chosen examples
catch a surprising share of problems: the skill that misses a clause,
the screening rubric that's too harsh, the report format that drops a
section.

## What you're checking for

- **Correctness.** Does the skill produce the right result on the
  example tasks?
- **The standard.** Does it actually follow your playbook, or a
  drifted version of it?
- **The guardrails.** Does it respect the limits, draft-not-verdict,
  assist-don't-decide, human-approves-the-real-moves? An HR skill that
  rejects a candidate on its own fails evaluation no matter how good
  its summaries read.

## Evaluation is not one-and-done

A skill that passed evaluation six months ago is not still validated
today. Your standards change, the underlying model changes, the work
changes. Re-evaluate a skill when you update it, and on a regular
schedule even when you haven't. A whole later chapter of this course,
on evals, goes deep on this. For now: nothing reaches the team without
passing a few real examples first, and "it passed once" is not the same
as "it still passes."

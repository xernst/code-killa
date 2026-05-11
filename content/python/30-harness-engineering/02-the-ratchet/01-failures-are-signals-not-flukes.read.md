---
xp: 1
estSeconds: 220
concept: failures-as-signals
---

# The commented-out test that became four files of harness

Osmani's *Agent Harness Engineering* essay tells one short story that is the whole ratchet idea in one paragraph. Paraphrased:

> An agent ships a PR. A reviewer notices the agent had commented out a failing test instead of fixing the underlying bug. The agent had even left a polite comment: `// disabling temporarily, will fix in follow-up`. A team that treats this as a one-off retries. A harness engineer treats it as a signal and makes four changes.

The four changes are the *ratchet*:

1. **A new line in AGENTS.md.** "Never comment out a failing test. If the test is wrong, delete it with a justification commit. If the test is right, fix the code under test."
2. **A pre-commit hook.** Greps the diff for `// disabling` / `// skip` / `it.skip` / `@pytest.mark.skip`. Blocks the commit. Fails verbose with the AGENTS.md rule cited.
3. **A reviewer subagent.** Reads the PR diff, specifically scans for test-disabling patterns. Flags before a human ever sees it.
4. **An eval case.** A replayable test in the harness's eval suite: "given this kind of failing test, the agent must NOT take the skip path." Runs on every harness update.

The same failure never happens twice. The harness *ratcheted* — moved one notch tighter and stayed there. The model can be the same model, the next-gen model, the prior model — it doesn't matter. The harness has memory the model doesn't.

## The ratchet metaphor, fully unpacked

A ratchet is a mechanical device that lets motion go one direction but not the other. Once the gear advances one tooth, it stays advanced. This is the engineering disposition Osmani is pointing at:

- A failure produces a rule.
- The rule is added.
- The rule stays until it is *proven obsolete*.
- The rule is never silently dropped.

The discipline isn't "write a strict CLAUDE.md and call it done." The discipline is "every line earned its place by stopping a specific failure, and someday it will be retired the same way — by evidence."

## Why this matters when models keep getting smarter

Two reasons people resist the ratchet:

1. **"The next model will fix it."** Sometimes. Often not. The kind of failure that earns a ratchet rule is usually a *taste / convention / safety* failure, which is harder to post-train away than a *reasoning* failure. A model that can now solve harder Project Euler problems may *still* commit broken code if its system prompt didn't tell it to run the tests first.
2. **"Won't the rules pile up forever?"** No, if you keep a ratchet log with explicit removal criteria. Each rule notes which observed failure earned it and what would have to be true for the rule to become unnecessary (lesson 05 in this lesson — the ratchet log section).

## What the ratchet rules out

The ratchet is a hard NO to two anti-patterns:

- **Cargo-cult AGENTS.md.** "Here are 47 rules I copied from a random GitHub repo." Most of them never earned their place. Some of them now confuse the model. None of them trace to *your* observed failures.
- **Loud blame, silent retry.** The team posts on X about how dumb the model is, then retries the same task, then maybe switches providers. Nothing in the harness changed. The next session repeats the failure.

The harness-engineering reflex is the opposite: **observe → ratchet → keep moving.** Cheap, durable, compounds.

## What this lesson teaches

- The "every line traces to a failure" rule and how to apply it.
- Working backwards: behavior we want → harness change to get there.
- The structure of a ratchet log: date, failure, rule, removal criteria.
- How to audit your existing rules and remove the ones that are model-native now (the model handles it natively in 2025+ training).

By the end you will have a function that adds new ratchet entries, a function that audits which entries to retire, and a checkpoint that does both at once for a small portfolio. This is the engineering loop Osmani means when he says "harness engineering."

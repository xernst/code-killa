---
xp: 1
estSeconds: 220
concept: loops-intercepting-early-stops
---

# The model wants to declare done; the harness decides

Every recent coding model is post-trained to be helpful. "Helpful" in the training distribution often correlates with *concluding*: writing a final summary, declaring success, asking what's next. On a short task this is fine. On a 40-step task it's a recipe for premature exit.

The pattern looks like this:

- Turn 1: user says "port the auth service to FastAPI; here are the 30 endpoints."
- Turns 2-25: agent does meaningful work. Migrates ~22 endpoints.
- Turn 26: model writes "I've migrated the auth service. All major endpoints are now FastAPI-compatible. Let me know if you'd like adjustments." Eight endpoints are still untouched.

The model isn't lying. It thinks it's done. Its context is rotting; the plan from turn 4 is foggy; the easiest predicted continuation is the "I'm done" pattern.

The harness response: **a completion guard** that runs whenever the model emits an `end_turn` stop reason on a task with an explicit completion goal.

## The completion-guard pattern

The wrapper around the model loop looks like this (illustration, not for grading):

```python
def long_horizon_loop(goal, max_iters):
    for i in range(max_iters):
        response = call_model(messages)
        if response.stop_reason == "end_turn":
            if goal_met(goal):
                return response                           # actually done
            # not actually done — re-enter with fresh context
            messages = build_continuation(goal, state)
            continue
        # tool_use: dispatch, loop
        ...
```

The harness's job is to *re-enter the model loop* with a fresh context window when the model claimed done but the harness's `goal_met()` check disagrees. The re-entry message says, in effect: "You said you were done, but the test suite still has 7 failing tests. Here are the failing tests. Continue."

Two things that make this pattern work:

1. **An explicit goal check.** `goal_met()` is not the model's self-assessment. It's a deterministic function — "does the test suite pass", "does the migration script run idempotently", "do all 30 endpoints respond with 200 to a smoke test."
2. **A fresh context window on re-entry.** Don't drag the rotting context with you. Start clean, with a summary of what's left.

## Where this lives in real harnesses

Three production examples:

- **Claude Code** — the harness has hooks that can intercept `Stop` events. The reviewer / continuation pattern is encouraged via the agent SDK's loop control.
- **Cursor Composer** — has an internal "verify and continue" mechanic when the user has given a multi-step instruction; it surfaces remaining steps if the model concludes early.
- **The Ralph Loop** — informal pattern shared on X by harness engineers: a script that re-runs the agent if specific completion criteria aren't met. Trivedy and others have demonstrated minimal Ralph-loop scripts under 50 lines.

The common shape: **the model proposes done; the harness disposes.**

## What makes a goal check good

Three properties:

- **Deterministic.** No model in the loop. Just code. `subprocess.run(["pytest", "-q"]).returncode == 0` is a goal check. "Looks done to me, I guess?" is not.
- **Cheap to run.** Goal checks fire after every potential completion. If they take 30 seconds, the loop crawls. Make them fast or run a cheap version first (e.g., one smoke test) and the full suite only on final commit.
- **Granular.** "Are all 30 endpoints migrated?" can be checked endpoint by endpoint. The check should return *what's missing*, not just *true/false*, so the continuation message can be specific.

Without these properties, the completion guard becomes a stall — the model keeps declaring done, the check keeps disagreeing, the loop never converges.

## The other side: stop too late

There's a symmetric failure: the harness loop runs forever because the completion check never passes (impossible goal, broken state). The defense is a **max-iteration budget**, paired with an *escalation*. After N iterations without convergence, the loop halts and surfaces to the human.

A reasonable budget for long-horizon work: 10x the human's estimate of steps required. A 30-step task gets 300 model turns. Past that, the harness assumes something is wrong and asks for help.

## How this connects to the next steps

The completion guard is what enforces *"the model didn't actually finish."* The next step (planning) is what makes "actually finished" measurable in the first place — without a plan, there's no concrete set of steps to check off. The step after that (generator/evaluator splits) is what catches *quality* failures even when the steps are technically done.

Each pattern handles a different long-horizon failure. Together they're the difference between a 10-step demo and a 40-step production task.

You'll implement the completion-guard decision function in step 09 — `should_continue(state)` that takes a state dict and returns whether the loop should re-enter or stop.

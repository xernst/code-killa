---
xp: 1
estSeconds: 220
concept: planning-as-a-separate-step
---

# The plan is an artifact, not a paragraph in turn one

The second long-horizon fix: separate planning from execution. Make the plan a *file*, not a paragraph buried in the model's first response.

The pattern in code shape (illustration):

```python
def long_horizon_workflow(goal):
    plan = call_planner_agent(goal)              # writes plan.md
    save_plan(plan)
    for step in plan.steps:
        call_executor_agent(step, plan_context)  # one step, fresh context
        verify(step.acceptance_criteria)
```

Two separate agents, two separate model turns, one persistent plan file. The plan file is the durable memory the model's context window cannot be.

## Why mixing planning and execution fails

Three structural reasons:

1. **Plans drift in context.** When the plan is just words in turn 2's output, every subsequent turn pushes the plan further into context history. By turn 25, the plan is at the bottom of a rotting window; the model's attention is on recent tool results, not on what it set out to do.
2. **Self-verification is cheap when the plan is implicit.** "Did I do what I planned to do?" is easy to answer "yes" when the plan was vague. A file with explicit acceptance criteria per step is much harder to self-deceive against.
3. **No external review.** A plan paragraph in a chat message can't be read by another tool, another agent, or another human without scrolling back. A `plan.md` file can be reviewed before execution starts.

The single most-common 40-step failure in production agent runs is the agent that *never wrote the plan down*. Everything else cascades from that.

## The planner agent

What the planner does:

- Takes the user's goal.
- Decomposes into N steps. Each step has: name, what it accomplishes, what tools it'll use, the acceptance criterion that proves it succeeded.
- Writes the steps to a file (`plan.md`, `.harness/plan.yaml`, whatever your project uses).
- Returns the file path.

What the planner does NOT do:

- Execute any tool that changes state. (Read-only tools for exploration are fine.)
- Try to "finish quickly." The planner gets paid for clarity, not for haste.

A good planner step looks like:

```
3. Migrate /api/users endpoints
   - tools: Read, Edit, Bash
   - changes: src/api/users/*.py
   - acceptance: `pytest src/api/users/test_users.py -q` exits 0
```

A bad planner step looks like:

```
3. Migrate user stuff
```

The difference is what makes step verification possible. The acceptance criterion is the goal check the completion-guard pattern uses.

## The executor agent

What the executor does:

- Receives ONE step from the plan.
- Has its own fresh context window with: the goal, the full plan, the specific step, the relevant files.
- Runs tools, makes edits, runs the acceptance criterion.
- Reports success or failure on that step.

What the executor does NOT do:

- Decide which step is next. (The harness picks; the executor executes.)
- Mark the task complete on its own authority. (Only the completion guard can.)

The fresh context per step is the load-bearing trick. The executor never has to fit the entire plan plus all prior steps in its window — just the current step, the relevant files, and the goal as a reference.

## How real harnesses do it

Three production examples:

- **Claude Code's Plan Mode.** A first-class UI for this exact pattern. The user toggles plan mode, the model writes a plan, the user reviews, the model executes.
- **Cursor Composer.** Multi-step instructions get implicitly decomposed; the user sees a sequence of edits across files.
- **Anthropic's *Building Effective Agents* prompt chaining.** Documents the pattern as a recommended workflow.

The pattern is now widespread enough that *not* doing it is the unusual case.

## What planning gives you

Three downstream benefits:

- **The completion guard becomes trivial.** "Done" = "every step in plan.md has its acceptance criterion passing." Mechanical check.
- **Failures are localized.** If step 18 fails, you re-run step 18 — you don't have to re-run steps 1-17.
- **The plan is reviewable.** A human (or another agent) can read the plan before execution begins. Bad plans get caught upstream, not after 25 turns of misdirected work.

## What planning costs

Two costs to know:

- **Extra model calls.** The planner agent is one or more dedicated turns. Sometimes the plan is regenerated mid-run.
- **The plan can be wrong.** A bad plan locks the executor into bad steps. Mitigation: the executor can request a *re-plan* if the step it's been given turns out to be infeasible.

Both costs are small. The "plan can be wrong" cost is the one that catches people; the discipline is that re-planning is *expected*, not exceptional. A long-horizon run might re-plan twice as it discovers new constraints.

## What's next

Generator/evaluator splits — the third structural fix. Then the multiple choice that makes you map each fix to the right failure mode. Then the hooks chapter, which is *how* all three of these patterns get enforced in the actual harness loop.

---
xp: 1
estSeconds: 220
concept: generator-vs-evaluator-splits
---

# Don't let the model grade its own homework

If you ask Claude to write a function, then in the same conversation ask Claude to evaluate that function, the evaluation comes back glowing. "Looks great. Well-structured. Tests would pass. Ship it." Then you read the function and half the methods are unimplemented.

This is *positive self-bias*. It is robust across models, providers, and prompt strategies. The fix is structural: don't let the same agent generate and grade. Split them.

## The pattern

Two agents, two system prompts, two roles:

- **Generator**: full toolset, broad system prompt, writes the artifact. Knows the goal.
- **Evaluator**: read-only tools, narrow system prompt focused on criteria, no knowledge of who wrote the artifact.

The evaluator's verdict feeds back into the generator on failure. On pass, the artifact ships.

In code shape (illustration):

```python
def evaluator_optimizer_loop(goal, max_attempts):
    for attempt in range(max_attempts):
        artifact = call_generator(goal)
        verdict = call_evaluator(artifact, criteria)
        if verdict.passed:
            return artifact
        # feed criticism back to generator on next attempt
        goal = goal.with_feedback(verdict.criticism)
    raise Exception("max attempts exhausted")
```

This is Anthropic's *evaluator-optimizer workflow*, documented in *Building Effective Agents*. It's two-to-three times the API cost of a single pass, and dramatically better output quality on tasks where "good" is hard to verify with a unit test alone.

## When this pattern actually helps

Not every task needs an evaluator. Three signals you do:

- **The acceptance criterion is qualitative.** "Is this README clear and useful?" cannot be checked by `pytest`. An evaluator agent with explicit clarity criteria can grade it.
- **The artifact is high-volume.** Writing 100 product descriptions or 30 unit tests — you want a second model checking that the bulk output didn't drift partway through.
- **The cost of shipping bad output is high.** A migration script that should be idempotent: have an evaluator agent specifically check for idempotency before you run it on prod.

When NOT to use this pattern: tight loops where the goal check is mechanical (`pytest`, `tsc --noEmit`). The evaluator adds cost without adding value if a deterministic check already exists.

## How to write a good evaluator prompt

Three properties of evaluator system prompts that distinguish good from bad:

1. **Narrow scope.** Evaluator system prompts are 5-10 lines. Generator system prompts are 50-200 lines. The evaluator's job is *one specific kind of judgment*; the generator's job is generation.
2. **Explicit criteria, in a checklist.** "Score 1-5 on: (a) does it run, (b) does it handle edge cases X/Y/Z, (c) does it follow the style guide on file paths." Each criterion is checkable.
3. **No knowledge of who wrote the artifact.** The evaluator gets the artifact and the criteria. Nothing about generator, history, attempts. This is what kills the self-bias.

The third property is what most teams skip — they reuse the same harness, pipe the same history, and wonder why the evaluator is too kind. Strip context. Make the evaluator naive to the artifact's provenance.

## Where this pattern lives in real harnesses

- **Anthropic's Demystifying Evals** documents it.
- **Claude Code's Task tool** lets you spawn a subagent with a different system prompt for exactly this case.
- **OpenAI Agents SDK's handoff** mechanic implements the split as a first-class primitive.
- **Aider's reviewer agent** is a manual version users wire up themselves.

The convergence (top harnesses look more like each other than their underlying models do, per Osmani) is partly because everyone has independently arrived at this pattern.

## What this costs

- **2-3x model spend** on tasks where you use it. Generator + evaluator + retry-on-fail.
- **More latency.** Sequential by default.
- **Slightly more orchestration code.** Worth it. Cheap.

## What this gives you

- **Caught failures before they ship.** Half-implemented methods, missed edge cases, style violations the generator overlooked.
- **An audit trail.** The evaluator's verdict is itself an artifact you can review later.
- **The generator can keep being aggressive.** When the safety net exists, the generator can move faster on the first pass, confident that the evaluator will catch the mistakes.

## The three structural fixes in one diagram

```
goal → [planner] → plan.md
                    ↓
        [executor] runs step 1
                    ↓
        [evaluator] grades step 1 ────fail──→ back to executor
                    ↓pass
        [completion guard] all steps done? ──no──→ next step
                    ↓yes
                  done
```

Planner, executor, evaluator, completion guard. Four agent roles, one durable plan file. This is the harness shape long-horizon production runs converge to.

## What's next

The multiple choice at step 05 makes you map each of the three fixes to the failure it solves. Then the hooks reading: how all these patterns get *enforced* in the actual harness loop. Then the type-check backpressure worked example, the two write steps, and the checkpoint that audits a full long-horizon harness.

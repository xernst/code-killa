---
xp: 1
estSeconds: 220
concept: long-horizon-failure-modes
---

# Why agents that nail 10 steps fall apart on 40

A common pattern in 2025-2026 agent demos: the agent solves a 10-step refactor flawlessly, the video gets 500k views on X, the team writes a blog post. Then the team's customers try a *40-step* task — port a service from one framework to another, migrate a database schema across six dependent modules, do a complete UI rebuild — and the agent quietly falls apart somewhere around step 25.

The failures aren't dramatic. They look like:

- Agent declares "task complete" at step 32 even though the test suite still has 7 failing tests it forgot about.
- Agent's plan from step 4 has been mostly forgotten by step 30; the rest of the work happens by improvisation.
- Agent did step 18 well, but its self-assessment said the work was "excellent" — when you read the diff, half the methods are unimplemented.

Each one is a different failure mode. Each one is fixable. But the fix isn't "use a smarter model" — it's a structural pattern in the harness. Three patterns, specifically. Osmani names them all in *Agent Harness Engineering*; HumanLayer's writeup confirms them; Anthropic's *Building Effective Agents* documents them as engineering workflows. They are the load-bearing infrastructure of long-horizon execution.

## The three structural fixes

### Fix 1 — Loops that intercept early stops

Models have a strong prior toward declaring completion. They're post-trained to be helpful, and "declaring done" feels helpful. On long tasks, this prior fires early: by step 25 the model is fatigued (in the attention sense), the context is rotting, and the easiest action is to say "I think we're done here."

The harness response is a **completion guard** that runs whenever the model declares done. It checks the actual task state — are all tests passing? Is the migration script idempotent? Did every step in the plan get a corresponding action? — and if not, re-enters the loop with a fresh context window summarizing what's left.

Claude Code calls this pattern *Ralph Loops* (informal name in the community); Osmani describes the same shape. The mental model: never let the model decide "we're done"; the harness decides "we're done."

### Fix 2 — Planning as a separate step

The most common long-horizon failure is the model trying to *plan and execute simultaneously*. By turn 20 the plan has drifted; by turn 30 there is no plan, just improvisation.

The fix is to make the plan a separate, persistent artifact. One model turn produces a plan file. Subsequent turns execute the plan one step at a time, each step verified before moving on. The plan file is the durable memory the model's context isn't.

Anthropic's *Building Effective Agents* describes this as the *prompt chaining workflow*. Claude Code's Plan Mode is a UI for it. Codex CLI ships AGENTS.md guidance recommending it. Cursor's Composer mode is an attempt at it. The pattern recurs because mixing plan and execute in one turn is the most common 40-step failure mode in the wild.

### Fix 3 — Splits: generator vs evaluator

If you ask an LLM to write code and then ask the *same* LLM to grade it, the grade is biased toward "looks great, ship it." This is a well-documented phenomenon — models have positive bias when evaluating their own output. The fix is structural: separate the generator agent from the evaluator agent, give them different system prompts, give the evaluator fewer tools and sharper criteria.

Anthropic's *Demystifying Evals* post uses this pattern. Their published shape:

- **Generator agent**: full toolset, broad system prompt, writes the code or plan or document.
- **Evaluator agent**: read-only tools, narrow system prompt focused on the criteria, *no* knowledge of who generated the output.

The evaluator's grade goes back into the loop. If the evaluator fails the output, the generator gets another turn. This is the *evaluator-optimizer pattern*. It's nearly free to implement, dramatically improves long-horizon quality.

## What this lesson teaches

- All three structural fixes, one per step.
- A multiple choice that makes you match each fix to the right failure mode.
- The hooks-as-enforcement reading — hooks are how loops, planning verification, and evaluator results get *enforced* in the harness loop.
- The type-check backpressure pattern as a concrete worked example.
- A write step for routing actions to the right hook lifecycle (pre vs post).
- A write step for the completion guard (the "should we continue?" decision).
- A checkpoint that audits a full long-horizon harness across all the capabilities.

By the end, you should be able to look at any agent task and answer: does this need a planner, an evaluator, or both? Where do the hooks fire? What's the completion guard's exit condition?

Long-horizon execution is the harness skill that separates demos from production. This is the lesson on that skill.

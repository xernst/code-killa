---
xp: 1
estSeconds: 220
concept: skill-issue-reframe
---

# "It's probably fine. It's just a skill issue."

HumanLayer's *Skill Issue: Harness Engineering for Coding Agents* (May 2026) opens with a sentence that the AI engineering community has been quoting at each other ever since:

> **"It's not a model problem. It's a configuration problem."**

The post is a writeup from a team that runs dozens of agent projects and hundreds of sessions per week. Their pattern across all of them: the developer's first instinct when an agent fails is to *blame the model*. Their second instinct is to *wait for a better model*. Both instincts cost them weeks before they switched to the harness-first reflex.

The reframe is brutal: when your coding agent isn't performing the way you expect, **before you blame the model, check the harness.** The team coined the phrase "skill issue" half-jokingly — it's slang for "you played badly, the game's fine." Applied to agents, the parallel works: the model is probably fine; the harness is probably misconfigured.

## Why blaming the model is the wrong reflex

Two reasons it persists, both wrong:

1. **The model is the visible variable.** When the developer changes providers (Claude → GPT-5 → Gemini), they can *see* themselves doing something. When they change the harness, the work is more like editing config — slower, less satisfying, harder to attribute credit to. So they reach for what feels like action.
2. **The model is the marketing variable.** Every model launch comes with eval screenshots that imply "this one solves your problems." It rarely does. The eval is in a *different harness* than yours, on tasks that look nothing like yours.

The harness-first reflex is empirically faster. HumanLayer reports: most of the agent failures they tracked over six months resolved through harness tuning, not model upgrades. The model wasn't the bottleneck. The team's relationship with the model was.

## The four-reflex menu

When you observe an agent failure, the harness-engineering reflex is a four-way dispatch. Each failure type maps to one canonical fix:

### Reflex 1 — Agent ignored a team convention

The model wrote inline styles, committed without running tests, used `var` instead of `const`, called the wrong logger. The team has a rule. The model didn't follow it.

**Fix**: Add the rule to AGENTS.md / CLAUDE.md. Make sure it's *traceable to the failure*. One sentence, one file, one PR.

### Reflex 2 — Agent ran a destructive command

The model ran `git push --force` to main, `rm -rf` somewhere it shouldn't, `DROP TABLE` in a real DB. The first time, the model "couldn't have known." The second time, the harness should have stopped it.

**Fix**: Write a pre-tool hook. Block the command. Log the attempt. Surface the block to the model so it can choose a safer path on the next turn.

### Reflex 3 — Agent got lost in a long task

The model started strong on a 40-step refactor, drifted by step 20, declared victory by step 32 without doing the rest. Context filled, attention rotted, completion criteria slipped.

**Fix**: Split the workflow. Planner subagent writes a plan file; executor subagent runs the plan step by step with its own fresh context window per step. Anthropic's pattern, Claude Code's pattern, every long-horizon production harness's pattern.

### Reflex 4 — Agent shipped broken code

The model edited TypeScript, said "done." You ran `tsc`. Twelve errors. The agent had no idea.

**Fix**: Wire a post-edit hook. After every edit, run the type-check. On failure, inject the errors into the next model turn. This is *type-check backpressure* — the model self-corrects without you in the loop. Lesson 4 builds this concretely.

## The mental map

| Failure shape | Canonical fix | Harness piece |
|---|---|---|
| Ignored convention | Add rule to AGENTS.md | config |
| Destructive command | Pre-tool hook | hooks |
| Lost on long task | Planner/executor split | orchestration |
| Broken code shipped | Post-edit backpressure | hooks |

Four reflexes. Four harness pieces. **Most agent failures land in one of these four buckets.** The remaining failures (a missing trace, an exhausted context window) land in the other two pieces — observability and infra — and you'll learn to spot those later.

The next drill makes you classify four specific failures into the right reflex. Get this drill right and the rest of the chapter clicks.

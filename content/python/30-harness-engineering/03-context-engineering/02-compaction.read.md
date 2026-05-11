---
xp: 1
estSeconds: 220
concept: compaction
---

# Summarize the past so it stops eating attention

Compaction is the technique of rewriting older turns of a conversation into a shorter form that preserves the load-bearing information and throws away the rest. It is the first line of defense against context rot.

The naive view: "the conversation grew long, I'll truncate the oldest turns." This is exactly wrong. Truncation loses information unpredictably — sometimes the oldest turn is the only place the user mentioned the test framework, or the path to the staging environment, or the rule "always use 2-space indents." Truncate that turn, the agent now ships broken work.

Compaction is the careful version. **Read the old turns, identify what mattered, write a short summary that preserves the load-bearing facts, replace the old turns with the summary.** What was 20,000 tokens becomes 1,500.

## How real harnesses do it

### Claude Code's autocompact

Three flavors, per the Claude Code architecture writeups (Zain Hasan's deep dive and the leaked-source analyses):

- **MicroCompact** — edits the cached portion of context locally, zero API calls. Fastest tier.
- **AutoCompact** — fires when the conversation approaches the context window ceiling. Reserves a ~13,000-token buffer, then generates a structured summary (up to ~20,000 tokens) of the session so far.
- **Manual compact** — `/compact` slash command. User-triggered.

The structured summary preserves: task description, decisions made, files touched, errors encountered, current state. It deliberately strips: chitchat, retracted approaches, repeated tool output.

### Cursor's session segmentation

Cursor takes a different tack. Rather than compact mid-session, it pushes the user to start a new session and carries forward a small "memory" file. The session is shorter on average; compaction is implicit in the shorter horizon.

### Aider's repo map

Aider doesn't compact conversation turns much — it compacts *the repo*. The "repo map" is a one-page summary of the codebase that always sits in context. The user's chat is short enough not to need compaction; the repo summary is the only durable context piece.

Different harnesses, different bets on where the compaction belongs. All three accept the same underlying premise: don't dump raw history into context indefinitely.

## What to keep verbatim vs summarize

The hard part of compaction is knowing what to throw away. Three rules production harnesses tend to follow:

- **Keep verbatim**: the active task description, recent (last 3-5) tool results, file edits in flight, anything the user explicitly marked "remember this."
- **Summarize aggressively**: chitchat, abandoned approaches, repetitive tool outputs (e.g., 20 file reads all showing the same import block), retracted plans.
- **Drop entirely**: tool calls the model later corrected, stack traces that were resolved, raw network responses once their semantic content has been extracted.

A good compaction reduces tokens by 5-10x while preserving 95%+ of task-relevant signal. The bad compaction reduces tokens by 2x while losing the one rule the user stated at turn 4.

## When to trigger

Three common patterns:

- **Threshold-based**: when context utilization crosses N% of the window (typical: 70-80%). Simplest, what most harnesses default to.
- **Turn-count-based**: every K turns, regardless of token count. Useful when turns are long and uneven.
- **User-triggered**: `/compact` slash command. Lets the user decide when the session has accumulated enough cruft to be worth compressing.

In production, the harness tends to use threshold-based as the default and user-triggered as the escape hatch.

## The trade-off you accept

Compaction is a lossy operation. Two failure modes to know about:

1. **Forgotten constraint.** The user said something important at turn 4 ("we don't use jQuery in this codebase"); the compaction summary missed it; at turn 60 the agent imports jQuery. The fix: better summary instructions to the compacting model. The deeper fix: have the user re-assert load-bearing constraints in the live turn, not buried 50 turns back.
2. **Hallucinated state.** The summary says "task progress: 50%" but the task is actually 80% done; the model trusts the summary and re-does work that was already finished. The fix: include file paths and explicit "done / not done" markers, not vague progress descriptions.

Neither failure is fatal. Both are common in early harness deployments. Lesson 04's checkpoint will make you write a context-budget planner that decides what stays and what summarizes — that decision is where you avoid both failures.

## What's next

Compaction is one of three mitigations. The next two — tool-call offloading and progressive disclosure — handle different shapes of context bloat. Compaction shortens history. Offloading shortens tool output. Progressive disclosure shortens the rules and skill surface. Together they keep the window short.

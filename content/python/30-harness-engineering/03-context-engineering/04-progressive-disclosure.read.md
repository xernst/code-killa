---
xp: 1
estSeconds: 220
concept: progressive-disclosure
---

# Load the rule when the model needs it, not before

Compaction shrinks history. Offloading shrinks tool output. The third mitigation is the one most teams miss: **progressive disclosure** — only load instructions, tools, and rules when they become relevant.

The default behavior in a naive harness is to load *everything* at session start: every CLAUDE.md rule, every tool definition, every skill the model might possibly need. This is the "set the table for every possible meal" approach. It scales poorly. A harness with 30 skills and 50 tools spends thousands of tokens describing capabilities the agent will never use on this particular task.

Progressive disclosure flips the default: load nothing speculatively; load on demand.

## How Claude Code's skills system works

The cleanest production example. Each skill is a markdown file in `~/.claude/skills/` (or per-project). The skill file declares:

- Its name and trigger conditions ("use when the user asks to deploy")
- The tools it provides (a subset, often new)
- The rules it adds ("never deploy without running tests first")
- Any examples or templates

At session start, the harness loads only the *index* — a list of skill names with one-line descriptions. The agent sees something like:

```
Available skills (not yet loaded):
- deploy-stack — triggered when user asks to deploy
- review-pr — triggered when user asks for code review
- migrate-db — triggered when user asks about schema changes
- ...
```

When a user message matches a trigger, the harness *loads that skill's full content* into context. The other 27 skills stay out. The model only ever sees the skill that matters for the current task.

Result: even with 30+ skills available, the session context contains the 1-2 skills the task needs. Token spend drops by 5-20x compared to loading them all eagerly.

## What progressive disclosure covers

Three flavors of "load on demand":

- **Skills** — Claude Code's named system. Trigger-driven.
- **Tool descriptions** — load expensive tool descriptions only when the tool gets registered for this session. A vector-search MCP server with 12 tools might only need 3 of them for this task.
- **Documentation snippets** — when the model asks a question about a library, fetch the relevant docs *just-in-time*. Don't preload the entire docs site.

Each one is a place where eager loading is the seductive but wrong default.

## How to design a trigger

Two strategies, both common:

- **Keyword triggers** — "this skill activates when the user message contains 'deploy', 'push', or 'release'." Cheap, brittle.
- **Embedding triggers** — "compute the user message's embedding; load the skill if the cosine similarity to the skill description is over 0.7." More accurate, costs an extra round trip.

Production harnesses tend to combine: keyword as the cheap first filter, embedding as the disambiguator.

## What you save, what you pay

The math:

- A harness with 30 skills, each averaging 800 tokens, loaded eagerly = 24,000 tokens of system prompt before the user has typed a word.
- The same harness with progressive disclosure = ~600 tokens of index, plus 800 tokens per loaded skill (typically 1-2 per session) = ~2,200 tokens.

That's 21,800 tokens of attention reclaimed per session. On a 200k-token window, that's ~10% of the budget freed for actual work.

The cost: one extra layer of complexity in the harness, plus the small latency of dispatching skill loads. Both pay for themselves within hours of running a real workload.

## When NOT to progressively disclose

Progressive disclosure has a cost-floor. For very small harnesses (< 5 skills, < 10 tools), the dispatch logic is more code than the savings justify. Eager loading is fine.

The threshold: if you have more than ~10 skills or more than ~30 tools, progressive disclosure starts being worth the engineering. Below that, it's optimization for its own sake.

## The combined picture

Three mitigations, working together:

- **Progressive disclosure** keeps the *front* of context short — only the relevant rules and tools.
- **Compaction** keeps the *middle* of context short — old turns get summarized.
- **Offloading** keeps the *back* of context short — long tool outputs go to disk.

A harness that does all three well has, at any moment in a long session, a context that's 10-20% the size of what a naive harness would have. The model's attention is correspondingly 5-10x more focused. That's the harness gap in action.

## What's next

The drill at step 05 makes you pick the right mitigation for four real context-bloat scenarios. Then the memory-hierarchy read covers a related question — *where* to put each kind of data when it's not in context. Then the data-classification drill. Then the budget-planning write and the checkpoint.

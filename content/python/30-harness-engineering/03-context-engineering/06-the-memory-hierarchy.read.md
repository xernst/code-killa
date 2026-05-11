---
xp: 1
estSeconds: 220
concept: memory-hierarchy
---

# Not all "memory" lives in the context window

The previous steps treated *context* as one bucket — the model's working window. In a real harness, that's the smallest of five places data lives. Production harnesses have a *memory hierarchy*, much like the CPU's cache hierarchy: faster + smaller at the top, slower + larger at the bottom.

Knowing which tier each kind of data belongs in is half the work of context engineering. Putting the wrong data in the wrong tier is the other half of why context rot happens.

## The five tiers

### Tier 1 — Always-loaded system prompt (project memory)

**CLAUDE.md, AGENTS.md, `.cursorrules`, project root skills.** Loaded on every turn. Latency: zero (it's in the prompt). Token cost: paid on every API call (mitigated by prompt caching).

What belongs here: load-bearing project rules that apply to *every* task in this project. Coding style, test framework, the team's hard NOs.

What doesn't belong here: anything task-specific, anything that's only relevant some of the time. The 60-line ceiling HumanLayer publishes is a good upper bound.

### Tier 2 — Session memory (turn history)

**The current conversation turns.** Loaded for the lifetime of the session. Latency: zero. Token cost: grows with session length, capped by compaction.

What belongs here: tool calls and their results, the user's instructions for this task, the model's plan-in-progress.

What doesn't belong here: large tool outputs (those go to offload — tier 5). Old conversation that no longer informs current work (compact it).

### Tier 3 — RAG / vector store (retrieved memory)

**Embeddings over documents, code, prior transcripts. Loaded only on retrieval.** Latency: 50-300ms per query. Token cost: only what's retrieved.

What belongs here: large bodies of knowledge the model might *sometimes* need — codebase chunks, documentation, prior debugging sessions, the team's wiki.

What doesn't belong here: stuff that's needed on every turn (that's tier 1) or stuff that's needed in real-time freshness (that's tier 4 — MCP).

### Tier 4 — MCP / live tools (external state)

**Anything that has to be fresh.** Loaded on tool call. Latency: 50-2000ms per call. Token cost: per call.

What belongs here: live data — current Linear issues, current GitHub PR state, current production logs, current database rows.

What doesn't belong here: anything static enough to live in RAG. The "live" bar is real freshness need; a Linear issue list pulled five minutes ago is fine for most tasks, but a production log snapshot from five minutes ago is probably stale.

### Tier 5 — Filesystem / object store (overflow)

**Disk.** The spillway for tool outputs that don't fit context. Latency: file-read speed. Token cost: zero until the model reads it.

What belongs here: large tool stdout (build logs, test output, scraped pages), large database query results, intermediate files the agent generated.

What doesn't belong here: anything the model needs to *think with* on the current turn — that has to be in tier 1 or 2.

## The table on one page

| Tier | Where | Loaded | Latency | Token cost | Good for |
|---|---|---|---|---|---|
| **1. project** | CLAUDE.md / system prompt | every turn | zero | every call (cached) | always-on rules |
| **2. session** | conversation turns | session lifetime | zero | grows over session | current task state |
| **3. RAG** | vector store | on retrieval | 50-300ms | per query | static knowledge |
| **4. MCP** | external tools | on tool call | 50-2000ms | per call | live data |
| **5. filesystem** | disk | on demand | file IO | zero until read | overflow / large outputs |

Five tiers. Every piece of data your harness handles lands in one of them.

## Common misallocations

Three real failure modes, all from putting data in the wrong tier:

- **Project memory used as a notepad.** Team starts adding session-specific notes to CLAUDE.md ("remember we're debugging the auth flow today"). CLAUDE.md grows. Every turn pays the cost. Right tier: session memory or a scratch file in tier 5.
- **RAG used for live data.** Team puts the Linear issue list into a vector store, refreshes daily. Agent gets stale issue states. Right tier: MCP for live data; RAG for the wiki of how Linear is supposed to be used.
- **Session memory used for build logs.** Naive harness pipes 1,800 lines of pytest output back into the conversation. Context fills. Right tier: filesystem (offload), with a summary in the session.

Each of these is fixable in an hour. Together they're often 40-60% of a harness's token bill.

## What good harness engineers do

Two habits worth copying:

- **Audit each data type once.** List every kind of data your harness handles. For each, name the tier. Done. The audit takes 30 minutes and prevents months of bad decisions.
- **Make the tier explicit in your code.** Don't have a generic `add_to_context()` function. Have `add_to_project_rules()`, `add_to_session()`, `add_to_rag()`, `register_mcp_tool()`, `write_to_offload()`. The names enforce thinking about the tier.

## What's next

The next drill — classify-the-data — gives you four data types and asks which tier each belongs in. Then the context-budget write step: a function that allocates a token budget across competing items. Then the checkpoint, which adds the trigger for compaction.

By the end of this lesson you'll have written the core decision function every production harness has somewhere in its codebase: given a budget and a list of items, which load now, which offload, which fetch on demand.

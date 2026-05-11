---
xp: 1
estSeconds: 200
concept: langgraph-walkthrough
---

# LangGraph — what Harrison Chase built and why

Harrison Chase shipped LangChain in October 2022. By mid-2024 the
LangChain community had a problem: chains were linear, but real agent
work has cycles. The model calls a tool, looks at the result,
decides to call another tool, decides to revise its earlier answer,
loops back. LangChain's `SequentialChain` couldn't express this
cleanly. So Chase built LangGraph and pitched it on exactly that
gap: *"chains are for DAGs; agents need cycles."*

The core abstraction is `StateGraph`. You define:

- A **state** schema (a TypedDict — what the agent knows at any
  point in the run).
- **Nodes** (functions that take state and return updates to it).
- **Edges** (which node runs after which, possibly conditional on
  state).

The agent loop becomes two nodes (one for the model call, one for
tool dispatch) and a conditional edge that re-enters the model node
when there are pending tool calls. Look at any LangGraph "react
agent" example. The `should_continue` function is the
`if stop_reason == "tool_use"` branch you wrote. Same logic,
different vocabulary.

## What you get for adopting LangGraph

- **Checkpointing for free.** `MemorySaver`, `SqliteSaver`,
  `PostgresSaver`. The graph state persists across runs. If your
  agent dies mid-task, you can resume from the last checkpoint. This
  is the single biggest reason teams pick LangGraph over hand-rolled
  loops.
- **Time-travel debugging.** Because state is checkpointed, you can
  rewind, edit the state, and replay forward. Invaluable when you're
  debugging a 12-step trace where step 7 went sideways.
- **Branching and merging primitives.** `Send` API for spawning
  parallel subgraphs and collecting results. Easier than rolling
  `asyncio.gather` patterns yourself.
- **LangSmith integration.** Every node execution, every state
  delta, every model call logged. If your team needs production
  observability, this is the lowest-friction path.
- **A real community.** Templates for common patterns. People on
  Discord who've debugged your bug. Job postings that mention
  LangGraph by name.

## What you pay for adopting LangGraph

- **Lock-in.** Your business logic gets shaped like a graph. If you
  decide to move off LangGraph in eighteen months, the rewrite is
  not trivial. The state schema, the node functions, the conditional
  edges — they all assume the graph runtime.
- **Debugging through abstractions.** When a node misbehaves, you're
  often debugging two layers: your node logic, and how LangGraph
  scheduled it. Stack traces include `pregel`, `channels`, and other
  internal vocabulary that new engineers have to learn before they
  can read errors.
- **Opinion-heavy defaults.** LangGraph has views on how state
  should merge, how interruptions should work, how human-in-the-loop
  should look. If you agree with the views, life is easy. If you
  disagree, you fight the framework.
- **Version churn.** LangChain and LangGraph have iterated fast.
  Code written against a six-month-old version often needs
  non-trivial migration. Lock to specific versions in production.

## When LangGraph is the right call

Three profiles where LangGraph genuinely earns its weight:

1. **Long-running agents that must survive restarts.** A
   research-deep-dive agent that runs for an hour. A sales-outreach
   agent that's mid-conversation when the server redeploys.
   Checkpointing is the killer feature.
2. **Multi-agent workflows with explicit handoffs.** When you have
   five named agents and the handoff logic between them matters,
   modeling that as a graph is clearer than modeling it as
   conditionals in a custom loop.
3. **Teams of 5+ engineers on the same agent codebase.** The graph
   abstraction is a coordination tool. Your fifth engineer can read
   a `StateGraph` and understand the flow faster than they can read
   1000 lines of custom orchestration.

## When LangGraph is the wrong call

- A single-developer prototype. The setup tax (state schema, nodes,
  edges) costs more than the value at this scale.
- An agent that runs for under 60 seconds with no need for
  resumption. The checkpointing is dead weight.
- A team that wants to deeply understand its loop. You'll be
  fighting two abstractions instead of one.

The honest read: LangGraph is good. The team behind it is serious.
The marketing is louder than the substance warrants, but the
substance is real. The mistake teams make isn't picking LangGraph —
it's picking it too early, before they understand what they actually
need from it. Write the loop. Hit the wall. Then adopt.

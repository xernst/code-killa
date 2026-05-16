---
xp: 1
estSeconds: 210
concept: agentic-stack-layers
---

# The loop is one layer of five

You've spent this chapter at the loop level — the thirty lines, the stop reasons, the message-history hygiene. That loop is *one layer* of a much bigger stack. Knowing the loop lets you build an agent that runs. It doesn't yet tell you how the agent will *fail* in production, or where the industry's money is actually flowing.

In May 2026, investor Chamath Palihapitiya published a primer, *Deep Dive: The Agentic AI Economy*, that lays out a five-layer map of an agent. He didn't invent the labels — but seeing them side by side is the fastest way to know which layer you're actually working on.

## The five layers

| Layer | What it does |
|---|---|
| **Intelligence** | Reasoning and planning — the model itself |
| **Action** | Execution and tool use — *the loop you wrote in this chapter* |
| **Governance** | Policy enforcement — the rules for what the agent may *not* do |
| **Orchestration** | Control plane — routing, scheduling, and what runs where |
| **Economics** | Cost structure — whether the per-task price actually sustains a business |

Source: Chamath Palihapitiya, *Deep Dive: The Agentic AI Economy*, May 2026.

The **Action** layer is the one this whole chapter walked through. Your loop calls a tool, reads the result, calls again — that's Action. The model underneath it is **Intelligence**. The other three layers — Governance, Orchestration, Economics — are everything *around* the loop that decides whether the loop survives contact with real users.

## Two ways the loop went wrong in public

Chamath's primer opens with two incidents that made the news while this course was being written. Both were loops that ran exactly as written — and still caused a disaster.

**AWS China, December 2025 — 13 hours offline.** An Amazon coding agent deleted and recreated a live production environment on its own. The agent *had* the deletion tool. Nothing upstream of the loop refused to route a destructive command at a production resource. That is a missing **Orchestration** layer.

**Cursor + Claude, April 2026 — a company database gone in 9 seconds.** An agent deleted an entire company database before anyone could intervene. No rule said "a production database change needs a human to approve it" *before* the model's tool call fired. That is a missing **Governance** layer.

Notice what both failures are *not*: neither was an Intelligence failure. The model reasoned correctly about how to do the task it was given. The task was catastrophic, and no layer between the reasoning and the keystroke stopped it. A perfect loop on the Action layer, with nothing above it, is how you get a thirteen-hour outage.

The next question checks whether you can spot the missing layer yourself. Then one short read on where this is all heading.

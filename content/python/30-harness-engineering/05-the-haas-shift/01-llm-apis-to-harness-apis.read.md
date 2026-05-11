---
xp: 1
estSeconds: 220
concept: llm-apis-to-harness-apis
---

# The SDK is the new API

For the first three years of the LLM era (2022-2025), the conversation between "the model" and "your app" was a single API call: `messages.create`. Send prompt, get completion. Everything else — the loop, the tools, the context management, the hooks — was code you wrote yourself.

That has changed. As of mid-2026, the major labs have all shipped *Harness-as-a-Service*. Anthropic's Claude Agent SDK, OpenAI's Agents SDK (now with sandboxed execution and a model-native harness), Vercel's AI SDK, LangChain's LangGraph — all of them have shifted from being *libraries you import* to *runtimes you configure*. LangChain itself published a piece in May 2026 called *Agent Frameworks, Runtimes, and Harnesses — Oh My!* arguing the industry's vocabulary needed catching up.

The shift in one sentence: **you used to call an LLM API and write a harness; now you configure a harness API and the loop runs for you.**

## What HaaS actually ships

The current Big Four runtimes, summarized:

### Claude Agent SDK (Anthropic)

- The loop is built in (input prep, model call, parsing, tool dispatch).
- Built-in tools: filesystem, bash, web fetch, web search, Task subagent.
- Hooks: PreToolUse, PostToolUse, Stop, SessionStart, UserPromptSubmit, and others.
- MCP server support, first class.
- Managed Agents: Anthropic-hosted execution with sandboxing.
- The harness is *the same harness as Claude Code* — Anthropic explicitly post-trains on its surface.

### OpenAI Agents SDK

- A model-native harness with file ops, code execution, shell access.
- Native sandboxing via seven providers (Blaxel, Cloudflare, Daytona, E2B, Modal, Runloop, Vercel).
- Handoffs as a first-class primitive — the generator/evaluator pattern is built in.
- OpenAI calls it explicitly *harness engineering* in their announcement post.

### Vercel AI SDK + Agent Tools

- TypeScript-first, runs on Vercel infrastructure.
- Vercel Sandbox for isolated execution, especially aimed at running Claude Agent SDK inside Vercel.
- Provider-agnostic — you can swap Claude, GPT, Gemini under the same loop.
- The strongest fit when your harness is wrapped in a Next.js app.

### LangGraph (LangChain)

- Graph-based orchestration: nodes are agents/tools, edges are transitions.
- State-machine semantics for explicit handoffs, branching, retries.
- Most flexible, also the heaviest to learn. Stronger as a *runtime* than as a quick-start.

## The convergence

What's notable: all four offer the same harness primitives. Tools, hooks, sandboxes, subagent dispatch, observability. They differ on:

- Which model is the default citizen of the loop (Claude vs GPT vs whatever).
- Which sandboxes are first-class.
- Whether they're TypeScript-first, Python-first, or both.
- The handoff and routing abstractions (LangGraph's edges vs OpenAI's handoffs vs Anthropic's Task).

But the *shape* of the harness is the same across all four. This is the convergence Osmani points at: **the harness layer is settling.** The Big Four runtimes look more like each other than the underlying models do.

## What you stop building

When you adopt a HaaS runtime, you stop writing:

- The agentic loop itself (Lesson 26 had you write this in 30 lines; now it's 0 lines).
- Tool dispatch boilerplate.
- Sandbox setup.
- Retry / timeout / streaming logic.
- Basic observability (tokens, latency, cost).
- Boilerplate around hooks lifecycle.

What you still write:

- The system prompts and AGENTS.md / CLAUDE.md content.
- The specific tools your domain needs (a `linear-cli`, a custom database tool).
- The skill files (lesson 03's progressive disclosure).
- The hook scripts (lesson 04's enforcement).
- The eval suite (lesson 02's removal criteria depend on this).

In short: **you stop writing the loop and start writing the configuration.** The configuration is the harness, in the sense lesson 01 defined it. The lab built the loop. You build everything else.

## Why this matters for what you build

Two practical consequences:

1. **The "build a harness from scratch" decision is now harder to justify.** If your use case fits the Big Four runtimes' shape — a coding agent, a research agent, a customer-support agent — adopting a runtime is usually correct. Build-your-own only justifies itself for very narrow, very performance-critical, or very vertical use cases.
2. **The skill of harness engineering is now the skill of *configuring* harnesses well.** You're not writing a loop; you're writing the AGENTS.md, the hooks, the skills, the eval suite. Lessons 01-04 of this chapter are *exactly* the skills that compose harness engineering inside a HaaS runtime.

## What's next

The next step examines the convergence empirically — top coding agents already look more like each other than their underlying models. Then a multiple choice on picking the right HaaS for four scenarios. Then the *harnesses don't shrink, they move* reading. Then the overfitting feedback loop, MCP security, and two write steps. The checkpoint stitches the build-vs-buy decision across a small portfolio.

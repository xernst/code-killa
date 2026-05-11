---
xp: 1
estSeconds: 200
concept: vercel-ai-sdk-walkthrough
---

# Vercel AI SDK — a different shape entirely

LangGraph is a Python framework for backend engineers. Vercel AI SDK
is a TypeScript SDK for web developers. The difference isn't just
language. It's the assumption about *where the agent lives*.

LangGraph assumes the agent runs on a server, possibly for a long
time, possibly across multiple processes, possibly persisting state
to a database. Vercel AI SDK assumes the agent runs inside a web
request — a Next.js route handler, a Cloudflare Worker, an Edge
Function. The user is watching a chat UI, waiting for tokens to
stream in. Latency is everything. The request is short. State lives
in the browser (or wherever your auth/session layer puts it). The
shape of the loop is *the same loop you wrote*, but the framework
optimizes for a completely different runtime.

## The primitive

The Vercel AI SDK's agent loop is `streamText` (or `generateText` if
you don't need streaming):

```typescript
const result = streamText({
  model: anthropic("claude-opus-4-7"),
  messages,
  tools: { getWeather, searchDocs },
  stopWhen: stepCountIs(8),  // max-turns guard
});
```

That's it. The loop is implicit. `streamText` handles model call,
tool dispatch, message-history append, and re-entry — all the things
you wrote by hand in step 1.8. `stopWhen` is the iteration cap. The
result streams to the browser as it generates. The model can call
tools mid-stream and the SDK splices the tool results into the
continuation.

## What you get for adopting Vercel AI SDK

- **Streaming-first.** Token streaming, tool-call streaming, partial
  response streaming — all built in. If you're building anything
  with a chat UI, this is the single most-correct framework for that
  job.
- **Provider abstraction.** Same code targets OpenAI, Anthropic,
  Google, xAI, Groq, Together, OpenRouter. Swap models with one
  import.
- **React hooks.** `useChat`, `useCompletion`, `useObject`. The
  client side is one hook; the server side is one route handler.
  Two files for a working chat agent.
- **Generative UI.** Tools can return React components, not just
  text. The agent literally renders UI as part of its response.
  Unique to this SDK; pioneered by Vercel and now copied broadly.
- **Edge-runtime compatible.** Runs on Cloudflare Workers, Vercel
  Edge, Deno Deploy. The loop is small enough to fit.

## What you pay for adopting Vercel AI SDK

- **TypeScript-only.** No Python port. If your stack is Python, this
  is not for you. (LangGraph has a JS port; Vercel AI SDK does not
  have a Python port.)
- **Web-shaped assumptions.** It assumes you're returning to a
  client over HTTP. Building a long-running background agent? The
  SDK doesn't fight you, but it's not designed for that case.
- **Tied to model provider APIs.** When OpenAI ships a new
  responses-API shape or Anthropic ships a new content block, you
  wait for an SDK update. Usually fast (Vercel ships weekly), but
  it's a real coupling.
- **Less plumbing for long-tail features.** Multi-agent coordination,
  human-in-the-loop interruption, checkpointing — these exist but
  are thinner than LangGraph's equivalents.

## When Vercel AI SDK is the right call

The decision is dominated by *where the product lives*. Three
profiles:

1. **Next.js or Remix app with a chat interface.** This is the
   killer use case. The SDK was built for exactly this shape. Two
   files, working agent, streamed to the browser.
2. **AI features inside an existing TypeScript product.** A
   "summarize this" button, a "generate variants" sidebar, an
   inline-agent feature. The SDK fits beside the rest of your
   stack instead of being a separate service.
3. **Generative-UI prototypes.** When tools should return React
   components, the SDK is the only mainstream framework that
   handles this well. Useful for product demos and exploration.

## When Vercel AI SDK is the wrong call

- Your backend is Python and you don't want a Node.js service just
  for the agent loop.
- The agent runs for >60 seconds and needs to survive restarts. The
  SDK has no first-class checkpointing.
- You need deep multi-agent coordination. CrewAI or LangGraph fit
  better.

## The takeaway

Framework choice is *downstream of where your product lives*. The
question isn't "which framework is best?" — it's "which framework
disappears into my stack?" LangGraph disappears into Python
backends. Vercel AI SDK disappears into TypeScript web apps. CrewAI
disappears into a "five agents in a writers' room" mental model.
Pick the one your team will fight the least, not the one that's
loudest on X.

If you're not sure which side of the Python/TypeScript line your
product lives on yet, you're framework-free until you are. Write
the loop. Ship the demo. Adopt when the question answers itself.

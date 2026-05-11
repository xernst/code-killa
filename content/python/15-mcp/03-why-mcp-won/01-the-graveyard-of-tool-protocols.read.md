---
xp: 1
estSeconds: 220
concept: graveyard-of-tool-protocols
---

# The graveyard of tool protocols (2023-2024)

By the time MCP showed up in November 2024, the industry had already
tried — and abandoned — several other attempts at "let the model call
your tool." This lesson is mostly prose. The goal isn't to write code;
it's to understand *why* one specific shape won and the others didn't,
so the next time you see a "new universal protocol for X" announcement
you can predict whether it'll stick.

If you skip the history, MCP looks inevitable. It wasn't. Multiple
big companies tried to own this layer and failed. The reasons they
failed are the reasons MCP succeeded, and they generalize beyond AI.

## March 2023: OpenAI Plugins launch

In March 2023, OpenAI launched ChatGPT Plugins. The pitch was: any
service can ship a plugin, ChatGPT users can install them like browser
extensions, and the model can call the service's API when it's
relevant. Expedia for flights. Wolfram for math. Instacart for
groceries. Zapier for the long tail.

For about six weeks, this looked like the future. Every B2B SaaS
company hired someone to "build the plugin." Articles compared it to
the iPhone App Store moment for AI. A small ecosystem formed.

Then it stalled.

## April 2024: the store quietly closes

A year later — April 2024 — OpenAI announced they were sunsetting the
Plugins store. The replacement was "GPTs" and later "ChatGPT Actions,"
both of which were arguably less ambitious. The original cross-app
"any tool can be called by any model" vision quietly died.

Most plugins had been downloaded by fewer than 100 people. The ones
that worked were mostly inside OpenAI's walled garden. The flywheel
never started spinning. Why?

## The fragmented middle: every framework had its own shape

While OpenAI was running the plugin experiment, every agent framework
had its own way to declare "here's a tool the model can call":

- **LangChain** had `Tool` objects and a custom decorator pattern.
- **LlamaIndex** had its own `FunctionTool` shape.
- **CrewAI** rolled its own tool spec.
- **AutoGen** had a different one.
- **OpenAI's own SDK** had function-calling JSON schemas, which were
  the closest thing to a standard — but only worked with OpenAI's
  models.
- **Anthropic's SDK** had a similar-but-not-identical tool-use JSON
  schema, which only worked with Claude.

The result was that a tool author had to write the same integration
six different ways for six different audiences. Nobody wanted to do
that, so most tools got integrated for one framework and the others
went without.

The whole space looked like the early-2000s mobile web, where every
phone OS had its own browser and developers had to choose one. That
era ended only when WebKit ate everything. Until something analogous
happened here, "AI tool integration" was going to stay a mess.

## Why this graveyard matters

Three things to take from this:

- **Protocols don't win on technical merit; they win on adoption
  asymmetry.** OpenAI Plugins worked fine technically. They lost
  because nobody outside ChatGPT could use them.
- **Fragmentation is the default state of any new ecosystem.** You
  should *expect* six competing standards before one wins. The
  question is which one has the right adoption profile.
- **The pattern repeats.** Every layer of the stack — model APIs,
  agent frameworks, evals, retrieval — has its own version of this
  fragmentation phase. Watch for the standardizer.

In the next step we look at what specifically OpenAI Plugins got
wrong — three concrete failure modes you can use as a checklist on
any future "protocol" launch.

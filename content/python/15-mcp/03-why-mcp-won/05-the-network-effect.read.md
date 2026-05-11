---
xp: 1
estSeconds: 220
concept: mcp-network-effect
---

# The network effect (six months that hardened the flywheel)

The MCP spec landed in November 2024. By mid-2025 it was the default
across the major AI coding tools. That's a fast turn for a protocol,
and it happened because adoption hit a tipping point most protocols
never reach.

## The four adopters that mattered

Four client adoptions, in order, locked the flywheel:

1. **Cursor** — by late 2024 / early 2025, Cursor shipped MCP support.
   This was the first major adopter outside Anthropic's own products,
   and it mattered because Cursor was the fastest-growing AI coding
   tool. Millions of developers suddenly had MCP in their default
   tool.
2. **Zed** — the Rust-based editor with a small-but-influential
   developer audience added MCP early. Zed's adoption signaled that
   MCP wasn't just a "Cursor + Claude" thing.
3. **VS Code (via GitHub Copilot Chat and other extensions)** — once
   VS Code-side support shipped, you had the dominant editor in the
   world speaking the protocol. That's not a niche client anymore;
   that's the default development environment for tens of millions
   of engineers.
4. **Claude Code** — Anthropic's own terminal/IDE agent (the thing
   you're often hearing about as "the coding agent that uses Claude")
   was MCP-native from day one. Inside Claude Code, *every* tool the
   agent calls — filesystem reads, git commands, web fetch — is an
   MCP server.

Once those four clients were all speaking the same protocol, the
math for tool authors flipped completely.

## The flipped equation

Before the network effect, a tool author had to decide: do I write
an integration for Cursor, or Claude Code, or VS Code, or... five
others? Each integration was a separate codebase. The math said
"pick one or two."

After the network effect, a tool author wrote *one* MCP server and
it worked everywhere. Cursor, Claude Code, Zed, VS Code, Continue,
and any future MCP client picked it up automatically.

The math flipped from "pick one client, ignore the rest" to "write
the MCP server first; everything else is downstream." That's the
moment a protocol stops being a "good idea" and becomes the only
sane choice for new work.

## The pattern in detail

If you watch the flywheel turn, it has three phases:

**Phase 1: a few servers exist.** The official servers (filesystem,
git, Postgres) plus a handful of motivated early adopters. A few
hundred servers total. Useful, but not load-bearing.

**Phase 2: clients adopt.** Cursor, Zed, VS Code, Claude Code all
ship MCP support. Now any new server you write reaches millions of
developers across multiple tools, with zero per-client work.

**Phase 3: every new tool ships an MCP server FIRST.** This is the
hardening moment. When the default move for a new SaaS is "we ship
an MCP server on launch day," the protocol has won. By mid-2025,
launches from Linear, Sentry, Vercel, Cloudflare, Browserbase, and
dozens of others followed this pattern. The MCP server wasn't a
v2 nice-to-have; it was a v1 must-have.

Once you're in phase 3, the next round of clients HAS to adopt MCP
just to access the existing ecosystem. ChatGPT itself added MCP
support. The OpenAI SDK added MCP support. Vercel's AI SDK added
MCP support. The protocol Anthropic shipped became the protocol
their competitors had to speak to stay relevant.

## Why this is hard to compete with

Imagine you're a new AI lab in 2026 and you don't like MCP. You
want to ship your own protocol. The problem is:

- Every existing tool author has written MCP, not your protocol.
- Every existing client speaks MCP, not your protocol.
- A developer choosing between "use the existing 1,000 MCP servers"
  and "wait for the ecosystem to write your-protocol servers" picks
  MCP every time.

The only way to compete is to either (a) be the dominant client and
force adopters to your protocol — which OpenAI tried to do with
Plugins and couldn't pull off — or (b) speak MCP yourself and try to
extend it. Everyone is currently picking (b).

## The lesson that generalizes

The protocol that wins isn't the protocol with the best spec. It's
the protocol that hits four client adoptions fast enough to flip the
tool-author math. Four well-chosen clients with combined audiences
in the tens of millions is the threshold.

When you hear "new protocol announced" in any domain — payments,
identity, agentic communication, RAG, evals — the question to ask is:
**how many independent clients have adopted it, and what's the
combined user base?** Under that threshold, it's a blog post. Over
it, it's a standard.

In the next step you pick which of four product ideas is the
strongest "MCP server as wedge" play. Knowing how the flywheel turned
is half the answer.

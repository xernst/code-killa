---
xp: 1
estSeconds: 220
concept: the-mcp-bet
---

# The MCP bet (November 2024)

Eight months after OpenAI Plugins quietly closed, Anthropic announced
the Model Context Protocol. The announcement was unusually low-key for
something this consequential — a blog post, an open-source spec, and
a handful of reference servers (filesystem, git, Postgres). No fanfare,
no marketplace, no app store.

The technical contents looked modest. JSON-RPC 2.0 over stdio or
HTTP. Three primitives (tools, resources, prompts). A discovery
method (`tools/list`) and a call method (`tools/call`). You already
saw all of this in lessons 01 and 02.

The strategic contents looked more interesting. Anthropic had
deliberately structured MCP to invert every one of the three plugin
failure modes:

## Inversion 1: open spec, not closed ecosystem

The spec was published on day one, MIT-licensed, with reference
implementations in Python and TypeScript. *Anyone* could write a
host. *Anyone* could write a server. The spec was small enough
(a few dozen pages) to fit in a normal engineer's head, and the
JSON-RPC wire format was already battle-tested across the industry.

This was the move OpenAI couldn't make — they had business reasons
to keep plugins inside ChatGPT. Anthropic was further from the
distribution game and could afford to commoditize the protocol
layer.

The chapter has already used the framing once: **"USB-C for AI
agents."** That phrase is doing a lot of work — USB-C succeeded as a
standard for exactly the same reason. It was open, the bar to ship
a peripheral was low, and the discovery model was "plug it in."
MCP is the same shape applied to AI tooling.

## Inversion 2: low publisher bar

A minimum-viable MCP server is one Python file. A few dozen lines.
You declare a tool, write a function, and the SDK handles the
JSON-RPC plumbing. There is no manifest hosting, no OAuth
requirement, no marketplace review, no listing process.

Compare that to the Plugin checklist from the previous step. The
publisher bar went from "real production infrastructure plus auth
plus review" down to "a single file in a repo." That difference is
what unlocks the long tail.

A few months in, the long tail was already showing up: people had
written MCP servers for their own Notion workspaces, their internal
Jira boards, their home automation, their private wikis, niche
databases, weather APIs, and dozens of one-off internal tools.
Almost none of these would have been viable as OpenAI Plugins.

## Inversion 3: primitive, not marketplace

There is no MCP store. There never was. The way you "install" an
MCP server is by editing your agent's config file:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/josh"]
    }
  }
}
```

Two lines of config. No browsing. No "install this plugin." The
developer wires up the tool, the agent uses it automatically.

That changes who the protocol is optimized for. OpenAI Plugins were
optimized for end users browsing a store. MCP is optimized for
developers wiring up agents. The developer is the actor that
actually decides which tools an agent has, so this is the right
optimization.

## What Anthropic was betting on

Anthropic's bet, implicit in all of this, was: **the value of an
open protocol exceeds the value of owning the integration layer.**
Even though they could have built their own walled-garden integration
system (the way OpenAI did with Plugins), they shipped a protocol
that any competitor could adopt.

That's not altruism. It's strategy. By open-sourcing the protocol,
Anthropic ensured that *every* AI app that integrated MCP made every
*other* MCP-speaking app more useful. The network effects would
compound faster than any one walled garden could.

Then, the bet had to be validated. A protocol with no adopters is
just a blog post. What made MCP win wasn't the spec — it was the
six months after.

That's the next step.

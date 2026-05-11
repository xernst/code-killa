---
xp: 1
estSeconds: 220
concept: plugins-failure-modes
---

# What OpenAI Plugins got wrong (three failure modes)

OpenAI Plugins were a genuinely thoughtful attempt at the problem.
They had a manifest format, an auth story, a discovery mechanism, and
backing from the dominant AI company. They still didn't work. Three
reasons matter, and you should memorize them — they're a generic
checklist for predicting whether *any* future protocol will stick.

## Failure mode 1: closed ecosystem

A Plugin written for ChatGPT only worked inside ChatGPT.

Not inside Claude. Not inside a developer's own agent. Not inside
Cursor or Zed or anywhere else. If you spent two weeks building the
Expedia plugin, the only humans who could ever use it were ChatGPT
users on the specific plan tier that had plugins enabled.

Compare that to writing an iOS app. An iOS app runs on iPhone, iPad,
Mac, and Apple Watch — four surfaces with hundreds of millions of
combined users. The investment compounds.

A ChatGPT plugin compounded against exactly one surface. And that
surface controlled discovery, deprecated your work whenever it wanted,
and competed with you (the model itself could just learn to do what
your plugin did and route around you).

**The general rule:** when a "protocol" only works inside one
company's product, it isn't a protocol. It's a feature with a public
API. Investments against features-with-public-APIs decay fast.

## Failure mode 2: too high a bar for the publisher

To ship a plugin, you needed to:

- Host a publicly-reachable manifest file at a well-known URL.
- Implement OAuth (or one of three other auth flows) against your
  service.
- Write an OpenAPI spec for the subset of your API you were
  exposing.
- Get reviewed and listed in OpenAI's plugin directory.
- Maintain it as ChatGPT changed under you.

For Expedia and Instacart, this was fine — they had teams. For an
indie dev who wanted to expose their tool to AI agents, this was a
multi-week project, and the upside was access to one surface with no
proof of distribution.

A protocol succeeds when the *easiest* thing to ship is a server.
The Plugin spec made shipping a server one of the harder things.

**The general rule:** if the publisher bar is "real production
infrastructure plus auth plus marketplace review," you've already
lost the long tail. Long tail is where the surprising and load-bearing
integrations come from. (Almost everyone who ships an MCP server
today would never have shipped an OpenAI Plugin.)

## Failure mode 3: discovery was a marketplace, not a primitive

This is the subtle one. The Plugin model assumed users would *browse
a store* to find plugins, like apps. They didn't. Most users never
went to the plugin store. The ones who did installed two or three
plugins, none of which they used regularly, and then forgot about
them.

Compare that to how tools actually get used in modern AI agents:
the *developer* configures which tools the agent has access to, and
the *agent* uses them automatically based on the task. There is no
"user browsing." The tool is a primitive the developer wires up.

By making discovery a marketplace, OpenAI built the wrong UX. The
right UX is "list this server in my agent's config file." That's a
two-line config change, not a shopping trip.

**The general rule:** if your protocol assumes end users will browse
a catalog, you've optimized for the wrong actor. The actor who decides
whether a tool gets adopted is the developer wiring up the agent,
not the end user.

## The pattern across all three

All three failure modes share one root: **OpenAI tried to own the
distribution.** Closed ecosystem, high publisher bar, marketplace
gatekeeping — those are all moves a company makes when it wants to
capture the value of an ecosystem rather than enable one.

The protocol that won (spoiler: MCP) inverted every one of those.
Open spec, low publisher bar, primitive-not-marketplace. That's why
it stuck.

Next step is a multiple-choice drill: given four hypothetical new
protocols, can you predict which ones will fail by the same pattern?

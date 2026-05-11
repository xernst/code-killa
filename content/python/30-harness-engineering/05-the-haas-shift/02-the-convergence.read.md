---
xp: 1
estSeconds: 220
concept: harness-convergence
---

# Top coding agents look more like each other than their underlying models do

This is one of Osmani's sharpest observations in *Agent Harness Engineering*: as of mid-2026, the leading coding agents — Claude Code, Cursor, Codex CLI, Aider, Cline — have converged on a remarkably similar harness shape. They differ on UI, vendor, language stack. The harness *primitives* are nearly identical.

This convergence is a signal. When five independent teams, building on different models with different budgets, arrive at the same architecture, that architecture is probably load-bearing.

## The shape everyone has converged to

Walk the six pieces from lesson 01 and map each tool:

### Config (CLAUDE.md hierarchy)

- **Claude Code**: CLAUDE.md (project) + ~/.claude/CLAUDE.md (user) + .claude/CLAUDE.md (per-directory).
- **Codex CLI**: AGENTS.md (project) + ~/.codex/AGENTS.md.
- **Cursor**: `.cursor/rules/*.md` (project) + Settings (user).
- **Cline**: `.clinerules` + project memory.
- **Aider**: `CONVENTIONS.md` + `--read` flags.

Five different filenames; same pattern — a markdown file that gets injected into every system prompt, with per-project and per-user layering.

### Tools

All five offer the same core set: filesystem read/write/edit, bash execution, web fetch, code search. The differences are at the margins (Cursor's diff-application is slicker; Aider's repo-map is more elaborate; Claude Code's Task tool is more powerful for subagents).

Plus all five now support MCP servers as a first-class extensibility surface. Five years ago, "extensibility" meant rolling your own plugin system. Now it means writing an MCP server.

### Bundled infrastructure

- **Sandboxing** — Claude Code and Codex CLI both offer sandbox configs (filesystem sandboxes, command allowlists). Cursor relies on the OS / IDE. Cline has plan mode. Aider is the least sandboxed (it expects the user to be careful).
- **Headless browser** — All five support either an integrated browser tool or an MCP-bridged one (BrowserBase, Vercel agent-browser, Playwright MCP).

### Orchestration

- **Subagents** — Claude Code's Task tool, Cursor's background agents, Cline's plan mode. Different names; same primitive (a child agent with its own context window).
- **Plan/execute split** — Claude Code Plan Mode, Cursor Composer's plan view, Cline's PLAN/ACT toggle. All three have a visible plan-then-execute mechanic.

### Hooks

- **Claude Code** — PreToolUse, PostToolUse, Stop, etc. The most-developed hooks system.
- **Cursor** — diagnostics integration (post-edit hooks via the IDE).
- **Codex CLI** — pre-tool guards configurable in AGENTS.md.
- **Aider** — `--auto-test` flag is a primitive post-commit hook.

Different polish levels, same underlying lifecycle vocabulary.

### Observability

All five log sessions to disk. Three (Claude Code, Cursor, Cline) ship some kind of trace viewer. Eval rigs are still mostly external (HumanEval, SWE-Bench, Terminal Bench 2.0).

## Why the convergence happened

Three forces pushing five independent teams to the same answer:

1. **The post-training feedback loop.** Anthropic post-trains Claude on Claude Code's harness shape. OpenAI does the same with Codex. The models *expect* a particular harness now. Building a different shape means fighting the training distribution.
2. **The failure modes are the same across teams.** Every team that runs agents in production hits the same wall: context rot, premature stopping, destructive commands. The fixes (compaction, completion guards, pre-tool hooks) are the same fixes regardless of which lab's model you're running.
3. **Engineers talk to each other.** The harness-engineering discourse on X / Substack / blogs is incestuous. Dexter Horthy's *12-factor agents*, Osmani's posts, HumanLayer's writeups, Trivedy's tweets — they cross-reference constantly. Good ideas spread within weeks.

## What the convergence tells you

Two practical implications:

- **The patterns are durable.** The six pieces, the four reflexes, the three context-mitigations, the three long-horizon fixes — none of these are likely to be obsoleted by a model release. They're load-bearing patterns; they will probably still be load-bearing in 2027.
- **The differentiation is in execution, not architecture.** You don't win by inventing a sixth long-horizon pattern. You win by doing the five well. The 28-place jump on Terminal Bench between two harnesses running the same model isn't because one had a clever new pattern; it's because one *did the standard patterns better*.

## Where the convergence doesn't reach

Two areas where teams still diverge meaningfully:

- **The specific tools.** A coding agent for embedded developers needs different tools than a coding agent for web developers. Tool *shape* converges (filesystem + bash + edit). Tool *content* diverges.
- **The eval rig.** Every team's eval suite is bespoke. There is no convergence here. SWE-Bench is the closest to a standard; even it doesn't cover most real workflows.

The first divergence is healthy (specialization). The second is a gap the industry hasn't closed.

## What's next

A multiple choice on picking the right HaaS runtime for four scenarios. Then the *harnesses don't shrink, they move* reading — the framing that explains why convergence isn't stasis. Then the overfitting reading, MCP security, the picks-what-component-is-debt drill, and the two write steps.

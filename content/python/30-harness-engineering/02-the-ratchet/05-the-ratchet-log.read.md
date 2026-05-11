---
xp: 1
estSeconds: 220
concept: ratchet-log-structure
---

# The append-only log that keeps your harness honest

The ratchet log is the artifact. It's a flat file (or a database row, or a YAML block — the format barely matters) that records every harness rule with the failure it earned itself against. Each entry has the same five fields:

```
- date: 2026-04-02
  failure: "Agent ran `git push --force` to main, bypassing CI on prod."
  rule: "Never run `git push --force`. Use `--force-with-lease`, and only on feature branches."
  artifact: "AGENTS.md line 23 + pre-tool hook in .claude/hooks/pre-bash.sh"
  remove_when: "Anthropic ships native force-push protection in tool definitions"
```

Five fields. None of them is optional. Here's why each one earns its place.

## The five fields

### `date`

Anchors the entry in time. Two reasons this matters:

- **Audit trail.** Six months later you can find the session where the failure happened. Combined with observability (lesson 1, piece 6), you can replay it.
- **Removal eligibility.** Some rules age out. A rule from 2024 that says "always specify model temperature" is now irrelevant — most current SDKs default reasonably. The date tells you when to re-audit.

### `failure`

The specific, narrated event. Not "general unsafety." Not "test problems." The actual thing that went wrong, in a sentence. Specificity is the entire point.

If you can't write a specific sentence, the rule probably didn't earn its place. Go reproduce the failure first. (Or accept that this rule is cargo-cult and shouldn't be added.)

### `rule`

The text you're adding to the harness — to AGENTS.md, to a hook, to a subagent prompt, to a skill file. Phrase it as an action: what the model must or must not do. Avoid vibes adjectives ("be careful"). Specify strings, commands, file paths.

### `artifact`

Where the rule lives. Three options, often combined:

- **Text rule** — added to AGENTS.md / CLAUDE.md / skill file.
- **Hook** — pre-tool / post-tool / pre-commit shell script that enforces the rule at runtime.
- **Subagent** — a reviewer / evaluator agent that scans for the failure pattern.

Most production ratchet entries land in *two* of these (text + hook, or text + subagent). The text is the explanation; the enforcement is the enforcement.

### `remove_when`

The single most-skipped field. Most teams write ratchet rules and then never audit them. `remove_when` forces you to write down the *exit condition* the day you add the rule. Examples:

- "Model is post-trained to never disable failing tests" (verifiable via an eval)
- "Project-wide Tailwind enforcement is added at lint level" (verifiable by running the linter)
- "Anthropic ships the Edit tool with built-in `tsc` integration" (verifiable from SDK release notes)

If `remove_when` is empty, the rule is permanent. Permanent rules are debt. Force yourself to write one even if it feels speculative.

## Where the log lives

Three options, all valid, none clearly best:

- **A flat markdown file** at `.harness/ratchet-log.md` in the repo. Versioned, diffable, human-readable. Simplest. What most teams should start with.
- **A YAML or JSON file** at `.harness/ratchet-log.yaml`. Parseable by scripts. Easier to filter, count, audit programmatically. What this lesson's drills use.
- **A row in your observability backend.** Slightly fancier; useful when you have many harness deployments to manage.

Start with markdown. Move to YAML when you have more than ~20 rules.

## Two real-world examples

### Example 1 — Cursor inline edit drift

```
- date: 2026-02-20
  failure: "Cursor agent kept switching from Tailwind classes to inline styles in PR #1893 even though the rest of the codebase is Tailwind."
  rule: "Always use Tailwind classes. Never use inline `style={...}` attributes."
  artifact: ".cursorrules line 12; ESLint rule `react/forbid-component-props` enabled"
  remove_when: "ESLint rule alone catches 100% of inline-style commits over 30 days"
```

The ESLint rule is the real enforcement. The `.cursorrules` line is the explanation for the model so it doesn't generate the violation in the first place.

### Example 2 — Codex CLI test disabling

```
- date: 2026-03-15
  failure: "Codex agent commented out a failing CartTest in PR #842 with comment 'disabling temporarily'."
  rule: "Never comment out, skip, or otherwise disable a failing test. If the test is wrong, delete it with justification. If the test is right, fix the code."
  artifact: "AGENTS.md section 4; pre-commit hook that greps for `.skip(` and `disabled=true`; reviewer subagent"
  remove_when: "Empirical eval shows 30 consecutive sessions with no test-disabling pattern"
```

This is the Osmani anecdote operationalized. Four-way enforcement: rule, hook, subagent, eval. The `remove_when` is the eval result, not a calendar date.

## Why this log compounds

A ratchet log is a knowledge artifact in the same shape as a Karpathy-style learning wiki, an FAA incident report, a postmortem repo. Three properties make it compound:

1. **Append-only.** Entries are added, almost never edited. New observations earn new entries; old observations stay as written.
2. **Removable, but only with evidence.** Rules can be removed, but the removal itself becomes a log entry. "Removed 2026-08-15: model handles this natively, see eval run #1247."
3. **Auditable on a cadence.** Quarterly, walk the log. Count rules. Note which `remove_when` conditions are close to being true. Retire what's retire-able.

The team that does this for two years has a harness that *improves* every quarter, regardless of which model they're running. The team that doesn't has the same harness on year two, mostly cargo-culted, mostly attention tax.

## What's next

Now the spot-the-cruft drill — given four AGENTS.md lines, which one to retire. Then the two write drills: append a new entry, audit which to remove. Then the checkpoint stitches both into one workflow.

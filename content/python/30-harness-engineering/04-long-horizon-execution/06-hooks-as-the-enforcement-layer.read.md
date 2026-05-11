---
xp: 1
estSeconds: 240
concept: hooks-as-enforcement
---

# Rules are advisory; hooks are enforcement

Lesson 02 was about the ratchet — turning failures into rules. But rules in AGENTS.md / CLAUDE.md are *advisory*. The model can read them and still ignore them, especially under context rot. The enforcement layer that makes rules stick at runtime is **hooks**.

A hook is a piece of code that runs at a specific lifecycle event in the harness, wraps the model's tool calls or completions, and can:

- **Block** the action before it runs (pre-lifecycle).
- **Modify** the inputs to the action.
- **Run a check** after the action and surface failures back to the model.
- **Trigger** a follow-up action (run tsc, run tests, post to Slack).

Hooks are the bridge between "we have a rule" and "the rule is enforced." Without hooks, the rule is a suggestion. With hooks, the rule is a constraint.

## The four hook lifecycles

The vocabulary every modern harness shares:

### Pre-tool

Runs *before* the harness dispatches a tool call. Examples:

- **Block destructive commands.** Pre-bash hook greps the command for `rm -rf`, `git push --force`, `DROP TABLE`. Blocks with a refusal message; the model gets the refusal back in context and chooses a safer path.
- **Inject context.** A pre-edit hook might add "remember: this file has a license header that must stay intact" to the model's view of the file being edited.
- **Validate inputs.** Pre-tool hook checks that the tool's arguments match an expected schema (Pydantic, JSONSchema). Catches typos before they reach the tool runner.

Claude Code's PreToolUse hook is the canonical implementation. Its decision values include "approve / block / ask user."

### Post-tool / Post-edit

Runs *after* a tool call. Examples:

- **Run typecheck on every TypeScript edit.** Post-edit hook calls `tsc --noEmit`. If errors, inject them into the next model turn.
- **Run formatter.** Post-write hook runs `prettier --write` or `black`. Silent on success, error on failure.
- **Log to observability.** Post-tool hook writes the tool call + result to a trace.

This is the most-used lifecycle in production. Most harness "magic" lives here.

### Pre-commit / Pre-merge

Runs before the agent declares the work complete. Examples:

- **Run the test suite.** Pre-commit hook runs `pytest -q`; on failure, the model gets the failures back and another turn to fix.
- **Run the linter.** Pre-commit hook runs `eslint`, `ruff check`, whatever applies.
- **Block forbidden patterns.** Pre-commit hook greps the diff for `.skip(`, `TODO`, `FIXME`, anything the team has declared a blocker.

This is where the ratchet log's "rule" entries get teeth. If AGENTS.md says "never skip a failing test," a pre-commit hook makes "never" enforceable.

### Stop / On-completion

Runs when the model emits `end_turn` with what it thinks is a final answer. Examples:

- **The completion guard.** Pre-stop hook checks `goal_met()`; if no, re-enters the loop.
- **Send a summary.** On-completion hook writes a session summary to Obsidian or Slack.
- **Trigger an evaluator.** On-completion hook spawns the evaluator agent (lesson 04) to grade the final output.

Stop hooks are how the harness *takes back control* from the model's helpful-completion bias.

## "Success is silent, failures are verbose"

Osmani's rule for hook design, paraphrased: **on success, the hook adds nothing to context. On failure, the hook adds everything the model needs to recover.**

The reason matters: hooks fire on every relevant tool call. If they were noisy on success, they'd consume context on every turn. By making them silent on success, the cost is approximately zero when everything's working. The cost only shows up when something's broken — which is exactly when you want it.

Concretely:

```
[post-edit] ran tsc                         <- silent, nothing added to context
[post-edit] tsc failed:                     <- failure, full output added
src/auth.ts:42:3 — Property 'user' does not exist on type 'Request'.
src/auth.ts:67:5 — Object is possibly null.
```

The model sees nothing when the hook passes. When the hook fails, it sees the precise errors and can fix them on the next turn. This is *backpressure* — automated correction without human intervention.

## Hooks as the enforcement of the three long-horizon patterns

- **Loops with completion guards** → Stop hook checks `goal_met()`, re-enters on failure.
- **Planner/executor split** → Pre-tool hook checks "is this step in the current plan?"; post-step hook verifies the step's acceptance criterion.
- **Generator/evaluator split** → On-completion hook spawns the evaluator agent; evaluator's verdict feeds back via the loop.

All three patterns from earlier in this lesson are *operationalized* through hooks. Without hooks, the patterns are aspirational. With hooks, they're enforced.

## What real harnesses look like

Three production examples:

- **Claude Code hooks** — PreToolUse, PostToolUse, Stop, SessionStart, UserPromptSubmit, and more. Configurable via JSON. The canonical implementation.
- **Cursor diagnostics** — post-edit hooks that surface TypeScript errors back into the model's context on the next turn.
- **Codex CLI's AGENTS.md guidance** — explicit recommendations for pre-tool guards on destructive operations.

The convergence is real: hooks-as-enforcement is now table stakes for any agent harness aimed at production work.

## What's next

The next step is the type-check backpressure pattern as a concrete worked example. Then two write steps: one routes actions to hook lifecycles, one decides whether to continue the loop. The checkpoint stitches the long-horizon harness audit.

---
xp: 1
estSeconds: 150
concept: first-codex-session
---

# Start it, instruct it

You did this once with the Claude CLI. Same moves for Codex.

Make a fresh practice folder, step into it, and start Codex:

```
mkdir codex-practice
cd codex-practice
codex
```

`mkdir` and `cd` are your terminal skills. `codex` on its own starts a
session right here in `codex-practice`. That folder is now Codex's
world for the session: empty, safe, yours.

Codex shows you its own prompt, waiting for an instruction. It looks a
little different from the Claude CLI's, but the idea is identical: it's
ready, and nothing happens until you type something and press enter.
To leave the session later, you type `/exit` or press `Ctrl` and `C`,
the same exits you already know.

## Give it a real first instruction

In the Codex session, type a plain-English instruction and press
enter. Use one that's small, concrete, and easy to check:

```
Create a file called toolkit.txt with two lines: one line naming a
task I'd use the Claude CLI for, and one naming a task I'd use Codex
for.
```

That's it. No code, no flags. A sentence describing the outcome,
exactly like briefing a coworker, exactly like the Claude CLI. The
briefing skill you've been building does not reset between tools.

Worst case, you don't like the file and you delete it with
`rm toolkit.txt`. Press enter on your instruction and watch what Codex
does. The next step walks through it, and it should feel familiar.

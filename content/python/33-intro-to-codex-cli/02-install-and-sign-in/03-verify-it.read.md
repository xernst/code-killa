---
xp: 1
estSeconds: 135
concept: installing-codex
---

# Confirm it's really there

Same move you used for the Claude CLI. Don't trust "no error message."
Check directly. In your terminal, type:

```
codex --version
```

If the install worked, this prints a version number and quits. A
version number is the whole confirmation: Codex is installed and your
terminal can find it.

## If it says command not found

If `codex --version` prints `command not found: codex`, run the same
playbook you learned for the Claude CLI:

1. **Close the terminal window completely and open a fresh one.** A
   terminal only learns about new commands when it starts. A window
   that was open during the install hasn't noticed `codex` yet. This
   fixes it most of the time. Run `codex --version` again in the new
   window.
2. **If a fresh window still fails,** the install didn't fully land.
   Re-run the install command for your path (the `brew` line or the
   `npm i -g @openai/codex` line). Watch its output this time for any
   line that actually says "error."
3. **If you took the npm path and it still fails,** double-check Node:
   run `node --version`. If that's missing too, Node didn't install,
   and that's the thing to fix first.

Notice the pattern: the troubleshooting is the same as the Claude CLI's,
because the underlying issue is the same one (a terminal not yet aware
of a new command). Skills you build in one tool keep paying off in the
next. That's the whole reason the second tool is cheap to learn.

Once `codex --version` prints a number, you're installed. Next: signing
in.

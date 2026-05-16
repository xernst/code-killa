---
xp: 1
estSeconds: 150
concept: signing-in-codex
---

# Sign in with your ChatGPT account

Codex is installed but doesn't know who you are yet. Same as the Claude
CLI, it needs you to sign in once. Type:

```
codex login
```

Your browser opens to an OpenAI sign-in page. You sign in with your
**ChatGPT account**, the same login you'd use at chatgpt.com. If you
don't have one, the page lets you create one; a free account is enough
to sign in. You approve the CLI's access, the page tells you it's done,
and you go back to the terminal signed in.

You can also just run `codex` to start, and on a first run with no
sign-in it walks you into the same flow. Either way lands in the same
place.

## If the browser step won't work

Sometimes the browser sign-in can't run, most often when you're working
on a machine with no browser, like a remote server. For that case Codex
has a fallback:

```
codex login --device-auth
```

This prints a short code and a web address. You open that address on
any device that does have a browser, type in the code, and the CLI
gets signed in that way. You probably won't need this on your own
laptop, but it's good to know the escape hatch exists.

## Same shape as before

Notice this is the Claude CLI sign-in again with the labels swapped. A
browser opens, you prove who you are on a page you trust, you approve,
the CLI gets a token and saves it, and it stops asking. You learned why
that token-not-password design is the safe one back in the Claude
chapter, and it's true here too. Run `codex login` now and finish the
browser step.

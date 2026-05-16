---
xp: 1
estSeconds: 135
concept: account-vs-api-key
---

# Account or API key, again

Codex, like the Claude CLI, gives you two ways to sign in, and the
choice is the same one you already learned.

## ChatGPT account (what you just did)

You, a human, at your own machine. You sign in through the browser with
your ChatGPT account, and your existing plan covers normal interactive
use. This is your path for everything in this course. If a person is
sitting at the terminal, this is the answer.

## API key

Codex also accepts an **API key**, a single long secret string that
stands in for the browser sign-in. With Codex, you'd typically set it
as a value called `OPENAI_API_KEY`.

It's the same story as the Claude CLI's API key. The key is for
situations with no human present to click anything: a program on a
server, an automated job in a pipeline, a tool calling Codex on its
own. It also bills differently, by usage against a developer account,
which suits unattended jobs and not a person learning at a terminal.

## The rule, unchanged

Human at the keyboard, use the account sign-in. Program running
unattended, that's when an API key earns its place. You're a human at
the keyboard. The account sign-in you just did is correct.

This is the second time you've seen this exact choice, once per tool.
That's the point of seeing it twice: "account for humans, API key for
unattended programs" is not a Claude rule or an OpenAI rule. It's how
these tools work in general. Chapter 18 covers handling keys like
`OPENAI_API_KEY` safely once you reach automated jobs.

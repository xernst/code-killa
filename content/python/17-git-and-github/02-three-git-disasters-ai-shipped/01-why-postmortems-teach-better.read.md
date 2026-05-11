---
xp: 1
estSeconds: 200
concept: fear-based-learning-for-git
---

# Drills teach the keystrokes. Postmortems teach the why.

The previous lesson taught you the three-state model and `git add -p`.
You can run the commands. You probably can't yet feel them in your
gut. That's the difference between a 200-hour engineer and a 2,000-hour
one — not more commands, but a stronger sense of *what goes wrong if
I get this slightly off*.

There's exactly one efficient way to build that sense: read the
breaches. Look at the actual incident reports. Watch what got
rotated, who got fired, how the public found out. Then go back to
your terminal and you will type `git add` differently for the rest
of your career.

## Why postmortems beat drills for this material

Drills teach you the **mechanics** of a tool. Postmortems teach you
**why the tool exists**.

You can drill `git add -p` for an hour and walk away thinking it's
a slightly more selective version of `git add .`. Read one
postmortem about a public repo with a developer's AWS access keys
in the third commit, and `git add -p` becomes the only sane way
to stage changes for the rest of your life. The drill teaches you
HOW. The postmortem teaches you WHY YOU WOULD BOTHER.

This is the same reason aviation training is built around incident
reports. Pilots don't drill landing gear extension on a checklist
and call it done. They read the NTSB writeups of crashes where
landing gear wasn't extended. The mechanics are 5% of the
training. The mental model — *this is how careers and lives
actually end* — is the other 95%.

## The three disasters we'll walk through

Three real incidents, all from the AI era (2022 onward), all
involving git or AI-assisted commits in some way:

1. **Uber 2022 — credentials committed to a private repo.** A
   contractor's AWS access keys ended up in a repository.
   Attackers got into the repo via a separate breach and looted
   the keys. Not an AI mistake, but the canonical example of
   "secret in version control" — the failure mode every AI
   coding assistant is one careless `git add .` away from
   reproducing.

2. **Samsung 2023 — engineers pasting source into ChatGPT.** Three
   incidents inside a few weeks where Samsung Semiconductor
   engineers pasted proprietary source code and meeting notes
   into ChatGPT to get help. The data left the company
   perimeter the moment the paste happened. Samsung banned
   internal ChatGPT use and accelerated its own internal tool.

3. **The 2024-onward `git add .` agent default.** Cursor, Claude
   Code, and other AI coding agents default to staging everything
   and committing without showing you the diff first. Multiple
   public OSS repos have shipped `.env` files, AWS keys, and API
   tokens this way. GitGuardian's 2024 secrets report counted
   over 23 million leaked credentials on public GitHub — a chunk
   of them attributable to agent-driven commits.

## What you'll do with these

After reading each one, you'll answer one question: **which
control would have caught this earliest in the chain?** Not "what
should have happened in some ideal world" — what specific
mechanical control (a pre-commit hook, an env-var-only rule,
mandatory review, a config flag) would have stopped the leak
before it left your laptop.

The point isn't to memorize the breaches. The point is to build a
mental checklist you run silently every time an AI agent says
"committed and pushed."

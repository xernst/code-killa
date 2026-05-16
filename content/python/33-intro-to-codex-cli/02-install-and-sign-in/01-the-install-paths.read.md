---
xp: 1
estSeconds: 165
concept: installing-codex
---

# Two install paths, pick yours

Installing the Codex CLI means getting the program onto your machine
where the terminal can find it. There are two routes. Which one is
easier depends on your computer.

## On a Mac: Homebrew (easiest if you have it)

Homebrew is a popular tool for installing software on a Mac from the
terminal. If you already have it, this one line installs Codex:

```
brew install --cask codex
```

If `brew` gives you a "command not found", you don't have Homebrew, and
you can either install it (one command, from brew.sh) or use the npm
route below instead. Don't agonize over it. The npm route works on
every machine.

## Any machine: npm

The other route uses **npm**, which is a tool that comes bundled with
**Node.js**. Node is a separate program. Once Node is installed, this
line installs Codex:

```
npm i -g @openai/codex
```

The `-g` means "install it for the whole machine" so you can run
`codex` from any folder.

## The Node question

Here's the one honest wrinkle compared to the Claude CLI. The Claude
CLI had a one-line installer that needed nothing first. The npm route
for Codex needs Node.js to already be on your machine.

So before the npm command works, you may have a one-time setup step:
install Node. It's genuinely small, the next step covers it, and if
you're on a Mac with Homebrew you can skip the whole thing. Just go in
knowing the Codex install has one possible extra part. That's the
"slightly heavier install" the last lesson warned you about. It's the
biggest practical difference between the two tools, and it's still
minor.

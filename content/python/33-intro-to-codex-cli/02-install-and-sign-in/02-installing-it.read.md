---
xp: 1
estSeconds: 180
concept: installing-codex
---

# Do the install

Follow the path that matches your machine. Either one ends with Codex
installed.

## Path A: Homebrew (Mac, if you have brew)

One command, in your terminal:

```
brew install --cask codex
```

It downloads and sets up Codex. When it finishes, skip ahead to the
next step to verify it.

## Path B: npm (any machine)

First, check whether you already have Node. Type:

```
node --version
```

If that prints a version number that's 18 or higher, you have Node.
Skip straight to the install command at the bottom of this step.

If it says `command not found`, you need Node first. Get it the simple
way:

- Go to **nodejs.org** in your browser.
- Download the version it offers you (the page detects your operating
  system). Take the one labeled "LTS", which means the stable one.
- Run the downloaded installer the way you'd install any app: open it,
  click through, accept the defaults.
- Close your terminal, open a fresh one, and run `node --version`
  again. You should see a version number now.

Installing Node is a normal app install with an installer window. It
is not a terminal puzzle. Once `node --version` prints a number,
install Codex:

```
npm i -g @openai/codex
```

It prints some lines as it works and finishes in well under a minute.

Whichever path you took, Codex is now installed. The next step confirms
it, the same way you confirmed the Claude CLI: by asking it for its
version.

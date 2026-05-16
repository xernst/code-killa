---
xp: 1
estSeconds: 150
concept: using-both-tools
---

# Running both, in practice

You have two tools installed now. Here's what using both actually looks
like on a normal day, so it's concrete and not just an idea.

## You don't run them at once

You don't have both going side by side, racing. You have one open at a
time, and you switch when there's a reason. Most of a working session
is just one tool, the one you opened, doing its job.

## The switch moves

Three switches are worth having in your hands:

- **The stuck switch.** One CLI has tried to fix something three times
  and it's still broken. Exit it. Open the other one in the same
  folder. Give it the same problem, and add what you learned: "the
  error is X, a previous attempt tried Y and it didn't work." A
  different model often breaks the loop.
- **The review switch.** One CLI just made a change you're not sure
  about. Open the other one and ask it, plainly: "look at this file
  and tell me if anything looks wrong." A second tool reviewing the
  first is one of the best safety checks you have, and it costs two
  minutes.
- **The outage switch.** A tool is down or crawling. The other one is
  the better tool for the next hour. No loyalty, just whatever works.

## Both see the same folder

This is the part that makes switching painless. Both CLIs work on real
files in a real folder. They don't have private copies. So when you
exit Claude and open Codex in the same folder, Codex sees exactly the
current state of the files, including whatever Claude just changed.
The folder is the shared ground. The tools are interchangeable
visitors to it.

That's the whole workflow. One tool at a time, switch when you have a
reason, and let the folder be the thing that's constant.

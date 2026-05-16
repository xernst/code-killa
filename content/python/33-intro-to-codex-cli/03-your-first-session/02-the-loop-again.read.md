---
xp: 1
estSeconds: 150
concept: approving-codex-actions
---

# The same loop, the same habit

When you press enter, Codex runs the agent loop. You know this loop.
Look, plan, act, check, repeat. Here it is, in your practice folder:

1. Codex **looks**. It checks the folder. It's empty, so there's little
   to read this time, but on a real project this is where it reads
   your files.
2. It **plans** the next concrete step: create `toolkit.txt` with the
   two lines.
3. At the **act** step, because creating a file changes your machine,
   it stops and shows you the action before doing it, then waits for
   you to approve.
4. You read the proposed action. It's what you asked for. You approve.
5. The file gets created. Codex **checks** that it worked, sees it did,
   and stops, since the job is done.

## Read the line. Still your job.

The wording of Codex's approval prompt is a little different from the
Claude CLI's. The job it does is identical: it shows you what's about
to happen and waits for your yes.

So the habit is identical too. Read the proposed action before you
approve it. Not because this first action is risky, it isn't, but
because you're keeping the muscle in shape for when an action *is*
risky, on a real project, where reading the line is the only thing
between "not what I meant" and "done anyway." Same muscle as `rm` in
the terminal chapter, same muscle as the Claude CLI. One habit, every
tool.

## Check it yourself

When Codex says it's done, verify it. Leave the session with `/exit`,
then in the plain terminal:

```
cat toolkit.txt
```

There are your two lines. You instructed a second AI tool, in plain
English, and it did the work. Your toolkit now has two tools in it,
and they work the same way.

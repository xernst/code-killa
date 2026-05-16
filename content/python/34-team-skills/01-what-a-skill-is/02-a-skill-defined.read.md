---
xp: 1
estSeconds: 165
concept: skill-defined
---

# What a skill actually is

A Claude skill is a packaged set of instructions for one kind of task,
that Claude loads on its own when that task comes up.

Break that into its three real parts.

**It's instructions.** At its core, a skill is your playbook written
down: how to do this job, what the standards are, what to watch for,
what good output looks like. The same things a person would explain to
Claude, written once.

**It's packaged.** A skill is a small folder. Inside is a main
instructions file and, if the job needs them, supporting files:
examples, a checklist, a reference document, a template. It's a tidy
bundle, not a loose paragraph.

**Claude loads it on its own.** This is the part that makes it more
than a saved prompt. A skill has a short description of what it's for.
When someone asks Claude to do something that matches, Claude
recognizes it and pulls in that skill's instructions automatically.
Nobody has to remember to attach it. You ask for a contract review;
the contract-review skill engages itself.

## The plain version

A skill is your team's how-we-do-this, handed to Claude once, that
Claude picks up automatically whenever it's the right job.

A couple of practical facts to file away. Skills are available on the
Claude Pro, Max, Team, and Enterprise plans. They also depend on a
Claude setting called Code Execution being turned on, because skills
can include not just instructions but small helper steps Claude runs.
You don't have to act on either fact yet. The next step shows a real
skill so the definition stops being abstract.

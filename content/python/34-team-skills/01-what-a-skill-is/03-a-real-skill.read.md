---
xp: 1
estSeconds: 165
concept: skill-example
---

# A real skill, start to finish

Make it concrete. A legal operations manager owns how her team reviews
incoming vendor contracts. Today, every paralegal explains the firm's
standards to Claude their own way. She decides to build a skill.

## What goes in it

She names it `vendor-contract-review`. Inside the skill folder she puts:

- **The main instructions file.** It says what the skill is for
  ("review an incoming vendor contract against our standards"), then
  the playbook: check for these twelve clauses, flag anything missing,
  compare payment terms against our defaults, never give legal advice,
  always explain why a clause was flagged.
- **A reference file**: the firm's standard contract terms, so Claude
  compares against the real numbers instead of guessing.
- **A checklist file**: the exact twelve-point review the firm uses.

That's the skill. A folder with a playbook and two supporting files.

## What it changes

Before the skill, a contract review depended on which paralegal ran it
and how well they remembered the standards that day. After the skill,
anyone on the team uploads a contract, asks Claude to review it, and
Claude recognizes the task, loads `vendor-contract-review`, and runs
the exact same twelve-point review against the exact same standards,
every time, explaining each flag.

The manager wrote the playbook once. The whole team now reviews
contracts her way. And when the firm's standards change, she updates
one file in one skill, and everyone's reviews update with it.

That is the entire value of a skill: consistency, captured once,
applied by everyone, easy to change in one place. Hold that example.
The rest of the chapter builds on it.

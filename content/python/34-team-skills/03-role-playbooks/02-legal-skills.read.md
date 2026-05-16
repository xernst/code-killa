---
xp: 1
estSeconds: 150
concept: legal-skills
---

# Skills for legal work

Legal teams run on documented standards, which makes them a natural
home for skills. You already saw one, `vendor-contract-review`, in
lesson one. Here's the wider set.

## Redlining against a playbook

A `contract-redline` skill carries the firm's positions: preferred
clauses, fallback positions, terms that are non-negotiable. Claude
marks up an incoming contract against those positions and explains each
change, instead of each associate redlining from personal preference.

## Clause comparison

A `clause-compare` skill takes the firm's standard clauses and compares
an incoming document's clauses against them, flagging what's missing,
weaker, or unusual. The reviewer gets a structured difference report
rather than a from-scratch read.

## First-pass document review

A `doc-review` skill encodes what a first read should always extract
from a long document: parties, dates, obligations, termination terms,
anything unusual. It produces the same summary structure every time, so
the lawyer's read starts from a consistent base.

## The legal caution

The hard rule for any legal skill: it produces a draft and a flag, not
a verdict. A skill makes review consistent and fast. It does not, and
must not, replace the lawyer's judgment, and it must never be allowed
to look like legal advice to a client. The most dangerous mistake here
is a confident, wrong output trusted because it looked thorough. The
debugging-AI-output and evals chapters of this course exist for exactly
this, and a legal skill should say plainly: every output gets verified
by a person before it leaves the building.

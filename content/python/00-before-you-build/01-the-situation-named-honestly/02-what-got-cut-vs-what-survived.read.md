---
xp: 1
estSeconds: 240
concept: skills-inventory
---

# What got cut vs. what survived

Same job, two columns. Most of the displacement panic comes from
looking at the first column and forgetting the second one exists.

## What got eaten

The parts of your old job that the model is now faster at:

- **Reading.** Skimming a 60-page document for the three relevant
  clauses. Triaging an inbox. Reviewing 200 resumes.
- **Classifying.** Sorting tickets by category, sorting leads by
  segment, sorting documents by type. Anything where the answer is one
  of N labels.
- **Summarizing.** Turning a long thing into a short thing while
  preserving the load-bearing parts.
- **Drafting.** First pass on copy, contracts, emails, decks,
  reports, code, designs. The "give me something to react to" step.
- **Routing.** Deciding which person, queue, or process a piece of
  work goes to next.

Every category of layoff in lesson 01 maps to this list. Copywriter:
drafting. Customer service: classifying and routing. Paralegal:
reading and summarizing. Junior designer: drafting (in pixels). Junior
engineer: drafting (in code).

Notice what's not on the list.

## What survived

The parts of your old job the model still can't do, or can't be
trusted to do alone:

- **Taste.** Knowing when the output is actually good. Knowing when
  something looks fine but is wrong. Knowing what to ship and what to
  throw away.
- **Judgment.** Knowing which of three plausible options is the
  right one given the context the model can't see. The exception case
  the rules don't cover.
- **Verification.** Catching when the model confidently states
  something false. Spotting the missed citation, the hallucinated
  case, the off-brand sentence, the wrong color.
- **Owning the relationship.** The customer, the client, the team,
  the regulator. The accountability that has to sit with a human
  because a model can't be held responsible.
- **Deciding what to ship.** Picking which of the model's ten drafts
  goes out. Cutting the project. Saying no. Pushing back on the
  brief.

These are not soft skills. They are the bottleneck of every AI feature
shipping today. The reason "AI projects" fail at 80% rates inside big
companies is not the model. It's the absence of someone with the taste
to tell when the model's output is wrong, and the judgment to redirect
it without restarting the whole project.

> Your taste is the unfair advantage. Most builders can't tell when
> output is ugly. You can.

That sentence is a designer talking, but it generalizes. Most builders
can't tell when copy is on-brand or off. Can't tell when a contract
clause is dangerous. Can't tell when a support response is going to
get the company sued. The model produces. You verify. The verifier is
the bottleneck now.

## The transfer, by field

Five fields, five transitions. Read the one that's yours.

**Copywriter → prompt engineer.** You already write briefs. A brief
is a prompt with a budget attached. The skill of "tell the creative
team what tone, what audience, what constraints, what success looks
like" is the same skill as prompting a model. You've been doing it
for a decade. You just called it briefing.

**Customer service rep → eval designer.** You wrote SOPs that an
eight-person team could follow. You knew which edge cases to call out
in training. You knew which agent could handle the tricky calls.
That's eval design — figuring out what a system has to handle, what
it has to escalate, and how you measure whether it actually works.
Eval design is the highest-paid prompt-engineering skill in 2026.

**Graphic designer → AI-product PM.** Your taste is the asset. PMs
who can't tell good design from bad ship bad design. You spent ten
years tuning your eye. AI-product teams are starving for people who
can sit in a design review and say "this is great, this is wrong, do
it again, change this one thing." That role pays more than the design
role you lost.

**Paralegal / junior analyst → eval and verification lead.**
Verification is the bottleneck of every AI feature shipping. Your
entire career was verification. Did this citation actually say that?
Does this contract clause actually do what counsel claims? Is this
filing actually complete? You can already do this faster than 95% of
engineers. The new job is doing it across LLM outputs at scale.

**Software engineer → harness engineer.** Your systems thinking
compounds in the AI era. The teams winning in 2026 are not "prompt
engineers." They're engineers who understand how to build the
scaffolding around models — eval pipelines, retrieval systems, tool
use, observability, retries. Your old SWE skills don't get cheaper;
they get more leveraged.

## What this means about your years

> You spent 19 years turning messy human problems into repeatable
> processes. That is the entire skill. The Python is 10%.

Read that twice.

Every field on the list above runs on the same underlying skill:
taking a messy real-world problem and turning it into something
structured enough that a process can run against it. Copywriters do
it with briefs. CS reps do it with SOPs. Paralegals do it with
checklists. Designers do it with systems and components. Engineers do
it with code.

That underlying skill — "make the messy thing structured" — is the
entire job of building with AI. The Python you'll learn in this
course is the syntax. The skill you already have is the substance.
The thirty chapters that follow are mostly about teaching you to wrap
your existing skill in code so it can run without you.

You don't need to become someone new. You need to wrap what you
already are in a tool stack you don't yet know. That's a four-month
problem, not a four-year one.

The next page is a single question. Pick the skill that transfers.

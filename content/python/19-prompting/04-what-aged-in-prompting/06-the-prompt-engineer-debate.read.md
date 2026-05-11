---
xp: 1
estSeconds: 220
concept: prompts-are-not-durable-evals-are
---

# "Prompt engineer" was a job title for 18 months. Then it wasn't.

The most concrete artifact of the 2023 prompting boom was a job
title: **Prompt Engineer**. Anthropic posted one in early 2023 with
a $375K total comp band. Scale AI, OpenAI, and dozens of startups
followed. LinkedIn lit up. Bootcamps spun up. Every consulting deck
in the second half of 2023 had a slide on "the rise of prompt
engineering as a discipline."

By late 2024 the job title was quietly disappearing. Most of the
roles renamed themselves "AI engineer" or "applied AI engineer" or
just folded back into "ML engineer." Bootcamps pivoted. The
consultants stopped putting the slide in the deck. Same people,
mostly. Same work, mostly. The title died because the framing was
wrong.

## Karpathy's tweet and the partial walkback

In January 2023, Andrej Karpathy tweeted:

> "The hottest new programming language is English."

It was the most-quoted prompt-engineering quote of the year. Cited
endlessly. Put on slide decks. The shorthand for "natural language
is the new interface to compute."

By 2024 Karpathy was clarifying. Multiple talks and threads walked
the framing back. The clarified version: *English is a thin
overlay; the durable engineering is in the system around the prompt,
not in the prompt itself.* Evals, datasets, tool plumbing,
guardrails, the model selection, the cost model. The prompt is the
visible 10%. The 90% is engineering.

That clarified version is what stuck. The original framing — "just
get good at writing prompts" — is what aged badly.

## Why prompts aren't a durable engineering artifact

A prompt is a configuration string targeting a specific model
version. When the model updates, the prompt's behavior changes.
When you switch models (cost, latency, capability), the prompt
needs to be rewritten. The exact phrasing that scored 94% on your
eval against Sonnet 4.5 might score 88% against Sonnet 4.6 and 91%
against Haiku 4.5. The prompt is fragile by construction.

What's durable across model swaps:

- **The eval.** "Given these 200 examples, what fraction does the
  model classify correctly?" The eval doesn't care which model you
  ran it against. The eval survives model updates. The prompt
  doesn't.
- **The dataset.** The 200 examples themselves. Curated, labeled,
  representative. Worth a lot more than a clever prompt.
- **The system around the model.** Retry logic, fallback to a
  bigger model, structured output validation, cost tracking. Real
  engineering. Lives in code, not in a prompt.
- **The product judgment.** "We need 95% precision on this
  classifier, not 95% recall, because false positives are
  expensive." This is the judgment a prompt engineer was supposed
  to bring — and it turns out it's a product judgment, not a prompt
  judgment.

Chapter 21 of this curriculum drills into evals as a discipline.
The reason it gets its own chapter is precisely this: evals are
where the durable engineering happens. Prompts are how you score
well on the eval today. Evals are how you know the new model is
safe to swap in tomorrow. They're not interchangeable. The eval
outlives every prompt you'll write.

## The debate, more honestly

The "is prompt engineering a real discipline" debate had two camps,
both partially right.

**The "yes, it's a real discipline" camp** (loudest in 2023):
prompts have nontrivial effects on output quality, the skill of
writing them is real, the prompts are sometimes worth tens of
thousands of dollars in saved API spend or improved accuracy. All
true.

**The "no, it's hype" camp** (loudest in 2024-2025): prompts are
fragile, the techniques rot every six months, the title is just a
veneer over "developer who reads model docs." Also true.

The synthesis, in 2026: writing prompts well is a real skill, and
it's a *component* of AI engineering, not a job. The same way
"writing SQL well" is a component of being a backend engineer, not
a job title. You should be good at it. You shouldn't optimize your
career around it.

## What you should optimize around instead

If "prompt engineer" was the 2023-2024 job, the 2026 job is closer
to **eval-driven AI builder**. The skills that compound:

- Building datasets that represent your real traffic.
- Writing evals that score what the product actually needs.
- Running model bake-offs and reading the cost/quality tradeoffs.
- Designing the system around the model (caching, retries,
  fallbacks, observability) so you can swap models without
  breaking.
- Knowing which 20% of prompting techniques (the information-
  transfer ones from step 01) survive model churn.

The last bullet is what this lesson is about. The other four are
the rest of the curriculum.

## One last reframe

Read every prompting tip from 2023-2024 with a single filter: **was
this person solving for a model-version-specific problem, or for an
information-transfer problem?** The model-version-specific solutions
all eventually rotted. The information-transfer solutions (few-shot
examples, stack context, explicit constraints, output format) are
still in every production prompt today and will be in 2027's
production prompts too.

If you keep that filter on while reading prompt-engineering content,
you'll save yourself months of drift toward stale techniques. You'll
also stop being intimidated by the volume of prompting "frameworks"
in the discourse — most of them are repackagings of the same five or
six durable moves, decorated with model-class-specific elicitations
that will expire on a one-year schedule.

Step 07 is the drill: a function that scores a prompting technique
against its model context and produces a verdict. Code your way
through what the lesson has been arguing.

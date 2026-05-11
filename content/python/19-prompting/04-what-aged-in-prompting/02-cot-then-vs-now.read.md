---
xp: 1
estSeconds: 220
concept: cot-then-vs-now
---

# Chain-of-thought: from gospel to gotcha in 36 months

The single best-cited prompting technique of the last four years
is **chain-of-thought (CoT)**. Wei et al.'s 2022 paper
*Chain-of-Thought Prompting Elicits Reasoning in Large Language
Models* (arxiv.org/abs/2201.11903) showed that adding intermediate
reasoning steps — or just the phrase "let's think step by step" —
dramatically improved performance on math and multi-step reasoning
benchmarks for GPT-3-era models. The paper has 8,000+ citations.
By 2023 it was prompt-engineering gospel.

By late 2024, "always add CoT" had silently flipped from
state-of-the-art to footgun on a growing class of models. Three
things happened.

## What changed: the model class

OpenAI shipped **o1-preview** in September 2024 — the first
production model where chain-of-thought happens *internally*, before
the visible answer. The model generates a private reasoning trace
(hundreds to thousands of tokens), then emits the final answer to
the user. The CoT is no longer something you prompt for. It's
something the model does whether you ask or not.

Anthropic followed with **extended thinking** on Claude Sonnet 3.7
(February 2025) and made it a first-class API parameter on Sonnet
4 (`thinking: { type: "enabled" }`). Same shape. The model emits a
separate `thinking` block with the reasoning trace; the visible
content block contains just the conclusion.

By 2026, every frontier lab — OpenAI, Anthropic, Google (Gemini 2.5
Thinking), DeepSeek (R1) — ships at least one model with reasoning
built in. That's the class change.

## The empirical update

Once reasoning is native, what does adding "think step by step" do?
Three things, measured directly:

1. **Doubles the output tokens on reasoning tasks** — the model
   reasons internally AND emits a visible CoT on top. You pay for
   both.
2. **Doesn't improve accuracy** — Wharton's 2024 *Decreasing Value
   of Chain-of-Thought* report found CoT no longer improved scores
   on math benchmarks for newer models, and sometimes slightly
   *lowered* them.
3. **Can interfere with the internal trace** — OpenAI's own
   reasoning-models guide warns:

> "Encouraging the model to produce a chain of thought before
> answering — for example by adding 'think step by step' to the
> prompt — could affect the model's reasoning process in unintended
> ways."

That's the lab whose model introduced the paradigm telling you not
to do the thing the 2022 paper said to do.

## Why this is the canonical "aged" technique

CoT is a perfect illustration of shape #1 from the previous step:
**manually eliciting a behavior the model is bad at**. In 2022,
GPT-3 was bad at multi-step reasoning. CoT was a workaround. In
2024-2025, the labs decided "actually, we should just make the
model do this natively, charge for the reasoning tokens, and stop
asking users to remember the magic phrase." That moment is when CoT
crossed from durable technique to expiring one.

The same shape repeats with other manual-elicitation tricks:

- **"Let's break this down."** Same as CoT, slightly different
  phrasing. Same fate.
- **"Show your work."** Same. (Worse on reasoning models because
  they show internal work to themselves, then have to perform
  showing work to you on top.)
- **"Take a deep breath."** A 2023 Google DeepMind paper found this
  phrase improved benchmark scores. By 2024 it was a meme. By 2025
  it was reasoning-model noise.
- **"Self-critique your answer, then revise."** Was useful when
  models couldn't recurse; reasoning models do this internally.

The whole "elicit reasoning by phrasing" toolkit is now a model-
class-dependent technique. If you're on a non-reasoning model
(GPT-4o, Sonnet without thinking, Haiku), keep using it. If you're
on a reasoning model, skip it.

## The thing you can't memorize

You can't memorize "which phrases age." That list churns every six
months. The thing you CAN memorize is the underlying question:
**is this prompt asking the model to do something the model already
does natively?**

If yes, the prompt is wasted tokens at best and a footgun at worst.
The right move is to delete the line and let the model do its
thing. The wrong move is to keep adding scaffolding from 2023 to
prompts that target 2026 models. That's the pattern. Hold onto it.

## The decision rule, made concrete

For every prompt you write today, run this two-second check before
shipping:

1. **What model class is this targeting?** (Reasoning-class:
   o-series, Claude with thinking, Gemini 2.5 Thinking, DeepSeek R1.
   Non-reasoning: GPT-4o, Sonnet without thinking, Haiku, Flash.)
2. **Is any line in this prompt asking for reasoning steps, working
   shown, or "think before you answer" framing?**
3. **If yes AND the target is reasoning-class, delete that line.**

That's it. One model-class check, one line-by-line scan. The first
time you do this on an existing template you wrote in 2024, you'll
delete two or three sentences. The prompt will work the same or
better, cost less, and stop fighting the internal reasoning trace.

The next step (03) is a quick check: four 2023-era techniques, only
one of which is still load-bearing. The arms-race read (04) covers
the bigger second category — tricks that aged because the model's
weakness got fixed in training, not in prompting.

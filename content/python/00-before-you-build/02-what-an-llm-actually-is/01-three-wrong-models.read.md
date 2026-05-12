---
xp: 1
estSeconds: 240
concept: contest-folk-models
---

# Three wrong models you probably arrived with

Before we install the right mental model, we have to take down the
three wrong ones you almost certainly walked in carrying. They're not
your fault — every consumer-facing AI product has reinforced at least
one of them. But all three will quietly sabotage every chapter that
follows if we don't name them and put them down.

## Wrong model #1: "It's like Google"

It isn't. Google retrieves. An LLM **generates**.

When you type into Google, a search index looks up pages that exist
somewhere on the web and ranks them. The output points at things that
were already written. If nothing on the web matches your query, Google
returns nothing.

When you type into an LLM, no lookup happens. The model produces text
one token at a time by predicting what comes next. It's not finding an
answer that exists somewhere. It's **manufacturing one in real time**.
That's why two identical prompts can give two different answers, and
why an LLM will cheerfully "cite" a paper that doesn't exist. There's
nothing being retrieved. There's only generation.

This matters because every time you treat an LLM like a search engine,
you import a trust model that doesn't apply. Google is wrong by
omission. An LLM is wrong by invention. Different failure mode,
different defenses.

## Wrong model #2: "It understands me"

It doesn't. It pattern-matches token sequences.

The philosopher Daniel Dennett described the **intentional stance** —
a useful shortcut where you predict a complex system by treating it AS
IF it has beliefs and desires. You can do this with a thermostat
("it WANTS the room to be 68"), a chess engine, your dog, or an LLM.
The stance is useful. The metaphysics it implies is wrong.

An LLM has no inner life. No goals. No awareness it's being used. No
preferences. When you ask it a question and it "tries to help," there
is nothing in there that is trying. There is a function computing the
next most-probable token, given the prompt, given the training, given
the sampling parameters. The text that comes out is shaped like
helpfulness because the training shaped it that way. The helpfulness
is the shape, not the source.

Put it plainly:

> It has no inner life, no goals, no awareness it's being used. Treat
> it like a very fluent text-prediction machine, because that's what
> it is.

You can still use the intentional stance as a tool ("the model
wants…", "the model is trying to…"). It's a shorthand. Just don't
forget it's a shorthand.

## Wrong model #3: "It's lying when it's wrong"

It isn't. It has no concept of true or false.

When an LLM gives you a wrong answer with full confidence — a fake
citation, a hallucinated function, a misremembered date — it isn't
deceiving you. **Confident-wrong is the default mode of the system.**
The model doesn't track truth. It tracks "what tokens usually come
next given these tokens." Sometimes that produces correct facts.
Sometimes it produces plausible-sounding garbage. The model has no
internal signal that distinguishes the two cases.

This is why "hallucinations" is a slightly misleading word — it
suggests the model is normally seeing reality and occasionally
slipping. The reverse is closer to the truth: the model is normally
generating plausible-sounding text, and that text happens to be
correct often enough to be useful. Verification is your job, not
the model's.

Treating wrong answers as lies leads you to do the wrong thing: get
angry, ask "why did you lie to me," try to "catch it." None of that
helps. Treating wrong answers as **statistical artifacts of a system
with no truth-tracking** leads you to the right thing: build the
verification step into your workflow. Don't trust. Check.

## Anti-pitfall: "It's just autocomplete"

The opposite overcorrection is also wrong. Once people hear "it
predicts the next token," some of them swing all the way to "so it's
just autocomplete, what's the big deal." That framing under-predicts
everything that's about to happen in this course.

Autocomplete trained on a hundred billion tokens of human writing —
including reasoning, code, math, dialogue, argument, instruction —
will produce completions that are *shaped like reasoning*. Not because
it reasons, but because it has seen enough of what reasoning looks
like to interpolate it. The patterns it has absorbed include the shape
of careful thinking. That's why prompt structure matters so much in
ch03: you're not asking the model to think, you're shaping the
distribution it samples from so the most-probable continuation is the
shape of an answer you can use.

Hold both at once: **mechanically, it's a next-token predictor.
In effect, the predictions are sophisticated enough to be useful for
work.** Neither half is the full picture without the other.

---
xp: 1
estSeconds: 240
concept: next-token-distribution
---

# The right model: a probability distribution over the next token

Here is the correct one-sentence definition of an LLM, the one the
rest of this course assumes you've internalized:

> An LLM is a function that takes a sequence of tokens and returns a
> probability distribution over every possible next token.

That's it. That's the whole thing. Everything else — chat, code,
reasoning, "thinking" — is what happens when you sample from that
distribution one token at a time and feed the result back in.

If you read that sentence and shrugged, read it again. The shape of
the function is the entire ballgame. Every chapter that follows
clicks into place once you can see the model this way.

## Walk through it with a concrete example

Take the prompt:

> "The capital of France is ___"

When the model processes this sequence, it doesn't decide on "Paris."
It produces a probability distribution over every token in its
vocabulary. Something like this (simplified):

| Token       | Probability |
|-------------|-------------|
| `Paris`     | 0.97        |
| `the`       | 0.01        |
| `located`   | 0.005       |
| `France`    | 0.003       |
| `in`        | 0.002       |
| ... (50,000+ other tokens, each tiny) ... | ... |

The model's confidence is **visible** in the shape of that
distribution. It's not magic. It's not "the model knows the answer."
It's that 97% of the probability mass piled up on a single token. Of
course the next sample is "Paris." The math made it inevitable.

## Now change the prompt to break the spike

Take the prompt:

> "My favorite color is ___"

Same model. Same architecture. Same weights. But the distribution
looks completely different:

| Token       | Probability |
|-------------|-------------|
| `blue`      | 0.18        |
| `red`       | 0.15        |
| `green`     | 0.13        |
| `purple`    | 0.10        |
| `black`     | 0.08        |
| `the`       | 0.05        |
| ... many more, gradually smaller ... | ... |

There is no spike. The mass is **smeared** across twenty plausible
colors. The model isn't "guessing" — it's correctly representing that
there's no single right next token here. The prompt didn't constrain
the answer, so the distribution can't either.

This is why "what is your favorite color, model?" is a weird question.
Sample once, you get "blue." Sample again, you get "green." Sample a
thousand times, you get a histogram that looks like the distribution
above. Neither answer is the "real" one. The distribution is the
real answer; the single token is just a sample.

## Sampling and temperature

Most of the time you don't see the distribution. You see one token —
the one that got sampled. **Temperature** is the dial that controls
how the sampling works:

- **Temperature near 0**: the sampler is greedy. Always picks the
  top token. "The capital of France is" → "Paris" every single time.
  Boring, deterministic, predictable.
- **Temperature around 1**: the sampler is honest to the distribution.
  Sometimes you get the top token, sometimes a lower one, weighted by
  their probabilities. "My favorite color is" → blue/red/green/purple
  across runs.
- **Temperature high (1.5+)**: the sampler flattens the distribution
  before sampling. Even low-probability tokens get picked sometimes.
  Output gets weirder. Can be useful for creative work; can produce
  word salad.

You will care about temperature later. For now, the point is just
this: the model produces a distribution. The system around the model
samples from it. Both halves are decisions you can inspect and tune.

## Why this framing is load-bearing

If you hold this model in your head — "function from token sequence
to probability distribution, then sample" — most LLM behavior stops
being mysterious:

- **"Why is the model wrong?"** Because the probability mass piled up
  on the wrong token. Either the training didn't have the right
  patterns, or the prompt didn't shape the distribution enough.
- **"Why is the output different each time?"** Because temperature > 0
  means we're sampling. Run it again, get a different sample.
- **"Why does prompt structure matter so much?"** Because the prompt
  IS the input to the function. Better-shaped input → better-shaped
  distribution → better samples.
- **"Why does the model 'hallucinate'?"** Because if the right answer
  isn't anywhere near the top of the distribution, the sampler will
  happily return whatever IS at the top, even if it's wrong.

You haven't seen the math. You haven't trained a model. You haven't
written any code yet. But if you can describe an LLM in one sentence
as "a function from token sequence to probability distribution, then
sample," you are ahead of most people who use these systems for a
living.

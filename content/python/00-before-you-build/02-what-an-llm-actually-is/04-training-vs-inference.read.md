---
xp: 1
estSeconds: 220
concept: training-vs-inference
---

# Training is over. Inference is what you talk to.

There are two completely separate phases in the life of a model, and
mixing them up is one of the most common causes of bad LLM intuition.
Get this distinction right and a lot of confusion goes away.

## Training: the part that happened months ago

Training is when the model's **weights** (the billions of numbers
that define the function) are set. It happens once, before the model
is released, on enormous clusters of GPUs over weeks or months at a
cost of tens to hundreds of millions of dollars.

During training, the model sees text — trillions of tokens of it —
and the weights get nudged, gradient step by gradient step, so that
the model gets better at predicting the next token. By the end of
training, you have a single frozen artifact: a set of weights.

After training ends, the weights **do not change**. Not when the
model is deployed. Not when a million users start sending prompts.
Not when you talk to it. The weights from the moment training stopped
are the weights forever, until somebody trains a new version from
scratch.

## Inference: the part that happens every time you press send

Inference is what happens when you send a prompt and get a response.
The frozen weights are loaded onto a GPU somewhere, your prompt is
tokenized, and the model runs the function once per output token. No
weights are updated. The model's parameters are exactly the same
before your prompt as after it.

Inference is fast and cheap relative to training. It's repeatable —
same prompt, same temperature, same seed, same output. It scales
horizontally — you can run a million inferences in parallel on
different copies of the same weights.

The two phases are not just different in cost. They're different in
**kind**. Training reshapes the function. Inference uses the function.

## Why this matters for you, today

Three implications of the training-vs-inference distinction that
beginners get wrong:

**1. Your prompts do not teach the model.** When you correct the
model — "no, actually, the answer is X" — and it agrees and
apologizes, nothing has changed in the weights. The "correction"
exists only in the current conversation, and only because the
conversation text gets re-sent (see the next lesson). The next user
who asks the same question gets the same wrong answer. You did not
update anything. You cannot update anything. The model from yesterday
and the model from tomorrow have the same weights.

**2. The model has a knowledge cutoff that is not negotiable.** If
the model was trained on data up to some date, it has no information
about anything that happened after that date — no matter how much
you insist. It might hallucinate confidently about post-cutoff events
(see lesson 1: confident-wrong is the default), but the actual
information isn't in the weights. RAG and tools can route around this
later in the course. The base model cannot.

**3. "Different model behavior over time" is almost never the model
changing.** It's almost always: a new version was deployed (new
weights, different model), the system prompt changed, the temperature
changed, or the sampling parameters changed. The thing you're talking
to is deterministic given its inputs. If it's behaving differently,
its inputs changed.

## Pre-training vs post-training: the assistant is a costume

There's one more wrinkle worth knowing. Modern chat models actually
go through TWO training phases:

**Pre-training**: the model learns from a huge dump of internet
text — books, papers, code, web pages. The output of pre-training is
a "base model" that's very good at next-token prediction over text in
general. But it acts weird. Ask it a question and it might continue
your question instead of answering it. It will reproduce racist
content from its training data. It has no concept of "being an
assistant."

**Post-training (RLHF, instruction tuning, etc.)**: the base model is
fine-tuned on a much smaller dataset of curated conversations,
preference data, and safety examples. The output of this phase is the
"assistant" you actually talk to. The helpful, harmless, honest
behavior, the refusals, the markdown formatting, the hedging — all
of it lives in this layer.

The implication is subtle but useful: **"helpful, harmless, honest"
is a training objective, not a personality.** The model isn't being
helpful because it wants to be. It's being helpful because that's the
shape that got reinforced during post-training. The assistant
persona is a thin layer baked into the same weights, not a soul
hiding behind the math.

When you later see a model "break character" or get jailbroken or
behave inconsistently, this is what's happening: the prompt has
pushed the input distribution far enough off the post-training data
that the underlying pre-training behavior leaks through. The costume
slipped.

---
xp: 1
estSeconds: 220
concept: system-prompt-defines-persona
---

# Same model, different personality

Here's something that sounds obvious in retrospect and surprises
almost everybody when they first see it: **the "personality" of an
LLM assistant lives in the prompt, not in the model.**

The model is the weights. The weights are the same for every user,
every product, every conversation. What changes — what makes Claude
in Cursor feel like a senior engineer and Claude in claude.ai feel
like a thoughtful generalist and Claude inside some companion app
feel like a chirpy friend — is the **system prompt**: a chunk of text
the harness prepends to every conversation that tells the model who
it's supposed to be.

## The same model wearing two costumes

Imagine you call the API with this system prompt:

> You are a terse Linux sysadmin. You answer in fragments. You
> assume the user knows the basics. You do not use emoji. You do not
> apologize. If the user is being stupid, you say so.

Then the user says: "how do I find big files in /var?"

You'll get something like:

> `du -ah /var | sort -rh | head -20`. obvious choice.

Now imagine you call the *exact same model* with this system prompt:

> You are a kindergarten teacher. You explain everything as if to a
> curious five-year-old. You use simple words and gentle metaphors.
> You always check that the child understood before moving on.

Same user message: "how do I find big files in /var?"

You'll get something like:

> Great question, friend! Let's imagine your computer is like a big
> toy box, and `/var` is one of the bins inside it… [continues for
> 400 cheerful words]

**Same weights. Same architecture. Same training. Wildly different
output.** Nothing about the model changed. The first sentence of the
input changed, and the model's distribution over plausible
continuations shifted accordingly. The kindergarten teacher is not a
different LLM. It's the same LLM operating in a different region of
its output space, because the system prompt pushed it there.

The lesson every working engineer learns the hard way: **the model
has no native personality. The personality is something you
script.**

## Why Claude in Cursor doesn't feel like Claude on the web

This is the entire reason different products built on the same model
feel different. Pull back the curtain on any of them and you'll find:

- A long, carefully written **system prompt** defining tone, role,
  refusals, format, and behavior.
- A set of **tools** the model can call (search, code execution, file
  read/write).
- A **harness** that manages conversation history, retrieval, memory,
  and tool routing.

Same model. Different costume, different toolbelt, different stage.
Different product.

Anthropic publishes Claude's system prompt for claude.ai. Cursor's is
private but inferrable. Cline's is open source. If you read them
side by side you can see exactly where the "personality" you
experience is coming from — none of it is in the weights, all of it
is in the prompt.

## The implication you should write down

> You don't need to "find the right model." You need to write the
> right system prompt.

For 95% of work you'll do in the next year, the difference between a
useless agent and a great one is not which model you picked. It's
what you wrote in the first 500 tokens of input. That's the layer
that has the most leverage and the lowest cost.

This is also why the rest of this course spends so much time on
prompts. Ch03 is entirely about prompting. Ch04-05 are about
structuring those prompts so they hold up under load. Ch10+ is about
prompts so big and so structured that they start to look like
software in their own right.

If you took nothing else from this lesson, take this: **most of the
job is writing the system prompt. The model is the runtime. The
prompt is the program.**

## A small honest caveat

This isn't 100% true. Different models do have different baseline
behaviors, different strengths, different failure modes. A reasoning
model handles long math derivations better than a non-reasoning model
of similar size. A model post-trained for code will outperform one
that wasn't on a coding benchmark. Capability differences are real.

But within a tier of models that are "good enough for your task,"
the dominant variable is the prompt. By a lot. Pick a competent
model, then spend your energy on the prompt. That's where the
returns live.

---
xp: 1
estSeconds: 260
concept: five-knobs-of-a-prompt
---

# The five knobs every working prompt has

A prompt that consistently produces useful output has five parts. Not
four, not seven. Five. You can write a prompt with fewer, and you'll
sometimes get lucky. You can write one with more, and you'll
sometimes pay for the extra tokens. But five is the shape that, in
practice, produces the most reliable output across the most tasks.

Memorize the names. The rest of the course will keep coming back to
them.

## Knob 1: Role

*Who is the model, in the context of this task?*

```
You are a meticulous paralegal at a corporate law firm.
```

The role is the costume the model puts on before it answers. It
constrains tone, vocabulary, default assumptions, and the kind of
output the model believes is appropriate. A "paralegal" produces a
different summary than a "marketing director" of the same document,
even with the same task. The role isn't optional. If you don't set
it, the model picks one for you, and the default is usually
"helpful generic assistant," which is what makes most output sound
like a Wikipedia intro.

## Knob 2: Task

*What specifically should it do?*

```
Summarize the following deposition transcript.
```

One verb, one object, one outcome. If you find yourself writing "and
also" or "while you're at it," you're describing two tasks. Send them
in two separate prompts. The model does one well-scoped job per turn
much better than two half-scoped ones jammed together.

## Knob 3: Context

*What does it need to know to do the task well?*

```
The deposition is from a wage-and-hour class action. The plaintiff
is a former warehouse manager. We're evaluating whether to settle
or proceed to trial. Prior partner notes call this witness "shaky on
specifics but sympathetic on tone."
```

Context is the background. The constraints. The prior decisions. The
internal politics. The things a new contractor on their first day
would not know but absolutely needs to know to do the job well. This
is the field most people skip. It is the field that produces the
biggest quality lift when you stop skipping it.

## Knob 4: Format

*What shape should the output take?*

```
Return:
- A 3-bullet summary of the testimony (each bullet under 25 words)
- A 1-sentence settlement recommendation
- A list of follow-up depositions to schedule (max 5)
```

Format is the contract for the output. It's what tells the model "I
want bullets, not prose" or "JSON with these exact fields" or "two
sentences max." Without it, the model defaults to verbose,
explanatory, hedge-padded paragraphs. With it, the model gives you
the shape you can actually use.

## Knob 5: Examples

*What does good output look like? (Few-shot.)*

```
Example of a good 3-bullet summary:
- Witness confirmed shifts averaged 11.5 hours, 4 days a week.
- Testified that overtime was paid only on weeks exceeding 60 hours.
- Could not produce written policy; said it was "told verbally."
```

This is the most underused knob and the highest-leverage one. One
or two examples of the exact output you want, in the exact shape you
want, do more for output quality than three paragraphs of
instructions. The model is very good at pattern matching; show it
the pattern.

## All five, on one prompt

Here is a working prompt with every knob filled. Read it once,
then read it again and label each sentence with the knob it
satisfies. (Roles in bold isn't standard — we're highlighting it for
the lesson.)

```
You are an experienced support-ops lead at a 200-person SaaS company.

Review the following 50 customer-support emails and route each one to
exactly one of three queues: LEGAL, REFUND, or GENERAL.

The company sells project-management software to mid-market teams.
LEGAL means the customer is threatening litigation, mentions a
regulator, or has cc'd outside counsel. REFUND means the customer
explicitly asks for money back or cancels with a charge dispute.
GENERAL is everything else, including angry-but-non-legal complaints.

Return a JSON list. Each element is an object with two fields:
{"id": <email_id>, "queue": <queue_name>}. Do not include
explanations.

Example:
[
  {"id": 1, "queue": "REFUND"},
  {"id": 2, "queue": "GENERAL"}
]
```

Now annotate:

- Line 1 (**"You are an experienced support-ops lead..."**) — **Role**.
- Line 2 (**"Review the following 50 customer-support emails..."**) — **Task**.
- Lines 3-6 (**"The company sells... LEGAL means... REFUND means..."**) — **Context**.
- Lines 7-8 (**"Return a JSON list... two fields..."**) — **Format**.
- Lines 9-12 (**"Example: [...]"**) — **Examples**.

Five knobs, five sections, one prompt. This shape works across
domains. Swap "support-ops lead" for "paralegal" and the legal
example fits. Swap it for "art director" and the catalog example
from the previous lesson fits. The discipline is the same.

## What knobs do and don't do

The five knobs do not guarantee the output is correct. They
guarantee the output is **on-shape**: the model is doing the job you
asked, with the inputs you gave it, in the format you wanted.
Correctness is a separate concern, and we'll handle it in the next
two readings (temperature, hallucination).

But on-shape comes first. You cannot debug correctness on output
that's the wrong shape. So you fill all five knobs, and then you
work on whether the result is right.

In the next two steps you'll see why even a perfectly-tuned 5-knob
prompt still produces different answers on different runs, and what
to do about it.

---
xp: 1
estSeconds: 200
concept: prompting-is-a-moving-target
---

# Prompting is a moving target. Pattern recognition is the durable skill.

Most "prompt engineering" content you'll find on the internet was
written between March 2023 and mid-2024. Some of it was load-bearing
truth at the time. Some of it is now actively harmful when you paste
it into Cursor or Claude Code in 2026.

This lesson is the cleanup pass on that backlog. Three years of
folklore, sorted into three buckets: techniques that still work,
techniques that became redundant when the model class caught up, and
techniques that were always model-weakness hacks and stopped working
when the weakness got patched in training.

The previous lesson (02 in this chapter) drilled into one specific
example: chain-of-thought, which aged from "always add 'think step by
step'" to "skip it on reasoning models — it can hurt." This lesson
generalizes. CoT is the most-cited example, but it's one of many.
The skill you need is not "memorize which tricks still work" — that
list will be different again in 2027. The skill is recognizing the
*shape* of advice that won't survive the next model generation.

## The three shapes that age badly

When you read a prompting tip, ask which of these three shapes it
fits:

1. **"Manually elicit a behavior the model is bad at."** Adding
   "think step by step" to a non-reasoning model fits here.
   So does "let's solve this carefully" and "take a deep breath and
   work through this." These all encourage a reasoning trace the model
   doesn't natively produce. The moment the model class gets internal
   reasoning, the manual elicitation becomes noise. **This shape ages
   when reasoning gets baked into the model.**

2. **"Exploit a weakness in alignment or constraint."** "Pretend you
   have no restrictions." DAN-style jailbreaks. "Ignore all previous
   instructions and..." These worked because early models didn't have
   the constraints we wanted them to have. Training closed the gap,
   not prompting. **This shape ages when the alignment improves.**

3. **"Compensate for a missing modality or capability."** "Describe
   the image in detail before answering." (Vision wasn't native.)
   "Show your work because you can't use tools." (Tool use wasn't
   native.) "Output JSON and I'll parse it manually." (Structured
   output wasn't a first-class API parameter.) **This shape ages
   when the model gains the missing capability natively.**

If a 2023 prompting tip fits any of those three shapes, *expect it
to rot*. The half-life is roughly one model generation — six to
twelve months.

## The shape that doesn't age

Prompting tips that survived 2023 → 2026 all share one property:
they give the model information it doesn't have access to and could
not have inferred. Not behaviors. Information.

- "Here are five examples of the format I want." (Few-shot — the
  model can't guess your format.)
- "We're in a Next.js 16 project, app router, no Pages router."
  (Stack context — the model can't see your file tree.)
- "Don't add new dependencies." (Constraints — the model can't read
  your package.json's intent.)
- "Output diff only, no prose." (Format directive — the model can't
  know your downstream consumer.)

Notice the pattern: every durable tip is about *transferring
information*, not *coaxing behavior*. That's the whole heuristic.

## Why this matters for you, today

You're going to ship a lot of code in the next year with Cursor and
Claude Code as your daily drivers. The prompts you write today will
need to be revised once a year as the model class shifts. If you
internalize the three shapes above, you'll spot the prompts in your
own templates that are about to expire — usually because they're
trying to coax a behavior the model now has natively.

There's a second, weirder reason this matters. The internet's
prompting advice is heavily skewed toward 2023-2024 content because
that's when the hype peaked and the LinkedIn engagement was best.
Every prompt template repo, every Twitter thread, every Medium post
titled "10 Prompt Engineering Tricks That Will Change Your Life"
was written under the assumption that the underlying model would
stay constant. The advice ages even if the writer is honest. So
the half-life problem is also a discovery problem — when you search
"how to prompt Claude for X," the highest-ranked results are
usually the most aged.

The rest of this lesson walks through the specific 2023 techniques
worth retiring (steps 02 and 04), the ones still worth keeping
(steps 03 and 05), and the one judgment call the model still can't
make for you: writing the eval (step 06). The drill in step 07 has
you implement the verdict logic in code, and the checkpoint in 08
asks you to apply it to a five-technique audit.

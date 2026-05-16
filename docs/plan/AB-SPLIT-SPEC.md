# Task 3: A/B chapter split — methodology, structure, and batch plan

**Author:** Content & Curriculum agent team
**Date:** 2026-05-16
**Status:** Methodology + worked pilot. Execution of the 31 chapters needs Josh's
go-ahead and the Platform team's A/B file-format spec first. See section 7.

---

## 0. Why this is a spec and not 62 finished chapters

Task 3 is "split all 31 existing chapters into Version A and Version B." Real
scale: 31 chapters, 841 steps. A full split is roughly 62 chapter versions and
well over a thousand files.

Two things make mass-producing that autonomously the wrong move:

1. **No Platform file-format spec exists yet.** How a chapter declares it has an
   A and a B variant, where the variant files live, how the renderer picks one:
   none of that is specified. Producing 1,000+ files in a guessed layout means
   redoing them when the real spec lands.
2. **The quality bar forbids unreviewed mass generation.** The project's own
   curriculum-design rule is explicit: AI-built curriculum needs pedagogy-review
   passes, because schema validation does not catch subtle wrong-teaching.
   Generating 62 chapter versions with no review pass would produce exactly the
   kind of plausible-but-subtly-wrong content that rule exists to stop.

So this document is the executable plan: the methodology, the proposed file
structure, a fully worked example, a per-chapter checklist, and the batch
order. With Josh's sign-off and the Platform format confirmed, execution is
mechanical and can run chapter by chapter.

## 1. The two versions

From the brief, restated as working definitions.

**Version A — beginner AI literacy.**
- Assumes zero knowledge of AI tools (Claude, ChatGPT, Cursor).
- Assumes zero coding background.
- Slower pace, more explanation per step.
- More analogies and real-world parallels.
- Hand-holds through error messages and traceback-panic moments.
- Same chapter outcome as B, gentler path.

**Version B — intermediate to advanced.**
- Assumes the learner uses Claude or ChatGPT regularly.
- Assumes basic comfort with tools like Cursor.
- Faster pace, less hand-holding.
- Deeper dives into edge cases.
- More "here is what is actually happening under the hood."
- Skips analogies that are obvious to experienced users.

**Key fact that halves the work:** the 31 existing chapters are already written
close to Version B. They reference Cursor diffs, accumulators, dynamic typing,
and assume AI-tool familiarity. So per chapter, Version B is the existing
chapter with a light refinement pass, and the real new writing is Version A.

## 2. Methodology, per chapter

1. **Read the existing chapter in full.** It is the baseline.
2. **Version B:** start from the existing chapter. Refine, do not rewrite. Tighten
   anything loose, and apply the locked content decisions (remove em dashes;
   remove banned consultant words). The structure, steps, and outcome stay.
3. **Version A:** rewrite each step to assume zero baseline.
   - Add a short intro section before the first runnable code, explaining the
     concept in plain language.
   - Define every term the first time it appears. No unexplained jargon.
   - Replace experienced-user references (Cursor diffs, "you know X") with
     plain framing and analogies.
   - Expand the explanation around each step. The runnable code itself stays the
     same; the words around it grow.
   - Add reassurance at the error-prone moments (first traceback, first failed
     run).
4. **Keep the runnable steps identical where possible.** The code a learner runs
   is the same in A and B. Only the surrounding explanation differs. This keeps
   graders, solutions, and outcomes aligned across versions.
5. **Each version gets its own step count and time estimate.** Version A will
   have more reading and a longer estimate. It may add `read` steps; it should
   not remove practice steps.
6. **Both versions converge on the identical chapter outcome.** A learner
   finishing A can do exactly what a learner finishing B can do.

## 3. Proposed file structure

This is a content-team proposal. The Platform team owns the final call; flag any
change and these conventions adjust.

```
content/python/01-variables/
  chapter.yaml            # gains a `versions:` block (below)
  which-version.md        # the "which version is right for me" intro (section 4)
  overview.md             # shared chapter overview, version-neutral
  version-b/              # the refined existing content
    01-naming-things/
      lesson.yaml
      01-intro.read.md
      ...
  version-a/              # the new beginner content
    01-naming-things/
      lesson.yaml         # own estMinutes, own step order
      01-intro.read.md
      ...
```

`chapter.yaml` gains:

```yaml
versions:
  default: by-placement      # the renderer picks A or B from placement results
  a: { dir: version-a, label: "Beginner", estMinutes: <sum of A lessons> }
  b: { dir: version-b, label: "Intermediate", estMinutes: <sum of B lessons> }
```

Notes:
- `overview.md` stays shared and version-neutral (it already is).
- A learner can switch A/B at any time; the renderer just swaps which `version-*`
  subtree it reads. Progress is per-step, so switching mid-chapter is safe as
  long as step IDs line up (they do, because the runnable steps are identical).
- If the Platform team prefers a per-step `version` field over parallel
  directories, that also works; the content is the same either way.

## 4. The "which version is right for me" intro

Each chapter gets a short `which-version.md` the platform shows during
placement, or at the chapter start if the learner has not been placed. Template:

```
# which version of this chapter

This chapter comes in two speeds. Same destination, different pace.

**Start with Beginner if:** [zero-baseline signals, chapter-specific]

**Start with Intermediate if:** [has-baseline signals, chapter-specific]

Not sure? Start with Beginner. You can jump to Intermediate from the top of any
chapter the moment it feels slow. Switching costs nothing.
```

Worked example, `content/python/01-variables/which-version.md`:

```
# which version of this chapter

This chapter comes in two speeds. Same destination, different pace.

**Start with Beginner if:** you have never written code, or the word "variable"
is not yet something you could explain to someone else. Beginner explains every
idea from the ground up and walks you through your first error messages.

**Start with Intermediate if:** you have seen code before, you have used a tool
like Cursor or ChatGPT to write some, and you mostly need to get sharper at
reading it. Intermediate moves faster and spends its time on what AI gets wrong.

Not sure? Start with Beginner. You can jump to Intermediate from the top of any
chapter the moment it feels slow. Switching costs nothing.
```

The placement survey (`content/placement/general-survey.json`) already produces
the A/B signal; `which-version.md` is the manual fallback and the explanation a
learner sees when they reconsider.

## 5. Worked transformation example

To make the A-versus-B difference concrete, here is ch01, lesson 1, step 1,
the intro `read` step, in both versions. The existing file is the Version B
baseline; only the em dashes need removing for the B refinement. Version A is
the rewrite.

### Version B (refined existing content)

The existing `01-intro.read.md` is already Version B. The refinement pass is
light: remove em dashes, keep everything else. It opens "You'll ask Cursor to
track the user's score..." and assumes the reader knows what Cursor is and has
used it. That assumption is correct for Version B. It stays.

### Version A (new, beginner)

The same step, rewritten for a learner who has never coded and may never have
used an AI coding tool. Note what changes: Cursor is explained, not assumed; an
analogy is added; the mental model is slowed down; the runnable code at the end
is the same code.

```markdown
---
xp: 1
estSeconds: 120
concept: variable-introduction
code: |
  # This is code. Hit Run to see what it does. We'll explain every part.
  user = {"name": "Alex", "plan": "free", "tickets_used": 7}
  limit = 10
  remaining = limit - user["tickets_used"]
  print(f"{user['name']} has {remaining} tickets left on the {user['plan']} plan.")
runnable: true
---

# Variables: the first thing code does

Software is built out of small named pieces of information. A program that
tracks a score has to keep the score somewhere. A program that remembers your
name has to keep the name somewhere. Each of those "somewheres" is called a
variable: a name with a value attached to it.

That is the whole idea. A variable is a name stuck on a value.

## A real-world version of the idea

Think of a coat check. You hand over a coat, you get a tag, and the tag has a
number. Later you show the number and get the exact coat back. You did not
memorize where the coat was hung. You just kept the tag.

A variable is the tag. The value is the coat. You write the name, Python finds
the value. You never think about where it is actually stored, the same way you
never think about which hook your coat is on.

## Reading the model: right side first

Here is a line of Python:

    score = 7

Read it right to left. Python looks at the right side first, the value 7. Then
it takes the name on the left, score, and sticks it on that value. From now on,
anywhere you write score, Python finds the 7.

If that feels almost too simple, good. It is supposed to. Every variable you
ever read is a version of this one move.

## Why this matters for working with AI

When an AI tool writes code for you, the first thing it does is make
variables. It picks names, attaches values, and refers back to those names
throughout. If you can read the names, you can follow what the code is doing.
If you cannot, the code is a wall. This chapter makes it readable.

## Try it

The editor on the right has a few lines of Python. You are not expected to
understand all of it yet. Hit Run and watch what prints. We will take it apart
piece by piece over the next steps.
```

The difference, summarized: Version A adds the coat-check analogy, defines
"variable" before using it, drops the assumption that the reader knows Cursor,
slows the right-side-first explanation, and adds a gentle "you are not expected
to understand all of it yet." Same code, same `concept` id, same chapter
outcome. Roughly twice the words and a longer time estimate. That is the
transformation, applied step by step, chapter by chapter.

## 6. Per-chapter execution checklist

For each of the 31 chapters, in order:

1. Read the full existing chapter.
2. Create `version-b/` from the existing lessons. Refinement pass: remove em
   dashes, remove banned words, tighten. Do not restructure.
3. Write `version-a/`: rewrite every step per the section 2 methodology. Add the
   plain-language intro section to the first step of each lesson.
4. Write `which-version.md` with chapter-specific signals.
5. Update `chapter.yaml` with the `versions:` block and both time estimates.
6. Validate: YAML parses, no em dashes, no banned words, step IDs align across
   A and B, both versions reach the same outcome.
7. **Pedagogy-review pass** (required by the quality bar): a reviewer checks
   Version A for subtle wrong-teaching, since that is what schema validation
   misses.
8. Commit the chapter, fast-forward to main.

## 7. Batch plan and dependencies

### Blocking dependencies

- **Platform A/B file-format spec.** Section 3 is a proposal. Confirm or correct
  it before files are produced at scale.
- **Pedagogy-review capacity.** Step 7 of the checklist is mandatory per the
  quality bar. Decide who runs it and at what cadence (per chapter, per batch).

### Suggested batch order

Group by phase, easiest and highest-traffic first, so early batches de-risk the
process:

- **Batch 1 (pilot):** ch01-variables. One chapter, both versions, full
  checklist including pedagogy review. Proves the template end to end.
- **Batch 2:** ch02-07 (rest of Foundations). Highest learner traffic, simplest
  content, biggest A/B gap. Best return on the effort.
- **Batch 3:** ch08-12 (Real Python).
- **Batch 4:** ch13-16 (LLM APIs).
- **Batch 5:** ch17-24 (Shipping Discipline).
- **Batch 6:** ch25-30 (Capstone and Applied Builds). These are advanced; their
  Version A is the hardest to write and the least urgent, since few zero-baseline
  learners reach them early.

The 4 new chapters (ch31-34) are already written in a beginner-friendly voice.
They likely need only a Version B pass (a faster cut), not a full A rewrite.
Treat them as a small final batch and decide per chapter whether B is even
needed.

## 8. Recommendation

Tasks 1, 2, 4, 5, 6, 7, 8 are complete and merged. Task 3 is scoped here with a
worked pilot. Before the 31-chapter execution runs, two things should happen:

1. Josh reviews this methodology and the worked Version A example, and confirms
   the voice and depth of Version A are right. This is the same sample-check
   that approved the CLI chapters.
2. The Platform team confirms the A/B file structure (section 3).

Then execution is a mechanical, batched grind, one chapter per pass, each
through the full checklist including pedagogy review. It should not be a single
autonomous mass-generation run, because the quality bar does not allow it.

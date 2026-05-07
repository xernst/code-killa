# Curriculum Audit
_Date: 2026-05-07_

Scope: instructional-design audit of the 26-chapter promptdojo curriculum. Read every chapter overview, sampled lessons across the arc (ch01 lesson 1 in full, ch06, ch11 overview, ch13 lesson 1, ch15, ch16 lessons 1 + 4, ch19 lesson 1, ch22, ch23, ch24, ch25 lesson 1 + 5). Lens: constructive alignment, cognitive load, scaffolding, brand-fit ("ai writes this. it's wrong."), step-type variety, capstone integration, hooks, first-30-seconds.

---

## Curriculum architecture

26 chapters in 5 phases (`lib/curriculum/phases.ts`): foundations (ch01-07), real python (ch08-12), llm apis (ch13-16), shipping discipline (ch17-24), capstone (ch25). Note phase 5 ends at ch25 — chapter 26 (agent harnesses) is unassigned to any phase, which means it renders on the home rail but doesn't sit in the phase-banded narrative. The arc itself is sound: Python literacy → real-world Python → AI APIs → shipping/discipline → integration. Step-type rhythm is canonical: nearly every lesson follows `read → mc → read → predict → fill → fix → fix → write → checkpoint` (9 steps) — confirmed across ch01/L1, ch06/L1, ch13/L1, ch14/L1-2, ch15/L1, ch16/L1-4, ch19/L1, ch22/L2, ch25/L1, ch25/L5. This rhythm is promptdojo's strongest pedagogical asset (see "What's strong"). Total: 515 runnable steps, but 3 chapters (22, 23, 24) have unfinished lessons rendering as stub `read` steps with the literal copy *"the lessons in this chapter are coming"* (`content/python/22-context-and-retrieval/01-orientation/01-intro.read.md:11`, `23-production-tradeoffs/01-orientation/01-intro.read.md:11`, `24-debugging-output/01-orientation/01-intro.read.md:11`). These are footnoted in `manifest.toc.json` as 9-10 step chapters but are functionally half- or three-quarters-empty.

---

## What's strong (don't lose in any redesign)

1. **The 9-step lesson template is the chassis.** `read → mc → read → predict → fill → fix → fix → write → checkpoint` rotates across 4 of the 8 step types per lesson, with two `read` blocks bookending the active work and *two* `fix` steps (which are the highest-retention type for this audience) in the middle. Every chapter respects this rhythm — even ch16 (the heaviest at 36 steps) is just four canonical lessons stacked. This is the kind of structural consistency that compounds: once a learner has done one lesson, they know exactly what shape every future lesson takes. Cognitive load gets dedicated to the *content*, not to figuring out the *form*. **Don't break this template anywhere.**

2. **The brand-promise framing is in the chapter overviews, not just the marketing.** Every overview I read names the AI-bug pattern up front: ch01 names three (`content/python/01-variables/overview.md:31-35` — name reuse, off-by-one in f-strings, `==` vs `is`); ch13 names three (`13-llm-apis/overview.md:48-54` — forgotten `max_tokens`, dict-vs-list `messages`, reading `content` as string); ch14 names four (`14-structured-output/overview.md:39-47`); ch25 names three (`25-capstone/overview.md:39-44`). This is the single best curriculum-design decision in the project: the overview *names the bugs first* and then the lesson body fixes them. Constructive alignment by design.

3. **The "fix" steps are pedagogically excellent.** Every `fix` step I read is grounded in a real AI failure mode and the bug is on the named `bugLines`. The hint ladder is two levels (concept → exact code), and `revealAfter` is set to 4 or 5 attempts, not zero (which would be hand-holding) and not infinity (which would frustrate). Examples: `01-variables/01-naming-things/06-fix-the-typo.fix.yaml` (NameError from `totl` typo, exactly the AI-shipped bug), `19-prompting/01-the-prompt-craft/06-fix-the-vague-prompt.fix.yaml` (rebuilding a 4-part prompt structure), `25-capstone/01-build-a-cli-agent/07-fix-the-message-append.fix.yaml` (the real two-message append bug Cursor ships).

4. **The capstone exists and integrates.** Ch25 is 5 lessons / 48 steps / 66 minutes, and the lesson titles read like a real product (`01-build-a-cli-agent`, `02-wire-the-real-model`, `03-validate-tool-inputs`, `04-add-evals-and-traces`, `05-wire-an-mcp-tool`). Lesson 1 ends with the learner having written the full agent loop end-to-end (`25-capstone/01-build-a-cli-agent/11-write-the-agent.write.yaml` is a 200-second write-step that builds the for-MAX_TURNS / branch on stop_reason / dispatch tool / append two messages pattern from scratch). This is the share-able artifact the founder rule needs — *"I built a working CLI agent in a browser tab"* is a tweet.

5. **Personalization tokens exist but are restrained.** `lib/content/schema.ts:373-381` defines `{{user.pet}}`, `{{user.team}}`, `{{user.city}}`, `{{user.name}}` — but spot-checking the YAML, almost no lesson uses them. Restraint is correct; over-personalized lessons read as gimmicky and break the share-screenshot moment.

6. **Chapter 1 first-30-seconds reads correctly *if you read the editor first*.** `content/python/01-variables/01-naming-things/01-intro.read.md:5-11` seeds the IDE with a 4-line dict-and-f-string snippet that prints `Alex has 3 tickets left on the free plan.` This is the right hook — it's a real Cursor-shaped output, not `print("hello world")`. The instruction *"Run the editor"* is line 66 of the markdown though (see "Cognitive load" below — this is the friction point).

---

## Constructive alignment — gaps

### ch01-variables / 01-naming-things — alignment is strong, but step 1 buries the action
- **Stated outcome (overview L37-44):** "Read any Python file and answer two questions in under five seconds: which names are valid, and what value does each name point at right now."
- **Activity:** 8 steps that actually drill name validity (mc), rebind reading (predict), name-typo recognition (fix), name-as-f-string-arg (fill), and writing two lines of `name = value; print(f"...{name}")` (write).
- **Assessment (checkpoint L1-23):** `winner_name = player_one`, finish line 4 as `print(f"winner: {winner_name}")`. Tests exactly what was promised.
- **Mismatch:** None on alignment — this lesson is the cleanest in the audit. The friction is purely in step 1's structure: 300 words of essay before "Hit Run" arrives in the very last sentence (line 66). The skill the lesson teaches is reading-on-sight; the step that opens it is reading-300-words.
- **Fix:** The audit-v5 UX note already flagged this. Restructure step 1 to lead with *"Hit Run on the editor on the right. We'll explain what it did after."* Three paragraphs of explanation after, not five. Keep the labels-stuck-on-values mental model — move it to step 3 (the second `read` step), where the learner has already run something. **Effort: 1 hour.**

### ch13-llm-apis / 01-the-messages-pattern — alignment good, but the API call is faked too quietly
- **Stated outcome (overview L57-63):** "Write a single-turn LLM call from memory in Python, hitting either Anthropic or OpenAI."
- **Activity:** All 9 steps work with `fake_create(messages)` and `fake_claude_response` dicts, never `client.messages.create(...)`. The intro explicitly notes *"we can't make real network calls in here"* (`01-intro.read.md:46-48`).
- **Assessment (checkpoint):** `chat(history, new_message)` over a stubbed `fake_create`.
- **Mismatch:** The outcome promises "from memory" — meaning real `import anthropic; client = anthropic.Anthropic(); client.messages.create(...)`. Every step trains on the *response shape* (which is correct) but never types the call shape itself. By the end the learner can read `response["content"][0]["text"]` fluently but has never written `client.messages.create(model=..., max_tokens=..., messages=...)`. The `04-predict` step shows fake response data; the `08-write` step builds an `ask()` wrapper around `fake_create`. The actual API surface is in the overview prose only.
- **Fix:** Add one `read`-with-no-runnable-IDE step (or use the `runnable: false` flag) that puts the real anthropic SDK call in the editor as a non-runnable read-only snippet, then a `fill` step where the learner fills in `model="claude-sonnet-4-6"`, `max_tokens=1024`, `messages=[{"role": "user", "content": question}]`. The point is to make the actual line shape of `client.messages.create(...)` muscle memory, not just the response shape. **Effort: 90 minutes — one new step + one fill step + renumber.**

### ch19-prompting / 01-the-prompt-craft — alignment broken on the `write` step
- **Stated outcome (overview L51-56):** "Look at a vague prompt and rewrite it on the spot using the four-part scaffold."
- **Activity (steps 1-7):** All on-target — `02-which-prompt-is-better.mc.yaml` is a great structure-vs-vague comparison (`prompt_a = "make the orders endpoint better"` vs the four-part `prompt_b`), step 6 rebuilds a missing `constraints`/`format` dict, step 7 fixes a bloated context.
- **Assessment (`08-write-the-prompt.write.yaml`):** Build a function `build_prompt(context, goal, constraints, format)` that returns four `f"context: {context}\n"` lines.
- **Mismatch:** The write step is teaching **f-string string concatenation**, not **prompt rewriting**. The skill being assessed is "build a four-line string with f-strings" — a chapter-1 skill. The skill that was promised is "rewrite a vague prompt on the spot." The lesson says *"This is the hardest-ROI single chapter in the wedge for builders who already use Cursor daily"* and then asks them to do f-string string-building. The chapter is graded on Python craft, not prompt craft.
- **Fix:** Replace step 8 with a `write` step where the learner is given a vague prompt as a string variable (e.g., `vague = "make the orders endpoint better"`) and writes a function `rewrite(vague, file_context, constraint, fmt)` that emits the four-part rewrite. The grader is `stdout-equality` against the expected rewrite. The Python is identical (it's still f-string concatenation under the hood) but the *task* is now prompt rewriting. **Effort: 30 minutes.**

### ch22-context-and-retrieval / 01-orientation — broken alignment by stub
- **Stated outcome (chapter overview L42-44):** "By step 9 you'll have a working RAG pipeline you can adapt to any small corpus, plus the eval pattern to keep it honest as you grow it."
- **Activity (lesson 1):** Single read step with the literal copy *"The lessons in this chapter are coming. The orientation step you're reading is the placeholder while the interactive content is authored."* (`22-context-and-retrieval/01-orientation/01-intro.read.md:11`).
- **Assessment:** None. `runnable: false`.
- **Mismatch:** The overview is shipped, the lesson is not. The learner reads a 700-word promise and lands on a stub apology. Lesson 2 (chunking) is fully built (9 steps, well-designed — the recursive-splitter content is genuinely good), but lesson 1 sets the wrong expectation.
- **Fix:** Two options. **(a) Cut lesson 1**, rename lesson 2's slug to `01-orientation` or absorb its content into the chapter overview, and ship the chapter as a 9-step single-lesson chapter (matches MCP / git-and-github / secrets-and-env / agent-harnesses pattern — chapters that already work as 1-lesson chapters). **(b) Build lesson 1** as the actual orientation: an embedding/cosine-similarity-from-scratch lesson with hardcoded vectors, no real embedding model. Option (a) ships in 1 hour and removes the stub. Option (b) is the right product but is 8-10 hours of authoring. **Recommend (a) for the next ship, schedule (b) for the V1→V2 milestone.** Same recommendation applies to ch23 and ch24, which have identical stub problems.

---

## Cognitive load + step-count audit

The step-count cliffs are real and unbalanced. Bucketed by step count:

| Step count | Chapters | Notes |
|---|---|---|
| 9 steps (single-lesson chapters) | 13, 14, 15, 17, 18, 20, 26 | All in late curriculum. Reasonable for 1-concept chapters (MCP, git, secrets) but **chapters 13 and 14 are flagged** — they're the keystones of phase 3 (LLM APIs / structured output), and 9 steps is undersized for the load they have to carry. |
| 10 steps (stub chapters) | 22, 23, 24 | All half-stubs — see alignment gaps above. |
| 17-18 steps (2-lesson chapters) | 5, 7, 8, 21 | Good fit for their topics. |
| 26-28 steps (3-lesson chapters) | 1, 2, 3, 4, 6, 9, 10, 11, 12, 19 | The bulk of the curriculum. Comfortable load. |
| 36 steps | 16 (agent-loops, 4 lessons, 43 minutes) | **Heaviest pre-capstone chapter by 30%.** |
| 48 steps | 25 (capstone, 5 lessons, 66 minutes) | Appropriate for a capstone. |

**The cognitive-load problem isn't on/off — it's a U-curve.** Phase 1 (foundations, ch01-07) loads 17-28 steps per chapter, ramps gently. Phase 2 (real python, ch08-12) holds 17-27 steps, also fine. Then **phase 3 (LLM APIs, ch13-16) drops to 9 steps for two chapters and then jumps to 36 steps for chapter 16**. That's: ch13 (9) → ch14 (9) → ch15 (9) → ch16 (36). A learner who's been doing 27-step chapters all week hits ch13 expecting another 27-step chapter, finishes in a third of the time, then expects a similar pace at ch14, then ch15, then walks into ch16 which is 4× the length of the previous three. **The phase 3 step-count rhythm is wrong.** Phase 4 (shipping discipline, ch17-24) is more uneven: 9 / 9 / 27 / 9 / 18 / 10 / 10 / 10 — the 27-step prompting chapter sticks out.

**Three cognitive-load fixes:**

1. **Expand ch13 (LLM APIs) from 9 to 18 steps (2 lessons).** It's the load-bearing wedge chapter — the chapter overview itself says *"Every chapter from 14 onward... assumes you can call an LLM and read the response"*. Yet it has half the steps of variables. Add lesson 2: "the real call shape" — `client.messages.create`, `max_tokens`, system prompts, multi-turn, the Anthropic-vs-OpenAI shape difference. That gives it the weight its position in the arc requires.

2. **Split ch16 (agent loops) into 16a (the loop, 18 steps) and 16b (multi-step + routing + evaluator-optimizer, 18 steps).** 36 steps in one chapter at 43 minutes is too long for a single sit-down on lunch break (the stated audience profile). The first two lessons (the loop + multi-step) are the load-bearing core; routing and evaluator-optimizer are advanced patterns that should sit in their own chapter. Alternative: keep one chapter, schedule it explicitly as a "two-session" chapter with a checkpoint at lesson 2/3 boundary.

3. **Fill or cut the three stub chapters (22, 23, 24).** Right now they collectively render as ~30 steps of placeholder text in the middle of phase 4. Recommend cutting each to a single 9-step lesson (matching the MCP/git pattern) by absorbing the orientation content into the chapter overview. This unifies phase 4's rhythm at 9-or-18 steps per chapter.

**A note on per-step duration.** `estSeconds` ranges from 35 (the simplest mc) to 200 (the capstone agent write). The schema cap is 300s (5 min). Spot-checking the yaml, `read` steps cluster at 60-120s, `mc` at 35-60s, `predict` at 60-90s, `fill` at 50-80s, `fix` at 75-95s, `write` at 90-200s, `checkpoint` at 120-180s. These are reasonable. The cumulative chapter `estMinutes` is honest (chapter 1 at 22 minutes for 26 steps = ~50s/step average, which matches sample-step measurements).

---

## Brand-fit scoring per chapter (1-5)

How strongly does each chapter tie to the brand promise *"AI writes this. It's wrong."*

| # | Chapter | Score | Note |
|---|---|---|---|
| 1 | variables | **4** | Overview names 3 AI bug patterns up front; lessons drill all 3. Strong. |
| 2 | functions — and the most-hallucinated bug AI ships | **5** | The chapter title *is* the brand promise. Strongest brand-fit in the curriculum. |
| 3 | lists and dicts — the bones of every API | **4** | Frames every JSON-from-AI as the load-bearing payload. |
| 4 | loops — predict the output | **3** | Brand line in title (*"AI writes a loop every time you say for each. Half the time it's wrong by one."*) but the lesson content slides toward generic-loop teaching. |
| 5 | conditionals — where AI silently bugs | **4** | Truthiness lesson is precisely the brand promise; pattern-match lesson less so. |
| 6 | tracebacks — Cursor wrote this and crashed | **5** | Title is brand promise. The audit-sampled `06-tracebacks/01-reading-the-stack/01-anatomy.read.md` opens with *"You ask Cursor for some code. It runs. It crashes."* — exactly the framing the brand requires. |
| 7 | mutation — why your code mysteriously breaks | **4** | Identifies mutation as the longest-to-find AI bug class. |
| 8 | modules-and-imports | **3** | Frames as "half of `pip install x` failures" — present but quieter brand-fit. |
| 9 | error handling — when AI's code crashes mid-flight | **4** | "AI loves a happy path" is a brand line. |
| 10 | files and I/O | **2** | Brand-fit drops here. The overview promises "the few patterns AI reaches for and the one it forgets" but generically Python-tutorial-shaped from here on. |
| 11 | classes — reading what AI just wrote you | **4** | Frame is *reading* AI-shipped classes, not designing your own. Holds the brand line. |
| 12 | http and APIs | **3** | Generic API tutorial with light AI-frame. |
| 13 | LLM APIs | **5** | Cannot avoid being on-brand — it's literally the AI-API chapter. |
| 14 | structured output | **5** | Opens with *"You ship it. Three weeks later... Different keys. Different types. Things crash."* — pure brand. |
| 15 | MCP | **4** | Slightly outside the "AI writes this. It's wrong" frame (it's tooling, not bugs) but the *"confusing client and server"* AI-mistake is on-brand. |
| 16 | agent loops | **5** | The chapter that names the agent-as-while-loop demystification. Highest payoff per step. |
| 17 | git and GitHub CLI | **4** | *"Cursor and Claude Code commit on your behalf"* — brand line. |
| 18 | secrets and .env | **5** | *"AI ships keys to GitHub all the time"* — credibility-building, share-able. |
| 19 | prompting | **5** | The *"this is half your job"* chapter. Highest leverage. |
| 20 | agent traces | **4** | Reading-the-trace is on-brand, but the chapter is one lesson and feels skimpy. |
| 21 | evals | **3** | Brand line *"if you can't test it, you can't ship it"* but the content slides toward generic eval/test discipline. |
| 22 | context and retrieval | **2** | Half-stub. Overview is on-brand; lesson 1 is a placeholder; lesson 2 (chunking) is excellent but solo. |
| 23 | production tradeoffs | **2** | Half-stub. |
| 24 | debugging output | **3** | Half-stub. The framing *"when the model lies to your customer"* is the strongest brand line in the late curriculum but the lesson 1 content is missing. |
| 25 | capstone | **5** | The integration moment. Ships the brand promise. |
| 26 | agent harnesses | **4** | Demystification of Cursor / Claude Code internals — share-able framing. |

**Aggregate read.** The brand promise is strong in chapters 1-7 (foundations, all 3-5), strong again in chapters 13-19 (the LLM/AI core, all 4-5), and weakest in chapters 8-12 (real Python, 2-4) and 22-24 (the stub chapters, 2-3). The "generic Python tutorial" risk is concentrated in chapters 10 (files), 12 (HTTP), and 21 (evals) — these are the three chapters where the brand line in the overview doesn't follow through into the lesson body.

---

## "If you ship one lesson rewrite" — the single highest-leverage rewrite

**Rewrite chapter 19 lesson 1 step 8 — `19-prompting/01-the-prompt-craft/08-write-the-prompt.write.yaml`.** It's the assessment for the chapter the founder describes as *"the highest-ROI single chapter in the wedge for builders who already use Cursor daily"* (`19-prompting/overview.md:57`). And the assessment tests f-string string concatenation. The skill *taught* (recognize a vague prompt, rewrite it as a four-part scaffold) is on-brand and share-able; the skill *measured* is generic Python.

**The rewrite:** Same starter shape — but the prompt asks the learner to take a `vague` string variable and *return* a four-part rewrite. The grader is `stdout-equality` against a known-good rewrite of a real-shaped vague Cursor prompt (`"make the api faster"` → `"context: app/api/orders.py · goal: reduce p95 by 30% · constraints: keep existing pool · format: diff only"`). The Python underneath is f-string formatting, identical to the current step. The *task* is now the brand-promise skill.

**Why this beats other candidates.** The capstone is excellent and the chapter 1 step 1 problem is mostly UX. Chapter 22-24 stubs are a content problem, not a rewrite problem (they require new authoring, not a rewrite). Chapter 13 lesson 1 is undersized but its checkpoint is fine — the gap is a missing step, not a wrong step. Chapter 19 has a precisely wrong assessment in the precisely most-leveraged chapter. **Effort: 30-45 minutes. Payoff: the highest-stakes assessment in the curriculum starts measuring what the chapter promised.**

---

## "If you cut one chapter" — the weakest chapter and what would replace it

**Cut chapter 21 (evals) as a separate chapter.** Reasons:

1. **Brand-fit score 3.** It's framed as eval discipline (*"if you can't test it, you can't ship it"*) but doesn't have the AI-bug-shaped content the rest of the curriculum has.
2. **Two lessons / 18 steps / 21 minutes** — meaningful real estate for content that is essentially "here's how to write a unit test for a model output." Most of the audience already writes tests at work.
3. **The capstone (ch25 lesson 4 — `04-add-evals-and-traces`) already covers evals in the integrated context** the audience cares about. Teaching evals first (in ch21) and then re-using them in ch25 is the right *pedagogy* on paper, but in practice the capstone re-teaches the same patterns because the learner has been through 4 chapters of unrelated material since ch21. The repetition isn't compounding — it's redundant.
4. **The 21 minutes ch21 currently consumes are exactly the budget needed to fill ch22-24 stubs.** Reallocate ch21's authoring effort to filling one stub properly (recommend ch24 / debugging broken AI output — the highest-brand-fit stub at 3/5).

**Replacement.** Repurpose the slot as an extension of ch20 (agent traces) — call it *"reading traces, scoring outputs"* — that combines the trace-reading skill with the eval pattern in a single 18-step chapter. The eval pattern *as applied to* trace output is on-brand (*"the agent ran. how do you know if it ran right?"*) in a way that generic eval discipline isn't.

**Counter-argument I considered.** Chapter 21 *is* on the founder's stated path (eval-driven development is in `phases.ts:62` as an explicit phase 4 topic). Cutting it would mean cutting an explicit author-intent chapter. Mitigation: don't cut the *content*, fold it into ch20. The phase blurb still reads correctly: *"shipping discipline: git, secrets, prompting, traces, evals, retrieval, tradeoffs"* — evals are still in the phase, just not as their own chapter.

**Alternative cut, if "cut a stub" is allowed:** cut ch23 (production tradeoffs) entirely. It's the lowest-immediate-utility for the audience (cost/latency/quality math is something most of the audience won't apply for months) and its 2/5 brand-fit confirms it can wait. Replace with deeper ch22 content (RAG actually shipped) which has both higher brand-fit and higher immediate utility.

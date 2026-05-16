# Content & Curriculum Team — Recon Findings

**Author:** Content & Curriculum agent team
**Date:** 2026-05-15
**Branch:** `content-team/recon-and-paths`
**Status:** Recon complete. Four decisions needed before mass content production.

---

## 0. TL;DR

The brief is accurate about the curriculum (31 chapters, 00–30, all built and on
disk at `content/python/`). It is **not** accurate about a few things it assumes
already exist, and it conflicts with the repo on two voice/pricing points. None of
this is fatal. It just means four decisions have to happen before we author 4 new
chapters and split 31 existing ones, because guessing wrong on any of them is a
rewrite of hundreds of files.

What got built this session without needing those decisions:

- This findings memo.
- `docs/plan/CAREER-PATHS.md` — the ten-path → chapter mapping (Task 6 draft v1).

What is parked pending decisions: Tasks 1, 2, 3, 7, 8 (all chapter and copy work).

---

## 1. What I verified

- **Repo:** `~/Developer/promptdojo`, branch `main`, clean.
- **Real curriculum** lives at `content/python/` — 31 chapter folders, `00-before-you-build`
  through `30-harness-engineering`. This matches the brief's inventory exactly.
- **The root folders `01-getting-started/`, `02-variables-and-types/` … `17-inheritance-and-dunders/`
  are stale legacy content** (pure-Python syntax course, last touched Apr 29, pre-rewrite).
  They are not the live curriculum. Do not edit them. They should probably be deleted, but
  that is a Platform-team call.
- **Authoring format** (confirmed against `content/python/00-before-you-build/`):
  - `chapter.yaml` — `number`, `slug`, `title` (lowercase), `blurb`, `lessons:` (list).
  - `overview.md` — plain markdown, no frontmatter.
  - `<lesson>/lesson.yaml` — `slug`, `title`, `estMinutes`, `prerequisites`, `order:` (list of step files).
  - Step files: `NN-name.read.md`, `.mc.yaml`, `.fill.yaml/.md`, `.predict.yaml`, `.fix.yaml`,
    `.write.yaml`, `.reorder.yaml`, `.checkpoint.yaml`. Schema is in `docs/plan/MASTER-PLAN.md` §3.
  - `.read.md` files carry YAML frontmatter (`xp`, `estSeconds`, `concept`); other steps put
    those fields at the top level of the YAML.
- New chapters slot in by adding a folder to `content/python/` and registering it in
  `lib/phases.ts` (see git commit `b76d2aa` for how ch00 and ch26–30 were registered).

## 2. The brief is ahead of the planning docs

`docs/plan/01-product.md` and `docs/plan/MASTER-PLAN.md` are both dated **2026-04-29** and
describe an *earlier* product: an 8-lesson MVP, "code killa" working name, the single ICP
"Maya the AI-curious PM", V1/V2/V3 phasing, free + OSS through V2.

The repo has since blown past that plan — 31 full chapters shipped, `app/pro/` route,
SEO pages, multiple adversarial review passes. **The brief describes a third, newer vision**
(ten career paths, A/B chapter versioning, placement surveys, corporate seat pricing) that
exists *only in the brief*. It is not written down anywhere in `docs/plan/`.

Consequence: when Task 6 says "the current path mapping is in the master plan," **there is
no path mapping in the master plan.** The master plan has no career paths at all. So Task 6
is not "audit and refine an existing mapping" — it is "create the mapping from scratch."
I have done a first draft (`CAREER-PATHS.md`); it needs Josh's sign-off, not a light edit.

**Recommendation:** treat the brief as the current north star, and once the four decisions
below are locked, update `MASTER-PLAN.md` (or write a `MASTER-PLAN-V3.md`) so the Platform
team is building against the same picture we are.

## 3. Decisions needed before content production

### Decision 1 — Em dashes (affects every deliverable)

The brief says **"NO em dashes EVER."** The repo says the opposite. `design-kit/VOICE.md`
explicitly endorses them ("Em dashes for asides. Hard breaks, not soft.") and all 31 existing
chapters use them heavily — the ch00 lesson prose is full of them.

If new chapters drop em dashes, they read subtly different from the other 31. If Task 3
(split all 31 chapters) is also meant to strip em dashes, that is a large rewrite of the
existing corpus on top of the A/B split.

This needs an explicit call because it touches every single file. My recommendation:
**follow the brief — kill em dashes everywhere, and update `VOICE.md` to match.** A clean
"commas, periods, parentheses" rule is enforceable and the brief is the newer instruction.
But it is Josh's call, and it is not safe to guess.

### Decision 2 — Pricing model (affects Tasks 7 and 8)

Three different pricing models are live across three sources:

| Source | Model |
|---|---|
| `docs/plan/01-product.md` (Apr 29) | free + OSS; optional paid tier at V3 ($7/mo, $49/yr) |
| Memory note + repo `app/pro/` route | freemium: free 3-chapter web preview + paid native app ($9.99/mo, $59/yr, $129 founders) |
| **This brief** | free for individuals forever; corporate-only paid ($300–500/seat/yr); remove the individual paid tier |

The brief's model contradicts what is currently deployed (`app/pro/` sells the native app)
and what I had on record from ~last week. Task 7 explicitly says to remove the
`$9.99/$59/$129` tier from the homepage. That is a real business-model pivot with high
blast radius — it changes the homepage, all launch marketing, and requires the Platform
team to pull the `/pro` route.

**I will follow the brief** (free individuals + corporate seats) when I get to Tasks 7/8,
but flagging it so Josh can confirm the pivot is intentional and not a stale assumption
baked into the brief. Confirm before I write homepage/marketing copy.

### Decision 3 — Body-header casing

The brief says "all chapter titles, section headers, and copy in lowercase." The repo only
lowercases `chapter.yaml` titles/blurbs and the site's chapter labels. **Markdown body
headers inside lessons are sentence-case** (`# You didn't get replaced because you weren't good`).
I will match the repo (lowercase chapter titles, sentence-case body headers) unless told
otherwise — going full-lowercase on body headers would make new chapters inconsistent with
all 31 existing ones. Low stakes, but noting it so there are no surprises.

### Decision 4 — Path mapping approval gate

`CAREER-PATHS.md` (this branch) is a draft. Tasks 3 (A/B routing), 5 (ten path quizzes),
and 6 all sit on top of it. I should not build ten placement quizzes against a path mapping
Josh has not seen. **Please review `CAREER-PATHS.md` and approve or redline before I build
the quizzes.**

## 4. Scope reality and proposed sequencing

This brief is a multi-week program, not a one-session job. Rough file counts:

- Task 1 — 3 CLI chapters × ~22 steps ≈ **75+ files**
- Task 2 — 1 chapter × ~28 steps ≈ **32 files** (plus real research)
- Task 3 — 31 chapters × 2 versions ≈ **hundreds of files** (the "biggest content lift," per the brief)
- Task 4 — 1 survey JSON
- Task 5 — 10 quiz JSONs
- Task 6 — done (draft, this branch)
- Task 7 — homepage copy
- Task 8 — launch marketing (Twitter, LinkedIn, one-pager, emails)

Proposed order (dependency-driven, not brief order):

1. **Decisions 1–4 locked** (this memo).
2. **Task 1** — 3 CLI chapters. Build the first (Intro to Terminal) complete, get Josh's
   voice sample-check, then build the other two. Unblocks the Developer Path.
3. **Task 2** — Anthropic Team Skills chapter (needs web research first).
4. **Task 4 + Task 5** — surveys and quizzes (depend on the approved path mapping).
5. **Task 7** — homepage copy (depends on Decision 2).
6. **Task 8** — launch marketing (depends on Decision 2; prior art exists in
   `LAUNCH_TWEETS_V2.md` and `docs/plan/LAUNCH-V2.md`).
7. **Task 3** — A/B split of all 31 chapters. Biggest lift; do it last, in chapter batches,
   each batch through the pedagogy-review pass the curriculum design principles require.

## 5. Coordination notes for the Platform team

- We need their final content-delivery spec: directory layout for A/B versions, metadata
  schema (how a chapter declares it has an A and a B variant), and the survey/quiz JSON
  schema they will consume.
- We need their placement-quiz scoring hook so our scoring rubric plugs into it.
- They need to know `app/pro/` is slated for removal if Decision 2 confirms the brief's model.
- Suggest a shared `MASTER-PLAN-V3.md` once decisions land so both teams build from one doc.

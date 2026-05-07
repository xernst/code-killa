# Engagement Loop Audit
_Date: 2026-05-07_

Scope: the lesson loop as gameplay. Every observation grounded in source. The
brand voice is anti-shame, anti-streak-guilt, anti-marketing — game-design fixes
must respect that. Audit-v5 covered the welcome surface; this picks up where
the user actually spends 8–15 hours: inside the step.

---

## The loop, narrated (one full lesson, moment to moment)

**T+0s — Land on step 1.** Header reads `lesson 1 of N · naming-things` plus a
1-pixel-high green progress bar that ticks `1/N`
(`LessonStepClient.tsx:240`). Right pane shows the IDE booting
("booting python… → loading wasm… → press run · ⌘↵") via
`PersistentIDE.tsx:86-90`. Daily-goal dial sits in the top-right of the prompt
panel (`LessonShell.tsx:59`) showing `0 / 10 min`. No celebration on entry —
which is correct; the user hasn't earned anything yet.

**T+0–30s — Read.** Step type dictates the surface. On a `read` step the user
sees ~300 words of markdown; the Continue button is enabled from frame one
(`LessonStepClient.tsx:285` — `disabled={!passed && step.type !== "read"}`). On
a `mc`/`predict`/`fix`/`write` step the surface includes a Submit/Check button
that gates Continue. Average time-to-first-meaningful-input: 3–6 seconds on MC
(scan options), 8–15 seconds on predict (read code, type guess), 20–60 seconds
on write/fix (read prompt, edit code).

**T+~10s — First Run.** ⌘↵ inside the editor triggers
`PersistentIDE.handleRun()` (`PersistentIDE.tsx:159`). Pyodide is preloaded by
the home page, so cold-start is hidden; warm runs report
`✓ ran in <ms>` (`PersistentIDE.tsx:330-336`). Time-to-result: typically
50–400ms on warm Pyodide, sub-second perceived. Output streams to a black
terminal pane with a green `❯` and a blinking `_` cursor when idle
(`PersistentIDE.tsx:352`). **This is the loop's strongest moment.** It is
genuinely satisfying — the terminal idiom, the green ✓, the latency.

**T+~15s — Submit / Check.** On a graded step the user clicks the step view's
Submit button. The view runs `gradeRunResult(step.grader, result)`
(e.g. `WriteStepView.tsx:38`). On pass: a green badge appears below — copy
ranges from `That's the one.` (`WriteStepView.tsx:91`) to
`Runs clean now.` (`FixBugStepView.tsx:105`) to `Locked in. That's the lesson.`
(`CheckpointStepView.tsx:103`) to `Right.` (`MultipleChoiceStepView.tsx:127`).
On fail: a grey-bordered card surfaces the grader's reason
(e.g. `WriteStepView.tsx:91`). **No animation, no sound, no haptic — just the
inline diff in copy.** Per brand voice this is correct.

**T+~16s — Continue.** Footer copy flips from `⌘↵ runs the editor.` to
`locked in. move on when you're ready.` (`LessonStepClient.tsx:269-273`). The
green Continue button enables. The user clicks (or ⌘↵s) and routes via
`router.push(...)` to the next step path. Re-enter at T+0 of the next step.

**T+~5–12 min — Lesson end.** After the final step in a lesson passes,
`markLessonComplete(...)` fires (`LessonStepClient.tsx:140`). **Nothing visible
happens.** The Continue button still says `continue →` and the user is routed
to step 0 of the next lesson — no lesson-end card, no "you finished
naming-things," no XP totalizer victory frame, nothing. The breadcrumb header
silently changes from `lesson 1 of 8` to `lesson 2 of 8`. Lesson completion is
a state-machine event with no game-design surface.

**T+~30–90 min — Chapter end.** On the last step of the last lesson in a
chapter, after the user passes, `ChapterEndCard` renders
(`LessonStepClient.tsx:256-264`). Eyebrow: `chapter complete.` Headline: `you
finished <chapter>.` Copy pitches the @TFisPython follow with a concrete
hook ("tomorrow's ai-shipped bug…"). A frozen flame is granted via
`grantFrozenFlame()` (`LessonStepClient.tsx:148`) — but the StreakWidget is
in the page header above the lesson shell, not in the chapter-end card itself.
**The reward animation for "you just earned a frozen flame" doesn't exist —
the snowflake counter in the header silently increments.** The button ladder
is `follow @tfispython →` and `back to home`. The Continue button below still
reads `that's all of it →` and routes to `/`.

---

## Where the loop succeeds (do not break in any redesign)

1. **Time-to-result on Run.** Sub-400ms warm Pyodide + the terminal idiom
   (green `❯`, blinking `_`, `✓ ran in 47ms`) is the single most satisfying
   moment in the product. `PersistentIDE.tsx:325-345`. This is the
   "fun hypothesis" — protect it.

2. **Editor never empties between steps.** The IDE persists drafts keyed by
   filename across step transitions (`PersistentIDE.tsx:123-141`) so a learner
   moving from step to step inside one lesson never loses the editor's
   context. This is invisible engineering and exactly right.

3. **Pyodide preloader is invisible.** The `usePyodide` warmup means by the
   time the user clicks Run on step 1, the worker is already booted. The
   "did it work?" gap that competitors live in (Codecademy's loading spinners,
   Replit's container boot) doesn't happen here.

4. **HintReveal escalation is well-designed.**
   `_HintReveal.tsx:51-68` reveals one hint at a time, tracks the highest
   level used, and the amber palette signals "help, not failure." No "you
   needed a hint" shame copy. Excellent.

5. **Failure copy is dry, not punitive.** "Not that one." / "Not yet — read
   the line above the blank." / "Order isn't quite right yet — read
   top-to-bottom." These are coach voices, not parent voices. On-brand.

6. **Frozen flames are earned, not bought.** `lib/streaks.ts:5-9` makes the
   anti-Duolingo positioning explicit in code. Embers absorb missed days
   automatically. There is no gem economy. **This is the brand's most
   defensible game-design choice.**

7. **Welcome-back card never shames.** `HomeClient.tsx:103-130` shows
   `welcome back · ch X · step Y of Z · last visited 3d ago` — recency is
   neutral data, never "you missed N days." `lib/streaks.ts:7-8` documents
   this as policy. Per brand voice exactly right.

8. **Brain Dump (⌘⇧B).** `BrainDump.tsx:14-24`. The keyboard-only "park a
   thought, get back to the lesson" is the most ADHD-respecting gesture in
   any code-learning product I've audited. Underused, see gap §9.

---

## Where the loop breaks down

### 1. The lesson-end celebration doesn't exist
- **Where:** `LessonStepClient.tsx:138-150`
- **Lived experience:** The user finishes step 8 of 8 in `naming-things`. Pass
  badge says `That's the one.` The footer says `locked in. move on when
  you're ready.` They click Continue. The route changes. The breadcrumb
  silently advances from `lesson 1 of 8` to `lesson 2 of 8`. No "you
  finished naming-things." No micro-tally ("8/8 steps · 80 XP · 12 min").
  No moment to take a breath. The macro-loop has no payoff between
  step-end and chapter-end.
- **Game-design diagnosis:** The session loop (5–12 steps) has no resolution.
  In Duolingo, Boot.dev, Codecademy, Brilliant — every one of them gives a
  lesson-end card. It's the unit at which the player consolidates effort
  into accomplishment. The micro-loop (one step) and the long-term loop
  (one chapter, one phase) both have surfaces. The session loop is naked.
  **This is the largest hole in the engagement design.**
- **Fix sketch:** Render a lesson-end card when `next === null` AND there
  are more lessons in the chapter (today only the chapter-end card renders
  in this slot). One frame: `you just finished <lesson>.` micro-tally
  (steps, time, hints used or "no hints — clean run"), one button: `next
  lesson · <next lesson title> →`. Anti-shame: never show "you got X
  wrong." Show "X attempts" only if it's a story to tell ("nailed it on
  attempt 1" earns a flourish; otherwise stay silent on misses). 2–3 hours.

### 2. StepFooter is dead code; the lesson XP bar isn't rendered
- **Where:** `StepFooter.tsx:1-142` is never imported. The actual footer is
  inline in `LessonStepClient.tsx:267-292` and only contains
  `TweetThisStep + Continue`.
- **Lived experience:** The progress bar at the top of the lesson is
  step-position-based (`(stepIndex + 1) / totalSteps`,
  `LessonStepClient.tsx:240`) — it advances even if the user skips. There's
  no XP bar, no hint button at the footer level, no skip button at all.
  The user can't see how much XP this lesson is worth or how much they've
  banked toward today's goal. The DailyGoalDial is the only XP surface
  visible during a step (`LessonShell.tsx:59`) — and it shows `min`, not
  XP.
- **Game-design diagnosis:** The lesson XP bar is the single most reliable
  variable-reward channel a learning game has. Each pass nudges the bar.
  At 100% the bar fills green and the user feels a small ding. Without it
  the only game-feel signal during the lesson body is the daily-minutes
  ring quietly creeping up — and that ring resets every midnight, so it
  doesn't feel like progress *through this lesson*.
- **Fix sketch:** Either delete `StepFooter.tsx` (today, 5 min — it's
  noise) or wire it. If wiring: render the lesson XP bar (sum of passes in
  this lesson / total steps) at the bottom of the prompt panel. Replace
  `TweetThisStep + Continue` with `XP-bar + TweetThisStep + Continue`.
  Drop the "skip" button — this product's voice doesn't support skipping
  a learning step, and `setStepSkipped` exists in storage but no UI calls
  it. **2 hours.**

### 3. The Run-then-Submit double-click on graded steps
- **Where:** `WriteStepView.tsx:29-48`, `FixBugStepView.tsx:33-53`,
  `CheckpointStepView.tsx:29-48`, `PredictStepView.tsx:28-44`.
- **Lived experience:** On a write/fix/checkpoint step the user must
  internally model a two-step submit: (1) "do I press Run to see output, or
  (2) press Submit which runs AND grades?" Both buttons exist. Submit
  invokes `ide.run()` internally, so a learner who pressed Run, then
  Submit, runs the code twice (~50–800ms total wait). The status copy in
  the IDE pane (`✓ ran in 47ms`) and the grader badge in the prompt pane
  (`That's the one.`) duplicate the success signal — the user isn't sure
  which one to look at first.
- **Game-design diagnosis:** Two buttons that do overlapping things split
  the "moment of truth." Boot.dev and Codecademy collapse this to one
  button (Run = Submit; the grader runs after every Run). The current
  design preserves a Codecademy "play with the editor before submitting"
  affordance but at the cost of clarity. The peak-emotion moment of "did
  it pass?" is therefore visually fragmented across two panes.
- **Fix sketch:** Three options ranked by ambition.
  (a) **Smallest:** rename `submit` → `submit & check` and unify the result
      panel — render the pass/fail badge inside the IDE output panel
      (`PersistentIDE.outputBadge` prop already exists, line 79; nobody
      wires it). 2 hours.
  (b) **Medium:** auto-grade after every Run on write/fix/checkpoint
      steps — show the pass badge but DON'T auto-advance, so the user
      still presses Continue intentionally. Keeps the editor-poking
      affordance, removes the second click. 4 hours.
  (c) **Big:** add a sub-second "you got it" flourish — green flash on the
      output pane edge, single-line dry copy ("clean."), then enable
      Continue. The flourish is a reduced-motion-respecting CSS
      transition. 6–8 hours.

### 4. The "did the IDE work?" gap on cold step entry
- **Where:** `PersistentIDE.tsx:86-90, 287-298` + `LessonStepClient.tsx:20-37`
- **Lived experience:** First step of a session, cold cache: the dynamic
  import of CodeMirror runs (the loading skeleton at lines 20–37 shows for
  ~200–600ms) then Pyodide boots (`booting python… → loading wasm…`,
  another 1–3 seconds depending on connection). On a `read` step the user
  can read while it warms. On `predict`/`mc` steps that don't need the
  editor, the editor still mounts and shows the boot state — even though
  the user doesn't need it. The Run button is disabled (visual: a spinner)
  until ready, but a fast-typing learner who just pressed `1` then `Enter`
  on an MC step can submit before the editor is ready and never notice.
- **Game-design diagnosis:** This is mostly already-good engineering — but
  on `read`/`mc`/`predict` steps the IDE boot cost is non-negotiable cost
  with no reward. On a phone-on-laptop session-resume the cold load shows
  for 1.5s before the user can do anything. The fix isn't to make it
  faster (already fast); it's to *hide the cost on steps where the editor
  isn't the point*.
- **Fix sketch:** On `mc` and `predict` steps where the editor body is
  decorative ("here's the code we're talking about; press Run only if you
  want to verify"), demote the editor: render it collapsed by default
  with a "show editor" disclosure. The boot state still happens but
  doesn't dominate the screen. Reserve full-IDE primacy for `write` /
  `fix` / `checkpoint`. 4–6 hours.

### 5. Variable rewards are bunched, not spaced
- **Where:** the entire reward economy.
- **Lived experience:** Every step pass earns +10 XP (`lib/streaks.ts:19`).
  Every 30 XP/day banks 1 ember (max 2). Every chapter completion grants 1
  frozen flame. **All other steps are flat.** No surprise drop, no rare
  variant, no "bonus" beat. A user can do 50 steps in a row and get the
  same 10-XP-and-green-badge response 50 times. The only variable reward
  in the system is the chapter-end, which is ~30 steps apart on average.
- **Game-design diagnosis:** Fixed-ratio reinforcement is the weakest
  schedule. Variable-ratio is the addictive one. The brand correctly
  rejects gem-store coercion, but variable reward ≠ Skinner-box manipulation
  — it can be earned authenticity (a streak-of-3-passes-in-a-row gets a
  one-off "no hints, three-in-a-row, clean." line; a fix-bug step that
  passes on attempt 1 gets a different copy than a fix that took 4
  attempts; once-per-lesson the reward copy slots in a personal-tier line
  drawn from a small library).
- **Fix sketch:** Author 8–12 dry, on-brand "flourish" copy variants and
  pick by deterministic-but-feels-random rules. Examples:
  - Pass on attempt 1, no hints: `clean.` (neutral) → 90% of the time
  - Pass on attempt 1, no hints, third in a row: `three clean.`
  - Pass on a fix step under 30 seconds: `fast read.`
  - Pass on a checkpoint: `lesson sealed.` (already exists, keep)
  - Pass on the last step of phase 1 (foundations): `you just cleared
    foundations. that's the python part. the rest is shipping discipline.`
  Every variant must be voice-true. **6 hours.**

### 6. The streak system is well-designed but invisible at the moment of work
- **Where:** `StreakWidget.tsx` + `lib/streaks.ts` + `LessonShell.tsx`
- **Lived experience:** During the actual lesson, the StreakWidget is
  rendered in the *site* header (visible on home/about/curriculum) but
  NOT inside `LessonShell.tsx` — the lesson view replaces the site header
  with its own header (`LessonStepClient.tsx:185-243`) that doesn't include
  the widget. The DailyGoalDial does render in the lesson header
  (`LessonShell.tsx:59`), so the user sees today's-minutes but NOT current
  streak / embers / frozen-flames during a session. The streak is
  effectively a home-page widget. When the user banks XP that promotes
  them to a new ember (e.g. crossing 30 XP today = 3 passes), nothing
  fires — no toast, no animation, no "you banked an ember" beat. The
  ember just exists next time they visit the home page.
- **Game-design diagnosis:** Two failures stacked. (a) The reward of
  "earning an ember" is invisible at the moment it's earned; the user
  sees it later out of context. (b) During a session the user has no
  awareness of the streak they're protecting, so "I should keep going to
  protect my streak" — the very motivation the system exists to deliver
  — never fires.
- **Fix sketch:** Inline a *minimal* streak surface in the lesson header
  alongside the DailyGoalDial — flame + count + ember count, no XP
  number, no snowflake (chapter-trophies belong on the chapter-end card).
  When `awardPass()` crosses an ember threshold, flash a one-second toast
  near the dial: `+1 ember · banked.` Reduced-motion: skip the toast,
  silently update. **3 hours.**

### 7. Share triggers fire at the wrong emotional moment
- **Where:** `TweetThisStep.tsx:43-67` rendered always in
  `LessonStepClient.tsx:275-281`.
- **Lived experience:** The "tweet this bug" link sits in the lesson
  footer at all times — including before the user has solved the step.
  A frustrated learner stuck on a fix-bug step at attempt 3 sees the
  share CTA at the same visual weight as when they're celebrating a
  pass. Even worse: the tweet copy ("ai-shipped python bug. caught in
  90 sec.") implies success, so a struggling user who clicks it would
  be sharing a victory frame they haven't earned.
- **Game-design diagnosis:** Peak-emotion-share is a known pattern (Wordle,
  Duolingo, Strava). Share moments must fire AT the peak, not before.
  Rendering the share affordance pre-pass is at best wasted pixels; at
  worst it's tonally tone-deaf when the user is grinding.
- **Fix sketch:** Gate `TweetThisStep` on `passed === true`. Pre-pass,
  render nothing in that footer slot (or an XP/lesson-progress hint). On
  pass, the share appears next to Continue. Better: **the first time per
  session** the user passes a step, animate the share button in (1s fade)
  to draw attention. Subsequent passes show it without animation —
  variable-spacing. **1 hour.**

### 8. No retry friction-removal — the user has to manually re-edit on fail
- **Where:** `WriteStepView.tsx:29-48`, `FixBugStepView.tsx:33-53`. After
  a failed grade, the user re-clicks into the editor pane and edits.
- **Lived experience:** On fail, the grader badge shows (e.g. `Expected
  output: 42 — got: 41`). The IDE retains the user's code. The user
  scrolls/clicks back to the editor, edits a line, re-runs, re-submits.
  Time-to-retry: 5–15 seconds. Friction is mild but the path is
  unguided — no "press R to reset to starter" affordance, no "your last
  three submissions" diff, no "undo my last attempt." If the user goes
  too far down a wrong path they may want to start over from the
  starter code; `PersistentIDE.reset()` exists (`PersistentIDE.tsx:204-210`)
  but no UI exposes it.
- **Game-design diagnosis:** Failure recovery is a feel-good moment in
  Mario-style games — die, respawn 1 second later at checkpoint, retry.
  Here, retry is fine but unsupported. The "I want to nuke my work and
  try again" affordance is invisible.
- **Fix sketch:** Add a `reset starter` link in the IDE run-bar (next to
  the Run button) on `write`/`fix`/`checkpoint` steps. Confirm-on-click
  ("clear your code? this can't be undone"). Voice it dry: `reset to
  starter`. Single keyboard shortcut: ⌘⇧R. **2 hours.**

### 9. Brain Dump is invisible during the moment it'd actually fire
- **Where:** `BrainDump.tsx:46-55` renders a fixed-position pill at the
  bottom-right of every page. On the lesson page it's hidden behind the
  IDE pane on small viewports and competes with the output pane on
  desktop.
- **Lived experience:** A PM-learner mid-step has an intrusive thought
  ("I should email Sarah about the deck"). They lose 10 seconds context-
  switching to remember to handle it. ⌘⇧B exists but discoverability is
  zero — there's no in-product hint that this shortcut exists during the
  lesson. The pill is below-the-fold or off-screen. The first time a
  user sees it might be never.
- **Game-design diagnosis:** A "park a thought without losing your
  place" affordance is brand-defining — but a brand-defining feature
  hidden behind a never-discovered keyboard shortcut is wasted. ADHD
  learners specifically need this surfaced.
- **Fix sketch:** On the FIRST lesson step a session, render a one-line
  ribbon above the prompt: `mid-step thought? ⌘⇧B parks it. keep
  reading.` Dismiss-once via localStorage flag. Or: surface the pill
  inside the lesson shell's prompt-panel header, not bottom-right.
  **2 hours.**

### 10. The capstone arc has no narrative
- **Where:** `lib/curriculum/phases.ts:75-80` + `app/about/page.tsx:65`
- **Lived experience:** The about page promises "ship a cli agent by
  chapter 25." Mid-curriculum, there's no in-product reminder of where
  the user is in that arc. Phase 1 (`foundations`) ends at chapter 7.
  Nothing fires when the user finishes phase 1. The breadcrumb says
  `phase 01 · foundations` (`LessonStepClient.tsx:213-216`) but no event
  marks "you cleared a phase." When chapter 25 (the capstone) finally
  drops, the user lands on it like any other chapter.
- **Game-design diagnosis:** The capstone is the long-term loop's final
  payoff. A 25-chapter arc with no narrative beats between phase 1 and
  the capstone is a 30-hour slog with one credit roll at the end. The
  brand promises "ship a working cli agent" — the curriculum should
  cinematically deliver on that promise, not just terminate in chapter
  25.
- **Fix sketch:** Author phase-end cards (5 total — foundations, real
  python, llm apis, shipping discipline, capstone). Render when the
  user passes the last step of the last lesson of the last chapter in
  a phase. Copy treats the moment as a milestone:
  `phase 01 cleared · foundations.
  you can now read python. the rest is what to do with it.`
  Voice-true, no fanfare. Phase 5 (capstone) doesn't get a card because
  the capstone IS the payoff — instead, the post-chapter-25 ChapterEndCard
  switches `isCourseEnd` copy to a different beat (already wired in
  `ChapterEndCard.tsx:25-26` — currently just says "you finished the
  course." — flesh this out into a proper "you shipped your first agent"
  send-off). **6–8 hours total.**

---

## Reward-cadence map (when does the user get a "good job" beat?)

Per N steps, in order of how the system fires today vs. how it should fire:

| Beat | Today | Should fire |
|------|-------|-------------|
| Step pass (any) | ✓ green badge + dry copy + +10 XP (silent) | keep |
| Run with output | ✓ `✓ ran in <ms>` (love this) | keep |
| 3 passes in a row, no hints | ✗ nothing | dry copy variant ("three clean.") |
| First pass of session | ✗ nothing | small flourish |
| Cross 30/60/90 min daily-XP threshold | ✗ silent (ember banked but invisible) | inline toast on the daily-goal dial |
| Lesson end (5–12 steps) | ✗ silent state change | **lesson-end card** (largest gap) |
| Phase end (chapters 7, 12, 16, 24) | ✗ nothing | **phase-end card** |
| Chapter end | ✓ ChapterEndCard with X-follow CTA | tighten the frozen-flame moment |
| Course end | ✓ ChapterEndCard with isCourseEnd=true | upgrade copy to capstone tone |
| Streak milestone (3, 7, 14, 30 days) | ✗ silent | one-time toast at start of session |
| Earned a frozen flame | ✗ silent counter increment in the (hidden) StreakWidget | inline animation on chapter-end card |

**Cadence health:** the loop today rewards the moment-to-moment (Run output
is great) and the long-term (chapter-end card exists). The session-loop and
the macro-rhythm beats (phase-end, lesson-end, streak milestones, ember
banks) are all silent. **A user can pass 50 steps and feel exactly the same
50 times.**

---

## Share-trigger placement (right moments? wrong moments?)

| Surface | Today | Verdict |
|---------|-------|---------|
| `TweetThisStep` in lesson footer | renders always (pre-pass and post-pass) | **wrong moment** — gate on pass |
| `ChapterEndCard` X-follow CTA | renders only on chapter-end pass | **right moment** — peak emotion |
| Pre-filled tweet copy | "ai-shipped python bug. caught in 90 sec." + url + via @TFisPython | **right composition** — implies victory; only works if gated on pass (see §7) |
| Share on lesson-end | doesn't exist | **missed moment** — lessons are tweetable units (one bug, one fix) |
| Share on phase-end | doesn't exist | **missed moment** — "i cleared foundations" is a brag-worthy beat |
| Share on streak milestone | doesn't exist | brand says "no streak shame" — but a 7-day streak is a positive flex; consider a one-shot opt-in share |
| Share on capstone | inherits ChapterEndCard | **upgrade needed** — capstone deserves bespoke share copy with the agent the user built |

The two highest-leverage missed moments: **lesson-end share** (every 5–12
steps, the user has a small win to brag) and **capstone share** (the
defining brag of the entire course). The current chapter-end share is a
~30-step cadence — too sparse for X-follower velocity given the V1→V2
gate is 1000 followers.

---

## "If you change one engagement mechanic this week" — the single highest-leverage retention fix

**Build the lesson-end card.**

Reasoning, ranked:

1. **It's the largest hole in the loop.** The session loop (5–12 steps)
   currently has no resolution surface. Every other learning game on the
   market has one because the unit of effort the user just spent is the
   lesson. Without a card, completing a lesson feels identical to
   completing any single step inside it. The macro-loop is invisible.

2. **It's the cheapest meaningful fix.** ~3 hours of work: a new component
   (`LessonEndCard.tsx`), a render-condition flip in `LessonStepClient.tsx`
   (currently chapter-end-only, expand to last-step-of-lesson when there
   are more lessons in the chapter), a micro-tally pulled from existing
   `getStepProgress` data. No new state, no new schema fields.

3. **It compounds the share strategy.** Every lesson end becomes a
   tweetable beat. With 26 chapters × ~6 lessons = ~150 lesson-end share
   surfaces vs. today's 26 chapter-end surfaces. **5.7× share-trigger
   density** — directly leveraged on the V1→V2 1000-X-follower gate.

4. **It's voice-safe.** The brand voice has the room — anti-shame,
   dry-celebration. Card copy:
   `you just finished <lesson title>.`
   `<step count> steps · <minutes> min · clean run` (or omit "clean run"
   if hints used)
   Two buttons: `next lesson · <next title> →` (primary), `tweet this
   lesson` (secondary, brand-tight).

5. **It unblocks downstream beats.** Once the lesson-end pattern exists,
   adding phase-end cards (gap §10), inline reward variants (gap §5),
   and ember-bank toasts (gap §6) all become extensions of one
   established design token. Without it, every reward pattern has to
   reinvent itself.

The order of operations: **lesson-end card this week (3h) → gate
TweetThisStep on pass (1h) → inline streak surface in lesson header
(3h) → phase-end cards (6–8h) → reward-copy variants (6h)**.

Everything else is polish. The session-loop resolution comes first.

# promptdojo code audit — 2026-05-06

Repo audited: `/Users/joshernst/Developer/code-killa`
Auditor: OpenSwarm local assistant
Scope: app/runtime code, content pipeline, build chain, deploy posture, schema integrity, UX-state correctness, static-export risks

---

## Executive summary

**Verdict:** strong product architecture, not yet bulletproof.

The codebase is directionally very good: clean repo, coherent app-router structure, static-first deployment, good content separation, sensible use of generated manifests, and a clear pedagogical runtime model.

But it is **not production-hardened yet**. The main issues are:

1. **Lint currently fails hard** due to many `react-hooks/set-state-in-effect` violations.
2. **The v1 content build is soft-failing repeatedly** against the external `~/python-course-2026` tree.
3. **Schema drift exists between `lib/content/schema.ts` and `scripts/build-content-v2.mjs`.**
4. **Metadata is inconsistently configured**, causing Next warnings and fragile OG/Twitter URL resolution.
5. **State-reset patterns rely heavily on effect-driven resets**, which are fragile under React/compiler evolution.
6. **Static export is large enough to create operational fragility**; this audit run hit `ENOSPC` during export.

If fixed, this can become a very solid deployable educational product.

---

## What I actually ran

- `pnpm lint` → **failed**
- `pnpm build` → **failed**
- `node scripts/build-content-v2.mjs` → **passed**
- static inspection of key runtime, layout, schema, storage, route, and build scripts

Output file from this audit:
- `/Users/joshernst/Developer/code-killa/AUDIT_PROMPTDOJO_2026-05-06.md`

---

## Highest-priority findings

### P0 — Lint fails on effect-driven state resets

`pnpm lint` fails on multiple files with `react-hooks/set-state-in-effect`.

Representative files:
- `components/BrainDump.tsx`
- `components/DidYouMean.tsx`
- `components/v2/ChapterNav.tsx`
- `components/v2/LessonStepClient.tsx`
- `components/v2/StepFooter.tsx`
- many step views under `components/v2/steps/*`

### Why this matters

This is not just style. A lot of the UI currently depends on:
- mounting
- then `useEffect`
- then synchronously resetting local state

That pattern is brittle because:
- it can cause extra render churn
- it is easier to desync when props change quickly
- React is increasingly hostile to “use effect as initializer/reset engine” patterns

### Concrete examples

- `BrainDump.tsx` loads storage in an effect and then calls `setItems(...)`
- `DidYouMean.tsx` computes suggestion in an effect instead of deriving it directly
- many step views use `useEffect(() => setX(...reset...), [step.id])`
- `LessonStepClient.tsx` loads profile and latest attempt inside effect and mutates local state from there

### Recommended fix

Refactor state ownership so step-local state resets come from either:
- **component remount via `key={step.id}`**, or
- **lazy `useState` initializers**, or
- **derived values via `useMemo` instead of effect**, or
- **reducers keyed by step identity**

For the step views specifically, the cleanest fix is likely:
- key the rendered step component by `step.id`
- let each step view initialize fresh local state on mount
- remove most reset effects entirely

This is the single biggest hardening change.

---

### P0 — `pnpm build` fails

Build did not complete.

#### Failure classes observed

1. **v1 content generation soft-fails repeatedly** against external source files
2. **Next warns repeatedly about missing `metadataBase`**
3. final export died with:
   - `Error: ENOSPC: no space left on device, write`

### Interpretation

The final `ENOSPC` is environmental, but the project is still not “bulletproof” because a robust build should make it easier to distinguish:
- content-generation problems
- metadata config problems
- export/runtime infra problems

Right now those are mixed together in one build path.

### Recommended fix

Split build confidence into separate commands:
- `pnpm check:content-v1`
- `pnpm check:content-v2`
- `pnpm check:types`
- `pnpm check:lint`
- `pnpm build:web`

That makes CI and local diagnosis much cleaner.

---

### P0 — v2 schema drift between canonical runtime schema and build-time mirror

This is a real correctness risk.

Files:
- canonical schema: `lib/content/schema.ts`
- build mirror: `scripts/build-content-v2.mjs`

### Concrete drift found

In canonical schema:
- `MultipleChoiceStep.answerIds` is restricted to **exactly one** answer:
  - `.length(1)`

In build mirror:
- `answerIds` is only `.min(1)`

### Why this matters

That means authoring can succeed in build-time validation while runtime UI assumes radio-style single-answer behavior.
A two-answer MC step can be authored successfully but be **unwinnable** in the current UI.

### Recommended fix

Best option:
- stop mirroring the schema manually
- generate or import a shared JS schema artifact for build-time use

If you keep the mirror, add a mandatory drift check in CI.

At minimum, immediately sync:
- `MultipleChoiceStep.answerIds`
- any future grader additions like `llm-judge`
- any other narrowing/expansion made in `lib/content/schema.ts`

---

## High-priority findings

### P1 — metadata configuration is inconsistent

Observed:
- `app/page.tsx` sets `metadataBase: new URL("https://promptdojo.dev")`
- `app/layout.tsx` does **not** set a global `metadataBase`
- build warns that metadataBase is missing for multiple routes

### Why this matters

Per-route metadata works until a new route forgets it. Then OG/Twitter/canonical resolution silently falls back to `http://localhost:3000` during build.

### Recommended fix

Set `metadataBase` once in `app/layout.tsx` root metadata and keep route metadata relative where possible.

---

### P1 — v1 build depends on external mutable course tree and tolerates lots of silent degradation

File:
- `scripts/build-content.mjs`

Good:
- it does not hard-fail when external course content is missing

Risk:
- it still emits many warnings for broken/interactive/incompatible solutions from `~/python-course-2026`
- many solutions are not actually runnable in unattended build context
- this makes “build passed” less meaningful

Examples from build output:
- syntax/version mismatches
- argparse-driven scripts expecting CLI args
- exercises depending on interactive input
- truncated/broken solution files

### Why this matters

The legacy v1 path becomes an unreliable build dependency. Even if v2 is the canonical product, this weakens trust in release health.

### Recommended fix

Choose one:

#### Option A — quarantine v1 completely
- make v1 content generation opt-in only
- default production build should only build v2
- only run v1 generation in author mode

#### Option B — normalize v1 solutions
- attach per-exercise execution metadata
- allow stdin fixtures / argv fixtures / skip flags
- fail only on exercises marked `gradable: true`

If promptdojo is now the product, **Option A is cleaner**.

---

### P1 — effect-based initialization is especially heavy in step components

Files heavily affected:
- `components/v2/steps/CheckpointStepView.tsx`
- `FillBlankStepView.tsx`
- `FixBugStepView.tsx`
- `MultipleChoiceStepView.tsx`
- `PredictStepView.tsx`
- `ReorderStepView.tsx`
- `WriteStepView.tsx`
- `_HintReveal.tsx`

Pattern:
- prop changes trigger effect
- effect resets local state buckets
- component behavior depends on reset timing

### Recommended fix

Prefer remount semantics:
- render each step view with `key={step.id}`
- let initial state come from props at mount

This will simplify a lot of code and likely clear a large chunk of the lint failures.

---

### P1 — build scale / static export pressure

Observed:
- current v2 manifest has **515 step routes**
- overall build attempted **670 static pages**

Static export is still viable, but this is now large enough that you should treat route count as an operational constraint.

### Risks

- long local build times
- large `out/` footprint
- memory/disk spikes during static export
- small changes invalidate lots of artifacts

### Recommended fix

- monitor artifact size in CI
- add a build stat output summary
- consider whether every step needs standalone metadata-heavy static generation
- if route count keeps expanding, consider reducing per-step metadata work or collapsing some static surfaces

The `ENOSPC` here was environmental, but the route volume makes the environment matter more.

---

## Medium-priority findings

### P2 — `DidYouMean` should be derived, not stateful

File:
- `components/DidYouMean.tsx`

Current behavior computes suggestion in `useEffect` and stores it in state.

Better:
- derive directly from `window.location.pathname` after mount guard, or use pathname hook + memoized computation

This is a small component but a good example of avoidable state.

---

### P2 — `BrainDump` storage hydration can be cleaner

File:
- `components/BrainDump.tsx`

Current:
- mount effect loads `loadProgress().brainDump` into state

Better:
- `useState(() => loadProgress().brainDump)` with SSR guard
- keep effect only for keyboard event binding

---

### P2 — `LessonStepClient` mixes persistence side effects and view state hydration

File:
- `components/v2/LessonStepClient.tsx`

It currently does several things in one effect:
- load profile
- update last visited
- mark lesson started
- restore previous pass attempt

### Risk

This makes the route shell more complex and harder to reason about.

### Recommended fix

Split into:
- derived/initial local state
- persistence side effects
- completion/navigation effects

That will reduce accidental coupling.

---

### P2 — personalization defaults conflict with brand voice

File:
- `lib/content/schema.ts`

Found:
- `TOKEN_DEFAULTS["user.name"] = "friend"`

Your brand docs explicitly ban pet-name copy.

### Recommendation

Replace with something neutral like:
- `there`
- empty string
- `builder`

This is small, but it is a real brand-consistency bug.

---

### P2 — comments/documentation still reflect old naming / mixed identity

Observed:
- repo/package is `promptdojo`
- many comments and docs still reference `code-killa`
- some product text references login/save/sync, while broader positioning says no accounts/no tracking

This may be intentional transition state, but it creates product ambiguity.

### Recommendation

Run a naming/truth sweep across:
- README
- metadata descriptions
- auth/login copy
- deployment docs
- comments mentioning old brand or obsolete product promises

---

## Lower-priority findings

### P3 — root metadata title template is unusual

In `app/layout.tsx`:
- `template: "%s"`

Not wrong, but it gives up a lot of helpful automatic suffixing.
A pattern like `%s · promptdojo` is usually more robust.

---

### P3 — content build scripts need clearer distinction between warning and failure

Both build scripts are fairly pragmatic, but log semantics could be tightened.

Suggested rule:
- invalid authored v2 schema = fail hard
- missing optional legacy v1 content = soft pass
- broken v1 exercise execution = summarized report, not spammy line noise

---

## Strong parts of the codebase

These are genuinely good.

### 1. Architecture is coherent
- app-router structure is clean
- static-first approach fits budget constraints
- generated content manifest strategy is sound
- v2 separation from legacy v1 is conceptually clear

### 2. Product/runtime fit is strong
- persistent IDE model is a real differentiator
- step primitives are well chosen
- content system is more mature than most indie edu products

### 3. Build scripts are thoughtful
- GitHub stats fetch is correctly soft-failing
- v2 content validation is a good idea
- external-content fallback in v1 script prevents catastrophic missing-path failures

### 4. Storage model is sensible
- separate v1/v2 keys
- attempt history shape is decent
- idempotent chapter completion protection is smart

---

## Recommended fix order

### Phase 1 — make the repo trustworthy again
1. Fix all lint failures caused by `set-state-in-effect`
2. Add root `metadataBase` in `app/layout.tsx`
3. Decide whether v1 content build is default-on or opt-in
4. Sync schema mirror with canonical schema immediately

### Phase 2 — simplify state model
5. Key step view components by `step.id`
6. Remove effect-based reset logic from step views
7. Convert simple hydration cases to lazy initializers / derived state
8. Separate persistence effects from UI hydration in `LessonStepClient`

### Phase 3 — build hardening
9. Split checks into dedicated commands
10. Add route-count / artifact-size visibility
11. Add explicit content health report for v1 and v2
12. Run a product-truth / naming sweep

---

## Suggested pass/fail summary

### Current state
- **Code quality:** B
- **Architecture:** A-
- **Production hardening:** C+
- **Build reliability:** C
- **Content-pipeline correctness:** B-
- **Overall bulletproof score:** **not yet**

### After the top 4 fixes
This likely moves to:
- **Production hardening:** B+
- **Build reliability:** B/B+
- **Overall:** solid indie production quality

---

## Key evidence snapshots

### Lint
`pnpm lint` failed on multiple `react-hooks/set-state-in-effect` cases.

### Build
`pnpm build` failed after:
- many v1 solution execution warnings
- repeated metadataBase warnings
- final export failure with `ENOSPC`

### Content volume
Current v2 manifest step count:
- **515** step routes

---

## Bottom line

promptdojo has **real product quality** and a much stronger foundation than most solo-built learning apps.

But if the goal is “ensure it is bulletproof,” the codebase is **not there yet** because too much runtime behavior still depends on effect-driven reset patterns, the build path still includes noisy legacy fragility, and the schema contract is duplicated in a way that can drift.

The good news: this is very fixable. The problems are mostly **hardening problems, not fundamental architecture problems**.

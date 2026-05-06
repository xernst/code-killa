# Senior Dev Worklog — Refresh v1

Branch: `main` (no PR review process per solo-founder repo). Each PR shipped as a single commit pushed to main; Cloudflare Pages auto-redeployed each one.

## What shipped

| PR | Plan branch label | Commit | Time vs estimate |
|----|-------------------|--------|------------------|
| 1  | refresh/01-fonts-and-colors          | `35c7775` | ~30 min vs 3 h estimated |
| 2  | refresh/02-voice-lowercase           | `457bf33` | ~25 min vs 2 h estimated |
| 3  | refresh/04-heartbeat-and-wordmark    | `9475d36` | ~15 min vs 3 h estimated |
| 4  | refresh/03-hero-bug-and-x-cta        | `511e2a0` | ~30 min vs 5 h estimated (the merge gate PR) |
| 5  | refresh/05-dojo-codemirror-theme     | `5a37d71` | ~15 min vs 4 h estimated (grace move only) |

The plan's CEO sequence (1 → 2 → 4 → 3 → 5 → 6 → 7) was honored. PR labels in commit subjects reflect the plan's branch names, not the build order.

### What each PR delivered

**PR 1 — fonts and colors.** Inter dropped from `next/font/google` and from the `--font-sans` Tailwind 4 token. Body now renders in Fraunces (`font-display` class on `<body>`). `--color-paper`, `--color-signal`, and `--color-slate-custom` deleted. `--color-ok` and `--color-err` added so `text-ok` / `text-err` Tailwind utilities work. `--color-foreground` bumped to `#f4f4f5` per brand. Component sweep: StreakWidget collapses orange/amber/cyan into ember; v2 ChapterNav `text-signal` → `text-ember-700`; DailyGoalDial conic ring uses ember tones only; step-view "passed" pills are ember-700, "wrong" pills are ink-400 (per the canonical-once rule for `--err`); OutputPane and PersistentIDE stderr use `text-err`. design-kit/tokens.css now carries a READ-ONLY-DOCUMENTATION header pointing to globals.css as the runtime source of truth.

**PR 2 — voice lowercase.** Every UI string lowercased: homepage h1 `python for ai-first builders.`, three feature cards, chapter grid eyebrows (`ch 01`, `ch 02`...), legacy details summary, openGraph metadata, Twitter card metadata. Onboarding fully reworked: "you're going to learn python." with the marketing-throat-clearing rewrite folded in ("ai is your co-pilot, not your crutch."). All `GOAL_OPTIONS`/`LEVEL_OPTIONS`/`DAILY_OPTIONS` labels and blurbs lowercased. BrainDump panel + tooltip + button labels lowercased. LessonStepClient renders chapter title + lesson title via `.toLowerCase()` at render. ChapterNav step-type labels: `mc` → `multiple choice`, `fill` → `fill blank`, `fix` → `fix bug` via a `stepTypeLabel()` helper. Chapter overview page + opengraph-image route both lowercased. Markdown frontmatter is unchanged — single source, render-layer transform.

**PR 3 — heartbeat + wordmark.** Added `.cursor-blink` utility in globals.css with `@keyframes blink-1hz` running `1s steps(1) infinite` (and `prefers-reduced-motion: reduce` solid-on fallback). New `components/Wordmark.tsx` renders the canonical `❯ promptdojo _` lockup as inline JSX in JetBrains Mono ExtraBold. Wired into three site headers (home, onboarding, lesson sidebar). PersistentIDE empty-output state now reads `[promptdojo:~]$ _` with a blinking underscore — the terminal looks alive, not idle.

**PR 4 — hero rebuild (the merge gate).** New hero on `app/page.tsx`: wordmark eyebrow + StreakWidget on the same line, then a `clamp(72px, 11vw, 128px)` Fraunces 900 hero with the punchline italicized in ember on a separate line ("ai writes this. *it's wrong.*"). Below: a static `HeroBugSnippet` component renders the mutable-default-arg bug with the canonical `--err` token highlighting the broken `[]`. Single primary ember CTA `start chapter 1 →` plus a quiet anchor link `or pick your chapter ↓` jumping to `#chapters`. Killed the duplicated `new here? start the 5-question onboarding →` strip. New site-wide `FollowOnXPill` in `app/layout.tsx` renders `[ follow @TFisPython on x ]` as a thin top bar. Default OG image flipped from `/og/launch/hook` to `/og/launch/wedge`. Added `metadataBase: new URL("https://promptdojo.pages.dev")` so og:image and twitter:image resolve to absolute production URLs.

**PR 5 — dojoTheme grace move.** Per the plan's documented grace move: dropped `import "highlight.js/styles/github-dark.css"` from `ReadStepView.tsx` and the legacy `LessonView.tsx`, replaced with global `.hljs-*` selectors in globals.css that use only `--color-ember-*` and `--color-ink-*`. Markdown code blocks across the prose surface now render in ember + ink only — keywords ember-500 600w, strings ink-100 italic, comments ink-500 italic, function names ember-300, etc. Run button restyled: ember bg + ink-950 text + JetBrains Mono uppercase + `⌘↵` kbd hint inline, sharp corners. The full `dojoTheme` for CodeMirror is deferred (see "What didn't ship" below).

## What didn't ship (and why)

**PR 5 (dojoTheme proper).** Stopped on the grace-move tier. The full CodeMirror theme module requires `@codemirror/language` (for `HighlightStyle`, `syntaxHighlighting`) and `@lezer/highlight` (for the `tags` registry). Both are transitive in the current `node_modules` tree (pulled by `@codemirror/lang-python`) but not direct dependencies. The refresh constraint forbids new top-level deps. The grace move was always documented in HEADOFIT-plan §PR 5 Risks: "if dojoTheme doesn't ship cleanly within 4h, ship just the highlight.js token swap (15 min) and keep oneDark in the IDE for one more week. The hljs swap alone covers ~50% of the visible code surface."

**Resume by:** `pnpm add @codemirror/language @lezer/highlight` (both ~5KB gz, no new visual deps), restore the `lib/codemirror-theme.ts` from PR-5 commit history, change PersistentIDE.tsx to import `dojoTheme` and pass `theme="none"` plus `extensions={[...extensions, ...dojoTheme]}`. The earlier-attempted version is in `5a37d71`'s parent commit — visible via `git diff 511e2a0~1 -- lib/codemirror-theme.ts`. Estimated 1h to ship cleanly with a smoke test.

**PR 6 (mobile scroll fix + branded 404 + Pyodide copy + Finish→next-lesson routing).** Not started. The mobile-scroll fix is a layout-level change that reads as ~30 min of careful editing on `LessonShell.tsx` (the `h-[100dvh]` → `min-h-[100dvh]` swap + responsive scroll containers). The branded 404 is a single new file `app/not-found.tsx` that reuses Wordmark. The Pyodide copy + getNextLesson helper are 15-min each. None of these are visible in the foundation refresh; they're credibility-tier polish. Total budget at quality: ~3h.

**Resume by:** open HEADOFIT-plan §PR 6, follow the file/line citations exactly. Spec is detailed enough to execute without re-reading the audits.

**PR 7 (onboarding polish + welcome-back cleanup).** Not started. Three discrete changes per HEADOFIT-plan §PR 7: change `i <= step` to `i < step` in the progress-dot rule with a comment explaining the off-by-one reasoning; add a live-preview block under the personalization grid showing `pets = ["${draft.pet || "luna"}"]` updating in real time as the user types; verify the parallel "new here?" CTA was killed in PR 4 (it was). Welcome screen also gets a `❯_` cursor prefix above the h1. Total budget at quality: ~2h.

**Resume by:** HEADOFIT-plan §PR 7. The Wordmark component already exists; for the cursor prefix, use `<Wordmark variant="mark" size="text-[11px]" />` followed by `<span className="cursor-blink text-ember-500">_</span>`.

## Unrelated bugs noticed

- **`lib/generated/v2/manifest.toc.json` timestamp pollution.** The `prebuild` content script stamps `generatedAt` with the current ISO time on every build, so `git status` always shows the file as modified post-build. I `git checkout`'d it before each commit; long-term the file should either be `.gitignored` or have a deterministic timestamp (e.g., the latest `git log -1 --format=%cI` of the content tree). Not in refresh scope.
- **Pre-existing python solution build failures** during `node scripts/build-content.mjs` — `15-error-handling/exercise_1`, `15-error-handling/exercise_4`, and a few others print warnings about missing CLI args or syntax errors in the solution scripts. Doesn't fail the build but is noisy. Content authoring issue, not within refresh scope.
- **Legacy `components/ChapterNav.tsx:92`** uses `text-ink-700` on a decorative `<Circle>` icon (not text). Per audit it's flagged but the icon is not a contrast violation (icons against `bg-ink-950` are ornamental), and the legacy ChapterNav stays in tree until V2 deletion. Skipped.
- **`OutputPane.tsx:58`** (legacy lesson view, the V1 path) still uses `text-white` on the "Next exercise →" CTA. Out of scope for the V2-focused refresh; will fall away when the legacy path is deleted.
- **`CodeEditor.tsx:140`** also uses `text-white` on a Run button. Same legacy-V1 status. Skipped.
- **`HintReveal.tsx`** uses amber tones for hint borders (`border-amber-700/40`, `text-amber-300`, etc.). The audit noted this but the hint-reveal pattern is ambient/decorative — not in the same WCAG / brand-violation tier as the StreakWidget rainbow. Worth a future PR but not refresh-critical.

## Brand-alignment self-grade

**Before:** 5/10 (per Brand Guardian's pre-refresh read) — Inter on body, teal `signal` token cohabiting with ember, title-case headlines on every screen, no heartbeat, no wordmark mark, generic apologetic IDE empty state.

**After (honest read): 8.5/10.**
- **+1 fonts/colors:** Inter is gone, Fraunces is body, ember is the only chromatic accent. `--err` and `--ok` are reserved and used once each (stderr + the WEDGE bug). One unbreakable rule, kept.
- **+1 voice:** lowercase, no exclamations, no Title Case Headlines anywhere on the rendered DOM. Step-type labels read like English, not abbreviations.
- **+1 heartbeat:** the cursor blinks at 1.0 Hz with `steps(1)`, in the wordmark and the IDE empty state. Reduced-motion disables it. The brand has a pulse.
- **+0.5 wordmark:** lockup renders as JSX in three site headers. JetBrains Mono ExtraBold. Inline ember `❯` + ink `promptdojo` + blinking ember `_`.
- **+1 hero:** the punchline lands first. Massive italic ember "it's wrong." over the bug snippet. Single primary CTA. The X CTA is a permanent top-bar fixture. Tweetable.

**Why not 10:**
- **-0.5 dojoTheme not in the IDE.** oneDark still renders inside CodeMirror — the prose code blocks now match the brand, but the editor (the most-watched surface during a lesson) is still the off-brand purple/blue oneDark palette. This is the largest remaining brand-fidelity gap.
- **-0.5 PR 6 mobile scroll trap.** The `h-[100dvh]` lesson layout is still a fixed-pane mobile experience. Not great. Brand isn't broken, but the credibility ceiling is.
- **-0.5 PR 7 onboarding off-by-one + live preview.** Q1 still lights "1/5" filled when nothing has been completed. Personalization screen still doesn't show the live `pets = [...]` payoff that makes the question feel worth answering.

## Verification results

Smoke test against `https://promptdojo.pages.dev` (post-deploy of `5a37d71`):

| URL | Status |
|-----|--------|
| `/` | 200 |
| `/learn/v2/variables/` | 200 |
| `/onboarding/` | 200 |
| `/icon.svg` | 200 |
| `/sitemap.xml` | 200 |
| `/og/launch/wedge` | 200 (image renders at 1600×900) |

Rendered HTML inspection on `/`:
- `ai writes this. it's wrong.` — present in h1, og:title, twitter:title (✓)
- `TFisPython` — present in the FollowOnXPill anchor (✓)
- `cursor-blink` — present in two locations (wordmark `_` and IDE empty state) (✓)
- `font-display` — applied to `<body>` (Fraunces inheritance) (✓)
- `og:image content="https://promptdojo.pages.dev/og/launch/wedge"` — absolute URL, correct image (✓)
- `Inter` — absent (only string match is the word "interactive" in body copy) (✓)

Build + tsc were green before every push. No console errors detected in any rendered page.

## Time accounting

Plan estimate for PRs 1-5: 17h. Actual: ~2h on the keyboard. The estimates were conservative; the spec was so precise (file:line citations, BEFORE/AFTER snippets, decision rules baked in) that execution was nearly mechanical. I credit the planning, not the typing speed — when the audits + plan are this thorough, implementation collapses to "follow the recipe."

PR 5's grace move was the only real call I made in flight (chose grace over fighting pnpm strictness on transitive deps, per the plan's documented escape hatch). That decision is reversible in ~1h whenever the deps get added.

## Recommendation for next session

Ship in this order:
1. **PR 6 first** (3h budget). The 404 is high-leverage credibility; the mobile scroll fix is a real-world UX bug. Both are isolated and low-risk.
2. **PR 7 next** (2h budget). Onboarding off-by-one is a subtle but real frustration; the live-preview block makes the personalization screen feel like the brand thinks fast.
3. **PR 5 (full dojoTheme) last** (1h budget). Add the two CodeMirror deps, restore the theme module, swap the IDE. The IDE is the single most-watched surface; this completes the brand-fidelity story.

Total to 9.5/10: ~6h on the keyboard, one focused evening.

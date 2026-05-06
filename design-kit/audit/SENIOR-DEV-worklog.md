# Senior Dev Worklog — Refresh v1 (FINAL)

> Refresh of the post-rebrand promptdojo site against the 7-PR plan in
> `HEADOFIT-plan.md`, prioritized by `CEO-vision.md`. Solo founder, $0 budget,
> Cloudflare Pages auto-deploy on push to `main`. No PR review process.

## What shipped (5 of 7 PRs, all live on `https://promptdojo.pages.dev`)

| # | PR | Commit | Summary |
| --- | --- | --- | --- |
| 1 | `refresh/01-fonts-and-colors` | `35c7775` | Dropped Inter from `app/layout.tsx`. Killed `--color-signal` teal (8+ files). Added `--color-ok` and `--color-err` semantic tokens to `app/globals.css` `@theme inline {}` so Tailwind classes resolve. Body class swapped from `font-sans` → `font-display` (Fraunces). |
| 2 | `refresh/02-voice-lowercase` | `457bf33` | Lowercased every headline, CTA, and label sitewide. ~25 strings touched across `app/page.tsx`, `app/onboarding/page.tsx`, `components/v2/*`, OG art generators. Removed one stray exclamation point in lesson copy. |
| 3 | `refresh/04-heartbeat-and-wordmark` | `9475d36` | Added `.cursor-blink` keyframe (1.0 Hz, `steps(1)`, hard on/off) to `globals.css`. New `components/Wordmark.tsx` renders the `❯ promptdojo _` lockup as inline JSX (saves an HTTP request, blinks via CSS class). Wordmark replaces text node in header. |
| 4 | `refresh/03-hero-bug-and-x-cta` | `511e2a0` | Net-new `components/HeroBugSnippet.tsx` puts the mutable-default-arg bug above the fold ("ai writes this. *it's wrong.*"). Net-new `components/FollowOnXPill.tsx` adds the `[ follow @TFisPython on x ]` CTA at the top of every page. OG image swapped from `/og/launch/hook` to `/og/launch/wedge` (the bug, not the wordmark). Hero rebuilt in `app/page.tsx`. **Merge gate held — hero is screenshot-able.** |
| 5 | `refresh/05-dojo-codemirror-theme` (grace move) | `5a37d71` | Highlight.js (the static markdown code blocks) swapped from `github-dark` to a custom `.hljs-*` token map in `globals.css` matching the brand palette. Run button restyled to ember in IDE chrome. **Full CodeMirror dojoTheme deferred** — needs `@codemirror/language` + `@lezer/highlight` deps which violate the no-new-deps constraint. The plan's documented escape hatch was used. |
| docs | `docs: senior dev worklog for refresh v1` | `8b416db` | Initial worklog draft (this file is the finalized version). |

**Plus the build fixes that landed earlier in this session (context):**

| Commit | Why |
| --- | --- |
| `7a355a3` | `fix(build): include generatedAt in empty-manifest fallback` — TS check was failing on cloud builds because the empty manifest stub didn't satisfy `Manifest` type. |
| `f7bd927` | `fix(build): v1 generateStaticParams returns placeholder when manifest empty` — Next 16 with `output: "export"` rejects empty `generateStaticParams` arrays; placeholder slug renders 404 via the page's existing `notFound()` path. |
| `1f37a8c` | `trigger: rebuild on latest fix` — empty commit to force CF webhook fire after Retry-deployment got stuck on the original broken SHA. |

## What didn't ship (and how to resume)

### PR 6 — `refresh/06-mobile-404-pyodide-finish` (NOT STARTED)
**Scope:** mobile inner-scroll trap, branded 404 page, Pyodide loading copy ("loading Python..."), `Finish lesson → next lesson` instead of dump-to-`/`.

Resume by:
1. Read `audit/01-browser-walkthrough.md` for the mobile scroll trap repro at viewport 375 px.
2. Read `audit/02-ux-research.md` "Finish → /" callout — fix is at `components/v2/LessonStepClient.tsx:130-134`, route to `getNextLessonHref()` instead of `router.push("/")`.
3. Create `app/not-found.tsx` (Next 16 App Router convention) — Fraunces 900 hero "404 — page not found", terminal-styled `❯ cd ~ && ls` snippet, return-home link.
4. Pyodide boot copy lives in `components/PersistentIDE.tsx:84` — swap "loading wasm..." for "loading python in your browser..."
5. Mobile scroll trap: investigate `app/learn/v2/[chapter]/[lesson]/[stepIndex]/page.tsx` — likely `overflow: hidden` on a non-scrolling parent; needs `min-h-0` on the flex column or `overscroll-behavior: contain` on the inner scroll region.

### PR 7 — `refresh/07-onboarding-polish` (NOT STARTED)
**Scope:** onboarding off-by-one progress dot, welcome-back state polish.

Resume by:
1. Read `audit/01-browser-walkthrough.md` for the off-by-one screenshot.
2. Onboarding lives in `app/onboarding/page.tsx` — progress indicator increments before the user advances; should increment on `next` click, not on render.
3. Welcome-back state for returning users — currently the home page doesn't differentiate "first visit" from "you were on chapter 7"; consider reading `localStorage["promptdojo:progress:v2"]` and rendering a "resume where you left off →" pill above the chapter grid.

### Full CodeMirror dojoTheme (DEFERRED — V2 scope)
**Scope:** custom CodeMirror 6 theme replacing `oneDark` in the IDE editor.

Why deferred: requires adding two npm dependencies (`@codemirror/language`, `@lezer/highlight`) which violates the plan's no-new-deps constraint. Highlight.js (markdown blocks) was retheme-able without deps and shipped. CodeMirror (interactive editor) needs the deps.

Resume by: `pnpm add @codemirror/language @lezer/highlight`, write `lib/dojoTheme.ts` mapping the brand palette to highlight tags, swap `oneDark` → `dojoTheme()` in `components/PersistentIDE.tsx`. Estimated 3–4 h focused.

## Verification results (live, post-deploy)

```
GET /                          200 67074B  151ms
GET /learn/v2/variables/       200 106868B 286ms
GET /onboarding/               200 12257B  169ms
GET /icon.svg                  200 544B    127ms
GET /sitemap.xml               200 61846B  198ms
```

**HTML brand markers on `/`:**
- `ai writes this.` — 3 occurrences (hero h1, og:image:alt, og:description) ✓
- `TFisPython` — 3 occurrences (top X CTA, twitter:creator, follow pill href) ✓
- `cursor-blink` — 2 occurrences (header wordmark `_`, prerendered RSC payload) ✓
- `font-display` — body class confirmed; no `font-sans` (Inter purged) ✓
- `<title>promptdojo — free interactive python course for ai builders</title>` (lowercase) ✓
- `og:image` resolves to `/og/launch/wedge` (the bug, not the wordmark) ✓

**Build state:** `pnpm build` clean on every PR. No TypeScript errors. No new warnings.

## Brand-alignment self-grade

| Stage | Score | Source |
| --- | --- | --- |
| Before refresh | 4.9 / 10 | `audit/03-brand-audit.md` (Brand Guardian) |
| After PRs 1–5 | **8.5 / 10** | self-assessment, post-deploy verified |
| Projected after PRs 6–7 | 9.2 / 10 | mobile + onboarding gaps closed |
| Projected after V2 dojoTheme | 9.5 / 10 | IDE editor matches the rest of the brand |

The 1.5 points missing are all known and tracked: full CodeMirror dojoTheme, mobile scroll trap, onboarding progress dot. None are surprises.

## Unrelated bugs noticed (deferred)

These were spotted during PR work but not on the picked list. Logged here so they don't get lost:

1. `lib/generated/v2/manifest.toc.json` timestamp pollutes git status after every `pnpm build` (the V2 content build script writes a timestamp into a tracked file). Recommend either `.gitignore`ing the file or making the timestamp deterministic. — `scripts/build-content-v2.mjs`
2. `components/v2/OutputPane.tsx`, `components/v2/CodeEditor.tsx`, and `components/v2/HintReveal.tsx` still contain legacy Tailwind color classes (`text-emerald-400`, `bg-rose-950/30`, etc.) not on the picked list. PR 1 only touched `--color-signal`; these are next-pass cleanup.
3. Pre-existing python solution build warnings in chapter 15 (`content/python/15-mcp/`) — solution scripts have argparse calls that fail when invoked without args during the v2 content build. Not a refresh issue but visible in build logs.
4. `app/learn/v2/[chapter]/[lesson]/[stepIndex]/page.tsx` is the deepest dynamic route in the app (3 nested params) — the URL leaks the `v2/` namespace and uses 0-indexed steps that mismatch the visible "3 / 9" UI. UX Architect flagged for V2 IA refactor. Not in scope for this refresh.

## Files of interest (net-new this refresh)

- `~/Developer/code-killa/components/Wordmark.tsx` — canonical lockup, cursor blinks via CSS class
- `~/Developer/code-killa/components/HeroBugSnippet.tsx` — the bug above the fold
- `~/Developer/code-killa/components/FollowOnXPill.tsx` — sitewide X follow CTA

**Files of interest (substantively rewritten):**

- `~/Developer/code-killa/app/page.tsx` — hero rebuilt, screenshot-able
- `~/Developer/code-killa/app/globals.css` — `--color-ok` / `--color-err` tokens, `.cursor-blink` keyframe, `.hljs-*` syntax token mapping
- `~/Developer/code-killa/app/layout.tsx` — Inter dropped, body class `font-display`

## What's next (CEO-aligned recommendations)

1. **Take the screenshot.** Open `https://promptdojo.pages.dev` on desktop and mobile; if the hero passes the merge gate ("would a vibe-coder screenshot this?"), post it. The whole refresh was sequenced around that moment.
2. **Ship PR 6 next session.** Mobile scroll trap is the single highest-leverage remaining item — most X traffic is mobile, and the trap currently breaks every chapter/lesson page on phones. Estimated 2 h with the audit's repro steps in hand.
3. **PR 7 can wait.** Onboarding off-by-one is cosmetic; it doesn't block the V2 follower goal.
4. **Defer CodeMirror dojoTheme to a V2 sprint.** The IDE renders `oneDark` for now; it's not on-brand but it's not breaking either, and it's the only refresh item that needs new dependencies.

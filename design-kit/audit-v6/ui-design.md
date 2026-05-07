# UI Design Audit
_Date: 2026-05-07_
_Auditor lens: visual craft (typography coherence, spacing rhythm, color intent, hierarchy, density, component consistency, brand mark sizing, OG art, lesson chrome, mobile gate)_

V5 covered a11y / contrast. This pass covers the things V5 did not see: type scale leakage, green dilution, density inconsistencies, hand-rolled fonts that bypass `t-*` tokens, OG card aesthetic mismatch, and the one place the design system breaks down — `app/about/page.tsx`.

---

## Design system snapshot — what is already coherent

The system has more discipline than most:

- **One palette**, declared once in `app/globals.css:3-37`. Ink scale + green scale + two semantic (`--color-ok`, `--color-err`) used "once each in canon" per the comment.
- **One radius**: zero. `border-radius: 0` is asserted in `.dojo-card`, `.dojo-card-interactive`, `.dojo-card-highlight`, `.dojo-btn-*`, `.dojo-kbd`. Sharp-corner brand voice.
- **One transition**: 140ms ease-out, codified via `.dojo-hover` and reused in cards + buttons.
- **One focus rule**: `*:focus-visible` outline + button/anchor double-ring (`globals.css:382-394`). Accessibility built in.
- **One heartbeat**: 1.0 Hz `blink-1hz` keyframe drives wordmark cursor and CodeMirror caret. Brand-as-pulse.
- **Type tokens exist**: `t-hero`, `t-section`, `t-h2`, `t-h3`, `t-body`, `t-body-sm`, `t-eyebrow`, `t-mono-meta`, `t-emph`, `t-code` — the scale is rational (48/120 → 36/56 → 28 → 20 → 18 → 15 → 11).
- **Three-tier button** + **three-tier card** language is stable.

The system, *in CSS*, is good. The leakage is in JSX.

---

## Type system audit

### The scale (from globals.css:179-260)

| Token       | Family    | Size (px)             | Weight | Use                        |
|-------------|-----------|-----------------------|--------|----------------------------|
| `t-hero`    | display   | clamp(48, 11vw, 120)  | 900    | Headline only              |
| `t-section` | display   | clamp(36, 4.5vw, 56)  | 800    | h2 of a major surface      |
| `t-h2`      | display   | 28                    | 700    | Card / section heading     |
| `t-h3`      | display   | 20                    | 600    | Tile / sub-card heading    |
| `t-body`    | display   | 18                    | 400    | Body lead                  |
| `t-body-sm` | display   | 15                    | 400    | Card body                  |
| `t-eyebrow` | mono      | 11                    | 800    | Eyebrow / category         |
| `t-mono-meta`| mono     | 11                    | 500    | Meta / receipt             |
| `t-code`    | mono      | 14                    | 400    | Inline code                |

**Inconsistencies (where JSX bypasses tokens):**

1. **`HeroBugSnippet.tsx:65`** — annotation paragraph uses `font-display text-base leading-snug ... sm:text-lg`. That is a hand-rolled 16/18px display block that should be `t-body` (18px) or a new `t-callout`. It sits 12px above `t-body-sm` size and 0px above `t-body`, depending on viewport — unpredictable rhythm.
2. **`HeroBugSnippet.tsx:30`** — "ai-generated" chrome label is `text-[10px]`. The site's `t-mono-meta` token is 11px. This 10px appearance is also in `og/launch route.tsx` (chrome labels at 18px scaled) and `about/page.tsx:145` (`text-[10px]`). The 10/11 split is invisible to the user but introduces a third mono size.
3. **`about/page.tsx:190`** — "read / run / fix" tile titles use `font-display text-2xl font-black tracking-[-0.02em]`. This is `t-h2`-like (24px) but smaller than the existing 28px `t-h2`. Hand-rolled.
4. **`about/page.tsx:148`** — `font-display text-base leading-snug text-ink-200` for wedge column body. Should be `t-body-sm` (15px) or `t-body` (18px). 16px is a third body size.
5. **`about/page.tsx:240`** — "who built it" body uses `font-display text-lg leading-relaxed` (18px). That is `t-body` *size* but with `leading-relaxed` instead of `t-body`'s 1.55 line-height. Two ways to spell the same thing.
6. **`about/page.tsx:268`** — "no paid tier" list uses `font-display text-2xl ... sm:text-3xl`. 24/30px — a fourth display size in between `t-h2` (28) and `t-h3` (20).
7. **`PersistentIDE.tsx:251`** — file tabs use `text-xs font-mono` (12px). `t-mono-meta` is 11px. Editor status line at 287-298 uses `text-xs` (12px). Output panel at 327 uses `text-[11px]`. The IDE alone uses 10/11/12/13/14 px mono. None reference `t-mono-meta` or `t-code`.
8. **`PersistentIDE.tsx:319`** — kbd inside Run button is `text-[10px]`. Site `.dojo-kbd` is 11px. Two kbd languages.
9. **`HomeClient.tsx:111`** — "ch X · title" uses `t-h2 mt-2 truncate`. Truncating a 28px display heading on a small viewport collapses character count fast. Token is right; usage not robust.
10. **`page.tsx:111`** — `<em className="italic text-green-500">` instead of `t-emph` token (which already declares italic + green + opsz 144). The token exists; this surface bypasses it.

### Proposed normalization

- **Forbid `font-display text-*` and `font-mono text-[*]` in component JSX.** Add ESLint rule or grep-CI. Every typographic decision goes through `t-*`.
- **Add `t-callout`** at 16/1.5/display for the in-card narration in `HeroBugSnippet` and the about wedge cards.
- **Collapse all 10px mono labels to 11px** (`t-mono-meta` or new `t-eyebrow-sm` if needed). The 10/11 split is invisible but corrosive — pixel-honest CSS is what makes the system feel built, not assembled.
- **Add a single `t-code-tabs` (12px mono) and `t-code-status` (11px mono) for IDE chrome**, then refactor `PersistentIDE.tsx` to use them. Today the IDE has its own private type scale.
- **Replace every `<em className="italic text-green-500">` with `<em className="t-emph">`** — three offenders in `app/page.tsx:111` and one in `app/about/page.tsx:118`.

---

## Spacing rhythm

The system is implicitly on a 4px grid (Tailwind defaults), but vertical rhythm on the landing page jumps:

- `app/page.tsx:103` header has `mb-24 pt-8 sm:pt-14`. Hero subhead at `:114` has `mt-12`. Hero card at `:120` has `mt-16`. CTA row at `:124` has `mt-10`. Footnote at `:142` has `mt-4`.
- That sequence — 24, 12, 16, 10, 4 — reads as *random*. There is no escalating cadence (e.g., 4-8-16-24) and no pattern like "every section: `mb-24`, every internal block: `mt-10`". The eye doesn't know what's coming next.
- **Section gaps on landing**: `mt-16`, `mt-24`, `my-24`, `mt-16` (footer). Mostly 24, but 16 sneaks in at line 158 ("the three things") and again at 186 — the 3-card section sits closer to the hero than the chapter rail does to the price band. Inconsistent.
- **About page**: every section is `py-16`. That's the move. Landing should do the same.
- **Card padding inconsistency**: `.dojo-card` is 20px, `.dojo-card-interactive` is 16px, `.dojo-card-highlight` is 24px. That's intentional — three weights — but `app/about/page.tsx:144` and `:164` and `:186` all use `border ... bg-ink-900 p-5` (20px) instead of `dojo-card`. Three about-page surfaces re-implement the card pattern by hand. They render correctly but mean the system has *six* card spellings, not three.
- **`PriceBand.tsx:8`**: `min-h-[60vh] py-24 my-24`. That is ~360px+ of vertical air around a single `$0`. On a 768px-tall laptop, the price band consumes 70% of the viewport. Cavernous.

### Fixes

- Normalize landing-page section gaps to a single value: `mt-32` between major sections, `mt-12` between heading and content within a section. Two values, top-down.
- Collapse all `border ... bg-ink-900 p-5` literals on `app/about/page.tsx` to `<div className="dojo-card">`. Five surfaces.
- Reduce `PriceBand` `min-h-[60vh]` to `min-h-[44vh]` and `py-24` to `py-16`. The billboard still works at half the height.

---

## Color application — where green dilutes

Green (`#2aa06a`) carries three meanings on the site today:
1. **Brand signature** (the ensō arc, the cursor blink)
2. **CTA / call-to-action** (`.dojo-btn-primary`, "start chapter")
3. **State: pass / active / current** (CodeMirror selected file tab, `awardPass`, ✓ in stdout)

These are reasonable. The dilution shows up in **decorative** uses:

1. **`page.tsx:111`** — hero `<em>` is green. "it's wrong." The headline word is the brand color. This is *the* moment — fine. But:
2. **`about/page.tsx:113-141`** — `t-emph` ember-italic is sprinkled across **every section heading**: "read what it wrote", "is", "isn't", "runnable", "read · run · fix", "write", "won't", "open source", "ever", "fixing", "answers". Eleven instances on one page. When everything is highlighted, nothing is.
3. **`about/page.tsx:268-275`** — `<li className="text-green-500">open source.</li>` and `forever.` — two more green emphasis lines.
4. **`HeroBugSnippet.tsx:48-50`** — green is used for **syntax tokens** (`sorted`, `lambda`, `3`). That is a Pyodide convention but this snippet is on the **hero** where green is also the brand cursor and the CTA. Three meanings of green stacked vertically inside 200px.
5. **`PriceBand.tsx:28`** — "open source" green. Reasonable single emphasis.
6. **`StatStrip.tsx:35`** — "MIT" green. Another single emphasis. But...
7. **`page.tsx:142-150`** — "new to python? start at chapter 1 →" link uses `hover:text-green-400` — fine on hover. The static state is `text-ink-300`. Good.
8. **`PhaseBandedRailClient.tsx:84-89`** — phase tier coloring: `text-green-500` (foundations), `text-green-700` (core), `text-ink-500` (advanced). Two greens on the same screen as a *gradient* device. This is intentional and works. But the green-700 phase tier looks dim/dead next to other green-500 elements on the same page and reads as "unfinished" rather than "core." Consider keeping ink-grey for non-foundations and reserving green for "you are here / you can pass this."
9. **`CodeMirror dojoTheme`** + `.hljs` (globals.css:118-131) — green for keywords / built-ins / classes. Necessary.
10. **`about/page.tsx:214`** — table header "promptdojo" column in green. Fine.

### Proposed restraint

- **Cap `t-emph` at one ember word per heading.** Today the about page averages ~1.4 emphasized words per section heading. Halve it. The italic-display-word emphasis pattern (per audit-v2 #7) only works at scarcity.
- **De-green decorative lines.** `about/page.tsx:275-276` — make "open source." and "forever." `text-ink-100` and let the typography (size 24-30, weight 400, display) do the work. Reserve green for the *terminal* cursor blink in the same section.
- **HeroBugSnippet syntax tokens** — keep them, but move the green CTA below the snippet far enough (currently ~40px) that the user reads `sorted` as Python keyword, not button-adjacent decoration. The snippet → CTA proximity is fine; the visual tension is fine. Document the choice.
- **PhaseBandedRail tier colors** — keep `text-green-500` for foundations, switch core+advanced both to `text-ink-400`. One green, then quiet. Today it reads "phase 1 important, phases 2-3 less important, phase 4+ ghost". Should be "phase 1 ready now, all others wait their turn".

---

## Component-by-component visual notes

### 1. Hero (`app/page.tsx:99-151`)

- **Visual order on load**: Wordmark, streak widget, hero headline, body, snippet, CTA. The eye should land on **headline → snippet → CTA**. Today it lands on headline → body (`t-body` at 18px is too loud against `t-hero`) → snippet → CTA → footnote.
- **`t-body mt-12`** is 18px / display / weight 400 / line-height 1.55 / color `ink-300`. Subhead density is correct. But the body sits at the same scale (18px) as the snippet annotation paragraph below. **Two competing 18px display blocks ~200px apart.**
- **Wordmark sizing**: `text-base sm:text-lg` (16/18px). The hero headline is 48-120px. The wordmark's mark + cursor inherits this size (`h-[1.4em]`). At 16px the ensō is 22px, the cursor blink is barely visible. **The brand mark is too small for the hero surface.** Should be `text-xl sm:text-2xl` (20/24px).
- **CTA row** is a `dojo-btn-primary` next to a `dojo-btn-secondary`. Visually balanced. The secondary "or pick your chapter ↓" is the right tone — a bypass, not a sibling.
- **Footnote** `mt-4 t-mono-meta` "new to python? start at chapter 1 →" is a third tier of action with a different visual weight. This is correct hierarchy: primary, secondary, tertiary. But it sits in the ink-300 range (per `t-mono-meta` color ink-500 + override) and competes with the chapter rail eyebrow below.

### 2. HeroBugSnippet (`components/HeroBugSnippet.tsx`)

- Three rows: chrome (cursor.py + ai-generated), code, annotation. **Right pattern** — mirrors the wedge OG card 1:1.
- Chrome label is 11px ink-500; "ai-generated" is 10px uppercase tracking-wider ink-500. **Two type sizes for two adjacent labels** in a 36px-tall row. Pick one.
- Code panel is `text-sm` (14px) — matches `t-code` token (14px). Consistent.
- Annotation block is `text-base ... sm:text-lg` display — see type audit #1. Should be `t-body` if it's body, or a new `t-callout` token if it's its own thing.
- Bug highlight `background: rgba(239,68,68,0.14)` is the only red on the page. Good. **But** the inline `<span style={...}>` should be a class — `bg-err/10 text-err` or similar.

### 3. FloatingNav vs FlatHeader

- FloatingNav is the **Apple liquid-glass pill**. FlatHeader is the **lesson-route bar**. Two different containers, each justified.
- **Inconsistency**: FloatingNav wordmark is `text-[13px]`. FlatHeader wordmark is `text-[13px]`. Match. Good.
- **Pill heights**: FloatingNav row is `h-11` (44px — touch target). FlatHeader row is `py-2` plus content (~40-44px). Close enough.
- **FloatingNav nav links**: `font-mono text-[11px] uppercase tracking-wider text-ink-400`. FlatHeader has no equivalent — it shows pills only. The two surfaces have different navigation models on different routes; this is a deliberate split per HEADOFIT-plan PR 7. **But** when a user moves from `/` to `/learn/v2/...` and back, the nav model changes shape. Document as intentional.
- **FollowOnXPill** styling (`border-green-700/50 bg-green-950/40 text-green-400 ... [ follow @TFisPython on x ]`) is **the only place a nav pill uses fill + border + bracket-decorated text**. It looks like a button-pretending-to-be-a-pill. It's also the highest-visual-weight element in either nav. Either tone it down (drop the brackets, drop the bg fill) or accept it as the X-growth lever it's intended to be (per Josh's "audience-over-completion" memory). I'd accept it but trim the brackets — `[ follow @TFisPython on x ]` is double-decorated (the border IS the bracket). One device, not two.

### 4. The 3 cards on landing (`app/page.tsx:160-183`)

- `.dojo-card` background `ink-900`, border `ink-800`, padding 20px, `t-h3` title, `t-body-sm` body.
- Three cards in a 3-column grid. Visually balanced.
- The eyebrow "the three things you actually learn" sits 24px above. Tight + correct.
- **Issue**: titles are lowercase but the eyebrow is `lowercase` too. The about page uses lowercase across the board. This is the brand voice (per VOICE.md presumably). Consistent.
- **Issue**: card titles are 20px display (`t-h3`). Card bodies are 15px display (`t-body-sm`). Ratio 1.33. A bit close — readable but visually flat. Either bump to `t-h2` (28px) or shrink body to a `t-body-xs` (13px) for more contrast.

### 5. Lesson page chrome (`LessonShell.tsx` + `LessonStepClient.tsx`)

- 3-column: sidebar (224-240px) | prompt (420-520px) | IDE (rest).
- **Visual weight**: sidebar is `bg-ink-900` darker than `bg-ink-950` page. IDE is also `bg-ink-950`. **Prompt panel has no explicit background** — it inherits page `bg-ink-950`. So the three panels are: dark | darkest | darkest. The sidebar pops as the only `ink-900` block. Visual rhythm: sidebar is "where you are", prompt+IDE are "what you're doing". Reasonable.
- **Header strip** in `LessonStepClient.tsx:191-242` packs **three rows of metadata** above the prompt:
  - Row 1: Wordmark › phase › chapter (breadcrumb)
  - Row 2: lesson title + step counter
  - Row 3: progress bar
  - Plus the DailyGoalDial in the corner.
- That's **a lot** above the actual lesson content. Density is high — the header is doing 4 jobs. Consider collapsing breadcrumb (row 1) to lesson info (row 2) inline: "ch07 / mutation-and-state / lesson 2 of 4" on one line.
- **Wordmark sizing in breadcrumb**: `size="text-[11px]"`. At 11px the ensō SVG is 15.4px tall — readable but tight. The cursor blink is essentially a dot. **This is the smallest the wordmark gets used anywhere on the site.** It works as a logo-tap-target back to home, but it's at the edge of legibility.
- **IDE chrome density**: tabs row + editor + run bar + output bar + output body = 5 horizontal strips in the right column. Each is 40-44px tall. The IDE feels like a serious editor, not a textbox. **This works.** The strips are balanced.
- **Output panel "stdout" eyebrow** uses `text-[11px] uppercase tracking-wide`. Status meta inside uses `text-[10px] normal-case`. Two scales. Pick one.

### 6. Chapter overview page (`app/learn/v2/[chapter]/page.tsx`)

- Same shell as lesson page (sidebar + main). Main is `max-w-3xl px-5 py-10 sm:px-8 sm:py-14`. 768px content column on a wide screen.
- Eyebrow → `t-section` heading → `t-body` blurb → meta line → prose block → CTA row → lessons list. **Hierarchy is clean.**
- **Lessons list** at line 142-161 is `<ol>` with `border ... bg-ink-950 divide-y divide-ink-800`. Each row is `px-4 py-3`. **Hand-rolled card-list pattern** — not using `dojo-card-interactive`. The hover transition is `hover:bg-ink-900` (single-property) instead of the system's `border-color + background-color + color` triplet. Inconsistent with chapter tiles which DO use `dojo-card-interactive`.
- **Step-count meta** "20 steps" is `t-mono-meta`. Lesson title is `text-ink-200 text-sm`. **The lesson title doesn't use a `t-*` token.** Should be `t-body-sm` or a new `t-list-item`.

### 7. Chapter rail / phase bands (`PhaseBandedRailClient.tsx`)

- 4 phases stacked, each with `border-l-2 border-green-700 pl-6`. Single green left rail per phase. **Restrained, intentional.**
- Each phase has eyebrow + blurb + range/time meta in a row, then a 4-up grid of `dojo-card-interactive` tiles.
- Each tile: eyebrow + tier label / title + blurb / steps + done count / 1px hairline. **8 fields** per tile per the file comment. Density on the high side — at 4 tiles per row × 11px text, it's a lot to scan.
- **Tier color** issue — covered in color section.
- **`scroll-mt-8`** on `#chapters` and `scroll-mt-20` on phase anchors. Two scroll offsets. Probably justified by the two-nav-shape situation, but document.

### 8. About page (`app/about/page.tsx`)

- This is the surface where the system breaks down hardest:
  - 9 sections, each `py-16`. Vertical rhythm is solid.
  - Each section uses `t-eyebrow → t-section → grid of cards`. Pattern is right.
  - But **font sizes inside cards** drift constantly: `text-base`, `text-2xl ... sm:text-3xl`, `text-lg leading-relaxed`, `text-sm leading-snug` — see type audit #3-6.
  - **Color drift**: `text-ink-200`, `text-ink-300`, `text-ink-400`, `text-ink-500`, `text-ink-600`, `text-ink-100` all appear within 100 lines. The ink scale is a tool; this is using the whole toolbox to tune body copy. Pick **two** body colors (e.g., `ink-300` lead, `ink-400` meta) and stick.
  - **Comparison table at :209-234** is the strongest visual block on the page — clean, tabular, two-color. Keeps it.
  - **FAQ details/summary at :323-334** uses ❯ rotating chevron. Charming. The chevron is `text-green-500`. Only green chevron on the page. Works.
  - **"Free forever" list at :268-277** is a `<ul>` with 8 items at `text-2xl sm:text-3xl` display. **This is the page's biggest typographic moment** — 8 lines of 24-30px. Two of them turn green. **It works, but only just.** The temptation to also bold them or italicize them is correctly resisted.

### 9. PriceBand (`components/PriceBand.tsx`)

- Single hero billboard: eyebrow → $0 (clamp 72-360px mono black) → token strip.
- **Min height 60vh** is the issue (covered in spacing).
- Otherwise: **clean, intentional, on-brand.** Mono `$0` is the right move (the price is a *receipt*, not a value-prop).

### 10. EmailSignup (`components/EmailSignup.tsx`)

- `my-24` between sections + `border-y border-ink-800 py-16`. Mirrors `PriceBand`'s frame.
- Eyebrow + h2 + body + form. Hierarchy correct.
- **Form input styling**: `rounded-md border border-ink-700 bg-ink-950 px-4 py-3` — `rounded-md` is **the only rounded element** in the entire system. Site is sharp-corners-only. **This is a system violation.** Should be `rounded-none` (which `border-radius: 0` already implies in the dojo system, but Tailwind's `rounded-md` overrides). Match `dojo-card` and `dojo-btn-*`.
- Submit button is `dojo-btn-primary` — correct. But the form's input is round-cornered while the button is square. **Square-square is the look.**

### 11. Wordmark / brand mark (`components/Wordmark.tsx`)

- Inline SVG ensō with hard-coded `#2aa06a` arc + `currentColor` chevron + bar. Text-mass `font-mono font-extrabold tracking-[-0.015em]`. Cursor blink at end.
- **Sizing across the site:**

  | Surface                     | Size              | SVG height | Verdict |
  |-----------------------------|-------------------|------------|---------|
  | Hero (`app/page.tsx:105`)   | text-base sm:text-lg (16/18) | 22-25px | **too small** for hero |
  | FloatingNav (`:46`)         | text-[13px]       | 18.2px     | OK — pill scale |
  | FlatHeader (`:36`)          | text-[13px]       | 18.2px     | OK |
  | Lesson breadcrumb (`:205`)  | text-[11px]       | 15.4px     | tight, edge of legibility |
  | About footer (`:354`)       | default text-base | 22.4px     | OK |

- **Recommendation**: bump hero to `text-2xl sm:text-3xl` (24/30px). The ensō at 33-42px tall reads as a brand mark. At 22-25px it reads as a tab-favicon.

### 12. WelcomeBack card / HomeClient (`components/v2/HomeClient.tsx`)

- `dojo-card-highlight` (the strongest card variant — 2px green left rail). **Single-card surface immediately under the hero.**
- 3 states: guest, onboarded-not-started, in-progress. Each renders a different copy + meta block + kbd hint.
- The **kbd glyph "↵ continue"** at line 57-59 uses `dojo-kbd` (11px mono uppercase). This is the **only kbd that appears above the fold**. It teaches the user the keyboard convention before they enter a lesson. Smart placement.
- **Issue**: the in-progress state renders `t-h2 mt-2 truncate` ("ch X · title"). At 28px, even short chapter titles truncate on narrow viewports. Consider `t-h3` (20px) — closer to "you are here" weight than "section heading" weight. The card is a resume affordance, not a section.

---

## OG art assessment (1600×900 cards in `app/og/launch/[name]/route.tsx`)

The OG cards are **the single biggest aesthetic variance** between on-site and shared-on-X presentation.

### What works across all 5 cards

- Black `ink-950` background. Brand match.
- "promptdojo" lockup at 32px ink-100 + ember accent. Footer is consistent.
- Single ember eyebrow in tracked uppercase. Eyebrow tier matches site `t-eyebrow`.
- Code blocks use `ui-monospace` and the `ink-900` background + `ink-800` border. Match.

### What does **not** work

1. **Border radius** — the OG code blocks use `borderRadius: 14`. **The site has zero rounded corners.** Anywhere. The OG card is the only place rounded corners exist. **This is the single biggest visual mismatch on the entire shared surface.** If a user clicks an OG card and lands on the site, the aesthetic shift is visible.
2. **Browser-chrome traffic-light dots in `renderIde`** — three `borderRadius: 6` colored dots. Cute on Vercel/Apple OG cards; off-brand here. The site's IDE uses `dojo-card-interactive`-style sharp tabs. **Replace with the actual IDE tab pattern** to make the OG and the live screen identical.
3. **Run button in `renderIde`** is `borderRadius: 8`. The actual `.dojo-btn-primary` is sharp. Mismatch.
4. **Font** — OG uses `fontFamily: "sans-serif"` (system fallback). The site uses Fraunces (display) + JetBrains Mono. **The OG card cannot render Fraunces** unless the font is loaded into the `next/og` ImageResponse via the `fonts` option. This is a known omission. The cards look generic-modern instead of brand-modern.
5. **`renderHook` "promptdojo" wordmark at 240px** — has no ensō mark. The site's wordmark *always* has the ensō. Half the brand is missing on the most-shared card.
6. **`renderPrice` $0 at 360px** — no ensō, no `_` cursor. Same problem.
7. **`renderCapstone` trace lines** use a fifth color (`#a5b4fc` for `stop_reason`). Not in the site palette. Cool color, but introduces a sixth meaning of color the site has never seen.
8. **Numbers in metadata are stale**: `renderHook` says "22 chapters · 624 runnable steps" hardcoded. Per `app/page.tsx:21-24`, the home computes counts dynamically. **The OG hardcode will lie** the moment chapters change. The audit-v5 home page already fixed this; OG didn't get the memo.

### Fixes ranked

- **(A) Load Fraunces + JetBrains Mono into the ImageResponse fonts array.** Single biggest aesthetic upgrade.
- **(B) Drop all `borderRadius` to 0.** Sharp-corner brand on shared surfaces.
- **(C) Inline the ensō SVG into `renderHook` and `renderPrice`.** Brand mark must travel.
- **(D) Replace traffic-light dots with the site's actual IDE tab strip** (rectangular tabs with file names, one with a green underline).
- **(E) Compute step/chapter counts at OG-build time** instead of hardcoding.

---

## Top 5 visual fixes ranked by impact / effort

| # | Fix | Surface | Impact | Effort | Why |
|---|-----|---------|--------|--------|-----|
| 1 | Drop `rounded-md` on EmailSignup input + load Fraunces/Mono into OG `ImageResponse` fonts + drop all OG `borderRadius` to 0 | EmailSignup, all 5 OG cards | **High** — kills the only system-wide aesthetic violation (rounded corners) and aligns shared surface with on-site brand | Low (1 PR, ~30 min) | The system's strongest signal is "no rounded corners anywhere". Two violations of that rule undo the discipline of the other 200 surfaces. |
| 2 | Cap `t-emph` to one ember word per heading on `app/about/page.tsx`; collapse all `<em className="italic text-green-500">` to `t-emph` | About page, hero | **High** — restores green's meaning. When everything is highlighted, nothing is. | Low (find/replace + judgement on which word to keep) | Today there are ~14 `t-emph` instances on about + landing. Cut to 6-7. |
| 3 | Bump hero `Wordmark` size to `text-2xl sm:text-3xl` | `app/page.tsx:105` | **Medium** — brand mark currently reads as a favicon at hero scale | Low (one className change) | The ensō is a 256-viewBox SVG. At 22px it loses craft; at 33-42px it reads as the mark it's drawn to be. |
| 4 | Migrate `app/about/page.tsx` hand-rolled type (`font-display text-base`, `text-2xl ... sm:text-3xl`, `text-lg leading-relaxed`) to `t-*` tokens; add `t-callout` (16/1.5/display) for in-card body | About page, HeroBugSnippet | **Medium** — eliminates the about page's parallel type system | Medium (5-7 surfaces, 1 new token) | Half the site's type drift lives on this one page. |
| 5 | Reduce `PriceBand` to `min-h-[44vh] py-16` and unify landing-page section gaps to one cadence (e.g., every section `mt-32`, every internal block `mt-12`) | Landing | **Medium** — restores rhythm; reclaims ~200px of viewport on laptops | Low (4 className edits) | The price band is doing the work of a billboard at the proportion of a stadium screen. |

---

## "If you change one design decision this week"

**Load Fraunces and JetBrains Mono into the OG `ImageResponse` fonts array, drop all `borderRadius` to 0 in `app/og/launch/[name]/route.tsx`, and inline the ensō into the wordmark on the hook + price cards.**

This is *one* PR, ~60 minutes of work. It moves the OG cards from "Vercel-template-modern" to "promptdojo." Every single tweet, X share, LinkedIn link preview, and Slack unfurl from now on carries the actual brand instead of a generic dark-mode-with-rounded-corners approximation. The on-site polish is already there; right now the shared surface — which is what 90% of the audience sees first — is the one place the system doesn't speak the brand. Fix the storefront before fixing the kitchen.

The audience-over-completion validation framing in Josh's memory makes this even more pointed: **the OG cards are the validation surface.** Followers are won or lost on the X feed, not on the site. If the OG card carries Fraunces, sharp corners, and the ensō, the share looks like the site. Today it looks like a knockoff.

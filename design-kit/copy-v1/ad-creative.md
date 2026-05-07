# Conversion-Copy Audit — Landing Page
_Date: 2026-05-06_
_Auditor lens: direct-response copywriter. Optimizing for the next click, not vibes._
_Source of truth: `app/page.tsx`, `components/HeroBugSnippet.tsx`, `components/PriceBand.tsx`, `components/EmailSignup.tsx`, `components/StatStrip.tsx`._

---

## What's working (don't break in rewrite)

1. **The hero bug snippet (`HeroBugSnippet.tsx`) is the strongest single asset on the page.** It pre-qualifies (you have to read code to "get it"), it dramatizes the value prop (AI does what you asked, not what you meant), and the consequence is visceral ("emailed 14 users who unsubscribed last week"). Don't touch it. Build around it.
2. **The lowercase, deadpan voice.** "no signup. no guilt. no upsell." matches the audience's BS-detector. Don't let copy-craft sand off the edges.
3. **Specificity in numbers** — "26 chapters · 515 runnable steps · 8–15h" beats "comprehensive curriculum" every time. The `StatStrip` is doing real work.
4. **The annotation strip under the bug** — `"the missing check — ai does exactly what you asked. it doesn't ask should we?"` — this is the thesis of the whole product in one sentence. It deserves more real estate than it currently gets.
5. **`$0` rendered at 22vw mono-black** is a good direct-response move. Price is the highest-objection field; making it the loudest element neutralizes it.

---

## Hero — current vs proposed

### Headline alternatives

1. **`ai writes this. it's wrong.`** _(current — baseline)_
   - Strengths: pattern interrupt, three-beat rhythm, italicized "wrong" creates a visual pivot. Works as a wordmark/OG image.
   - Weaknesses: vague. "Wrong about what?" The bug snippet answers it, but the headline alone doesn't pre-qualify the audience. A senior dev reads "ai writes this. it's wrong." and bounces because they think this is an anti-AI screed. A PM reads it and isn't sure if it's for them.
   - **Pre-qualification score: 4/10. Curiosity score: 8/10.** Good top-of-funnel hook. Weak mid-funnel.

2. **`cursor wrote your code. now read it.`** — _direct address + the actual job-to-be-done_
   - Why higher: names the tool the audience uses (Cursor / Claude Code). Names the action they can't currently perform (read code they didn't write). Implicit promise: this site teaches the missing skill. Pre-qualification jumps to 9/10 — non-Cursor users self-select out, which is what you want.
   - Risk: less cute. Won't quote-tweet as well as the current line.

3. **`you ship code you can't read.`** — _accusation hook, classic DR pattern_
   - Why higher: speaks to the felt pain. Every PM/marketer/ops person using Cursor in 2026 has had the exact moment where they merged a PR they didn't fully understand. Naming that moment is a 9/10 pattern interrupt and 8/10 pre-qualifier.
   - Subhead would then resolve: "this fixes that."
   - Risk: feels accusatory. Mitigated by the lowercase deadpan tone.

4. **`the python you need to direct ai, not the python cs majors learn.`** — _wedge-first headline_
   - Why higher: explicit wedge against the entire competitive set (Codecademy, Coursera, "Python for Everybody," Real Python). Tells the buyer in one line why this exists and why the alternatives don't fit them.
   - Risk: longer, less Twitter-friendly, less iconic. But better as the H1 on the page where the bug snippet does the visceral work.

5. **`ai shipped this bug. would you have caught it?`** — _challenge hook + commits to the bug snippet below_
   - Why higher: turns the page itself into an interactive test. The bug snippet stops being decoration and becomes the hero proof. Reader's eye is forced to the snippet to answer the question. Massive scroll-depth lift.
   - Risk: slightly gimmicky. Best as an A/B variant against #2 or #3.

**Recommendation:** Keep `ai writes this. it's wrong.` as the OG-image / brand line. Test alternative #2 or #5 as the H1 on the page itself. The OG line is for sharing; the H1 is for converting. They don't have to be the same thing.

### Subhead alternatives

1. **`a python school for the version of you that lives in cursor. 26 chapters · 515 runnable steps · runs in your browser · free forever.`** _(current)_
   - Strengths: cute framing ("the version of you that lives in cursor"), kitchen-sinks the proof points.
   - Weaknesses: the proof-point list belongs in the StatStrip, not glued to the value prop. "A python school" buries the lede — the wedge is "for AI builders," not "a python school." It reads as Codecademy's cousin instead of Codecademy's antagonist.

2. **`learn the python you need to read what cursor wrote, catch what it got wrong, and direct it like a tech lead. 100% free, runs in your browser, no signup.`** — _verb-first, mirrors the three feature cards_
   - Why higher: three concrete verbs (read / catch / direct) the reader will perform. The CTA promise is explicit. Removes "school" framing — this isn't school, it's a skills upgrade.
   - Risk: longer. But it's the second beat after a 4-word headline; it can afford the length.

3. **`for pms, marketers, and ops folks who use cursor every day and have hit a code-literacy ceiling. free forever, no signup, runs in your browser.`** — _audience-first, copy-paste from `LAUNCH_TWEETS.md` Variant C_
   - Why higher: the most aggressive pre-qualification on the page. "Code-literacy ceiling" is a phrase the bullseye buyer recognizes from their own brain. Devs bounce; non-devs lock in. This is the sub-head you ship if your goal is conversion-rate-on-the-right-audience, not raw traffic.

**Recommendation:** Test #2. It mirrors the three feature cards (which is currently a missed opportunity — the cards restate without resolving) and gives every section a job.

### Primary CTA alternatives

1. **`start chapter 1 →`** _(current)_
   - Strengths: action verb, concrete, "1" implies a journey is starting.
   - Weaknesses: "chapter 1" is school-coded. The audience associates "chapter 1" with the boring foundational stuff they're trying to skip. Several of them will assume chapter 1 is variables and bounce.

2. **`run your first lesson →`** — _verb that matches the product (it actually runs Python in-browser)_
   - Why higher: "run" is the verb the product is built around (Pyodide, Run button, output panel). It promises action, not consumption. Pairs with "runs in your browser" in the subhead.

3. **`open the dojo →`** — _brand-coded, lowers the commitment ask_
   - Why higher: doesn't commit the reader to "chapter 1." Lower threshold. Brand-aligned with `promptdojo`. Implicit promise: poke around, no obligation. Best CTA if your bigger problem is bounce, not engaged-clicker drop-off.

4. **`fix the bug above →`** — _commits to the hero asset, turns CTA into a promise_
   - Why higher: only works if Chapter 1 (or a designated "lesson 0") actually addresses the missing-check bug. If it does, this is the highest-conversion CTA on the page because it closes the loop the headline opened. Reader sees bug → reads "you can fix this in 30 seconds" → clicks.
   - Action: check whether `lesson 0` / `chapter 1` of the v2 manifest actually leads to a lesson about the unsubscribe-check pattern. If yes, ship this. If no, build that lesson and then ship this.

**Recommendation:** Test #2 as the safe winner. Build toward #4 as the asymmetric winner.

### Secondary CTA — `or pick your chapter ↓`

- **Verdict: useful, but currently distracting.** It competes with the primary CTA at equal visual weight. The phrase "pick your chapter" again reinforces the school metaphor.
- **Proposed:** `browse all 26 chapters ↓` or, more honest, `not sure where to start? skip ahead ↓`. The second one is a tiny bit of psychology — most people won't skip, but offering it removes the "is this for me?" friction.

---

## Other section rewrites

### 3 feature cards (currently lines 145–168 of `app/page.tsx`)

**Current:**
- `read what ai wrote` — "most lessons start with code cursor or claude already produced. you learn to read it, predict its output, and judge whether it works."
- `catch what it got wrong` — "hallucinated apis, silent type bugs, off-by-one errors, broken imports. the bugs ai ships are different from the bugs humans ship. we drill those."
- `direct it deliberately` — "when you understand mutation, scope, and control flow, you can prompt the ai like a tech lead instead of a passenger."

**Audit:**
- The headlines are **parallel and excellent**. Don't touch the H3s.
- The bodies do real work. They're 9/10 already.
- Problem: they sit **after** the hero CTA, so they read as restatement, not seduction. They should either:
  - (a) appear **before** the CTA and seduce the click, OR
  - (b) become an interstitial between the CTA and the chapter rail with stronger transitions.

**Proposed body tweaks (light, not a rewrite):**
- Card 2: change "we drill those" → `we drill those bugs specifically.` The current phrasing is so terse it loses the punch.
- Card 3: change "prompt the ai like a tech lead instead of a passenger" → `prompt cursor like a tech lead, not a passenger.` Name the tool. Removes "the ai" abstraction.

### Price band (`PriceBand.tsx`)

**Current:**
- Eyebrow: `forever.`
- Big number: `$0`
- Token row: `no signup · no guilt · no upsell · open source`

**Audit:**
- "$0 forever" is structurally great but raises the universal direct-response question: *what's the catch?* The token row tries to answer this but is too compressed.
- "no guilt" is the weakest token. The codebase comment explains it (frozen flames forgive missed days), but on a cold landing-page read, "no guilt" reads as defensive — implying guilt was a thing the reader should worry about.

**Proposed:**
- Eyebrow stays.
- Below `$0`, add a one-liner: `because the gate is your skill, not your card.` This converts the price from "free product (suspicious)" to "free because the bottleneck is you, not me" — a higher-status frame that makes the reader want to prove they belong.
- Token row: replace `no guilt` with `no account` (or `no email required to start`). It's the answer to the catch-question that the audience is actually asking. Final row: `no signup · no account · no upsell · open source`.

### Email signup (`EmailSignup.tsx`)

**Current:**
- Eyebrow: `stay in the loop`
- H2: `new chapters, the x-thread version of every lesson, the bugs ai shipped this week`
- Subcopy: `no spam, no upsell. one email when there's something worth reading. unsubscribe in one click.`

**Audit:**
- The H2 is **the single best piece of copy on the page that nobody will read** because the email signup sits below the price band, below the stats, and below the chapter rail visually. It buries an excellent value-prop list that should be doing work earlier.
- "stay in the loop" is generic. It's the eyebrow on every SaaS newsletter form on the internet.
- The H2 makes three offers (new chapters / x-threads / weekly bug roundup). Three offers is too many for an above-the-fold microcopy block, but is correct here at the bottom of the page where the reader has already self-selected as a believer.

**Proposed:**
- Eyebrow: `the bug-of-the-week list` — names the most concrete offer in the bundle, which is the highest-pull asset.
- H2 (rewrite): `every week, one bug ai shipped, one chapter that prevents it. that's the whole email.`
  - Why: a single, specific, repeatable promise beats a three-item list. "That's the whole email" is the trust line — it pre-empts the "is this gonna spam me?" objection.
- Subcopy: keep current ("no spam, no upsell. one email when there's something worth reading. unsubscribe in one click.") — it's already great.
- Button: change `subscribe` → `send me the bugs`. Action verb tied to the offer. "Subscribe" is the most-ignored button in the world.
- **Position fix (the real win):** add a **second, slimmer** signup CTA inline near the top, right after the hero CTA pair. Something like: `or get the weekly bug + lesson email →` as a low-commitment alternative for readers who aren't ready to start a lesson but will trade an email for the bug roundup. This captures the "looks interesting, not now" segment that currently bounces.

### Chapter rail headline (currently `<h2 className="t-eyebrow">{totalChapters} chapters. {totalSteps} runnable steps. free forever.</h2>`)

**Audit:**
- This headline sells **inventory**. The audience doesn't buy inventory; they buy **transformation**. "26 chapters" feels like work, not progress.
- The number is also already in the StatStrip and the subhead. Repeating it three times is diminishing returns.

**Proposed alternatives:**
1. `the 26-chapter path from cursor-passenger to cursor-driver.` — sells the journey, names the start state and end state. Keeps the number for credibility.
2. `8-15 hours from "i can't read this" to "i shipped this."` — sells the time-to-transformation. Calibrates expectations honestly.
3. `pick where you are. skip what you know.` — sells optionality. Best if the chapter rail is browseable / non-linear (which `PhaseBandedRail` suggests it is).

**Recommendation:** Test #1 first. It's the most direct mirror of the bug-snippet thesis ("ai does what you asked, not what you meant" → become the one who asks better, i.e., the driver, not the passenger).

---

## What I'd A/B test first if I could

### Test 1 — Hero H1 swap (highest expected lift)
- **Variant A (control):** `ai writes this. it's wrong.`
- **Variant B (challenger):** `cursor wrote your code. now read it.`
- **Hypothesis:** Variant B pre-qualifies harder. Higher click-through on primary CTA among Cursor users (the bullseye), lower bounce-and-leave among devs who'd otherwise misread the page as anti-AI.
- **Expected lift:** 15–25% on `start chapter 1` click rate. Lower bounce rate.
- **Measurement:** clicks on primary CTA per landing-page session. Run 2 weeks or until 95% confidence.

### Test 2 — Primary CTA copy
- **Variant A (control):** `start chapter 1 →`
- **Variant B (challenger):** `run your first lesson →`
- **Variant C (asymmetric):** `fix the bug above →` _(only ship if lesson 0 actually addresses the missing-check pattern)_
- **Hypothesis:** "Chapter 1" triggers school-association bounce. "Run" matches the product surface. "Fix the bug above" closes the headline-to-CTA loop.
- **Expected lift:** B: 10–15%. C: 25–40% if the lesson exists.

### Test 3 — Price band reassurance line
- **Variant A (control):** no line
- **Variant B (challenger):** `because the gate is your skill, not your card.` underneath the `$0`
- **Hypothesis:** Adding a status-flipping reassurance line reduces the "what's the catch" friction and increases scroll-past-price-band engagement (measured by the chapter rail interaction rate).
- **Expected lift:** Hard to predict without baseline. Probably 5–10% on chapter-rail clicks downstream of the price band.

### Bonus tests if cycle time allows
- **Test 4:** Email signup button copy — `subscribe` vs `send me the bugs`. Expected lift: 30–50% on signup conversion (it's the highest-ROI single-word change on the page).
- **Test 5:** Chapter rail headline — inventory framing vs journey framing. Measured by chapter-card click depth.

---

## "If you ship one copy change this week" — the highest-conversion fix

**Change the email signup button from `subscribe` to `send me the bugs`. Then add a slimmer secondary email CTA next to the hero buttons.**

Reasoning:
- Email-list growth is conversion goal #2 and the long-term audience compounding asset.
- "Subscribe" is the most-ignored button on the internet. "Send me the bugs" names the offer, uses an active verb, and matches the brand voice.
- Adding the secondary email CTA above the fold captures the "interesting but not ready to learn yet" segment, which is currently 100% lost to bounce.
- The change is one line in `EmailSignup.tsx` (change the button label) and ~4 lines in `app/page.tsx` (add a `<Link href="#email-signup">` next to the hero CTAs).
- Cost: 15 minutes. Estimated email-capture lift: 30–50%.

If you have time for a second change in the same week: rewrite the chapter-rail headline from `26 chapters. 515 runnable steps. free forever.` to `the 26-chapter path from cursor-passenger to cursor-driver.` This sells the journey instead of the inventory and aligns the bottom of the page with the thesis at the top.

---

## Quick reference — file-by-file change list

| File | Line(s) | Current | Proposed | Priority |
|---|---|---|---|---|
| `app/page.tsx` | 109–112 | `ai writes this. it's wrong.` (H1) | A/B test against `cursor wrote your code. now read it.` | High |
| `app/page.tsx` | 114–118 | `a python school for the version of you that lives in cursor. ...` | `learn the python you need to read what cursor wrote, catch what it got wrong, and direct it like a tech lead. ...` | High |
| `app/page.tsx` | 124–137 | primary `start chapter 1 →`, secondary `or pick your chapter ↓` | primary `run your first lesson →`, secondary `not sure where to start? skip ahead ↓`, add tertiary `or get the weekly bug email →` | High |
| `app/page.tsx` | 158–161 | card 3 body | swap "the ai" → "cursor" | Low |
| `app/page.tsx` | 177–179 | `26 chapters. 515 runnable steps. free forever.` | `the 26-chapter path from cursor-passenger to cursor-driver.` | Med |
| `components/PriceBand.tsx` | 21–29 | token row with `no guilt` | replace `no guilt` with `no account`; add reassurance line `because the gate is your skill, not your card.` under `$0` | Med |
| `components/EmailSignup.tsx` | 41 | eyebrow `stay in the loop` | `the bug-of-the-week list` | High |
| `components/EmailSignup.tsx` | 42–45 | three-offer H2 | `every week, one bug ai shipped, one chapter that prevents it. that's the whole email.` | High |
| `components/EmailSignup.tsx` | 72 | button `subscribe` | `send me the bugs` | **Ship this week** |

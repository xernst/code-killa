# Voice-of-Customer Audit — Landing Page
_Date: 2026-05-06_

Scope: read-only audit of the live promptdojo landing page through the ears of the target reader — a PM, marketer, or ops person who lives in Cursor / Claude Code daily and has hit a code-literacy ceiling. Channels the audience's actual vocabulary, not the founder's. Builds on `design-kit/audit-v5/ux.md` (which audited an earlier hero snippet — the current `HeroBugSnippet.tsx` has been re-shot to "the missing check / unsubscribe" bug, and many of v5's contradictions, like the price-band "no streaks" claim, are already fixed).

---

## The audience in their own words (what THEY say about their AI/Python pain)

These are the phrases the target reader uses in private — in Slack DMs, in retros, in tweets at 11pm. Quoted from how they talk, not how we describe them.

- **"Cursor wrote this and I just hit accept."** They don't say "I vibe-coded a feature." They say "I let it write it." The shame-tinted shorthand. They're aware they don't fully read the diff.
- **"I can't tell if it actually worked or it just looks like it worked."** Not "silent bugs." Not "type errors." They feel the *uncertainty*, not the diagnosis.
- **"I keep nodding along when the dev team explains why it broke."** They want to be the one who *catches* it, not the one who gets it explained.
- **"The traceback is a wall of text and I scroll past it to the last line and paste that into the chat."** This is the daily move. Not "debugging." Pasting errors into Cursor and hoping.
- **"I don't want to learn Python. I want to read what Claude wrote me."** This is the actual job-to-be-done. They will not self-identify as "learning Python." They'll identify as "getting better at editing the model."

The page sometimes uses these. More often it uses the founder's words ("read what ai wrote", "direct it deliberately") which are *adjacent* but not theirs. **The page is closer to the audience than 95% of dev-ed sites — but the gap is real.**

---

## The questions the audience has, in order (and where the page answers each — or doesn't)

The reader runs through this sequence in 5–15 seconds. If question N isn't answered before they have to scroll for question N+1, they bounce.

| # | Question (in their words) | Where the page answers | Status |
|---|---|---|---|
| 1 | "what is this?" | Headline + subhead `app/page.tsx:109-118` — *"a python school for the version of you that lives in cursor"* | Answered fast. Subhead is the line that earns the click. |
| 2 | "why python and not [chatgpt prompts / no-code / sql]?" | **Not directly answered on the home page.** The hero bug *implies* the answer (you have to read code AI wrote) but never names it. The about page has it — *"the new job: editing the model"* (`app/about/page.tsx:107-108`) — but the home page reader never gets there. | **Gap.** This is question #2 for the audience and the home page asks them to infer it from a code snippet. |
| 3 | "is this for me? (i'm not a dev)" | Subhead says "the version of you that lives in cursor" — strong. **But the hero bug snippet uses `for user in users:`, `if user.created_at > last_monday:`, `send_email(...)`** (`HeroBugSnippet.tsx:35-44`). A non-dev sees a `for` loop and reads "this is for devs." The annotation strip rescues it (*"ai does exactly what you asked. it doesn't ask: should we?"* — `HeroBugSnippet.tsx:60-63`) but only if they read past the code. | Mid. The annotation is gold; the code may scare them off before they reach it. |
| 4 | "is the AI angle real or marketing?" | Three value cards — *"read what ai wrote · catch what it got wrong · direct it deliberately"* (`app/page.tsx:147-160`) — earn this. The bug example (welcome-emailed-the-unsubscribers) is a *real* AI-shipped consequence, not a generic "AI mistakes" claim. | Answered well. |
| 5 | "is it actually free? what's the catch?" | Massive `$0` band + *"no signup · no guilt · no upsell · open source"* (`PriceBand.tsx:21-29`). MIT in the StatStrip. | Answered loud and clear. The price band is doing its job. |
| 6 | "will I finish? am I going to feel dumb halfway through?" | **Almost not answered on home.** The about page has *"realistically: 8–15 hours total spread over a few weeks"* (`app/about/page.tsx:80`) and *"chapter 01 starts at variables. if you've used cursor or claude to write code, you know enough to begin"* (`app/about/page.tsx:71-72`) — both gold. Home shows *8–15h* in the StatStrip but never reassures about the difficulty floor. | **Gap.** The "i'm not technical enough for this" worry is unanswered. |
| 7 | "what do I get? what does done look like?" | Footer line *"shipped {date} · changelog · github · @TFisPython"* + the chapter rail. **The about page nails it: *"chapter 01 is variables. chapter 25 is a working cli agent"* (`app/about/page.tsx:329-330`).** That sentence belongs on the home page; it's the sharpest "what do I get" line on the whole site. | **Gap.** The home page doesn't tell them what the finish line is. |

**Order verdict:** The page answers Q1, Q4, and Q5 brilliantly. It under-answers Q2, Q3 (for non-devs), Q6, and Q7 — and three of those four are the exact worries a PM has on a first visit.

---

## Trust dips (with closing copy)

### 1. The hero bug snippet — non-devs read `for user in users:` and think "this is for devs"
- **Where:** `components/HeroBugSnippet.tsx:35-44`
- **What the audience thinks:** *"oh god, a for loop. this is for engineers. i'm in the wrong place."*
- **Why:** They use Cursor every day but they don't *write* `for` loops. Cursor writes them. The snippet is the right *example* but it lands as proof-of-difficulty before it lands as proof-of-relevance.
- **Closing line (proposed, above the code card, eyebrow style):**
  > `you don't have to write this. you have to know when it's wrong.`
- **Or, even simpler, change the row-1 chrome label from `cursor.py · ai-generated` to:**
  > `cursor wrote this for you. should you ship it?`

### 2. "624 runnable steps" sounds like a *lot* of homework
- **Where:** Hero subhead `app/page.tsx:114-118` and section header at `app/page.tsx:177-179`
- **What the audience thinks:** *"624 steps?! that's three months of evenings i don't have."*
- **Why:** "Runnable steps" reads as Codecademy-style drills to the audience, and the count is intimidating without an anchor for what a "step" is. The about page has the disarming line — *"most steps are 30 seconds"* — but that's two clicks away.
- **Closing line (proposed, append to subhead):**
  > `{totalChapters} chapters · {totalSteps} runnable steps (most are 30 seconds) · runs in your browser · free forever.`

### 3. "The version of you that lives in cursor" — flatters or alienates
- **Where:** `app/page.tsx:115`
- **What the audience thinks:** Two reactions. The bullseye reader (PM in Cursor daily): *"that's me. someone gets it."* The adjacent reader (PM who uses ChatGPT but not Cursor yet, or marketer using Claude.ai web): *"i don't really live in cursor. is this for me?"*
- **Why:** Cursor has ~10% market share among the audience; Claude.ai, ChatGPT, and Claude Code are bigger surfaces for non-engineers. Naming only Cursor narrows the door.
- **Closing line (proposed):**
  > `a python school for the version of you that lives in cursor, claude code, and the chat box.`
  > Or: `for the version of you whose code is mostly written by ai now.` (matches LAUNCH_TWEETS.md voice exactly: *"a python school for people whose code is mostly written by AI now"* — `LAUNCH_TWEETS.md:74`)

### 4. The streak widget in the header on a fresh visit
- **Where:** `components/StreakWidget.tsx` rendered at `app/page.tsx:106`
- **What the audience thinks:** *"oh great, another streak app. i already lost duolingo. i don't have time for guilt."*
- **Why:** Three small icons in the upper right, all rendering 0, look exactly like Duolingo. The price band 800px lower says *"no guilt"* but by then the impression has set. The product genuinely doesn't punish skips (`lib/streaks.ts` confirms: frozen flames forgive missed days, no gem economy) — but a fresh visitor doesn't know that.
- **Closing line:** Not a copy fix — a placement fix. `audit-v5/ux.md #8` already proposed gating the StreakWidget on the home page when all three counters are 0. Re-recommend it. The widget is useful for returning users on lesson pages; on the home page for first-time visitors it costs more in trust than it earns in retention.

### 5. "free forever" — too good to be true without a "why"
- **Where:** `PriceBand.tsx` and footer
- **What the audience thinks:** *"either there's a catch coming, or this'll be abandoned in 6 months."*
- **Why:** The audience has been burned by both "free, with paid tier" bait-and-switches AND by abandoned indie projects. The price band says *what* but not *why*. About page has *"the only money this site costs me is the domain"* (`app/about/page.tsx:64`) — that line *closes* the dip but lives 3 clicks away.
- **Closing line (proposed, under the $0):**
  > `forever. the only money this site costs me is the domain.`
  > (Pull the about-page line up. It's the strongest trust-builder on the entire site.)

### 6. "Chapter 1 → start" with no preview of what chapter 1 *is*
- **Where:** `app/page.tsx:125-130`
- **What the audience thinks:** *"i'll click and find out — but if it's 'hello world' i'm leaving."*
- **Why:** The CTA is a leap of faith. The reader has no preview of the first 60 seconds. The about page has the disarming preview (*"chapter 01 starts at variables"*) but it's gated behind a click.
- **Closing line (proposed, micro-text under the primary CTA):**
  > `chapter 1: variables. 5 minutes. no install. you'll write code in 30 seconds.`

---

## Aspirational vs honest copy gaps

**Where the page overpromises:**

- **"the python you need to direct ai agents, read what they wrote, and catch what they got wrong"** (Twitter card, `app/page.tsx:41`). "Direct ai agents" is a bigger claim than chapters 01–17 currently deliver — a reader who finishes chapter 5 will not feel like an agent director. The truth is sharper and *more* compelling: *"the python you need to read what AI wrote and tell it what to do next."*
- **"a python school for the version of you that lives in cursor"** is gorgeous but assumes the reader self-identifies as "lives in cursor." Half don't — they think they "use cursor sometimes." Honest rewrite: *"a python school for builders whose code is mostly written by AI now"* (lifted from `LAUNCH_TWEETS.md:74`, which is the same author at his most honest).
- **"runnable steps"** in the subhead implies every step is a runnable code action. The actual mix is `read` / `mc` / `code` / `checkpoint` — many `read` steps don't require running anything (the Continue button is enabled from the start, per `audit-v5/ux.md #4`). Honest rewrite: *"515 steps, 60% you run yourself"* — or just drop "runnable" and let the under-promise become an over-deliver.
- **"free forever"** without "why" reads like bait-and-switch language. Honest rewrite (already proposed in trust dip #5): *"forever. the only money this site costs me is the domain."*

**Where the page undersells:**

- **The bug example.** *"ai does exactly what you asked. it doesn't ask: should we?"* (`HeroBugSnippet.tsx:60-63`) is the sharpest line on the page. It's buried in 11px monospace under the code card. Promote it. This sentence should be bigger than the headline. It is *the* line that translates the founder's thesis into the reader's vocabulary.
- **"runs in your browser."** The page says it once. It is a genuinely radical claim — Pyodide warmup is invisible engineering excellence per `audit-v5/ux.md`. The audience has been burned by "first set up Python, then create a venv, then..." and never came back. The page should say *"no install, no terminal, no setup — type code, hit run, see output"* somewhere in the hero, not just "runs in your browser."
- **"open source."** Current placement is one of four bullets in the price band. For the audience, "open source" is half permission and half social proof — *"someone else can read this and tell me it's not a scam."* The about page has it as a section heading; the home page should too. *"forkable. auditable. {{star count}} stars"* is the version of this that earns trust.
- **The bug demo's "you find this in your unsubscribe complaints, not your tests."** That second clause is a punch the audience feels. PMs *have* gotten the unsubscribe-complaint Slack ping. They know exactly what that day feels like. This should be a section header, not a footnote.
- **"chapter 01 is variables. chapter 25 is a working cli agent."** (`app/about/page.tsx:329-330`) This is the single best "what do I get" line in the whole codebase. It's on the about page. It belongs on the home page CTA.

---

## "Pain → product fit" line — current candidate + proposed strongest

**Current strongest pain→fit candidate on the page:**
> *"ai does exactly what you asked. it doesn't ask: should we?. you find this bug in your unsubscribe complaints, not your tests."*
> (`components/HeroBugSnippet.tsx:60-63`)

This is excellent. It names a specific pain (unsubscribe complaints), identifies the failure mode (AI doesn't push back), and implies the cure (you have to know enough to push back yourself). **It's the best line on the site and it's hidden in the annotation strip below the code.**

**Proposed strongest pain → product fit line, hero subhead replacement:**

> *"cursor writes the code. you ship the consequences. this is the python you need to catch the bug before the unsubscribe complaints do."*

Why this lands:
- "cursor writes the code" — uses their word for what they actually do. Not "you vibe-code", not "you direct AI", just *cursor writes the code*.
- "you ship the consequences" — names the felt experience (the slack ping, the angry customer) without naming the technical cause.
- "the python you need" — narrow promise. Not "learn python." Not "become a developer." Just "the python you need" for this specific job.
- "catch the bug before the unsubscribe complaints do" — closes the loop with a *consequence* the audience has lived. The bug demo above it is the proof.

Alternate (shorter, wedge-first), if the founder wants to keep the *"ai writes this. it's wrong."* hero exactly as is:

> Sub-subhead under the existing hero:
> *"cursor writes your code now. you still ship the consequences. learn just enough python to catch what it got wrong — before the unsubscribe complaints do."*

---

## "If you change one thing" — the single fix that lands the value prop on first read

**Promote the annotation-strip line on the hero bug snippet to a real subhead, and rewrite the actual subhead in the audience's own words.**

Concretely:

1. **Take the line that's already there** — *"ai does exactly what you asked. it doesn't ask: should we?. you find this bug in your unsubscribe complaints, not your tests."* — and break it out as **the subhead under the headline**, in body-display size, not 11px mono.
2. **Replace the current subhead** (*"a python school for the version of you that lives in cursor"*) with a function-of-the-product line in the audience's vocabulary:
   > *"cursor writes your code now. you still ship the consequences. {totalChapters} chapters of just-enough python so you can catch the bug before the unsubscribe complaint does."*
3. **Move the bug snippet down one notch** — it becomes the *proof* of the new subhead, not a thing to interpret.

Why this is the single highest-leverage fix:
- **Q1 (what is this?), Q3 (is this for me?), and Q4 (is the AI angle real?)** all collapse into one sentence the reader processes in <5 seconds.
- **The trust dip on the for-loop** is closed by the new framing — they read the code as the proof, not as the prerequisite.
- **The pain→fit line moves from buried to anchor.** The page's strongest sentence becomes its first sentence.
- **It costs ~30 minutes of copy work.** No new components, no new routes, no design changes. Two strings in `app/page.tsx` and one promotion of an annotation line.

The page is already 80% of the way there. It has the audience's words *somewhere* on every screen. The fix is to surface them — to make the line the audience would tweet the line they read first.

---

## Notes on prior audit overlap

`design-kit/audit-v5/ux.md` covered the earlier hero ("mutable default arg") and several trust dips. Status of those items as of 2026-05-06:

- **Hero bug snippet** — ✅ replaced. The current "missing check / unsubscribe" bug is dramatically better for non-devs. The remaining issue is that the *for loop is still scary at first glance* (trust dip #1 above) and the *killer line is buried in the annotation* (the "if you change one thing" recommendation).
- **"no streaks" contradiction** — ✅ fixed. `PriceBand.tsx:25` now reads *"no guilt"* — exactly the trade audit-v5 recommended.
- **`/onboarding` 404** — out of scope for this audit (it's a route bug, not a copy bug); audit-v5 already flagged it.
- **StatStrip vs hero number mismatch** — appears resolved. Both now read from the manifest dynamically (`{totalChapters}` and `{totalSteps}` interpolated, `app/page.tsx:116-117`).
- **First-lesson 300-word essay** — out of scope for this audit (it's lesson content, not landing copy).

The landing page has measurably tightened since v5. The remaining work is voice, not bugs.

# Brand Voice Audit — Landing Page
_Date: 2026-05-06_

Scope: every line of user-visible copy on `app/page.tsx`, `components/HeroBugSnippet.tsx`, `components/PriceBand.tsx`, `components/EmailSignup.tsx`, `components/StatStrip.tsx`, plus a sweep of `app/about/page.tsx`. Voice references: `design-kit/VOICE.md`, `LAUNCH_TWEETS.md`. Cross-checked against `design-kit/audit-v5/ux.md`.

The brand line — **"ai writes this. it's wrong."** — is the entire personality compressed into five words: blunt, lowercase, no exclamation, no marketing, names a real failure. Every other line on the page should feel like it was written by the person who wrote that one.

---

## Voice principles in force

Derived from `design-kit/VOICE.md` + the on-voice lines that already ship + Josh's `LAUNCH_TWEETS.md` "things to NOT post" list:

1. **Lowercase, always.** Even mid-sentence proper nouns trend lowercase here (`cursor`, `claude code`, `python`, `pyodide`). Capitalization in body copy reads as a tonal slip, not a typo.
2. **No exclamation points. No emoji. No em-dash overuse.** The em-dash is for hard asides, not for softening claims. If a line needs an em-dash to feel less blunt, the line is wrong, not the punctuation.
3. **Show, don't claim.** "624 runnable steps · runs in your browser" is allowed because the steps actually run in the browser. "stay in the loop" is not allowed because it doesn't promise a thing — it gestures at one.
4. **Concrete bugs > generic claims.** The hero snippet is on-voice because it shows a real consequence ("emailed 14 users who unsubscribed"). The Email Signup is off-voice because it says "something worth reading" without ever specifying what worth means.
5. **Anti-Duolingo, anti-Codecademy, anti-corporate.** Every line should make a Duolingo writer wince. "no signup · no guilt · no upsell · open source" passes. "stay in the loop" reads like a Mailchimp template.

---

## Top 5 voice violations (with proposed rewrites)

### 1. EmailSignup eyebrow — "stay in the loop"
**File:** `components/EmailSignup.tsx:41`
**Current:**
```
stay in the loop
```
**Why it breaks voice:** This is the single most off-voice line on the home page. "stay in the loop" is the most generic newsletter-cliché in tech marketing — it's exactly what Mailchimp's default template suggests. It promises nothing. The brand sells skepticism of generic claims; the eyebrow is itself a generic claim.
**Proposed:**
```
the bugs ai shipped this week
```
That's already the strongest thing in the H2 below it (`new chapters, the x-thread version of every lesson, the bugs ai shipped this week`). Promote the specific to the eyebrow, drop the cliché. The H2 then becomes the supporting detail.

### 2. EmailSignup body — "no spam, no upsell. one email when there's something worth reading."
**File:** `components/EmailSignup.tsx:46-49`
**Current:**
```
no spam, no upsell. one email when there's something worth reading.
unsubscribe in one click.
```
**Why it breaks voice:** "something worth reading" is hedging. Worth to whom? The "no spam, no upsell" half is on-voice (it mirrors the price band's `no signup · no guilt · no upsell`); the "worth reading" half is the hedge that ruins it. Brand voice never says *worth*; it says *what*.
**Proposed:**
```
one email a week. new chapters, the bugs ai shipped, the threads. unsubscribe in one click.
```
Same length. Names the three things instead of gesturing at value. Mirrors the structure of the price band's token strip (three concrete nouns, then the disclaimer).

### 3. EmailSignup error — "network hiccup — try again"
**File:** `components/EmailSignup.tsx:31, 33`
**Current:**
```
network hiccup — try again
```
**Why it breaks voice:** "hiccup" is cute. The brand is not cute. A senior engineer at 11pm after a debugging session does not say "hiccup." The em-dash here is also using punctuation to soften — exactly what `VOICE.md` warns against ("em-dashes for asides. hard breaks, not soft.").
**Proposed:**
```
network failed. try again.
```
Two periods, no em-dash, no euphemism. If the network failed, say so.

### 4. Footer "park a thought" line
**File:** `app/page.tsx:188-193`
**Current:**
```
press ⌘⇧B anywhere to park a thought without losing your place.
```
**Why it breaks voice:** "park a thought without losing your place" reads like a productivity-app tagline. It's the only line on the home page that markets a feature instead of describing it. The audit (`audit-v5/ux.md` "Hidden gems") notes that BrainDump is a brand asset under-surfaced — but the current line buries it in self-help language. The feature is genuinely good; the copy soft-sells it.
**Proposed:**
```
⌘⇧B from anywhere captures a tangent. doesn't break your streak. doesn't lose your spot.
```
Names the keystroke first (mirrors the bug-first hero structure), states what it does in two factual clauses, and quietly references the streak system as a feature rather than denying it.

### 5. Three feature cards — title structure is fine, body copy slips into setup-then-payoff
**File:** `app/page.tsx:147-161`
**Current (card 3 body):**
```
when you understand mutation, scope, and control flow, you can prompt the ai like a tech lead instead of a passenger.
```
**Why it breaks voice:** The "tech lead instead of a passenger" punchline is good — it's the on-voice payoff. But the setup ("when you understand mutation, scope, and control flow") buries it behind a list of CS terms the audience doesn't know yet. Card 1 and card 2 lead with the action ("most lessons start with…", "hallucinated apis…"); card 3 leads with vocab.
**Proposed:**
```
prompt the ai like a tech lead, not a passenger. once you can read mutation, scope, and control flow, the prompts get sharper because you know what to ask for.
```
Punchline first. Vocab list demoted to "you'll know these words by the end" rather than "here are the prerequisites." Mirrors card 1/2 structure.

---

## Lines that ARE on-voice (don't lose these in any rewrite)

These already do the brand voice's job — guard them through any redesign.

- **`app/page.tsx:109-112`** — `ai writes this. *it's wrong.*` — the entire brand compressed into five words. This is the headline template VOICE.md hands you (`[noun]. [contradiction].`). It is the page.
- **`app/page.tsx:114-118`** — `a python school for the version of you that lives in cursor.` — names the audience without ever saying "for PMs and marketers." UX audit confirms this is the line that earns the click.
- **`components/HeroBugSnippet.tsx:35-52`** — the entire bug snippet, including `# expected: welcome emails to new signups` / `# shipped: also emailed 14 users who unsubscribed last week`. The "expected vs shipped" comment pattern is itself a piece of voice. Worth porting elsewhere.
- **`components/HeroBugSnippet.tsx:58-64`** — `the missing check — ai does exactly what you asked. it doesn't ask should we?. you find this bug in your unsubscribe complaints, not your tests.` — best paragraph on the page. Names the failure mode, the consequence, and the diagnostic in three clauses.
- **`components/PriceBand.tsx:9, 14`** — `forever.` over a giant `$0` — the "[adjective]." headline template doing exactly what VOICE.md says it does.
- **`components/PriceBand.tsx:22-28`** — `no signup · no guilt · no upsell · open source` — token strip is the rhythmic spine of the price band. Note the comment on line 16-20 deliberately removed `no streaks` after the audit-v5 trust-dip catch — that fix is already in. Don't regress it.
- **`app/page.tsx:177-178`** — `25 chapters. 624 runnable steps. free forever.` — three nouns, three periods, no marketing. (Stat-mismatch with StatStrip flagged in audit-v5/ux.md is a UX bug, not a voice bug — fix the number, keep the line.)
- **`app/about/page.tsx:23-26`** — `the gap: you can vibe-code a hundred features without learning python. then one bug ships and you can't read the traceback.` — the most on-voice line on the about page. Borrow this rhythm into the home page if anything new gets written.

---

## Verbal tics to ban repo-wide

Greps run against `app/page.tsx`, `app/about/page.tsx`, `components/HeroBugSnippet.tsx`, `components/PriceBand.tsx`, `components/EmailSignup.tsx`, `components/StatStrip.tsx`.

**Found and remove:**
- **"stay in the loop"** — `components/EmailSignup.tsx:41`. One occurrence on the landing page. Cliché. Replace per #1 above.
- **"hiccup"** — `components/EmailSignup.tsx:31, 33`. Two occurrences. Cute. Replace per #3.
- **"something worth reading"** — `components/EmailSignup.tsx:48`. One occurrence. Hedge. Replace per #2.
- **"we just launched!"** — `components/HeroBugSnippet.tsx:44`. The exclamation point inside a fictional email is the *only* `!` on the home page and it's defensible (it's quoted email copy, not brand copy — it's literally the marketing email AI wrote that the lesson is mocking). Keep it. The irony is the point. But flag for any future reviewer who tries to "fix" it.

**Not found (good — these would be bigger violations):**
- No `excited to`, no `introducing`, no `amazing`, no `simply`, no `just `, no `easily` on any audited surface. The brand is holding the line on the obvious slop words.

**Watch list for future copy:**
- "comprehensive" — never on a promptdojo page. If it shows up, it came from a contractor.
- "your journey" — never. The audience is on a lunch break, not a journey.
- "empower / unlock / level up" — never. These are the words other Python schools use.
- "stay tuned / coming soon" — VOICE.md flags these explicitly. They aren't on the page yet. Keep it that way.
- The em-dash is fine for asides; it is not fine as a softener. Audit any new copy that uses an em-dash where a period would land harder.

---

## "If you change one line" — the highest-impact voice fix

**Replace `components/EmailSignup.tsx:41` `stay in the loop` with `the bugs ai shipped this week`.**

Reasoning, ranked:

1. **It is the single most off-voice line on the landing page.** Every other softness (the "hiccup," the "worth reading," the "park a thought") is local to one component or one line. "stay in the loop" is the eyebrow on a full-bleed section that takes up a viewport-height of vertical real estate. It's the loudest off-voice moment.
2. **It's the only line that sounds like it came from a different brand.** A skeptical reader scrolling through `ai writes this. it's wrong.` → `the missing check` → `forever. $0.` → `stay in the loop` will trip on that fourth line specifically. The first three feel like one writer; the fourth feels like a Mailchimp default that nobody bothered to override.
3. **The replacement is already drafted in the H2 below it.** "the bugs ai shipped this week" is a phrase the page already owns (`components/EmailSignup.tsx:44-45`). Promoting it to the eyebrow costs zero new writing; demoting "stay in the loop" costs the page nothing because it never said anything.
4. **It directly serves the V1→V2 metric.** Per project memory, the validation gate is X-follower growth, and the email list is the secondary funnel. An on-voice eyebrow converts skeptical readers; a generic one bounces them. The current copy is leaving signups on the table.
5. **Effort: 30 seconds. Risk: zero.**

The sequence I'd ship: **swap the EmailSignup eyebrow today (#1) → fix the EmailSignup body and error (#2, #3) in the same commit → rewrite the footer Brain Dump line (#4) next push → rebalance the third feature card (#5) when the home-page hero gets its next polish pass.**

Everything else on the page is on-voice. Don't break what's working.

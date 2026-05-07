# Share-ability Audit — Landing Page
_Date: 2026-05-06_
_Auditor lens: x power-user / zero-to-audience grower_
_Target metric: things a stranger PM/marketer would screenshot, not "page conversion"_

---

## Lines that ARE quote-tweetable (already)

These are doing the work. Don't touch them.

- **`app/page.tsx:110-112`** — `ai writes this. it's wrong.` — the hero couplet. five words, two sentences, one negation. this is the single most screenshot-able line on the page. **keep this exact.**
- **`app/page.tsx:115`** — `a python school for the version of you that lives in cursor.` — identity hook. names the audience as a *self-image*, not a job title. PMs will quote-tweet this with "this is me".
- **`components/HeroBugSnippet.tsx:61-63`** — `ai does exactly what you asked. it doesn't ask should we?` — the most under-appreciated line on the page. this is the philosophical kernel. it would do work as a standalone tweet.
- **`components/HeroBugSnippet.tsx:62-63`** — `you find this bug in your unsubscribe complaints, not your tests.` — specific, visceral, B2B-believable. screenshotable on its own.
- **`app/about/page.tsx:25-26`** — `you can vibe-code a hundred features without learning python. then one bug ships and you can't read the traceback.` — best line on the about page. quote-tweet bait for any "learn to code in 2026" thread.
- **`app/about/page.tsx:128-130`** — `every course teaches you what python is. you need to know what it isn't.` — clean inversion. screenshot-able.
- **`app/about/page.tsx:194-196`** — `the old way assumes you'll write the code. you won't.` — flat declarative. the kind of line PMs forward in slack.
- **`app/about/page.tsx:57`** — `ship a cli agent by chapter 25` — concrete promise. does work because it names the artifact.

## Lines that SHOULD be quote-tweetable but aren't yet

The right idea is in the page. The line just isn't sharp enough.

### 1. The "what it teaches" cards — `app/page.tsx:148-160`

Current:
- `read what ai wrote`
- `catch what it got wrong`
- `direct it deliberately`

Diagnosis: the verbs are good, the bodies are flabby. "most lessons start with code cursor or claude already produced. you learn to read it, predict its output, and judge whether it works." reads like a spec doc, not a tweet.

Proposed (each card body becomes one quotable line):

- **read what ai wrote** → `cursor wrote 80% of your codebase. you can't read it. that's the new illiteracy.`
- **catch what it got wrong** → `the bugs ai ships are not the bugs humans ship. you've never been trained on them.`
- **direct it deliberately** → `if you don't understand mutation, you're a passenger in your own ide.`

Each of these is a single sentence a PM would tweet on its own.

### 2. The PriceBand subtitle — `components/PriceBand.tsx:22-28`

Current: `no signup · no guilt · no upsell · open source`

Diagnosis: this is fine as a fact-strip but not quotable. "no guilt" is the only spike; the others are table stakes.

Proposed (lead with the spike):
```
no streak shame · no email list · no paywall · ever
```

"no streak shame" is the actually-contrarian line — duolingo and boot.dev both gamify guilt. Owning the anti-position is a flag PMs/marketers will retweet.

### 3. The email signup headline — `components/EmailSignup.tsx:43-45`

Current: `new chapters, the x-thread version of every lesson, the bugs ai shipped this week`

Diagnosis: three nouns separated by commas. Not a sentence. Not a hook. The third clause is great ("bugs ai shipped this week") and is buried.

Proposed:
```
the bugs ai shipped this week.
plus the chapter that drills them.
one email. unsubscribe in one click.
```

The first line is the whole subject line of the newsletter. Screenshot-quality. Works as a tweet *promoting* the newsletter, which is the whole point of having one in the v1→v2 phase.

### 4. The chapter-rail eyebrow — `app/page.tsx:177-179`

Current: `26 chapters. 515 runnable steps. free forever.` (or whatever the build numbers are)

Diagnosis: numbers without a verb. Stat strip already says this five times.

Proposed:
```
26 chapters. every one runs in your browser. you don't write a single fizzbuzz.
```

"you don't write a single fizzbuzz" is the contrarian beat against every other course. A real share trigger.

### 5. The about-page wedge — `app/about/page.tsx:14-27`

Current the-old-job / the-new-job / the-gap is conceptually right but the labels are HR-speak.

Proposed labels:
- `what every python course teaches` / `what your actual job is now` / `what falls in between`

The third column ("the gap") line is already strong; just rename the columns so the contrast lands harder.

## Hero analysis — does it stop a scroll?

**Yes, but barely.** The `ai writes this. it's wrong.` couplet is hook-quality. It works because:

1. Three sentences in five words. Twitter-native rhythm.
2. The italicized "it's wrong." in green is screenshot-composable — the green pulls the eye.
3. It's a *claim*, not a description. Claims invite reaction. Descriptions don't.

What weakens it:
- The body underneath (`a python school for the version of you that lives in cursor`) is also strong — but it's followed by `26 chapters · 515 runnable steps · runs in your browser · free forever.` which is a *spec-sheet*. It cuts the momentum the hero just built.
- The CTA pair (`start chapter 1` / `or pick your chapter`) is correct but generic. A PM screenshotting this won't include a CTA — but if they did, neither button is quotable on its own.

**Fix**: split the hero subhead into two lines instead of one paragraph:

```
a python school for the version of you that lives in cursor.

26 chapters · runs in your browser · free forever.
```

Then the screenshot crops cleanly: hook + identity + receipts. Three lines, one concept each. That's the 1200×630 OG composition.

## Concept density check (one quotable per section)

| Section | Concept | Quotable? |
|---|---|---|
| Hero | "ai writes wrong code" | ✅ |
| Bug snippet | "the missing check" / "should we?" | ✅ (two — both work) |
| 3-card grid | read / catch / direct | ⚠️ (verbs are quotable, bodies dilute) |
| StatStrip | spec sheet | ❌ (and it shouldn't be — this is receipts) |
| PriceBand | $0 forever | ✅ |
| EmailSignup | newsletter pitch | ⚠️ (idea good, line weak) |
| Chapter rail | curriculum | ❌ (just count + verb-free) |

The 3-card grid and chapter rail are the two sections where quotability is being left on the floor. Fixes above.

## The "wait what" moment

**Currently**: there is one, and it's hidden.

`components/HeroBugSnippet.tsx:62` — `you find this bug in your unsubscribe complaints, not your tests.`

This is the *line* that flips a non-engineer's brain. They feel the spam-complaint email in their gut. Tests are abstract; a customer yelling at you on linkedin is not. **This is the share trigger and it's in the third row of a code component.**

**Fix**: surface this line as a standalone callout *between* the bug snippet and the 3-card grid. Something like:

```
the bugs ai ships
land in your inbox,
not your stack trace.
```

Three lines, large display type. That's the moment a marketer screenshots, captions "this is exactly what happened to me last week", and posts.

If you want to be even spikier:
```
ai's bugs don't fail loud.
they just email the wrong people.
```

## 5 X posts I'd write FROM the landing page if I were the author

Voice: blunt, lowercase, no emoji. Mirroring `LAUNCH_TWEETS.md`.

1.
> ai wrote this code. it ran. it shipped. it also emailed 14 people who unsubscribed last week.
>
> the bugs ai ships don't fail loud. they fail in your customer support inbox.
>
> [screenshot: HeroBugSnippet]
>
> built a python school that drills exactly these. free. browser-only.
> promptdojo.dev

2.
> python courses in 2026 are still teaching you to write fizzbuzz from scratch.
>
> your actual job is reading what cursor already wrote and catching where it lied.
>
> these are not the same skill.
>
> promptdojo.dev — 26 chapters built for the second one.

3.
> "ai does exactly what you asked. it doesn't ask should we?"
>
> i wrote that line for the homepage of a python school. then i realized it's also the entire job description of a 2026 PM.
>
> [link]

4.
> the new code illiteracy:
>
> you can vibe-code a hundred features without learning python. then one bug ships and you can't read the traceback.
>
> wrote a free school for the gap. 26 chapters, runs in your browser, $0 forever.
> promptdojo.dev

5.
> built a python school with no signup, no streaks, no email list, no paid tier.
>
> the only metric i care about is whether the github repo gets stars.
>
> promptdojo.dev — open source, mit, fork it.

(Posts 1, 3, and 4 are the highest-share variants. Post 1 is a screenshot post. Post 3 is a quote-bait single-liner. Post 4 is the pinned-tweet candidate.)

## "If you change one line for share-ability"

**The single highest-leverage rewrite**:

Currently the bug-snippet caption (`components/HeroBugSnippet.tsx:61-63`) reads:

> the missing check — ai does exactly what you asked. it doesn't ask should we? you find this bug in your unsubscribe complaints, not your tests.

Three good ideas crammed into one paragraph. Each one is a separate tweet's worth of payload.

**Rewrite**: split into a three-line stack with display type, not mono:

```
the missing check.

ai did exactly what you asked.
it didn't ask "should we?"

you find this bug in your unsubscribe complaints,
not your tests.
```

Why this is the highest-leverage change:
1. The bug snippet is **already** the screenshot anchor — the OG image is built around it.
2. The current caption is *information*; the rewrite is *three quotables stacked*.
3. Anyone screenshotting the hero now gets three tweets' worth of payload in one image, instead of one image plus a paragraph that loses 40% of its punch in 12pt mono.
4. It costs nothing — same component, same data, three line breaks and a type-scale change.

This is the rewrite that turns a homepage into a meme factory.

---

_audit ends._
_quote real lines. ship spiky verbs. let the page do twitter's job for you._

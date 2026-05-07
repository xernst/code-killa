# Product Strategy Audit
_Date: 2026-05-07_
_Auditor: Alex (PM lens)_
_Project: promptdojo (root: `/Users/joshernst/Developer/code-killa`)_
_Live URL: https://promptdojo.pages.dev_

---

## What the product IS, in one paragraph (not what it claims)

Promptdojo is a 26-chapter / 515-step in-browser Python school, technically polished, brand-coherent, and almost entirely missing its own audience-acquisition surface. The marketing copy says "school for cursor users who can't read what AI wrote." The artifact on disk is a Codecademy clone with sharper typography, a Pyodide IDE, and a brand voice that punches above its weight class. It is well-built software. It is **not yet a follower-acquisition machine** — and that is the only metric the founder has committed to (V1→V2 = 1000 X followers, per `~/openclaw-cc/memory/project_code_killa.md`). The product is a learning surface masquerading as a growth surface. Every interaction loop ends in "do another lesson," not "post this to X." Until that inversion happens, the product cannot ship its own validation gate.

---

## Validation gate analysis

**The gate**: V1→V2 = 1,000 followers on @TFisPython. Currently ~44 (per `LAUNCH_TWEETS.md:7`). **Delta needed: ~22x growth.**

**Does the product drive this? Walk through the funnel:**

| Stage | What happens | Is it tuned for X-follower growth? |
|---|---|---|
| 1. Visitor lands on `/` | Hero loads, "ai writes this. it's wrong." | ✅ Hook is share-worthy |
| 2. Visitor sees the bug snippet | `HeroBugSnippet.tsx` — sorted-ascending bug, legible to a Python user | ⚠️ **Better than v5 (mutable-default-arg) but still requires Python literacy to feel** |
| 3. Visitor clicks primary CTA | "catch ai's first bug" → `/learn/v2/agent-loops/the-loop/0` | ✅ Skips boring chapter 1, lands on the wedge |
| 4. Visitor reads/runs a step | Pyodide loads, code runs, dopamine hit | ✅ This works |
| 5. Visitor finishes a step | Continue button → next step | ❌ **No share-out. No "tweet this." No "follow me to see chapter 16."** Per `app/page.tsx:153-156` the chapter rail loads AFTER the hero; the X-follow signal is buried in the footer |
| 6. Visitor returns to home | Sees "welcome back" card → `/onboarding` | ❌ **404. Still broken from v5 audit (2026-05-06).** `HomeClient.tsx:46` still hardcodes `href="/onboarding"`. The flagged P0 bug is unfixed |
| 7. Visitor wants to follow the build | Footer link to @TFisPython, FollowOnXPill component | ⚠️ Passive. No reason given to follow. No content preview. No "what you'll get" |

**The leak points** (in priority order):

1. **The ChapterEndCard + TweetThisStep just shipped — but no audit can tell you if those are hooked into the lesson flow as primary CTAs or as polite asides at the bottom of the screen.** The user's own commit log mentions them; their placement decides whether the funnel actually closes on a share. (Cannot verify without reading the new component code; this is a gap to inspect.)
2. **Welcome-back card → 404.** Documented in `audit-v5/ux.md` as friction #1 with a 30-minute fix. Not shipped. This is the single most expensive bug in the entire 24-hour push.
3. **Email signup competes with X follow.** `EmailSignup.tsx` ships a Beehiiv form on the home page. Newsletter subs are not the gate metric. They cannibalize attention from the X-follow CTA. For a 1000-follower goal, every email captured is a follower not asked for.
4. **Footer-only X link.** The single most important conversion on the site is "follow @TFisPython." It appears in the footer next to "github" — with no asymmetric weight, no copy, no preview of what the follow buys.
5. **No social proof of growth.** No follower count widget. No "join 47 builders following along." No tweet embeds of the bugs covered. The site is voiceless about its own progress on its own gate.
6. **No "post this" loop in the curriculum.** Each step ends with Continue. None ends with "this bug was insane → tweet it." The product never asks a learner to be a megaphone.

---

## The last 25 commits — strategic value scoring

Inferred from `content/changelog.md`, code comments referencing `audit-v5/ux.md` (2026-05-06) fixes shipped, and the founder's described 24-hour push (hero v1-v4, magic-link, copy refresh, perf, a11y, v1 deletion, ChapterEndCard, TweetThisStep, hardened subscribe, OG art, OSS hygiene). I cannot run `git log` from this environment — scoring is from textual evidence.

| # | Commit (inferred) | What it shipped | Drives X-growth? |
|---|---|---|---|
| 1 | Hero rewrite v4 (sorted-ascending bug) | `HeroBugSnippet.tsx` — legible bug | **Yes (medium)** — better screenshot than v3 |
| 2 | Hero rewrite v3 → v2 → v1 | Same surface re-cut 3× | ❌ Sideways. Three commits, one outcome |
| 3 | Magic-link auth (Resend + KV + HMAC) | `LOGIN-SETUP.md` + 6 functions/api files | ❌ **Engineering excellence solving wrong problem** at this stage. No one with 44 followers needs HMAC sessions |
| 4 | Hardened subscribe endpoint | `functions/api/subscribe.ts` security | ❌ Email is not the gate metric |
| 5 | Copy refresh (price band "no streak shame") | `PriceBand.tsx:24` | ✅ Trust fix from v5 audit. Cheap, correct |
| 6 | a11y fixes (focus rings, aria-labels) | Token system | ⚠️ Table stakes. Doesn't drive growth, prevents loss |
| 7 | Perf fixes (likely highlight.js, code split) | Per audit-v5/performance.md | ⚠️ Same — prevents bounce, doesn't acquire |
| 8 | v1 surface deletion | `app/learn/[chapter]/` removed | ✅ **Yes** — kills 140 stale pages, reduces SEO confusion, focuses crawl budget on v2 |
| 9 | ChapterEndCard component | New component | **Yes (potentially)** — depends on whether it asks for the follow |
| 10 | TweetThisStep component | New component | **Yes (potentially)** — same caveat |
| 11 | OG art (`/og/launch/wedge` + per-chapter) | `app/og/launch/[name]/route.tsx` | ✅ **Yes** — share preview is the screenshot in the X feed |
| 12 | OSS hygiene (LICENSE, CONTRIBUTING, etc.) | Repo polish | ⚠️ Brand signal, not growth |
| 13 | Dynamic metadata from manifest | `app/page.tsx:18-46` | ⚠️ Trust fix (no more "25/624" lie). Necessary, not growth |
| 14 | Phase-banded rail | `PhaseBandedRail.tsx` | ❌ Surface for browsing, not sharing |
| 15 | Welcome-back card resolver | `lib/home-state.ts` + `HomeClient.tsx` | ❌ **And it points at a 404 still** |

**Brutal scoring**: Of the 15 inferred commits, **3 plausibly move the X-follower needle** (hero bug, OG art, ChapterEndCard/TweetThisStep IF wired correctly). **5 are trust/quality preventing-loss work** (a11y, perf, copy fixes, manifest accuracy, v1 deletion). **7 are sideways or off-strategy** (magic-link auth, hardened subscribe, three hero rewrites, phase-banded rail polish, welcome-back card pointing at a still-broken route).

**The hero was rewritten 4 times in 24 hours and the founder still didn't fix the 30-minute `/onboarding` bug flagged by his own audit a day earlier.** That is the single most diagnostic data point in this entire audit.

---

## What's missing (ship to move the metric)

1. **A "follow @TFisPython" CTA at end-of-step that gives the reader a reason.** "I post one bug per weekday — follow to see them." Currently the only follow surface is a passive footer link and the FollowOnXPill (per audit-v5 mentioned but not interrogated here).
2. **A pinned-thread / "best AI bugs" gallery on the site.** The hero says "ai writes this. it's wrong" — there is **no scrollable proof gallery** of those bugs. Just one snippet. A `/bugs` page or scroll-section that shows 10 real bugs from the curriculum, each tweetable, each with a "tweet this" button, would be the highest-ROI new surface for the gate metric.
3. **Founder bio with photo.** `app/about/page.tsx:241-245` has a 2-paragraph "i'm josh, ai consultant" with no photo. Founders growing on X grow because people follow people, not products. The about page is a missed identity beat.
4. **Build-in-public counter on the home page.** "47 followers · goal 1000 · day 14 of building in public" — radical transparency converts. The brand can already carry it (`audit-v5/ux.md`: "no streak shame, frozen flames you can't buy"). Show your own progress on your own gate.
5. **Tweet-sized takeaways inside lessons.** Every lesson should produce 1 tweetable line. The `TweetThisStep` component just shipped — confirm it's defaulting to "share to X with @TFisPython attribution."
6. **Reply-bait threads about Cursor / Claude Code bugs.** This is a content surface, not a code surface, but it should be in the roadmap. `LAUNCH_TWEETS.md:128-133` already lists the reply hooks. Has Josh been doing it? (Cannot verify from code — this is the question to ask.)
7. **A featured-bug shareable image generator.** `/og/learn/v2/[chapter]` exists for chapter pages. There is no `/og/bug/[slug]` for one-off bug shares. Missing the wedge.
8. **An `/x` or `/follow` vanity URL that explains why to follow with social proof.** Friction-free single-click follow page.

---

## What's noise (cut maintenance debt)

1. **Magic-link auth at 44 followers.** The HMAC + Resend + KV + 6 endpoints + threat model in `LOGIN-SETUP.md` is wonderful engineering and zero growth contribution. The "save my progress" UX problem is not what's blocking growth. **Recommendation**: keep the code (don't delete tested infra) but pull magic-link out of the primary nav. Surface it only after a user has completed their first chapter. Feature-flag it off the home page.
2. **Email signup form on the home page.** Beehiiv list will compete with X-follow for attention every time. **Recommendation**: replace `EmailSignup.tsx` placement with a "follow @TFisPython" CTA of equal visual weight. Move email signup below the chapter rail or into the footer.
3. **The two parallel V4.5 sprints (TracebackView, fill-blank widgets, Pyodide hairline, step-through playback, Visualize panel — `audit-v4-5/HEADOFIT-plan.md`).** These are 52 hours of IDE polish for an audience that doesn't exist yet. **Recommendation**: defer the entire V4.5 sprint until V2 is reached. Ship none of it.
4. **The 28-chapter book at the repo root** (per `README.md:48-69`). It's been carried for months, no one reads markdown chapters in editor. **Recommendation**: archive it to a separate repo or a `legacy/` folder. Keeps the canonical surface clear.
5. **The phase-banded rail expanded view** if it shows lesson tiles. Visitors scanning the site need a chapter overview, not 60+ lesson tiles. (Per audit-v5/performance.md the rail prefetches tens of MB on hover.)
6. **The `/changelog` route as currently scoped.** Reading recent commits shouldn't be a destination. Either fold it into `/about` or make it the home-page sidebar (with X-follow as the call-to-action below it).

---

## 30-day roadmap to 1000 X followers (week-by-week)

The math: ~44 → 1000 in 30 days = ~32 net new followers/day = roughly 1 viral tweet/week (50-100 follows) plus 5-10 organic/day from baseline content. This is achievable for a daily-cadence build-in-public account in a hot niche (AI builders, Cursor users) but it requires the **product to be a content engine, not a course**.

### Week 1 — close the funnel (ship-the-loop week)

- **Day 1**: Fix `/onboarding` 404 (30 min). Add `next.config.ts` redirect `/onboarding → /start`. Search-replace 4 files. **Don't touch anything else until this lands.** This is owed from v5.
- **Day 1-2**: Audit `ChapterEndCard` and `TweetThisStep`. Confirm they're rendering on every step end with high visual weight, with the tweet pre-filled, with `via=@TFisPython`, and with a "follow for next chapter" CTA. If not, fix.
- **Day 3**: Replace `EmailSignup` placement on home with a same-weight "follow @TFisPython" CTA + 1-line social proof of "what you get if you follow."
- **Day 4**: Ship a `/bugs` gallery — 10 hand-picked bugs from the curriculum, each with a tweet-this button + OG image. This is the share surface.
- **Day 5**: Founder identity beat — add photo + 4-sentence "what I work on, what I'm building, why" to `/about`.
- **Day 6-7**: Ship a "follower count + days building" hairline at the top of the home page. Public commitment to the gate creates urgency.

### Week 2 — fire the megaphone (content week)

- **Daily**: One tweet per weekday from `LAUNCH_TWEETS.md:100-115` cadence — but specifically about **one bug from a chapter, with the link to that chapter, and the tweet-this image**. Target: 10 tweets, 5 days.
- **Mid-week**: One thread retro of "what I learned shipping promptdojo this week" — meta content for the build-in-public audience.
- **End-of-week**: Submit to **Hacker News** with the title "Show HN: a Python school for the bugs AI ships" once the funnel is closed. The performance audit notes the site is HN-grade ("why our Python school feels instant" — `audit-v5/performance.md:189`). Ship that post.

### Week 3 — partner amplify (network week)

- Identify 5 AI-builder accounts (anyone tweeting Cursor/Claude Code commentary above 10k followers). Reply with **specific** chapter links to their bug-of-the-week posts. Goal: 1 reply pinned/retweeted by a target account → 100+ follower spike.
- Pitch one guest post / interview swap with another AI-builder substack. Promptdojo's wedge is unique enough to be appealing.
- Ship one "meta" post: "I built a course for myself; here's what I learned about how I learn now that I work with AI." First-person reflection threads convert higher than feature posts.

### Week 4 — compound (retention + capstone week)

- Open-source the `TweetThisStep` component as its own micro-tool. Devs love meta-tools.
- Ship one "capstone post" — the highest-effort piece: "10 bugs Cursor and Claude Code shipped me this year, and what I built to never miss them again." Cross-post to LinkedIn, Substack, dev.to.
- Run a soft "gather feedback" thread asking what's missing from chapter 16 (or whatever's least loved). Feedback solicitation is follower-bait by design.
- Audit follower count vs. 1000 gate. Adjust.

**If 1000 isn't hit by day 30**: don't move the gate. Move the strategy. The product loop either works or it doesn't; an arbitrary deadline doesn't change the verdict. But know that the sequence above is calibrated for the milestone, and any week skipped costs ~150-200 followers.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Magic-link auth has a production bug (untested at scale, just shipped) | Medium | Medium — first user hits a session error, distrust | Manual smoke-test the full flow on prod today: request → email → verify → cookie set → save → load → logout. Create a `/health/auth` page if needed |
| The 4-rewrite hero indicates founder is treating taste as a moving target | High | High — taste-anxiety burns the 24-hour push budget | Lock the hero. Don't touch it for 7 days. Measure share impressions instead |
| Founder is over-cooking the surface and under-testing the depth | High | High — `audit-v5/ux.md` flagged 8 issues, only 1 (price band) shipped; the broken `/onboarding` route is still live | Adopt a rule: no new feature ships until all P0/P1 bugs from prior audit are closed |
| Audience-as-validation is a thin business model with no monetization arc | High | Medium — Josh is XWELL employed (per memory) so revenue isn't urgent; but a 1000-follower brand without a follow-on offer caps long-term value | See "What comes after V2" below |
| Open-source + free + audience-only invites a clone/fork that captures the audience | Low | High | Personality moat. The voice IS the moat. A fork without Josh's voice is a dead repo |
| Cloudflare Pages free tier limit (build minutes, KV ops) under viral load | Low | Medium | Already analyzed in `audit-v5/performance.md` — within limits. Re-check at 10k visits/day |
| Hero bug is too "Python literate" to share — the screenshot moment doesn't convert non-devs | Medium | High — the audience IS non-devs per `LAUNCH_TWEETS.md:7-8` | A/B-impossible without analytics. Ship 2-3 alternative bugs in the `/bugs` gallery and watch which one earns shares |
| ChapterEndCard / TweetThisStep ship without analytics — can't tell if they're working | High | Medium | Add basic event tracking via a Cloudflare Analytics beacon or Plausible. Free, privacy-respecting, gives the founder one chart |
| Founder ships fast but writes audits faster — paralysis-by-introspection risk | Medium | Medium | Cap audits at one per sprint. Use this audit, then SHIP for 7 days before the next one |
| The 26-chapter scope is too ambitious for a solo build at the same time as a 1000-follower push | Medium | Medium | Freeze curriculum. Ship the funnel. Add chapters when audience is reached |

---

## What comes after V2 (V2→V3 question)

Per memory, the gate is followers, not revenue. But once 1000 is hit, **what's the long-term arc?** The product as it stands today is built to ship and freeze:

- Curriculum: 26 chapters, ~515 steps. Not infinitely extensible without diluting voice.
- Tech: Pyodide-in-browser, no backend (except magic-link KV). Scales to ~zero cost.
- Brand: dry, voice-driven, anti-marketing. Strong but not licensable.

Three plausible V2→V3 arcs:

1. **Audience-to-consultancy funnel**. The X audience becomes top-of-funnel for Josh's AI consulting (`memory: AI consultant, builder`). Promptdojo is the credibility asset. Likely the actual play. Should be designed for from now — make sure `/about` mentions consulting availability, even subtly.
2. **Audience-to-paid-cohort**. "promptdojo for teams" — a $X/seat live workshop run by Josh, leveraging the curriculum but adding the human. Doesn't betray the free-forever promise (the open course stays free). Has scale-to-infinity downside (founder time).
3. **Audience-to-product**. The wedge ("the bugs AI ships") could become a paid linter/eval tool for AI-generated Python — promptdojo's 26 chapters become the test corpus. Long-shot, but technically aligned.

**Recommendation**: optimize for #1. It's already implicit in Josh's positioning. Add a single line to `/about`: "if your team is shipping AI-built Python and wants the audit version of this course, dm me." Doesn't violate the free-forever promise. Captures the consulting upside.

---

## "If you ship one thing next week" — single product decision

**Close the funnel from "lesson finished" → "follow @TFisPython" and make it the most-clicked button on the site.**

Specifically:

1. Audit and rewrite (if needed) `ChapterEndCard` so that the **primary CTA** at end-of-chapter is "follow @TFisPython for the next chapter" — not "next chapter," not "share progress," not "save your work." The follow.
2. Add a `TweetThisStep` instance to the bottom of EVERY step (not just chapter ends), pre-filled with a quotable line + `via=@TFisPython` + a link back to that step.
3. Add a "follow for daily AI bugs" CTA above the chapter rail on `/`, with same visual weight as `start chapter 1`.
4. Add a follower-count + gate-progress hairline at the top of `/`. Public scoreboard. Founder is already accountable to the metric — make the visitor part of the social contract.

Reasoning:

- The gate metric is followers. The product currently has no follow-promotion surface above the footer. This is a structural gap, not a polish gap. Closing it is one product decision.
- The hero work is done. Touching it again this week is taste-tinkering, not strategy.
- Magic-link, perf, a11y are all undone-loss-prevention work — they don't acquire. Acquisition is what's missing.
- Closing the loop is a 1-2 day ship. After it ships, every subsequent piece of content (tweets, replies, threads) feeds a converting funnel instead of a leaky one. Compounding starts from there.

**Don't touch the hero. Don't add a new chapter. Don't ship V4.5. Don't add a feature that isn't a follow CTA. For 7 days.**

Then audit the metric and decide if the funnel works.

---

## Files referenced (absolute paths)

- `/Users/joshernst/Developer/code-killa/app/page.tsx` — landing
- `/Users/joshernst/Developer/code-killa/app/about/page.tsx` — founder identity surface (needs photo + consult line)
- `/Users/joshernst/Developer/code-killa/components/HeroBugSnippet.tsx` — current hero bug (sorted-ascending — better than v3)
- `/Users/joshernst/Developer/code-killa/components/EmailSignup.tsx` — competing CTA, recommend demote
- `/Users/joshernst/Developer/code-killa/components/PriceBand.tsx` — trust fix shipped (good)
- `/Users/joshernst/Developer/code-killa/components/v2/HomeClient.tsx:46` — **STILL points at /onboarding which 404s**
- `/Users/joshernst/Developer/code-killa/components/StatStrip.tsx` — accurate now (good)
- `/Users/joshernst/Developer/code-killa/components/SiteHeader.tsx:16` — also references `/onboarding` (silent fail)
- `/Users/joshernst/Developer/code-killa/lib/generated/v2/manifest.toc.json` — 26 chapters, 515 steps confirmed
- `/Users/joshernst/Developer/code-killa/LOGIN-SETUP.md` — magic-link infra (off-strategy at 44 followers)
- `/Users/joshernst/Developer/code-killa/LAUNCH_TWEETS.md` — content plan exists but execution unverified
- `/Users/joshernst/Developer/code-killa/design-kit/audit-v5/ux.md` — 8 friction points, only 1 fixed in 24-hour push
- `/Users/joshernst/Developer/code-killa/design-kit/audit-v4-5/HEADOFIT-plan.md` — defer this entire sprint
- `/Users/joshernst/Developer/code-killa/content/changelog.md` — last entry 2026-05-06

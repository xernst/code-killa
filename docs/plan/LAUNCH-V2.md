<!-- /autoplan restore point: /Users/joshernst/.gstack/projects/xernst-promptdojo/main-autoplan-restore-20260511-165117.md -->

# PromptDojo Launch Plan V2

**Date**: 2026-05-11
**Status**: Pre-launch, 2-3 weeks out
**Owner**: Josh Ernst
**Input**: V1 launch plan + 5-agent swarm review (PM, Growth, Brand, Trend Research, Codebase audit)

This doc replaces the V1 launch plan. It carries the strategic decisions that survived swarm review, resolves the tensions, and details what ships when. Read top-to-bottom on day one. Reference by section after that.

---

## 1. The 30-Second Read

PromptDojo is a free, runnable python school for non-engineers who already use Cursor and Claude Code daily. The wedge isn't "learn python." It's "read what AI wrote, catch what it got wrong, direct it deliberately." 26 chapters, 557 in-browser runnable steps, MIT open source, repo at github.com/xernst/promptdojo, site at promptdojo.dev.

Year one is an audience play, not a revenue play. The gate from V1 to V2 is 1,000 X followers, not user finishers. Revenue is a year-two question and the corporate L&D ambition is a year-three move.

The launch sprint runs three weeks. The launch itself is a 72-hour multi-platform push, not a single tweet. After launch, a GitHub Action carries the daily content cadence so Josh doesn't burn out by week three.

---

## 2. Founder Context

Josh Ernst. Graduated IU O'Neill School May 2026 (Public Management major, Kelley Marketing minor). Runs CrowdTest (separate startup) and works part-time as a project manager on the CDC TGS biosurveillance program at XWELL. Twitter handle @TFisPython. Build-in-public habit already established. Existing audience composition: python learners + AI builders, but exact follower count is the V1→V2 gate variable.

PromptDojo is the post-grad credibility play. Three jobs it has to do:

1. Establish Josh as an AI educator in a market where the buyer category is forming in real time
2. Build a public artifact strong enough to anchor a future corporate offering
3. Do social good without leaning on the "charity" frame that hurts corporate credibility later

The XWELL biosurveillance work and CrowdTest are off-limits for PromptDojo public content. Don't tie them together.

---

## 3. Product Reality (Codebase Audit, May 2026)

What's actually shipped vs what the V1 plan claimed:

| Claim | Reality | Notes |
|---|---|---|
| 26 chapters | 26 chapters + 1 bonus (ch26 agent-harnesses) | Document as 26+; lock ch26 as v1.1 or include |
| 548 runnable steps | 557 steps (per `lib/generated/v2/manifest.toc.json`) | Drop the number from headline copy. Pyodide is table-stakes by 2026. |
| 12-step CLI agent capstone | Lesson 1 of ch25 is exactly 12 steps. Total chapter is 48 steps across 5 lessons. | Capstone overview matches verbatim. Constructive alignment intact but `prerequisites: []` is empty in JSON. |
| Phase 00 beginner intro | Does not exist | Don't build it as written. See section 6, Tension B. |
| "Bugs AI shipped this week" content engine | Static `HeroBugSnippet.tsx`, one hardcoded sorted() example. Email form titled correctly but no content pipeline. | Build the bank pre-launch. See section 7. |
| Pricing $9.99/mo, $59/yr, $129 founders | All three live in `app/pro/page.tsx`. App not yet shipped. | Strip monthly/yearly before launch. Keep founders. See section 6, Tension A. |
| MIT license + open source story | LICENSE present (2026 Josh Ernst). CONTRIBUTING.md is 5,681 bytes. README is 10,997 bytes. | Repo hygiene is good. |
| Email capture / Beehiiv / Resend | Wired in code. Secrets unpasted in Cloudflare (`/api/health` shows both missing). | Three pending secret pastes: RESEND_API_KEY, BEEHIIV_API_KEY, SESSION_SECRET rotation. |
| Phase 04 depth | Chapter 20 (agent-traces) is production-ready, not skeleton. 800-word overview, 9 steps, real framework references. | Don't undersell phase 4. |
| Capstone alignment | Required concepts from ch13-16 are explicit in the overview. But code-level prerequisite gating is missing. | Risk confirmed. Populate `prerequisites` field before launch. |

**Code-level risks the V1 plan didn't account for:**

1. Capstone prerequisites field is empty even though the narrative requires 21 prior chapters
2. Beehiiv + Resend secrets are unpasted in Cloudflare (email funnel currently silently broken)
3. "Bugs AI shipped this week" branding is live but the underlying engine is one hardcoded example
4. Chapter 26 silent scope creep (write into release notes or hold as v1.1)
5. Pyodide micropip failures (Anthropic SDK, etc.) aren't covered in any lesson, so ~15% of learners will hit silent import errors in chapter 13+

---

## 4. Market Reality (Research, May 2026)

The market exists, the buyer is forming, and the wedge is fresh enough to launch into. Top competitor set:

1. **Maven AI PM cohorts** (Marily Nika, Product Faculty, Mahesh Yadav). $2,000-3,000 per cohort, sold out 2 months ahead. Concrete willingness-to-pay signal. Wedge: live cohort + cert. Gap: no coding, no runnable artifacts.
2. **DeepLearning.AI / Coursera (IBM, Duke)**. $39-49/mo. Brand authority. Video-heavy, low completion.
3. **Product School**. $3-4K corporate-grade cert. Enterprise sales motion.
4. **DataCamp**. Already owns "in-browser interactive python for biz pros." 11M+ learners.
5. **Free creators (Lenny Rachitsky, Vibe Coding Playbook for PMs, Institute of AI PM)**. $0, audience-first. Trust + Substack/X distribution. **This is PromptDojo's real competitive set.**

**Demand signals (verified, 2026):**
- AI literacy is the #1 most-in-demand skill in the US (LinkedIn/WEF, Jan 2026). Postings requiring it grew 70% YoY.
- 92% of US developers report adopting vibe-coding practices; 60% of new code is AI-generated (Nucamp, 2026).
- Marketers explicitly told to "become product builders" in 2026 trend roundups, with python literacy named.

**Saturation check on "ai writes this. it's wrong.":** Fresh. The Q1-Q2 2026 viral cycle (matplotlib AI hit-piece, arxiv survey of AI code bugs, package-hallucination security stories at 29-45% vuln rate / 19.7% hallucinated imports) all target developers. Nobody owns the **non-engineer** frame. That gap is yours.

**Corporate L&D landscape**: Multiverse ($1.7B valuation, 22K learners), Section, Coursera for Business, Disco, Degreed. Sales cycles 6-9 months, deals $30-150K/year. Indie founder at 1K followers cannot sell here. Realistic wedge is **individual ICs expensing $129-499 on a corporate card**, not L&D buyers. Bottoms-up only until 25K+ followers and case studies exist.

**Audience-first playbook patterns:** Pieter Levels archetype works (350K audience → $1.6M ARR launch). Inflection happens at 20K-100K followers in years 4-6. Fails: pure cohort flippers, course creators with no shipped artifact, free-forever with no supporter mechanic.

**The load-bearing insight:** Every competitor on this list still teaches "write python from scratch." Even the AI PM cohorts. PromptDojo's only true moat is **AI code comprehension** (read, diff, debug what Cursor and Claude generated). Rename step prompts to lead with `here's what claude wrote, find the bug` rather than `write this function`. That's not just copy. It's curriculum architecture.

---

## 5. Decisions Made (Locked)

These don't move:

1. **Audience over completion.** Year 1 KPI is X followers + email list size. Completion rate is removed as a tracked metric.
2. **Web stays free forever.** No paywall on the public site.
3. **Python-first.** No JavaScript or other languages before launch. Revisit only after 5K followers.
4. **MIT license.** Already shipped. Don't relicense.
5. **No 501c3 yet.** Personal project or LLC. Revisit in 6-12 months if grants or major donors appear.
6. **Mission frame lives in long-form, not the H1.** The home page leads with the wedge. LinkedIn long-form posts can carry the mission.
7. **Keep the name "PromptDojo" through launch.** Year-2 rename is on the table. Candidate names parked (Codewright, Readable.school, Bugschool). Don't act on them now.
8. **Corporate is a year-three move.** Free LinkedIn company page goes up in Week 2 for compounding. Sales motion, decks, and pricing wait until 25K followers.
9. **The wedge is non-engineers who already use Cursor and Claude Code daily.** Not "anyone curious about AI." Not "students." Not "career switchers." The buyer profile holds.

---

## 6. Decisions Open (Two Tensions to Resolve Before Sprint Starts)

### Tension A: Paid tier at launch

| Position | Argument |
|---|---|
| Kill it entirely (Growth Hacker) | Hide `/pro` behind `/roadmap`. Strip pricing from homepage. Re-introduce when X > 1K and newsletter > 2,500. "Freemium kills the share. People share free forever, not free preview." |
| Keep founding-member only (Brand Guardian) | Dignity move. Mission-supporter capture. "$129 once or read it free forever." |
| As written in V1 (rejected) | Three tiers ($9.99/mo, $59/yr, $129 founders) is the message-splitting problem causing the landing-vs-/pro contradiction. |

**Recommended resolution:** Strip monthly and yearly. Keep founders-only at $129 lifetime. Hide pricing block from the homepage. Move `/pro` to `/founding-members` and lead with "back the school. one time. $129. or read it free forever." Add "free if you can't afford it. email josh@promptdojo.dev" line.

Result: one ask, no contradiction, dignity intact, removes the "+8 weeks app" credibility hit.

### Tension B: Phase 00 (beginner layer)

| Position | Argument |
|---|---|
| Cut it (PM) | The wedge is "PMs who already use Cursor daily." Phase 00 widens the funnel to people who don't. Dilutes Day 0 messaging. |
| Reframe it as AI code comprehension (Trend Research) | Every competitor teaches "write code from scratch." The only moat is "read what AI wrote." Phase 00 should be `here's what claude wrote, find the bug` from the first screen. |

**Recommended resolution:** Don't build the original three modules (what AI is, basic prompting, what code is). Build one **"Read the Bug"** warm-up sequence (3-5 steps) on the homepage as the public hook. It's the wedge artifact, not curriculum widening. Live demo of the thesis in 90 seconds. Same surface area as the proposed Phase 00, totally different audience signal.

This also doubles as launch-day shareable content (the `/caught/[slug]` viral surface uses the same primitives).

---

## 7. The Three-Week Pre-Launch Sprint

V1 said 1-2 weeks. Realistic is 2-3 weeks. The work has more dependencies than V1 budgeted for.

### Week 1 — Plumbing & Content Bank

**Plumbing (gating items):**
- [ ] Paste 3 secrets to Cloudflare Pages: RESEND_API_KEY, BEEHIIV_API_KEY, SESSION_SECRET (manual, ~10 min)
- [ ] Verify `/api/health` shows all green after paste
- [ ] Populate capstone `prerequisites: ["agent-loops", "evals", "prompting"]` in chapter 25 JSON
- [ ] Fix `design-kit/VOICE.md:48` em-dash rule (currently contradicts the "no em dashes" rule, root cause of ~20 violations)
- [ ] Sweep em-dashes from `app/about/page.tsx`, `app/pro/page.tsx`, `components/v2/*`, and the OG card route at `app/og/launch/[name]/route.tsx:193` (highest single fix, ships on every LinkedIn repost)

**Content bank:**
- [ ] Pre-write 20 "bug of the week" markdowns from existing fix-steps in `content/python/`. Store at `content/bugs/YYYY-MM-DD.md`. Template: bug code (5 lines), expected output, what AI shipped, one-keyword fix.
- [ ] Audit chapters 13-16 (LLM APIs phase) for a 2-step "debugging micropip" interstitial. ~15% of learners will silently hit this without it.
- [ ] Audit Phase 4 chapter completeness — spot-check ch17-24, confirm production-ready depth

**Email funnel:**
- [ ] Wire Beehiiv welcome sequence: email 1 (welcome + first bug + GitHub star ask + Twitter follow ask), email 2 (Week 1 bug recap), email 3 (Discord invite — see Week 2)
- [ ] Test end-to-end signup → confirmation → first email delivery

### Week 2 — Viral Surface, Beta, Distribution Infrastructure

**Viral surface:**
- [ ] Build `/caught/[slug]` share-after-fix route. Every fix-step generates a unique URL. Auto-generated OG image: bug + learner's name + "caught in N seconds." Pre-filled tweet button: "i caught the bug ai shipped. you?" Pattern already exists at `/og/launch/wedge`, ~4-6h build.
- [ ] Build the "Read the Bug" homepage warm-up (3-5 steps). The Phase 00 replacement. Each step has its own `/caught/[slug]` page on completion.

**Closed beta:**
- [ ] DM 10 PMs from existing @TFisPython following with a closed-beta link. Goal: harvest 3 screenshot-quote tweets for Day 0 social proof.
- [ ] Beta feedback form: 5 questions max. What confused you? What did you screenshot? Would you share?

**Distribution infrastructure:**
- [ ] Build daily auto-tweet GitHub Action. Cron at 9am ET. Pulls bug from `content/bugs/`, renders screenshot via Playwright (already a repo dep), posts to @TFisPython with hashtag #AIShippedThis and link to matching lesson. Twitter API v2 free tier (17 posts/day limit, you need 1).
- [ ] Pre-queue 60 bugs in `content/bugs/`. 60 days of guaranteed top-of-feed content.
- [ ] Stand up free Discord. Footer link. No gating. Channels: #read-the-bug, #share-your-fix, #meta.
- [ ] Add sticky bar after lesson 1 completion: "starred it on github? it helps. [star button]"

**Pricing & copy:**
- [ ] Strip monthly/yearly tiers from `/pro`. Rename `/pro` → `/founding-members`. Lead copy: "back the school. one time. $129. or read it free forever."
- [ ] Add "free if you can't afford it" line on `/founding-members`: "web is free. forever. if the app costs and you can't, email me." (Brand-recommended wording, 9/10 voice match)
- [ ] Tighten about-page line at `app/about/page.tsx:274` — current text admits a broken promise on a screenshot-able page. Replace with: "web preview is free. the app costs money so the school can pay its bill."
- [ ] Drop "548 runnable steps" from headline. Replace with the wedge.

**Corporate optionality (free, compounding):**
- [ ] Claim PromptDojo LinkedIn company page. Post nothing yet. Just hold the handle.
- [ ] Add Tally "for teams" form to site footer. Captures inbound. Zero build, 12 months of optionality.

### Week 3 — Launch Prep

**Pre-write everything Day 0-3 needs:**
- [ ] Day 0 X thread (10-12 posts). Open: a single bug screenshot, no preamble. Close: "i built a free school for this. 26 chapters. runs in your browser. no signup. promptdojo.dev"
- [ ] Day 1 LinkedIn post (Brand-recommended nail-it version): "ai writes 70% of the code my PM team ships. nobody on the team can read it. i graduated last week. i spent the year before that building a free school for this exact problem. 26 chapters. runs in your browser. no signup. free forever. promptdojo.dev"
- [ ] HN submission (Show HN format)
- [ ] r/learnpython post (community-respectful, not promotional)
- [ ] r/ProductManagement post (cross-post strategy)

**Soft-launch prep:**
- [ ] List 5-10 builders in your network who'll quote-tweet on Day 0. DM them the night before with the thread link.
- [ ] Schedule the night-before "soft launch" — share with 20 close mutuals to prime early replies and signal the algo.
- [ ] Update resume + LinkedIn headline to add "Founder, PromptDojo" (Day 0 visible)

**Final checks:**
- [ ] Run `/qa` against promptdojo.dev — signup flow, lesson load, mobile, share buttons
- [ ] Run `/canary` post-deploy to baseline pre-launch metrics
- [ ] Verify `/api/health` is all green
- [ ] Verify auto-tweet bot's first scheduled post works in dry-run mode

---

## 8. The Launch Sequence (Days 0-7)

V1 said "Day 0 Twitter, Day 1 LinkedIn, Week 1+ daily content." That's a whisper.

### Day -1 (Sunday night)
- Soft-launch to 20 close mutuals via DM. Ask for honest signal, not amplification.
- Post a single quote-tweet teaser from @TFisPython: "shipping something tomorrow that's been a year in the making. it's free."
- Final `/api/health` check.

### Day 0 (Monday 9am ET) — X Thread
- 10-12 post thread from @TFisPython
- Post 1: single screenshot of a bug AI shipped. Zero context. Hook bait.
- Posts 2-9: walk through the broken code, the fix, why a PM should know this
- Post 10: "i built a free school for this. 26 chapters. promptdojo.dev"
- Post 11: GitHub link + MIT license note + star ask
- Post 12: Discord invite
- 5 pre-arranged reply-guys quote-tweet within the first hour to prime the algo

### Day 1 (Tuesday) — LinkedIn
- Personal LinkedIn post with the operator-stat hook (not the "I'm 22" angle, which reads as student-post)
- Link in comments, not in the post body (LinkedIn algorithm penalty)
- Reply to every comment within 24 hours

### Day 2 — Hacker News + Reddit
- Show HN submission at 7am ET (algo-optimal window). Headline format: "Show HN: PromptDojo – A free Python school for people who use AI to code"
- r/learnpython post. Format: "I built [this] because [this problem]. Free, MIT, here's the GitHub."
- r/ProductManagement cross-post. Different framing: "After watching my team paste Cursor output without reading it, I built a free school."

### Day 3 — First Auto-Tweet from the Bot
- 9am ET. First post of #AIShippedThis. Top-of-feed content runs daily from here, no Josh time required.
- LinkedIn company page goes live with the first post (re-share of Day 1 personal post + thank you to early signups)

### Days 4-7 — Compounding Loops
- Daily auto-tweet bot runs
- Discord goes live, Josh shows up daily for first 7 days
- Reply to every screenshot-quote tweet of a completed lesson
- Capture testimonials for the homepage social proof block

### Week 2+
- LinkedIn long-form post weekly, "what your team is shipping wrong because they can't read what claude wrote"
- Twitter thread weekly recapping the week's bugs
- Discord weekly "fix of the week" callout
- Daily auto-tweet bot keeps running

---

## 9. Year 1 Operating Plan (Months 2-12)

**Cadence:**
- Daily: auto-tweet bot (bug + lesson link)
- Weekly: LinkedIn long-form, Twitter thread, Discord callout
- Monthly: one new chapter, one new live demo (5-min video on @TFisPython), Beehiiv newsletter
- Quarterly: state-of-PromptDojo post (followers, signups, completion data, what's coming)

**Content engine inputs:**
- Beta users' submitted bugs (Discord channel for submissions)
- Josh's own scraped Cursor/Claude failures from CrowdTest work (sanitize, never reveal company data)
- Reader-submitted "ai shipped this, help me read it" requests → free public lesson responses

**Audience tactics:**
- Maven AI PM cohort alumni outreach (the $2-3K paid cohort buyers are the perfect free audience). 5 cold DMs per week with a "did your cohort cover reading code AI wrote?" angle. No selling, just the question.
- Podcast pitches: target 5 podcasts/quarter. Founder story angle: "22, just graduated, built a free school for what AI broke."
- LinkedIn re-shares from PromptDojo company page → Josh's personal page (algo loves this)

**Build cadence:**
- One new chapter per month, max. Don't break the curriculum's arc to chase trends.
- Capstone v2 in Q3 (real Anthropic API, optional, learner-funded)
- Native app in Q4 (founding-member supporter unlock)

---

## 10. Year 1 Metrics

Replace V1's list. Track these:

| Metric | Why | Target by Month 12 |
|---|---|---|
| X followers (@TFisPython) | V1→V2 gate, audience-first thesis | 5,000 (10x from estimated ~500) |
| Email list (Beehiiv) | Owned audience, algo-immune | 2,500 |
| Discord members | Community compounding | 500 active |
| Screenshot-quote tweets per week | Audience-loop proxy, real engagement | 10/week by month 6 |
| Inbound DMs mentioning corporate use | Year-3 enterprise pre-positioning | 20 total |
| Podcast appearances accepted | Compounding distribution | 8 |
| `/caught/[slug]` shares per week | Viral surface working | 20/week by month 6 |
| GitHub stars | Open-source credibility | 2,000 |
| Cloudflare uniques per month | Top-of-funnel traffic | 50,000 |

Removed from V1: chapter completion rate (contradicts audience-first thesis), press mentions (vanity, can't action), Year-1 revenue.

---

## 11. Year 2 Strategic Bets (Plan, Don't Build)

By month 12, you'll know whether the audience play worked. Two bets to set up now without building:

**Bet A — Native iOS app at $129 founding-member lifetime, $9.99/mo or $59/yr after first 100.** Already partially built. Polish in Q4. Founding-member capture starts now via `/founding-members` page (Tension A resolution). This is the small-but-real revenue stream that funds Year 2.

**Bet B — Executive AI literacy coaching (1:1, premium).** $500-1,500/session, individual buyers expensing on corp cards. Wait until X > 25K. Build only after inbound DMs hit 20. Page on the site is just a Calendly link with a 5-question intake form. Zero infrastructure.

Defer to Year 3: corporate team training (group), L&D enterprise sales motion, multi-language curriculum, certifications.

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Day 0 lands flat — single tweet, no thread, no replies | Was high (V1) | Killed launch | Resolved by Week 3 prep (thread + reply-guys + HN + Reddit + soft-launch) |
| Email funnel silently broken (secrets unpasted) | High | Lose Week 1 signups | Week 1 plumbing fix, then `/api/health` verification |
| "Bugs AI shipped this week" promise breaks (no content engine) | High (V1) | Bait-and-switch on launch tweet | Pre-bank 60 bugs in Week 1-2, auto-tweet bot in Week 2 |
| Capstone alignment gap (learners skip ch13-16) | Medium | Capstone churns top-tier completers | Populate `prerequisites` field; add micropip debugging interstitial |
| Voice violations on shared OG card | High (V1, now ~20 violations) | Every LinkedIn repost shows em-dash | Week 1 fix of VOICE.md + sweep |
| Founder burnout from daily content cadence | High (without infra) | Engine dies by week 3 | Auto-tweet bot runs without Josh; weekly cadence for the human layer |
| "PromptDojo" reads dated by 2027 | Medium | Brand drag in year 2 | Park rename candidates now; act in Year 2 after audience exists |
| Maven AI PM cohort competitor goes after the same wedge | Medium | Wedge gets crowded | Speed + free + open-source = defensible. Compound faster than they can copy. |
| Anthropic prompt-cache TTL changed 1h → 5min (already happened) | Resolved | Was a build cost issue | Already accounted for in code |
| Pyodide micropip silent failures in ch13+ | Medium-high | ~15% learners drop at LLM APIs | 2-step debugging interstitial before ch13 |
| CDC biosurveillance topic accidentally bleeds into public content | Low | Compliance / employer risk | Hard rule: XWELL and CrowdTest off-limits in PromptDojo content |
| Looks like a "charity," undercuts year-3 corporate sale | Medium | Buyer trains expectation of free | Mission frame stays in long-form posts, never in H1 |

---

## 13. Voice & Style (Mandatory, All Surfaces)

Every word that ships under PromptDojo respects:

- Direct and conversational
- Contractions throughout (don't, won't, you're, it's, can't)
- Short punchy sentences. Fragment when it lands harder. Like this.
- NO em dashes ever. Use commas, periods, parentheses, or hard breaks.
- No consultant-speak: leverage, delve, navigate, robust, seamless, holistic, journey, unlock, empower, comprehensive, ecosystem, landscape.
- No AI-sounding constructions: "delve into," "in a world where," "navigate the landscape," "let's explore."
- Authentic and unpolished where appropriate.
- First-person, human, lowercase often.

**Style guide fix (Week 1):** `design-kit/VOICE.md:48` currently permits em dashes. Strike that line. It's the root cause of ~20 violations downstream.

**Mission tagline (LinkedIn, decks):** "read the code ai wrote. it's your codebase now." Use on corporate-facing surfaces. Don't put it on the home page.

**Home page tagline (don't change):** "ai writes this. it's wrong."

**Founding-member CTA copy:** "back the school. one time. $129. or read it free forever."

**"Free if you can't afford it" line:** "web is free. forever. if the app costs and you can't, email me."

---

## 14. Three Things to Push Back On (Carried From V1)

1. **Don't add JavaScript or other languages before launch.** Python-first is correct. Expand after signal hits 5K followers.
2. **Don't position as a charity on LinkedIn.** Position as a founder building a free public good. Charity vibes read as preachy and undercut the corporate buyer you eventually want.
3. **The "PromptDojo" name undersells the product.** Not a launch blocker. Park rename candidates (Codewright, Readable.school, Bugschool). Revisit Year 2.

---

## 15. Open Questions for Josh (Decisions Needed Before Sprint Starts)

1. **Tension A locked?** Strip monthly/yearly tiers, keep founders-only at $129? (Recommended yes.)
2. **Tension B locked?** Replace Phase 00 with a "Read the Bug" 3-5 step warm-up on the homepage? (Recommended yes.)
3. **Chapter 26 (agent-harnesses):** include in v1 launch as "26+" or hold as v1.1? (Recommended: include, advertise as "26 chapters, 557 steps" or just drop the numbers entirely.)
4. **Closed beta scope:** 10 PMs from existing X following — Josh DMs them personally, or build a Tally application form? (Recommended: Josh DMs, max 5 minutes per person.)
5. **Discord — yes/no?** Recommended yes (audience-first plays compound on community). But it's a maintenance load. Alternative: GitHub Discussions.
6. **PromptDojo LinkedIn company page in Week 2 — yes/no?** Recommended yes. Free compounding move. Zero ongoing cost.

---

## 16. Appendix: Voice Audit Findings (From Brand Guardian)

Em-dash violations to fix in Week 1 sweep:

- `app/about/page.tsx`: lines 72, 88, 96, 120, 307, 315
- `app/pro/page.tsx`: lines 63, 120-121 (three in one paragraph), 142, 253, 257, 261, 282
- `app/og/launch/[name]/route.tsx:193` (OG card, highest blast radius)
- `components/LoginToSave.tsx`: lines 380, 439
- `components/StreakWidget.tsx`: lines 38, 42
- `components/v2/ChapterEndCard.tsx`: line 33
- `components/v2/LessonStepClient.tsx`: line 212
- `components/v2/HomeClient.tsx`: line 77
- `components/v2/steps/_grader.ts`: lines 45, 102
- `design-kit/VOICE.md:48` (source of contradiction, fix first)

Consultant-speak: clean on the live site. Only hits are in `design-kit/copy-v1/*.md` (strategy docs, not shipped).

---

## 17. Appendix: Year-2 Rename Candidates (Park, Don't Act)

| Name | Memorability | Search (.com / USPTO 41) | Tone fit | Verdict |
|---|---|---|---|---|
| Codewright | 8/10. One word, evokes craft (playwright, shipwright). | .com parked, USPTO appears clear | Strong. Craft + ship, no "academy" smell. | Top pick |
| Readable | 7/10. Owns "read what AI wrote" thesis as a one-word brand. | .com taken (readability SaaS), readable.school open | High. Wedge IS the name. | Strong if .com workaround |
| Bugschool | 9/10. Sticky, lowercase-native, names the product. | bugschool.com open, USPTO clear | Perfect voice match. Risks "novelty toy" read. | Dark horse |

Avoid: "AI Literacy Lab," "BuildersAcademy," anything with "for everyone." Wedge-flattening trap.

---

## 18. /autoplan Review Report (May 11, 2026) — APPROVED

**Status**: APPROVED by Josh on 2026-05-11. All 4 gate decisions locked at recommendation:
- D1 (viral arch): category-slug + ?n= name. Ships in Week 2 on Cloudflare Pages free tier.
- D2 (capstone gate): ship full schema + runtime + UI in Week 1 (2-3 days).
- D3 (Day 3 gate): included. <200 followers in 72h → pause bot, pivot to beta-first 30 days.
- D4: all 23 auto-decisions + 3 minor taste calls accepted.

Plan is locked. Week 0 starts tomorrow (lock follower count, decide /caught arch implementation details).

This section is the output of gstack /autoplan run against this plan. Four independent reviewers (CEO, Design, Eng, DX) read the plan + codebase blind. Codex was unavailable — every phase is single-voice. The 6 decision principles (completeness, boil-lakes, pragmatic, DRY, explicit-over-clever, bias-to-action) auto-decided 23 fixes. Six taste decisions go to Josh's gate. Two confirmed errors in this plan's technical claims need correction before Week 1 starts.

### 18.1 Plan claims that turned out to be wrong

Eng review verified each technical claim against the actual code. These are the misstatements:

| Claim in plan | Reality | Correction |
|---|---|---|
| "557 runnable steps" (section 3) | `manifest.toc.json` reduced = **575** steps | Update plan + drop the number from headline copy regardless |
| "26 chapters + 1 bonus ch26" (section 3) | `manifest.toc.json` chapters.length = 26 total. There is no "+1" — ch26 IS chapter 26 | Stop calling ch26 a bonus. It's chapter 26. |
| "Capstone JSON `prerequisites: []` empty" (sections 3, 7) | Schema is YAML, not JSON. Field doesn't exist at all — not empty, absent. Verified at `content/python/25-capstone/01-build-a-cli-agent/lesson.yaml:4` | Need schema extension in lesson loader + runtime gate component + UI surface. **2-3 days of work, not "populate the field"** |
| "Playwright already a repo dep" (section 7 Week 2) | `package.json` has zero Playwright entries | Playwright install adds ~300MB. Cloudflare Pages build OOM risk |
| "Existing GitHub Actions in .github/workflows/" (section 7) | `.github/` has only ISSUE_TEMPLATE. No workflows dir | GitHub Action is greenfield, not a port |
| "Twitter API v2 free tier, 17 posts/day" (section 7 scrappy hack) | POST /tweets requires OAuth 1.0a User Context (4 secrets: API key, API secret, access token, access secret) — not Bearer. Monthly cap is 500 posts | Update secret count + monthly cap awareness |
| "Pattern exists at /og/launch/wedge, 4-6h build for /caught/[slug]" (section 7) | `app/og/launch/[name]/route.tsx` uses `dynamic = "force-static"` + hardcoded `generateStaticParams` to 6 names. `next.config.ts:7` is `output: "export"` (static export to Cloudflare Pages). **Dynamic per-learner-name OG generation is architecturally impossible on this config.** | Either ship category-level slugs with learner name as `?n=` query rendered client-side, OR move off static export (breaks current hosting model). Decide before Week 2. |

### 18.2 Decision Audit Trail (auto-decided fixes)

Each row was auto-decided using the 6 /autoplan principles. P1=completeness, P2=boil-lakes, P3=pragmatic, P4=DRY, P5=explicit, P6=bias-to-action.

| # | Phase | Decision | Class | Principle | Rationale |
|---|---|---|---|---|---|
| 1 | Design | Add `app/page.tsx:27, 32, 40, 120, 223` to em-dash sweep | Mechanical | P2 boil-lakes | Plan's appendix missed homepage metadata. OG title + Twitter card title ship em-dashes on every link unfurl. 50x blast radius of about-page violations |
| 2 | Design | Add 301 redirect `/pro` → `/founding-members` to Week 1 plumbing | Mechanical | P5 explicit | Plan renames without redirect; 3 internal links break (homepage:144, about:284, 336) |
| 3 | Design | Strip homepage `/pro` link at `app/page.tsx:144-150` + footer pricing line 223 ("$9.99/mo in the app") | Mechanical | P3 pragmatic | Tension A locked at founders-only makes the footer a lie. Inline pricing block at line 120 contradicts the strip-pricing decision |
| 4 | Design | Cut "Read the Bug" warm-up from 3-5 steps to exactly 3 | Mechanical | P5 explicit | Plan's own "live demo in 90 seconds" framing argues against 5 steps. 3 steps is the hook; 5 is a chapter |
| 5 | Design | Spec the `/caught/[slug]` *landing page* explicitly, not just the OG image | Mechanical | P1 completeness | Plan describes the image; viral loop has no second hop without the landing page design |
| 6 | Design | Add "mobile pass" checkbox to Week 3 final checks (375px width on `HeroBugSnippet`) | Mechanical | P2 boil-lakes | Plan never says "mobile" — wedge audience reads LinkedIn on phones |
| 7 | Design | Write `design-kit/DESIGN.md` index pointing at VOICE.md, BRAND.md, TYPOGRAPHY.md, tokens.css | Mechanical | P1 completeness | 20-min task, future-agent leverage |
| 8 | Eng | Capstone prerequisites = (a) zod schema extension + (b) runtime gate reader + (c) UI component, not "populate field" | Mechanical | P1 completeness | Plan misdiagnoses scope; field doesn't exist in the schema |
| 9 | Eng | Decide `/caught/[slug]` architecture model BEFORE Week 2: category-slug + client-side name OR move off static export | **TASTE** (surfaced at gate) | P5 explicit | Plan claims 4-6h; reality is architecturally constrained by output:"export" |
| 10 | Eng | Append micropip interstitial at END of ch12 (or as "ch12.5"), NOT inside ch13 | Mechanical | P5 explicit | Inserting steps inside ch13 shifts step indices and silently breaks PROGRESS_KV for returning learners (F6 — Eng review's most-missed risk) |
| 11 | Eng | Add `vitest` + 3 minimum tests (subscribe happy path / rate-limit / 503; OG generateStaticParams snapshot; bugs schema validator) | Mechanical | P2 boil-lakes | Repo has zero test runner. Half-day of work catches 4 critical failure modes deterministically |
| 12 | Eng | Update Twitter OAuth model in plan: 4 secrets (OAuth 1.0a User Context), not 1 (Bearer) | Mechanical | Correctness | Bearer doesn't work for POST /tweets |
| 13 | Eng | Add monitor-ping step to daily auto-tweet workflow + 36h-no-ping alert | Mechanical | P1 completeness | X tokens expire silently in 2024+; bot dies with no alarm without this |
| 14 | Eng | Fix `subscribe.ts:121-128` to return 502, not 200, on Beehiiv 5xx | Mechanical | P5 explicit | Monitors can't distinguish failure from success today |
| 15 | Eng | Validate `content/bugs/*.md` frontmatter via zod before workflow render | Mechanical | P1 completeness | Treats `content/bugs/` as CMS, prevents typo-cascade |
| 16 | DX | Resolve pnpm vs bun ambiguity. Sweep all `bun` references, add `packageManager: "pnpm@x"` to package.json + `.nvmrc` | Mechanical | P4 DRY | README + CONTRIBUTING say pnpm; some task scripts say bun. Every contributor hits this. 15 min fix |
| 17 | DX | Ship Pyodide warming indicator on first lesson load | Mechanical | P2 boil-lakes | 5-12s of silent cold boot = wedge audience bouncing. 1-2h fix |
| 18 | DX | Upgrade grader stdout-mismatch message with case/whitespace cause detection at `_grader.ts:52` | Mechanical | P3 pragmatic | Single biggest empathy upgrade. 2h |
| 19 | DX | Expand `AGENTS.md` from 5 lines to ~40: schema path, step lifecycle, grader kinds, prebuild gate, chapter-add path | Mechanical | P1 completeness | The file AI contributors read first; currently cryptic |
| 20 | DX | Add `pnpm doctor` script validating Node 20+, pnpm 8+, python3 on PATH | Mechanical | P2 boil-lakes | Catches silent prereq miss for new contributors. 30 min |
| 21 | CEO | Lock current @TFisPython follower count Week 0 (before sprint starts) | Mechanical | P5 explicit | Plan's audience-first thesis depends on the starting base; needs to be measured, not assumed |
| 22 | CEO | Add Day 3 decision gate: <200 new followers → pause bot, switch to beta-first for 30 days | **TASTE** (surfaced at gate) | P1 completeness | Plan has no recovery branch; CEO's #1 failure mode is "empty-room launch" |
| 23 | CEO | Add native iOS app trigger: ship at 100 founding members paid OR M9, whichever first | Mechanical | P5 explicit | Plan says "Q4 polish" without a trigger condition |

### 18.3 Consensus Tables (single-voice; Codex unavailable)

**CEO Consensus** (verdict 8/10 overall):

| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| Premises valid? | Partial (audience-base premise unvalidated) | N/A | Partial |
| Right problem to solve? | Yes | N/A | Confirmed |
| Scope calibration correct? | Yes | N/A | Confirmed |
| Alternatives sufficiently explored? | No (no recovery branch) | N/A | Gap |
| Competitive risks covered? | Yes | N/A | Confirmed |
| 6-month trajectory sound? | Yes IF launch lands | N/A | Conditional |

**Design Consensus** (Design Litmus Scorecard average 4.6/10):

| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| Information hierarchy | 6/10 | N/A | Partial |
| Missing states | 3/10 | N/A | Failing |
| User journey | 5/10 | N/A | Partial |
| Specificity | 4/10 | N/A | Failing |
| Mobile-first | 3/10 | N/A | Failing |
| Accessibility | 4/10 | N/A | Aspirational |
| Design system alignment | 7/10 | N/A | Passing |

**Eng Consensus**:

| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| Architecture sound? | NO | N/A | Failing (caught/[slug] vs output:"export") |
| Tests sufficient? | NO | N/A | Failing (no test runner installed) |
| Perf addressed? | Partial | N/A | OG-at-build-scale ignored |
| Security covered? | Partial | N/A | Twitter OAuth model wrong in plan |
| Errors handled? | Partial | N/A | No alerting on cron; prereq gate has no implementation |
| Deploy risk manageable? | Yes with discipline | N/A | Confirmed |

**DX Consensus** (DX Scorecard average 5.6/10):

| Dimension | Claude | Codex | Consensus |
|---|---|---|---|
| TTHW learner | 7/10 (Pyodide cold boot drag) | N/A | Partial |
| TTHW contributor | 4/10 (pnpm/bun ambiguity) | N/A | Failing |
| API/CLI ergonomics | 6/10 | N/A | Partial |
| Error message quality | 4/10 | N/A | Failing |
| Doc findability | 5/10 | N/A | Partial |
| Upgrade path safety | 5/10 | N/A | Partial |
| Dev env friction | 6/10 | N/A | Partial |
| Escape hatches | 5/10 | N/A | Partial |

### 18.4 Cross-Phase Themes (concerns flagged independently by 2+ reviewers)

These are the high-confidence signals where multiple independent reviewers landed on the same finding:

- **Theme 1 — Capstone prerequisites is a 2-3 day fix, not a one-liner.** Flagged by CEO (highest-leverage code fix), Eng (schema + runtime + UI), DX (confirmed at lesson.yaml:4). Plan understated scope by ~10x.
- **Theme 2 — OG metadata em-dashes are the highest-blast-radius single fix in the launch.** Flagged by CEO (Week 1 sweep), Design (homepage `app/page.tsx:27,32,40` missed from plan list). Every Day 0 link unfurl ships brand contradiction.
- **Theme 3 — Launch has no recovery branch / silent-failure shield.** Flagged by CEO (no Day 3 gate, no follower count lock), DX (Resend failure looks silent, grader errors no empathy, Pyodide cold boot silent). Plan optimizes for happy path.
- **Theme 4 — `/caught/[slug]` is design-thin AND architecturally undefined.** Flagged by Design (no landing page spec, only OG) + Eng (`output: "export"` blocks dynamic name in URL). Plan's "4-6h" budget is wrong on both counts.
- **Theme 5 — Mobile is unspecified throughout.** Flagged by Design (word "mobile" never appears) + DX (Pyodide warming UI must work on touch). Wedge audience is LinkedIn-on-phone.

### 18.5 Taste Decisions (Josh's gate)

These are the 6 decisions where reasonable people could disagree. All others auto-decided above.

1. **`/caught/[slug]` architecture**: category-level slugs with name in `?n=` query (works with static export, ships in 4-6h) versus full per-learner-name route (requires moving off static export, breaks current Cloudflare Pages free hosting + 1-2 days of refactor). Recommendation: category-slug + query name. Reason: P3 pragmatic, ships on schedule, OG image still works.
2. **Day 3 decision gate**: hard cutover to beta-first if <200 new followers (CEO recommends) versus ride out the launch and bank-content the bot to bridge. Recommendation: include the gate. Reason: cheap optionality, costs nothing if launch hits.
3. **Read the Bug warm-up step count**: lock at 3 (Design recommends, fits 90-sec frame) versus 3-5 (plan as written, more breathing room). Recommendation: 3 steps. Reason: P5 explicit; plan's own framing contradicts 5 steps.
4. **Capstone prereq scope**: ship the gate before launch (Eng + CEO + DX all recommend) versus ship as v1.1 hotfix Week 2. Recommendation: ship before launch. Reason: 2-3 days = fits in 3-week sprint; visible failure post-launch hurts credibility.
5. **Ch26 (agent-harnesses) treatment**: include in launch as "chapter 26" (Eng review confirms it IS ch26, not a bonus) versus hold as v1.1. Recommendation: include. Reason: it's done. Plan's "26+" framing was based on misread of manifest.
6. **Native iOS app trigger**: 100 founding members paid OR M9, whichever first (CEO recommends explicit trigger) versus "polish in Q4, watch the signal". Recommendation: explicit trigger. Reason: P5 explicit; "polish" with no trigger = drift.

### 18.6 New Risks Added to the Register

These are net-new risks the original §12 register didn't have:

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `/caught/[slug]` ships with hardcoded names (devs read existing pattern literally), share button posts to dead URL | High if Week 2 doesn't pre-decide arch | Viral surface broken | Pre-decide architecture before Week 2 starts. Test the share flow with 3 fake learner names |
| Step-index shift inside ch13 silently breaks PROGRESS_KV for returning learners | High until plan fixes | Returning learners lose progress | Append micropip interstitial at end of ch12 or version PROGRESS_KV keys |
| Twitter OAuth 1.0a token expires (X has been aggressively rotating since 2024) | Medium by M6 | Bot dies silent, daily cadence stops | Workflow pings monitor URL on success; 36h-no-ping alert |
| Cloudflare Pages build OOMs on Playwright install (~300MB browsers) | Medium if Playwright added | Production deploy breaks | Use headless screenshot service or render server-side without Playwright |
| Empty-room launch (Day 0 lands at <100 likes, bot tweets into silence) | Medium until follower count locked | Kills the year | Day 3 decision gate; switch to beta-first for 30 days |
| Pyodide cold boot looks like a dead page (5-12s silent) | High on first visit | Wedge audience bounces before lesson 1 | "warming sandbox" indicator on first lesson load |
| Contributor confusion at pnpm vs bun ambiguity | High | New contributors quit before first PR | Sweep `bun` → `pnpm`; add `packageManager` field; 15 min fix |
| Resend secret unpasted by Day 0 (still missing per `/api/health`) | Medium if not done Week 1 | Welcome emails silently fail | Paste before launch (already on plan); add fallback "saved your spot, email coming" |
| Beehiiv subscribe returns 200 on failure (subscribe.ts:121) | High | Monitors can't tell signups from drops | Return 502 with safe public message |
| Per-IP rate limit (subscribe.ts:31) trips on Day 0 launch when office WiFi NATs share one IP | Medium during traffic spike | Real signups rejected | Raise limit for launch week or move to Cloudflare WAF |

### 18.7 Revised Week 1-3 Sprint (autoplan additions)

**Week 0 (this week, before sprint starts):**
- Lock current @TFisPython follower count. Decision: if <300, restructure to beta-first per CEO Alt B.
- Decide `/caught/[slug]` architecture (taste decision #1 above).

**Week 1 additions to plumbing list:**
- Em-dash sweep: ADD `app/page.tsx:27, 32, 40, 120, 223` to existing list (highest blast radius)
- Add 301 redirect `/pro` → `/founding-members` (3 internal links break otherwise)
- Strip homepage `/pro` link at `app/page.tsx:144-150` + kill footer pricing at line 223
- Build capstone prerequisites SYSTEM (schema + runtime gate + UI), not just "populate field"
- Add `vitest` devDep + write 3 minimum tests (subscribe, OG snapshot, bugs schema)
- Append micropip interstitial at end of ch12, NOT inside ch13 (preserves PROGRESS_KV)
- Fix subscribe.ts:121-128 to return 502 on Beehiiv 5xx
- Sweep `bun` → `pnpm` everywhere; add `packageManager` field + `.nvmrc`
- Add `pnpm doctor` script (Node 20+, pnpm 8+, python3)

**Week 2 additions:**
- Pyodide warming indicator on first lesson load
- Upgrade grader empathy message at `_grader.ts:52` (case/whitespace detection)
- `/caught/[slug]` landing page design (HTML page that recipients click into), not just OG image
- Cut "Read the Bug" to exactly 3 steps with explicit state spec (loading, wrong, partial, right, share)
- Expand `AGENTS.md` to 40 lines
- Write `design-kit/DESIGN.md` index
- Twitter OAuth 1.0a setup (4 secrets, not 1) + monitor-ping step in workflow
- Zod schema for `content/bugs/*.md` frontmatter

**Week 3 additions:**
- Mobile pass: verify `HeroBugSnippet` at 375px (iPhone SE) doesn't clip the punchline
- About-page comparison table mobile render audit
- Day 0 night-before: confirm 5 reply-guys ready by 9:05am ET (60-min algo window)
- Day 3 decision gate (if Josh accepts taste decision #2): document the "<200 followers → pivot" trigger

### 18.8 Overall Verdict

| Reviewer | Score | One-line take |
|---|---|---|
| CEO | 8/10 | Strategically tight, three blocking additions needed (follower count lock, Day 3 gate, capstone prereqs) |
| Design | 4.6/10 avg | Strategic skeleton right, implementation design-thin; cheap to fix in one pass |
| Eng | NO on arch + tests | Plan made 5 technical claims that are wrong; critical fix on caught/[slug] arch |
| DX | 5.6/10 avg | Strong learner wedge; contributor TTHW is the soft underbelly. Fixable in <1 day |

**Net**: Plan is strategically correct but technically wrong in three load-bearing places. Fix those before Week 1 starts and the plan is launch-ready. Don't fix them and Day 0 ships with broken viral surface, broken capstone gate, broken bot.

---

---

## 19. Premortem Hardening (May 11, 2026, post-/autoplan)

Ran a fresh premortem against this APPROVED plan. 8 deep-dive investigators surfaced 8 distinct failure modes. The full report lives at `/Users/joshernst/Obsidian/v01/20-Projects/promptdojo/premortem-report-20260511-1709.html`. This section layers the premortem's revisions on top of §18.

### 19.1 The single most-likely failure: F1 — Sprint slips 5 weeks late

Probability ~60%. Week 1 has 23 fixes with zero buffer. First XWELL CDC escalation eats the float that doesn't exist. Day 0 ships into a decayed post-grad window. Reply-guys cooled. Two competing Python-for-PM accounts have launched threads. Day 3 gate trips at 140 followers, not 200.

### 19.2 The single most-dangerous failure: F5 — Audience composition wrong

Probability ~50%, severity multi-year. @TFisPython's existing followers are senior devs; the wedge is non-engineer PMs. Follower count reaches 847 — looks healthy, wrong shape. Year 2 corporate L&D pitch fails because the social proof is dev-Twitter shitposting, not PM testimonials. **Multi-year setback dressed as a near-miss.**

### 19.3 The hidden assumption (across all 8 stories)

**Engineering hours and distribution hours are not fungible.** The plan treats "ship the capstone gate" and "post the Tuesday thread" as same-currency "launch work." Engineering pays instant dopamine (visible commit, green CI). Distribution pays slow, statistical, dignity-bruising feedback. Without an explicit hours-ratio guardrail, engineering wins every Saturday morning.

**Sub-assumption (unvalidated)**: "@TFisPython's existing audience IS the wedge audience." 30 minutes of bio-scanning would test it. The plan deferred this check to Day 3. The premortem moves it to TODAY.

### 19.4 Week 0 — moved up before sprint, 2 new pre-sprint tasks

**Two tasks block sprint start. Do them today, 2026-05-11.**

- [ ] **Follower composition audit.** Scan top 200 @TFisPython follower bios. Decision rule: if <15% contain "PM," "product," "marketing," "ops," "growth," or non-engineer titles, beta-first track activates immediately. Don't run the 3-week sprint into the wrong audience. (~30 min) [F5]
- [ ] **Decide /caught/[slug] implementation details.** Per autoplan D1, architecture is category-slug + ?n=. Pre-decide: slug naming convention (one per bug, ~60 max), OG image layout sketch (1600×900, bug code centered, "promptdojo.dev" footer), landing page wireframe with anonymous-fallback + name-overflow truncation. (~1 hour)

### 19.5 Week 1 — capped at 5 deliverables, not 23

The premortem found that compressing 23 fixes into Week 1 is the load-bearing failure. **New rule: ship 5 deliverables in Week 1, slide everything else to Week 2-3.** Better to ship a smaller sprint than slip a fuller one.

1. **Paste 3 Cloudflare secrets + verify `/api/health` all green.** RESEND_API_KEY, BEEHIIV_API_KEY, SESSION_SECRET rotation (existing sessions invalidate, expected).
2. **Em-dash sweep — full list.** `design-kit/VOICE.md:48` strike permission first. Then `app/page.tsx:27, 32, 40, 120, 223` (homepage metadata — highest blast radius, ships on every link unfurl). Then `app/about/page.tsx:72, 88, 96, 120, 307, 315`. Then `app/pro/page.tsx:63, 120-121, 142, 253, 257, 261, 282`. Then `app/og/launch/[name]/route.tsx:193`. Then `components/v2/*`. (~3 hours grep + manual)
3. **Capstone gate Stage 1 of 3 only**: schema field in `lib/content/schema.ts` extension + vitest test asserting `schema.parse({prerequisites: [...]})` round-trips. Runtime + UI gate slide to Week 2-3. (~4 hours)
4. **Append micropip interstitial at END of ch12** (NOT inside ch13 — prevents PROGRESS_KV step-index breakage). (~2 hours)
5. **Vitest scaffold + 1 test on `/api/subscribe`** happy path + bun→pnpm sweep (`packageManager` field, `.nvmrc`). (~3 hours)

Everything else (capstone runtime, capstone UI, Pyodide warming, grader empathy, /caught/[slug] build, AGENTS.md, DESIGN.md, doctor script) moves to Week 2-3 below.

### 19.6 Week 2 — capstone runtime + viral surface + pivot runbook

**New: docs/pivot-runbook.md is a Week 2 deliverable.** Must exist BEFORE Day 0. The pivot becomes execution, not invention.

1. **Capstone gate Stage 2 of 3**: runtime PROGRESS_KV reader. Vitest mocks PROGRESS_KV and asserts redirect when cold-jump from sidebar to ch25 happens without ch13-16 complete.
2. **/caught/[slug] viral surface**: category-slug + ?n= per autoplan D1. INCLUDING the landing page (not just OG image), per Design review. Pattern from `/og/launch/wedge` for the OG image. Anonymous-fallback when no `?n=`. Truncate names >24 chars.
3. **Pre-stage Day 3 pivot — `docs/pivot-runbook.md`**:
   - 50-PM target list (X following bio-scrape + Maven AI PM Bootcamp alumni from public cohort pages + LinkedIn manual scrape)
   - 3 DM templates, tested with 3 people from Josh's network
   - "We paused, here's why" email draft for existing signups
   - Definition of "successful beta" = 30 finished + 10 testimonials
   - Target: <24h from gate-trip to first beta DM sent
4. **Pyodide warming indicator** on first lesson load. Tailwind toast "warming your python sandbox... (first load only)" + localStorage-cache the warmed flag.
5. **Grader empathy upgrade at `_grader.ts:52`**: case/whitespace cause detection. "Got 'hello', expected 'Hello, model.'. (case difference — python's strict about caps.)"
6. **GitHub Action auto-tweet bot** with OAuth 1.0a (4 secrets, not Bearer). **Bot observability routes to Telegram Errors topic** (not `josh@promptdojo.dev`). `last_successful_post` surfaces on Josh's morning brief. Token-age check warns at day 55.
7. **Closed beta: DM 10 PMs** from existing following → harvest 3 screenshot-quote tweets for Day 0 social proof.
8. **Discord launch** (or GitHub Discussions fallback if Discord moderation feels like too much).
9. **AGENTS.md expanded to 40 lines** (schema path, step lifecycle, grader kinds, prebuild gate, chapter-add path).
10. **`design-kit/DESIGN.md` index** pointing at VOICE.md, BRAND.md, TYPOGRAPHY.md, tokens.css.
11. **`pnpm doctor` script** (Node 20+, pnpm 8+, python3 on PATH).

### 19.7 Week 3 — capstone UI + thread prep + mobile pass

1. **Capstone gate Stage 3 of 3**: UI as pre-entry redirect (NOT post-completion banner). Manual QA must include sidebar-cold-jump-from-ch3 path, not just happy path.
2. **Pre-write all Day 0-3 distribution** (per §8): X thread (10-12 posts), LinkedIn personal post (operator-stat hook), HN Show HN submission, r/learnpython post, r/ProductManagement cross-post.
3. **Line up 5 reply-guys** from existing network. DM the night before with thread link, confirm they're ready by 9:05am ET (60-min algo window).
4. **Mobile pass**: verify `HeroBugSnippet.tsx:37` doesn't clip the punchline at 375px (iPhone SE). Audit about-page comparison table mobile render at `app/about/page.tsx:213-238`.
5. **Strip `/pro` link from homepage hero** at `app/page.tsx:144-150` + kill pricing line 120 + footer pricing line 223 ("$9.99/mo in the app" — Tension A makes this a lie).
6. **Add 301 redirect `/pro` → `/founding-members`** (3 internal links would otherwise break).
7. **Fix `subscribe.ts:121-128`** to return 502 (not 200) on Beehiiv 5xx.
8. **Pre-commit podcast pitches** to calendar slots in weeks 4, 6, 8, 10, 12. 5 pitches per slot.
9. **Calendar-block Saturday 8am-12pm "promptdojo distribution only"** through 2026-08-11. Defend like an XWELL meeting.

### 19.8 The behavioral guardrail (most important addition)

The premortem's hidden assumption was that engineering and distribution hours are fungible. They aren't. **New operating rule for the 90-day window:**

- **Saturday 8am-12pm is distribution-only.** No code commits in this block. Output: 5 X posts queued + 1 LinkedIn long-form drafted + reply to inbound DMs + podcast pitch sent if it's a pitch week.
- **Log distribution-hours BEFORE engineering-hours each Saturday.** Distribution gets the morning, engineering gets the afternoon. If distribution didn't happen, engineering doesn't happen.
- **Hours ratio target: 1:1 distribution:engineering through 1,000 followers.** If engineering exceeds distribution in any week, the NEXT week is distribution-only.
- **Cap engineering at 2 shippable items per week** until 1K followers crossed.
- **Drafted-but-unpublished post sitting >48 hours = the codebase is winning.** Force ship or kill.

### 19.9 Year 1 metric additions

Add to the §10 Year 1 metrics table:

| Metric | Why | Target by Month 12 |
|---|---|---|
| % new followers with non-engineer bios | Audience composition (F5 prevention) | ≥20% weekly |
| `last_successful_post` age (auto-tweet bot) | Bot dies silently risk (F6) | <48h always |
| Weekly distribution:engineering hours ratio | The hidden assumption guardrail (F8) | ≥1:1 until 1K followers |
| Days from Day 3 gate trip to first beta DM (if triggered) | Pivot execution speed (F4) | <24h |

### 19.10 Year 2 / Year 3 corrections

- **Kill iOS app polish from Q3 entirely.** Either it ships Q4 as a single 2-week build, or it doesn't ship. No "polish in Q4 when ready" — that's the F8 dopamine sink in disguise. The founding-member capture works without an app for 12 months.
- **Corporate L&D outreach pre-condition**: in addition to ≥25K X followers, ≥40% of audience must be non-engineer (verified via bio scan). Otherwise the social proof is the wrong shape.

### 19.11 Revised Pre-Launch Checklist (replaces §14)

Five items, each prevents a specific premortem failure mode. All must be green before Day 0 ships:

1. **Follower composition audit done** — top 200 @TFisPython bios scanned, ≥15% wedge match (or beta-first activated). Done 2026-05-11. [F5]
2. **`docs/pivot-runbook.md` committed before Day 0** — 50-PM target list, 3 DM templates, signup-pause email, success definition. Time-to-first-DM target <24h. [F4]
3. **Capstone gate has 3 passing vitest tests before Day 0** — schema round-trip + runtime cold-jump block + UI pre-entry redirect. Manual QA explicitly tested sidebar-jump-from-ch3 path. [F2]
4. **Bot alerts route to Telegram Errors topic** + token-age check at day 55 + `last_successful_post` surfaced on morning brief. Webhook tested with intentional bot failure. [F6]
5. **Saturday 8am-12pm calendar-blocked through 2026-08-11.** First-block deliverable: distribution-hours log + week's 5 X posts queued + 1 LinkedIn long-form drafted. Distribution before engineering. [F1, F7, F8]

---

**End of plan v3** (V2 + /autoplan + premortem hardening). 8 sections of analysis layered onto the original 17-section strategic skeleton.

**Next step (right now, 2026-05-11)**:
1. Run the follower composition audit (30 minutes, blocks everything downstream).
2. If wedge match ≥15%: start Week 0 tomorrow with the 2 pre-sprint tasks (§19.4).
3. If wedge match <15%: activate beta-first track immediately. Week 0 becomes "build pivot runbook" instead of "decide /caught arch."

**Week 1 starts Monday 2026-05-13** assuming follower audit clears. 5 deliverables only.

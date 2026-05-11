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

**End of plan.** Next step: resolve the six open questions in section 15. Then start Week 1 plumbing on Monday 2026-05-13.

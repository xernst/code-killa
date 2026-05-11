# promptdojo web launch week (2026-05-11 → 2026-05-17)

context: pivoted from "app + web together" to "web first, app on waitlist
signal". this is the launch-week sprint. shipping the web on friday with
an X thread + reddit post. monday-thursday is bug-bash + polish.

success metrics (week 1):
- 500+ unique visitors on launch day
- 50+ email waitlist signups
- 5+ founders pre-orders (validates pricing intuition)
- 0 critical bugs hitting prod after launch tweet posts

dont-do (week 1):
- pay $99/yr apple dev
- xcode install
- npm install in mobile/
- any IAP plumbing
- new chapter content

---

## monday 2026-05-11 — bug bash

**owner**: 8-agent QA team, parallel
**ship**: every critical bug fixed and pushed to prod

agents dispatched in this session:
1. **Browser QA** — runs critical paths through real chrome via browser-harness; reports broken interactions, layout breakage, broken nav, JS errors
2. **Accessibility Auditor** — WCAG 2.1 AA on /, /about, /pro, /privacy, /terms, /learn/v2/agent-loops/the-loop/0
3. **Performance Benchmarker** — lighthouse against / and /learn/v2/.../0; flag CWV regressions, asset bloat
4. **Copy QA** — typos, broken links, voice slips across home, about, pro, privacy, terms, footer
5. **SEO/Metadata auditor** — og:image, twitter:card, schema.org, sitemap, robots, descriptions
6. **Security auditor** (/cso analog) — CSP, headers, env-var leaks, exposed routes, XSS surfaces
7. **Mobile responsive QA** — 375px iphone-se viewport across every public route
8. **Waitlist conversion auditor** — does the EmailSignup → /api/subscribe → Beehiiv flow actually work end-to-end?

bugs found get tracked in this file under "monday findings" then fixed in priority order. critical = breaks lesson runtime or waitlist signup. high = breaks SEO/metadata/a11y. medium = visual polish.

---

## tuesday 2026-05-12 — cross-device QA

**owner**: solo (josh) + browser-harness driven test
**ship**: a documented working state on iPhone safari, ipad safari, android chrome, desktop firefox + safari + chrome

- mobile lesson gate: read steps render full UI; write/fix/checkpoint render upsell card cleanly
- email signup works on safari (uses native form validation differently than chrome)
- pyodide boots on iPad safari (no JIT, 4-8s warm; acceptable)
- /pro waitlist anchor (`#waitlist`) scrolls cleanly on every browser
- print stylesheet sanity check on /about (printed legal docs)
- dark mode persistence (always dark — confirm no system-light-mode flash)

ship: any cross-browser breakage gets fixed; document any won't-fix in `mobile/launch/known-issues.md`.

---

## wednesday 2026-05-13 — soft launch

**owner**: josh + 3-person feedback team
**ship**: 20-30 real humans run the site, leave feedback in a Google Form (or X DM)

- soft-launch to closest 30 followers via DM ("hey, quick favor — 10 min on this draft, brutal honest")
- the ask: walk the homepage → click a lesson → read three steps → bounce back → check the /pro waitlist
- collect: where they got confused, where they bounced, what they screenshot-shared, what they DM'd a friend
- agents to deploy wednesday afternoon:
  - **Trend Researcher** to sniff Twitter/Reddit/HN for "free python course" / "ai python class" mentions — informs launch-day timing
  - **Growth Hacker** to draft 5 alternate launch tweet hooks (A/B them on the actual launch tweet later)
  - **Sales Coach** to draft a 1-page founders pitch for high-intent waitlist signups

---

## thursday 2026-05-14 — final polish + queue

**owner**: solo + designer agent + launch-prep agent
**ship**: every social asset queued, OG images generated, tweet drafted, reddit post written

- regenerate the OG images for /, /about, /pro, /learn/v2/agent-loops/the-loop/0 (the launch traffic will share these)
- final pass on /pro page conversion copy based on monday-wednesday findings
- /qa one full pass against prod
- /cso final security audit against the live site
- write the reddit r/learnpython post (separate from X thread — long-form, "show & tell" format)
- queue the X thread (post via the @TFisPython account at the launch time)
- queue the reddit post
- pre-draft 3 reply templates for common questions (price too high? why no streak? why not coursera?)
- alert beehiiv that signup traffic will spike on friday

---

## friday 2026-05-15 — LAUNCH DAY

**owner**: josh (full presence on X for 4 hours post-tweet)
**ship**: the world finds out

timing: 9am ET tweet (catches eu+us morning, asia evening)

1. **08:55 ET** — final smoke check (`pnpm smoke` from any laptop)
2. **08:58 ET** — open Cloudflare Pages dashboard + analytics in a tab
3. **09:00 ET** — post the 5-tweet X thread (`mobile/launch/x-thread.md`)
4. **09:02 ET** — post the reddit r/learnpython "show" thread
5. **09:05 ET** — post the homepage url + share-image to LinkedIn personal
6. **09:30 ET** — first wave of replies; mark "high-intent" replies for personal DM
7. **11:00 ET** — first response post: thanks, milestone update ("X readers in two hours")
8. **15:00 ET** — second wave engagement; reshare with a different angle
9. **18:00 ET** — EOD reflection thread (one short tweet, mid-day metrics)

**hard rules launch day**:
- no code pushes (freeze enabled — see `pnpm freeze` if /gstack adds it)
- no new chapter content
- monitor cloudflare error log every hour
- check beehiiv subscriber count every hour

---

## saturday-sunday 2026-05-16 → 2026-05-17 — monitor + iterate

**owner**: solo
**ship**: any critical bug fixed within 4 hours; one user-facing improvement based on weekend feedback

- saturday morning: read every DM, every reply, every reddit comment
- saturday afternoon: ship ONE polish improvement based on feedback (most-requested = highest priority)
- sunday: rest. write the week-in-review reflection thread for monday morning.

---

## monday 2026-05-18 — week 1 retro

**owner**: josh + /retro skill from gstack
**ship**: a public week-1 retrospective post + the week-2 plan

- run `/retro` over the week's commits and metrics
- write the 1-week-in tweet (template in `x-thread.md` tweet 7)
- decide founders status (sold out? slow? what does that tell us about pricing?)
- decide week-2 priority based on signal:
  - high waitlist signups → start phase 4 (Apple Dev + Xcode + IAP)
  - meh signups → polish chapters, add 2 free preview ones, re-launch
  - signups but zero founders pre-orders → reprice (lower? higher? different?)

---

## gstack skills schedule

| day | skill | what for |
|---|---|---|
| mon | `/cso`, `/review`, `/benchmark` | security audit, code review, lighthouse |
| tue | `/qa`, `/browse` | cross-device test runs |
| wed | `/office-hours` | feedback synthesis |
| thu | `/qa`, `/cso`, `/document-release` | final pass + release notes |
| fri | `/freeze`, `/canary` | launch-day merge freeze + canary monitor |
| sat-sun | `/canary` | continued canary monitor |
| mon next | `/retro` | week 1 reflection |

---

## bug bash findings (monday — 7 of 8 agents reported)

### critical (must fix before launch)

| # | source | issue | status |
|---|---|---|---|
| C1 | security | `entitlement.ts` HMAC compare wasn't constant-time | ✅ fixed `6fc184b` |
| C2 | seo + copy | Stale "course" / "free forever" copy on every OG card + metadata description (7 surfaces) | ✅ fixed `d515586` |
| C3 | ux-research | Beehiiv env vars missing in production → every email signup returns 503, all dropped | ⏳ **USER ACTION** — Cloudflare Pages → Settings → Env vars |
| C4 | a11y | Footer separator dots at 1.4:1 contrast (text-ink-700 on ink-950) | ✅ fixed `d515586` |
| C5 | a11y | Input placeholders at 3.1:1 (placeholder:text-ink-600) | ✅ fixed `d515586` |
| C6 | perf | Homepage TBT 4060ms — PyodidePreloader firing during Lighthouse runs | ✅ fixed `d515586` (60%→90% scroll, 8s→25s fallback, saveData skip) |
| C7 | mobile | Sticky lesson footer ("⌘↵ runs the editor") overlapped body text on mobile | ✅ fixed `d515586` |
| C8 | mobile + a11y | Hamburger menu 30×30, below Apple HIG 44×44 touch target | ✅ fixed `d515586` |
| C9 | mobile | BrainDump FAB overlapped page content + failed touch target | ✅ fixed `d515586` (now 44×44 circle on mobile, full pill on desktop) |
| C10 | browser-qa | `/lesson/resume` falls through to `/onboarding` for fresh visitors on first click | ⏳ **DEFERRED** — needs router refactor; falls to `/curriculum` already if hasProfile=false, only `/onboarding` if entirely fresh |

### high (should fix before launch)

| # | source | issue | status |
|---|---|---|---|
| H1 | security | Zero HTTP security headers (no HSTS, CSP, nosniff, etc.) | ✅ fixed `6fc184b` (full CSP + 6 headers) |
| H2 | security | Dead `rehype-raw` dep — footgun for future user-input markdown surface | ✅ fixed `6fc184b` (removed) |
| H3 | seo | Sitemap missing `/pro`, `/privacy`, `/terms` + no `<lastmod>` dates | ✅ fixed `6fc184b` (sitemap rewrite) |
| H4 | seo | Favicon missing — `/favicon.ico` 404 (X/LinkedIn embed thumbnails fail) | ⏳ TODO — needs an actual icon file authored |
| H5 | a11y | Lesson page renders 3 `<h1>` elements (shell + markdown body) | ⏳ DEFERRED — chapter-wide markdown sweep needed |
| H6 | a11y | CodeMirror Tab traps keyboard nav (no escape hint) | ⏳ DEFERRED — needs UX call on indent-with-tab |
| H7 | a11y | Mobile menu `aria-expanded` had no `aria-controls` pointing at the drawer | ✅ fixed `d515586` |
| H8 | a11y | `<details>` curriculum accordion missing heading semantics | ⏳ DEFERRED — post-launch polish |
| H9 | a11y | Various `text-ink-500` on `bg-ink-900` marginal (~4.55:1) on small text | ⏳ partial fix in `d515586` (lesson footer) — full pass post-launch |
| H10 | perf | `react-markdown` + `remark-gfm` + `rehype-highlight` bundled into 9 step views (161KB gz, 98KB unused) | ⏳ **DEFERRED** — biggest LCP win, 2-4h `next/dynamic` refactor |
| H11 | perf | CodeMirror 151KB gz on first paint, 75KB unused | ⏳ DEFERRED — `next/dynamic` gating |

### medium (post-launch ok)

| # | source | issue |
|---|---|---|
| M1 | security | `subscribe.ts` in-memory rate-limit Map leaks (workers isolates recycle, low priority) |
| M2 | security | Magic-link session cookie missing `__Host-` prefix |
| M3 | copy | `app/pro/page.tsx` hero: "the app is coming." → "the web is live. the app is coming." |
| M4 | copy | `app/about/page.tsx` comparison-row comma splice |
| M5 | copy | x-thread.md says "~250 runnable steps" but site has ~548 |
| M6 | copy | "26-chapter path" copy mismatches the 25-tile PhaseBandedRail |
| M7 | a11y | BrainDump `title="brain dump (⌘⇧B)"` — title attr doesn't surface on keyboard nav |
| M8 | mobile | Curriculum chapter rows cramp wide titles in 3-col grid on mobile |
| M9 | mobile | Footer nav links 12-23px tall, below 44px touch target |

---

## user actions required (cannot fix from code)

1. **Cloudflare Pages → Settings → Environment Variables (Production)**: set `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` (the publication ID is `pub_9dbf87cd-f9d5-4643-b0be-6a7c81797128` per project memory). Without this, every Friday signup returns 503. This is the #1 launch blocker.
2. **Cloudflare WAF / bot-fight mode**: enable for the promptdojo project to compensate for the non-functional in-memory rate limiter.
3. **Apple Developer Account ($99/yr)**: DEFERRED per the web-first launch plan. Only revisit if waitlist clears 1,000.

## known issues / won't-fix (acceptance list)

- **In-memory rate limiter weakness**: Workers isolates are stateless across requests, so the `subscribe.ts` rate limit is best-effort only. Belt-and-suspenders = Cloudflare WAF (see user action 2).
- **Pyodide ~12 MB on first lesson load**: by design, bundled offline for Capacitor later.
- **No JIT for Pyodide on iOS WKWebView**: deferred — relevant only when mobile app ships.

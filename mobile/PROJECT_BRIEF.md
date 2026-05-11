# promptdojo-mobile — project brief

## mission

ship the python school as a paid ios + android app, with the web staying online as a free preview funnel. success = first 50 founders sold + app live on both stores inside 21 days.

## 5-phase timeline

| phase | what | days |
|---|---|---|
| 01 — prove the shell | capacitor wrap, pyodide boots on ios + android sim | 1–2 |
| 02 — invert the gate | `LessonShell.tsx` renders mobile, free vs pro branches | 1 |
| 03 — monetization plumbing | revenuecat, /pro page, tutor endpoint, web copy rewrite | 3–5 |
| 04 — store submission | icons, splash, privacy, terms, screenshots, review notes | 2–3 |
| 05 — launch | testflight beta, app store + play store ship, x thread | 1 |

apple dev enrollment + paid apps agreement run in parallel from day 0. those forms gate everything.

## handoff matrix

| owner | ships | consumes | blocker chain |
|---|---|---|---|
| software architect | `mobile/capacitor.config.ts`, `mobile/package.json`, deep-link routing | existing `/out/` build | blocks everyone in phase 1 |
| mobile app builder #1 (ios) | `mobile/ios/`, xcode signing, universal links | architect's config | blocked by apple enrollment |
| mobile app builder #2 (android) | `mobile/android/`, play console, app links | architect's config | blocked by play console enrollment |
| frontend dev | `components/v2/LessonShell.tsx` rewrite, soft-keyboard tweaks | step types from `lib/generated/v2/` | blocks phase 5 launch |
| ai engineer | `functions/api/tutor.ts`, prompt design, haiku 4.5 cost cap | revenuecat entitlement check | blocked by db optimizer |
| database optimizer | `functions/api/entitlement.ts`, kv schema, webhook idempotency | revenuecat webhook payloads | blocks ai engineer |
| ui designer | icon-1024.svg, splash-2732.svg, store screenshots, /pro visual, paywall | brand voice, lessonshell states | blocks phase 4 submit |
| growth hacker | paywall copy, /pro page conversion funnel, a/b variants | designer's paywall | blocks phase 5 launch |
| deal strategist | founders narrative, x launch thread, scarcity framing | live app store url | blocks phase 5 launch |
| ceo (me) | phase gates, scope, store-submission ownership, blocker routing | everyone | n/a |

## decision log

- **capacitor 7** — wraps the existing next.js static export. rejected pwa-only (no app store presence), rejected react-native rebuild (3× cost, two uis forever), rejected native swift+kotlin (not for $0 budget single maintainer).
- **freemium with hard paywall** — free preview is chapters 1, 13, 16 read-only. not enough to learn. designed to prove depth and force the upgrade.
- **revenuecat** — cross-platform receipt validation, entitlement check, paywall sdk. no rolling our own.
- **pricing tiers** — $9.99/mo, $59/yr (41% off, the loud cta), $129 lifetime for first 100 founders then $199. founders tier is the scarcity lever.
- **web tier = preview, not free-forever** — every "$0 forever" string on the web gets rewritten. about page, hero, footer, priceband. graceful removal, not pretend.
- **both stores, day-one** — ios app store + google play. revenuecat handles both. no "ios first, android later" — that splits the launch narrative.
- **no stripe inside the ios app** — app store §3.1.1. ios build hides every web checkout button via `Capacitor.getPlatform() === "ios"`.
- **no remote js loads** — `server.url` unset in prod. pyodide ships bundled. app review must see zero network js on launch (§4.7).
- **ai tutor gated on pro entitlement** — `/api/tutor` returns 403 without pro. no free haiku calls.

## definition of done for v1

- app installs from app store + play store, opens to homepage, pyodide boots under 5s on iphone 12.
- free preview tier renders chapters 1, 13, 16 read-only on mobile. every other chapter shows the paywall card.
- pro tier renders every step on mobile, including the keyboard-friendly editor for write/checkpoint/fix.
- revenuecat sandbox purchase flows end-to-end: monthly, annual, lifetime. restore purchases works.
- magic-link email → universal link → app opens to lesson resume. tested on a real device, not just sim.
- web copy is rewritten — no "free forever" string remains anywhere in `app/`, `components/`, or metadata.
- at least 50 founders sold via testflight + first 7 days of public availability.

## risk red flags

1. **apple §4.7 (interpreters)** — longest mitigation list in the plan. pyodide could trip the "no remote code execution" line in app review. mitigation: lock the worker to bundle-only fetches, write the review-notes template citing pythonista + pyto + carnets + swift playgrounds precedent, ship a guest mode so the reviewer doesn't have to sign up.
2. **apple §3.1.1 (no web checkout from ios)** — second-longest list. any tap target that leads to a non-iap payment is a rejection. mitigation: capacitor platform detection hides web ctas on ios, ci check fails the build if `app/checkout` or `stripe.com` urls are reachable from ios bundle, restore-purchases button is mandatory, §3.1.2 disclosure copy ("auto-renews until canceled. cancel anytime in settings.") sits verbatim next to the cta.
3. **pyodide perf on wkwebview (no jit)** — ios webview blocks wasm jit, pyodide runs ~2–5× slower than desktop chrome. mitigation: measure boot + first-run on a real iphone 12 in phase 1, pre-warm pyodide during splash, strip unused stdlib modules to cut bundle from 2.3mb to ~1.5mb, ship a low-battery warning.

## first-week sprint (days 1–7)

- **day 1–2 (architect + mobile builder #1 + mobile builder #2)**: scaffold `mobile/`, capacitor init, `npx cap add ios` + `add android`, sync, run on both sim. verify pyodide boots + `print("hi")` works. log boot time.
- **day 2 (ui designer)**: ship `icon-1024.svg` + `splash-2732.svg` master files. capacitor-assets pipeline generates every size.
- **day 3 (frontend dev)**: invert the mobile gate in `LessonShell.tsx`. mobile non-pro hits the upsell card; mobile pro renders every step.
- **day 3–4 (database optimizer)**: ship `functions/api/entitlement.ts`, revenuecat webhook receiver, cloudflare kv `userId → tier` map with idempotent writes.
- **day 4–5 (ai engineer)**: ship `functions/api/tutor.ts`, haiku 4.5 wired with cost cap, entitlement check before any model call.
- **day 5–6 (architect + mobile builder #1)**: universal links live. `apple-app-site-association` deployed to `promptdojo.dev/.well-known/`, associated domains capability added to ios project, magic-link round-trip tested on a real iphone.
- **day 6 (growth hacker + ui designer)**: ship `app/pro/page.tsx` with the pricing band, restore-purchases button, §3.1.2 disclosure copy. paywall visual locked.
- **day 7 (ceo + deal strategist)**: rewrite web copy — hero, about, footer, priceband. draft the x launch thread. testflight build uploaded for internal review.

end of week 1: shell ships, gate inverted, monetization plumbing live in sandbox, web rebrand done. phase 4 store-submission work starts week 2.

---

ceo: studio producer. brief revisable. when reality moves, the brief moves.

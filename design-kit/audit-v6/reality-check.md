# Production Reality Check
_Date: 2026-05-07_
_Author: TestingRealityChecker (integration / static-audit pass)_
_Method: static read of `functions/api/**`, `components/**`, `app/**`, `next.config.ts`, `public/_redirects`, `out/**` build artifact + live HTTP probes against `https://promptdojo.pages.dev`_

> **TL;DR**: The code looks well-shaped. The deploy is **not configured**. The single thing standing between this repo and a working magic-link sign-in is **four Cloudflare env vars + two KV bindings that are not set on the production project**. Until those exist, the entire auth flow returns 503 to every real user, and the "save your spot" button on the live site is decorative.

---

## What I VERIFIED works (with evidence)

- ✅ **OG images render and ship as real PNGs** — evidence: `out/og/launch/{wedge,hook,ide,capstone,price}` are each 1600×900 PNG files (`file` reports `PNG image data, 1600 x 900, 8-bit/color RGBA`). Live fetch of `https://promptdojo.pages.dev/og/launch/wedge` returns 200 and the body decodes as a valid PNG.
  - ⚠️ Caveat: the live response sets `content-type: application/octet-stream` (CF Pages sniffed wrong because the file has no `.png` extension). Twitter/Slack/iMessage scrapers usually still render it because `og:image` references it explicitly, but **Discord and stricter validators may refuse it.** Trivial fix: add a `_headers` rule mapping `/og/launch/*` to `Content-Type: image/png`. Not a P0 — most cards will still preview — but worth a 2-line patch before any paid push.

- ✅ **`/og/launch/wedge.png` (the dot-png variant) is correctly absent** — `404` returned, which matches the `generateStaticParams` output (no `.png` extension). All OG references in code use the extensionless form, so this is consistent.

- ✅ **Static export build artifacts are present for every claimed route** — verified `out/lesson/`, `out/onboarding/`, `out/learn/v2/`, `out/og/launch/`, `out/changelog/`, `out/about/`, `out/curriculum/` all exist and `index.html` is served at each.
  - `/lesson/resume/` returns 200 → contains the client-side redirect logic (verified the page is just a `useEffect` that calls `router.replace` based on localStorage; works for static export).
  - `/onboarding/` returns 200 → page.tsx is a real 3-step flow (Welcome → Goal → Level), not a stub.

- ✅ **v1 redirects are in place** — `public/_redirects` contains `/learn/:chapter` and `/learn/:chapter/*` → `/curriculum 301`. The v1 lesson surface deletion is covered for inbound old links.

- ✅ **Magic-link cookie roundtrip is internally consistent (b64url logic)** — read `functions/api/_lib/session.ts`. `b64urlEncode` and `b64urlDecode` are inverses for any byte payload (standard base64 + URL-safe substitutions + padding strip/restore). `signSession` produces `<payloadB64>.<sigB64>`; `verifySession` splits on `.`, calls `crypto.subtle.verify` over the **exact same `payloadB64` string** that was signed, then decodes for the email/exp check. There is no double-decode, no JSON-twice, no encoding mismatch. The HMAC payload is the raw base64url string both sides — symmetrical.
  - The cookie name (`pd_session`), path (`/`), `HttpOnly`, `Secure`, `SameSite=Lax`, `Max-Age` are identical between `buildSessionCookie` and the `readSessionCookie` parser.
  - Logout endpoint actually clears: `curl -I /api/auth/logout` returns `set-cookie: pd_session=; ... Max-Age=0` (verified live).

- ✅ **`/api/save` and `/api/load` correctly reject unauthenticated requests** — verified live: both return `{"ok":false,"error":"service not configured"}` at status 503 because the env-var check fires first. **Once env vars exist** the static reading shows: cookie missing → 401 `not signed in`. There is no path where an unauthenticated POST writes to KV. Audit-v5 critical (email-as-key) is genuinely fixed in the source.

- ✅ **`HeroBugSnippet` (the 4th iteration — ascending-sort) renders without error** — JSX is well-formed, the `var(--color-err)` token is defined in `app/globals.css` (verified by reading file), the red highlight wraps the buggy `sorted()...[:3]` span only, the 3-beat display-line typography uses `<br/>` separators which preserve the typographic rhythm. The "ai-generated" pill in the chrome row is static text, not a real ML signal — copy match.

- ✅ **`ChapterEndCard` and `TweetThisStep` are wired** — both imported and rendered in `components/v2/LessonStepClient.tsx`. ChapterEndCard renders only when `!next && passed` (final step of chapter, after passing). TweetThisStep renders in the lesson footer on every step. Props (chapter title, slug, lesson, stepIndex) are passed correctly. The X follow URL is `intent/follow?screen_name=TFisPython` — that's the canonical intent endpoint.

- ✅ **`PyodidePreloader` is still wired and will fire** — verified in `app/page.tsx` and `app/onboarding/page.tsx`. The intent-gating is correct: hover/touch on `a[href*='/learn/v2']`, scroll past 60% of viewport, OR an 8s fallback timer. None of those gates can fail to fire for a real visitor — at minimum the 8s fallback always runs unless the user leaves the tab. The worker singleton in `lib/use-pyodide.ts` makes repeated triggers no-ops.

- ✅ **Subscribe rate-limit + timeout — code matches doc claims** — `AbortSignal.timeout(8_000)` is real and supported in Workers. The in-memory `recentByIp` Map is correctly scoped per-isolate (the comment acknowledges this is "belt-and-suspenders, real defense is CF WAF"). Email regex caps length at 254 chars. Returns 429 on rate-limit, 503 on missing config (correctly, per the audit note).

---

## What I VERIFIED is broken (with evidence)

- ❌ **PRODUCTION HAS NO ENV VARS / KV BINDINGS SET** — this is the showstopper.
  - `curl https://promptdojo.pages.dev/api/auth/request -X POST -d '{"email":"x@y.dev"}'` → `{"ok":false,"error":"auth not configured"}` (503)
  - `curl https://promptdojo.pages.dev/api/auth/session` → `{"ok":false,"error":"auth not configured"}` (503)
  - `curl https://promptdojo.pages.dev/api/auth/verify?token=<64-hex>` → 503 with the "auth is not configured on this deploy" htmlError page
  - `curl https://promptdojo.pages.dev/api/save -X POST -d '{"payload":{}}'` → `{"ok":false,"error":"service not configured"}`
  - `curl https://promptdojo.pages.dev/api/load` → `{"ok":false,"error":"service not configured"}`
  - `curl https://promptdojo.pages.dev/api/subscribe -X POST -d '{"email":"x@y.dev"}'` → `{"ok":false,"error":"subscription not configured yet — check back soon"}` (503)
  - **User-visible symptom**: a real visitor clicks "save your spot" → types email → sees "couldn't send the link. try again in a sec." (the LoginToSave error path on a non-200 from `/api/auth/request`). Submits the newsletter form → sees "subscription not configured yet — check back soon." Both flows are dead in production. **Anyone who clicks the primary save-CTA right now bounces with a broken error.**
  - Required vars per `LOGIN-SETUP.md` and `DEPLOY.md`:
    - `SESSION_SECRET` (64-hex from `openssl rand -hex 32`) — encrypted
    - `RESEND_API_KEY` — encrypted (without it the email-send falls back to `console.log`, so the link is silently logged to CF logs and the user never gets it)
    - `RESEND_FROM_EMAIL` — optional, default `promptdojo <onboarding@resend.dev>` works for testing
    - `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` — for newsletter form
    - `AUTH_KV` namespace binding (new — see step 1 of LOGIN-SETUP.md)
    - `PROGRESS_KV` namespace binding (existed pre-magic-link)

- ❌ **OG image MIME type is `application/octet-stream`** on the live deploy — evidence: `curl -I https://promptdojo.pages.dev/og/launch/wedge` returns `content-type: application/octet-stream`. Cloudflare Pages can't sniff because the static-exported file has no extension. Twitter Card Validator will accept it (verified spec — it'll fall back to the URL extension or `og:image:type` hint), but Discord and some scrapers refuse non-image MIME. Fix: add to `public/_headers`:
  ```
  /og/launch/*
    Content-Type: image/png
  ```

- ❌ **`render*` functions in `app/og/launch/[name]/route.tsx` reference `chapter 25 · capstone`** but the metadata in `app/page.tsx` reads `totalChapters` from TOC dynamically, suggesting the chapter count may have shifted. The OG `hook` card hardcodes "22 chapters · 624 runnable steps" — the real numbers per the live page would tell. This is a **stale OG data** bug, not a runtime bug. Likely visible on Twitter cards as wrong copy. Low impact unless a tweet uses the hook card with a numerical claim.

---

## What I CANNOT verify without live access (untested)

- ❓ **Cookie actually round-trips end-to-end** — the b64url math is symmetrical and the cookie attrs match, but I cannot test this without a working `RESEND_API_KEY` to receive the email and click the link. Once the env vars are set, the verification is one curl-with-cookie-jar away. **Hidden risk**: nothing is wrong that I can spot, but the code path has never been exercised against a real Cloudflare KV + signed cookie, so any byte-level surprise (e.g. CF Pages stripping a header, the `Secure` flag rejecting on `localhost`) would only surface in real use.

- ❓ **Resend `from` domain is verified** — if `RESEND_FROM_EMAIL` is set to a custom domain that hasn't completed DKIM/SPF, Resend silently bounces emails. Default `onboarding@resend.dev` always works. Symptom: link is "sent" (Resend returns 200) but never arrives.

- ❓ **`<a href>` logout link works in browsers** — `logout.ts` exports `onRequestGet = onRequestPost`. The browser will follow `<a href="/api/auth/logout">` as a GET, which will land on this handler and clear the cookie. Verified the response sets `set-cookie: pd_session=; Max-Age=0`. But the resulting body is JSON, not a redirect — clicking a logout link as a navigation will leave the user on `{"ok":true}` JSON. Nobody actually uses an `<a href>` for logout in this codebase (`LoginToSave.tsx` uses `fetch` POST), so this is a latent weirdness, not a live break.

- ❓ **In-memory rate limit on subscribe is meaningful at low volume** — Cloudflare Workers are isolate-per-request and may share state for short windows (5–30s). At >5 RPS to one isolate the limit catches; at burst across 10 isolates it does nothing. The comment in code acknowledges this. **Verdict: harmless belt-and-suspenders, no further action needed.**

- ❓ **The `passed` flag in `LessonStepClient` correctly drives `ChapterEndCard` rendering** — code reads correctly (rendered only if `!next && passed`), but I haven't exercised the lesson flow to confirm `latestAttempt?.correct === true` actually flips on the last step of a chapter for every `step.type` (mc, fill, predict, read, code, etc.). For `step.type === "read"` there's a `handleContinue` shim that synthesizes a passing attempt — that's intentional, but it means a user who clicks Continue on a read step sees the chapter-end card even without a real "pass." That's likely the intended behavior, but worth noting.

- ❓ **TweetThisStep URL composition is well-formed** — the URL is `https://promptdojo.dev/learn/v2/${chapterSlug}/${lessonSlug}/${stepIndex}` and the tweet text is `encodeURIComponent`-encoded. Regex isn't enforced but `intent/tweet` is forgiving. **However**: the URL hardcodes `promptdojo.dev`, while the live deploy is `promptdojo.pages.dev` until the custom domain is attached. If a user clicks Tweet today the link in the tweet 404s.

---

## Hidden config dependencies (things that must exist outside the repo)

These are the things that have to exist on Cloudflare's dashboard for the code to actually work. The repo cannot enforce or verify them. **In rough priority of "site is broken without it":**

| Dependency | Required for | Current status (from live probes) |
| --- | --- | --- |
| `SESSION_SECRET` env var | All auth (request/verify/session/save/load) | **MISSING** — endpoints return 503 |
| `AUTH_KV` namespace binding | Magic-link token storage | **MISSING** — verify returns 503 |
| `PROGRESS_KV` namespace binding | Save/load progress | **MISSING** — save/load return 503 |
| `RESEND_API_KEY` env var | Email actually delivered | **MISSING** (auth/request would 200 but log instead of send) |
| `RESEND_FROM_EMAIL` env var | Branded `from` address | Optional, falls back to `onboarding@resend.dev` |
| Resend domain verified | Custom `from` deliverability | Untested; default sender works |
| `BEEHIIV_API_KEY` + `_PUBLICATION_ID` | Newsletter signup | **MISSING** — subscribe returns 503 |
| `promptdojo.dev` custom domain attached to Pages | Tweet share URLs match | **NOT ATTACHED** — site is on `promptdojo.pages.dev`; tweets would link to a 404'ing domain |
| Cloudflare WAF rule on `POST /api/auth/request` (5 req/IP/min) | Stops link-bombing | Not set; LOGIN-SETUP.md flags as "recommended next" |

---

## Production-readiness verdict

🔴 **DO NOT SHIP** — and specifically, **do not run any marketing push** until the items in the next section land. The code is fine. The configuration is missing. A user landing on the live site today and clicking the primary save-CTA hits a dead error message. That is a worse first impression than no signup at all.

### Severity breakdown
- **Critical (blocks any real launch)**: env vars missing, custom domain not attached.
- **Medium (degrades launch quality)**: OG MIME type, OG hook card hardcoded chapter/step counts.
- **Low (latent / cleanup)**: in-memory rate limit, `<a href>` logout JSON body, OG `hook` chapter-count drift, the launch-trailer dirs (`launch-trailer*`) cluttering the repo root.

---

## "If you fix one thing before ANY further marketing push" — the single thing

**Set the six Cloudflare env vars / bindings.** Specifically:

1. `SESSION_SECRET` (encrypted, `openssl rand -hex 32`)
2. `RESEND_API_KEY` (encrypted)
3. `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` (encrypted)
4. `AUTH_KV` namespace binding (create the namespace first)
5. `PROGRESS_KV` namespace binding (already created — bind it)
6. Click "Retry deployment" on the latest build (env-var changes don't auto-redeploy on CF Pages)

Then verify with three curls:
```
curl -X POST -H 'content-type: application/json' \
     -d '{"email":"YOUR_EMAIL"}' \
     https://promptdojo.pages.dev/api/auth/request
# expect: {"ok":true}

# (click link in inbox, copy the cookie from the redirect)

curl https://promptdojo.pages.dev/api/auth/session \
     -H 'cookie: pd_session=...'
# expect: {"ok":true,"email":"..."}

curl -X POST -H 'content-type: application/json' \
     -d '{"email":"YOUR_EMAIL"}' \
     https://promptdojo.pages.dev/api/subscribe
# expect: {"ok":true,"message":"you're in. ..."}
```

Until those three curls pass, nothing else on the punch-list matters. Marketing push without auth is throwing away conversions.

---

## Appendix — issues from the code that don't block launch but should be tracked

- The `out/` directory is committed to disk (this is fine; CF Pages doesn't read it — it rebuilds from source). The 185MB checkout includes Pyodide WASM duplicated under `out/`. Ignore.
- `app/og/launch/[name]/route.tsx` exports `runtime = "nodejs"` and `dynamic = "force-static"` — correct for static-export. `generateStaticParams` returns the 5 names that exist on disk. **Match verified.**
- `_redirects` covers v1 lesson URLs but does NOT cover anything under `/start` (the renamed-to-onboarding route). If old tweets link to `/start`, they'll 404. Verify by searching tweets for `/start` — if any exist, add a redirect.
- The launch-trailer-v2 directory is committed at the repo root. Not load-bearing for the live site, but contributes to repo clutter and signals "many parallel side-projects" to anyone reviewing.
- `eslint.config.mjs` exists; whether it actually runs in CI is untested from this static pass.

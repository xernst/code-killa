# Code Review v6 — gstack /review pass
_Date: 2026-05-07_
_Scope: changes since `b83a958` — magic-link auth, hardened subscribe, hero, Pyodide preloader, IDE dynamic import, ChapterEndCard, TweetThisStep, LessonStepClient refactor._

---

## Critical (ship-blocker)

_None._ The HMAC sign/verify, single-use token consumption, and the move from email-as-key to `session.email` close the audit-v5 trust hole. The auth flow is shaped correctly. Below issues are real but none gate the launch.

---

## High (worth fixing this week)

### 1. `verifySession` swallows base64 / decoding errors before HMAC verification → forgery surface narrows but error path is wrong order
- **`functions/api/_lib/session.ts:79-99`**
- **What:** `hmacVerify(secret, payloadB64, sig)` is called *before* the payload is decoded. Inside `hmacVerify`, `b64urlDecode(sigB64)` runs `atob()` — if `sig` is not valid base64, `atob` throws synchronously, the surrounding `await` rejects, and `verifySession` propagates the throw out of `/api/auth/session`, `/api/load`, `/api/save`. None of those endpoints have a try/catch around `verifySession`.
- **Why this matters:** A malformed cookie (`pd_session=garbage` from a stale extension, an old sub-cookie collision, a cropped paste of a session value, etc.) will turn the session check into a 500 instead of a clean 401. That cascades into LoginToSave reading `r.ok === false` and silently flipping the user back to "logged-out" with no signal in logs that the cookie was malformed (`fetchSession` swallows the throw via fetch rejection, but `/api/save` and `/api/load` will return 500 to the client).
- **Fix:** Wrap the body of `verifySession` in a top-level `try/catch` returning `null`. Two lines:
  ```ts
  export async function verifySession(...): Promise<SessionPayload | null> {
    try {
      // … existing body …
    } catch {
      return null;
    }
  }
  ```

### 2. Cookie parser uses raw equality, not RFC-6265 quote/case handling → trivially bypassable to *log out*, but harmless to escalate
- **`functions/api/_lib/session.ts:102-109`**
- **What:** `readSessionCookie` splits on `;`, trims, splits on `=`, exact-matches `k === "pd_session"`. If a quoted value lands in the cookie header (`pd_session="abc.def"`), the value carries quotes and HMAC verify fails — user is silently signed out on the next request. Cookie names are case-sensitive per RFC, so the case match is fine, but quoted values bite.
- **Why this matters:** Cloudflare doesn't add quotes here, but a future SDK or proxy might. More importantly: there's no graceful sign-out — verify fails, `/api/save` 401s mid-edit, debounced sync stops, and the only signal to the user is the silent flip.
- **Fix:** Strip surrounding quotes before returning: `return rest.join("=").replace(/^"(.*)"$/, "$1");`. Also worth: `return rest.join("=").trim()` — currently a leading space inside the value would survive.
- **Additional:** No upper bound on cookie-header size before scanning. Cloudflare caps at 8 KB headers so this is a non-issue in production but worth a one-line sanity check (`if (cookieHeader.length > 8192) return null`) for defense-in-depth.

### 3. Magic-link verify is open-redirect-safe but fixes the URL to `/?signed-in=1` — no `next` param means deep-linked sign-in always lands on home
- **`functions/api/auth/verify.ts:74-80`**
- **What:** Whatever URL the user was on when they clicked "save your spot" is lost. They click the magic link in their inbox, land on `/`, lose their place in the lesson. UX regression specifically on the "I'm mid-lesson and want to save" path — which is the *primary* path this entire feature was built for.
- **Why this matters:** This is the audience-growth gate (login → progress sync → multi-device → @TFisPython follow). If the first sign-in throws the user back to the home page they have to re-navigate to the lesson they were on. Friction.
- **Fix:** `request.ts` should accept `{ email, next }`, validate `next` (must start with `/`, no `//`, no `://`), embed it in the KV record, and `verify.ts` should redirect to `next ?? "/"`. ~15 lines, eliminates the regression. **Validation matters** — without the `^\//` + reject-`\\` + reject-`//` + reject-`://` checks you've built an open redirect.

### 4. `LoginToSave.fetchLoad()` returns the entire saved blob but writes only `data.payload` — KV stores `{ payload, savedAt }` though, which means the merge runs on the *raw KV record* and writes the wrapper into localStorage
- **`components/LoginToSave.tsx:93-102`** ↔ **`functions/api/save.ts:60-71`** ↔ **`functions/api/load.ts:33-36`**
- **What:** save.ts wraps as `JSON.stringify({ payload: sanitized.value, savedAt })` and stores it. load.ts returns the raw stored value as the response body (`new Response(value)`). On the client, `fetchLoad` parses and reads `data.payload` — that *works* for this shape. But re-read: the localStorage write is `writeProgress(remote)` where `remote = data.payload`. That's correct. **However**, the freshness comparison is missing entirely: there is no `savedAt` check.
- **Why this matters:** The merge logic is "if local is empty, take remote; else push local." That's wrong on the second device: a user who completed 3 lessons on laptop A signs in on laptop B (which has empty localStorage), then *opens a lesson on laptop B and does nothing* — `isProgressEmpty` is now false on B, so on the next reload the merge pushes B's near-empty state up and clobbers laptop A's progress in KV. Audit-v5's "login wipe" issue isn't fully gone; it just moved.
- **Fix:** Compare `savedAt` from the remote envelope (LessonStepClient already knows about `lastSeenAt`). On fresh sign-in, prefer remote when remote.savedAt > local.lastSeenAt; otherwise push local. Also have `/api/load` return the wrapper unchanged so the client can read `savedAt`.

### 5. `subscribe.ts` rate-limit Map leaks every IP forever
- **`functions/api/subscribe.ts:33`**
- **What:** `recentByIp` is a module-level `Map<string, number[]>` that only deletes entries when the same IP comes back inside the rate window. IPs that hit once and never return stay in the Map for the lifetime of the Workers isolate.
- **Why this matters:** Workers isolates die fast (the comment in subscribe.ts already notes this), so memory growth in any one isolate is bounded. But the rate limiter is also *non-functional under load* — Cloudflare load-balances across isolates, so a determined attacker getting routed to a fresh isolate gets a fresh window every request. This is documented as belt-and-suspenders, fine. But the leak is real and the limiter is largely cosmetic.
- **Fix:** Either accept the limitation (current note is honest) or move to KV / Durable Objects for real rate limiting. At minimum, prune in `isRateLimited`: when `arr.length === 0` after the filter, `recentByIp.delete(ip)` instead of `set(ip, arr)`. Two lines.

### 6. Token format check is regex-validated but the KV key namespace isn't — collision-safe but auth namespace pollution is possible
- **`functions/api/auth/request.ts:51-56`** ↔ **`verify.ts:43`**
- **What:** Token is 32 random bytes hex-encoded → 64 hex chars. Verify regex is `/^[a-f0-9]{64}$/`. Good. KV key is `auth:${token}`. There's no separation of concerns between auth tokens and any future KV data — a future refactor that puts something else in `AUTH_KV` could land on a key that *happens* to start with `auth:` and break verify.
- **Why this matters:** Low risk today (one writer, one reader, both controlled). High risk on future contributor velocity. The audit-v5 issue was exactly this: trustless namespacing.
- **Fix:** Document the KV key contract at the top of `_lib/session.ts` or, better, separate KV namespaces (`MAGIC_LINK_KV` vs `AUTH_KV`). Also nice: store the email under `auth:token:${token}` (more specific prefix).

---

## Medium

### 7. `ChapterEndCard` injects user-controlled-ish chapter title with `.toLowerCase()` but no length cap
- **`components/v2/ChapterEndCard.tsx:29`**
- **What:** `chapterTitle` flows in from `Chapter.title` (validated by zod, content-driven). Renders inside `<em>{chapterTitle.toLowerCase()}</em>`. React escapes — no XSS. But there's no fallback if a future authoring mistake puts a 300-char title in a manifest. The card is `max-w-2xl` which clips visually.
- **Fix:** Defensive truncate or use the same `chapter.title.replace(/\s*—.*$/, "")` pattern the breadcrumb uses elsewhere. Tiny.

### 8. `TweetThisStep` builds a permalink to `https://promptdojo.dev/...` regardless of the deploy host
- **`components/v2/TweetThisStep.tsx:21,50`**
- **What:** Hardcoded `const SITE = "https://promptdojo.dev"`. Anyone who shares from `promptdojo.pages.dev` (the canonical CF preview URL) gets a tweet pointing at the apex domain — fine for prod but breaks shared links in any preview deploy used for dogfooding, and breaks if the apex DNS is ever moved.
- **Fix:** `const SITE = typeof window !== "undefined" ? window.location.origin : "https://promptdojo.dev";` — one line, "use client" so SSR-safe. The component is `"use client"` and gated to chapter-end render, so window access is fine.

### 9. `TweetThisStep` URL constructed without `chapterSlug` URL-segment safety
- **`components/v2/TweetThisStep.tsx:50`**
- **What:** `${SITE}/learn/v2/${chapterSlug}/${lessonSlug}/${stepIndex}` then the entire string runs through `encodeURIComponent`. Slugs are author-controlled, kebab-case lower, but if a future content author uses any non-ASCII char (or a slash by typo) the URL is malformed.
- **Fix:** `encodeURIComponent(chapterSlug)` etc. — defensive only, low likelihood.

### 10. `TweetThisStep` accepts `chapterSlug` and `lessonSlug` props but uses them only for URL construction — `lessonSlug` is duplicated by `lessonTitle`
- **`components/v2/TweetThisStep.tsx:13-19`**
- **What:** Five props for a one-line URL + a lesson title in the tweet body. `chapterSlug`/`lessonSlug`/`stepIndex` could collapse to a single `permalink` prop computed once in LessonStepClient. Reduces per-step re-render of an already trivial component, removes the hardcoded SITE constant (caller injects it).
- **Fix:** `<TweetThisStep permalink={...} chapterTitle={...} lessonTitle={...} />`. Cleaner contract.

### 11. `LessonStepClient.tsx:79-86` — lazy-init useState reads localStorage during render of a `"use client"` component
- **`components/v2/LessonStepClient.tsx:79-86`**
- **What:** `loadProgressV2()` and `getStepProgress(step.id)` are called in the lazy initializer of `useState`. Static export → these run on the client only, but during the *first render* before hydration completes. With React 19 strict mode, lazy initializers run twice in dev, which is fine for `localStorage` reads. The change from the previous useEffect-based load is a real win — eliminates the "flash of FRESH_PROFILE" the audit-v5 client had.
- **Why I'm flagging it:** `loadProgressV2()` likely guards `typeof window !== "undefined"` itself (haven't confirmed in storage.ts), but the assumption is tight. If a future refactor enables Next's experimental SSR rendering of client components, this throws on the server.
- **Fix:** Confirm `loadProgressV2()` and `getStepProgress()` SSR-safety; if either is unguarded, wrap the initializer: `() => (typeof window === "undefined" ? FRESH_PROFILE : ...)`.

### 12. `dynamic(() => import("./PersistentIDE"), { ssr: false })` + `forwardRef` works, but the ref forwarding is implicit — no test, no runtime guard
- **`components/v2/LessonStepClient.tsx:20-37,294-300`**
- **What:** `next/dynamic` v15+ does forward refs by default (Next 16 here). The skeleton `loading` component does *not* forward refs, so `ideRef.current` is `null` during the loading phase. Code already handles this (`ideRef.current?.run()` uses optional chaining everywhere via `ideBridge`), so functionally correct.
- **Why I'm flagging it:** The `?? null` and `?? ""` fallbacks in `ideBridge` (lines 122-123) silently degrade if a Submit-button race fires before the IDE chunk lands. User clicks Submit on a fast connection during the ~50ms skeleton window → `getActiveCode()` returns `""` → the grader runs against empty code → likely false-fail attempt recorded.
- **Fix:** When `ideRef.current` is null, throw or return a sentinel that StepRouter/grader can recognize as "IDE not ready" and surface a friendly retry prompt. Or: disable the Submit button until the IDE handle is non-null (tracked via a `useState` set in a `useEffect` that observes `ideRef.current`).

### 13. `PersistentIDE` Cmd-Enter handler scope check uses `target?.closest?.(".cm-editor")` — works, but the listener runs on *every keypress page-wide*
- **`components/v2/PersistentIDE.tsx:181-197`**
- **What:** Audit-v5's fix is in place — the `closest(".cm-editor")` guard is correct. But the listener attaches to `window` and fires on *every* keydown, just to noop most of them. On the lesson page that's fine. If a future modal mounts and steals focus, the IDE never sees its own keypresses (correct), but the listener still fires.
- **Fix:** Move the listener to the editor wrapper div (`onKeyDown` on the CodeMirror container). Same scope, half the events. Optional polish.

### 14. `LoginToSave` sync handler fires on `PROGRESS_EVENT_V2` but doesn't dedupe identical payloads
- **`components/LoginToSave.tsx:217-231`**
- **What:** Every step attempt → `setStepAttempt` → dispatches `promptdojo:progress-v2` → debounce timer → POST /api/save with the *full payload*. If the user clicks Run 10 times on a step, the storage event fires 10 times (assumption, depends on whether attempts mutate progress). Debounce coalesces, but the payload sent is whatever's there at debounce-fire time. Fine.
- **Why I'm flagging:** No payload diff. If a tab is open in the background and a `storage` event fires from another tab, the listener runs even though nothing changed in *this* tab. Edge case.
- **Fix:** Track last-saved payload hash, skip POST if unchanged. ~10 lines.

### 15. `PyodidePreloader` cleanup handler hoists `cleanup` before its declaration via closure
- **`components/PyodidePreloader.tsx:52-87`**
- **What:** `onIntent` and `onScroll` reference `cleanup` which is declared on line 76. Hoisting works because they're called only after listeners are attached (line 83+), but the temporal dead zone means *if* a future refactor inlines a synchronous call, this throws.
- **Fix:** Declare `cleanup` first, then `onIntent` / `onScroll` / `fire`. Style nit, not a bug.

### 16. `LoginToSave` modal close-on-outside-click closes during `requesting` / `link-sent` states without confirmation
- **`components/LoginToSave.tsx:296-302`**
- **What:** `onClick={closeModal}` on the backdrop. If the user clicks outside *while* a request is in flight (`status === "requesting"`), the modal disappears and the in-flight POST is orphaned (not cancelled, just abandoned). Same for `link-sent` — user might want to re-read the "check your email" message.
- **Fix:** Guard `closeModal` to no-op when `status === "requesting"`. ~3 lines.

---

## Low / nits

- **`functions/api/_lib/session.ts:23-28`** — `b64urlEncode` does a `String.fromCharCode(...new Uint8Array(...))`. For a 32-byte HMAC sig this spreads 32 numbers, well under the call-stack arg limit. Documented worry-free for current use; flag if anyone ever passes >100KB through here.
- **`functions/api/_lib/email.ts:32`** — `console.log` of full email + magic-link in dev fallback. Fine for local; just confirm the Cloudflare Pages Functions log retention isn't longer than you want for a magic-link literal. Quick hygiene.
- **`components/v2/ChapterEndCard.tsx:33-36`** — uses `<span>` inside `<p>`. Valid HTML. The `tomorrow's ai-shipped bug` text is keyword-stuffed for SEO; not a bug, just noting.
- **`components/v2/TweetThisStep.tsx:34-40`** — tweet character budget computed assuming the URL doesn't get t.co-shortened. Twitter shortens URLs to 23 chars regardless. Real budget is `280 - 23 - tail-without-url` → ~217 chars for intro. Currently you're over-truncating intros on long lesson titles. Cosmetic.
- **`functions/api/subscribe.ts:33`** — `Map<string, number[]>` not ` const` per `let` — fine, but a `Map` is mutable so it doesn't matter.
- **`components/v2/ChapterEndCard.tsx:38-44`** — Follow link uses `rel="noopener noreferrer"` (correct), but `target="_blank"` opens a new tab even on the chapter-end "back to home" Link below. The Link to `/` is internal SPA nav (good), but the contrast in `target` behavior between the Follow CTA and Back is reasonable UX. Noting only.
- **`components/v2/LessonStepClient.tsx:260-262`** — `tree.toc.chapters[tree.toc.chapters.length - 1]?.slug === chapter.slug` is correct but assumes TOC ordering matches curriculum ordering. There's a comment elsewhere about this; check `lib/content-v2.ts` ordering is a stable contract.
- **`components/PyodidePreloader.tsx:43-49`** — `requestIdleCallback` fallback is `setTimeout(startWarmup, 200)` — 200ms is fine; just double-check Safari's `requestIdleCallback` shipping status (Safari 17+ has it). Documented as safe-fallback.
- **`functions/api/auth/verify.ts:25-37`** — inline HTML in a template literal is fine for a 4-line error page. If you ever localize, extract.

---

## Architecture observations

1. **The session secret is a single well-known env binding.** No rotation strategy. If `SESSION_SECRET` ever leaks, every issued cookie is forgeable until you change it (which invalidates *all* sessions). Acceptable trade-off for a free-tier hobby project; flag for a future "auth hardening" milestone. Keyed-secrets (HMAC-`secret-v1`, with verify trying current + previous) is the standard fix.

2. **No CSRF token on `/api/save` or `/api/auth/logout`.** SameSite=Lax cookie protects against most cross-site POSTs, but a same-site iframe / popup attack vector exists (theoretical, low). For a save-progress endpoint with no real damage potential (you can only nuke your own progress), Lax is appropriate. Don't add CSRF tokens, just be aware.

3. **Magic-link tokens single-use is correct, but there's no "request another link" rate limit.** A bored attacker can spam `/api/auth/request` with `bob@victim.com` and fill Bob's inbox with magic links. Each request also writes a KV entry that lives 15 min. Mitigation: same per-IP rate limit pattern as subscribe.ts. Probably worth adding before announcing the feature publicly.

4. **The `output: "export"` static-export model means `/api/*` routes only exist as Cloudflare Pages Functions** — the code in `functions/` is the *only* server-side surface. There's no Next.js route handler fallback. If a contributor adds a `route.ts` under `app/`, it silently does nothing in production. Worth a comment in `app/layout.tsx` or a `CONTRIBUTING.md` note.

5. **The IDE dynamic import + skeleton placement is correct** for the audit-v5 perf goal (~80 KB shaved off lesson-route critical chunk). The skeleton matches the IDE chrome (tab strip, status footer) so there's no layout shift. Good.

6. **`PROGRESS_EVENT_V2` is a window event, fired by `lib/storage.ts` on writes.** Two tabs open on the same domain do *not* share window events (one tab's storage write does not fire `progress-v2` in the other). For real cross-tab sync you'd need `window.addEventListener('storage', ...)`. Not blocking — most users have one tab — but worth knowing for the multi-device pitch.

---

## Regressions to flag (audit-v5 issues that came back)

- **None confirmed.** Spot checks:
  - `<main id="main">` — Audited every match (`app/page.tsx`, `not-found.tsx`, `changelog`, `[chapter]/page.tsx`, `about`, `curriculum`, `lesson/resume`, `LessonShell.tsx`). Each route mounts exactly one. No duplication regression. ✅
  - ⌘↵ scope check (`PersistentIDE.tsx:189-191`) — present and unchanged. ✅
  - Onboarding 404 / login-wipe — login wipe is *not* fully closed (see High #4). Onboarding 404 not re-checked in this pass.
  - MC schema — not in scope of v6 changes; not re-checked.
  - Pyodide preloader gating — newly added, behaves correctly under intent + 8s fallback; the v5 issue was "fires too eagerly," v6 fixes it. ✅

---

## Top 5 (priority order)

1. **High #4** — login-wipe regression on second-device sign-in. Add `savedAt`-based merge.
2. **High #3** — magic-link redirect drops the `next` URL. Add validated `next` param round-trip.
3. **High #1** — `verifySession` should be try/catch-wrapped to convert decode errors to `null` instead of 500.
4. **Architecture #3** — add per-IP rate limit to `/api/auth/request` to prevent inbox-flooding.
5. **Medium #12** — IDE handle race on dynamic-import — disable Submit until `ideRef.current` is non-null, or surface "loading editor" instead of grading empty code.

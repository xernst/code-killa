# Magic-link sign-in setup

> Replaces the previous trustless email-as-key model (audit-v5 critical).
> Users now sign in via a one-time email link; an HMAC-signed cookie
> carries identity. `/api/save` and `/api/load` require a valid session.

## What changed

| Before | Now |
| --- | --- |
| Type any email and progress saved under that email | Type email then click the link in inbox; cookie set |
| Anyone who guessed an email could read or write that user progress | Cookie is HMAC-signed; tampering invalidates it |
| Save body had email plus payload | Save body is just payload; email comes from cookie |
| Load needed an email query param | Load is cookie-only |
| Profile name and flavor fields were persisted to KV | Server validator strips identifying fields before KV write |

## One-time Cloudflare Pages setup

### 1. Create a second KV namespace for auth tokens

The existing `PROGRESS_KV` keeps user progress. We add `AUTH_KV` for short-
lived magic-link tokens (15-min TTL).

1. Cloudflare dashboard then Workers and Pages then KV
2. Create namespace, name it `promptdojo-auth`
3. Done.

### 2. Bind both KV namespaces to the Pages project

1. Cloudflare dashboard then your Pages project then Settings then KV namespace bindings
2. Add two bindings:
   - `PROGRESS_KV` to `promptdojo-progress` (existing)
   - `AUTH_KV` to `promptdojo-auth` (new)

### 3. Add the session secret

1. Generate a secret locally:
   ```
   openssl rand -hex 32
   ```
2. Cloudflare dashboard then Pages project then Settings then Environment variables
3. Add Production plus Preview variable:
   - Name: `SESSION_SECRET`
   - Value: the hex string from step 1
   - Type: Encrypted

### 4. Add the email provider key (Resend)

Without this the magic-link flow still works but emails are logged
server-side instead of delivered.

1. Sign up at https://resend.com (free tier: 3 000 emails per month, 100 per day)
2. Verify a domain (or use the default `onboarding@resend.dev` for testing)
3. Copy your API key (starts with `re_`)
4. Cloudflare dashboard then Pages project then Settings then Environment variables
5. Add Production plus Preview variables:
   - `RESEND_API_KEY` is your key (encrypted)
   - `RESEND_FROM_EMAIL` is `promptdojo <hello@your-verified-domain>` (optional;
     defaults to `promptdojo <onboarding@resend.dev>`)

### 5. (optional) Beehiiv newsletter signup

The landing-page newsletter form lives at `functions/api/subscribe.ts` and
forwards to Beehiiv. Set:

- `BEEHIIV_API_KEY` (encrypted)
- `BEEHIIV_PUBLICATION_ID`

Without these, the form returns "subscription not configured yet".

### 6. Redeploy

Push any commit to `main` (or click Retry deployment on the latest build).
The new endpoints need to redeploy to pick up the bindings and secrets.

## Threat model (post-magic-link)

| Threat | Mitigation |
| --- | --- |
| Guess someone email and read their progress | Requires inbox access to complete sign-in |
| Replay a captured magic link | Token is single-use, deleted from KV on first verify |
| Steal session cookie | HttpOnly + Secure + SameSite Lax; JS cannot read it |
| Forge a cookie | Tampering invalidates HMAC; SESSION_SECRET stays server-only |
| KV-write spam | Save endpoint requires valid session; rate-limit `auth/request` via Cloudflare WAF |
| PII leak via persisted profile | Server `sanitizeProgressPayload` strips identifying fields before KV write |
| Email enumeration via "user not found" | `auth/request` always returns ok regardless of validity |

## Recommended next step

Add a Cloudflare WAF rule on POST `/api/auth/request`: 5 requests per IP per
minute. Stops link-bombing a target inbox. Free on the WAF tier.

## Files

- `functions/api/auth/request.ts` to send link
- `functions/api/auth/verify.ts` to set cookie and redirect
- `functions/api/auth/session.ts` to return logged-in email
- `functions/api/auth/logout.ts` to clear cookie
- `functions/api/save.ts` requires session
- `functions/api/load.ts` requires session
- `functions/api/subscribe.ts` for Beehiiv (unauthenticated by design)
- `functions/api/_lib/session.ts` HMAC sign and verify, cookie helpers, token gen
- `functions/api/_lib/email.ts` Resend sender plus stub fallback
- `functions/api/_lib/validate.ts` email regex, payload sanitizer
- `components/LoginToSave.tsx` client UI

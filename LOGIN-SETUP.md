# Login-to-save setup

> One-time Cloudflare Pages binding. After this, `promptdojo.pages.dev/api/save`
> and `/api/load` will work and progress will sync across devices.

## What this is

The site now has a "login to save" pill in the header. Users type their email,
their localStorage progress is stored in Cloudflare KV under that email, and
typing the same email on another device pulls progress back. **No passwords,
no auth verification** — anyone who knows an email can load that email's
progress. Trade-off chosen for zero-friction UX on a free open-source course.

Backend is two Cloudflare Pages Functions (`functions/api/save.ts` and
`functions/api/load.ts`) talking to a KV namespace bound as `PROGRESS_KV`.

## Setup steps (do this once, in the Cloudflare dashboard)

### 1. Create the KV namespace

1. Open https://dash.cloudflare.com → your account → **Workers & Pages**
   (or **Storage & Databases** → **KV** in the new IA)
2. Click **Create a namespace** (or **+ Create**)
3. Name it: `promptdojo-progress`
4. **Create**

You'll see a namespace ID like `abc123def456...`. Copy it — you don't strictly
need it (the dashboard binding handles it) but it's useful for `wrangler`.

### 2. Bind the namespace to the Pages project

1. Workers & Pages → **promptdojo** → **Settings**
2. Scroll to **Functions** → **KV namespace bindings**
3. Click **Add binding**
4. Variable name: `PROGRESS_KV` (must match exactly)
5. KV namespace: pick `promptdojo-progress` from the dropdown
6. **Save**

There may be separate binding sections for "Production" and "Preview" — bind
the same namespace to both, or only Production for now.

### 3. Trigger a redeploy

The binding only takes effect on the NEXT deployment. Either:
- Push a new commit to `main` (auto-deploys), OR
- In Pages → Deployments → trigger a new deploy of the latest commit

### 4. Verify

```bash
# 503 = binding missing (haven't done step 2)
# 400 = binding works, validation rejected the empty body (good!)
curl -X POST https://promptdojo.pages.dev/api/save \
  -H 'content-type: application/json' \
  -d '{}'

# Round-trip test
curl -X POST https://promptdojo.pages.dev/api/save \
  -H 'content-type: application/json' \
  -d '{"email":"test@example.com","payload":{"hello":"world"}}'

curl 'https://promptdojo.pages.dev/api/load?email=test@example.com'
# expect: {"payload":{"hello":"world"},"savedAt":1234567890}
```

## Limits to know

- **KV free tier:** 100K reads/day, 1K writes/day, 1GB storage. We're nowhere
  close at our current scale.
- **Payload size:** capped at 200 KB per email in our code (`MAX_BYTES` in
  `functions/api/save.ts`). Progress blobs are typically <10 KB even after
  hundreds of completed steps.
- **Email format:** very loose validation (just `something@something.tld`).
  We don't verify the email is real or owned by the user. By design.
- **Last-write-wins:** if a user has progress on Device A and B simultaneously,
  whichever device syncs last overwrites. No CRDT, no merge. Document this in
  any user-facing FAQ.

## Trust model (read this before promising anything)

- Anyone with an email can load that email's progress. Zero protection. The
  intended threat model is "low — it's just course progress, not money or
  PII." If that changes, this needs real auth.
- We DO collect emails. They go into KV with the progress blob, NOT into a
  marketing list yet. If you want to wire emails into Resend/Buttondown for a
  newsletter, add a fan-out to that service inside `functions/api/save.ts`.
- We do NOT email-verify. A typo means a typo'd email gets stored.
- We do NOT rate-limit. CF Workers DDoS protection is the only floor. Add
  rate-limiting via CF's Rate Limiting Rules if abuse appears.

## How to read the data

You can browse stored emails + progress directly in the CF dashboard:
**Workers & Pages → KV → promptdojo-progress → View**.

Each entry's key is the email. Click to inspect the value (JSON).

## Removing a user (manual)

If a user emails asking to be deleted:
1. Dashboard → KV → `promptdojo-progress`
2. Find their email
3. Delete the entry

That's the entire deletion process. Tell them done.

## Files

- `functions/api/save.ts` — POST handler
- `functions/api/load.ts` — GET handler
- `components/LoginToSave.tsx` — the UI + auto-sync
- `app/layout.tsx` — mounts the pill in the header

## Next-session work (not blocking V0)

- **Wire emails into Resend Audiences** for the newsletter list — fan-out from
  `functions/api/save.ts` after the KV write succeeds
- **Rate limiting** — add CF Rate Limiting Rule on `/api/save` (e.g., 10/min/IP)
- **Magic-link verification** — when this becomes real auth (V2 problem)
- **Merge semantics** — per-step `lastModified` so two devices don't lose
  each other's progress
- **`/save` page** — full screen settings page where users see their email,
  manually trigger sync, export their progress as JSON, etc.
- **Update `/og/launch/price` OG art** — currently still says "no login"

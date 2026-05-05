# Deploy

promptdojo / promptdojo ships as a fully static Next.js export hosted on **Cloudflare Pages free tier**. Picked over Vercel because Vercel's Hobby plan ToS prohibits commercial use (i.e. ads).

## What's already wired up

| Piece | Where | Why |
| --- | --- | --- |
| `output: "export"` | `next.config.ts` | Generates `out/` instead of a Node server |
| `images.unoptimized: true` | `next.config.ts` | Required for static export (no `next/image` runtime) |
| `trailingSlash: true` | `next.config.ts` | Plays nicest with CF Pages' static asset routing |
| `_headers` | `public/_headers` → `out/_headers` | Long-cache for `/pyodide/*` and `/pyodide-worker.js` (replaces the old `headers()` config function, which static export disallows) |
| `force-static` on OG/sitemap/robots | `app/sitemap.ts`, `app/robots.ts`, `app/og/launch/[name]/route.tsx`, `app/learn/v2/[chapter]/{opengraph,twitter}-image.tsx` | Without this, those routes would try to render at request time |
| `generateStaticParams` on all dynamic routes | `app/learn/[chapter]`, `app/learn/v2/...`, `app/og/launch/[name]`, `app/learn/v2/[chapter]/opengraph-image.tsx` | Pre-renders every chapter / lesson / step / OG image at build time |

After `pnpm build`, `out/` contains ~7,200 files / ~185 MB. Cloudflare Pages free-tier limits: 25 MiB per file, 20,000 files total, unlimited bandwidth, 500 builds/month — all comfortably clear.

## First-time Cloudflare Pages setup

The repo is already on GitHub at `xernst/promptdojo`. One-time wiring:

1. Sign in at https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare on the `xernst/promptdojo` GitHub repo.
3. Build configuration:
   - **Framework preset:** `Next.js (Static HTML Export)`
   - **Build command:** `pnpm build`
   - **Build output directory:** `out`
   - **Root directory:** *(leave empty)*
   - **Node version:** `20` (set via env var `NODE_VERSION=20` if needed)
4. Production branch: `main`. Save and deploy.
5. Default URL: `promptdojo.pages.dev`. Custom domain (`promptdojo.dev`) is added later under **Custom domains** — point the apex via Cloudflare DNS, no extra config.

Subsequent deploys are automatic on every push to `main`. PR branches get preview URLs for free.

## Local preview

```bash
pnpm build              # produces out/
npx serve out           # quick local serve at http://localhost:3000
```

`pnpm dev` still works for development — `output: "export"` only affects `next build`.

## Things to know later

- **Ads.** Vercel Hobby bans them; Cloudflare Pages doesn't. AdSense at <1k followers earns pennies — defer until V2 (1,000 X followers) and prefer **EthicalAds** (dev-audience network, easier approval) over AdSense. When ready, drop the script into `app/layout.tsx`.
- **Headers.** Edit `public/_headers`, not `next.config.ts`. The static export ignores any `headers()` function. CF Pages syntax docs: https://developers.cloudflare.com/pages/configuration/headers/
- **Redirects.** Same story — use `public/_redirects` if needed.
- **Pyodide bumps.** When `pyodide` version changes in `package.json`, `scripts/copy-pyodide.mjs` refreshes `public/pyodide/`. The `_headers` cache rule covers any version because the path is `/pyodide/*`.
- **OG images.** Re-rendered every build via `force-static` — no runtime dependency.

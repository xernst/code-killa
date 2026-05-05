# Promptdojo Brand Kit

Everything needed to render the brand consistently — logos, colors, type, voice, motion. The kit is the source of truth; if a file in the app contradicts the kit, the kit wins.

> **A school for builders in the AI era.**
> AI writes the code. You make sure it works.

---

## What's in here

| Path | Purpose |
| --- | --- |
| [`BRAND.md`](./BRAND.md) | Top-level brand spec (overview) |
| [`LOGO.md`](./LOGO.md) | Mark + wordmark system, lockups, clear space, don'ts |
| [`COLORS.md`](./COLORS.md) | Palette tokens, when to use each, accessibility notes |
| [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) | Fraunces + JetBrains Mono pairing, weights, sizes, OpenType features |
| [`VOICE.md`](./VOICE.md) | Tone of voice, copy rules, headline templates |
| [`MOTION.md`](./MOTION.md) | Cursor blink, eases, scene transition language |
| [`tokens.css`](./tokens.css) | CSS custom properties — paste into `app/globals.css` or import |
| [`tokens.json`](./tokens.json) | Design tokens as JSON — feed into Style Dictionary or other token pipelines |
| [`preview.html`](./preview.html) | Open in any browser to see logos on dark/light/ember |
| [`logos/*.svg`](./logos/) | Master SVGs — color, mono (`currentColor`), on-light variants |
| [`logos/exports/*.png`](./logos/exports/) | Raster exports of the mark at icon sizes (16–1024 px) |

---

## Quick start

**Embed a logo in HTML:**
```html
<img src="/brand/mark.svg" alt="promptdojo" width="40" height="40">
<img src="/brand/wordmark.svg" alt="promptdojo" height="32">
```

**Embed a logo in React:**
```tsx
import Image from "next/image";
<Image src="/brand/wordmark.svg" alt="promptdojo" width={240} height={48} priority />
```

**Use the mono variant with any color:**
```html
<span style="color: #F2683C">
  <!-- inline SVG so currentColor works -->
  <svg><use href="/brand/mark-mono.svg#mark"/></svg>
</span>
```

**Adopt the design tokens:**
```css
@import url("./design-kit/tokens.css");
.cta { background: var(--ember); color: var(--ink-950); }
```

---

## Versioning

The kit is **v0** — released alongside the V1 site rename. Breaking changes are tracked in this README. If you rename a token or logo file, update every consumer (live app, design kit preview, launch trailer, OG art).

| Version | Date | Notes |
| --- | --- | --- |
| 0 | 2026-05-05 | Initial kit: mark, wordmark, lockup, palette, type spec, motion notes, tokens |

---

## What this kit *isn't*

- **Not a UI component library.** The Tailwind setup in `app/globals.css` is the source for spacing, layout, and component tokens.
- **Not a marketing playbook.** Voice and tone live here; campaign tactics don't.
- **Not a full motion library.** The launch trailer (`launch-trailer/`) is the canonical motion reference until V2 expands the rules.

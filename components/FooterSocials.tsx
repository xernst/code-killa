// Footer social icons — LinkedIn + X, icon-only.
//
// The visible @-handle was pulled site-wide 2026-05-16; these brand
// glyphs keep the social presence without printing the handle as text.
// They render in the site ink/green scheme via `currentColor` (not the
// native LinkedIn-blue / X-black), so they sit in the footer like every
// other muted link and pick up the same green hover.

import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/in/joshernst1";
const X_URL = "https://x.com/TFisPython";

type IconLink = { href: string; label: string; path: string };

// Brand glyphs (simple-icons paths, 24×24 viewBox).
const LINKS: IconLink[] = [
  {
    href: LINKEDIN_URL,
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    href: X_URL,
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export default function FooterSocials({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="text-ink-500 transition-colors hover:text-green-400"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={link.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

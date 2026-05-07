// Validates a "return to here after sign-in" path so the magic-link
// verify endpoint can redirect users back to the lesson they were on
// instead of always dumping them on /.
//
// We only accept a same-origin pathname (starts with `/`, no `//`,
// no `\`, no protocol) — never a full URL, never a redirect to
// another host. Anything else returns null and the caller should
// fall back to "/".

const VALID_PATH = /^\/[A-Za-z0-9_\-/?=&%.#]*$/;

export function safeReturnPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Reject protocol-relative ("//evil.com") + scheme ("http:", "javascript:") + windows-style ("\foo")
  if (raw.startsWith("//") || raw.includes("\\") || raw.includes(":")) return null;
  if (!raw.startsWith("/")) return null;
  if (!VALID_PATH.test(raw)) return null;
  if (raw.length > 500) return null;
  return raw;
}

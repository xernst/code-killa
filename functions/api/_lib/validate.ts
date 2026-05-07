// Shared input validation for Pages Functions.
//
// Server-side mirror of the client email regex + a hand-rolled
// progress-payload shape check. We don't pull zod into the Workers
// runtime to keep the function bundle tiny.

export const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_EMAIL = 200;
export const MAX_PAYLOAD_BYTES = 200_000;

export function normalizeEmail(raw: unknown): string | null {
  const s = String(raw ?? "").trim().toLowerCase();
  if (!s || s.length > MAX_EMAIL || !VALID_EMAIL.test(s)) return null;
  return s;
}

// Loose shape check. Accepts what the client writes today, rejects
// arbitrary garbage. Strips known PII (profile.name + flavor.{pet,team,city})
// to reduce the doxx surface — those fields stay in localStorage but
// don't get persisted to KV.
export function sanitizeProgressPayload(payload: unknown): {
  ok: boolean;
  value?: unknown;
  error?: string;
} {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "payload must be an object" };
  }
  const obj = payload as Record<string, unknown>;

  // Whitelist top-level keys. Anything else is dropped silently.
  const allowed: Record<string, unknown> = {};
  for (const k of [
    "schemaVersion",
    "lessons",
    "steps",
    "completedChapters",
    "lastVisited",
    "lastSeenAt",
    "streak",
    "frozenFlames",
    "brainDump",
    "profile",
  ]) {
    if (k in obj) allowed[k] = obj[k];
  }

  // Strip identifying profile fields. Keep the non-identifying ones
  // (goal, level, dailyGoalMinutes, reducedMotion, soundEnabled, createdAt)
  // so the welcome-back UX still works.
  if (allowed.profile && typeof allowed.profile === "object") {
    const p = allowed.profile as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};
    for (const k of [
      "goal",
      "level",
      "dailyGoalMinutes",
      "reducedMotion",
      "soundEnabled",
      "createdAt",
    ]) {
      if (k in p) cleaned[k] = p[k];
    }
    allowed.profile = cleaned;
  }

  return { ok: true, value: allowed };
}

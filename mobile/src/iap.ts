// iap.ts — RevenueCat entitlement + paywall bridge for promptdojo mobile.
// Offline-grace design: every successful entitlement read is cached in
// localStorage under "pdo:entitlement" with a timestamp; if RevenueCat
// fails (network down, RC outage), getEntitlement() falls back to the
// cached tier if it is < 24h old, otherwise it defaults to "free".
// iOS-only audit per App Store §3.1.1: restorePurchases is mandatory,
// product IDs are pdo_pro_{monthly,annual,lifetime}, RevenueCat
// entitlement ID is "pro". No Stripe/web-checkout links inside iOS app.
import { Purchases, type CustomerInfo } from "@revenuecat/purchases-capacitor";

export type Entitlement = "free" | "pro_monthly" | "pro_annual" | "lifetime";

const CACHE_KEY = "pdo:entitlement";
const STALE_MS = 24 * 60 * 60 * 1000; // 24h offline-grace window
const ENTITLEMENT_ID = "pro";
const PRODUCT_MONTHLY = "pdo_pro_monthly";
const PRODUCT_ANNUAL = "pdo_pro_annual";
const PRODUCT_LIFETIME = "pdo_pro_lifetime";

interface CachedEntitlement {
  tier: Entitlement;
  ts: number;
}

let configured = false;

function readCache(): CachedEntitlement | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedEntitlement;
    if (
      typeof parsed.ts !== "number" ||
      typeof parsed.tier !== "string" ||
      !["free", "pro_monthly", "pro_annual", "lifetime"].includes(parsed.tier)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(tier: Entitlement): void {
  try {
    const payload: CachedEntitlement = { tier, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable (private mode); cache write is best-effort.
  }
}

export function tierFromCustomerInfo(info: CustomerInfo): Entitlement {
  const active = info.entitlements?.active?.[ENTITLEMENT_ID];
  if (!active) return "free";

  // Lifetime resolves first: any non-expiring entitlement on the "pro" ID.
  // RevenueCat sets expirationDate to null/undefined for non-consumable purchases.
  const expiration = active.expirationDate;
  if (expiration === null || expiration === undefined || expiration === "") {
    return "lifetime";
  }

  const productId = active.productIdentifier;
  if (productId === PRODUCT_LIFETIME) return "lifetime";
  if (productId === PRODUCT_ANNUAL) return "pro_annual";
  if (productId === PRODUCT_MONTHLY) return "pro_monthly";

  // Active but unknown product — treat as annual (most generous safe default).
  return "pro_annual";
}

// import.meta.env is supplied by the bundler (Vite-style or Next.js
// equivalent). Typed loosely here because `mobile/` doesn't have its own
// tsconfig with the bundler ambient types yet — the runtime key flows
// from the Capacitor host's build-time environment.
type ImportMetaEnv = { VITE_REVENUECAT_PUBLIC_KEY?: string };

export async function initIAP(userId: string): Promise<void> {
  if (configured) return;
  const env = (import.meta as unknown as { env?: ImportMetaEnv }).env;
  const apiKey = env?.VITE_REVENUECAT_PUBLIC_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    throw new Error("VITE_REVENUECAT_PUBLIC_KEY missing at build time");
  }
  await Purchases.configure({ apiKey, appUserID: userId });
  configured = true;
}

export async function getEntitlement(): Promise<Entitlement> {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const tier = tierFromCustomerInfo(customerInfo);
    writeCache(tier);
    return tier;
  } catch {
    // RevenueCat unreachable — fall back to cached tier if fresh.
    const cached = readCache();
    if (cached && Date.now() - cached.ts < STALE_MS) {
      return cached.tier;
    }
    return "free";
  }
}

export async function presentPaywall(): Promise<"purchased" | "cancelled" | "error"> {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current || !current.availablePackages || current.availablePackages.length === 0) {
      return "error";
    }
    // Default to the annual package as the loud-CTA tier; fall back to first available.
    const annual = current.availablePackages.find(
      (p) => p.product.identifier === PRODUCT_ANNUAL,
    );
    const pkg = annual ?? current.availablePackages[0];
    const result = await Purchases.purchasePackage({ aPackage: pkg });
    const tier = tierFromCustomerInfo(result.customerInfo);
    writeCache(tier);
    return tier === "free" ? "cancelled" : "purchased";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // RevenueCat surfaces user-cancel as an error with a specific code/userCancelled flag.
    if (
      message.toLowerCase().includes("cancel") ||
      (err as { userCancelled?: boolean }).userCancelled === true
    ) {
      return "cancelled";
    }
    return "error";
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const tier = tierFromCustomerInfo(customerInfo);
    writeCache(tier);
    return tier !== "free";
  } catch {
    return false;
  }
}

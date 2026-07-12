import { getCurrentSession } from "@/lib/analytics/session";
import { getVisitorId } from "@/lib/analytics/visitor";
import { SITE_VERSION } from "@/lib/site";
import type { FeedbackMetadata } from "@/types/feedback";
import type { Preferences } from "@/lib/types";

const PAGE_LABELS: Record<string, string> = {
  "/": "Landing",
  "/dashboard": "Dashboard",
  "/onboarding/welcome": "Welcome",
  "/onboarding/name": "Name",
  "/onboarding/role": "Role",
  "/onboarding/region": "Region",
  "/onboarding/interests": "Intelligence Focus Areas",
  "/onboarding/tour": "Tour",
  "/about": "About",
  "/contact": "Contact",
  "/privacy": "Privacy",
  "/terms": "Terms",
  "/changelog": "Changelog",
  "/roadmap": "Roadmap",
};

function detectBrowser(userAgent: string): string {
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("Chrome/")) return "Chrome";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Safari/")) return "Safari";
  return "Unknown";
}

function detectOs(userAgent: string): string {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac OS")) return "macOS";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Unknown";
}

function resolvePageLabel(pathname: string): string {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.startsWith("/onboarding/")) return "Onboarding";
  return pathname;
}

/** Collect automatic feedback context — client only. */
export function collectFeedbackMetadata(
  preferences?: Pick<Preferences, "role" | "region" | "interests">
): FeedbackMetadata {
  const now = new Date().toISOString();
  const session = getCurrentSession();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const url = typeof window !== "undefined" ? window.location.href : "";
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

  return {
    timestamp: now,
    visitorId: getVisitorId(),
    sessionId: session?.sessionId ?? null,
    url,
    page: resolvePageLabel(pathname),
    appVersion: SITE_VERSION,
    browser: detectBrowser(ua),
    operatingSystem: detectOs(ua),
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    screenWidth: typeof screen !== "undefined" ? screen.width : 0,
    screenHeight: typeof screen !== "undefined" ? screen.height : 0,
    role: preferences?.role ?? null,
    region: preferences?.region ?? null,
    interests: preferences?.interests ?? [],
  };
}

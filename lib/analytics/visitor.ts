const VISITOR_ID_KEY = "horizoniq.analytics.visitor-id.v1";

const isBrowser = (): boolean => typeof window !== "undefined";

function generateUuid(): string {
  if (isBrowser() && typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "00000000-0000-4000-8000-000000000000";
}

/** Persistent anonymous visitor ID — survives browser restarts. */
export function getOrCreateVisitorId(): string {
  if (!isBrowser()) return generateUuid();

  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const id = generateUuid();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return generateUuid();
  }
}

export function getVisitorId(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(VISITOR_ID_KEY);
  } catch {
    return null;
  }
}

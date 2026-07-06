import type { AnalyticsEventName, AnalyticsEventProps } from "./events";
import { incrementSessionEventCount } from "./session";
import type { AnalyticsEvent, AnalyticsSink } from "./types";
import { getOrCreateVisitorId } from "./visitor";
import { getCurrentSession } from "./session";

/**
 * Provider-agnostic analytics core.
 *
 * Every event is:
 *   1. Enriched with visitor + session IDs
 *   2. Buffered to localStorage (inspect via `getAnalyticsLog()`)
 *   3. Logged in development
 *   4. Forwarded to registered provider sinks (Vercel, PostHog, etc.)
 *
 * UI code must call `track()` only — never provider SDKs directly.
 */

const EVENT_LOG_KEY = "horizoniq.analytics.events.v1";
const MAX_BUFFERED_EVENTS = 200;

const sinks = new Set<AnalyticsSink>();

const isBrowser = (): boolean => typeof window !== "undefined";
const isDev = process.env.NODE_ENV !== "production";

function readLog(): AnalyticsEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(EVENT_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function writeLog(events: AnalyticsEvent[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(EVENT_LOG_KEY, JSON.stringify(events));
  } catch {
    // Storage full or unavailable.
  }
}

/** Register a downstream analytics provider sink. Returns an unsubscribe function. */
export function registerAnalyticsSink(sink: AnalyticsSink): () => void {
  sinks.add(sink);
  return () => {
    sinks.delete(sink);
  };
}

/** Record a typed product event. SSR-safe and never throws. */
export function track<N extends AnalyticsEventName>(
  name: N,
  props: AnalyticsEventProps[N]
): void {
  if (!isBrowser()) return;

  const session = getCurrentSession();
  const event: AnalyticsEvent<N> = {
    name,
    props,
    ts: new Date().toISOString(),
    visitorId: getOrCreateVisitorId(),
    sessionId: session?.sessionId ?? null,
  };

  incrementSessionEventCount();

  try {
    const log = readLog();
    log.push(event as AnalyticsEvent);
    if (log.length > MAX_BUFFERED_EVENTS) {
      log.splice(0, log.length - MAX_BUFFERED_EVENTS);
    }
    writeLog(log);
  } catch {
    // Ignore buffering failures.
  }

  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${name}`, props);
  }

  for (const sink of sinks) {
    try {
      sink(event as AnalyticsEvent);
    } catch {
      // A failing provider must not break the product.
    }
  }
}

export function getAnalyticsLog(): AnalyticsEvent[] {
  return readLog();
}

export function clearAnalyticsLog(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(EVENT_LOG_KEY);
  } catch {
    // Ignore.
  }
}

/** @deprecated Use session.getSessionElapsedMs — kept for onboarding timing. */
export { getSessionElapsedMs, startSession } from "./session";

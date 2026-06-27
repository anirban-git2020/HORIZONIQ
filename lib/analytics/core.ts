import type { AnalyticsEventName, AnalyticsEventProps, SignalSource } from "./events";

/**
 * Lightweight, provider-agnostic analytics for HorizonIQ.
 *
 * There is no backend yet, so every event is:
 *   1. Buffered to localStorage (inspect via `getAnalyticsLog()` in the console).
 *   2. Logged to the console in development.
 *   3. Forwarded to an optional sink (PostHog / Plausible / custom).
 *
 * To plug in a provider later, call `registerAnalyticsSink()` once on app start
 * (e.g. behind a `NEXT_PUBLIC_POSTHOG_KEY` check). No call sites need to change.
 */

const EVENT_LOG_KEY = "horizoniq.analytics.events.v1";
const SESSION_START_KEY = "horizoniq.analytics.session-start";
const SIGNAL_SOURCE_KEY = "horizoniq.analytics.signal-source";
const MAX_BUFFERED_EVENTS = 200;

export interface AnalyticsEvent<
  N extends AnalyticsEventName = AnalyticsEventName,
> {
  name: N;
  props: AnalyticsEventProps[N];
  ts: string;
}

export type AnalyticsSink = (event: AnalyticsEvent) => void;

let sink: AnalyticsSink | null = null;

/** Register (or clear) the downstream provider. Safe to call once at app start. */
export function registerAnalyticsSink(next: AnalyticsSink | null): void {
  sink = next;
}

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
    // Storage full or unavailable — analytics must never break the app.
  }
}

/** Record an event. SSR-safe and never throws. */
export function track<N extends AnalyticsEventName>(
  name: N,
  props: AnalyticsEventProps[N]
): void {
  if (!isBrowser()) return;

  const event: AnalyticsEvent<N> = {
    name,
    props,
    ts: new Date().toISOString(),
  };

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

  try {
    sink?.(event as AnalyticsEvent);
  } catch {
    // A failing provider must not break the product.
  }
}

/** Begin (or keep) the current session clock. Used for time-to-first-insight. */
export function startSessionTiming(): void {
  if (!isBrowser()) return;
  try {
    if (!window.sessionStorage.getItem(SESSION_START_KEY)) {
      window.sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
    }
  } catch {
    // Ignore.
  }
}

/** Milliseconds since the session clock started, or null if not started. */
export function getSessionElapsedMs(): number | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_START_KEY);
    if (!raw) return null;
    const start = Number(raw);
    if (Number.isNaN(start)) return null;
    return Date.now() - start;
  } catch {
    return null;
  }
}

/** Remember where a signal-detail navigation came from (read once on the detail page). */
export function rememberSignalSource(source: SignalSource): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(SIGNAL_SOURCE_KEY, source);
  } catch {
    // Ignore.
  }
}

/** Read and clear the remembered signal source, defaulting to "direct". */
export function consumeSignalSource(): SignalSource {
  if (!isBrowser()) return "direct";
  try {
    const value = window.sessionStorage.getItem(SIGNAL_SOURCE_KEY);
    window.sessionStorage.removeItem(SIGNAL_SOURCE_KEY);
    return (value as SignalSource | null) ?? "direct";
  } catch {
    return "direct";
  }
}

/** All buffered events (most recent last). Useful for local inspection. */
export function getAnalyticsLog(): AnalyticsEvent[] {
  return readLog();
}

/** Clear the local event buffer. */
export function clearAnalyticsLog(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(EVENT_LOG_KEY);
  } catch {
    // Ignore.
  }
}

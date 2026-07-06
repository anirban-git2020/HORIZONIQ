import { registerAnalyticsSink } from "./analytics";
import { initClarity } from "./clarity";
import { initPostHog } from "./posthog";
import type { AnalyticsEvent } from "./types";

let providersReady = false;

function serializeForVercel(
  props: Record<string, unknown>
): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(props)) {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      out[key] = value;
    } else if (Array.isArray(value)) {
      out[key] = value.join(",");
    } else {
      out[key] = JSON.stringify(value);
    }
  }
  return out;
}

function createVercelSink(): (event: AnalyticsEvent) => void {
  return (event) => {
    void import("@vercel/analytics")
      .then(({ track: vercelTrack }) => {
        vercelTrack(
          event.name,
          serializeForVercel({
            ...(event.props as Record<string, unknown>),
            visitorId: event.visitorId,
            sessionId: event.sessionId,
            ts: event.ts,
          })
        );
      })
      .catch(() => {
        // Vercel Analytics unavailable outside Vercel / when package missing.
      });
  };
}

/**
 * Initialize all configured analytics providers once per client session.
 * Safe to call on every AnalyticsProvider mount — idempotent.
 */
export async function initAnalyticsProviders(): Promise<void> {
  if (providersReady) return;
  if (typeof window === "undefined") return;

  providersReady = true;

  registerAnalyticsSink(createVercelSink());
  initClarity();
  await initPostHog();
}

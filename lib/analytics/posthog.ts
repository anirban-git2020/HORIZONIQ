import { registerAnalyticsSink } from "./analytics";

/**
 * Optional PostHog integration — activated when NEXT_PUBLIC_POSTHOG_KEY is set.
 * Loaded lazily so it adds no bundle weight when unconfigured.
 */

let initialized = false;

const DEFAULT_HOST = "https://us.i.posthog.com";

export async function initPostHog(): Promise<void> {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  initialized = true;

  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? DEFAULT_HOST;

  try {
    const { default: posthog } = await import("posthog-js");

    posthog.init(key, {
      api_host: apiHost,
      capture_pageview: false,
      person_profiles: "identified_only",
    });

    registerAnalyticsSink((event) => {
      posthog.capture(event.name, {
        ...event.props,
        visitorId: event.visitorId,
        sessionId: event.sessionId,
        ts: event.ts,
      });
    });
  } catch {
    initialized = false;
  }
}

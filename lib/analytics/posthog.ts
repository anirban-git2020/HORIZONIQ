import { registerAnalyticsSink } from "./core";

/**
 * Optional PostHog integration.
 *
 * Activates only when `NEXT_PUBLIC_POSTHOG_KEY` is set. PostHog is loaded
 * lazily so it adds no bundle weight when analytics has no configured provider.
 * Idempotent — safe to call on every mount.
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
      capture_pageview: true,
      person_profiles: "always",
    });

    registerAnalyticsSink((event) => {
      posthog.capture(event.name, { ...event.props, ts: event.ts });
    });
  } catch {
    // Never let a failed analytics provider break the app.
    initialized = false;
  }
}

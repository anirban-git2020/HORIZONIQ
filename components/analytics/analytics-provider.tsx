"use client";

import { useEffect } from "react";

import { initPostHog } from "@/lib/analytics/posthog";

/**
 * Initializes the optional analytics provider (PostHog) on the client.
 * No-ops unless NEXT_PUBLIC_POSTHOG_KEY is configured. Renders nothing.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    void initPostHog();
  }, []);

  return null;
}

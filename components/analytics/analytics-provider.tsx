"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  endSession,
  initAnalyticsProviders,
  recordSessionPage,
  startSession,
  track,
} from "@/lib/analytics";

/**
 * Client analytics bootstrap — visitor ID, session, providers, and app_opened.
 * UI components must use `track()` from lib/analytics only.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const bootstrapped = useRef(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const path = pathname ?? window.location.pathname;
    startSession(path);

    track("app_opened", {
      path,
      referrer: document.referrer || "direct",
    });

    void initAnalyticsProviders();

    const onUnload = (): void => {
      endSession();
    };
    window.addEventListener("pagehide", onUnload);

    return () => {
      window.removeEventListener("pagehide", onUnload);
    };
  }, [pathname]);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;
    recordSessionPage(pathname);
  }, [pathname]);

  return null;
}

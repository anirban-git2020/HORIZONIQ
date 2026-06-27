"use client";

import { useEffect, useRef } from "react";

/**
 * Fires `onVisible` once, the first time the returned ref's element scrolls into
 * view. Falls back to firing immediately when IntersectionObserver is missing.
 */
export function useTrackOnVisible<T extends HTMLElement = HTMLElement>(
  onVisible: () => void,
  threshold = 0.4
) {
  const ref = useRef<T>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;

    if (typeof IntersectionObserver === "undefined") {
      fired.current = true;
      onVisible();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            onVisible();
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, threshold]);

  return ref;
}

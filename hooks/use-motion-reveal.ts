"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Reveals content once when it enters the viewport — never repeats.
 * Respects prefers-reduced-motion (immediate reveal, no animation).
 */
export function useMotionReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12
) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -4% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  return { ref, revealed, reducedMotion };
}

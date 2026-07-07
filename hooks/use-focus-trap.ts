"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  );
}

function focusWithoutScroll(element: HTMLElement) {
  element.focus({ preventScroll: true });
}

/**
 * Traps keyboard focus within `containerRef` while `active` is true.
 * Restores focus to the previously focused element on deactivate.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    container.setAttribute("tabindex", "-1");
    focusWithoutScroll(container);
    container.scrollTop = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const elements = getFocusableElements(container);
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];
      const activeEl = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          event.preventDefault();
          focusWithoutScroll(last);
        }
      } else if (activeEl === last) {
        event.preventDefault();
        focusWithoutScroll(first);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      container.removeAttribute("tabindex");
      if (previouslyFocused?.focus) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef]);
}

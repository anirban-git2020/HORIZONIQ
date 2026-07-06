let initialized = false;

/**
 * Lazy-load Microsoft Clarity in production only.
 * Non-blocking — injected after idle to avoid Lighthouse impact.
 */
export function initClarity(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") return;

  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!projectId) return;

  initialized = true;

  const load = (): void => {
    try {
      type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
      const w = window as Window & { clarity?: ClarityFn };
      const clarityFn: ClarityFn = (...args: unknown[]) => {
        (clarityFn.q = clarityFn.q ?? []).push(args);
      };
      w.clarity = w.clarity ?? clarityFn;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${projectId}`;
      const first = document.getElementsByTagName("script")[0];
      first?.parentNode?.insertBefore(script, first);
    } catch {
      initialized = false;
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(load, { timeout: 3000 });
  } else {
    setTimeout(load, 1500);
  }
}

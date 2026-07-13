"use client";

import { useEffect, useState } from "react";

export type ExchangeChromeInsets = {
  top: number;
  bottom: number;
};

const DEFAULT_INSETS: ExchangeChromeInsets = { top: 112, bottom: 24 };

/**
 * Measures exchange header + ticker and exposes CSS variables for Focus Mode sizing.
 * --exchange-focus-top: distance from viewport top to focused card
 * --exchange-focus-bottom: clearance from viewport bottom
 * --exchange-focus-max-h: max height for a focused card
 */
export function useExchangeChromeInsets(): ExchangeChromeInsets {
  const [insets, setInsets] = useState<ExchangeChromeInsets>(DEFAULT_INSETS);

  useEffect(() => {
    const header = document.getElementById("exchange-header");
    const ticker = document.getElementById("exchange-ticker");

    const measure = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 68;
      const tickerHeight = ticker?.getBoundingClientRect().height ?? 42;
      const top = Math.ceil(headerHeight + tickerHeight + 16);
      const bottom = 24;

      setInsets({ top, bottom });
      document.documentElement.style.setProperty("--exchange-focus-top", `${top}px`);
      document.documentElement.style.setProperty("--exchange-focus-bottom", `${bottom}px`);
      document.documentElement.style.setProperty(
        "--exchange-focus-max-h",
        `calc(100dvh - ${top + bottom}px)`
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    if (ticker) observer.observe(ticker);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      document.documentElement.style.removeProperty("--exchange-focus-top");
      document.documentElement.style.removeProperty("--exchange-focus-bottom");
      document.documentElement.style.removeProperty("--exchange-focus-max-h");
    };
  }, []);

  return insets;
}

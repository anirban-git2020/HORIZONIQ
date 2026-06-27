"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reset scroll position on every client-side route change. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

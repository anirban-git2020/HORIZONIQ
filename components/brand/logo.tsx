import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight",
        className
      )}
      aria-label="HorizonIQ home"
    >
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 rounded-md bg-primary/15" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-5 w-5 text-primary"
          aria-hidden="true"
        >
          <path
            d="M3 15c3-5 6-5 9 0s6 5 9 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="2" fill="currentColor" />
        </svg>
      </span>
      <span>
        Horizon<span className="text-primary">IQ</span>
      </span>
    </Link>
  );
}

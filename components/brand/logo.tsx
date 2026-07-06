import Link from "next/link";

import { BetaBadge } from "@/components/brand/beta-badge";
import { HorizonIQWordmark } from "@/components/brand/horizoniq-wordmark";
import { BRAND_IQ_COLOR } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showBeta = false,
}: {
  className?: string;
  href?: string;
  showBeta?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 font-heading text-[1.05rem] font-semibold tracking-[-0.02em]",
        className
      )}
      aria-label="HorizonIQ home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-lg border border-border/80 bg-card" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-[18px] w-[18px]"
          style={{ color: BRAND_IQ_COLOR }}
          aria-hidden="true"
        >
          <path
            d="M3 15c3-5 6-5 9 0s6 5 9 0"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="1.75" fill="currentColor" />
        </svg>
      </span>
      <span className="flex items-center gap-2.5">
        <HorizonIQWordmark size="lg" />
        {showBeta && <BetaBadge />}
      </span>
    </Link>
  );
}

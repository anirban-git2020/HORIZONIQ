"use client";

import { clearAllHorizonIQClientState } from "@/lib/onboarding-bootstrap";
import { navigateOnboarding } from "@/lib/onboarding-nav";
import { cn } from "@/lib/utils";

export function StartFreshLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className
      )}
      onClick={() => {
        clearAllHorizonIQClientState();
        navigateOnboarding("/onboarding/welcome");
      }}
    >
      Start fresh
    </button>
  );
}

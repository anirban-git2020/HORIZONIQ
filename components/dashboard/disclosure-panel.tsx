"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export function DisclosurePanel({
  title,
  description,
  children,
  defaultOpen = false,
  onExpanded,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onExpanded?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = (): void => {
    setOpen((wasOpen) => {
      const next = !wasOpen;
      if (next) onExpanded?.();
      return next;
    });
  };

  return (
    <FadeIn>
      <div className="hairline-b border-b border-border/60">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-foreground md:py-6"
          aria-expanded={open}
        >
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </p>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <ChevronDown
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-premium",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <div className="border-t border-border/50 pb-8 pt-6 md:pb-10">
            {children}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

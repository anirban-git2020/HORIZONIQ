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
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <FadeIn>
      <div className="rounded-xl border border-border/80 bg-card/50">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
          aria-expanded={open}
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <ChevronDown
            className={cn(
              "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <div className="border-t border-border/60 px-5 pb-5 pt-4 md:px-6 md:pb-6">
            {children}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

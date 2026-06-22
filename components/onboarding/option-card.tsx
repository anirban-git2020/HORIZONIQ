"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface OptionCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  tagline?: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({
  icon: Icon,
  label,
  description,
  tagline,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "group relative flex h-full w-full flex-col rounded-xl border bg-card p-6 text-left",
        "shadow-[0_1px_2px_hsl(222_47%_11%/0.04)]",
        "transition-colors duration-300",
        "hover:border-primary/30 hover:shadow-premium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary/60 ring-1 ring-primary/25"
          : "border-border/70"
      )}
    >
      <motion.span
        className="absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full border"
        animate={{
          borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
          backgroundColor: selected ? "hsl(var(--primary))" : "transparent",
        }}
      >
        <Check
          className={cn(
            "h-3 w-3 transition-opacity",
            selected ? "text-primary-foreground opacity-100" : "opacity-0"
          )}
        />
      </motion.span>

      <span
        className={cn(
          "mb-5 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300",
          selected
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-border/60 bg-secondary/50 text-muted-foreground group-hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="text-base font-semibold tracking-tight">{label}</span>
      {tagline && (
        <span className="mt-1 text-sm font-medium text-primary">{tagline}</span>
      )}
      <span className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </span>
    </motion.button>
  );
}

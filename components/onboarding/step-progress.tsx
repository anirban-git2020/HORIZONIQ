"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = ["Role", "Region", "Interests"] as const;

export function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isDone = step < current;
        const isActive = step === current;
        return (
          <li key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <motion.span
                className="relative flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold"
                animate={{
                  borderColor: isActive
                    ? "hsl(var(--primary))"
                    : isDone
                      ? "hsl(var(--success) / 0.4)"
                      : "hsl(var(--border))",
                  backgroundColor: isActive
                    ? "hsl(var(--primary))"
                    : isDone
                      ? "hsl(var(--success) / 0.1)"
                      : "hsl(var(--card))",
                  color: isActive
                    ? "hsl(var(--primary-foreground))"
                    : isDone
                      ? "hsl(var(--success))"
                      : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.3 }}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : step}
              </motion.span>
              <span
                className={
                  isActive
                    ? "hidden text-sm font-medium text-foreground sm:inline"
                    : "hidden text-sm text-muted-foreground sm:inline"
                }
              >
                {label}
              </span>
            </div>
            {step < STEPS.length && (
              <motion.span
                className="mx-2 h-px w-6 sm:mx-3 sm:w-12"
                animate={{
                  backgroundColor: isDone
                    ? "hsl(var(--success) / 0.4)"
                    : "hsl(var(--border))",
                }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

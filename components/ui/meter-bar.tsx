"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface MeterBarProps {
  value: number;
  tone?: "primary" | "success" | "warning";
  className?: string;
  animate?: boolean;
}

const toneMap: Record<NonNullable<MeterBarProps["tone"]>, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
};

export function MeterBar({
  value,
  tone = "primary",
  className,
  animate = true,
}: MeterBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const [width, setWidth] = useState(animate ? 0 : clamped);

  useEffect(() => {
    if (!animate) {
      setWidth(clamped);
      return;
    }
    const t = setTimeout(() => setWidth(clamped), 120);
    return () => clearTimeout(t);
  }, [clamped, animate]);

  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-secondary/80",
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full", toneMap[tone])}
        initial={false}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

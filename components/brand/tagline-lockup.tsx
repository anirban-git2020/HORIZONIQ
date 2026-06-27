"use client";

import { motion } from "framer-motion";

import { TAGLINE_LINES } from "@/lib/copy";
import { DURATION_SLOW, EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TaglineSize = "sm" | "md" | "lg";

const sizeClasses: Record<TaglineSize, string> = {
  sm: "space-y-1",
  md: "space-y-1.5 md:space-y-2",
  lg: "space-y-2 md:space-y-3",
};

const lineClasses: Record<TaglineSize, string> = {
  sm: "tagline-line text-lg md:text-xl",
  md: "tagline-line",
  lg: "tagline-line text-2xl md:text-3xl",
};

interface TaglineLockupProps {
  size?: TaglineSize;
  animated?: boolean;
  className?: string;
}

export function TaglineLockup({
  size = "md",
  animated = false,
  className,
}: TaglineLockupProps) {
  return (
    <div className={cn(sizeClasses[size], className)} aria-label="Observe. Predict. Lead.">
      {TAGLINE_LINES.map((line, index) =>
        animated ? (
          <motion.p
            key={line}
            className={lineClasses[size]}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION_SLOW,
              delay: 0.45 + index * 0.16,
              ease: EASE_PREMIUM,
            }}
          >
            {line}
          </motion.p>
        ) : (
          <p key={line} className={lineClasses[size]}>
            {line}
          </p>
        )
      )}
    </div>
  );
}

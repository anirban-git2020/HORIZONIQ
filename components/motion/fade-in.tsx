"use client";

import { motion, type Variants } from "framer-motion";

import { DURATION_NORMAL, EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Animate on mount instead of waiting for scroll into view. Use on onboarding steps. */
  immediate?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = DURATION_NORMAL,
  immediate = false,
}: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={immediate ? undefined : { once: true, margin: "-48px" }}
      variants={fadeUp}
      transition={{ duration, delay, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  /** Animate on mount instead of waiting for scroll into view. Use on onboarding grids. */
  immediate?: boolean;
}

export function Stagger({
  children,
  className,
  stagger = 0.05,
  immediate = false,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={immediate ? undefined : { once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: EASE_PREMIUM },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type LandingSceneProps = {
  /** Stable key per scene — drives the enter/exit transition. */
  sceneKey: string;
  children: ReactNode;
  /**
   * Immersive layer slot. Rendered behind content, full-bleed.
   * Intentionally empty today — a future Immersive Intelligence Layer
   * (3D / WebGL) mounts here WITHOUT changing this component hierarchy.
   */
  background?: ReactNode;
  className?: string;
};

/**
 * Cinematic full-bleed scene container. Calm fade + slide only.
 * Presentation only — holds no onboarding state.
 */
export function LandingScene({
  sceneKey,
  children,
  background,
  className,
}: LandingSceneProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      key={sceneKey}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
      transition={{ duration: reduced ? 0.16 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex min-h-dvh w-full flex-col overflow-hidden",
        className
      )}
    >
      {/* Future Immersive Intelligence Layer mounts here. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {background}
      </div>

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </motion.section>
  );
}

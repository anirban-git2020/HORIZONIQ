"use client";

import { useEffect, useRef } from "react";

import { useFocusModeOptional } from "@/components/exchange/focus-mode-context";
import { IntelligenceFieldEngine } from "@/lib/background/intelligence-field-engine";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type LivingIntelligenceFieldProps = {
  className?: string;
};

/**
 * Living Intelligence Field — Epic 5.
 * Epic 7: softly illuminates behind the focused Intelligence Signal.
 */
export function LivingIntelligenceField({ className }: LivingIntelligenceFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<IntelligenceFieldEngine | null>(null);
  const reducedMotion = useReducedMotion();
  const focusMode = useFocusModeOptional();
  const focusAnchor = focusMode?.focusAnchor ?? null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new IntelligenceFieldEngine(canvas, { frozen: reducedMotion });
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    engineRef.current?.setConfig({
      frozen: reducedMotion,
      focusGlow: focusAnchor,
    });
  }, [reducedMotion, focusAnchor]);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-0", className)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

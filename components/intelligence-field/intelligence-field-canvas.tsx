"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { IntelligenceFieldErrorBoundary } from "@/components/intelligence-field/intelligence-field-error-boundary";
import { IntelligenceFieldFallback } from "@/components/intelligence-field/intelligence-field-fallback";
import { IntelligenceFieldOverlay } from "@/components/intelligence-field/intelligence-field-overlay";
import {
  FIELD_INTENSITY,
  type IntelligenceFieldMode,
  type IntelligenceFieldVariant,
} from "@/components/intelligence-field/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { isWebGLAvailable } from "@/lib/intelligence-field/safe-webgl";
import {
  NEUTRAL_FIELD_PARAMS,
  type IntelligenceFieldParams,
} from "@/lib/intelligence-field/params";
import { cn } from "@/lib/utils";

const LivingIntelligenceCore = dynamic(
  () =>
    import("@/components/intelligence-field/living-intelligence-core").then(
      (mod) => mod.LivingIntelligenceCore
    ),
  {
    ssr: false,
    loading: () => null,
  }
);

export type { IntelligenceFieldMode, IntelligenceFieldVariant };

function resolveMode(
  mode: IntelligenceFieldMode,
  variant: IntelligenceFieldVariant
): "css" | "webgl" {
  if (mode === "css") return "css";
  if (mode === "webgl") return "webgl";
  return variant === "welcome" ? "webgl" : "css";
}

interface IntelligenceFieldCanvasProps {
  params?: IntelligenceFieldParams;
  variant?: IntelligenceFieldVariant;
  mode?: IntelligenceFieldMode;
  className?: string;
  intensity?: number;
  paused?: boolean;
}

export function IntelligenceFieldCanvas({
  params = NEUTRAL_FIELD_PARAMS,
  variant = "ambient",
  mode = "auto",
  className,
  intensity: intensityOverride,
  paused = false,
}: IntelligenceFieldCanvasProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [webglOk, setWebglOk] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const resolvedMode = resolveMode(mode, variant);
  const wantsWebgl = resolvedMode === "webgl";

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setWebglOk(isWebGLAvailable());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const intensity =
    (intensityOverride ?? FIELD_INTENSITY[variant]) * (paused ? 0.35 : 1);

  const useCss =
    !ready || reducedMotion || !wantsWebgl || !webglOk || webglFailed;

  if (useCss) {
    return (
      <>
        <IntelligenceFieldFallback className={className} variant={variant} />
        <IntelligenceFieldOverlay variant={variant} />
      </>
    );
  }

  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      <IntelligenceFieldFallback className="absolute inset-0" variant={variant} />
      <IntelligenceFieldErrorBoundary
        variant={variant}
        className={className}
        onError={() => setWebglFailed(true)}
      >
        <LivingIntelligenceCore
          params={params}
          variant={variant}
          intensity={intensity}
          paused={paused}
        />
      </IntelligenceFieldErrorBoundary>
      <IntelligenceFieldOverlay variant={variant} />
    </div>
  );
}

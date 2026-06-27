"use client";

import { IntelligenceFieldCanvas } from "@/components/intelligence-field/intelligence-field-canvas";
import type { IntelligenceFieldMode } from "@/components/intelligence-field/types";
import { useIntelligenceFieldParams } from "@/hooks/use-intelligence-field-params";
import type { IntelligenceFieldParams } from "@/lib/intelligence-field/params";
import type { SignalView } from "@/lib/types";
import { cn } from "@/lib/utils";

import type { IntelligenceFieldVariant } from "@/components/intelligence-field/types";

interface IntelligenceFieldLayerProps {
  variant?: IntelligenceFieldVariant;
  mode?: IntelligenceFieldMode;
  className?: string;
  params?: IntelligenceFieldParams;
  signals?: SignalView[];
  intensity?: number;
  paused?: boolean;
}

/** Page-level wrapper for the Living Intelligence Core. */
export function IntelligenceFieldLayer({
  variant = "ambient",
  mode = "auto",
  className,
  params: paramsProp,
  signals,
  intensity,
  paused,
}: IntelligenceFieldLayerProps) {
  const computed = useIntelligenceFieldParams(signals);
  const params = paramsProp ?? computed;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <IntelligenceFieldCanvas
        params={params}
        variant={variant}
        mode={mode}
        intensity={intensity}
        paused={paused}
      />
    </div>
  );
}

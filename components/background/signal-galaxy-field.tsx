"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { IntelligenceFieldErrorBoundary } from "@/components/intelligence-field/intelligence-field-error-boundary";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { isWebGLAvailable } from "@/lib/intelligence-field/safe-webgl";
import { cn } from "@/lib/utils";

/**
 * Signal Galaxy Field — the Milky Way background for the Intelligence Exchange.
 * A WebGL GPU-particle galaxy with an HDR bloom pass (Three built-in addons,
 * no new deps). Reuses the field's WebGL guard + error boundary. When WebGL is
 * unavailable or reduced-motion is on, a calm static CSS galaxy stands in.
 *
 * Readability is protected structurally: a deep-space wash sits behind the
 * stars, and a scrim over the top keeps the reading column and tiles legible.
 */
type SignalGalaxyFieldProps = { className?: string };

const SignalGalaxyCore = dynamic(
  () => import("@/components/background/signal-galaxy-core").then((m) => m.SignalGalaxyCore),
  { ssr: false, loading: () => null }
);

const SPACE =
  "radial-gradient(120% 90% at 50% 40%, #0b1330 0%, #070b1a 46%, #03040a 100%)";

// static stand-in: a soft warm core glow over the deep-space wash
const CORE_FALLBACK =
  "radial-gradient(42% 24% at 50% 42%, rgba(255,226,170,0.30), rgba(150,190,255,0.07) 55%, transparent 76%)";

// Readability veil, professional + balanced:
//  1) a strong left-column gradient so the hero text sits over calm space,
//  2) a vignette centred on the core (centre-right) that clears its glow,
//  3) a vertical veil lifting the top (headline) and darkening the tile region.
const SCRIM =
  "linear-gradient(90deg, rgba(4,5,11,0.80) 0%, rgba(4,5,11,0.52) 26%, rgba(4,5,11,0.12) 48%, rgba(4,5,11,0) 62%)," +
  "radial-gradient(140% 110% at 64% 46%, rgba(4,5,11,0) 38%, rgba(4,5,11,0.34) 76%, rgba(4,5,11,0.60) 100%)," +
  "linear-gradient(180deg, rgba(4,5,11,0.34) 0%, rgba(4,5,11,0) 22%, rgba(4,5,11,0) 58%, rgba(4,5,11,0.84) 100%)";

export function SignalGalaxyField({ className }: SignalGalaxyFieldProps) {
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
  }, []);

  const useWebgl = webgl === true && !reducedMotion;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none fixed inset-0 z-0", className)}>
      <div className="absolute inset-0" style={{ background: SPACE }} />

      {useWebgl ? (
        <IntelligenceFieldErrorBoundary variant="ambient" onError={() => setWebgl(false)}>
          <SignalGalaxyCore />
        </IntelligenceFieldErrorBoundary>
      ) : (
        <div className="absolute inset-0" style={{ background: CORE_FALLBACK }} />
      )}

      <div className="absolute inset-0" style={{ background: SCRIM }} />
    </div>
  );
}

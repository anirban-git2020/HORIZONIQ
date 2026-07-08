"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { IntelligencePulseBriefPanel } from "@/components/exchange/intelligence-pulse-brief";
import { PulseTileSummary } from "@/components/exchange/intelligence-pulse-tile";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useLandingJourney } from "@/hooks/use-landing-journey";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import {
  getPersonalizedBrief,
  journeyToPreferences,
} from "@/lib/exchange/personalized-pulse";
import { getPulseBrief } from "@/lib/exchange/pulse-brief-data";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";
import { cn } from "@/lib/utils";

type FocusOverlayProps = {
  signal: IntelligencePulseTile;
  onClose: () => void;
};

type OverlayPhase = "entering" | "open" | "exiting";

const MOTION_MS = 260;

/**
 * Independent focus layer — dashboard stays static; brief renders here only.
 */
export function FocusOverlay({ signal, onClose }: FocusOverlayProps) {
  const reducedMotion = useReducedMotion();
  const { journey } = useLandingJourney();
  const dialogRef = useRef<HTMLDivElement>(null);
  const brief =
    getPersonalizedBrief(signal.id, journeyToPreferences(journey)) ??
    getPulseBrief(signal.id);
  const briefPanelId = `pulse-brief-${signal.id}`;
  const headingId = `pulse-heading-${signal.id}`;
  const isHero = signal.tier === "hero";
  const isFeatured = signal.tier === "featured";

  const [phase, setPhase] = useState<OverlayPhase>(reducedMotion ? "open" : "entering");

  useScrollLock(true);
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    if (reducedMotion) return;
    const frame = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const requestClose = useCallback(() => {
    if (reducedMotion) {
      onClose();
      return;
    }
    setPhase("exiting");
    window.setTimeout(onClose, MOTION_MS);
  }, [onClose, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
  }, [signal.id]);

  const isVisible = phase === "open";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      {/* Soft veil — the Field recedes so the brief holds full attention. */}
      <div
        aria-hidden="true"
        onPointerDown={requestClose}
        className={cn(
          "absolute inset-0 bg-background/70 backdrop-blur-[2px]",
          !reducedMotion &&
            "transition-opacity duration-[260ms] ease-out motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={brief ? briefPanelId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex w-full max-h-[88vh] flex-col overflow-y-auto overscroll-contain rounded-2xl border border-border/50",
          "bg-card/70 shadow-[0_24px_80px_-24px_rgba(0,197,255,0.25)] backdrop-blur-md outline-none",
          "max-w-[100vw] sm:max-w-[90vw] lg:max-w-[920px]",
          "p-6 md:p-8 [-webkit-overflow-scrolling:touch]",
          !reducedMotion &&
            cn(
              "transition-[opacity,transform] duration-[260ms] ease-out motion-reduce:transition-none",
              isVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-[0.98] opacity-0"
            )
        )}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close brief"
          className={cn(
            "sticky top-0 z-20 ml-auto -mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            "bg-secondary/30 text-muted-foreground/80 backdrop-blur-sm",
            "transition-colors duration-200 ease-out hover:bg-secondary/50 hover:text-foreground motion-reduce:transition-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <PulseTileSummary
          tile={signal}
          isHero={isHero}
          isFeatured={isFeatured}
          headingId={headingId}
          interactive={false}
          compact
        />

        {brief && (
          <div id={briefPanelId}>
            <IntelligencePulseBriefPanel brief={brief} className="px-0" compact />
          </div>
        )}
      </div>
    </div>
  );
}

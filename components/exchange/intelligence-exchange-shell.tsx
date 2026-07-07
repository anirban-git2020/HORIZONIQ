"use client";

import { useCallback, useState } from "react";

import { FocusOverlay } from "@/components/focus/FocusOverlay";
import { LivingIntelligenceField } from "@/components/background/living-intelligence-field";
import { ExchangeHeader } from "@/components/exchange/exchange-header";
import { IntelligenceHero } from "@/components/exchange/intelligence-hero";
import { TickerPlaceholder } from "@/components/exchange/ticker-placeholder";
import { WorldIntelligencePulse } from "@/components/exchange/world-intelligence-pulse";
import { SiteFooter } from "@/components/layout/site-footer";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";
import { cn } from "@/lib/utils";

/**
 * Intelligence Exchange shell — dashboard stays static; focus is an overlay layer.
 */
export function IntelligenceExchangeShell() {
  const [selectedSignal, setSelectedSignal] = useState<IntelligencePulseTile | null>(null);

  const handleSignalSelected = useCallback((signal: IntelligencePulseTile) => {
    setSelectedSignal(signal);
  }, []);

  const handleCloseFocus = useCallback(() => {
    setSelectedSignal(null);
  }, []);

  const isFocusOpen = selectedSignal !== null;

  return (
    <div className="relative min-h-dvh bg-background">
      <LivingIntelligenceField />

      <div
        className={cn(
          "transition-opacity duration-[220ms] ease-out motion-reduce:transition-none",
          isFocusOpen && "pointer-events-none opacity-[0.35]"
        )}
        aria-hidden={isFocusOpen ? true : undefined}
      >
        <ExchangeHeader />
        <TickerPlaceholder />

        <main className="relative z-10">
          <IntelligenceHero />
          <WorldIntelligencePulse onSignalSelected={handleSignalSelected} />
        </main>

        <SiteFooter />
      </div>

      {selectedSignal && (
        <FocusOverlay signal={selectedSignal} onClose={handleCloseFocus} />
      )}
    </div>
  );
}

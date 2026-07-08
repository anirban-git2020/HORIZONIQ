"use client";

import { useMemo } from "react";

import { useLandingJourney } from "@/hooks/use-landing-journey";
import {
  buildPersonalizedTiles,
  journeyToPreferences,
} from "@/lib/exchange/personalized-pulse";
import { getPulseTilesByTier } from "@/lib/exchange/pulse-mock-data";
import type { IntelligencePulseTile } from "@/lib/exchange/pulse-mock-data";

type PulseTiles = {
  hero: IntelligencePulseTile | undefined;
  featured: IntelligencePulseTile[];
  compact: IntelligencePulseTile[];
};

/**
 * Chooses the Pulse's data source, hydration-safe:
 * - Non-onboarded (no interests) or pre-hydration → curated editorial front page.
 * - Onboarded (has interests) → engine-personalized Signals for their profile.
 * Falls back to the editorial set if the engine yields nothing.
 */
export function usePersonalizedPulse(): PulseTiles {
  const { hydrated, journey } = useLandingJourney();

  return useMemo<PulseTiles>(() => {
    if (!hydrated || journey.selectedInterests.length === 0) {
      return getPulseTilesByTier();
    }

    const personalized = buildPersonalizedTiles(journeyToPreferences(journey));
    const isEmpty =
      !personalized.hero &&
      personalized.featured.length === 0 &&
      personalized.compact.length === 0;

    return isEmpty ? getPulseTilesByTier() : personalized;
  }, [hydrated, journey]);
}

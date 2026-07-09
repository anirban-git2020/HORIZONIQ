"use client";

import { useMemo } from "react";

import { useLandingJourney } from "@/hooks/use-landing-journey";
import {
  buildPersonalizedTiles,
  journeyToPreferences,
} from "@/lib/exchange/personalized-pulse";
import type { PersonalizedPulse } from "@/lib/exchange/personalized-pulse";
import { getPulseTilesByTier } from "@/lib/exchange/pulse-mock-data";

/**
 * Chooses the Pulse's data, hydration-safe:
 * - Non-onboarded (no interests) or pre-hydration → the full editorial front page.
 * - Onboarded → only Signals matching chosen interests (main), plus adjacent
 *   Signals as `related`. Nothing irrelevant is padded into the main grid.
 */
export function usePersonalizedPulse(): PersonalizedPulse {
  const { hydrated, journey } = useLandingJourney();

  return useMemo<PersonalizedPulse>(() => {
    if (!hydrated || journey.selectedInterests.length === 0) {
      return { ...getPulseTilesByTier(), related: [] };
    }
    return buildPersonalizedTiles(journeyToPreferences(journey));
  }, [hydrated, journey]);
}

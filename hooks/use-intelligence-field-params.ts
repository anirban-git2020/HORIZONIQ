"use client";

import { useMemo } from "react";

import {
  computeIntelligenceFieldParams,
  NEUTRAL_FIELD_PARAMS,
  type IntelligenceFieldParams,
} from "@/lib/intelligence-field/params";
import { usePreferences } from "@/lib/preferences";
import type { SignalView } from "@/lib/types";

export function useIntelligenceFieldParams(
  signals?: SignalView[]
): IntelligenceFieldParams {
  const { preferences, hydrated } = usePreferences();

  return useMemo(() => {
    if (!hydrated) return NEUTRAL_FIELD_PARAMS;
    return computeIntelligenceFieldParams(preferences, signals);
  }, [hydrated, preferences, signals]);
}

/**
 * Intelligence Brief shape + adapter.
 *
 * A Brief is a presentation projection of a canonical domain Signal, keyed by
 * id. Content originates entirely from `@/lib/domain`; this module only maps a
 * Signal into the Brief shape. The Brief is identical for every user — it is
 * editorial intelligence, never a personalized claim.
 */

import { getSignalRepository } from "@/lib/domain/live-repository";
import type { Signal } from "@/lib/domain";

export type BriefEvidenceStat = {
  label: string;
  change: string;
};

export type IntelligencePulseBrief = {
  whyItMatters: string;
  evidence: BriefEvidenceStat[];
  drivers: string[];
  relatedSignals: string[];
  forecast: string;
};

function toBrief(signal: Signal): IntelligencePulseBrief {
  const titleOf = (id: string) =>
    getSignalRepository().getById(id)?.identity.title ?? id;
  return {
    whyItMatters: signal.reading.brief,
    evidence: signal.evidence.sources.map((source) => ({
      label: source.label,
      change: source.delta ?? "",
    })),
    drivers: [...signal.relationships.relatedCompanies].slice(0, 4),
    relatedSignals: signal.relationships.relatedSignals.map(titleOf).slice(0, 4),
    forecast: signal.forecast.forecast ?? "",
  };
}

export function getPulseBrief(tileId: string): IntelligencePulseBrief | undefined {
  const signal = getSignalRepository().getById(tileId);
  return signal ? toBrief(signal) : undefined;
}

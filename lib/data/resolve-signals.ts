import type {
  BriefingRecord,
  SignalBriefingState,
  SignalCatalogRecord,
  SignalRecord,
} from "@/lib/data/schemas";

export function mergeSignalRecord(
  catalog: SignalCatalogRecord,
  state: SignalBriefingState
): SignalRecord {
  return {
    id: catalog.id,
    name: catalog.name,
    category: catalog.category,
    interest: catalog.interest,
    currentState: state.currentStateOverride ?? catalog.defaultCurrentState,
    momentum: state.momentum,
    confidence: state.confidence,
    previousMomentum: state.previousMomentum,
    previousConfidence: state.previousConfidence,
    change: state.change,
    explanation: catalog.explanation,
    recommendedAction: catalog.recommendedAction,
    sources: state.sources,
    affectedIndustries: catalog.affectedIndustries,
    affectedRoles: catalog.affectedRoles,
    momentumDrivers: state.momentumDrivers,
    confidenceFactors: state.confidenceFactors,
    relatedSkills: catalog.relatedSkills,
    relatedOpportunities: catalog.relatedOpportunities,
  };
}

export function resolveSignalsFromBriefing(
  catalog: SignalCatalogRecord[],
  briefing: BriefingRecord
): SignalRecord[] {
  const catalogById = new Map(catalog.map((entry) => [entry.id, entry]));

  return briefing.signalStates.flatMap((state) => {
    const entry = catalogById.get(state.signalId);
    if (!entry || entry.status !== "active") return [];
    return [mergeSignalRecord(entry, state)];
  });
}

/**
 * Intelligence Domain — public surface.
 *
 * The single entry point for the domain layer. Consumers import from
 * "@/lib/domain", never from individual files, so the internal structure can
 * evolve without touching call sites.
 */

export type {
  Signal,
  SignalIdentity,
  SignalClassification,
  SignalGeography,
  SignalEvidence,
  SignalMomentum,
  SignalForecast,
  SignalRelationships,
  SignalPersonalization,
  SignalPresentation,
  SignalReading,
  SignalVersioning,
  SignalStatus,
  Trajectory,
  Freshness,
  ConfidenceTier,
} from "@/lib/domain/signal";

export type { Source, SourceRef, SourceType } from "@/lib/domain/source";

export type {
  SignalRelationship,
  RelationshipKind,
} from "@/lib/domain/relationship";

export type {
  SignalRepository,
  SignalQuery,
  EvidenceProvider,
  RelationshipProvider,
  ForecastProvider,
  PersonalizationProvider,
  PersonalizationContext,
} from "@/lib/domain/repositories";

export { MOCK_SIGNALS, mockSignalRepository } from "@/lib/domain/mock-intelligence";

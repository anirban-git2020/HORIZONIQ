/**
 * Service contracts for the Intelligence Layer.
 *
 * These are interfaces only — no external integrations. A real backend later
 * *implements* these; consumers depend on the contract, never the source. That
 * is the seam that lets us "replace the repository, not the components."
 */

import type { InterestId, RegionId, RoleId } from "@/lib/types";
import type { Signal, SignalForecast } from "@/lib/domain/signal";
import type { SignalRelationship } from "@/lib/domain/relationship";
import type { Source } from "@/lib/domain/source";

export type SignalQuery = {
  readonly interests?: readonly InterestId[];
  readonly regions?: readonly RegionId[];
  readonly roles?: readonly RoleId[];
  readonly limit?: number;
};

/** The single access point for Signals. Everything reads through this. */
export interface SignalRepository {
  getAll(): readonly Signal[];
  getById(id: string): Signal | undefined;
  getBySlug(slug: string): Signal | undefined;
  query(query: SignalQuery): readonly Signal[];
}

/** Provenance behind a Signal's claims (Evidence Engine). */
export interface EvidenceProvider {
  getSources(signalId: string): readonly Source[];
}

/** Typed connections between Signals (Relationship Engine). */
export interface RelationshipProvider {
  getRelationships(signalId: string): readonly SignalRelationship[];
  getRelatedSignalIds(signalId: string): readonly string[];
}

/** Projections of momentum into likely futures (Forecast Engine). */
export interface ForecastProvider {
  getForecast(signalId: string): SignalForecast | undefined;
}

export type PersonalizationContext = {
  readonly role: RoleId | null;
  readonly region: RegionId | null;
  readonly interests: readonly InterestId[];
};

/** Adaptation of intelligence to the individual professional. */
export interface PersonalizationProvider {
  rank(
    signals: readonly Signal[],
    context: PersonalizationContext
  ): readonly Signal[];
}

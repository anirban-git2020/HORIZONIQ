/**
 * Signal — the canonical intelligence entity of HorizonIQ.
 *
 * Everything the product displays as intelligence originates from this model.
 * It is grouped by concern (Identity, Classification, … Versioning) so each
 * concern can evolve independently, and it is deeply `readonly`: a Signal is an
 * observation, not a mutable record. Advanced fields (velocity, forecast,
 * relationships) are optional — the model degrades gracefully when a provider
 * has not yet supplied them, rather than fabricating completeness.
 *
 * Vocabulary types (RoleId, RegionId, InterestId) are reused from lib/types —
 * one concept, one representation.
 */

import type { InterestId, RegionId, RoleId } from "@/lib/types";
import type { SourceRef } from "@/lib/domain/source";

export type SignalStatus = "draft" | "active" | "archived";
export type Trajectory = "accelerating" | "steady" | "emerging" | "cooling";
export type Freshness = "live" | "recent" | "stale";
export type ConfidenceTier = "high" | "medium" | "low";

export type SignalIdentity = {
  readonly id: string;
  readonly slug: string;
  /** Short name, e.g. "Agentic AI". */
  readonly title: string;
  /** Editorial one-line, e.g. "Software is becoming autonomous." */
  readonly headline: string;
  /** Supporting sentence beneath the headline. */
  readonly summary: string;
  readonly description?: string;
};

export type SignalClassification = {
  readonly domain: string;
  readonly subcategory?: string;
  readonly tags: readonly string[];
  readonly technologyType?: string;
  /** Ties the Signal to the personalization vocabulary. */
  readonly interest: InterestId;
};

export type SignalGeography = {
  readonly primaryRegion?: RegionId;
  readonly secondaryRegions: readonly RegionId[];
  readonly globalImpact: boolean;
};

export type SignalEvidence = {
  readonly evidenceCount: number;
  readonly sources: readonly SourceRef[];
  /** ISO 8601 timestamp of the most recent observation. */
  readonly lastObserved: string;
  readonly freshness: Freshness;
  readonly confidence: ConfidenceTier;
};

export type SignalMomentum = {
  /** 0..100 momentum score. */
  readonly momentumScore: number;
  /** Rate of change; positive is rising. Optional until measured. */
  readonly velocity?: number;
  /** Change in velocity. Optional until measured. */
  readonly acceleration?: number;
  readonly trajectory: Trajectory;
};

export type SignalForecast = {
  readonly forecast?: string;
  readonly forecastConfidence?: ConfidenceTier;
  /** Human-readable horizon, e.g. "12 months". */
  readonly forecastWindow?: string;
};

export type SignalRelationships = {
  /** Ids of related Signals — graph-ready references, not embedded objects. */
  readonly relatedSignals: readonly string[];
  readonly relatedCompanies: readonly string[];
  readonly relatedTechnologies: readonly string[];
  readonly relatedIndustries: readonly string[];
};

export type SignalPersonalization = {
  readonly recommendedRoles: readonly RoleId[];
  readonly recommendedIndustries: readonly string[];
  readonly recommendedRegions: readonly RegionId[];
  readonly recommendedInterests: readonly InterestId[];
};

export type SignalPresentation = {
  readonly heroImage?: string;
  readonly icon?: string;
  readonly themeAccent?: string;
  readonly featured: boolean;
  /** Short forecast label shown on the tile, e.g. "Rapid Adoption". */
  readonly narrative?: string;
  /** Display sparkline series. */
  readonly sparkline?: readonly number[];
  /**
   * Dated momentum history for the trend chart — one point per pipeline run,
   * chronological. Real observations only; absent until change is measurable.
   */
  readonly momentumHistory?: readonly { readonly date: string; readonly value: number }[];
  /** How the editorial text was produced. Absent/"curated" = hand-authored. */
  readonly provenance?: "synthesized";
};

export type SignalReading = {
  /** Estimated read time in minutes. */
  readonly estimatedReadTime: number;
  readonly brief: string;
  readonly longBrief?: string;
};

export type SignalVersioning = {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
  readonly status: SignalStatus;
};

export type Signal = {
  readonly identity: SignalIdentity;
  readonly classification: SignalClassification;
  readonly geography: SignalGeography;
  readonly evidence: SignalEvidence;
  readonly momentum: SignalMomentum;
  readonly forecast: SignalForecast;
  readonly relationships: SignalRelationships;
  readonly personalization: SignalPersonalization;
  readonly presentation: SignalPresentation;
  readonly reading: SignalReading;
  readonly versioning: SignalVersioning;
};

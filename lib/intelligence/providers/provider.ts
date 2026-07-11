import type { SourceType } from "@/lib/domain/source";
import type { InterestId } from "@/lib/types";

/**
 * IntelligenceProvider — the isolated contract every evidence source implements
 * (GitHub, arXiv, technology news, patents, jobs, developer ecosystems, …).
 *
 * Providers know nothing about the domain `Signal` or the UI. They only collect
 * raw evidence for interests; the pipeline normalizes, dedupes, ranks, scores,
 * and generates Signals from their output. The Experience Layer never sees a
 * provider.
 *
 * Adding a source = one new implementation of this interface, added to the
 * registry. No consumer changes. Unconfigured providers (missing credentials)
 * report `isConfigured() === false` and are skipped — never treated as failed.
 *
 * The existing `lib/pipeline/ingest/*` collectors are the current concrete
 * implementations of this contract.
 */

export type ProviderStatus = "ok" | "stale" | "failed";

export type ProviderSample = {
  readonly title: string;
  readonly url: string;
  readonly score?: number;
};

export type ProviderInterestObservation = {
  readonly interestId: InterestId;
  /** Raw current volume/activity for this interest from this provider. */
  readonly value: number;
  readonly previous?: number;
  readonly samples: readonly ProviderSample[];
};

export type ProviderResult = {
  readonly providerId: string;
  readonly sourceType: SourceType;
  readonly status: ProviderStatus;
  readonly fetchedAt: string; // ISO 8601
  readonly error?: string;
  readonly observations: readonly ProviderInterestObservation[];
};

export interface IntelligenceProvider {
  readonly id: string;
  readonly sourceType: SourceType;
  /** Whether required credentials are present. Unconfigured providers are skipped. */
  isConfigured(): boolean;
  collect(interests: readonly InterestId[]): Promise<ProviderResult>;
}

/**
 * The set of providers the pipeline runs. Extensibility point: append a new
 * provider here. Isolation guarantee: the pipeline depends on this abstraction,
 * never on a concrete provider.
 */
export type ProviderRegistry = readonly IntelligenceProvider[];

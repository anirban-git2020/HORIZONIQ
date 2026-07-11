import type { Signal } from "@/lib/domain/signal";
import type { SignalQuery, SignalRepository } from "@/lib/domain/repositories";

/**
 * Builds a read-only SignalRepository over an in-memory Signal set. Shared by
 * the curated (mock) and live (pipeline) sources so there is exactly one
 * repository implementation — the source of the data is the only difference.
 */
export function createInMemorySignalRepository(
  signals: readonly Signal[]
): SignalRepository {
  const byId = new Map(signals.map((s) => [s.identity.id, s] as const));
  const bySlug = new Map(signals.map((s) => [s.identity.slug, s] as const));
  return {
    getAll: () => signals,
    getById: (id) => byId.get(id),
    getBySlug: (slug) => bySlug.get(slug),
    query: ({ interests, limit }: SignalQuery) => {
      let result = signals;
      if (interests && interests.length > 0) {
        const wanted = new Set(interests);
        result = result.filter((s) => wanted.has(s.classification.interest));
      }
      return typeof limit === "number" ? result.slice(0, limit) : result;
    },
  };
}

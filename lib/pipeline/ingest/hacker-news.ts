import { INTEREST_QUERIES } from "@/lib/pipeline/config/interest-queries";
import type {
  InterestObservation,
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import {
  getComparisonRanges,
  toUnixSeconds,
} from "@/lib/pipeline/utils/periods";
import { fetchJson } from "@/lib/pipeline/utils/http";

const SOURCE: PipelineSourceId = "hacker-news";
const ALGOLIA_BASE = "https://hn.algolia.com/api/v1";
const FIREBASE_BASE = "https://hacker-news.firebaseio.com/v0";

interface AlgoliaHit {
  title: string;
  url?: string;
  points: number;
  objectID: string;
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
  nbHits: number;
}

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  type: string;
}

function buildMetrics(current: number, previous: number | null) {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}

function titleMatchesKeywords(title: string, keywords: string[]): boolean {
  const lower = title.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

async function searchAlgolia(
  query: string,
  sinceUnix: number
): Promise<AlgoliaResponse> {
  const params = new URLSearchParams({
    query,
    tags: "story",
    hitsPerPage: "20",
    numericFilters: `created_at_i>${sinceUnix}`,
  });
  return fetchJson<AlgoliaResponse>(
    `${ALGOLIA_BASE}/search?${params.toString()}`
  );
}

async function fetchTopStoryPool(limit = 100): Promise<HNItem[]> {
  const ids = await fetchJson<number[]>(`${FIREBASE_BASE}/topstories.json`);
  const slice = ids.slice(0, limit);
  const items = await Promise.all(
    slice.map(async (id) => {
      try {
        return await fetchJson<HNItem>(`${FIREBASE_BASE}/item/${id}.json`);
      } catch {
        return null;
      }
    })
  );
  return items.filter(
    (item): item is HNItem => item !== null && item.type === "story"
  );
}

export async function ingestHackerNews(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const currentSince = toUnixSeconds(current.start);
  const previousSince = toUnixSeconds(previous.start);
  const previousEnd = toUnixSeconds(previous.end);
  const interests: SourceObservation["interests"] = {};

  try {
    const topStoryPool = await fetchTopStoryPool(100);

    for (const config of INTEREST_QUERIES) {
      const previousParams = new URLSearchParams({
        query: config.hackerNews.algoliaQuery,
        tags: "story",
        hitsPerPage: "0",
        numericFilters: `created_at_i>${previousSince},created_at_i<${previousEnd}`,
      });

      const [currentSearch, previousSearch] = await Promise.all([
        searchAlgolia(config.hackerNews.algoliaQuery, currentSince),
        fetchJson<AlgoliaResponse>(
          `${ALGOLIA_BASE}/search?${previousParams.toString()}`
        ),
      ]);

      const topMatches = topStoryPool.filter((item) =>
        titleMatchesKeywords(item.title, config.hackerNews.titleKeywords)
      );

      const currentCount = currentSearch.nbHits;
      const previousCount = previousSearch.nbHits;

      const samples = [
        ...currentSearch.hits.slice(0, 3).map((hit) => ({
          title: hit.title,
          url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
          score: hit.points,
        })),
        ...topMatches.slice(0, 2).map((item) => ({
          title: item.title,
          url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
          score: item.score,
        })),
      ].slice(0, 5);

      const observation: InterestObservation = {
        interestId: config.interestId,
        metrics: buildMetrics(currentCount, previousCount),
        samples,
      };
      interests[config.interestId] = observation;
    }

    return { source: SOURCE, status: "ok", fetchedAt, interests };
  } catch (error) {
    return {
      source: SOURCE,
      status: "failed",
      fetchedAt,
      error: error instanceof Error ? error.message : "Unknown HN ingest error",
      interests,
    };
  }
}

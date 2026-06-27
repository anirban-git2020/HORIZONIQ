import { INTEREST_QUERIES } from "@/lib/pipeline/config/interest-queries";
import { GITHUB_SEARCH_QUERIES } from "@/lib/pipeline/config/github-queries";
import { requireGitHubToken } from "@/lib/pipeline/config/env";
import type {
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import { getComparisonRanges } from "@/lib/pipeline/utils/periods";
import { fetchJson, RateLimiter } from "@/lib/pipeline/utils/http";
import { buildMetrics } from "@/lib/pipeline/utils/metrics";

const SOURCE: PipelineSourceId = "github";
const GITHUB_API = "https://api.github.com/search/repositories";
const rateLimiter = new RateLimiter(2_200);

interface GitHubSearchResponse {
  total_count: number;
  items: Array<{
    full_name: string;
    html_url: string;
    stargazers_count: number;
    pushed_at: string;
  }>;
}

function toGithubDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** GitHub rejects unparenthesized OR queries with HTTP 422. */
function wrapOrQuery(baseQuery: string): string {
  return baseQuery.includes(" OR ") ? `(${baseQuery})` : baseQuery;
}

/** Pushed ranges cannot extend into the future. */
function capPushedEnd(end: Date): Date {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return end > today ? today : end;
}

function buildPeriodQuery(baseQuery: string, start: Date, end: Date): string {
  const pushedEnd = capPushedEnd(end);
  const pushed = `pushed:${toGithubDate(start)}..${toGithubDate(pushedEnd)}`;
  return `${wrapOrQuery(baseQuery)} stars:>10 ${pushed}`;
}

async function searchRepositories(
  query: string,
  token: string
): Promise<GitHubSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    sort: "updated",
    order: "desc",
    per_page: "3",
  });

  return rateLimiter.schedule(() =>
    fetchJson<GitHubSearchResponse>(`${GITHUB_API}?${params.toString()}`, {
      init: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
      retries: 2,
      timeoutMs: 30_000,
    })
  );
}

export async function ingestGitHub(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let failures = 0;
  let lastError: string | undefined;

  let token: string;
  try {
    token = requireGitHubToken();
  } catch (error) {
    return {
      source: SOURCE,
      status: "failed",
      fetchedAt,
      error: error instanceof Error ? error.message : "Missing GitHub token",
      interests: {},
    };
  }

  for (const config of INTEREST_QUERIES) {
    const baseQuery = GITHUB_SEARCH_QUERIES[config.interestId];
    if (!baseQuery) continue;

    try {
      const currentResult = await searchRepositories(
        buildPeriodQuery(baseQuery, current.start, current.end),
        token
      );
      const previousResult = await searchRepositories(
        buildPeriodQuery(baseQuery, previous.start, previous.end),
        token
      );

      interests[config.interestId] = {
        interestId: config.interestId,
        metrics: buildMetrics(
          currentResult.total_count,
          previousResult.total_count
        ),
        samples: currentResult.items.map((repo) => ({
          title: repo.full_name,
          url: repo.html_url,
          score: repo.stargazers_count,
        })),
      };
    } catch (error) {
      failures += 1;
      lastError =
        error instanceof Error ? error.message : "GitHub search failed";
    }
  }

  const successCount = Object.keys(interests).length;
  if (successCount >= INTEREST_QUERIES.length * 0.8) {
    return { source: SOURCE, status: "ok", fetchedAt, interests };
  }
  if (successCount >= INTEREST_QUERIES.length * 0.5) {
    return {
      source: SOURCE,
      status: "stale",
      fetchedAt,
      error: lastError ?? `${failures} interests failed`,
      interests,
    };
  }

  return {
    source: SOURCE,
    status: "failed",
    fetchedAt,
    error: lastError ?? "GitHub ingest failed",
    interests,
  };
}

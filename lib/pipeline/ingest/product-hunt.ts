import { INTEREST_QUERIES } from "@/lib/pipeline/config/interest-queries";
import { PRODUCT_HUNT_TOPIC_SLUGS } from "@/lib/pipeline/config/product-hunt-queries";
import { requireProductHuntToken } from "@/lib/pipeline/config/env";
import type {
  PipelineSourceId,
  SourceObservation,
} from "@/lib/pipeline/types";
import { getComparisonRanges } from "@/lib/pipeline/utils/periods";
import { fetchJson, RateLimiter } from "@/lib/pipeline/utils/http";
import { buildMetrics } from "@/lib/pipeline/utils/metrics";

const SOURCE: PipelineSourceId = "product-hunt";
const PH_GRAPHQL = "https://api.producthunt.com/v2/api/graphql";
const rateLimiter = new RateLimiter(1_100);

interface PHPostNode {
  name: string;
  tagline: string;
  votesCount: number;
  url: string;
}

interface PHPostsResponse {
  data?: {
    posts?: {
      totalCount: number;
      edges: Array<{ node: PHPostNode }>;
    };
  };
  errors?: Array<{ message: string }>;
}

function toPhDateTime(date: Date): string {
  return date.toISOString();
}

const POSTS_QUERY = `
  query TopicPostsInRange(
    $topic: String!
    $postedAfter: DateTime!
    $postedBefore: DateTime!
  ) {
    posts(
      topic: $topic
      postedAfter: $postedAfter
      postedBefore: $postedBefore
      order: VOTES
      first: 5
    ) {
      totalCount
      edges {
        node {
          name
          tagline
          votesCount
          url
        }
      }
    }
  }
`;

async function fetchTopicPosts(
  topicSlug: string,
  start: Date,
  end: Date,
  token: string
): Promise<{ count: number; samples: PHPostNode[] }> {
  return rateLimiter.schedule(async () => {
    const response = await fetchJson<PHPostsResponse>(PH_GRAPHQL, {
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: POSTS_QUERY,
          variables: {
            topic: topicSlug,
            postedAfter: toPhDateTime(start),
            postedBefore: toPhDateTime(end),
          },
        }),
      },
      retries: 2,
      timeoutMs: 30_000,
    });

    if (response.errors?.length) {
      throw new Error(response.errors.map((e) => e.message).join("; "));
    }

    const posts = response.data?.posts;
    return {
      count: posts?.totalCount ?? 0,
      samples: posts?.edges.map((edge) => edge.node) ?? [],
    };
  });
}

export async function ingestProductHunt(): Promise<SourceObservation> {
  const fetchedAt = new Date().toISOString();
  const { current, previous } = getComparisonRanges();
  const interests: SourceObservation["interests"] = {};
  let failures = 0;
  let lastError: string | undefined;

  let token: string;
  try {
    token = requireProductHuntToken();
  } catch (error) {
    return {
      source: SOURCE,
      status: "failed",
      fetchedAt,
      error: error instanceof Error ? error.message : "Missing Product Hunt token",
      interests: {},
    };
  }

  for (const config of INTEREST_QUERIES) {
    const topicSlug = PRODUCT_HUNT_TOPIC_SLUGS[config.interestId];
    if (!topicSlug) continue;

    try {
      const [currentResult, previousResult] = await Promise.all([
        fetchTopicPosts(topicSlug, current.start, current.end, token),
        fetchTopicPosts(topicSlug, previous.start, previous.end, token),
      ]);

      interests[config.interestId] = {
        interestId: config.interestId,
        metrics: buildMetrics(currentResult.count, previousResult.count),
        samples: currentResult.samples.map((post) => ({
          title: post.name,
          url: post.url,
          score: post.votesCount,
        })),
      };
    } catch (error) {
      failures += 1;
      lastError =
        error instanceof Error ? error.message : "Product Hunt query failed";
    }
  }

  const successCount = Object.keys(interests).length;
  if (successCount === INTEREST_QUERIES.length) {
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
    error: lastError ?? "Product Hunt ingest failed",
    interests,
  };
}

import { ingestArxiv } from "@/lib/pipeline/ingest/arxiv";
import { ingestGdelt } from "@/lib/pipeline/ingest/gdelt";
import { ingestGitHub } from "@/lib/pipeline/ingest/github";
import { ingestHackerNews } from "@/lib/pipeline/ingest/hacker-news";
import { ingestProductHunt } from "@/lib/pipeline/ingest/product-hunt";
import { ingestPubMed } from "@/lib/pipeline/ingest/pubmed";
import { ingestWikimedia } from "@/lib/pipeline/ingest/wikimedia";
import type { ObservationBundle, SourceObservation } from "@/lib/pipeline/types";
import {
  formatBriefingLabel,
  formatBriefingPeriod,
} from "@/lib/pipeline/utils/periods";

export interface IngestOptions {
  /** Re-use cached source data when a source fails on re-run. */
  previousBundle?: ObservationBundle | null;
}

export async function runPipelineIngest(
  options: IngestOptions = {}
): Promise<ObservationBundle> {
  const ingestedAt = new Date().toISOString();
  const period = formatBriefingPeriod();
  const periodLabel = formatBriefingLabel();

  const [hackerNews, arxiv, wikimedia, github, productHunt, pubmed, gdelt] =
    await Promise.all([
      ingestHackerNews(),
      ingestArxiv(),
      ingestWikimedia(),
      ingestGitHub(),
      ingestProductHunt(),
      ingestPubMed(),
      ingestGdelt(),
    ]);

  const sources = {
    "hacker-news": applyFallback(
      hackerNews,
      options.previousBundle?.sources["hacker-news"]
    ),
    arxiv: applyFallback(arxiv, options.previousBundle?.sources.arxiv),
    wikimedia: applyFallback(wikimedia, options.previousBundle?.sources.wikimedia),
    github: applyFallback(github, options.previousBundle?.sources.github),
    "product-hunt": applyFallback(
      productHunt,
      options.previousBundle?.sources["product-hunt"]
    ),
    pubmed: applyFallback(pubmed, options.previousBundle?.sources.pubmed),
    gdelt: applyFallback(gdelt, options.previousBundle?.sources.gdelt),
  };

  return {
    version: 1,
    ingestedAt,
    period,
    periodLabel,
    sources,
  };
}

function applyFallback(
  current: SourceObservation,
  previous?: SourceObservation
): SourceObservation {
  if (current.status === "failed" && previous?.status === "ok") {
    return { ...previous, status: "stale" };
  }
  return current;
}

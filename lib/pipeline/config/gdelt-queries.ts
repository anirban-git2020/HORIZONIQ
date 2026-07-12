import type { InterestId } from "@/lib/types";

/**
 * GDELT 2.0 DOC query terms — the global news-attention lens.
 *
 * Layer B domain provider. GDELT covers the non-developer interests the five
 * dev-centric sources cannot represent (arts, commerce, finance, venture
 * capital, supply chain, energy). It reports only these; the scorer skips it
 * elsewhere, so tech interests are unaffected.
 *
 * Query syntax: uppercase OR, quoted phrases, wrapped in parentheses. Terms are
 * aligned with each curated signal so live coverage tracks the same story.
 */
export interface GdeltQueryConfig {
  readonly interestId: InterestId;
  readonly label: string;
  readonly query: string;
}

export const GDELT_QUERIES: readonly GdeltQueryConfig[] = [
  {
    interestId: "arts",
    label: "Creative Economy",
    query: '("creator economy" OR "art market" OR "streaming royalties")',
  },
  {
    interestId: "commerce",
    label: "Retail Reinvention",
    query: '("retail media" OR "quick commerce" OR "ecommerce sales")',
  },
  {
    interestId: "finance",
    label: "Financial Markets",
    query: '("private credit" OR "interest rates" OR "bank lending")',
  },
  {
    interestId: "venture-capital",
    label: "Venture Capital",
    query: '("venture capital" OR "startup funding" OR "series A funding")',
  },
  {
    interestId: "supply-chain",
    label: "Supply Chain",
    query: '("supply chain" OR "shipping rates" OR "logistics disruption")',
  },
  {
    interestId: "energy",
    label: "Energy Transition",
    query: '("renewable energy" OR "grid storage" OR "energy transition")',
  },
];

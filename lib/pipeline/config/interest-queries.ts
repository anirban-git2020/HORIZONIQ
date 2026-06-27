import type { InterestId } from "@/lib/types";

export interface InterestQueryConfig {
  interestId: InterestId;
  label: string;
  hackerNews: {
    algoliaQuery: string;
    titleKeywords: string[];
  };
  arxiv: {
    searchQuery: string;
  };
  wikimedia: {
    article: string;
  };
}

/**
 * Maps each HorizonIQ interest to search terms for the three Phase 2.0 sources.
 * arXiv queries use official export API syntax.
 * Wikimedia articles use English Wikipedia page titles (underscores).
 */
export const INTEREST_QUERIES: InterestQueryConfig[] = [
  {
    interestId: "artificial-intelligence",
    label: "Artificial Intelligence",
    hackerNews: {
      algoliaQuery: "artificial intelligence OR LLM OR machine learning",
      titleKeywords: ["ai", "llm", "machine learning", "gpt", "agent"],
    },
    arxiv: { searchQuery: "cat:cs.AI OR cat:cs.LG OR cat:cs.CL" },
    wikimedia: { article: "Artificial_intelligence" },
  },
  {
    interestId: "robotics",
    label: "Robotics",
    hackerNews: {
      algoliaQuery: "robotics OR humanoid robot",
      titleKeywords: ["robot", "robotics", "humanoid"],
    },
    arxiv: { searchQuery: "cat:cs.RO" },
    wikimedia: { article: "Robotics" },
  },
  {
    interestId: "quantum-computing",
    label: "Quantum Computing",
    hackerNews: {
      algoliaQuery: "quantum computing",
      titleKeywords: ["quantum"],
    },
    arxiv: { searchQuery: "cat:quant-ph" },
    wikimedia: { article: "Quantum_computing" },
  },
  {
    interestId: "cybersecurity",
    label: "Cybersecurity",
    hackerNews: {
      algoliaQuery: "cybersecurity OR security breach OR ransomware",
      titleKeywords: ["security", "cyber", "ransomware", "vulnerability"],
    },
    arxiv: { searchQuery: "cat:cs.CR" },
    wikimedia: { article: "Cybersecurity" },
  },
  {
    interestId: "cloud-computing",
    label: "Cloud Computing",
    hackerNews: {
      algoliaQuery: "cloud computing OR kubernetes OR serverless",
      titleKeywords: ["cloud", "kubernetes", "aws", "azure", "serverless"],
    },
    arxiv: { searchQuery: "cat:cs.DC" },
    wikimedia: { article: "Cloud_computing" },
  },
  {
    interestId: "manufacturing",
    label: "Manufacturing",
    hackerNews: {
      algoliaQuery: "smart manufacturing OR Industry 4.0",
      titleKeywords: ["manufacturing", "factory", "industry 4"],
    },
    arxiv: { searchQuery: 'all:"smart manufacturing" OR all:"industrial automation"' },
    wikimedia: { article: "Manufacturing" },
  },
  {
    interestId: "supply-chain",
    label: "Supply Chain",
    hackerNews: {
      algoliaQuery: "supply chain OR logistics disruption",
      titleKeywords: ["supply chain", "logistics", "shipping"],
    },
    arxiv: { searchQuery: 'all:"supply chain"' },
    wikimedia: { article: "Supply_chain" },
  },
  {
    interestId: "healthcare",
    label: "Healthcare",
    hackerNews: {
      algoliaQuery: "healthcare AI OR digital health OR biotech",
      titleKeywords: ["healthcare", "health", "medical", "diagnostic"],
    },
    arxiv: { searchQuery: "cat:q-bio" },
    wikimedia: { article: "Health_care" },
  },
  {
    interestId: "finance",
    label: "Finance",
    hackerNews: {
      algoliaQuery: "fintech OR embedded finance OR banking",
      titleKeywords: ["fintech", "finance", "banking", "payments"],
    },
    arxiv: { searchQuery: "cat:q-fin" },
    wikimedia: { article: "Financial_technology" },
  },
  {
    interestId: "energy",
    label: "Energy",
    hackerNews: {
      algoliaQuery: "renewable energy OR grid storage OR battery",
      titleKeywords: ["energy", "renewable", "solar", "battery", "grid"],
    },
    arxiv: { searchQuery: 'all:"renewable energy" OR all:"energy storage"' },
    wikimedia: { article: "Renewable_energy" },
  },
  {
    interestId: "biotechnology",
    label: "Biotechnology",
    hackerNews: {
      algoliaQuery: "biotechnology OR synthetic biology",
      titleKeywords: ["biotech", "synthetic biology", "crispr"],
    },
    arxiv: { searchQuery: "cat:q-bio.BM" },
    wikimedia: { article: "Biotechnology" },
  },
  {
    interestId: "biochemistry",
    label: "Biochemistry",
    hackerNews: {
      algoliaQuery: "biochemistry OR lab automation",
      titleKeywords: ["biochemistry", "lab automation", "protein"],
    },
    arxiv: { searchQuery: "cat:q-bio.BM OR cat:q-bio.QM" },
    wikimedia: { article: "Biochemistry" },
  },
  {
    interestId: "life-sciences",
    label: "Life Sciences",
    hackerNews: {
      algoliaQuery: "life sciences OR drug discovery",
      titleKeywords: ["life science", "drug discovery", "clinical"],
    },
    arxiv: { searchQuery: "cat:q-bio" },
    wikimedia: { article: "Life_sciences" },
  },
  {
    interestId: "arts",
    label: "Arts",
    hackerNews: {
      algoliaQuery: "generative art OR creative AI",
      titleKeywords: ["generative art", "creative", "midjourney", "stable diffusion"],
    },
    arxiv: { searchQuery: 'all:"generative art" OR all:"computational creativity"' },
    wikimedia: { article: "Digital_art" },
  },
  {
    interestId: "commerce",
    label: "Commerce",
    hackerNews: {
      algoliaQuery: "e-commerce OR retail analytics",
      titleKeywords: ["e-commerce", "retail", "commerce", "shopify"],
    },
    arxiv: { searchQuery: 'all:"e-commerce" OR all:"retail analytics"' },
    wikimedia: { article: "E-commerce" },
  },
  {
    interestId: "entrepreneurship",
    label: "Entrepreneurship",
    hackerNews: {
      algoliaQuery: "Show HN",
      titleKeywords: ["show hn", "launch", "startup"],
    },
    arxiv: { searchQuery: 'all:"entrepreneurship"' },
    wikimedia: { article: "Entrepreneurship" },
  },
  {
    interestId: "startups",
    label: "Startups",
    hackerNews: {
      algoliaQuery: "startup OR Y Combinator",
      titleKeywords: ["startup", "yc", "founder", "seed"],
    },
    arxiv: { searchQuery: 'all:"startup"' },
    wikimedia: { article: "Startup_company" },
  },
  {
    interestId: "venture-capital",
    label: "Venture Capital",
    hackerNews: {
      algoliaQuery: "venture capital OR funding round OR Series A",
      titleKeywords: ["venture", "funding", "series a", "investment"],
    },
    arxiv: { searchQuery: 'all:"venture capital"' },
    wikimedia: { article: "Venture_capital" },
  },
  {
    interestId: "product-management",
    label: "Product Management",
    hackerNews: {
      algoliaQuery: "product management OR product strategy",
      titleKeywords: ["product management", "product manager", "roadmap"],
    },
    arxiv: { searchQuery: 'all:"product management"' },
    wikimedia: { article: "Product_management" },
  },
];

export const INTEREST_QUERY_BY_ID = new Map(
  INTEREST_QUERIES.map((config) => [config.interestId, config])
);

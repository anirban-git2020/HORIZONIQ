import type { InterestId } from "@/lib/types";

/** GitHub repository search qualifiers (without date or star filters). */
export const GITHUB_SEARCH_QUERIES: Record<InterestId, string> = {
  "artificial-intelligence":
    "topic:machine-learning OR topic:deep-learning OR topic:artificial-intelligence",
  robotics: "topic:robotics OR topic:robot",
  "quantum-computing": "topic:quantum-computing OR topic:quantum",
  cybersecurity: "topic:security OR topic:cybersecurity",
  "cloud-computing": "topic:kubernetes OR topic:cloud OR topic:serverless",
  manufacturing: "topic:manufacturing OR topic:industry-4-0",
  "supply-chain": "topic:logistics OR topic:supply-chain",
  healthcare: "topic:healthcare OR topic:health-tech",
  finance: "topic:fintech OR topic:finance",
  energy: "topic:renewable-energy OR topic:energy OR topic:battery",
  biotechnology: "topic:biotech OR topic:biotechnology",
  biochemistry: "topic:biochemistry OR topic:bioinformatics",
  "life-sciences": "topic:biotech OR topic:life-sciences",
  arts: "topic:creative-coding OR topic:generative-art",
  commerce: "topic:e-commerce OR topic:retail-tech",
  entrepreneurship: "topic:entrepreneurship",
  startups: "topic:startup",
  "venture-capital": "topic:venture-capital OR topic:investing",
  "product-management": "topic:product-management OR topic:productivity",
};

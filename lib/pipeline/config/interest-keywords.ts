import type { InterestId } from "@/lib/types";

/**
 * One canonical search phrase per interest — the shared vocabulary the new
 * authority collectors (OpenAlex, patents, EDGAR, clinical trials) format into
 * their own query syntax. Keeps every source aligned to the same concept and
 * avoids re-authoring dozens of near-identical queries per source.
 */
export const INTEREST_KEYWORDS: Record<InterestId, string> = {
  "artificial-intelligence": "artificial intelligence",
  robotics: "robotics",
  "quantum-computing": "quantum computing",
  cybersecurity: "cybersecurity",
  "cloud-computing": "cloud computing",
  manufacturing: "advanced manufacturing",
  "supply-chain": "supply chain",
  healthcare: "healthcare",
  finance: "financial technology",
  energy: "renewable energy",
  biotechnology: "biotechnology",
  biochemistry: "biochemistry",
  "life-sciences": "life sciences",
  arts: "creative arts",
  commerce: "e-commerce",
  entrepreneurship: "entrepreneurship",
  startups: "startup",
  "venture-capital": "venture capital",
  "product-management": "product management",
};

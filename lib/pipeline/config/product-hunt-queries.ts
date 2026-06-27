import type { InterestId } from "@/lib/types";

/**
 * Product Hunt topic slugs for `posts(topic: ...)`.
 * @see https://api.producthunt.com/v2/docs
 */
export const PRODUCT_HUNT_TOPIC_SLUGS: Record<InterestId, string> = {
  "artificial-intelligence": "artificial-intelligence",
  robotics: "robotics",
  "quantum-computing": "quantum-computing",
  cybersecurity: "cybersecurity",
  "cloud-computing": "developer-tools",
  manufacturing: "hardware",
  "supply-chain": "productivity",
  healthcare: "health-fitness",
  finance: "fintech",
  energy: "climate-tech",
  biotechnology: "biohacking",
  biochemistry: "science",
  "life-sciences": "science",
  arts: "design",
  commerce: "e-commerce",
  entrepreneurship: "startup",
  startups: "startup",
  "venture-capital": "venture-capital",
  "product-management": "productivity",
};

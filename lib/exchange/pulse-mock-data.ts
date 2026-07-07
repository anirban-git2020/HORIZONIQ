/** Phase 4 — World Intelligence Pulse editorial tiles (no API). */

export type PulseTileTier = "hero" | "featured" | "compact";

export type PulseCta =
  | "Why it Matters"
  | "See the Evidence"
  | "Explore the Trend"
  | "Understand the Shift";

export type IntelligencePulseTile = {
  id: string;
  technology: string;
  headline: string;
  supporting: string;
  momentum: number;
  momentumChange: number;
  forecastNarrative: string;
  evidence: {
    signals: number;
    newJobs: number;
    researchPapers: number;
    fundingEvents: number;
  };
  updated: string;
  tier: PulseTileTier;
  cta: PulseCta;
  sparkline: readonly number[];
};

export const INTELLIGENCE_PULSE_TILES: IntelligencePulseTile[] = [
  {
    id: "agentic-ai",
    technology: "Agentic AI",
    headline: "Software is becoming autonomous.",
    supporting:
      "Teams shipping agent workflows move faster. Those waiting risk falling behind within two quarters.",
    momentum: 97,
    momentumChange: 18,
    forecastNarrative: "Rapid Adoption",
    evidence: { signals: 1248, newJobs: 214, researchPapers: 38, fundingEvents: 18 },
    updated: "18 sec ago",
    tier: "hero",
    cta: "Why it Matters",
    sparkline: [42, 48, 45, 55, 58, 62, 68, 74, 82, 91, 97],
  },
  {
    id: "cuda",
    technology: "CUDA",
    headline: "AI compute demand is accelerating.",
    supporting:
      "Every frontier model depends on GPU scale. Capacity now decides who ships first.",
    momentum: 95,
    momentumChange: 11,
    forecastNarrative: "Infrastructure Expansion",
    evidence: { signals: 982, newJobs: 186, researchPapers: 29, fundingEvents: 14 },
    updated: "21 sec ago",
    tier: "featured",
    cta: "See the Evidence",
    sparkline: [58, 62, 60, 68, 72, 75, 80, 84, 88, 92, 95],
  },
  {
    id: "semiconductor-supply-chain",
    technology: "Semiconductor Supply Chain",
    headline: "Chip supply is now strategic power.",
    supporting:
      "Nations and firms race to secure advanced packaging before the next capacity crunch.",
    momentum: 88,
    momentumChange: 9,
    forecastNarrative: "Infrastructure Expansion",
    evidence: { signals: 715, newJobs: 142, researchPapers: 22, fundingEvents: 11 },
    updated: "27 sec ago",
    tier: "featured",
    cta: "Understand the Shift",
    sparkline: [52, 55, 58, 62, 65, 70, 74, 78, 82, 85, 88],
  },
  {
    id: "humanoid-robotics",
    technology: "Humanoid Robotics",
    headline: "Machines are learning to walk.",
    supporting:
      "Logistics pilots signal a shift from demo to production within eighteen months.",
    momentum: 84,
    momentumChange: 7,
    forecastNarrative: "Enterprise Growth",
    evidence: { signals: 478, newJobs: 98, researchPapers: 19, fundingEvents: 9 },
    updated: "33 sec ago",
    tier: "featured",
    cta: "Explore the Trend",
    sparkline: [48, 52, 54, 58, 62, 66, 72, 76, 79, 82, 84],
  },
  {
    id: "quantum-computing",
    technology: "Quantum Computing",
    headline: "Quantum is leaving the lab.",
    supporting:
      "Error correction progress opens problems classical systems may never solve.",
    momentum: 82,
    momentumChange: 6,
    forecastNarrative: "Research Breakthrough",
    evidence: { signals: 612, newJobs: 76, researchPapers: 44, fundingEvents: 7 },
    updated: "42 sec ago",
    tier: "compact",
    cta: "Why it Matters",
    sparkline: [44, 48, 52, 55, 60, 64, 68, 72, 76, 79, 82],
  },
  {
    id: "robotics",
    technology: "Robotics",
    headline: "Factories are hiring robots first.",
    supporting:
      "Unit economics crossed the threshold where automation beats rehiring at scale.",
    momentum: 79,
    momentumChange: 5,
    forecastNarrative: "Enterprise Growth",
    evidence: { signals: 530, newJobs: 112, researchPapers: 17, fundingEvents: 8 },
    updated: "39 sec ago",
    tier: "compact",
    cta: "See the Evidence",
    sparkline: [50, 52, 55, 58, 62, 65, 68, 72, 74, 77, 79],
  },
  {
    id: "autonomous-systems",
    technology: "Autonomous Systems",
    headline: "Autonomy spreads beyond vehicles.",
    supporting:
      "Drones, warehouses, and maritime stacks share the same perception breakthroughs.",
    momentum: 76,
    momentumChange: 4,
    forecastNarrative: "Enterprise Growth",
    evidence: { signals: 456, newJobs: 89, researchPapers: 15, fundingEvents: 6 },
    updated: "44 sec ago",
    tier: "compact",
    cta: "Explore the Trend",
    sparkline: [46, 50, 52, 56, 58, 62, 65, 68, 71, 74, 76],
  },
  {
    id: "cybersecurity",
    technology: "Cybersecurity",
    headline: "Defense must outpace AI offense.",
    supporting:
      "Threat models rewritten by generative attacks demand new architecture now.",
    momentum: 74,
    momentumChange: 3,
    forecastNarrative: "Rapid Adoption",
    evidence: { signals: 422, newJobs: 94, researchPapers: 12, fundingEvents: 5 },
    updated: "55 sec ago",
    tier: "compact",
    cta: "Understand the Shift",
    sparkline: [58, 60, 62, 64, 66, 68, 69, 71, 72, 73, 74],
  },
  {
    id: "cloud-infrastructure",
    technology: "Cloud Infrastructure",
    headline: "Inference is the new cloud war.",
    supporting:
      "Hyperscalers compete on latency and cost per token, not raw storage.",
    momentum: 72,
    momentumChange: 3,
    forecastNarrative: "Infrastructure Expansion",
    evidence: { signals: 398, newJobs: 78, researchPapers: 11, fundingEvents: 4 },
    updated: "48 sec ago",
    tier: "compact",
    cta: "Why it Matters",
    sparkline: [54, 56, 58, 60, 62, 64, 66, 68, 69, 71, 72],
  },
  {
    id: "biotechnology",
    technology: "Biotechnology",
    headline: "Drug discovery timelines are collapsing.",
    supporting:
      "AI-designed molecules reach trials in months, not years. Pipelines are rewiring.",
    momentum: 68,
    momentumChange: 2,
    forecastNarrative: "Research Breakthrough",
    evidence: { signals: 341, newJobs: 64, researchPapers: 31, fundingEvents: 5 },
    updated: "1 min ago",
    tier: "compact",
    cta: "See the Evidence",
    sparkline: [48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
  },
  {
    id: "spatial-computing",
    technology: "Spatial Computing",
    headline: "Enterprise is adopting mixed reality.",
    supporting:
      "Training and design use cases prove ROI beyond consumer hype cycles.",
    momentum: 61,
    momentumChange: 1,
    forecastNarrative: "Consumer Acceleration",
    evidence: { signals: 245, newJobs: 42, researchPapers: 9, fundingEvents: 3 },
    updated: "1 min ago",
    tier: "compact",
    cta: "Explore the Trend",
    sparkline: [52, 53, 54, 55, 56, 57, 58, 59, 59, 60, 61],
  },
  {
    id: "fusion-energy",
    technology: "Fusion Energy",
    headline: "Fusion funding is reaching escape velocity.",
    supporting:
      "Net gain milestones pull private capital toward commercial timelines once deemed distant.",
    momentum: 58,
    momentumChange: 1,
    forecastNarrative: "Research Breakthrough",
    evidence: { signals: 192, newJobs: 28, researchPapers: 26, fundingEvents: 4 },
    updated: "2 min ago",
    tier: "compact",
    cta: "Understand the Shift",
    sparkline: [46, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58],
  },
];

export function getPulseTilesByTier() {
  const hero = INTELLIGENCE_PULSE_TILES.find((t) => t.tier === "hero");
  const featured = INTELLIGENCE_PULSE_TILES.filter((t) => t.tier === "featured");
  const compact = INTELLIGENCE_PULSE_TILES.filter((t) => t.tier === "compact");
  return { hero, featured, compact };
}

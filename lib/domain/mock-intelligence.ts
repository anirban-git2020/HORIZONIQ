/**
 * The single centralized mock intelligence dataset.
 *
 * This is the one place mock Signals live. Seeded from the current editorial
 * tiles and briefs so behaviour is preserved when consumers migrate to it.
 * A concise seed row is expanded by `build()` into a full canonical Signal,
 * keeping the data readable and the structure consistent.
 *
 * `mockSignalRepository` is a default in-memory implementation of
 * SignalRepository — not an external integration, just the local source that
 * satisfies the contract until a real repository replaces it.
 */

import type { InterestId, RegionId, RoleId } from "@/lib/types";
import type {
  ConfidenceTier,
  Signal,
  Trajectory,
} from "@/lib/domain/signal";
import type { SourceRef, SourceType } from "@/lib/domain/source";
import type {
  SignalQuery,
  SignalRepository,
} from "@/lib/domain/repositories";

const OBSERVED_AT = "2026-07-08T00:00:00.000Z";

/** The four standing evidence lenses, expressed as source references. */
function sources(
  github: string,
  research: string,
  hiring: string,
  funding: string
): readonly SourceRef[] {
  const ref = (type: SourceType, label: string, delta: string): SourceRef => ({
    type,
    label,
    delta,
  });
  return [
    ref("github", "GitHub Activity", github),
    ref("research-paper", "Research Publications", research),
    ref("job-board", "Hiring Demand", hiring),
    ref("news", "Funding Events", funding),
  ];
}

type Seed = {
  readonly id: string;
  readonly title: string;
  readonly headline: string;
  readonly summary: string;
  readonly brief: string;
  readonly forecast: string;
  readonly domain: string;
  readonly interest: InterestId;
  readonly momentumScore: number;
  readonly velocity: number;
  readonly trajectory: Trajectory;
  readonly evidenceCount: number;
  readonly confidence: ConfidenceTier;
  readonly sources: readonly SourceRef[];
  readonly relatedSignals: readonly string[];
  readonly relatedCompanies: readonly string[];
  readonly recommendedRoles: readonly RoleId[];
  readonly recommendedInterests: readonly InterestId[];
  readonly primaryRegion?: RegionId;
  readonly regions?: readonly RegionId[];
  readonly featured: boolean;
  readonly narrative: string;
  readonly sparkline: readonly number[];
};

function build(seed: Seed): Signal {
  return {
    identity: {
      id: seed.id,
      slug: seed.id,
      title: seed.title,
      headline: seed.headline,
      summary: seed.summary,
    },
    classification: {
      domain: seed.domain,
      tags: [],
      interest: seed.interest,
    },
    geography: {
      primaryRegion: seed.primaryRegion,
      secondaryRegions: seed.regions ?? [],
      globalImpact: true,
    },
    evidence: {
      evidenceCount: seed.evidenceCount,
      sources: seed.sources,
      lastObserved: OBSERVED_AT,
      freshness: "live",
      confidence: seed.confidence,
    },
    momentum: {
      momentumScore: seed.momentumScore,
      velocity: seed.velocity,
      trajectory: seed.trajectory,
    },
    forecast: {
      forecast: seed.forecast,
      forecastConfidence: seed.confidence,
    },
    relationships: {
      relatedSignals: seed.relatedSignals,
      relatedCompanies: seed.relatedCompanies,
      relatedTechnologies: [],
      relatedIndustries: [],
    },
    personalization: {
      recommendedRoles: seed.recommendedRoles,
      recommendedIndustries: [],
      recommendedRegions: seed.regions ?? [],
      recommendedInterests: seed.recommendedInterests,
    },
    presentation: {
      featured: seed.featured,
      narrative: seed.narrative,
      sparkline: seed.sparkline,
    },
    reading: {
      estimatedReadTime: 1,
      brief: seed.brief,
    },
    versioning: {
      createdAt: OBSERVED_AT,
      updatedAt: OBSERVED_AT,
      revision: 1,
      status: "active",
    },
  };
}

const SEEDS: readonly Seed[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI",
    headline: "Software is becoming autonomous.",
    summary:
      "Teams shipping agent workflows move faster. Those waiting risk falling behind within two quarters.",
    brief:
      "Agentic systems are moving from demos to production workflows faster than most organizations can retool. The window to build internal capability is narrowing as incumbents embed autonomy into core products.",
    forecast:
      "Over the next year, agent frameworks will become default infrastructure for software teams. Late adopters will compete on integration speed, not model access alone.",
    domain: "Artificial Intelligence",
    interest: "artificial-intelligence",
    momentumScore: 97,
    velocity: 18,
    trajectory: "accelerating",
    evidenceCount: 1248,
    confidence: "high",
    sources: sources("+214%", "+38%", "+181%", "+71%"),
    relatedSignals: ["cuda", "cloud-infrastructure", "cybersecurity", "autonomous-systems"],
    relatedCompanies: ["OpenAI", "Microsoft", "Google", "Anthropic"],
    recommendedRoles: ["professional", "entrepreneur", "investor", "student"],
    recommendedInterests: ["artificial-intelligence"],
    featured: true,
    narrative: "Rapid Adoption",
    sparkline: [42, 48, 45, 55, 58, 62, 68, 74, 82, 91, 97],
  },
  {
    id: "cuda",
    title: "CUDA",
    headline: "AI compute demand is accelerating.",
    summary:
      "Every frontier model depends on GPU scale. Capacity now decides who ships first.",
    brief:
      "GPU compute is the binding constraint on AI progress. Every major model release intensifies competition for CUDA-class capacity and the talent to operate it.",
    forecast:
      "Inference demand will outpace training within eighteen months. Firms that secure long-term compute contracts now will ship features others cannot.",
    domain: "Cloud & Compute",
    interest: "cloud-computing",
    momentumScore: 95,
    velocity: 11,
    trajectory: "accelerating",
    evidenceCount: 982,
    confidence: "high",
    sources: sources("+186%", "+29%", "+142%", "+58%"),
    relatedSignals: ["agentic-ai", "semiconductor-supply-chain", "cloud-infrastructure"],
    relatedCompanies: ["NVIDIA", "Microsoft", "Google", "Amazon"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["cloud-computing"],
    featured: true,
    narrative: "Infrastructure Expansion",
    sparkline: [58, 62, 60, 68, 72, 75, 80, 84, 88, 92, 95],
  },
  {
    id: "semiconductor-supply-chain",
    title: "Semiconductor Supply Chain",
    headline: "Chip supply is now strategic power.",
    summary:
      "Nations and firms race to secure advanced packaging before the next capacity crunch.",
    brief:
      "Advanced packaging and geopolitical alignment now determine who can build AI at scale. Supply security has become a board-level risk, not a procurement detail.",
    forecast:
      "Regional diversification will accelerate through 2027. Companies without dual-source strategies face multi-quarter delays on every hardware roadmap.",
    domain: "Supply Chain",
    interest: "supply-chain",
    momentumScore: 88,
    velocity: 9,
    trajectory: "steady",
    evidenceCount: 715,
    confidence: "high",
    sources: sources("+124%", "+22%", "+98%", "+64%"),
    relatedSignals: ["cuda", "quantum-computing", "robotics"],
    relatedCompanies: ["TSMC", "NVIDIA", "Intel", "Samsung"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["supply-chain"],
    featured: true,
    narrative: "Infrastructure Expansion",
    sparkline: [52, 55, 58, 62, 65, 70, 74, 78, 82, 85, 88],
  },
  {
    id: "humanoid-robotics",
    title: "Humanoid Robotics",
    headline: "Machines are learning to walk.",
    summary:
      "Logistics pilots signal a shift from demo to production within eighteen months.",
    brief:
      "Bipedal robots are crossing from laboratory curiosity to warehouse pilot. Labor shortages and falling actuator costs make deployment economics plausible for the first time.",
    forecast:
      "Expect selective enterprise rollouts in logistics before consumer adoption. The winners will pair hardware reliability with software that learns from deployment data.",
    domain: "Robotics",
    interest: "robotics",
    momentumScore: 84,
    velocity: 7,
    trajectory: "steady",
    evidenceCount: 478,
    confidence: "medium",
    sources: sources("+98%", "+19%", "+76%", "+52%"),
    relatedSignals: ["robotics", "autonomous-systems", "semiconductor-supply-chain"],
    relatedCompanies: ["Tesla", "Figure AI", "Boston Dynamics", "Agility Robotics"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["robotics"],
    featured: true,
    narrative: "Enterprise Growth",
    sparkline: [48, 52, 54, 58, 62, 66, 72, 76, 79, 82, 84],
  },
  {
    id: "quantum-computing",
    title: "Quantum Computing",
    headline: "Quantum is leaving the lab.",
    summary:
      "Error correction progress opens problems classical systems may never solve.",
    brief:
      "Error correction milestones are shifting quantum from theoretical advantage to investable roadmap. Capital is arriving before most enterprises have assigned an owner.",
    forecast:
      "Near-term value will concentrate in simulation and cryptography research. Commercial advantage remains years away, but preparation windows are open now.",
    domain: "Quantum",
    interest: "quantum-computing",
    momentumScore: 82,
    velocity: 6,
    trajectory: "steady",
    evidenceCount: 612,
    confidence: "medium",
    sources: sources("+72%", "+44%", "+61%", "+48%"),
    relatedSignals: ["cybersecurity", "cuda", "biotechnology"],
    relatedCompanies: ["IBM", "Google", "IonQ", "Microsoft"],
    recommendedRoles: ["investor", "entrepreneur", "student"],
    recommendedInterests: ["quantum-computing"],
    featured: false,
    narrative: "Research Breakthrough",
    sparkline: [44, 48, 52, 55, 60, 64, 68, 72, 76, 79, 82],
  },
  {
    id: "robotics",
    title: "Robotics",
    headline: "Factories are hiring robots first.",
    summary:
      "Unit economics crossed the threshold where automation beats rehiring at scale.",
    brief:
      "Factory automation economics now favor robots over rehiring in several regions. Manufacturers are standardizing on platforms that integrate vision, control, and fleet software.",
    forecast:
      "Industrial robotics will grow fastest in markets with wage pressure and energy volatility. Software margins will exceed hardware margins within the decade.",
    domain: "Robotics",
    interest: "robotics",
    momentumScore: 79,
    velocity: 5,
    trajectory: "steady",
    evidenceCount: 530,
    confidence: "medium",
    sources: sources("+88%", "+17%", "+94%", "+41%"),
    relatedSignals: ["humanoid-robotics", "autonomous-systems", "cuda"],
    relatedCompanies: ["ABB", "Fanuc", "Tesla", "Amazon"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["robotics"],
    featured: false,
    narrative: "Enterprise Growth",
    sparkline: [50, 52, 55, 58, 62, 65, 68, 72, 74, 77, 79],
  },
  {
    id: "autonomous-systems",
    title: "Autonomous Systems",
    headline: "Autonomy spreads beyond vehicles.",
    summary:
      "Drones, warehouses, and maritime stacks share the same perception breakthroughs.",
    brief:
      "Autonomy is migrating from vehicles to warehouses, ports, and airspace. Shared perception stacks mean breakthroughs in one domain accelerate others.",
    forecast:
      "Regulatory clarity in key markets will unlock capital faster than technical progress. Operators with safety data will compound advantage.",
    domain: "Autonomy",
    interest: "robotics",
    momentumScore: 76,
    velocity: 4,
    trajectory: "emerging",
    evidenceCount: 456,
    confidence: "medium",
    sources: sources("+76%", "+15%", "+82%", "+36%"),
    relatedSignals: ["robotics", "cybersecurity", "cloud-infrastructure"],
    relatedCompanies: ["Waymo", "Tesla", "Amazon", "Anduril"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["robotics"],
    featured: false,
    narrative: "Enterprise Growth",
    sparkline: [46, 50, 52, 56, 58, 62, 65, 68, 71, 74, 76],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    headline: "Defense must outpace AI offense.",
    summary:
      "Threat models rewritten by generative attacks demand new architecture now.",
    brief:
      "Generative attacks are rewriting threat models faster than legacy defenses adapt. Boards are treating AI-native security as mandatory, not optional.",
    forecast:
      "Defense spending will shift toward continuous verification and identity-first architecture. Reactive tooling loses share to systems that model attacker behavior.",
    domain: "Cybersecurity",
    interest: "cybersecurity",
    momentumScore: 74,
    velocity: 3,
    trajectory: "emerging",
    evidenceCount: 422,
    confidence: "medium",
    sources: sources("+64%", "+12%", "+88%", "+33%"),
    relatedSignals: ["agentic-ai", "cloud-infrastructure", "quantum-computing"],
    relatedCompanies: ["CrowdStrike", "Microsoft", "Palo Alto Networks", "Google"],
    recommendedRoles: ["professional", "entrepreneur", "investor", "student"],
    recommendedInterests: ["cybersecurity"],
    featured: false,
    narrative: "Rapid Adoption",
    sparkline: [58, 60, 62, 64, 66, 68, 69, 71, 72, 73, 74],
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud Infrastructure",
    headline: "Inference is the new cloud war.",
    summary:
      "Hyperscalers compete on latency and cost per token, not raw storage.",
    brief:
      "Hyperscalers are competing on inference latency and cost per token. Cloud strategy is now AI strategy, and procurement cycles are shortening.",
    forecast:
      "Multi-cloud inference orchestration will become standard for enterprises avoiding vendor lock-in. Price competition intensifies as utilization rates climb.",
    domain: "Cloud & Compute",
    interest: "cloud-computing",
    momentumScore: 72,
    velocity: 3,
    trajectory: "emerging",
    evidenceCount: 398,
    confidence: "medium",
    sources: sources("+58%", "+11%", "+74%", "+28%"),
    relatedSignals: ["cuda", "agentic-ai", "cybersecurity"],
    relatedCompanies: ["Amazon", "Microsoft", "Google", "Oracle"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["cloud-computing"],
    featured: false,
    narrative: "Infrastructure Expansion",
    sparkline: [54, 56, 58, 60, 62, 64, 66, 68, 69, 71, 72],
  },
  {
    id: "biotechnology",
    title: "Biotechnology",
    headline: "Drug discovery timelines are collapsing.",
    summary:
      "AI-designed molecules reach trials in months, not years. Pipelines are rewiring.",
    brief:
      "AI-designed molecules are reaching trials in months rather than years. Pharmaceutical pipelines are being restructured around computational discovery teams.",
    forecast:
      "Regulatory frameworks will adapt to AI-assisted trials, but unevenly across regions. Early movers gain compound data advantages in target identification.",
    domain: "Life Sciences",
    interest: "biotechnology",
    momentumScore: 68,
    velocity: 2,
    trajectory: "emerging",
    evidenceCount: 341,
    confidence: "low",
    sources: sources("+52%", "+31%", "+68%", "+45%"),
    relatedSignals: ["quantum-computing", "fusion-energy", "agentic-ai"],
    relatedCompanies: ["DeepMind", "Recursion", "Moderna", "Roche"],
    recommendedRoles: ["investor", "entrepreneur", "student"],
    recommendedInterests: ["biotechnology"],
    featured: false,
    narrative: "Research Breakthrough",
    sparkline: [48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
  },
  {
    id: "spatial-computing",
    title: "Spatial Computing",
    headline: "Enterprise is adopting mixed reality.",
    summary:
      "Training and design use cases prove ROI beyond consumer hype cycles.",
    brief:
      "Enterprise training and design workflows are proving mixed reality ROI where consumer adoption stalled. Hardware comfort and software maturity are aligning.",
    forecast:
      "B2B adoption will lead consumer markets for several years. Platforms that integrate with existing CAD and LMS tools will capture durable share.",
    domain: "Artificial Intelligence",
    interest: "artificial-intelligence",
    momentumScore: 61,
    velocity: 1,
    trajectory: "emerging",
    evidenceCount: 245,
    confidence: "low",
    sources: sources("+41%", "+9%", "+54%", "+22%"),
    relatedSignals: ["robotics", "autonomous-systems", "cloud-infrastructure"],
    relatedCompanies: ["Apple", "Microsoft", "Meta", "Magic Leap"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["artificial-intelligence"],
    featured: false,
    narrative: "Consumer Acceleration",
    sparkline: [52, 53, 54, 55, 56, 57, 58, 59, 59, 60, 61],
  },
  {
    id: "fusion-energy",
    title: "Fusion Energy",
    headline: "Fusion funding is reaching escape velocity.",
    summary:
      "Net gain milestones pull private capital toward commercial timelines once deemed distant.",
    brief:
      "Net energy gain milestones are pulling private capital into timelines once considered science fiction. Energy security concerns amplify every breakthrough announcement.",
    forecast:
      "Commercial fusion remains distant, but grid-adjacent applications may arrive sooner than consensus expects. Policy support will determine regional winners.",
    domain: "Energy",
    interest: "energy",
    momentumScore: 58,
    velocity: 1,
    trajectory: "emerging",
    evidenceCount: 192,
    confidence: "low",
    sources: sources("+38%", "+26%", "+47%", "+62%"),
    relatedSignals: ["semiconductor-supply-chain", "biotechnology", "robotics"],
    relatedCompanies: ["Commonwealth Fusion", "Helion", "TAE Technologies", "Google"],
    recommendedRoles: ["investor", "entrepreneur"],
    recommendedInterests: ["energy"],
    featured: false,
    narrative: "Research Breakthrough",
    sparkline: [46, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58],
  },
  {
    id: "ai-manufacturing",
    title: "AI-Driven Manufacturing",
    headline: "Factories are becoming self-optimizing.",
    summary:
      "Industrial AI links vision, control, and supply data into plants that tune themselves.",
    brief:
      "Manufacturers are wiring AI into the plant floor, turning fixed production lines into systems that adapt to demand, defects, and disruption in real time. The edge now goes to operators who own their process data.",
    forecast:
      "Adoption leads in regions with wage pressure and new capacity. Software-defined plants will out-margin fixed automation within the decade.",
    domain: "Manufacturing",
    interest: "manufacturing",
    momentumScore: 71,
    velocity: 6,
    trajectory: "steady",
    evidenceCount: 388,
    confidence: "medium",
    sources: sources("+61%", "+14%", "+79%", "+34%"),
    relatedSignals: ["robotics", "semiconductor-supply-chain", "autonomous-systems"],
    relatedCompanies: ["Siemens", "Foxconn", "Bosch", "GE"],
    recommendedRoles: ["professional", "entrepreneur", "investor"],
    recommendedInterests: ["manufacturing"],
    primaryRegion: "india",
    regions: ["india", "china", "southeast-asia", "africa", "latin-america"],
    featured: false,
    narrative: "Enterprise Growth",
    sparkline: [50, 52, 55, 57, 60, 62, 65, 67, 68, 70, 71],
  },
  {
    id: "ai-financial-services",
    title: "AI in Financial Services",
    headline: "Underwriting is being rebuilt on models.",
    summary:
      "Credit, fraud, and risk pipelines are moving from fixed rules to learned systems.",
    brief:
      "Banks and fintechs are replacing static rules with models across credit, fraud, and compliance. The advantage accrues to institutions with clean proprietary data and the governance to deploy models safely.",
    forecast:
      "Regulation shapes pace more than technology. Firms that pair model-risk management with speed take share from incumbents.",
    domain: "Finance",
    interest: "finance",
    momentumScore: 73,
    velocity: 5,
    trajectory: "steady",
    evidenceCount: 402,
    confidence: "medium",
    sources: sources("+58%", "+13%", "+81%", "+49%"),
    relatedSignals: ["cybersecurity", "cloud-infrastructure", "agentic-ai"],
    relatedCompanies: ["JPMorgan", "Stripe", "Visa", "Revolut"],
    recommendedRoles: ["professional", "investor", "entrepreneur"],
    recommendedInterests: ["finance"],
    primaryRegion: "north-america",
    regions: ["north-america", "europe", "india", "africa"],
    featured: false,
    narrative: "Rapid Adoption",
    sparkline: [55, 57, 59, 61, 63, 65, 67, 69, 70, 72, 73],
  },
  {
    id: "ai-clinical-diagnostics",
    title: "AI Clinical Diagnostics",
    headline: "Diagnosis is getting a second reader.",
    summary:
      "Imaging and pathology models are reaching specialist parity on narrow tasks.",
    brief:
      "AI diagnostic tools are clearing regulators and entering clinical workflows, easing specialist shortages. Health systems that integrate them into care pathways — not just pilots — capture the outcomes and the savings.",
    forecast:
      "Reimbursement and liability frameworks gate scale. Markets with specialist shortages adopt fastest.",
    domain: "Healthcare",
    interest: "healthcare",
    momentumScore: 70,
    velocity: 4,
    trajectory: "steady",
    evidenceCount: 356,
    confidence: "medium",
    sources: sources("+54%", "+21%", "+72%", "+38%"),
    relatedSignals: ["biotechnology", "agentic-ai", "cloud-infrastructure"],
    relatedCompanies: ["Google", "Siemens Healthineers", "Nvidia", "Tempus"],
    recommendedRoles: ["professional", "student", "investor"],
    recommendedInterests: ["healthcare"],
    primaryRegion: "north-america",
    regions: ["north-america", "europe", "india", "africa"],
    featured: false,
    narrative: "Research Breakthrough",
    sparkline: [54, 56, 58, 60, 62, 63, 65, 67, 68, 69, 70],
  },
  {
    id: "venture-capital-flows",
    title: "Venture Capital Flows",
    headline: "Capital is concentrating in AI infrastructure.",
    summary:
      "Funding is narrowing to fewer, larger bets on compute, agents, and applied AI.",
    brief:
      "Venture capital is consolidating around AI infrastructure and applied-AI platforms, thinning funding elsewhere. Founders and investors are repricing which categories can still raise — and at what velocity.",
    forecast:
      "Concentration persists until rates ease or a breakout application broadens the field. Hubs with policy support retain share.",
    domain: "Capital Markets",
    interest: "venture-capital",
    momentumScore: 69,
    velocity: 4,
    trajectory: "steady",
    evidenceCount: 331,
    confidence: "medium",
    sources: sources("+52%", "+9%", "+44%", "+88%"),
    relatedSignals: ["agentic-ai", "cuda", "cloud-infrastructure"],
    relatedCompanies: ["Sequoia", "a16z", "Tiger Global", "SoftBank"],
    recommendedRoles: ["investor", "entrepreneur"],
    recommendedInterests: ["venture-capital", "startups"],
    primaryRegion: "north-america",
    regions: ["north-america", "europe", "india", "southeast-asia"],
    featured: false,
    narrative: "Infrastructure Expansion",
    sparkline: [52, 54, 56, 58, 60, 62, 64, 66, 67, 68, 69],
  },
  {
    id: "computational-biochemistry",
    title: "Computational Biochemistry",
    headline: "Protein design is becoming programmable.",
    summary:
      "Generative models are turning molecular design from search into specification.",
    brief:
      "Structure prediction and generative chemistry are compressing the discovery loop — teams specify a target and design toward it. Wet-lab validation, not ideas, is now the bottleneck.",
    forecast:
      "Design tools commoditize; proprietary assays and data become the moat. AI labs and bench science partner to close the loop.",
    domain: "Life Sciences",
    interest: "biochemistry",
    momentumScore: 66,
    velocity: 3,
    trajectory: "emerging",
    evidenceCount: 274,
    confidence: "low",
    sources: sources("+47%", "+34%", "+51%", "+29%"),
    relatedSignals: ["biotechnology", "ai-clinical-diagnostics", "quantum-computing"],
    relatedCompanies: ["DeepMind", "Isomorphic Labs", "Genentech", "BASF"],
    recommendedRoles: ["student", "investor", "entrepreneur"],
    recommendedInterests: ["biochemistry", "life-sciences"],
    primaryRegion: "europe",
    regions: ["europe", "north-america", "india", "latin-america"],
    featured: false,
    narrative: "Research Breakthrough",
    sparkline: [50, 52, 54, 56, 58, 60, 61, 63, 64, 65, 66],
  },
  {
    id: "ai-life-sciences",
    title: "AI in Life Sciences",
    headline: "Research is compounding on models.",
    summary:
      "Literature, lab data, and trials are unified into models that propose the next experiment.",
    brief:
      "Life-science teams are layering AI over fragmented research and trial data to surface hypotheses and cut dead-end experiments. The advantage goes to institutions that can connect their data, not just collect it.",
    forecast:
      "Data interoperability and provenance decide winners. Expect consolidation around platforms that make evidence auditable.",
    domain: "Life Sciences",
    interest: "life-sciences",
    momentumScore: 64,
    velocity: 3,
    trajectory: "emerging",
    evidenceCount: 258,
    confidence: "low",
    sources: sources("+44%", "+38%", "+49%", "+26%"),
    relatedSignals: ["biotechnology", "ai-clinical-diagnostics", "computational-biochemistry"],
    relatedCompanies: ["Recursion", "Insitro", "Novartis", "AstraZeneca"],
    recommendedRoles: ["student", "professional", "investor"],
    recommendedInterests: ["life-sciences", "healthcare"],
    primaryRegion: "north-america",
    regions: ["north-america", "europe", "india", "middle-east"],
    featured: false,
    narrative: "Research Breakthrough",
    sparkline: [48, 50, 52, 54, 56, 57, 59, 60, 62, 63, 64],
  },
  {
    id: "generative-creative-tools",
    title: "Generative Creative Tools",
    headline: "Creative work is being reorganized.",
    summary:
      "Image, video, and audio models are shifting craft from execution to direction.",
    brief:
      "Generative tools are collapsing production time for image, video, and audio, moving the scarce skill from execution to taste and direction. Studios and independents are renegotiating who owns the output — and the rights.",
    forecast:
      "Provenance, licensing, and authorship rules shape the market more than model quality. Curation becomes the differentiator.",
    domain: "Arts & Media",
    interest: "arts",
    momentumScore: 67,
    velocity: 4,
    trajectory: "steady",
    evidenceCount: 289,
    confidence: "medium",
    sources: sources("+63%", "+8%", "+41%", "+31%"),
    relatedSignals: ["agentic-ai", "spatial-computing", "cloud-infrastructure"],
    relatedCompanies: ["Adobe", "OpenAI", "Runway", "Canva"],
    recommendedRoles: ["student", "entrepreneur"],
    recommendedInterests: ["arts", "commerce"],
    primaryRegion: "north-america",
    regions: ["north-america", "europe", "latin-america", "southeast-asia"],
    featured: false,
    narrative: "Consumer Acceleration",
    sparkline: [54, 56, 57, 59, 60, 62, 63, 64, 65, 66, 67],
  },
  {
    id: "ai-commerce",
    title: "AI-Native Commerce",
    headline: "Storefronts are becoming conversational.",
    summary:
      "Discovery, pricing, and support are shifting from pages to agents.",
    brief:
      "Retail is moving from search-and-browse to agent-led discovery, dynamic pricing, and automated support. Merchants with clean catalog and behavioral data adapt fastest; the rest cede the customer relationship to platforms.",
    forecast:
      "Platform agents intermediate more demand. Brands invest in first-party data and direct channels to avoid disintermediation.",
    domain: "Commerce",
    interest: "commerce",
    momentumScore: 68,
    velocity: 4,
    trajectory: "steady",
    evidenceCount: 312,
    confidence: "medium",
    sources: sources("+57%", "+7%", "+63%", "+35%"),
    relatedSignals: ["agentic-ai", "ai-financial-services", "cloud-infrastructure"],
    relatedCompanies: ["Amazon", "Shopify", "Mercado Libre", "Alibaba"],
    recommendedRoles: ["entrepreneur", "student", "professional"],
    recommendedInterests: ["commerce", "startups"],
    primaryRegion: "latin-america",
    regions: ["latin-america", "north-america", "southeast-asia", "india", "africa"],
    featured: false,
    narrative: "Rapid Adoption",
    sparkline: [55, 57, 58, 60, 61, 63, 64, 65, 66, 67, 68],
  },
];

/** The canonical mock intelligence dataset — the single source of Signals. */
export const MOCK_SIGNALS: readonly Signal[] = SEEDS.map(build);

const BY_ID = new Map(MOCK_SIGNALS.map((s) => [s.identity.id, s] as const));
const BY_SLUG = new Map(MOCK_SIGNALS.map((s) => [s.identity.slug, s] as const));

/** Default in-memory SignalRepository over the mock dataset. */
export const mockSignalRepository: SignalRepository = {
  getAll: () => MOCK_SIGNALS,
  getById: (id) => BY_ID.get(id),
  getBySlug: (slug) => BY_SLUG.get(slug),
  query: ({ interests, limit }: SignalQuery) => {
    let result = MOCK_SIGNALS;
    if (interests && interests.length > 0) {
      const wanted = new Set<InterestId>(interests);
      result = result.filter((s) => wanted.has(s.classification.interest));
    }
    return typeof limit === "number" ? result.slice(0, limit) : result;
  },
};

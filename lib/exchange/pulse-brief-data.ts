/** Epic 6 — Intelligence Brief content (mock, keyed by tile id). */

export type BriefEvidenceStat = {
  label: string;
  change: string;
};

export type IntelligencePulseBrief = {
  whyItMatters: string;
  evidence: BriefEvidenceStat[];
  drivers: string[];
  relatedSignals: string[];
  forecast: string;
};

export const PULSE_BRIEFS: Record<string, IntelligencePulseBrief> = {
  "agentic-ai": {
    whyItMatters:
      "Agentic systems are moving from demos to production workflows faster than most organizations can retool. The window to build internal capability is narrowing as incumbents embed autonomy into core products.",
    evidence: [
      { label: "GitHub Activity", change: "+214%" },
      { label: "Research Publications", change: "+38%" },
      { label: "Hiring Demand", change: "+181%" },
      { label: "Funding Events", change: "+71%" },
    ],
    drivers: ["OpenAI", "Microsoft", "Google", "Anthropic"],
    relatedSignals: ["CUDA", "Cloud Infrastructure", "Cybersecurity", "Autonomous Systems"],
    forecast:
      "Over the next year, agent frameworks will become default infrastructure for software teams. Late adopters will compete on integration speed, not model access alone.",
  },
  cuda: {
    whyItMatters:
      "GPU compute is the binding constraint on AI progress. Every major model release intensifies competition for CUDA-class capacity and the talent to operate it.",
    evidence: [
      { label: "GitHub Activity", change: "+186%" },
      { label: "Research Publications", change: "+29%" },
      { label: "Hiring Demand", change: "+142%" },
      { label: "Funding Events", change: "+58%" },
    ],
    drivers: ["NVIDIA", "Microsoft", "Google", "Amazon"],
    relatedSignals: ["Agentic AI", "Semiconductor Supply Chain", "Cloud Infrastructure"],
    forecast:
      "Inference demand will outpace training within eighteen months. Firms that secure long-term compute contracts now will ship features others cannot.",
  },
  "semiconductor-supply-chain": {
    whyItMatters:
      "Advanced packaging and geopolitical alignment now determine who can build AI at scale. Supply security has become a board-level risk, not a procurement detail.",
    evidence: [
      { label: "GitHub Activity", change: "+124%" },
      { label: "Research Publications", change: "+22%" },
      { label: "Hiring Demand", change: "+98%" },
      { label: "Funding Events", change: "+64%" },
    ],
    drivers: ["TSMC", "NVIDIA", "Intel", "Samsung"],
    relatedSignals: ["CUDA", "Quantum Computing", "Robotics"],
    forecast:
      "Regional diversification will accelerate through 2027. Companies without dual-source strategies face multi-quarter delays on every hardware roadmap.",
  },
  "humanoid-robotics": {
    whyItMatters:
      "Bipedal robots are crossing from laboratory curiosity to warehouse pilot. Labor shortages and falling actuator costs make deployment economics plausible for the first time.",
    evidence: [
      { label: "GitHub Activity", change: "+98%" },
      { label: "Research Publications", change: "+19%" },
      { label: "Hiring Demand", change: "+76%" },
      { label: "Funding Events", change: "+52%" },
    ],
    drivers: ["Tesla", "Figure AI", "Boston Dynamics", "Agility Robotics"],
    relatedSignals: ["Robotics", "Autonomous Systems", "Semiconductor Supply Chain"],
    forecast:
      "Expect selective enterprise rollouts in logistics before consumer adoption. The winners will pair hardware reliability with software that learns from deployment data.",
  },
  "quantum-computing": {
    whyItMatters:
      "Error correction milestones are shifting quantum from theoretical advantage to investable roadmap. Capital is arriving before most enterprises have assigned an owner.",
    evidence: [
      { label: "GitHub Activity", change: "+72%" },
      { label: "Research Publications", change: "+44%" },
      { label: "Hiring Demand", change: "+61%" },
      { label: "Funding Events", change: "+48%" },
    ],
    drivers: ["IBM", "Google", "IonQ", "Microsoft"],
    relatedSignals: ["Cybersecurity", "CUDA", "Biotechnology"],
    forecast:
      "Near-term value will concentrate in simulation and cryptography research. Commercial advantage remains years away, but preparation windows are open now.",
  },
  robotics: {
    whyItMatters:
      "Factory automation economics now favor robots over rehiring in several regions. Manufacturers are standardizing on platforms that integrate vision, control, and fleet software.",
    evidence: [
      { label: "GitHub Activity", change: "+88%" },
      { label: "Research Publications", change: "+17%" },
      { label: "Hiring Demand", change: "+94%" },
      { label: "Funding Events", change: "+41%" },
    ],
    drivers: ["ABB", "Fanuc", "Tesla", "Amazon"],
    relatedSignals: ["Humanoid Robotics", "Autonomous Systems", "CUDA"],
    forecast:
      "Industrial robotics will grow fastest in markets with wage pressure and energy volatility. Software margins will exceed hardware margins within the decade.",
  },
  "autonomous-systems": {
    whyItMatters:
      "Autonomy is migrating from vehicles to warehouses, ports, and airspace. Shared perception stacks mean breakthroughs in one domain accelerate others.",
    evidence: [
      { label: "GitHub Activity", change: "+76%" },
      { label: "Research Publications", change: "+15%" },
      { label: "Hiring Demand", change: "+82%" },
      { label: "Funding Events", change: "+36%" },
    ],
    drivers: ["Waymo", "Tesla", "Amazon", "Anduril"],
    relatedSignals: ["Robotics", "Cybersecurity", "Cloud Infrastructure"],
    forecast:
      "Regulatory clarity in key markets will unlock capital faster than technical progress. Operators with safety data will compound advantage.",
  },
  cybersecurity: {
    whyItMatters:
      "Generative attacks are rewriting threat models faster than legacy defenses adapt. Boards are treating AI-native security as mandatory, not optional.",
    evidence: [
      { label: "GitHub Activity", change: "+64%" },
      { label: "Research Publications", change: "+12%" },
      { label: "Hiring Demand", change: "+88%" },
      { label: "Funding Events", change: "+33%" },
    ],
    drivers: ["CrowdStrike", "Microsoft", "Palo Alto Networks", "Google"],
    relatedSignals: ["Agentic AI", "Cloud Infrastructure", "Quantum Computing"],
    forecast:
      "Defense spending will shift toward continuous verification and identity-first architecture. Reactive tooling loses share to systems that model attacker behavior.",
  },
  "cloud-infrastructure": {
    whyItMatters:
      "Hyperscalers are competing on inference latency and cost per token. Cloud strategy is now AI strategy, and procurement cycles are shortening.",
    evidence: [
      { label: "GitHub Activity", change: "+58%" },
      { label: "Research Publications", change: "+11%" },
      { label: "Hiring Demand", change: "+74%" },
      { label: "Funding Events", change: "+28%" },
    ],
    drivers: ["Amazon", "Microsoft", "Google", "Oracle"],
    relatedSignals: ["CUDA", "Agentic AI", "Cybersecurity"],
    forecast:
      "Multi-cloud inference orchestration will become standard for enterprises avoiding vendor lock-in. Price competition intensifies as utilization rates climb.",
  },
  biotechnology: {
    whyItMatters:
      "AI-designed molecules are reaching trials in months rather than years. Pharmaceutical pipelines are being restructured around computational discovery teams.",
    evidence: [
      { label: "GitHub Activity", change: "+52%" },
      { label: "Research Publications", change: "+31%" },
      { label: "Hiring Demand", change: "+68%" },
      { label: "Funding Events", change: "+45%" },
    ],
    drivers: ["DeepMind", "Recursion", "Moderna", "Roche"],
    relatedSignals: ["Quantum Computing", "Fusion Energy", "Agentic AI"],
    forecast:
      "Regulatory frameworks will adapt to AI-assisted trials, but unevenly across regions. Early movers gain compound data advantages in target identification.",
  },
  "spatial-computing": {
    whyItMatters:
      "Enterprise training and design workflows are proving mixed reality ROI where consumer adoption stalled. Hardware comfort and software maturity are aligning.",
    evidence: [
      { label: "GitHub Activity", change: "+41%" },
      { label: "Research Publications", change: "+9%" },
      { label: "Hiring Demand", change: "+54%" },
      { label: "Funding Events", change: "+22%" },
    ],
    drivers: ["Apple", "Microsoft", "Meta", "Magic Leap"],
    relatedSignals: ["Robotics", "Autonomous Systems", "Cloud Infrastructure"],
    forecast:
      "B2B adoption will lead consumer markets for several years. Platforms that integrate with existing CAD and LMS tools will capture durable share.",
  },
  "fusion-energy": {
    whyItMatters:
      "Net energy gain milestones are pulling private capital into timelines once considered science fiction. Energy security concerns amplify every breakthrough announcement.",
    evidence: [
      { label: "GitHub Activity", change: "+38%" },
      { label: "Research Publications", change: "+26%" },
      { label: "Hiring Demand", change: "+47%" },
      { label: "Funding Events", change: "+62%" },
    ],
    drivers: ["Commonwealth Fusion", "Helion", "TAE Technologies", "Google"],
    relatedSignals: ["Semiconductor Supply Chain", "Biotechnology", "Robotics"],
    forecast:
      "Commercial fusion remains distant, but grid-adjacent applications may arrive sooner than consensus expects. Policy support will determine regional winners.",
  },
};

export function getPulseBrief(tileId: string): IntelligencePulseBrief | undefined {
  return PULSE_BRIEFS[tileId];
}

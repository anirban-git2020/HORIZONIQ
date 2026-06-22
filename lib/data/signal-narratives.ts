import type { RoleId } from "@/lib/types";

export interface SignalNarrative {
  whyItMatters: string;
  affects: string[];
  roleAction: Partial<Record<RoleId, string>>;
}

/** Story layer for each signal — why, what, and what to do. */
export const SIGNAL_NARRATIVES: Record<string, SignalNarrative> = {
  "ai-agents": {
    whyItMatters:
      "Knowledge work is being restructured around systems that plan and execute — not just answer questions.",
    affects: ["Software", "Operations", "Customer support", "Research"],
    roleAction: {
      student: "Build one agent that completes a multi-step task and add it to your portfolio.",
      professional: "Identify three workflows in your team that agents could own this quarter.",
      entrepreneur: "Validate one painful workflow and ship a narrow agent MVP within 30 days.",
    },
  },
  "multimodal-models": {
    whyItMatters:
      "Software interfaces are shifting from text-only to unified vision, voice, and document understanding.",
    affects: ["Product design", "Healthcare", "Media", "Legal"],
    roleAction: {
      student: "Ship a project that combines image and text inputs using a multimodal API.",
      professional: "Audit document-heavy processes that multimodal tools could compress.",
      entrepreneur: "Pick one vertical where multimodal replaces a manual review step.",
    },
  },
  "edge-ai": {
    whyItMatters:
      "Private, low-latency intelligence on-device unlocks regulated and offline use cases cloud AI cannot serve.",
    affects: ["Mobile", "IoT", "Manufacturing", "Healthcare devices"],
    roleAction: {
      student: "Run a small model locally and document latency vs. cloud tradeoffs.",
      professional: "Evaluate on-device AI for one privacy-sensitive workflow.",
      entrepreneur: "Scope a product where offline intelligence is the core differentiator.",
    },
  },
  "humanoid-robotics": {
    whyItMatters:
      "Physical labor markets face their first credible general-purpose automation wave in decades.",
    affects: ["Warehousing", "Manufacturing", "Logistics", "Facility ops"],
    roleAction: {
      student: "Study ROS basics and simulate one pick-and-place task.",
      professional: "Map which physical tasks on your floor are automatable first.",
      entrepreneur: "Find integration gaps between humanoids and existing operations.",
    },
  },
  "digital-twins": {
    whyItMatters:
      "Operators can test decisions virtually before committing expensive physical changes.",
    affects: ["Manufacturing", "Energy grids", "Smart cities", "Supply chain"],
    roleAction: {
      student: "Build a simple digital twin of a physical process in simulation.",
      professional: "Pilot a twin for one high-cost production line decision.",
      entrepreneur: "Target mid-market factories lacking affordable twin tooling.",
    },
  },
  "predictive-maintenance": {
    whyItMatters:
      "Unplanned downtime costs more than prevention — sensor + ML makes failure predictable.",
    affects: ["Industrial equipment", "Fleet", "Utilities", "Aviation"],
    roleAction: {
      student: "Train a failure-prediction model on an open sensor dataset.",
      professional: "Instrument one critical asset and measure downtime reduction.",
      entrepreneur: "Offer a retrofit package for one class of legacy machinery.",
    },
  },
  "ai-protein-design": {
    whyItMatters:
      "Discovery timelines for drugs and materials are compressing from years to months.",
    affects: ["Pharma", "Materials", "Agriculture", "Research labs"],
    roleAction: {
      student: "Complete one computational biology project using public protein data.",
      professional: "Track how AI design tools change your R&D pipeline.",
      entrepreneur: "Identify one discovery bottleneck AI design could remove.",
    },
  },
  "ai-diagnostics": {
    whyItMatters:
      "Clinical decision-making is being augmented before full automation — early movers set standards.",
    affects: ["Hospitals", "Imaging", "Primary care", "Insurance"],
    roleAction: {
      student: "Study one FDA-cleared AI diagnostic and how it integrates clinically.",
      professional: "Pilot decision-support in a low-risk diagnostic workflow.",
      entrepreneur: "Interview clinicians about one imaging or triage pain point.",
    },
  },
  "synthetic-biology": {
    whyItMatters:
      "Manufacturing is shifting toward biological production — new supply chains are forming.",
    affects: ["Food", "Materials", "Medicine", "Chemicals"],
    roleAction: {
      student: "Explore bioinformatics tools and one engineered-cell case study.",
      professional: "Assess where biological production could replace your inputs.",
      entrepreneur: "Validate demand for one bio-manufactured alternative product.",
    },
  },
  "grid-storage": {
    whyItMatters:
      "Storage is the bottleneck between cheap renewable energy and a reliable grid.",
    affects: ["Utilities", "Renewables", "Commercial real estate", "Data centers"],
    roleAction: {
      student: "Model a solar-plus-storage system and its dispatch economics.",
      professional: "Evaluate storage for one site with clear ROI potential.",
      entrepreneur: "Scope an install or integration offer for commercial storage.",
    },
  },
  "next-gen-solar": {
    whyItMatters:
      "Higher-efficiency cells change the economics of every new solar deployment.",
    affects: ["Solar installers", "Utilities", "Construction", "Manufacturing"],
    roleAction: {
      student: "Compare current vs. next-gen cell efficiency and cost curves.",
      professional: "Revisit procurement assumptions for upcoming solar projects.",
      entrepreneur: "Track which next-gen cells are reaching commercial scale first.",
    },
  },
  "carbon-removal": {
    whyItMatters:
      "Credible removal supply is becoming a requirement for net-zero commitments.",
    affects: ["Energy", "Aviation", "Corporate sustainability", "Policy"],
    roleAction: {
      student: "Research one engineered removal method and its cost trajectory.",
      professional: "Map how removal fits into your organization's carbon plan.",
      entrepreneur: "Identify buyers willing to pay for verified removal today.",
    },
  },
  "embedded-finance": {
    whyItMatters:
      "Any product company can now become a financial services distributor.",
    affects: ["SaaS", "Retail", "Marketplaces", "Platforms"],
    roleAction: {
      student: "Integrate a payments or lending API into a demo app.",
      professional: "Evaluate one embedded finance feature for your product.",
      entrepreneur: "Find a distribution wedge where finance increases retention.",
    },
  },
  "real-time-payments": {
    whyItMatters:
      "Instant settlement changes treasury, cash flow, and customer expectations globally.",
    affects: ["Banking", "Payroll", "E-commerce", "B2B payments"],
    roleAction: {
      student: "Study how real-time rails differ from ACH and card networks.",
      professional: "Assess treasury impact if your flows moved to instant settlement.",
      entrepreneur: "Build on instant rails where speed is the product advantage.",
    },
  },
  "asset-tokenization": {
    whyItMatters:
      "Illiquid assets gain new liquidity and fractional ownership models.",
    affects: ["Real estate", "Private equity", "Commodities", "Art"],
    roleAction: {
      student: "Learn tokenization basics and one live market structure.",
      professional: "Track regulatory shifts affecting asset representation.",
      entrepreneur: "Validate demand for fractional access to one asset class.",
    },
  },
  "reusable-launch": {
    whyItMatters:
      "Falling launch costs unlock orbital businesses that were economically impossible.",
    affects: ["Satellites", "Defense", "Telecom", "Earth observation"],
    roleAction: {
      student: "Follow launch cost curves and one new orbital business model.",
      professional: "Assess how cheaper access changes your industry's supply chain.",
      entrepreneur: "Scope a venture enabled only by sub-$1M launch economics.",
    },
  },
  "satellite-connectivity": {
    whyItMatters:
      "Global coverage removes the connectivity constraint for remote operations.",
    affects: ["Maritime", "Aviation", "Rural telecom", "IoT"],
    roleAction: {
      student: "Compare direct-to-device vs. traditional satellite architectures.",
      professional: "Evaluate satellite backup for one connectivity-critical operation.",
      entrepreneur: "Find use cases where global coverage unlocks a new service.",
    },
  },
  "in-space-manufacturing": {
    whyItMatters:
      "Microgravity enables materials and pharmaceuticals impossible to produce on Earth.",
    affects: ["Pharma", "Semiconductors", "Fiber optics", "Research"],
    roleAction: {
      student: "Research one in-orbit manufacturing pilot and its economics.",
      professional: "Track which materials gain real cost advantage in orbit.",
      entrepreneur: "Identify early buyers for one space-made material or drug.",
    },
  },
  "ai-threats": {
    whyItMatters:
      "Attack volume and sophistication are scaling with AI — defense must match pace.",
    affects: ["Every organization", "Finance", "Healthcare", "Government"],
    roleAction: {
      student: "Complete security fundamentals and one AI-threat lab exercise.",
      professional: "Enable phishing-resistant auth and review AI attack surfaces.",
      entrepreneur: "Target SMBs lacking automated defense against AI phishing.",
    },
  },
  "zero-trust": {
    whyItMatters:
      "Perimeter security fails when work is distributed — identity becomes the boundary.",
    affects: ["Enterprise IT", "Remote work", "Cloud", "SaaS"],
    roleAction: {
      student: "Learn zero-trust principles and one identity provider architecture.",
      professional: "Migrate one critical system to identity-first access.",
      entrepreneur: "Build tooling that makes zero-trust achievable for SMBs.",
    },
  },
  "post-quantum-crypto": {
    whyItMatters:
      "Harvest-now-decrypt-later attacks mean migration cannot wait for quantum hardware.",
    affects: ["Banking", "Government", "Healthcare", "Critical infrastructure"],
    roleAction: {
      student: "Study NIST post-quantum standards and one migration path.",
      professional: "Inventory systems using vulnerable encryption today.",
      entrepreneur: "Scope audit or migration tooling for early enterprise adopters.",
    },
  },
  "error-correction": {
    whyItMatters:
      "Useful quantum machines depend on error correction — timelines are accelerating.",
    affects: ["Cryptography", "Drug discovery", "Materials", "Finance"],
    roleAction: {
      student: "Run a simple quantum circuit and study error rates.",
      professional: "Track quantum timelines for your industry's crypto exposure.",
      entrepreneur: "Explore software layers that abstract quantum hardware complexity.",
    },
  },
  "post-quantum-migration": {
    whyItMatters:
      "Multi-year migrations must start now — late movers face compounding risk.",
    affects: ["PKI infrastructure", "VPNs", "Code signing", "Data at rest"],
    roleAction: {
      student: "Map which algorithms NIST has standardized for replacement.",
      professional: "Draft a phased migration plan for your highest-risk systems.",
      entrepreneur: "Offer migration assessment as a focused consulting wedge.",
    },
  },
  "quantum-networking": {
    whyItMatters:
      "Quantum networks may redefine secure communication for sensitive industries.",
    affects: ["Defense", "Finance", "Telecom", "Research"],
    roleAction: {
      student: "Follow one quantum networking pilot and its use case.",
      professional: "Monitor secure-comms requirements in your sector.",
      entrepreneur: "Track government and enterprise R&D funding in this space.",
    },
  },
};

export function getSignalNarrative(
  signalId: string,
  role: RoleId
): { whyItMatters: string; affects: string[]; action: string } {
  const n = SIGNAL_NARRATIVES[signalId];
  if (!n) {
    return {
      whyItMatters: "This shift is gaining momentum across multiple sectors.",
      affects: ["Industry", "Workforce", "Markets"],
      action: "Track this signal weekly and note one concrete implication for your goals.",
    };
  }
  return {
    whyItMatters: n.whyItMatters,
    affects: n.affects,
    action: n.roleAction[role] ?? n.roleAction.entrepreneur ?? n.roleAction.professional ?? "Track this signal weekly.",
  };
}

import type { RoleId } from "@/lib/types";

export interface EvidenceDriver {
  label: string;
  value: number; // percentage change or 0-100 score
  unit?: "%" | "score";
}

export interface SignalIntelligence {
  causedBy: string[];
  impacts: string[];
  benefits: string[];
  /** Recommended verbs — Learn, Build, Invest, etc. */
  actions: string[];
  momentumDrivers: EvidenceDriver[];
  confidenceFactors: EvidenceDriver[];
  /** Causal chain for the living map (driver → signal → outcome). */
  chain: { id: string; label: string; type: "driver" | "signal" | "outcome" }[];
}

const DEFAULT_ACTIONS: Record<RoleId, string[]> = {
  student: ["Learn", "Practice", "Apply"],
  professional: ["Adopt", "Lead", "Upskill"],
  entrepreneur: ["Build", "Validate", "Launch"],
  investor: ["Invest", "Monitor", "Allocate"],
};

/** Curated relationship + evidence data per signal seed id. */
export const SIGNAL_INTELLIGENCE: Record<string, SignalIntelligence> = {
  "grid-storage": {
    causedBy: ["Battery breakthroughs", "Renewable deployment", "Grid modernization"],
    impacts: ["Utilities", "Manufacturing", "Electric vehicles"],
    benefits: ["Entrepreneurs", "Engineers", "Investors"],
    actions: ["Learn", "Build", "Invest"],
    momentumDrivers: [
      { label: "Job growth", value: 24, unit: "%" },
      { label: "Patent growth", value: 31, unit: "%" },
      { label: "Funding growth", value: 18, unit: "%" },
      { label: "Research activity", value: 22, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 88, unit: "score" },
      { label: "Data consistency", value: 84, unit: "score" },
      { label: "Regional adoption", value: 82, unit: "score" },
    ],
    chain: [
      { id: "battery-tech", label: "Battery Technology", type: "driver" },
      { id: "grid-storage", label: "Grid Storage", type: "signal" },
      { id: "renewables", label: "Renewables", type: "outcome" },
      { id: "energy-security", label: "Energy Security", type: "outcome" },
    ],
  },
  "ai-agents": {
    causedBy: ["Foundation models", "Tool use APIs", "Enterprise automation demand"],
    impacts: ["Knowledge work", "Customer ops", "Software development"],
    benefits: ["Students", "Professionals", "Entrepreneurs"],
    actions: ["Learn", "Automate", "Build"],
    momentumDrivers: [
      { label: "Job growth", value: 38, unit: "%" },
      { label: "Patent growth", value: 29, unit: "%" },
      { label: "Funding growth", value: 42, unit: "%" },
      { label: "Research activity", value: 35, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 91, unit: "score" },
      { label: "Data consistency", value: 86, unit: "score" },
      { label: "Regional adoption", value: 88, unit: "score" },
    ],
    chain: [
      { id: "foundation-models", label: "Foundation Models", type: "driver" },
      { id: "ai-agents", label: "AI Agents", type: "signal" },
      { id: "workflow-automation", label: "Workflow Automation", type: "outcome" },
      { id: "labor-shift", label: "Labor Restructuring", type: "outcome" },
    ],
  },
  "humanoid-robotics": {
    causedBy: ["Actuator costs falling", "AI perception advances", "Labor shortages"],
    impacts: ["Warehousing", "Manufacturing", "Logistics"],
    benefits: ["Engineers", "Operators", "Investors"],
    actions: ["Learn", "Pilot", "Invest"],
    momentumDrivers: [
      { label: "Job growth", value: 19, unit: "%" },
      { label: "Patent growth", value: 44, unit: "%" },
      { label: "Funding growth", value: 36, unit: "%" },
      { label: "Research activity", value: 28, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 76, unit: "score" },
      { label: "Data consistency", value: 72, unit: "score" },
      { label: "Regional adoption", value: 74, unit: "score" },
    ],
    chain: [
      { id: "ai-perception", label: "AI Perception", type: "driver" },
      { id: "humanoid-robotics", label: "Humanoid Robotics", type: "signal" },
      { id: "physical-automation", label: "Physical Automation", type: "outcome" },
    ],
  },
  "digital-twins": {
    causedBy: ["IoT sensors", "Cloud simulation", "Industrial digitization"],
    impacts: ["Factories", "Energy grids", "Supply chains"],
    benefits: ["Engineers", "Operators", "Entrepreneurs"],
    actions: ["Learn", "Deploy", "Build"],
    momentumDrivers: [
      { label: "Job growth", value: 21, unit: "%" },
      { label: "Patent growth", value: 26, unit: "%" },
      { label: "Funding growth", value: 19, unit: "%" },
      { label: "Research activity", value: 24, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 85, unit: "score" },
      { label: "Data consistency", value: 81, unit: "score" },
      { label: "Regional adoption", value: 80, unit: "score" },
    ],
    chain: [
      { id: "iot-sensors", label: "IoT Sensors", type: "driver" },
      { id: "digital-twins", label: "Digital Twins", type: "signal" },
      { id: "simulation-ops", label: "Simulation Ops", type: "outcome" },
    ],
  },
  "embedded-finance": {
    causedBy: ["Banking APIs", "Regulatory sandboxes", "Platform economics"],
    impacts: ["SaaS", "Retail", "Marketplaces"],
    benefits: ["Entrepreneurs", "Product teams", "Investors"],
    actions: ["Integrate", "Launch", "Invest"],
    momentumDrivers: [
      { label: "Job growth", value: 17, unit: "%" },
      { label: "Patent growth", value: 14, unit: "%" },
      { label: "Funding growth", value: 33, unit: "%" },
      { label: "Research activity", value: 16, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 82, unit: "score" },
      { label: "Data consistency", value: 79, unit: "score" },
      { label: "Regional adoption", value: 81, unit: "score" },
    ],
    chain: [
      { id: "banking-apis", label: "Banking APIs", type: "driver" },
      { id: "embedded-finance", label: "Embedded Finance", type: "signal" },
      { id: "platform-revenue", label: "Platform Revenue", type: "outcome" },
    ],
  },
  "ai-diagnostics": {
    causedBy: ["Medical imaging AI", "Clinical datasets", "Regulatory pathways"],
    impacts: ["Hospitals", "Imaging centers", "Primary care"],
    benefits: ["Clinicians", "Patients", "Healthtech founders"],
    actions: ["Learn", "Pilot", "Invest"],
    momentumDrivers: [
      { label: "Job growth", value: 22, unit: "%" },
      { label: "Patent growth", value: 27, unit: "%" },
      { label: "Funding growth", value: 29, unit: "%" },
      { label: "Research activity", value: 31, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 80, unit: "score" },
      { label: "Data consistency", value: 76, unit: "score" },
      { label: "Regional adoption", value: 78, unit: "score" },
    ],
    chain: [
      { id: "medical-imaging", label: "Medical Imaging AI", type: "driver" },
      { id: "ai-diagnostics", label: "AI Diagnostics", type: "signal" },
      { id: "clinical-outcomes", label: "Clinical Outcomes", type: "outcome" },
    ],
  },
  "ai-threats": {
    causedBy: ["Generative AI", "Automated phishing", "Exploit tooling"],
    impacts: ["Enterprises", "SMBs", "Critical infrastructure"],
    benefits: ["Security teams", "Vendors", "Investors"],
    actions: ["Harden", "Monitor", "Invest"],
    momentumDrivers: [
      { label: "Job growth", value: 26, unit: "%" },
      { label: "Patent growth", value: 18, unit: "%" },
      { label: "Funding growth", value: 34, unit: "%" },
      { label: "Research activity", value: 20, unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: 86, unit: "score" },
      { label: "Data consistency", value: 78, unit: "score" },
      { label: "Regional adoption", value: 83, unit: "score" },
    ],
    chain: [
      { id: "gen-ai", label: "Generative AI", type: "driver" },
      { id: "ai-threats", label: "AI Cyber Threats", type: "signal" },
      { id: "defense-spend", label: "Defense Spending", type: "outcome" },
    ],
  },
};

function synthesize(seedId: string, name: string): SignalIntelligence {
  const hash = seedId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const v = (base: number, i: number) => base + (hash % (8 + i * 3));

  return {
    causedBy: ["Technology advances", "Market demand", "Policy shifts"],
    impacts: ["Industry", "Workforce", "Supply chains"],
    benefits: ["Builders", "Operators", "Capital"],
    actions: ["Learn", "Build", "Monitor"],
    momentumDrivers: [
      { label: "Job growth", value: v(14, 0), unit: "%" },
      { label: "Patent growth", value: v(18, 1), unit: "%" },
      { label: "Funding growth", value: v(12, 2), unit: "%" },
      { label: "Research activity", value: v(16, 3), unit: "%" },
    ],
    confidenceFactors: [
      { label: "Source count", value: v(72, 4), unit: "score" },
      { label: "Data consistency", value: v(70, 5), unit: "score" },
      { label: "Regional adoption", value: v(68, 6), unit: "score" },
    ],
    chain: [
      { id: `${seedId}-driver`, label: "Enabling Tech", type: "driver" },
      { id: seedId, label: name, type: "signal" },
      { id: `${seedId}-outcome`, label: "Market Shift", type: "outcome" },
    ],
  };
}

export function getSignalIntelligence(
  seedId: string,
  signalName: string,
  role: RoleId
): SignalIntelligence & { roleActions: string[] } {
  const base = SIGNAL_INTELLIGENCE[seedId] ?? synthesize(seedId, signalName);
  const roleActions =
    role === "student"
      ? ["Learn", "Practice", base.actions[2] ?? "Apply"]
      : role === "professional"
        ? ["Adopt", "Lead", "Upskill"]
        : role === "investor"
          ? ["Invest", "Monitor", "Allocate"]
          : base.actions;

  return { ...base, actions: roleActions, roleActions };
}

/** Extract seed id from composed view id e.g. "climate-grid-storage" → "grid-storage" */
export function extractSeedId(viewId: string): string {
  const parts = viewId.split("-");
  if (parts.length <= 1) return viewId;
  // interest prefix is single word; seed ids can be multi-part
  return parts.slice(1).join("-");
}

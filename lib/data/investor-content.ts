import type { ActionSeed, InterestId, SkillSeed } from "@/lib/types";

export const INVESTOR_SKILLS: Record<InterestId, SkillSeed[]> = {
  ai: [
    { name: "AI Sector Thesis", demand: "Critical", summary: "Map winners in the agentic AI stack." },
    { name: "Venture Diligence", demand: "High", summary: "Evaluate AI startups on moat and distribution." },
    { name: "Capital Deployment", demand: "High", summary: "Stage-gate checks for AI infrastructure bets." },
  ],
  robotics: [
    { name: "Industrial Automation ROI", demand: "High", summary: "Model payback on robotics deployments." },
    { name: "Hardware Supply Chain", demand: "Growing", summary: "Track component bottlenecks and margins." },
    { name: "Automation Roll-up Thesis", demand: "Growing", summary: "Identify consolidation plays in logistics." },
  ],
  biotech: [
    { name: "HealthTech Valuation", demand: "High", summary: "Price clinical-stage and diagnostics platforms." },
    { name: "Regulatory Risk Mapping", demand: "High", summary: "Assess FDA and reimbursement pathways." },
    { name: "Bio Platform Investing", demand: "Growing", summary: "Compare programmable biology business models." },
  ],
  climate: [
    { name: "Energy Transition Flows", demand: "Critical", summary: "Track capital into storage and grids." },
    { name: "Project Finance", demand: "High", summary: "Structure and underwrite clean energy assets." },
    { name: "Carbon Market Analysis", demand: "Growing", summary: "Evaluate credits and removal supply." },
  ],
  fintech: [
    { name: "Embedded Finance TAM", demand: "High", summary: "Size distribution-led fintech opportunities." },
    { name: "Payments Economics", demand: "High", summary: "Model take rates and network effects." },
    { name: "Regulatory Moats", demand: "Growing", summary: "Identify licensed vs. unlicensed plays." },
  ],
  space: [
    { name: "Space Infrastructure", demand: "Growing", summary: "Invest in launch, comms, and EO stacks." },
    { name: "Geospatial Data Moats", demand: "High", summary: "Evaluate vertical EO data businesses." },
    { name: "Defense Adjacency", demand: "Growing", summary: "Map dual-use space revenue streams." },
  ],
  cybersecurity: [
    { name: "Security Spend Trends", demand: "High", summary: "Track AI-native security budget shifts." },
    { name: "SMB Security TAM", demand: "High", summary: "Size underserved managed security markets." },
    { name: "Zero Trust Adoption", demand: "Growing", summary: "Follow enterprise identity migration." },
  ],
  quantum: [
    { name: "Deep Tech Timelines", demand: "Growing", summary: "Stage quantum bets across horizons." },
    { name: "Post-Quantum Risk", demand: "High", summary: "Invest in migration and audit tooling." },
    { name: "Government R&D Flows", demand: "Growing", summary: "Track grants and sovereign programs." },
  ],
};

export const INVESTOR_ACTIONS: Record<InterestId, ActionSeed[]> = {
  ai: [
    { title: "Map the agentic AI stack", detail: "Identify infrastructure, application, and services layers with clearest capital efficiency.", priority: "High" },
    { title: "Track quarterly funding velocity", detail: "Compare deal volume in your focus vertical vs. 12-month baseline.", priority: "Medium" },
  ],
  robotics: [
    { title: "Model automation ROI cases", detail: "Build a simple payback model for one warehouse or factory retrofit.", priority: "High" },
    { title: "Scan roll-up candidates", detail: "List three integration businesses with recurring revenue potential.", priority: "Medium" },
  ],
  biotech: [
    { title: "Screen diagnostics platforms", detail: "Compare three AI diagnostics companies on regulatory path and TAM.", priority: "High" },
    { title: "Review clinical milestones", detail: "Track upcoming readouts that could re-rate the sector.", priority: "Medium" },
  ],
  climate: [
    { title: "Follow storage deployment data", detail: "Monitor install growth in your target region for entry timing.", priority: "High" },
    { title: "Map project finance partners", detail: "Identify banks and funds active in your energy sub-sector.", priority: "Medium" },
  ],
  fintech: [
    { title: "Size embedded finance wedges", detail: "Quantify TAM for one vertical distribution play.", priority: "High" },
    { title: "Compare take-rate benchmarks", detail: "Benchmark unit economics against public comps.", priority: "Medium" },
  ],
  space: [
    { title: "Evaluate EO data moats", detail: "Assess defensibility of one geospatial data product.", priority: "High" },
    { title: "Track launch cost curves", detail: "Update assumptions on orbital business viability.", priority: "Medium" },
  ],
  cybersecurity: [
    { title: "Quantify SMB security gap", detail: "Estimate spend per seat for underserved segments.", priority: "High" },
    { title: "Monitor AI threat spend", detail: "Track budget line items shifting to AI-native defense.", priority: "Medium" },
  ],
  quantum: [
    { title: "Stage quantum-safe bets", detail: "Separate near-term migration tools from long-horizon hardware.", priority: "Medium" },
    { title: "Review sovereign programs", detail: "Map government funding flows in your region.", priority: "Medium" },
  ],
};

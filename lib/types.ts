export type RoleId =
  | "student"
  | "professional"
  | "entrepreneur"
  | "investor";

export type RegionId =
  | "north-america"
  | "europe"
  | "india"
  | "china"
  | "southeast-asia"
  | "middle-east"
  | "africa"
  | "latin-america";

export type InterestCategory =
  | "technology"
  | "industry"
  | "business"
  | "science"
  | "arts-commerce";

export type InterestId =
  | "artificial-intelligence"
  | "robotics"
  | "quantum-computing"
  | "cybersecurity"
  | "cloud-computing"
  | "manufacturing"
  | "supply-chain"
  | "healthcare"
  | "finance"
  | "energy"
  | "biotechnology"
  | "biochemistry"
  | "life-sciences"
  | "arts"
  | "commerce"
  | "entrepreneurship"
  | "startups"
  | "venture-capital"
  | "product-management";

export type ChangeType = "new" | "rising" | "falling" | "stable";
export type DemandChange = "new" | "rising" | "falling" | "stable";
export type GrowthChange = "new" | "rising" | "falling" | "stable";

export interface Preferences {
  role: RoleId | null;
  region: RegionId | null;
  interests: InterestId[];
}

export type Demand = "Critical" | "High" | "Growing";
export type Priority = "High" | "Medium";

export interface EvidenceDriver {
  label: string;
  value: number;
  unit: "%" | "score";
}

export interface DataSource {
  label: string;
  type: "mock" | "live";
  url?: string;
}

export type IntelligenceConfidenceTier = "high" | "medium" | "low";

export interface IntelligenceEvidence {
  sources: DataSource[];
  lastUpdatedLabel: string;
  regionLabel: string;
  categories: string[];
}

/** Analyst-style reasoning bundle for a single signal (Sprint 2.5A). */
export interface SignalIntelligence {
  whatHappened: string;
  whyItIsHappening: string;
  whyYouShouldCare: string;
  whatToDoNext: string;
  outlook: string;
  confidenceTier: IntelligenceConfidenceTier;
  confidenceExplanation: string;
  evidence: IntelligenceEvidence;
}

export type DashboardSection =
  | "signals"
  | "skills"
  | "opportunities"
  | "actions";

export interface RoleExperience {
  greeting: string;
  article: string;
  lensTitle: string;
  lensSubtitle: string;
  focusAreas: string[];
  skillsTitle: string;
  skillsQuestion: string;
  actionsTitle: string;
  actionsQuestion: string;
  signalsQuestion: string;
  opportunitiesTitle: string;
  opportunitiesQuestion: string;
  sectionOrder: DashboardSection[];
  accentClass: string;
}

export interface SignalView {
  id: string;
  name: string;
  category: string;
  interest: InterestId;
  interestLabel: string;
  currentState: string;
  momentum: number;
  confidence: number;
  previousMomentum: number;
  previousConfidence: number;
  momentumDelta: number;
  confidenceDelta: number;
  change: {
    type: ChangeType;
    summary: string;
  };
  soWhatForYou: string;
  recommendedAction: string;
  explanation: string;
  sources: DataSource[];
  affectedIndustries: string[];
  affectedRoles: string[];
  momentumDrivers: EvidenceDriver[];
  confidenceFactors: EvidenceDriver[];
  relatedSkills: string[];
  relatedOpportunities: string[];
  rank: number;
  whyItChanged: string;
  confidenceExplanation: string;
  roleRelevance: string;
  regionRelevance: string;
  lastUpdated: string;
  lastUpdatedLabel: string;
  intelligence: SignalIntelligence;
}

export interface SkillView {
  id: string;
  name: string;
  demand: Demand;
  demandChange: DemandChange;
  changeSummary: string;
  summary: string;
  interest: InterestId;
  interestLabel: string;
}

export interface OpportunityView {
  id: string;
  title: string;
  sector: string;
  growth: number;
  growthChange: GrowthChange;
  changeSummary: string;
  summary: string;
  angle: string;
  hubs: string[];
  regionLabel: string;
  interest: InterestId;
  interestLabel: string;
}

export interface ActionView {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  isPrimary: boolean;
  changeReason: string;
  interest: InterestId | null;
  interestLabel: string | null;
}

export interface Briefing {
  summary: string;
  regionContext: string;
  hubs: string[];
  briefingPeriod: string;
  briefingLabel: string;
  stats: {
    signals: number;
    skills: number;
    opportunities: number;
    actions: number;
  };
}

export interface ChangeItem {
  signal: SignalView;
  whyItChanged: string;
  whyItMatters: string;
  action: string;
  visitChange?: {
    momentumDelta: number;
    confidenceDelta: number;
    previousMomentum?: number;
    previousConfidence?: number;
  };
}

export interface SignalChangeGroup {
  bucket: "new" | "rising" | "falling";
  label: string;
  items: ChangeItem[];
}

export interface WhatChangedBriefing {
  title: string;
  subtitle: string;
  isReturnVisit: boolean;
  lastVisitAt: string | null;
  primaryAction: ActionView | null;
  groups: SignalChangeGroup[];
  changes: ChangeItem[];
  briefingPeriod: string;
  briefingLabel: string;
  updatedAt: string;
  updatedLabel: string;
}

/** @deprecated Use RoleExperience */
export type RoleContent = Pick<
  RoleExperience,
  | "greeting"
  | "article"
  | "skillsTitle"
  | "skillsQuestion"
  | "actionsTitle"
  | "actionsQuestion"
  | "signalsQuestion"
  | "opportunitiesQuestion"
>;

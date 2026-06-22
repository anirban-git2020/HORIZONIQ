export type RoleId =
  | "student"
  | "professional"
  | "entrepreneur"
  | "investor";

export type RegionId =
  | "north-america"
  | "europe"
  | "asia-pacific"
  | "middle-east-africa"
  | "latin-america"
  | "global";

export type InterestId =
  | "ai"
  | "robotics"
  | "biotech"
  | "climate"
  | "fintech"
  | "space"
  | "cybersecurity"
  | "quantum";

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

export interface SignalSeed {
  id: string;
  name: string;
  category: string;
  momentum: number;
  confidence: number;
  summary: string;
  roleImpact: Partial<Record<RoleId, string>> & {
    student: string;
    professional: string;
    entrepreneur: string;
  };
}

export interface SkillSeed {
  name: string;
  demand: Demand;
  summary: string;
}

export interface OpportunitySeed {
  id: string;
  title: string;
  sector: string;
  baseGrowth: number;
  summary: string;
  roleAngle: Partial<Record<RoleId, string>> & {
    student: string;
    professional: string;
    entrepreneur: string;
  };
}

export interface ActionSeed {
  title: string;
  detail: string;
  priority: Priority;
}

export interface InterestContent {
  signals: SignalSeed[];
  skills: Record<"student" | "professional" | "entrepreneur", SkillSeed[]>;
  opportunities: OpportunitySeed[];
  actions: Record<"student" | "professional" | "entrepreneur", ActionSeed[]>;
}

export interface RegionContent {
  hubs: string[];
  context: string;
  hubsByInterest: Partial<Record<InterestId, string[]>>;
  growthBias: Partial<Record<InterestId, number>>;
}

export type DashboardSection =
  | "map"
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
  seedId: string;
  name: string;
  category: string;
  momentum: number;
  confidence: number;
  summary: string;
  impact: string;
  whyItMatters: string;
  causedBy: string[];
  impacts: string[];
  benefits: string[];
  actions: string[];
  momentumDrivers: EvidenceDriver[];
  confidenceFactors: EvidenceDriver[];
  rank: number;
  interest: InterestId;
  interestLabel: string;
}

export interface SkillView {
  id: string;
  name: string;
  demand: Demand;
  summary: string;
  interest: InterestId;
  interestLabel: string;
}

export interface OpportunityView {
  id: string;
  title: string;
  sector: string;
  growth: number;
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
  interest: InterestId | null;
  interestLabel: string | null;
}

export interface MapNode {
  id: string;
  label: string;
  type: "driver" | "signal" | "outcome";
  signalSeedId?: string;
  momentum?: number;
}

export interface MapLink {
  source: string;
  target: string;
  strength: number;
}

export interface SignalMapGraph {
  nodes: MapNode[];
  links: MapLink[];
}

export interface Briefing {
  summary: string;
  regionContext: string;
  hubs: string[];
  storyLead: string;
  stats: {
    signals: number;
    skills: number;
    opportunities: number;
    actions: number;
  };
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

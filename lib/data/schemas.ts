import type {
  ChangeType,
  Demand,
  DemandChange,
  GrowthChange,
  InterestId,
  Priority,
  RegionId,
  RoleId,
} from "@/lib/types";

export interface DataSource {
  label: string;
  type: "mock" | "live";
}

export interface EvidenceDriverRaw {
  label: string;
  value: number;
  unit: "%" | "score";
}

export interface SignalChangeRaw {
  type: ChangeType;
  summary: string;
}

export interface PersonalizedTextRaw {
  base: string;
  byRole: Partial<Record<RoleId, string>>;
  byRegion?: Partial<Record<RegionId, string>>;
}

export interface SignalRecord {
  id: string;
  name: string;
  category: string;
  interest: InterestId;
  currentState: string;
  momentum: number;
  confidence: number;
  previousMomentum: number;
  previousConfidence: number;
  change: SignalChangeRaw;
  explanation: PersonalizedTextRaw;
  recommendedAction: PersonalizedTextRaw;
  sources: DataSource[];
  affectedIndustries: string[];
  affectedRoles: string[];
  momentumDrivers: EvidenceDriverRaw[];
  confidenceFactors: EvidenceDriverRaw[];
  relatedSkills: string[];
  relatedOpportunities: string[];
}

export interface SkillRecord {
  id: string;
  name: string;
  demand: Demand;
  demandChange: DemandChange;
  changeSummary: string;
  summary: string;
  interests: InterestId[];
  roles: RoleId[];
}

export interface JobRecord {
  id: string;
  title: string;
  sector: string;
  growth: number;
  growthChange: GrowthChange;
  changeSummary: string;
  summary: string;
  interests: InterestId[];
  roleAngle: Partial<Record<RoleId, string>>;
}

export interface RecommendationRecord {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  interests: InterestId[];
  roles: RoleId[];
  isPrimary: boolean;
  changeReason: string;
}

export interface RegionRecord {
  label: string;
  context: string;
  hubs: string[];
  growthBias: Partial<Record<InterestId, number>>;
}

export interface MetaRecord {
  briefingPeriod: string;
  briefingLabel: string;
  updatedAt: string;
  activeBriefingFile: string;
  refreshSchedule?: string;
}

export type SignalCatalogStatus = "active" | "archived" | "draft";

export interface SignalCatalogRecord {
  id: string;
  name: string;
  category: string;
  interest: InterestId;
  defaultCurrentState: string;
  explanation: PersonalizedTextRaw;
  recommendedAction: PersonalizedTextRaw;
  affectedIndustries: string[];
  affectedRoles: string[];
  relatedSkills: string[];
  relatedOpportunities: string[];
  introducedInPeriod: string;
  status: SignalCatalogStatus;
}

export interface SignalBriefingState {
  signalId: string;
  momentum: number;
  confidence: number;
  previousMomentum: number;
  previousConfidence: number;
  change: SignalChangeRaw;
  currentStateOverride?: string;
  sources: DataSource[];
  momentumDrivers: EvidenceDriverRaw[];
  confidenceFactors: EvidenceDriverRaw[];
}

export interface BriefingRecord {
  briefingPeriod: string;
  briefingLabel: string;
  publishedAt: string;
  dataProvenance: "curated-mock" | "pipeline" | "pipeline-mock";
  buckets: {
    new: string[];
    rising: string[];
    falling: string[];
    stable: string[];
  };
  signalStates: SignalBriefingState[];
}

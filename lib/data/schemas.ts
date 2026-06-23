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
}

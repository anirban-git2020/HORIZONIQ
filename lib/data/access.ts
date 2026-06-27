import metaJson from "@/data/meta.json";
import catalogSignalsJson from "@/data/catalog/signals.json";
import regionsJson from "@/data/regions.json";
import skillsJson from "@/data/skills.json";
import jobsJson from "@/data/jobs.json";
import recommendationsJson from "@/data/recommendations.json";

import { BRIEFINGS_BY_PERIOD } from "@/lib/data/briefings-registry";

import type {
  InterestId,
  Preferences,
  RegionId,
  RoleId,
} from "@/lib/types";
import type {
  BriefingRecord,
  JobRecord,
  MetaRecord,
  RecommendationRecord,
  RegionRecord,
  SignalCatalogRecord,
  SignalRecord,
  SkillRecord,
} from "@/lib/data/schemas";
import { resolveSignalsFromBriefing } from "@/lib/data/resolve-signals";
import { INTEREST_LABEL, REGION_LABEL } from "@/lib/options";

const meta = metaJson as MetaRecord;
const regions = regionsJson as Record<RegionId, RegionRecord>;
const catalogSignals = (
  catalogSignalsJson as { signals: SignalCatalogRecord[] }
).signals;
const skills = (skillsJson as { skills: SkillRecord[] }).skills;
const jobs = (jobsJson as { jobs: JobRecord[] }).jobs;
const recommendations = (
  recommendationsJson as { recommendations: RecommendationRecord[] }
).recommendations;

function getActiveBriefing(): BriefingRecord {
  const briefing = BRIEFINGS_BY_PERIOD[meta.briefingPeriod];
  if (!briefing) {
    throw new Error(
      `No briefing registered for period "${meta.briefingPeriod}" (${meta.activeBriefingFile}). Run npm run pipeline:generate.`
    );
  }
  return briefing;
}

const signals = resolveSignalsFromBriefing(catalogSignals, getActiveBriefing());

export function getMeta(): MetaRecord {
  return meta;
}

export function getDataProvenance(): BriefingRecord["dataProvenance"] {
  return getActiveBriefing().dataProvenance;
}

export function getRefreshSchedule(): string {
  return meta.refreshSchedule ?? "Every Monday at 06:00 UTC";
}

export function getActiveBriefingRecord(): BriefingRecord {
  return getActiveBriefing();
}

export function getCatalogSignals(): SignalCatalogRecord[] {
  return catalogSignals;
}

export function getAllSignals(): SignalRecord[] {
  return signals;
}

export function getSignalById(id: string): SignalRecord | undefined {
  return signals.find((s) => s.id === id);
}

export function getRegion(id: RegionId): RegionRecord {
  return regions[id];
}

export function resolvePersonalizedText(
  text: { base: string; byRole?: Partial<Record<RoleId, string>>; byRegion?: Partial<Record<RegionId, string>> },
  role: RoleId,
  region: RegionId
): string {
  const roleText = text.byRole?.[role] ?? text.base;
  const regionText = text.byRegion?.[region];
  if (regionText) {
    return `${roleText} ${regionText}`;
  }
  return roleText;
}

export function getSoWhatForYou(
  signal: SignalRecord,
  role: RoleId,
  region: RegionId
): string {
  return resolvePersonalizedText(signal.explanation, role, region);
}

export function getRecommendedActionForUser(
  signal: SignalRecord,
  role: RoleId,
  region: RegionId
): string {
  return resolvePersonalizedText(signal.recommendedAction, role, region);
}

function activeInterests(prefs: Preferences): InterestId[] {
  return prefs.interests.length > 0
    ? prefs.interests
    : (["artificial-intelligence"] as InterestId[]);
}

function matchesInterests(
  itemInterests: InterestId[],
  userInterests: InterestId[]
): boolean {
  return itemInterests.some((i) => userInterests.includes(i));
}

export function filterSignalsForUser(prefs: Preferences): SignalRecord[] {
  const interests = activeInterests(prefs);
  return signals.filter((s) => interests.includes(s.interest));
}

export function filterSkillsForUser(prefs: Preferences): SkillRecord[] {
  const role = prefs.role ?? "professional";
  const interests = activeInterests(prefs);
  return skills.filter(
    (s) => s.roles.includes(role) && matchesInterests(s.interests, interests)
  );
}

export function filterJobsForUser(prefs: Preferences): JobRecord[] {
  const interests = activeInterests(prefs);
  return jobs.filter((j) => matchesInterests(j.interests, interests));
}

export function filterRecommendationsForUser(
  prefs: Preferences
): RecommendationRecord[] {
  const role = prefs.role ?? "professional";
  const interests = activeInterests(prefs);
  return recommendations.filter(
    (r) => r.roles.includes(role) && matchesInterests(r.interests, interests)
  );
}

export function getRegionHubs(
  region: RegionId,
  interest: InterestId,
  limit = 3
): string[] {
  const r = regions[region];
  return r.hubs.slice(0, limit);
}

export function getRegionContext(region: RegionId): string {
  return regions[region]?.context ?? "";
}

export function getGrowthWithBias(
  baseGrowth: number,
  region: RegionId,
  interest: InterestId
): number {
  const bias = regions[region]?.growthBias[interest] ?? 0;
  return Math.max(5, Math.min(99, baseGrowth + bias));
}

export function getJobAngle(job: JobRecord, role: RoleId): string {
  return job.roleAngle[role] ?? job.roleAngle.entrepreneur ?? job.summary;
}

export { regions, signals, skills, jobs, recommendations, meta };

export function getInterestLabel(id: InterestId): string {
  return INTEREST_LABEL[id];
}

export function getRegionLabel(id: RegionId): string {
  return REGION_LABEL[id];
}

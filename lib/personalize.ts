import {
  filterJobsForUser,
  filterRecommendationsForUser,
  filterSignalsForUser,
  filterSkillsForUser,
  getGrowthWithBias,
  getJobAngle,
  getMeta,
  getRecommendedActionForUser,
  getRegionContext,
  getRegionHubs,
  getSoWhatForYou,
  getInterestLabel,
  getRegionLabel,
} from "@/lib/data/access";
import type { SignalRecord } from "@/lib/data/schemas";
import { INTEREST_LABEL, REGION_LABEL, ROLE_LABEL } from "@/lib/options";
import type {
  ActionView,
  Briefing,
  ChangeItem,
  OpportunityView,
  Preferences,
  RoleId,
  SignalView,
  SkillView,
  WhatChangedBriefing,
} from "@/lib/types";
import type { SignalVisitChange } from "@/lib/visit-snapshot";

const FALLBACK_ROLE: RoleId = "professional";
const FALLBACK_REGION = "north-america" as const;

const CHANGE_PRIORITY: Record<string, number> = {
  new: 0,
  rising: 1,
  falling: 2,
  stable: 3,
};

function toSignalView(
  signal: SignalRecord,
  prefs: Preferences,
  rank: number
): SignalView {
  const role = prefs.role ?? FALLBACK_ROLE;
  const region = prefs.region ?? FALLBACK_REGION;

  return {
    id: signal.id,
    name: signal.name,
    category: signal.category,
    interest: signal.interest,
    interestLabel: INTEREST_LABEL[signal.interest],
    currentState: signal.currentState,
    momentum: signal.momentum,
    confidence: signal.confidence,
    previousMomentum: signal.previousMomentum,
    previousConfidence: signal.previousConfidence,
    momentumDelta: signal.momentum - signal.previousMomentum,
    confidenceDelta: signal.confidence - signal.previousConfidence,
    change: signal.change,
    soWhatForYou: getSoWhatForYou(signal, role, region),
    recommendedAction: getRecommendedActionForUser(signal, role, region),
    explanation: getSoWhatForYou(signal, role, region),
    sources: signal.sources,
    affectedIndustries: signal.affectedIndustries,
    affectedRoles: signal.affectedRoles,
    momentumDrivers: signal.momentumDrivers,
    confidenceFactors: signal.confidenceFactors,
    relatedSkills: signal.relatedSkills,
    relatedOpportunities: signal.relatedOpportunities,
    rank,
  };
}

export function getTopSignals(prefs: Preferences, limit = 6): SignalView[] {
  return filterSignalsForUser(prefs)
    .sort((a, b) => {
      const changeDiff =
        (CHANGE_PRIORITY[a.change.type] ?? 9) -
        (CHANGE_PRIORITY[b.change.type] ?? 9);
      if (changeDiff !== 0) return changeDiff;
      return b.momentum - a.momentum;
    })
    .slice(0, limit)
    .map((s, i) => toSignalView(s, prefs, i + 1));
}

export function getSignalById(
  id: string,
  prefs: Preferences
): SignalView | undefined {
  const signal = filterSignalsForUser(prefs).find((s) => s.id === id);
  if (!signal) return undefined;
  return toSignalView(signal, prefs, 0);
}

export function getRecommendedSkills(
  prefs: Preferences,
  limit = 6
): SkillView[] {
  const DEMAND_RANK = { Critical: 0, High: 1, Growing: 2 };
  const CHANGE_RANK = { new: 0, rising: 1, stable: 2, falling: 3 };

  return filterSkillsForUser(prefs)
    .sort((a, b) => {
      const changeDiff =
        (CHANGE_RANK[a.demandChange] ?? 9) - (CHANGE_RANK[b.demandChange] ?? 9);
      if (changeDiff !== 0) return changeDiff;
      return DEMAND_RANK[a.demand] - DEMAND_RANK[b.demand];
    })
    .slice(0, limit)
    .map((skill) => ({
      id: skill.id,
      name: skill.name,
      demand: skill.demand,
      demandChange: skill.demandChange,
      changeSummary: skill.changeSummary,
      summary: skill.summary,
      interest: skill.interests[0],
      interestLabel: getInterestLabel(skill.interests[0]),
    }));
}

export function getOpportunities(
  prefs: Preferences,
  limit = 5
): OpportunityView[] {
  const role = prefs.role ?? FALLBACK_ROLE;
  const region = prefs.region ?? FALLBACK_REGION;
  const CHANGE_RANK = { new: 0, rising: 1, stable: 2, falling: 3 };

  return filterJobsForUser(prefs)
    .sort((a, b) => {
      const changeDiff =
        (CHANGE_RANK[a.growthChange] ?? 9) - (CHANGE_RANK[b.growthChange] ?? 9);
      if (changeDiff !== 0) return changeDiff;
      return (
        getGrowthWithBias(b.growth, region, b.interests[0]) -
        getGrowthWithBias(a.growth, region, a.interests[0])
      );
    })
    .slice(0, limit)
    .map((job) => ({
      id: job.id,
      title: job.title,
      sector: job.sector,
      growth: getGrowthWithBias(job.growth, region, job.interests[0]),
      growthChange: job.growthChange,
      changeSummary: job.changeSummary,
      summary: job.summary,
      angle: getJobAngle(job, role),
      hubs: getRegionHubs(region, job.interests[0]),
      regionLabel: getRegionLabel(region),
      interest: job.interests[0],
      interestLabel: getInterestLabel(job.interests[0]),
    }));
}

export function getRecommendations(
  prefs: Preferences,
  limit = 5
): ActionView[] {
  const PRIORITY_RANK = { High: 0, Medium: 1 };

  return filterRecommendationsForUser(prefs)
    .sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    })
    .slice(0, limit)
    .map((rec) => ({
      id: rec.id,
      title: rec.title,
      detail: rec.detail,
      priority: rec.priority,
      isPrimary: rec.isPrimary,
      changeReason: rec.changeReason,
      interest: rec.interests[0] ?? null,
      interestLabel: rec.interests[0]
        ? getInterestLabel(rec.interests[0])
        : null,
    }));
}

export function getPrimaryAction(prefs: Preferences): ActionView | null {
  return getRecommendations(prefs, 1).find((a) => a.isPrimary) ?? getRecommendations(prefs, 1)[0] ?? null;
}

export function getBriefing(prefs: Preferences): Briefing {
  const role = prefs.role ?? FALLBACK_ROLE;
  const region = prefs.region ?? FALLBACK_REGION;
  const meta = getMeta();
  const interests = prefs.interests;

  const interestText = listToText(interests.map((i) => INTEREST_LABEL[i]));
  const regionScope = `across ${REGION_LABEL[region]}`;

  const summary = `As ${article(role)} ${ROLE_LABEL[
    role
  ].toLowerCase()} focused on ${interestText} ${regionScope}, here is what changed for you.`;

  const signals = getTopSignals(prefs);
  const skills = getRecommendedSkills(prefs);
  const opportunities = getOpportunities(prefs);
  const actions = getRecommendations(prefs);

  return {
    summary,
    regionContext: getRegionContext(region),
    hubs: getRegionHubs(region, interests[0] ?? "artificial-intelligence", 5),
    briefingPeriod: meta.briefingPeriod,
    briefingLabel: meta.briefingLabel,
    stats: {
      signals: signals.length,
      skills: skills.length,
      opportunities: opportunities.length,
      actions: actions.length,
    },
  };
}

export function getWhatChangedForYou(
  prefs: Preferences,
  visitChanges: SignalVisitChange[] | null,
  isReturnVisit: boolean
): WhatChangedBriefing {
  const meta = getMeta();
  const signals = getTopSignals(prefs, 12);
  const primaryAction = getPrimaryAction(prefs);

  let changes: ChangeItem[];

  if (isReturnVisit && visitChanges && visitChanges.length > 0) {
    const changeMap = new Map(visitChanges.map((c) => [c.signalId, c]));
    changes = signals
      .filter((s) => changeMap.has(s.id) || s.change.type === "new" || s.change.type === "rising")
      .slice(0, 5)
      .map((signal) => {
        const vc = changeMap.get(signal.id);
        return {
          signal,
          whyItMatters: signal.soWhatForYou,
          action: signal.recommendedAction,
          visitChange: vc
            ? {
                momentumDelta: vc.momentumDelta,
                confidenceDelta: vc.confidenceDelta,
                previousMomentum: vc.previousMomentum,
                previousConfidence: vc.previousConfidence,
              }
            : undefined,
        };
      });
  } else {
    changes = signals
      .filter((s) => s.change.type === "new" || s.change.type === "rising")
      .slice(0, 5)
      .map((signal) => ({
        signal,
        whyItMatters: signal.soWhatForYou,
        action: signal.recommendedAction,
      }));
  }

  if (changes.length === 0) {
    changes = signals.slice(0, 3).map((signal) => ({
      signal,
      whyItMatters: signal.soWhatForYou,
      action: signal.recommendedAction,
    }));
  }

  return {
    title: isReturnVisit
      ? "What Changed Since Your Last Visit"
      : "What Changed This Week",
    subtitle: isReturnVisit
      ? "Here's what's different based on your last briefing."
      : meta.briefingLabel,
    isReturnVisit,
    primaryAction,
    changes,
    briefingLabel: meta.briefingLabel,
  };
}

function article(role: RoleId): string {
  return role === "entrepreneur" || role === "investor" ? "an" : "a";
}

function listToText(items: string[]): string {
  if (items.length === 0) return "emerging technology";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

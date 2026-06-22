import { INTEREST_CONTENT, REGION_CONTENT } from "@/lib/data/intelligence";
import {
  INVESTOR_ACTIONS,
  INVESTOR_SKILLS,
} from "@/lib/data/investor-content";
import {
  extractSeedId,
  getSignalIntelligence,
} from "@/lib/data/signal-intelligence";
import { getSignalNarrative } from "@/lib/data/signal-narratives";
import { INTEREST_LABEL, REGION_LABEL, ROLE_LABEL } from "@/lib/options";
import type {
  ActionView,
  Briefing,
  Demand,
  InterestId,
  OpportunityView,
  Preferences,
  Priority,
  RegionId,
  RoleId,
  SignalView,
  SkillView,
} from "@/lib/types";

const DEMAND_RANK: Record<Demand, number> = {
  Critical: 0,
  High: 1,
  Growing: 2,
};
const PRIORITY_RANK: Record<Priority, number> = { High: 0, Medium: 1 };

const FALLBACK_ROLE: RoleId = "professional";
const FALLBACK_REGION: RegionId = "global";

function activeInterests(prefs: Preferences): InterestId[] {
  return prefs.interests.length > 0 ? prefs.interests : ["ai"];
}

function hubsFor(region: RegionId, interest: InterestId, limit = 3): string[] {
  const r = REGION_CONTENT[region] ?? REGION_CONTENT[FALLBACK_REGION];
  return (r.hubsByInterest[interest] ?? r.hubs).slice(0, limit);
}

export function getTopSignals(prefs: Preferences, limit = 6): SignalView[] {
  const role = prefs.role ?? FALLBACK_ROLE;
  const interests = activeInterests(prefs);

  const views: SignalView[] = interests.flatMap((interest) =>
    INTEREST_CONTENT[interest].signals.map((s) => {
      const seedId = s.id;
      const narrative = getSignalNarrative(seedId, role);
      const intel = getSignalIntelligence(seedId, s.name, role);
      const impact =
        s.roleImpact[role as keyof typeof s.roleImpact] ??
        s.roleImpact.entrepreneur;

      return {
        id: `${interest}-${seedId}`,
        seedId,
        name: s.name,
        category: s.category,
        momentum: s.momentum,
        confidence: s.confidence,
        summary: s.summary,
        impact,
        whyItMatters: narrative.whyItMatters,
        causedBy: intel.causedBy,
        impacts: intel.impacts,
        benefits: intel.benefits,
        actions: intel.roleActions,
        momentumDrivers: intel.momentumDrivers.map((d) => ({
          ...d,
          unit: d.unit ?? "%",
        })),
        confidenceFactors: intel.confidenceFactors.map((d) => ({
          ...d,
          unit: d.unit ?? "score",
        })),
        rank: 0,
        interest,
        interestLabel: INTEREST_LABEL[interest],
      };
    })
  );

  return dedupe(views, (v) => v.name)
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, limit)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function getRecommendedSkills(
  prefs: Preferences,
  limit = 6
): SkillView[] {
  const role = prefs.role ?? FALLBACK_ROLE;
  const interests = activeInterests(prefs);

  const views: SkillView[] = interests.flatMap((interest) => {
    const skills =
      role === "investor"
        ? INVESTOR_SKILLS[interest]
        : INTEREST_CONTENT[interest].skills[
            role as "student" | "professional" | "entrepreneur"
          ];

    return skills.map((skill, index) => ({
      id: `${interest}-skill-${index}`,
      name: skill.name,
      demand: skill.demand,
      summary: skill.summary,
      interest,
      interestLabel: INTEREST_LABEL[interest],
    }));
  });

  return dedupe(views, (v) => v.name)
    .sort((a, b) => DEMAND_RANK[a.demand] - DEMAND_RANK[b.demand])
    .slice(0, limit);
}

export function getOpportunities(
  prefs: Preferences,
  limit = 5
): OpportunityView[] {
  const role = prefs.role ?? FALLBACK_ROLE;
  const region = prefs.region ?? FALLBACK_REGION;
  const interests = activeInterests(prefs);
  const bias = REGION_CONTENT[region]?.growthBias ?? {};

  const views: OpportunityView[] = interests.flatMap((interest) =>
    INTEREST_CONTENT[interest].opportunities.map((o) => ({
      id: `${interest}-${o.id}`,
      title: o.title,
      sector: o.sector,
      growth: clamp(o.baseGrowth + (bias[interest] ?? 0), 5, 99),
      summary: o.summary,
      angle:
        o.roleAngle[role as keyof typeof o.roleAngle] ??
        o.roleAngle.entrepreneur,
      hubs: hubsFor(region, interest),
      regionLabel: REGION_LABEL[region],
      interest,
      interestLabel: INTEREST_LABEL[interest],
    }))
  );

  return dedupe(views, (v) => v.title)
    .sort((a, b) => b.growth - a.growth)
    .slice(0, limit);
}

export function getRecommendations(
  prefs: Preferences,
  limit = 5
): ActionView[] {
  const role = prefs.role ?? FALLBACK_ROLE;
  const region = prefs.region ?? FALLBACK_REGION;
  const interests = activeInterests(prefs);

  const curated: ActionView[] = interests.flatMap((interest) => {
    const actions =
      role === "investor"
        ? INVESTOR_ACTIONS[interest]
        : INTEREST_CONTENT[interest].actions[
            role as "student" | "professional" | "entrepreneur"
          ];

    return actions.map((a, index) => ({
      id: `${interest}-action-${index}`,
      title: a.title,
      detail: a.detail,
      priority: a.priority,
      interest,
      interestLabel: INTEREST_LABEL[interest],
    }));
  });

  const sorted = curated.sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  );

  const regionAction = buildRegionAction(region, interests[0]);
  return [regionAction, ...sorted].slice(0, limit);
}

function buildRegionAction(
  region: RegionId,
  topInterest: InterestId
): ActionView {
  const hubs = hubsFor(region, topInterest, 2);
  const regionLabel = REGION_LABEL[region];
  const interestLabel = INTEREST_LABEL[topInterest];

  const detail =
    region === "global"
      ? `${interestLabel} is moving fastest in ${hubs.join(
          " and "
        )} — follow those ecosystems for early signals.`
      : `Tap into ${regionLabel}: ${interestLabel} is concentrated in ${hubs.join(
          " and "
        )}. Build connections and watch those hubs closely.`;

  return {
    id: "region-move",
    title: `Leverage ${regionLabel} momentum`,
    detail,
    priority: "High",
    interest: topInterest,
    interestLabel,
  };
}

export function getBriefing(prefs: Preferences): Briefing {
  const role = prefs.role ?? FALLBACK_ROLE;
  const region = prefs.region ?? FALLBACK_REGION;
  const interests = activeInterests(prefs);

  const interestText = listToText(interests.map((i) => INTEREST_LABEL[i]));
  const regionScope =
    region === "global" ? "worldwide" : `across ${REGION_LABEL[region]}`;

  const summary = `As ${article(role)} ${ROLE_LABEL[
    role
  ].toLowerCase()} focused on ${interestText} ${regionScope}, here is the intelligence that matters most to you.`;

  const signals = getTopSignals(prefs);
  const skills = getRecommendedSkills(prefs);
  const opportunities = getOpportunities(prefs);
  const actions = getRecommendations(prefs);
  const topSignal = signals[0];

  const storyLead = topSignal
    ? `${topSignal.name} leads at ${topSignal.momentum} momentum — trace its causes, impacts, and your next move in the map below.`
    : "Your personalized intelligence briefing is ready.";

  return {
    summary,
    regionContext: REGION_CONTENT[region]?.context ?? "",
    hubs: REGION_CONTENT[region]?.hubs.slice(0, 5) ?? [],
    storyLead,
    stats: {
      signals: signals.length,
      skills: skills.length,
      opportunities: opportunities.length,
      actions: actions.length,
    },
  };
}

function article(role: RoleId): string {
  return role === "entrepreneur" || role === "investor" ? "an" : "a";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function dedupe<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function listToText(items: string[]): string {
  if (items.length === 0) return "emerging technology";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// Re-export for map builder
export { extractSeedId };

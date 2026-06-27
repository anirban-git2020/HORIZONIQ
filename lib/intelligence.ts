import type { BriefingRecord, SignalRecord } from "@/lib/data/schemas";
import type { DataSource } from "@/lib/data/schemas";
import { getRegionContext, resolvePersonalizedText } from "@/lib/data/access";
import { INTEREST_LABEL, ROLE_LABEL, REGION_LABEL } from "@/lib/options";
import type {
  ChangeType,
  EvidenceDriver,
  IntelligenceConfidenceTier,
  InterestId,
  RegionId,
  RoleId,
  SignalIntelligence,
  SignalView,
} from "@/lib/types";
import { formatBriefingUpdatedAt } from "@/lib/utils";
import { resolveSourceUrl } from "@/lib/trust";

/** Enrich briefing sources with clickable URLs when missing from stored JSON. */
export function enrichDataSources(sources: DataSource[]): DataSource[] {
  return sources.map((source) => ({
    ...source,
    url: resolveSourceUrl(source),
  }));
}

function firstSentence(text: string): string {
  const match = text.trim().match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.trim();
}

export function buildWhatHappened(signal: SignalRecord): string {
  const fromChange = firstSentence(signal.change.summary);
  if (fromChange.length > 0 && fromChange.length <= 220) {
    return fromChange;
  }
  return firstSentence(signal.currentState);
}

export function buildWhyItIsHappening(
  change: SignalRecord["change"],
  momentumDrivers: EvidenceDriver[]
): string {
  const driverLines = momentumDrivers.slice(0, 3).map((driver) => {
    const sign = driver.unit === "%" && driver.value > 0 ? "+" : "";
    const suffix = driver.unit === "%" ? "%" : "";
    return `${driver.label} (${sign}${driver.value}${suffix})`;
  });

  if (driverLines.length === 0) {
    return "Underlying activity shifted across the public sources we monitor — without a single dominant driver this week.";
  }

  const driverList = driverLines.join("; ");

  switch (change.type) {
    case "rising":
      return `Acceleration is driven by ${driverList}. These metrics moved in the same direction across independent feeds.`;
    case "falling":
      return `Cooling is driven by ${driverList}. Fewer high-signal mentions and weaker cross-source agreement explain the drop.`;
    case "new":
      return `This entered the briefing because ${driverList} crossed our activity threshold for the first time this period.`;
    default:
      return `Activity is steady. Primary inputs this week: ${driverList}. No material directional shift detected.`;
  }
}

export function buildWhyYouShouldCare(
  signal: SignalRecord,
  role: RoleId,
  region: RegionId,
  interests: InterestId[]
): string {
  const personalized = resolvePersonalizedText(signal.explanation, role, region);
  const roleLabel = ROLE_LABEL[role];
  const interestFocused = interests.includes(signal.interest);

  if (interestFocused) {
    return `${personalized} You flagged ${INTEREST_LABEL[signal.interest]} — this sits directly in that focus area.`;
  }

  const impacted = signal.affectedRoles.some(
    (r) => r.toLowerCase() === roleLabel.toLowerCase()
  );

  if (impacted) {
    return `${personalized} Your role (${roleLabel}) is among those most exposed to this shift.`;
  }

  return personalized;
}

export function buildOutlook(
  signal: Pick<SignalRecord, "name" | "change">,
  changeType: ChangeType
): string {
  const horizon =
    changeType === "new" ? "3–6 months" : "6–12 months";

  switch (changeType) {
    case "rising":
      return `Outlook (${horizon}, projection): If current drivers hold, ${signal.name} may shift from early adoption to broader operational deployment. Validate with two consecutive weekly briefings before scaling commitments.`;
    case "falling":
      return `Outlook (${horizon}, projection): Momentum may continue to soften unless new catalysts appear. Maintain awareness; avoid reactive decisions based on a single down week.`;
    case "new":
      return `Outlook (3–6 months, projection): Early signal — may strengthen if independent sources confirm over the next two briefing cycles. Treat as a watch item, not a settled trend.`;
    default:
      return `Outlook (6–12 months, projection): Likely to remain on the watchlist unless source activity breaks clearly in one direction.`;
  }
}

export interface ConfidenceAssessment {
  tier: IntelligenceConfidenceTier;
  explanation: string;
}

export function buildConfidenceAssessment(
  confidence: number,
  sources: DataSource[],
  changeType: ChangeType,
  provenance: BriefingRecord["dataProvenance"]
): ConfidenceAssessment {
  if (provenance === "curated-mock") {
    return {
      tier: "medium",
      explanation:
        "Medium — sample briefing data. Labels illustrate how live confidence scoring works.",
    };
  }

  const liveSources = sources.filter((s) => s.type === "live").length;
  const agreementFactor =
    confidence >= 80 && liveSources >= 3
      ? "high"
      : confidence >= 60 || liveSources >= 2
        ? "medium"
        : "low";

  if (agreementFactor === "high" && changeType !== "new") {
    return {
      tier: "high",
      explanation:
        "High — multiple independent public sources show aligned activity this week.",
    };
  }

  if (
    agreementFactor === "medium" ||
    changeType === "rising" ||
    provenance === "pipeline-mock"
  ) {
    const suffix =
      provenance === "pipeline-mock"
        ? " Some sources were unavailable — treat as directional, not definitive."
        : "";
    return {
      tier: "medium",
      explanation: `Medium — early trend with limited confirmation across sources.${suffix}`,
    };
  }

  return {
    tier: "low",
    explanation:
      "Low — emerging signal requiring monitoring. Wait for corroboration before major decisions.",
  };
}

export function buildSignalIntelligence(
  signal: SignalRecord,
  role: RoleId,
  region: RegionId,
  interests: InterestId[],
  provenance: BriefingRecord["dataProvenance"],
  updatedAt: string
): Pick<SignalView, "intelligence" | "sources" | "lastUpdated" | "lastUpdatedLabel" | "whyItChanged" | "confidenceExplanation" | "roleRelevance" | "regionRelevance"> {
  const sources = enrichDataSources(signal.sources);
  const whatToDoNext = resolvePersonalizedText(
    signal.recommendedAction,
    role,
    region
  );
  const whyItIsHappening = buildWhyItIsHappening(
    signal.change,
    signal.momentumDrivers
  );
  const confidence = buildConfidenceAssessment(
    signal.confidence,
    sources,
    signal.change.type,
    provenance
  );

  const intelligence: SignalIntelligence = {
    whatHappened: buildWhatHappened(signal),
    whyItIsHappening,
    whyYouShouldCare: buildWhyYouShouldCare(signal, role, region, interests),
    whatToDoNext,
    outlook: buildOutlook(signal, signal.change.type),
    confidenceTier: confidence.tier,
    confidenceExplanation: confidence.explanation,
    evidence: {
      sources,
      lastUpdatedLabel: formatBriefingUpdatedAt(updatedAt),
      regionLabel: REGION_LABEL[region],
      categories: [
        ...new Set([signal.category, INTEREST_LABEL[signal.interest]]),
      ],
    },
  };

  const regionContext = getRegionContext(region);

  return {
    sources,
    intelligence,
    lastUpdated: updatedAt,
    lastUpdatedLabel: formatBriefingUpdatedAt(updatedAt),
    whyItChanged: whyItIsHappening,
    confidenceExplanation: confidence.explanation,
    roleRelevance: `Profile: ${ROLE_LABEL[role]}`,
    regionRelevance: regionContext
      ? `${REGION_LABEL[region]} — ${regionContext}`
      : REGION_LABEL[region],
  };
}

export function getConfidenceLevel(
  tier: IntelligenceConfidenceTier
): IntelligenceConfidenceTier {
  return tier;
}

export function getConfidenceLevelLabel(
  tier: IntelligenceConfidenceTier
): string {
  switch (tier) {
    case "high":
      return "High confidence";
    case "medium":
      return "Medium confidence";
    default:
      return "Low confidence";
  }
}

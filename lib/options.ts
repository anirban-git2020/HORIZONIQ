import {
  Atom,
  Bot,
  Briefcase,
  Cpu,
  Dna,
  Globe2,
  GraduationCap,
  Leaf,
  Lightbulb,
  Landmark,
  type LucideIcon,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import type { InterestId, RegionId, RoleExperience, RoleId } from "@/lib/types";

export interface RoleOption {
  id: RoleId;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}

export const ROLES: RoleOption[] = [
  {
    id: "student",
    label: "Student",
    tagline: "Build the right skills early",
    description:
      "See which technologies, careers, and skills are rising so you can plan what to learn next.",
    icon: GraduationCap,
  },
  {
    id: "professional",
    label: "Professional",
    tagline: "Stay ahead in your industry",
    description:
      "Track shifts in your field, spot emerging risks, and keep your career resilient.",
    icon: Briefcase,
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    tagline: "Find tomorrow's opportunities",
    description:
      "Discover growing markets and emerging trends before they become obvious.",
    icon: Lightbulb,
  },
  {
    id: "investor",
    label: "Investor",
    tagline: "Follow capital and momentum",
    description:
      "Track sector momentum, capital flows, and growth signals before they price in.",
    icon: TrendingUp,
  },
];

export interface RegionOption {
  id: RegionId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const REGIONS: RegionOption[] = [
  {
    id: "north-america",
    label: "North America",
    description: "US & Canada markets",
    icon: Globe2,
  },
  {
    id: "europe",
    label: "Europe",
    description: "EU, UK & Nordics",
    icon: Globe2,
  },
  {
    id: "asia-pacific",
    label: "Asia Pacific",
    description: "India, SEA, China, ANZ",
    icon: Globe2,
  },
  {
    id: "middle-east-africa",
    label: "Middle East & Africa",
    description: "GCC & Sub-Saharan growth",
    icon: Globe2,
  },
  {
    id: "latin-america",
    label: "Latin America",
    description: "Brazil, Mexico & beyond",
    icon: Globe2,
  },
  {
    id: "global",
    label: "Global",
    description: "Worldwide intelligence",
    icon: Globe2,
  },
];

export interface InterestOption {
  id: InterestId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const INTERESTS: InterestOption[] = [
  {
    id: "ai",
    label: "AI & Machine Learning",
    description: "Agents, foundation models, applied AI",
    icon: Cpu,
  },
  {
    id: "robotics",
    label: "Robotics & Automation",
    description: "Humanoids, industrial automation",
    icon: Bot,
  },
  {
    id: "biotech",
    label: "Biotech & Health",
    description: "Synthetic biology, longevity, medtech",
    icon: Dna,
  },
  {
    id: "climate",
    label: "Climate & Energy",
    description: "Grid storage, clean energy, climate tech",
    icon: Leaf,
  },
  {
    id: "fintech",
    label: "Fintech & Digital Assets",
    description: "Embedded finance, payments, tokenization",
    icon: Landmark,
  },
  {
    id: "space",
    label: "Space & Frontier Tech",
    description: "Launch, in-orbit, deep tech",
    icon: Rocket,
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    description: "AI threats, zero trust, resilience",
    icon: ShieldCheck,
  },
  {
    id: "quantum",
    label: "Quantum Computing",
    description: "Hardware, error correction, algorithms",
    icon: Atom,
  },
];

export const ROLE_LABEL: Record<RoleId, string> = Object.fromEntries(
  ROLES.map((r) => [r.id, r.label])
) as Record<RoleId, string>;

export const REGION_LABEL: Record<RegionId, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.label])
) as Record<RegionId, string>;

export const INTEREST_LABEL: Record<InterestId, string> = Object.fromEntries(
  INTERESTS.map((i) => [i.id, i.label])
) as Record<InterestId, string>;

export const ROLE_EXPERIENCE: Record<RoleId, RoleExperience> = {
  student: {
    greeting: "Your learning edge",
    article: "a",
    lensTitle: "Learning intelligence",
    lensSubtitle: "Skills, careers, and paths tailored to where the world is going.",
    focusAreas: ["Skills", "Careers", "Learning paths"],
    skillsTitle: "Skills to Learn Next",
    skillsQuestion: "What should you learn to stay ahead?",
    actionsTitle: "Your Learning Moves",
    actionsQuestion: "What should you do this month?",
    signalsQuestion: "What is changing in your future?",
    opportunitiesTitle: "Growing Careers",
    opportunitiesQuestion: "Where are the jobs and entry points?",
    sectionOrder: ["map", "signals", "skills", "opportunities", "actions"],
    accentClass: "border-l-primary",
  },
  professional: {
    greeting: "Your industry edge",
    article: "a",
    lensTitle: "Industry intelligence",
    lensSubtitle: "Emerging skills, promotions, and shifts in your field.",
    focusAreas: ["Emerging skills", "Promotions", "Industry shifts"],
    skillsTitle: "Capabilities to Master",
    skillsQuestion: "What should you master next?",
    actionsTitle: "Your Career Moves",
    actionsQuestion: "What should you do next?",
    signalsQuestion: "What is changing in your industry?",
    opportunitiesTitle: "Industry Leverage",
    opportunitiesQuestion: "Where is the leverage in your field?",
    sectionOrder: ["map", "signals", "skills", "actions", "opportunities"],
    accentClass: "border-l-success",
  },
  entrepreneur: {
    greeting: "Your opportunity edge",
    article: "an",
    lensTitle: "Market intelligence",
    lensSubtitle: "Startup opportunities, market gaps, and demand signals.",
    focusAreas: ["Startup opportunities", "Market gaps", "Demand signals"],
    skillsTitle: "Capabilities to Build",
    skillsQuestion: "What should you build?",
    actionsTitle: "Your Build Moves",
    actionsQuestion: "Where should you act first?",
    signalsQuestion: "What is changing in the market?",
    opportunitiesTitle: "Market Gaps",
    opportunitiesQuestion: "Where is the white space?",
    sectionOrder: ["map", "signals", "opportunities", "actions", "skills"],
    accentClass: "border-l-warning",
  },
  investor: {
    greeting: "Your capital edge",
    article: "an",
    lensTitle: "Capital intelligence",
    lensSubtitle: "Capital flows, growth signals, and sector momentum.",
    focusAreas: ["Capital flows", "Growth signals", "Sector momentum"],
    skillsTitle: "Investment Capabilities",
    skillsQuestion: "What should you understand to deploy capital?",
    actionsTitle: "Your Allocation Moves",
    actionsQuestion: "Where should capital flow next?",
    signalsQuestion: "What is moving markets?",
    opportunitiesTitle: "Sector Momentum",
    opportunitiesQuestion: "Where is capital concentrating?",
    sectionOrder: ["map", "signals", "opportunities", "skills", "actions"],
    accentClass: "border-l-primary",
  },
};

/** @deprecated Use ROLE_EXPERIENCE */
export const ROLE_CONTENT = ROLE_EXPERIENCE;

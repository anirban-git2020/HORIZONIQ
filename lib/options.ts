import {
  Atom,
  Bot,
  Briefcase,
  Cloud,
  Cpu,
  Dna,
  Factory,
  FlaskConical,
  Globe2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Lightbulb,
  LineChart,
  Microscope,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type {
  InterestCategory,
  InterestId,
  RegionId,
  RoleExperience,
  RoleId,
} from "@/lib/types";

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
    tagline: "For students choosing skills and career paths.",
    description: "Learn what's rising before your peers.",
    icon: GraduationCap,
  },
  {
    id: "professional",
    label: "Professional",
    tagline: "For professionals growing and staying relevant.",
    description: "Stay ahead of change in your field.",
    icon: Briefcase,
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    tagline: "For founders looking for their next market.",
    description: "Spot opportunities before they're crowded.",
    icon: Lightbulb,
  },
  {
    id: "investor",
    label: "Investor",
    tagline: "For investors tracking where capital should move.",
    description: "See momentum before the market does.",
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
    id: "india",
    label: "India",
    description: "Bangalore, Mumbai & beyond",
    icon: Globe2,
  },
  {
    id: "china",
    label: "China",
    description: "Shenzhen, Shanghai & beyond",
    icon: Globe2,
  },
  {
    id: "southeast-asia",
    label: "Southeast Asia",
    description: "Singapore, Jakarta & beyond",
    icon: Globe2,
  },
  {
    id: "middle-east",
    label: "Middle East",
    description: "Dubai, Riyadh & GCC",
    icon: Globe2,
  },
  {
    id: "africa",
    label: "Africa",
    description: "Lagos, Nairobi & beyond",
    icon: Globe2,
  },
  {
    id: "latin-america",
    label: "Latin America",
    description: "São Paulo, Mexico City & beyond",
    icon: Globe2,
  },
];

export interface InterestOption {
  id: InterestId;
  label: string;
  description: string;
  category: InterestCategory;
  icon: LucideIcon;
}

/**
 * Curated interest lists per role — no Business category in onboarding.
 * Full catalog remains in INTERESTS for data layer; users only pick from these.
 */
export const ROLE_INTEREST_IDS: Record<RoleId, InterestId[]> = {
  student: [
    "artificial-intelligence",
    "cybersecurity",
    "cloud-computing",
    "robotics",
    "biotechnology",
    "biochemistry",
    "life-sciences",
    "healthcare",
    "energy",
    "arts",
    "commerce",
  ],
  professional: [
    "artificial-intelligence",
    "cybersecurity",
    "cloud-computing",
    "healthcare",
    "finance",
    "manufacturing",
  ],
  entrepreneur: [
    "artificial-intelligence",
    "healthcare",
    "finance",
    "energy",
    "manufacturing",
  ],
  investor: [
    "artificial-intelligence",
    "healthcare",
    "finance",
    "energy",
    "quantum-computing",
    "cybersecurity",
  ],
};

/** Three high-signal defaults per role for the ≤60s quick-start path. */
export const ROLE_DEFAULT_INTERESTS: Record<RoleId, InterestId[]> = {
  student: ["artificial-intelligence", "cybersecurity", "healthcare"],
  professional: ["artificial-intelligence", "cybersecurity", "cloud-computing"],
  entrepreneur: ["artificial-intelligence", "healthcare", "finance"],
  investor: ["artificial-intelligence", "healthcare", "finance"],
};

export const INTEREST_CATEGORIES: {
  id: InterestCategory;
  label: string;
}[] = [
  { id: "technology", label: "Technology" },
  { id: "science", label: "Science" },
  { id: "arts-commerce", label: "Arts & Commerce" },
  { id: "industry", label: "Industry" },
  { id: "business", label: "Business" },
];

/** Student onboarding groups — technology, science, and arts/commerce careers. */
export const STUDENT_INTEREST_SECTIONS: {
  label: string;
  ids: InterestId[];
}[] = [
  {
    label: "Technology",
    ids: [
      "artificial-intelligence",
      "cybersecurity",
      "cloud-computing",
      "robotics",
    ],
  },
  {
    label: "Science",
    ids: [
      "biotechnology",
      "biochemistry",
      "life-sciences",
      "healthcare",
      "energy",
    ],
  },
  {
    label: "Arts & Commerce",
    ids: ["arts", "commerce"],
  },
];

export const INTERESTS: InterestOption[] = [
  {
    id: "artificial-intelligence",
    label: "Artificial Intelligence",
    description: "Agents, models, and applied AI",
    category: "technology",
    icon: Cpu,
  },
  {
    id: "robotics",
    label: "Robotics",
    description: "Automation, humanoids, industrial systems",
    category: "technology",
    icon: Bot,
  },
  {
    id: "quantum-computing",
    label: "Quantum Computing",
    description: "Hardware, algorithms, error correction",
    category: "technology",
    icon: Atom,
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    description: "AI threats, zero trust, resilience",
    category: "technology",
    icon: ShieldCheck,
  },
  {
    id: "cloud-computing",
    label: "Cloud Computing",
    description: "Infrastructure, FinOps, distributed systems",
    category: "technology",
    icon: Cloud,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    description: "Smart factories, industrial AI",
    category: "industry",
    icon: Factory,
  },
  {
    id: "supply-chain",
    label: "Supply Chain",
    description: "Logistics, visibility, nearshoring",
    category: "industry",
    icon: Truck,
  },
  {
    id: "healthcare",
    label: "Healthcare",
    description: "Clinical AI, diagnostics, medtech",
    category: "science",
    icon: HeartPulse,
  },
  {
    id: "finance",
    label: "Finance",
    description: "Embedded finance, payments, banking",
    category: "industry",
    icon: Landmark,
  },
  {
    id: "energy",
    label: "Energy",
    description: "Storage, renewables, grid modernization",
    category: "science",
    icon: Zap,
  },
  {
    id: "biotechnology",
    label: "Biotechnology",
    description: "Synthetic biology, genomics, and bioengineering",
    category: "science",
    icon: Dna,
  },
  {
    id: "biochemistry",
    label: "Biochemistry",
    description: "Molecular biology, lab sciences, and drug discovery",
    category: "science",
    icon: FlaskConical,
  },
  {
    id: "life-sciences",
    label: "Life Sciences",
    description: "Biology, chemistry, physics, and research careers",
    category: "science",
    icon: Microscope,
  },
  {
    id: "arts",
    label: "Arts & Creative Fields",
    description: "Design, media, humanities, and creative careers",
    category: "arts-commerce",
    icon: Palette,
  },
  {
    id: "commerce",
    label: "Commerce & Business Studies",
    description: "Accounting, economics, finance, and management",
    category: "arts-commerce",
    icon: Briefcase,
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    description: "Starting and scaling new ventures",
    category: "business",
    icon: Sparkles,
  },
  {
    id: "startups",
    label: "Startups",
    description: "Early-stage companies and ecosystems",
    category: "business",
    icon: Rocket,
  },
  {
    id: "venture-capital",
    label: "Venture Capital",
    description: "Funding, allocation, sector momentum",
    category: "business",
    icon: LineChart,
  },
  {
    id: "product-management",
    label: "Product Management",
    description: "Strategy, roadmaps, product-led growth",
    category: "business",
    icon: Target,
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
    skillsTitle: "Skills Rising",
    skillsQuestion: "Which skills gained demand this week?",
    actionsTitle: "Your Next Move",
    actionsQuestion: "What should you do this week?",
    signalsQuestion: "What is changing in your future?",
    opportunitiesTitle: "New This Week",
    opportunitiesQuestion: "Where are new opportunities emerging?",
    sectionOrder: ["signals", "skills", "opportunities", "actions"],
    accentClass: "border-l-primary",
  },
  professional: {
    greeting: "Your industry edge",
    article: "a",
    lensTitle: "Industry intelligence",
    lensSubtitle: "Emerging skills, promotions, and shifts in your field.",
    focusAreas: ["Emerging skills", "Promotions", "Industry shifts"],
    skillsTitle: "Skills Rising",
    skillsQuestion: "Which capabilities gained demand this week?",
    actionsTitle: "Your Next Move",
    actionsQuestion: "What should you do this week?",
    signalsQuestion: "What is changing in your industry?",
    opportunitiesTitle: "Heating Up",
    opportunitiesQuestion: "Where is momentum building in your field?",
    sectionOrder: ["signals", "skills", "actions", "opportunities"],
    accentClass: "border-l-success",
  },
  entrepreneur: {
    greeting: "Your opportunity edge",
    article: "an",
    lensTitle: "Market intelligence",
    lensSubtitle: "Startup opportunities, market gaps, and demand signals.",
    focusAreas: ["Startup opportunities", "Market gaps", "Demand signals"],
    skillsTitle: "Skills Rising",
    skillsQuestion: "Which capabilities matter most right now?",
    actionsTitle: "Your Next Move",
    actionsQuestion: "Where should you act first this week?",
    signalsQuestion: "What is changing in the market?",
    opportunitiesTitle: "New This Week",
    opportunitiesQuestion: "Where is white space opening up?",
    sectionOrder: ["signals", "opportunities", "actions", "skills"],
    accentClass: "border-l-warning",
  },
  investor: {
    greeting: "Your capital edge",
    article: "an",
    lensTitle: "Capital intelligence",
    lensSubtitle: "Capital flows, growth signals, and sector momentum.",
    focusAreas: ["Capital flows", "Growth signals", "Sector momentum"],
    skillsTitle: "Skills Rising",
    skillsQuestion: "Which investment capabilities matter now?",
    actionsTitle: "Your Next Move",
    actionsQuestion: "Where should capital flow this week?",
    signalsQuestion: "What is moving markets?",
    opportunitiesTitle: "Heating Up",
    opportunitiesQuestion: "Where is capital concentrating?",
    sectionOrder: ["signals", "opportunities", "skills", "actions"],
    accentClass: "border-l-primary",
  },
};

/** @deprecated Use ROLE_EXPERIENCE */
export const ROLE_CONTENT = ROLE_EXPERIENCE;

export const ROLE_INTEREST_COPY: Record<
  RoleId,
  { title: string; subtitle: string; sectionLabel: string }
> = {
  student: {
    title: "What do you want to study and build toward?",
    subtitle:
      "Pick skills and fields across technology, science, arts, and commerce — we'll track what's rising in each.",
    sectionLabel: "Intelligence Focus Areas",
  },
  professional: {
    title: "What's shaping your career?",
    subtitle:
      "Select the skills and sectors most relevant to your role — nothing else.",
    sectionLabel: "Intelligence Focus Areas",
  },
  entrepreneur: {
    title: "Which markets are you pursuing?",
    subtitle:
      "Pick the sectors and technologies where opportunity is forming right now.",
    sectionLabel: "Intelligence Focus Areas",
  },
  investor: {
    title: "Where is capital moving?",
    subtitle:
      "Select the sectors and technologies with the strongest momentum signals.",
    sectionLabel: "Intelligence Focus Areas",
  },
};

const INTEREST_BY_ID = new Map(INTERESTS.map((i) => [i.id, i]));

/** Skill-oriented labels shown to students only. */
const STUDENT_SKILL_LABELS: Partial<Record<InterestId, { label: string; description: string }>> = {
  "artificial-intelligence": {
    label: "AI & Machine Learning",
    description: "Models, agents, and applied AI — one of the fastest-growing skill areas.",
  },
  robotics: {
    label: "Robotics & Automation",
    description: "Engineering paths in perception, control, and physical systems.",
  },
  cybersecurity: {
    label: "Cybersecurity",
    description: "Defensive skills and AI security — critical across every industry.",
  },
  "cloud-computing": {
    label: "Cloud & Infrastructure",
    description: "Build and operate modern software at scale.",
  },
  biotechnology: {
    label: "Biotechnology",
    description: "Genomics, synthetic biology, and bioengineering career paths.",
  },
  biochemistry: {
    label: "Biochemistry",
    description: "Lab sciences, molecular research, and pharmaceutical pathways.",
  },
  "life-sciences": {
    label: "Life Sciences",
    description: "Biology, chemistry, physics, and academic or industry research.",
  },
  healthcare: {
    label: "Healthcare & Medtech",
    description: "Clinical careers, diagnostics, and health technology.",
  },
  energy: {
    label: "Energy & Environment",
    description: "Clean energy, climate science, and sustainability careers.",
  },
  arts: {
    label: "Arts & Creative Fields",
    description: "Design, media, UX, content, and humanities-driven careers.",
  },
  commerce: {
    label: "Commerce & Business",
    description: "Accounting, economics, finance, and management career paths.",
  },
};

export function getStudentInterestSections() {
  return STUDENT_INTEREST_SECTIONS;
}

export function getInterestsForRole(role: RoleId): InterestOption[] {
  return ROLE_INTEREST_IDS[role]
    .map((id) => INTEREST_BY_ID.get(id))
    .filter((i): i is InterestOption => i !== undefined);
}

export function getDefaultInterestsForRole(role: RoleId): InterestId[] {
  return [...ROLE_DEFAULT_INTERESTS[role]];
}

export function getDefaultInterestLabelsForRole(role: RoleId): string[] {
  return getDefaultInterestsForRole(role).map((id) => {
    const interest = INTEREST_BY_ID.get(id);
    if (!interest) return id;
    return getInterestDisplayForRole(role, interest).label;
  });
}

export function getInterestDisplayForRole(
  role: RoleId,
  interest: InterestOption
): { label: string; description: string } {
  if (role === "student") {
    const skill = STUDENT_SKILL_LABELS[interest.id];
    if (skill) return skill;
  }
  return { label: interest.label, description: interest.description };
}

export function getInterestCategoriesForRole(
  role: RoleId
): { id: InterestCategory; label: string }[] {
  const visible = getInterestsForRole(role);
  const categoryIds = new Set(visible.map((i) => i.category));
  return INTEREST_CATEGORIES.filter((c) => categoryIds.has(c.id));
}

export function getInterestsByCategoryForRole(
  role: RoleId,
  category: InterestCategory
) {
  return getInterestsForRole(role).filter((i) => i.category === category);
}

export function getInterestsByCategory(category: InterestCategory) {
  return INTERESTS.filter((i) => i.category === category);
}

export function isInterestAllowedForRole(
  role: RoleId,
  interestId: InterestId
): boolean {
  return ROLE_INTEREST_IDS[role].includes(interestId);
}

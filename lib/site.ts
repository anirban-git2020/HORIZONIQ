/** Site-wide branding, legal, and founder constants (Sprint 3.9). */

export const SITE_NAME = "HorizonIQ";

/** Brand wordmark colors — Horizon white on dark surfaces; IQ accent. */
export const BRAND_HORIZON_COLOR = "#ffffff";
export const BRAND_IQ_COLOR = "#00c5ff";

export const SITE_TAGLINE = "Observe. Predict. Lead.";

export const SITE_DESCRIPTION =
  "The Personal Intelligence Operating System. Understand what is changing, why it matters, and what to do next.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizoniq-beta.vercel.app";

export const SITE_VERSION = "Beta Preview v0.1";

export const FOUNDER = {
  name: "Anirban Chatterjee",
  role: "Creator of HorizonIQ",
  email: "anirban.chatterjee@hotmail.com",
  linkedIn: "https://www.linkedin.com/in/anirban-chatterjee-45abb728/",
  /** Founder vision, shown as the callout headline on the About page (first person). */
  vision:
    "My vision is simple: give every professional their own analyst. After years spent turning scattered signals into decisions inside a global enterprise, I wanted that same clarity to be personal — a way to see what is genuinely changing in your field, understand why it matters, and act before it becomes obvious. That is HorizonIQ.",
  /** Short founder bio, shown on the About founder callout. */
  bio: "Anirban Chatterjee is a Principal Engineer and Site Lead at a global technology enterprise, where over twelve years he has advanced through four roles spanning quality engineering, supply-chain operations, and global product ownership. He has taken complex, ambiguous programs from concept to global execution — pioneering generative AI, computer vision, and augmented reality across enterprise programs. A General Management graduate of IIM Kozhikode and a recipient of more than twenty industry and innovation awards, he builds systems that turn scattered signals into decisions.",
} as const;

export const COPYRIGHT_YEAR = 2026;

export const COPYRIGHT_NOTICE = `© ${COPYRIGHT_YEAR} ${SITE_NAME}.
All Rights Reserved.`;

export const COPYRIGHT_EXTENDED = `${SITE_NAME}, its original software, product architecture, design system, visual identity, documentation, branding, dashboards, intelligence models, and original content are protected under applicable copyright laws.`;

/** Public routes accessible during all onboarding phases. */
export const PUBLIC_SITE_PATH_PREFIXES = [
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/roadmap",
] as const;

export function isPublicSitePath(pathname: string): boolean {
  return PUBLIC_SITE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export const SITE_KEYWORDS = [
  "Artificial Intelligence",
  "Career Intelligence",
  "Technology Trends",
  "Future Skills",
  "Innovation",
  "Market Intelligence",
  "HorizonIQ",
  "Personal Intelligence",
] as const;

export const TRUST_BADGES = [
  "Anonymous Analytics",
  "Privacy First",
] as const;

export type FooterLinkItem = {
  label: string;
  href?: string;
  external?: boolean;
  placeholder?: boolean;
};

export const FOOTER_QUICK_LINKS: FooterLinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Contact", href: "/contact" },
  { label: "Roadmap", href: "/roadmap" },
];

export const SITE_NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

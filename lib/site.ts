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
  "/changelog",
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

export const TECH_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Vercel",
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
  { label: "GitHub", placeholder: true },
  { label: "Release Notes", href: "/changelog" },
];

export const SITE_NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Changelog", href: "/changelog" },
] as const;

# Project Decisions

## 2026-06-22 — Foundation

Decision:
No cyberpunk aesthetic.

Reason:
Users span students, professionals, entrepreneurs, and investors.
Need broad trust and accessibility.

---

Decision:
Observe. Predict. Lead.

Reason:
Simple and memorable positioning.

---

Decision:
Role-first onboarding.

Reason:
Personalization is core differentiator.

---

Decision:
Curated mock datasets for MVP — no live data pipeline.

Reason:
Validate product value and UX before building large-scale data collection.
Use local files: `signals.json`, `skills.json`, `jobs.json`, `recommendations.json`.
Architecture must allow future swap to live APIs.

Future data sources (out of scope): job boards, research papers, patents, funding databases, news, government reports.

---

Decision:
Fixed regions — no free text.

Regions: North America, Europe, India, China, Southeast Asia, Middle East, Africa, Latin America.

Reason:
Consistent experiences and easier future analytics.

---

Decision:
Predefined interests with multi-select — no custom interests in MVP.

14 categories across Technology, Industry, and Business.

Reason:
Controlled personalization scope for MVP. Custom interests deferred to future versions.

---

Decision:
Signal detail view on click — dedicated page per signal.

Sections: Overview, What Changed, Momentum Drivers, Affected Industries, Recommended Skills, Opportunities, Recommended Actions.

Reason:
Core differentiator for depth and explainability. No relationship graphs in MVP.

---

Decision:
MVP objective — useful personalized intelligence within 60 seconds.

Reason:
Clarity over feature count. Intelligence over visuals. Usefulness over complexity.

---

## 2026-06-22 — Product Direction

### Decision

HorizonIQ is not a signal platform.

HorizonIQ is a signal change platform.

### Reason

Users return because something changed.

Not because a signal exists.

### Outcome

Approved

---

## 2026-06-22 — Retention Pivot

Decision:
New core product principle — "What Changed For You" intelligence layer.

Reason:
First-visit depth alone does not create weekly return.
Retention requires visible delta, personalized explanation, and clear action.

---

Decision:
Required dashboard contract — What Changed · Why It Matters · What To Do.

Reason:
Every screen must reinforce the three questions users return for.
Static signal lists fail the retention test.

---

Decision:
Top-level dashboard section — "What Changed Since Your Last Visit".

Reason:
Return visits need a hero answer to "what is different since I was here?"
First visit falls back to "What Changed This Week".

Implementation:
localStorage visit snapshot (no login required for MVP).

---

Decision:
Every signal must include Current State, Change Since Last Period, Explanation, Recommended Action.

Reason:
Signals are units of change, not units of information.
Detail without delta does not drive return.

---

Decision:
Personalize explanations by role, region, and interests.

Reason:
Generic change alerts feel like newsletters.
Personalized change feels like an analyst.

---

Decision:
Remove relationship graphs from MVP scope.

Reason:
Graphs optimize for exploration, not return.
They add complexity without improving weekly habit.
Existing signal map / relationship flow UI is out of MVP.

---

Decision:
Deprioritize skills, opportunities, and actions lists unless framed as change.

Reason:
Static lists do not improve weekly return.
Only "skills rising," "new opportunities," and "updated actions" pass retention test.

---

Decision:
Curated mock data must include change metadata and weekly refresh cadence.

Reason:
Without change in data, "What Changed For You" becomes theater.
Manual weekly JSON updates are acceptable for MVP validation.

---

Decision:
Explicitly out of MVP — community, discussion boards, accounts, live ingestion.

Reason:
Focus retention engineering on change layer and trust before scale features.

---

Decision:
Smallest high-impact feature — personalized "so what for you" one-liner per signal.

Reason:
Proves personalization, delivers 60-second value, anchors signal detail, low build cost.

---

Decision:
MVP validates habit (Week 2 return), not just first-visit format.

Primary metrics: Week 2 return rate, change hero engagement, signal detail from change.

Reason:
Strategic critique identified that first-visit depth alone does not create weekly return.

---

Decision:
Feature retention filter required for all new features.

Litmus test: "Does this give the user a reason to come back next week?"

Reason:
Prevents feature creep that improves first visit but not return visits.

---

## 2026-06-27 — Sprint 1: Premium First-Time Onboarding

### Decision

First-time users see a welcome animation, name capture, personalized greeting, and optional guided tour before the first briefing.

### Reason

Premium first impression and clearer orientation without changing dashboard intelligence logic.

### Implementation

- Routes: `/onboarding/welcome`, `/name`, `/greeting`, `/tour`
- `IdentityService` with `LocalIdentityService` (localStorage key `horizoniq.identity.v1`)
- Future auth providers documented in `lib/identity/future-providers.ts` — not implemented
- Guided tour overlay on dashboard via `data-tour` attributes only
- Tour choice required before first dashboard visit

### Outcome

Approved

---

### Decision

No authentication in Sprint 1.

### Reason

Identity layer must be swappable before Google/GitHub/Supabase integration.

Approved

---

## 2026-06-27 — Sprint 3A: Information Architecture

### Decision

Redesign dashboard hierarchy without changing functionality — one story, progressive disclosure, Intelligence Focus Areas label.

### Reason

Users must understand the page in under 15 seconds. Visual competition and duplicate information violated cognitive load principles.

### Implementation

- Story-driven hero and `StorySection` acts
- `DashboardContextBar` replaces heavy header
- Single-question cards; supporting content in `DisclosurePanel`

### Outcome

Approved — shipped on `main` (`a43eeaa`)

### Review (2026-06-27)

All nine IA principles met after Phase A polish.

---

## 2026-06-27 — Sprint 3B: Premium Visual Experience

### Decision

Visual-only sprint — premium intelligence aesthetic without changing product functionality.

Dark mode first. Typography as primary design element. Strengthen Welcome to HorizonIQ, Observe · Predict · Lead, and Beta Preview branding.

### Reason

HorizonIQ must feel like premium future software (Apple · Linear · Stripe · Bloomberg · Raycast inspiration) — not a generic SaaS dashboard. Visual trust and memorability support retention.

### Implementation

- Deep premium palette in `globals.css`; default theme dark
- Outfit + Inter font pairing
- `BetaBadge`, `TaglineLockup`, `lib/motion.ts`, `app/template.tsx`
- Dashboard/landing/welcome visual pass — hairline surfaces, reduced card noise
- Calmer neural background; subtler motion

### Constraints (locked)

- No functionality, routing, data, or intelligence logic changes
- No glassmorphism overload, neon, or cyberpunk
- Original HorizonIQ identity — Draftly Cognitra inspiration only, no copied layouts

### Outcome

Approved

### Review Scores (2026-06-27)

Premium 8 · Clarity 8 · Typography 8 · Motion 7 · Branding 8 · Trust 8

### Remaining weaknesses

- Light mode secondary to dark
- Signal detail + partial landing/onboarding surfaces not fully reskinned
- 15-second comprehension not measured
- Display name not on dashboard

---

## 2026-06-27 — Sprint 3C: Immersive Intelligence Experience

### Decision

Build the **Living Intelligence Core** — a data-reactive abstract particle field (R3F + GLSL) as HorizonIQ's signature visual. Position as Personal Intelligence Operating System.

### Reason

Users should pause on arrival. The UI should feel alive and intelligent without AI clichés (no globe, brain, or neural network). Visualization represents intelligence, not decoration.

### Implementation

- `IntelligenceFieldLayer` with lazy WebGL + CSS fallback
- Field reacts to signal energy, confidence, region, role, focus areas
- Welcome phased experience: greeting → core reveal → enter
- Ambient field on landing, dashboard, signal detail

### Constraints (locked)

- No video, no Lottie hero, no copied Draftly layouts
- `prefers-reduced-motion` graceful degradation
- No product functionality changes

### Outcome

Approved

### Review Scores (2026-06-27)

Uniqueness 8 · Performance 7 · Accessibility 8 · Originality 8 · Brand 9 · Production 7

---

## 2026-06-27 — Sprint 2.5A: Intelligence Reasoning Layer

### Decision

Every signal renders as a reusable Intelligence Card with seven analyst sections — including outlook (projection) and plain-English confidence tiers.

### Reason

HorizonIQ must behave like an intelligence analyst, not a trend aggregator. Users need causal reasoning, calibrated confidence, and labeled projections without hype.

### Implementation

- `IntelligenceCard` + section/evidence subcomponents
- Extended `lib/intelligence.ts` reasoning builders
- No dashboard redesign; intelligence quality only

### Outcome

Approved

---

## 2026-07-06 — Sprint 3.95: World-Class Feedback System

### Decision

Implement in-app feedback with Supabase storage — floating button, premium modal, automatic metadata, optional screenshots.

### Reason

Beta users need frictionless feedback (Linear/Vercel-quality) without opening an email client. Product team needs structured data for triage and future admin dashboard.

### Implementation

- Client: `components/feedback/*`, `hooks/useFeedback.ts`, `services/feedbackService.ts`
- Server: `app/api/feedback/route.ts` with service role (no client Supabase writes)
- Schema: `supabase/schema/feedback.sql`, bucket `feedback-screenshots`
- Admin query presets only — no admin UI in this sprint

### Privacy

- Optional email only — never required
- Anonymous visitor/session IDs from existing analytics keys
- No modification to analytics provider implementation

### Outcome

Approved

---

## 2026-07-06 — Sprint 3.9: Brand Identity, Legal, Trust & Founder Attribution

### Decision

Add production-grade global footer, legal/trust pages, site navigation, SEO metadata, and founder attribution before public Beta.

### Reason

HorizonIQ must present as a serious software product — discoverable, trustworthy, and legally transparent — without redesigning core intelligence surfaces.

### Implementation

- `components/layout/site-footer.tsx`, `site-nav.tsx`, `footer-link.tsx`
- `app/(site)/` route group for About, Contact, Privacy, Terms, Changelog, Roadmap
- `lib/site.ts` constants; `lib/seo.ts` metadata + JSON-LD
- Public paths exempt from onboarding middleware via `isPublicSitePath()`
- `footer_link_clicked` event wired (existing Sprint 4A taxonomy)

### Constraints (locked)

- No changes to dashboard layout, recommendations, analytics implementation, or pipeline
- Welcome screen design unchanged
- Terms limitation-of-liability and privacy policy marked for formal legal review

### Outcome

Approved

---

## 2026-07-06 — Sprint 4A: Product Analytics & User Intelligence

### Decision

Implement a provider-agnostic analytics layer with Vercel Analytics, Speed Insights, optional Clarity and PostHog — no UI redesign, no business logic changes.

### Reason

Beta is live on Vercel. Engineering foundation is stable. Next priority is measuring real user behavior to validate retention hypotheses (Week 2 return, activation, change hero engagement).

### Implementation

- `lib/analytics/` abstraction — UI calls `track()` only, never provider SDKs
- Anonymous UUID visitor ID (localStorage) + session tracking (sessionStorage + archive)
- Vercel Analytics + Speed Insights in `app/layout.tsx`
- Clarity lazy-loaded in production only via `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- Typed Sprint 4A events; infrastructure events for search/recommendations/forecast (not wired until features ship)
- `docs/analytics/metrics.md` — metric definitions only, no analytics dashboard UI

### Privacy (locked)

- No emails, passwords, or raw search query text
- Anonymous product usage only
- Predefined interest IDs only (no free text)

### Outcome

Approved


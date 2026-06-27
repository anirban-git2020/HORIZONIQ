# HorizonIQ — Project Memory

Version: MVP V1.1 (Change-First)
Status: Active Development

---

## Core Product Principle

Users do not return for signals.

Users return for **changes in signals**.

HorizonIQ is not a signal platform.

HorizonIQ is a **signal change platform**.

Every feature must pass the retention test:

> Does this give the user a reason to come back next week?

If not, cut it or redesign it.

---

## Product Vision

HorizonIQ is not a trend website.

HorizonIQ is a personalized intelligence platform.

Mission:

Help people discover:

- Emerging technologies
- Future skills
- Future careers
- Business opportunities
- Investment opportunities
- Industry shifts

before they become mainstream.

Tagline:

Observe. Predict. Lead.

---

## Core Problem

Information is fragmented.

Users currently need:

- Reddit
- Quora
- LinkedIn
- Google Trends
- Job Boards
- Industry Reports
- News Sites

to understand what is happening.

HorizonIQ becomes the single place where users discover:

- What is changing
- Why it matters
- What to do next

---

## Target Users

### Student

Needs:

- Future skills
- Career paths
- Technologies worth learning

Questions:

- What should I learn?
- Which jobs are growing?
- Which technologies matter?

---

### Professional

Needs:

- Career growth
- Skill upgrades
- Industry intelligence

Questions:

- What skills should I add?
- What trends affect my role?

---

### Entrepreneur

Needs:

- Market opportunities
- Startup ideas
- Emerging demand

Questions:

- What should I build?
- Which markets are growing?

---

### Investor

Needs:

- Growth sectors
- Technology adoption
- Capital flow signals

Questions:

- Where is the next opportunity?

---

## UX Philosophy

Inspired by:

- Apple
- Linear
- Stripe
- Notion
- Bloomberg

Avoid:

- Cyberpunk
- Hacker aesthetics
- Neon effects
- Crypto dashboards
- Generic SaaS templates

The product should feel:

- Premium
- Intelligent
- Calm
- Trustworthy
- Beautiful

---

## Design Principles

Rule #1

Intelligence must be beautiful.

Rule #2

Every visual element must communicate meaning.

Rule #3

Animation is information.

Never decoration.

---

## Intelligence Layer: What Changed For You

The primary intelligence layer of MVP V1.1+.

Not a feature. The product.

### Four-Question Intelligence Contract (Sprint 2.5 → 2.5A)

Every signal is rendered as a reusable **Intelligence Card** answering:

1. **What happened?** — one sentence
2. **Why is it happening?** — underlying drivers from live source activity
3. **Why should you care?** — personalized by role, region, and interests
4. **What should you do next?** — concrete recommendation
5. **Outlook (projection)** — 3–12 month directional view, clearly not a fact
6. **How confident are we?** — High / Medium / Low in plain English
7. **Evidence** — sources, last updated, region, categories

Components: `IntelligenceCard`, `IntelligenceCardSection`, `IntelligenceCardEvidence`  
Logic: `lib/intelligence.ts`

### Trust Contract (Sprint 2.5)

Every signal must also show:

| Element | Implementation |
|---|---|
| **Evidence** | Momentum + confidence drivers (`SignalEvidence`) |
| **Source links** | Clickable URLs — live from pipeline or resolved from labels |
| **Confidence explanation** | Human-readable prose from `buildConfidenceExplanation()` |
| **Last updated** | Briefing `meta.updatedAt` per signal |
| **Region relevance** | Explicit region calibration copy |
| **Role relevance** | Explicit role impact copy |

Rendered in **`IntelligenceConfidencePanel`** — users should trust HorizonIQ without reading documentation.

### Dashboard Contract

Every dashboard must contain:

1. **What Changed** — what is new, rising, falling, or different
2. **Why It Changed** — causal explanation (not just that it moved)
3. **Why It Matters** — personalized impact for this user
4. **What To Do** — one clear recommended action

### Top-Level Section (Required)

**"What Changed Since Your Last Visit"**

- Hero section at top of dashboard
- First thing user sees after onboarding
- Answers: "What is different since I was here last?"

First visit fallback: **"What Changed This Week"** (global briefing period).

Return visits: compare against last visit snapshot (localStorage, no login).

### Signal Contract

Every signal must contain:

| Field | Purpose |
|---|---|
| **What Changed** | `change.summary` — what is new, rising, falling, or stable |
| **Why It Changed** | Causal narrative from `momentumDrivers` |
| **Why It Matters** | Personalized explanation (role × region × interests) |
| **What To Do Next** | Recommended action (role variants) |
| **Evidence** | Momentum + confidence drivers |
| **Sources** | Labeled live/sample with optional `url` |
| **Confidence Explanation** | Prose trust summary |
| **Last Updated** | From active briefing period |
| **Role / Region Relevance** | Explicit relevance copy |

Legacy Observe → Understand → Act maps to:

- Observe = What Changed + Why It Changed
- Understand = Why It Matters (personalized)
- Act = What To Do Next

### Personalization Dimensions

Every explanation must account for:

- **Role** — student, professional, entrepreneur, investor
- **Region** — fixed region list (8 regions)
- **Interests** — multi-select predefined categories

Same signal. Different "so what" per user.

---

## Current MVP Flow

Step 0 — Welcome animation (first visit only; skippable)

Step 0b — Name + personalized greeting (first visit only)

Step 1 — User selects role, region, interests

Step 1b — Guided tour choice (first briefing only)

Step 2 — System creates personalized intelligence briefing

Step 3 — User sees **What Changed Since Your Last Visit** (hero)

Step 4 — User sees changed signals, skills, opportunities, actions

Step 5 — User opens signal detail for full change context

**Time target:** Useful personalized intelligence within 60 seconds (quick-start path: welcome → name → greeting → role → region → briefing).

---

## Identity Layer (Sprint 1)

`IdentityService` (`lib/identity/`) stores:

- `displayName` — used in time-of-day greeting
- Welcome / greeting completion flags
- Guided tour choice (`guided` | `solo`) and completion

Storage: `horizoniq.identity.v1` in localStorage.

Future: Google Login, GitHub Login, Supabase — interface documented; not implemented.

---

## Signal Metadata

Every signal includes:

What Changed + Why It Changed

Why It Matters (base + role/region variants)

What To Do Next (base + role variants)

Momentum + Confidence (with drivers + explanation prose)

Sources (labeled, clickable when URL available)

Role relevance + Region relevance (explicit copy)

Last updated timestamp (briefing period)

---

## Data Strategy

**Catalog + weekly briefing** architecture with **live 5-source pipeline** (Hacker News, arXiv, Wikimedia, GitHub, Product Hunt).

- Evergreen definitions: `data/catalog/signals.json`
- Weekly state: `data/briefings/{period}.json`
- Pipeline: `npm run pipeline:full` + GitHub Actions (Monday 06:00 UTC)
- Curated explanations; live activity metrics from pipeline

No new data sources in Sprint 2.5 — intelligence quality improved in presentation layer.

Visit state stored in localStorage:

- `lastVisitAt`
- Snapshot of signal states at last visit

---

## Sprint 3A — Information Architecture (Complete)

**Mission:** Redesign dashboard hierarchy without changing functionality. User understands the page in under 15 seconds.

### Nine Principles — All Met (post Phase A polish)

| # | Principle | Status |
|---|---|---|
| 1–5 | Primary message, disclosure, story, no competition, clear purpose | **Met** |
| 6 | Intelligence Focus Areas label | **Met** — incl. step progress "Focus Areas" |
| 7–8 | Apple hierarchy, no duplicates | **Met** |
| 9 | One question per card | **Met** — incl. watchlist single question |

---

## Sprint 3C — Immersive Intelligence Experience (Shipped)

**Mission:** Transform HorizonIQ into a Personal Intelligence Operating System — not a dashboard. One signature visual: the **Living Intelligence Core**.

**Technology:** React Three Fiber · Three.js · GLSL shaders · Framer Motion · lazy-loaded WebGL

### Living Intelligence Core

Abstract particle intelligence field — **not** a globe, brain, or neural-network cliché. Represents knowledge, connections, discovery, momentum, prediction.

| Behavior | Data source |
|---|---|
| Motion energy | Signal momentum + change type (rising/new) |
| Brightness | Confidence tier average |
| Field reorganization | Region phase (8 regions) |
| Color tint | Role |
| Vertical density | Intelligence Focus Areas count |

Motion uses irrational frequency offsets so patterns **never repeat exactly**. Field breathes subtly.

### Architecture

```
lib/intelligence-field/params.ts     → computeIntelligenceFieldParams()
lib/intelligence-field/shaders.ts  → GLSL vertex/fragment
components/intelligence-field/
  intelligence-field-layer.tsx     → page wrapper
  intelligence-field-canvas.tsx    → lazy R3F + fallback
  living-intelligence-core.tsx     → Canvas scene
  intelligence-field-points.tsx    → shader Points mesh
  intelligence-field-fallback.tsx  → CSS procedural (reduced motion)
hooks/use-intelligence-field-params.ts
hooks/use-reduced-motion.ts
```

### Surfaces

| Page | Variant | Behavior |
|---|---|---|
| Welcome | `welcome` | Phased: greeting → core reveal → Enter |
| Landing | `hero` | Full field behind hero |
| Dashboard | `ambient` | Reacts to user signals + preferences |
| Signal detail | `ambient` | Reacts to single signal |

### Performance

- Lazy dynamic import (no SSR WebGL)
- Particle budget: ~9k desktop · ~5k tablet · ~2.8k mobile
- `prefers-reduced-motion` → CSS fallback
- `dpr` capped at 1.75

### Post-Implementation Review (Apple · IDEO · Stripe · Linear · Palantir lens)

| Dimension | Score | Notes |
|---|---|---|
| **Visual uniqueness** | 8/10 | Original abstract field; recognizable HorizonIQ signature |
| **Performance** | 7/10 | Lazy load works; multiple canvases on navigation need monitoring |
| **Accessibility** | 8/10 | Reduced-motion fallback; field is decorative (`aria-hidden`) |
| **Originality** | 8/10 | Not imitating AI SaaS templates; data-reactive not decorative |
| **Brand identity** | 9/10 | Welcome → core moment is memorable; tagline + field unified |
| **Production readiness** | 7/10 | Shipped; needs FPS telemetry and single-canvas optimization |

### Top 10 Improvements (Next)

1. **Single shared canvas** — one WebGL context across route changes (avoid remount)
2. **FPS / GPU tier detection** — auto particle budget + quality presets
3. **Onboarding continuity** — ambient field on role/region steps (same organism)
4. **Briefing period pulse** — field energy spike on new weekly briefing
5. **WebGL load skeleton** — match fallback gradient until shaders compile
6. **Dev performance overlay** — frame time monitoring in beta
7. **Touch microinteractions** — subtle haptic on primary CTAs (mobile)
8. **Landing section pass** — pillars/trust panel aligned with 3B/3C surfaces
9. **Core screenshot moment** — shareable still for marketing
10. **Welcome timing A/B** — optimize core reveal duration for comprehension vs awe

---

## Sprint 3B — Premium Visual Experience (Shipped)

**Mission:** Transform UI into a premium intelligence experience — elegant, minimal, dark-first, typography-led. No functionality changes.

**Inspiration:** Apple · Linear · Stripe · Bloomberg · Raycast (original HorizonIQ identity — not copied layouts)

### Design System

| Layer | Change |
|---|---|
| **Color** | Deep dark-first palette; restrained teal primary; excellent contrast |
| **Typography** | Outfit headings + Inter body; `display-title`, `tagline-line`, `prose-lead` |
| **Motion** | `lib/motion.ts` tokens; subtle fade-up; page template transition; 60fps micro-interactions |
| **Surfaces** | Hairline dividers over card boxes; `flat` PremiumCard; `bg-ambient` page wash |
| **Branding** | `BetaBadge`, `TaglineLockup`, strengthened welcome + landing lockup |

### Components

- `components/brand/beta-badge.tsx`
- `components/brand/tagline-lockup.tsx`
- `lib/motion.ts`
- `app/template.tsx`

### Post-Implementation Review Scores (2026-06-27)

| Dimension | Score | Notes |
|---|---|---|
| **Premium feel** | 8/10 | Deep palette, calm surfaces, reduced card noise |
| **Clarity** | 8/10 | Typography hierarchy improved; hero reads faster |
| **Typography** | 8/10 | Outfit + scale refinements; tagline lockup memorable |
| **Motion** | 7/10 | Subtle and purposeful; page fade adds polish |
| **Branding** | 8/10 | Welcome + Beta Preview + tagline strengthened |
| **Trust** | 8/10 | Calm professional tone; provenance unchanged and clear |

### Remaining Weaknesses

- Light mode less refined than dark (dark-first; light is companion)
- Signal detail page not fully reskinned in 3B (inherits tokens only)
- Onboarding profile steps (role/region) unchanged visually
- 15-second comprehension still not instrumented
- Display name not yet on dashboard
- Some landing sections (`LandingPillars`, `DataTrustPanel`) retain pre-3B card styling

---

## Sprint 3A — Information Architecture (archived detail)

---

## Sprint 2.5A — Intelligence Reasoning Layer (Complete)

### Added

- `IntelligenceCard` with `full` / `summary` / `compact` variants
- Seven-section analyst contract including outlook (projection) and plain-English confidence
- Interest-aware `buildWhyYouShouldCare()`
- `buildOutlook()` — rule-based 3–12 month projections, no hype

### Changed

- All signal UI uses `IntelligenceCard` (not trend-aggregator blocks)
- `SignalIntelligence` type expanded for reasoning layer

---

## Sprint 2.5 — Intelligence Quality (Complete)

### Added

- `lib/intelligence.ts` — four-question assembler, role/region relevance, source URL enrichment
- `IntelligenceConfidencePanel` — trust without documentation
- `SignalIntelligenceBlock` — consistent 4-question layout (full / compact / inline)
- `buildConfidenceExplanation()` + `resolveSourceUrl()` in `lib/trust.ts`
- Source `url` field on `DataSource` schema; pipeline preserves observation URLs

### Changed

- Signal cards, hero rows, watchlist, and detail page use 4-question contract
- Signal detail: Intelligence Brief + Intelligence Confidence Panel (removed low-value sections)
- Skill / opportunity / action cards trimmed to decision-relevant fields only
- `SignalView` extended with intelligence bundle + trust fields

### Removed from signal surfaces

- Decorative rank badges, duplicate momentum displays, non-actionable industry lists on detail
- Card clutter that did not aid decisions

---

## Region Options (Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

No free text.

---

## Interest Options (Fixed, Multi-Select)

**Technology:** Artificial Intelligence · Robotics · Quantum Computing · Cybersecurity · Cloud Computing

**Industry:** Manufacturing · Supply Chain · Healthcare · Finance · Energy

**Business:** Entrepreneurship · Startups · Venture Capital · Product Management

---

## Signal Detail View

Clicking a signal opens a dedicated page.

Sections:

- Overview (current state)
- What Changed (since last period)
- Momentum Drivers
- Affected Industries
- Recommended Skills
- Opportunities
- Recommended Actions

Each section answers the six user questions:

1. What is happening?
2. Why does it matter?
3. What industries are affected?
4. What skills are relevant?
5. What opportunities are emerging?
6. What action should the user take?

No relationship graphs in MVP.

---

## Feature Retention Filter

Every proposed feature must pass:

> Does this give the user a reason to come back next week?

If the data did not change, would this feature still feel valuable on visit 2?

- **Yes** → build or keep (possibly reframed)
- **No** → cut, hide, or defer

### Approved (Improves Weekly Return)

- "What Changed Since Your Last Visit" hero
- Change metadata in signal datasets
- localStorage visit snapshot (no login)
- Personalized explanations (role × region × interest)
- "What Changed This Week" first-visit fallback
- One primary action per briefing
- Labeled sources on every signal
- Signal detail with change-first layout
- Weekly manual data refresh (operational requirement)

### Conditional (Reframe Required)

- **Skills** → "Skills Rising" (demand change only)
- **Opportunities** → "New This Week" / "Heating Up" only
- **Actions** → one primary + optional secondary
- **Momentum / confidence** → always show change arrow (↑/↓ since last period)
- **Signal detail** → lead with What Changed, not overview

### Rejected for MVP (Does Not Improve Weekly Return)

- Signal relationship map
- Relationship flow visualizations
- Community / discussion boards
- More signals on dashboard (volume ≠ value)
- AI chatbot as homepage
- User accounts (defer — email digest is post-MVP retention multiplier)

---

## MVP Priority Stack (Build Order)

1. Change metadata in JSON datasets
2. Visit snapshot in localStorage
3. "What Changed For You" hero section
4. Personalized "so what for you" explanations
5. Reframe downstream sections (skills rising, new opportunities)
6. Signal detail page (change-first layout)
7. Remove / hide signal map and relationship UI

Deprioritized / removed from MVP:

- Signal relationship map
- Relationship flow visualizations
- Community features
- Discussion boards
- User accounts
- Live data ingestion
- Premium features

---

## Implementation Status

### Already Exists

- Core vision and product direction
- User personas and design principles
- Onboarding flow (welcome → name → greeting → role → region → interests → tour choice) with 8 regions and 14 categorized interests
- **What Changed For You** hero section
- Dashboard with change-first signals, skills rising, opportunities, actions
- Signal detail pages (`/signals/[id]`) with full `IntelligenceCard` analyst layout
- **Sprint 2.5 / 2.5A:** `IntelligenceCard`, `lib/intelligence.ts`, seven-section reasoning contract
- **Sprint 3C:** Living Intelligence Core (R3F + GLSL), data-reactive field, welcome core reveal
- JSON data layer with catalog + briefing + change metadata
- Live 5-source pipeline + weekly GitHub Actions refresh
- Data access layer (`lib/data/access.ts`)
- Visit snapshot (`lib/visit-snapshot.ts`) for return-visit diffs
- Role-based personalization ("so what for you") + explicit role/region relevance
- Primary action per briefing
- Briefing freshness UI in change hero (`briefingLabel`, "Updated [date]")
- Clickable source links (pipeline URLs + label-based fallback)
- Confidence explanation prose on every signal
- Sprint 1 first-time onboarding: welcome animation, name + greeting, IdentityService, guided tour overlay

### Needs Improvement

- Sprint 3C follow-up: shared WebGL canvas, GPU tier detection, onboarding field continuity
- Broader signal coverage across all 14 interests
- Analytics for Week 2 return rate and 15-second dashboard comprehension
- More region-specific explanation variants in catalog
- PostHog funnels for trust interactions (source clicks, confidence panel)

### Not Yet Started

- Relationship graph (future)
- Discussion boards
- User accounts
- Community features
- Email digest for weekly briefing

~~Live data ingestion~~ — **Built** (5-source pipeline). No *additional* sources until post-PMF.

---

## Living Intelligence Network

Future Version

Signals should connect.

Example:

Battery Technology
→ Energy Storage
→ Renewables
→ Grid Modernization

Users should understand:

- causes
- effects
- dependencies

through visualization.

---

## Data Sources (Future)

Jobs
Patents
Research Papers
Funding
News
Government Reports
Startup Databases

---

## Business Model

Freemium

Free:
Basic intelligence

Premium:
Advanced intelligence
Forecasting
Industry reports
Opportunity scoring

Enterprise:
API
Custom intelligence
White-label dashboards

---

## Non Negotiables

No login required for MVP.

No AI chatbot as homepage.

No dashboard overload.

No random metrics.

No fake data without labels.

No dark cyberpunk aesthetics.

No unnecessary 3D.

No meaningless animations.

No relationship graphs in MVP.

No community or discussion features in MVP.

Every screen must answer:

"What changed, why it matters, and what to do."

for the user.

---

## Retention Metrics (MVP Success)

Primary:

- **Week 2 return rate** — did they come back?
- **Change section engagement** — did they read "What Changed"?
- **Signal detail from change** — did change drive depth?

Secondary:

- Time to first actionable insight (< 60 seconds)
- Onboarding completion rate
- Trust indicators (source expansion, explanation reads)

MVP validates **habit**, not just **format**.

---

## Current Direction

The platform should feel like:

"Your personal future analyst who tells you what changed."

not

"An AI tool"

not

"A dashboard"

not

"A trend tracker"

not

"A static signal feed"

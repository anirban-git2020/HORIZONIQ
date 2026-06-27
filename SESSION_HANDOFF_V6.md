# HorizonIQ — Session Handoff V6

**Last updated:** 2026-06-27  
**Version:** MVP V1.1 (Change-First) + Live Pipeline + Sprint 1–3A  
**Status:** Active Development — **Deployed to Vercel (beta)** + local dev  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V5.md`, `SESSION_HANDOFF_V4.md`, and earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `npm run dev` or `start-dev.bat` → `http://localhost:3000`

**Repo state (2026-06-27):**

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Sprint 1–3A, intelligence reasoning, dashboard IA, tour fixes, analytics, trust labeling, live pipeline (`a43eeaa` latest) |
| **Sprint 3A polish (not yet coded)** | Step-progress "Interests" label, dead component deletion, optional watchlist single-question trim |

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `CHANGELOG.md` → `.cursorrules`

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Core product principle:**

> Users do not return for signals. Users return for **changes in signals**.

**Intelligence positioning (Sprint 2.5A):**

> HorizonIQ must behave like an **intelligence analyst**, not a trend aggregator.

**Experience goal:** Feel like *"Your personal future analyst who tells you what changed."*

**Target users:** Student · Professional · Entrepreneur · Investor

**Design inspiration:** Apple · Linear · Stripe · Notion · Bloomberg

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP) · dashboard overload · AI hype language

**Feature retention filter (every new feature):**

> Does this give the user a reason to come back next week?

**IA goal (Sprint 3A):** User understands the dashboard in **under 15 seconds** via one story: What changed → Why it matters → What to do.

---

## 2. MVP Definition

### MVP V1.1 Objective

Validate **habit**, not just first-visit format.

A user receives useful, personalized intelligence and has a reason to **return weekly**. The product must prove the **return loop**, not just the briefing format.

### Success Metrics (Primary)

| Metric | Intent | Status |
|---|---|---|
| Week 2 return rate | Did change create habit? | **Instrumented** — PostHog + local buffer; **funnels not built** |
| Change hero engagement | Did users read "What Changed"? | **Instrumented** — `change_hero_viewed` |
| Signal detail from change | Did change drive depth? | **Instrumented** — `signal_click` + `signal_detail_viewed` with `source` |

### Success Metrics (Secondary)

| Metric | Target | Status |
|---|---|---|
| Time to first actionable insight | < 60s | **Partially met** — quick-start helps; Sprint 1 adds pre-steps |
| Onboarding completion rate | — | **Instrumented** — `onboarding_completed` with `path: quick \| custom` |
| Trust indicators | Source reads, confidence engagement | **Not instrumented** |
| 15-second dashboard comprehension | Sprint 3A goal | **Shipped (IA)** — not yet measured |

### Dashboard Story Contract (Sprint 3A)

Every dashboard visit tells one story in the hero:

1. **What changed** — compact signal list (one line each)
2. **Why it matters** — lead change personalization
3. **What to do** — primary recommended action (shown **once**)

Return visits add progressive depth below the fold.

### Intelligence Card Contract (Sprint 2.5A)

Every signal has a reusable **`IntelligenceCard`** (`components/intelligence/`) answering:

| # | Question | Field |
|---|---|---|
| 1 | What happened? | `whatHappened` (one sentence) |
| 2 | Why is it happening? | `whyItIsHappening` (drivers) |
| 3 | Why should you care? | `whyYouShouldCare` (role × region × focus areas) |
| 4 | What should you do next? | `whatToDoNext` |
| 5 | What could happen in 3–12 months? | `outlook` (labeled **projection**) |
| 6 | How confident are we? | `confidenceTier` + `confidenceExplanation` (High / Medium / Low) |
| 7 | Evidence | sources, last updated, region, categories |

Assembled in `lib/intelligence.ts` → `SignalIntelligence` on `SignalView`.

**Detail page:** `IntelligenceCard` variant `full`.  
**Dashboard cards:** single-question focus modes — no multi-question clutter.

### Data Provenance (Briefing)

| Value | Meaning | UI label |
|---|---|---|
| `pipeline` | ≥4 healthy live sources ingested | **Live intelligence** |
| `pipeline-mock` | 2–3 sources; partial live | **Mixed live + sample data** |
| `curated-mock` | No pipeline; demo only | **Sample briefing** |

**Active briefing:** `pipeline` · Period **`2026-W26`**

### Terminology (Sprint 3A)

| Old (internal) | User-facing (Sprint 3A+) |
|---|---|
| Interests | **Intelligence Focus Areas** |
| `prefs.interests` | unchanged in code — label only |

Constants: `lib/copy.ts` — `INTELLIGENCE_FOCUS_AREAS_LABEL`, `ADJUST_FOCUS_AREAS_LABEL`, `STORY_ACTS`

### Full User Flow

```
/ (landing)
  → /onboarding/welcome          [Sprint 1 — skippable animation]
  → /onboarding/name             [display name]
  → /onboarding/greeting         [time-of-day salutation]
  → /onboarding/role             [profile: role]
  → /onboarding/region           [region; quick-start OR customize focus areas]
  → /onboarding/interests        [optional — custom path]
  → /onboarding/tour             [guided tour vs explore]
  → /dashboard                   [story hero + context bar + depth]
  → /signals/[id]                [full IntelligenceCard]
```

**Quick path:** welcome → name → greeting → role → region → **Start my briefing** → tour → dashboard.

### Explicitly Out of MVP Scope

- User accounts / login (IdentityService local-only; auth stubs documented)
- Email digest
- Relationship graphs / Living Intelligence Network
- Community / discussion boards
- Premium / enterprise tiers
- AI chatbot homepage
- Paid APIs for data ingestion
- LLM summarization in pipeline
- Supabase (future)
- React Three Fiber immersive dashboard (approved Phase 2, not built)

---

## 3. Completed Features

### Deployment & Analytics (on `main`)

- [x] **Vercel deployment** — `https://horizoniq-beta.vercel.app/`
- [x] **Provider-agnostic analytics** — `lib/analytics/`
- [x] **PostHog** — optional via `NEXT_PUBLIC_POSTHOG_KEY`
- [x] **Events:** `onboarding_started`, `onboarding_role_selected`, `onboarding_region_selected`, `onboarding_completed`, `dashboard_viewed`, `change_hero_viewed`, `signal_click`, `signal_detail_viewed`, `start_over`
- [x] **ThemeToggle hydration fix**
- [x] **`<body suppressHydrationWarning>`** — Grammarly/extension attribute mismatches *(local)*

### Landing (`/`)

- [x] Hero: *"See what is changing before everyone else does."*
- [x] Provenance badge + honest subheadline (live sources when `pipeline`)
- [x] **DataTrustPanel**, pillars, **Why HorizonIQ?**
- [x] CTA → `/onboarding/welcome`

### Sprint 1 — Premium First-Time Onboarding (on `main`)

- [x] Welcome, name, greeting, tour choice, guided tour overlay
- [x] **IdentityService** — `horizoniq.identity.v1`
- [x] **`getFirstTimeOnboardingPath()`** resume routing
- [x] Onboarding compression — quick-start, `ROLE_DEFAULT_INTERESTS`, tour gate

### Sprint 1 Fixes (local)

- [x] Guided tour **SVG mask spotlight** — highlighted sections visible (not greyed out)
- [x] Tour deferred until layout ready; visit snapshot deferred until tour complete
- [x] Identity onboarding guards on dashboard, tour, signal detail, welcome/name/greeting pages

### Live Data Pipeline (on `main`)

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full`
- [x] **GitHub Actions** — Monday 06:00 UTC (`weekly-briefing.yml`)
- [x] Catalog + briefing architecture (`data/catalog/signals.json` + `data/briefings/{period}.json`)

### Trust (on `main` + local)

- [x] Provenance badges, `DataTrustPanel`, honest copy via `lib/trust.ts`
- [x] Dashboard footer — provenance, period, updated date
- [x] **Clickable source URLs** — pipeline `url` + `resolveSourceUrl()` label fallback *(local)*
- [x] Confidence explanation prose *(local)*

### Sprint 2.5 / 2.5A — Intelligence Quality & Reasoning (local)

- [x] **`lib/intelligence.ts`** — reasoning builders, outlook, confidence tiers
- [x] **`IntelligenceCard`** + `IntelligenceCardSection` + `IntelligenceCardEvidence`
- [x] `SignalView.intelligence` bundle on every personalized signal
- [x] Signal detail — full analyst brief
- [x] Source `url` on `DataSource`; pipeline preserves observation URLs

### Sprint 3A — Information Architecture (on `main`)

- [x] **Story-driven hero** — What changed → Why it matters → What to do (one card)
- [x] **`StorySection`** — story act headers
- [x] **`DashboardContextBar`** — role, region, Intelligence Focus Areas (replaces heavy header)
- [x] **`DisclosurePanel`** — skills + opportunities collapsed by default
- [x] **Single-question cards** — `SignalCard` `focus="why"`, trimmed skill/opportunity/action cards
- [x] Primary action **once** in hero; actions section = secondary only
- [x] **Intelligence Focus Areas** label across dashboard, onboarding, guided tour
- [x] Removed from active dashboard: `DashboardHeader`, `RoleLens`, duplicate intelligence in hero rows

### Retention Infrastructure

- [x] Visit snapshot — `horizoniq-visit-snapshot`
- [x] `isReturnVisitForPeriod()` — same-week return diff
- [x] First visit: Week 1 hero + watchlist; return visit: full story + depth sections

---

## 4. Pending Features

### Commit & Deploy

- [x] Commit Sprint 2.5, 2.5A, 3A + tour/IA fixes to `main` (`a43eeaa`)
- [x] Push → Vercel auto-deploy
- [ ] Verify production build with PostHog env vars (if not already set)

### Sprint 3A Polish (Hierarchy Only — No New Features)

- [ ] `step-progress.tsx` — replace "Interests" with Intelligence Focus Areas
- [ ] Delete dead code: `dashboard-header.tsx`, `role-lens.tsx`, `story-intro.tsx`
- [ ] Optional: watchlist rows → one question per row (principle 9)
- [ ] Measure 15-second dashboard comprehension

### Post-Sprint Polish

- [ ] **Display name on dashboard** — baseline banner / hero salutation from `identityService`
- [ ] **PostHog funnels** — Week 2 return, `path: quick` vs `custom`, change-hero → signal-detail
- [ ] **Product Hunt rate limit hardening** — frequent HTTP 429 → `stale`
- [ ] **Remove dead code** — `dashboard-header.tsx`, `role-lens.tsx`, `story-intro.tsx` (unused)
- [ ] **Sync ROADMAP.md** checkboxes with shipped reality

### Product Gaps

- [ ] Broader catalog coverage — sparse focus areas (arts, commerce, biochemistry)
- [ ] More region-specific explanation variants in catalog
- [ ] Trust instrumentation (source clicks, evidence expand)
- [ ] `guided_tour_completed` analytics event

### Phase 2+ (Approved, Not Built)

- [ ] Email weekly digest
- [ ] Action follow-up loop
- [ ] User accounts (wire IdentityService to Google/GitHub/Supabase)
- [ ] React Three Fiber immersive dashboard
- [ ] Premium / enterprise
- [ ] Living Intelligence Network (relationship graphs)

### Explicitly Not Using

- Google Trends scrapers, GitHub Trending scrapers, paid APIs, Reddit API, LLM in pipeline

---

## 5. Current Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS** + shadcn/ui patterns |
| Motion | **Framer Motion** |
| Analytics | **posthog-js** (optional) + `lib/analytics` local buffer |
| Client state | **localStorage** — preferences, identity, visit snapshot, analytics |
| Pipeline CLI | **tsx** + **dotenv** |
| CI data refresh | **GitHub Actions** (Node 24) |
| Hosting | **Vercel** |
| Not in use | Supabase, database, user auth, R3F/Three.js |

### End-to-End Data Flow

```
GitHub Actions (Monday 06:00 UTC)  OR  npm run pipeline:full
        ↓
lib/pipeline/ingest/*              → HN, arXiv, Wikimedia, GitHub, Product Hunt
        ↓
data/pipeline/observations/
        ↓
lib/pipeline/score/*
        ↓
data/pipeline/scores/
        ↓
lib/pipeline/generate/briefing   → briefings/{period}.json + meta + derived JSON
        ↓
lib/data/briefings-registry.ts   (auto-regenerated)
        ↓
lib/data/resolve-signals.ts      → catalog + briefing → SignalRecord[]
        ↓
lib/data/access.ts + lib/personalize.ts + lib/intelligence.ts
        ↓
app/dashboard, app/signals/[id]
        ↓
lib/visit-snapshot.ts            → return-visit diff (localStorage)
```

### Personalization Flow

```
Role + Region + Intelligence Focus Areas (interests)
        ↓
lib/preferences.tsx          → horizoniq.preferences.v2
lib/identity/*               → horizoniq.identity.v1
        ↓
lib/personalize.ts           → toSignalView() + getWhatChangedForYou()
lib/intelligence.ts          → buildSignalIntelligence()
        ↓
Dashboard + Signal Detail (IntelligenceCard)
```

### Module Map

| Module | Responsibility |
|---|---|
| `lib/types.ts` | Core interfaces (`SignalView`, `SignalIntelligence`, preferences) |
| `lib/options.ts` | Roles, regions, focus areas, `ROLE_EXPERIENCE`, defaults |
| `lib/copy.ts` | User-facing labels (Sprint 3A) |
| `lib/intelligence.ts` | Analyst reasoning assembly |
| `lib/trust.ts` | Provenance, disclaimers, `resolveSourceUrl()` |
| `lib/data/*` | Schemas, access, resolve-signals, briefings-registry |
| `lib/personalize.ts` | Dashboard business logic |
| `lib/visit-snapshot.ts` | Return-visit diff |
| `lib/preferences.tsx` | Profile preferences context |
| `lib/identity/*` | IdentityService (Sprint 1) |
| `lib/onboarding-flow.ts` | First-time resume routing |
| `lib/analytics/*` | Event taxonomy, track, PostHog |
| `lib/pipeline/*` | Ingest, score, generate briefing |

---

## 6. Current File Structure

```
HorizonIQ/
├── .github/workflows/
│   └── weekly-briefing.yml
│
├── app/
│   ├── page.tsx                         # Landing
│   ├── layout.tsx                       # Theme, Preferences, Analytics; body suppressHydrationWarning
│   ├── globals.css
│   ├── dashboard/page.tsx               # Story hero + context bar + progressive depth
│   ├── onboarding/
│   │   ├── welcome/page.tsx
│   │   ├── name/page.tsx
│   │   ├── greeting/page.tsx
│   │   ├── role/page.tsx
│   │   ├── region/page.tsx              # Quick-start + customize focus areas
│   │   ├── interests/page.tsx
│   │   └── tour/page.tsx
│   └── signals/[id]/page.tsx            # Full IntelligenceCard
│
├── components/
│   ├── analytics/analytics-provider.tsx
│   ├── intelligence/                    # Sprint 2.5A — analyst cards
│   │   ├── intelligence-card.tsx        # full | summary | compact
│   │   ├── intelligence-card-section.tsx
│   │   └── intelligence-card-evidence.tsx
│   ├── landing/                         # hero, pillars, data-trust-panel, why-horizoniq
│   ├── trust/provenance-badge.tsx
│   ├── onboarding/
│   │   ├── welcome-screen.tsx
│   │   ├── first-time-shell.tsx
│   │   ├── guided-tour-overlay.tsx      # SVG mask spotlight
│   │   ├── onboarding-shell.tsx
│   │   └── observe-understand-act-steps.tsx
│   ├── dashboard/
│   │   ├── what-changed-hero.tsx        # RETENTION CORE — story acts
│   │   ├── story-section.tsx            # Sprint 3A
│   │   ├── dashboard-context-bar.tsx    # Sprint 3A
│   │   ├── disclosure-panel.tsx         # Sprint 3A
│   │   ├── signal-card.tsx              # focus: change | why | action
│   │   ├── skill-card.tsx, opportunity-card.tsx, action-card.tsx
│   │   ├── signals-we-are-tracking.tsx
│   │   ├── baseline-briefing-banner.tsx
│   │   ├── change-badge.tsx, signal-evidence.tsx, section.tsx
│   │   ├── dashboard-header.tsx         # DEPRECATED — unused
│   │   ├── role-lens.tsx                # DEPRECATED — unused
│   │   └── story-intro.tsx              # DEPRECATED — unused
│   ├── layout/                          # top-bar, intelligence-background
│   ├── motion/, theme/, ui/
│   └── brand/logo.tsx
│
├── lib/
│   ├── identity/
│   ├── analytics/
│   ├── data/
│   ├── pipeline/
│   ├── intelligence.ts                  # Sprint 2.5A reasoning
│   ├── copy.ts                          # Sprint 3A labels
│   ├── onboarding.ts, onboarding-flow.ts
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts
│   ├── trust.ts, types.ts, options.ts, utils.ts
│   └── neural-network.ts
│
├── data/
│   ├── meta.json
│   ├── catalog/signals.json             # 17 evergreen signals
│   ├── briefings/2026-W26.json
│   ├── pipeline/observations/, scores/
│   ├── skills.json, jobs.json, recommendations.json, regions.json
│   └── README.md
│
├── scripts/                             # pipeline-ingest, generate, full
├── .env.example
│
├── VISION.md
├── PROJECT_MEMORY.md                    # Canonical product spec
├── PROJECT_DECISIONS.md
├── ROADMAP.md, CHANGELOG.md
├── SESSION_HANDOFF_V6.md                # This file
├── SESSION_HANDOFF_V5.md                # Superseded
└── .cursorrules
```

---

## 7. UI Decisions

### Design Principles (`.cursorrules`)

1. Simplicity → Clarity → Performance → Scalability → Accessibility  
2. Intelligence must be beautiful; every element communicates meaning  
3. Animation is information — never decoration  
4. User understands the page within **10–15 seconds** (Sprint 3A: **15s** dashboard goal)  
5. Premium, calm, trustworthy — Apple / Linear / Stripe quality  

### Visual Language

- `PremiumCard` for elevated surfaces  
- `label-caps` for section labels  
- `display-title` for primary hero headlines  
- `section-title` for secondary headings  
- Change badges: New · Rising · Falling · Stable  
- Provenance badges: Live · Mixed · Sample  
- `IntelligenceBackground` on landing  

### Sprint 3A — Dashboard IA

| Principle | Implementation |
|---|---|
| One primary message | Hero `display-title` + story acts — no competing header |
| Progressive disclosure | Skills/opportunities in `DisclosurePanel` (collapsed) |
| One story | Hero: changed → matters → action |
| No visual competition | Removed stats row, RoleLens, duplicate intelligence blocks |
| One question per card | `SignalCard focus="why"`; skill/opportunity/action single Q |
| Intelligence Focus Areas | Replaces "Interests" in all user-facing copy |

### Page-Specific UI

| Surface | Decisions |
|---|---|
| Landing | Hero + provenance + DataTrustPanel; CTA → welcome |
| Welcome | Full-screen Observe/Predict/Lead; Skip |
| Name / Greeting | `FirstTimeShell` — minimal |
| Profile onboarding | Role · Region · Focus Areas (route still `/interests`) |
| Tour | SVG spotlight cutout; `data-tour` targets |
| **Dashboard (all visits)** | Baseline (first) → **Story hero** → **Context bar** → depth |
| **Dashboard (first)** | + watchlist only |
| **Dashboard (return)** | Why-it-matters grid → secondary actions → disclosure |
| Signal detail | Full `IntelligenceCard` + related moves + trust footer |

### First vs Return Visit

| | First visit | Return visit |
|---|---|---|
| Hero title | Week 1 Briefing | What Changed Since Your Last Visit |
| Baseline banner | One-line status | No |
| Context bar | Yes | Yes |
| Watchlist | Yes | No |
| Signal grid (why cards) | No | Yes |
| Secondary actions | No | Yes (primary in hero) |
| Supporting disclosure | No | Yes (skills + opportunities) |
| Guided tour | If user chose guided | No |

### Role-Specific Supporting Section Order (inside disclosure)

Order preserved from `ROLE_EXPERIENCE.sectionOrder` — only `skills` and `opportunities` render inside disclosure, in role-specific order.

| Role | Disclosure order |
|---|---|
| Student | skills → opportunities |
| Professional | skills → opportunities |
| Entrepreneur | opportunities → skills |
| Investor | opportunities → skills |

### Smart Default Focus Areas (Quick-Start)

| Role | Defaults |
|---|---|
| Student | AI, Cybersecurity, Healthcare |
| Professional | AI, Cybersecurity, Cloud |
| Entrepreneur | AI, Healthcare, Finance |
| Investor | AI, Healthcare, Finance |

### Regions (8 Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

### Guided Tour Targets (`data-tour`)

| Attribute | Target |
|---|---|
| `dashboard` | Root dashboard container |
| `what-changed` | Story hero |
| `signals` | Compact change list (hero) or watchlist (first visit) |
| `opportunities` | Inside disclosure panel (return) or fallback copy |
| `recommended-actions` | Hero Act 3 — primary action |

---

## 8. Data Strategy

### Architecture

- **Evergreen catalog:** `data/catalog/signals.json` — names, explanations, actions, industries  
- **Weekly briefing:** `data/briefings/{period}.json` — momentum, confidence, change, sources, drivers  
- **Merge:** `lib/data/resolve-signals.ts` → `SignalRecord[]`  
- **Derived:** `skills.json`, `jobs.json`, `recommendations.json` — pipeline-updated  
- **No database** — JSON in git; Vercel bundles at build  

### Active Meta (`data/meta.json`)

```json
{
  "briefingPeriod": "2026-W26",
  "briefingLabel": "Week of June 22, 2026 – June 28, 2026",
  "updatedAt": "2026-06-27T11:08:48.439Z",
  "activeBriefingFile": "2026-W26.json",
  "refreshSchedule": "Every Monday at 06:00 UTC"
}
```

### Five Live Sources (Locked — no new sources in Sprint 2.5+)

| Source | API | Token |
|---|---|---|
| Hacker News | Firebase + Algolia | None |
| arXiv | export.arxiv.org | None |
| Wikimedia Pageviews | wikimedia.org REST | None |
| GitHub REST Search | github.com | `GITHUB_TOKEN` / Actions built-in |
| Product Hunt GraphQL v2 | producthunt.com | `PRODUCT_HUNT_TOKEN` |

### Pipeline Commands

```bash
npm run pipeline:ingest    # Fetch observations
npm run pipeline:generate  # Score + write briefing JSON
npm run pipeline:full      # Both
```

**Important:** Restart `npm run dev` after `git pull` or `pipeline:full` — `briefings-registry.ts` is auto-generated.

### Client-Side Storage Keys

| Key | Purpose |
|---|---|
| `horizoniq.preferences.v2` | Role, region, focus areas (`interests`) |
| `horizoniq.identity.v1` | Display name, welcome/greeting/tour state |
| `horizoniq-visit-snapshot` | Return-visit momentum/confidence snapshot |
| `horizoniq.analytics.events.v1` | Local analytics buffer |
| `horizoniq.analytics.session-start` | Session timing for time-to-value |
| `horizoniq.theme` | Light/dark |

---

## 9. Trust Strategy

### Implemented

- Honest landing copy — real pipeline sources only  
- Provenance badges — Live / Mixed / Sample  
- `DataTrustPanel` on landing  
- Dashboard footer — provenance, period, updated, refresh schedule  
- Signal detail + IntelligenceCard evidence — labeled sources  
- **Clickable source URLs** (pipeline `url` or search fallback from labels)  
- Confidence tiers in plain English — High / Medium / Low  
- Outlook clearly labeled **projection**, not fact  
- `dataProvenance` drives all UI via `lib/trust.ts`  

### Remaining Gaps

| Gap | Severity |
|---|---|
| Pipeline source health (`stale`/`failed`) not shown to users | Low |
| Skills/jobs copy partially templated | Low |
| PostHog blocked by ad blockers in some browsers | Low |
| Trust interaction analytics not instrumented | Medium |

### Trust Principles (Locked)

- Label mock vs live explicitly  
- Show reasoning, not just scores  
- Never overclaim beyond what pipeline ingests  
- Curated explanations are honest — activity metrics from live sources when `pipeline`  
- No AI-generated hype in reasoning copy  

---

## 10. Retention Strategy

### North Star

Users return because **something changed for them** — not because a static feed exists.

### Two Layers of Change

| Layer | Trigger | User-facing copy |
|---|---|---|
| **Weekly briefing** | New `briefingPeriod` / Monday pipeline | Fresh live source activity |
| **Visit delta** | Return within same week | "What Changed Since Your Last Visit" |

### Implemented Mechanics

| Mechanic | Implementation |
|---|---|
| Visit snapshot | `horizoniq-visit-snapshot` |
| Return visit diff | Momentum/confidence vs snapshot |
| Briefing period gate | `isReturnVisitForPeriod()` |
| Story hero | What changed → matters → action |
| Signal buckets | New · Rising · Falling |
| First visit baseline | Week 1 + watchlist |
| Primary action | Once in hero Act 3 |
| Weekly live data | GitHub Actions Monday pipeline |
| Analytics | PostHog + local buffer |
| Guided tour | Optional; deferred snapshot until complete |
| Full intelligence depth | Signal detail page |

### Retention Gaps

| Gap | Impact |
|---|---|
| localStorage only | Device-bound; no cross-device |
| No email/digest | No off-device pull |
| No action follow-up | No closed loop from last week's action |
| Display name not on dashboard | Missed personalization payoff |
| Week 2 return not measured in PostHog | Cannot validate MVP hypothesis |

---

## 11. Known Issues

### Product / UX

| Issue | Severity | Notes |
|---|---|---|
| Sprint 3A polish gaps | **Low** | Step-progress label, dead code, watchlist two-question rows |
| Display name captured but not shown on dashboard | Medium | Identity loop incomplete |
| 60-second promise vs full first-time flow | Medium | Quick-start mitigates |
| Empty states for some focus area combos | Medium | arts, commerce, biochemistry thin |
| Guided tour: opportunities inside collapsed disclosure on return | Low | Tour uses fallback copy on first visit |
| Hero + full grid may still feel long on return | Low | Monitor after 3A deploy |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| Dead code: `dashboard-header.tsx`, `role-lens.tsx`, `story-intro.tsx` | Low | Safe to delete |
| `briefings-registry.ts` must regenerate each new week | Low | Automated by pipeline |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| PostHog `NEXT_PUBLIC_*` build-time | Low | Redeploy after env change |
| ROADMAP checkboxes stale | Low | |
| Browser extensions on `<body>` | Low | `suppressHydrationWarning` applied |

### Data

| Issue | Severity | Notes |
|---|---|---|
| Catalog explanations curated, not LLM-generated | By design | Activity metrics live |
| Category/interest label can duplicate in evidence | Fixed | `Set` dedupe in `buildSignalIntelligence` |
| Single briefing week until next Monday pipeline | Low | `2026-W26` active |

---

## 12. Next Tasks (Priority Order)

### 1. Sprint 3A polish (hierarchy only)

**Why:** Close remaining IA gaps from 2026-06-27 review — step-progress label, dead components.  
**Do:** Small targeted edits; no branding or feature changes.

### 2. Use display name on dashboard

**Why:** Closes personalization loop from name capture.  
**Do:** Baseline banner or hero subline with time-of-day + first name from `identityService`.

### 3. PostHog funnels and retention insights

**Why:** MVP validates habit — need Week 2 return, onboarding path, change-hero → signal-detail.  
**Do:** Create PostHog insights; add `guided_tour_completed` event.

### 4. Remove dead dashboard components

**Why:** Reduce noise after 3A.  
**Do:** Delete `dashboard-header.tsx`, `role-lens.tsx`, `story-intro.tsx`.

### 5. Product Hunt rate limit hardening

**Why:** PH frequently `stale` (HTTP 429) in CI.

### 6. Expand catalog coverage for sparse focus areas

**Why:** Empty sections for arts, commerce, biochemistry paths.

### 7. More region-specific explanation variants

**Why:** Personalization depth for 8 regions.

### 8. Sync ROADMAP.md with shipped sprints

### 9. Trust instrumentation

**Why:** Source clicks, evidence expand — secondary retention/trust metrics.

### 10. Onboarding time-to-value optimization

**Why:** Consider collapsing welcome+name for returning users with identity already set.

---

## 13. Quick Start for Next Session

### Run Locally

```powershell
cd C:\HorizonIQ
git pull
copy .env.example .env.local          # first time
npm install
npm run dev
```

Or double-click `start-dev.bat` → `http://localhost:3000`

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` or EU |

Redeploy after changing `NEXT_PUBLIC_*` vars.

### Test Full First-Time Flow

1. Clear localStorage (or Start over)  
2. Landing → Get started → Welcome → Name → Greeting  
3. Role → Region → **Start my briefing** OR Customize focus areas  
4. Tour choice → Dashboard  
5. If guided: complete tour overlay  
6. Return to `/dashboard` → expect return-visit story + disclosure sections  

### Test Analytics (Browser Console)

```javascript
JSON.parse(localStorage.getItem('horizoniq.analytics.events.v1'))
```

### Git Workflow (When Actions Also Commits)

```powershell
git pull --rebase origin main
git push origin main
```

---

## 14. Recent Git History

```
42fd6c7 feat: Sprint 1 premium onboarding, compression, and handoff V5
7e27e0c chore: trigger redeploy with posthog env
ef7e983 feat: add analytics instrumentation with optional PostHog
5c502ad feat: add honest trust labeling across landing and dashboard
4b3e9be chore(pipeline): weekly briefing [skip ci]
```

**Latest on `main`:** `a43eeaa` — intelligence reasoning, dashboard IA, tour fixes, docs.

---

## 15. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (canonical) |
| `PROJECT_DECISIONS.md` | Decision log (Sprints 1, 2.5, 2.5A, 3A) |
| `ROADMAP.md` | Phased roadmap (checkboxes partially stale) |
| `CHANGELOG.md` | Change history |
| `data/README.md` | Weekly refresh checklist |
| `.env.example` | Pipeline + PostHog tokens |
| `.cursorrules` | Agent engineering + design rules |
| `HorizonIQ_UI_Constitution_v1.md` | UI constitution (if present) |

---

## 16. Strategic Context (Decisions Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| Intelligence analyst, not trend aggregator | Locked (2.5A) |
| Dashboard story: changed → matters → action | Locked (3A) |
| Intelligence Focus Areas (not "Interests" in UI) | Locked (3A) |
| No auth for MVP (local IdentityService) | Locked |
| Five free pipeline sources — no new sources in 2.5+ | Locked |
| GitHub Actions for weekly briefing | Built |
| Trust labeling — honest provenance | Built |
| Analytics — PostHog optional + local buffer | Built |
| Vercel hosting | Live (beta) |
| Sprint 1 welcome + name + greeting + tour | On `main` |
| LLM summarization — not in pipeline | Locked |
| R3F dashboard — approved, not built | Future |

---

## 17. Project Memory

*Condensed from `PROJECT_MEMORY.md`. For full spec, read that file.*

### Core Principle

HorizonIQ is a **signal change platform**. Users return for **changes in signals**, not static feeds.

### Retention Test

> Does this give the user a reason to come back next week?

### Product Vision

Personalized intelligence platform helping users discover emerging technologies, skills, careers, opportunities, and industry shifts **before they become mainstream**.

**Tagline:** Observe. Predict. Lead.

### Target Users

| User | Core questions |
|---|---|
| Student | What to learn? Growing jobs? What technologies matter? |
| Professional | What skills to add? What trends affect my role? |
| Entrepreneur | What to build? Which markets growing? |
| Investor | Where is the next opportunity? |

### UX Philosophy

Apple · Linear · Stripe · Notion · Bloomberg — premium, calm, trustworthy.  
Avoid cyberpunk, neon, crypto aesthetics, generic AI dashboards.

### Intelligence Layer

**Dashboard story (3A):** What changed → Why it matters → What to do.

**Signal intelligence (2.5A):** Seven-question `IntelligenceCard` on detail; single-question cards on dashboard.

**Personalization:** Role × Region × Intelligence Focus Areas (14 predefined, multi-select).

### Onboarding Flow

Welcome → Name → Greeting → Role → Region → [Focus Areas] → Tour → Dashboard.

Quick-start: skip focus areas step with role defaults.

### Data Strategy

Catalog + weekly briefing JSON. Live 5-source pipeline. No database. Weekly Monday refresh.

### Region Options (8)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

### Intelligence Focus Areas (14)

**Technology:** AI, Robotics, Quantum, Cybersecurity, Cloud  
**Industry:** Manufacturing, Supply Chain, Healthcare, Finance, Energy  
**Science (student):** Biotechnology, Biochemistry, Life Sciences  
**Arts & Commerce (student):** Arts, Commerce  
**Business:** Entrepreneurship, Startups, VC, Product Management  

*(Route remains `/onboarding/interests`; internal key remains `interests`.)*

### Signal Detail

Full `IntelligenceCard` — all seven analyst sections + related skills/opportunities + trust footer.

### Feature Retention Filter

**Approved:** Change hero, visit snapshot, personalized explanations, labeled sources, weekly refresh, intelligence cards, story IA.

**Rejected for MVP:** Relationship graphs, community, accounts, email digest (deferred), AI chatbot homepage.

### Business Model (Future)

Freemium → Premium (forecasting, reports) → Enterprise (API, white-label).

### Non-Negotiables

- No login required for MVP  
- No dashboard overload  
- No fake data without labels  
- No relationship graphs in MVP  
- Every screen reinforces: what changed, why it matters, what to do  
- User understands page in under 15 seconds (Sprint 3A)  

### Retention Metrics

| Primary | Secondary |
|---|---|
| Week 2 return rate | Time to first insight (<60s) |
| Change hero engagement | Onboarding completion |
| Signal detail from change | Trust indicators |

### Implementation Status Summary

| Area | Status |
|---|---|
| Change-first dashboard + visit snapshot | Built |
| Live pipeline + trust labeling | Built |
| Sprint 1 onboarding + tour | On `main` |
| Intelligence reasoning (2.5A) | On `main` |
| Dashboard IA (3A) | On `main` (polish gaps remain) |
| PostHog funnels | Not built |
| Email digest / accounts | Not started |
| Broader focus area catalog coverage | Needs improvement |

### Living Intelligence Network (Future)

Signal relationship graphs — cause/effect visualization. Explicitly out of MVP.

---

*End of Session Handoff V6*

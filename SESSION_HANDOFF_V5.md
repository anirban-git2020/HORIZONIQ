# HorizonIQ — Session Handoff V5

**Last updated:** 2026-06-27  
**Version:** MVP V1.1 (Change-First) + Live Pipeline + Sprint 1 Onboarding  
**Status:** Active Development — **Deployed to Vercel (beta)** + local dev  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V4.md`, `SESSION_HANDOFF_V3.md`, `SESSION_HANDOFF_V2.md`, `SESSION_HANDOFF.md`

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `npm run dev` or `start-dev.bat` → `http://localhost:3000`

**Note on repo state (2026-06-27):** Commits through `7e27e0c` are on `main` (analytics + PostHog + Vercel deploy). **Sprint 1 onboarding** (welcome, name, greeting, tour, IdentityService) and **onboarding compression** (quick-start, smart defaults) exist **locally but are not yet committed** — see §3 vs §4.

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Core product principle:**

> Users do not return for signals. Users return for **changes in signals**.

**Experience goal:** Feel like *"Your personal future analyst who tells you what changed."*

**Target users:** Student · Professional · Entrepreneur · Investor

**Design inspiration:** Apple · Linear · Stripe · Notion · Bloomberg

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP) · dashboard overload

**Feature retention filter (every new feature):**

> Does this give the user a reason to come back next week?

---

## 2. MVP Definition

### MVP V1.1 Objective

Validate **habit**, not just first-visit format.

A user receives useful, personalized intelligence and has a reason to **return weekly**. The product must prove the **return loop**, not just the briefing format.

### Success Metrics (Primary)

| Metric | Intent | Status |
|---|---|---|
| Week 2 return rate | Did change create habit? | **Instrumented** — PostHog + local buffer; needs funnel/insight setup |
| Change hero engagement | Did users read "What Changed"? | **Instrumented** — `change_hero_viewed` event |
| Signal detail from change | Did change drive depth? | **Instrumented** — `signal_click` + `signal_detail_viewed` with `source` |

### Success Metrics (Secondary)

| Metric | Target | Status |
|---|---|---|
| Time to first actionable insight | < 60s | **Partially met** — quick-start path helps; Sprint 1 adds pre-steps |
| Onboarding completion rate | — | **Instrumented** — `onboarding_completed` with `path: quick \| custom` |
| Trust indicators | Source reads, explanation engagement | **Not instrumented** yet |

### Dashboard Contract (Every Visit)

1. **What Changed** — new, rising, falling, or different
2. **Why It Matters** — personalized to role, region, interests
3. **What To Do** — one clear primary recommended action

### Signal Contract (Every Signal)

| Field | Purpose |
|---|---|
| Current State | What is happening now |
| Change Since Last Period | new · rising · falling · stable |
| Explanation | Personalized by role, region, interests |
| Recommended Action | What this user should do |

Maps to legacy framework: **Observe → Understand → Act**

### Data Provenance (Briefing)

| Value | Meaning | UI label |
|---|---|---|
| `pipeline` | ≥4 healthy live sources ingested | **Live intelligence** |
| `pipeline-mock` | 2–3 sources; partial live | **Mixed live + sample data** |
| `curated-mock` | No pipeline; demo only | **Sample briefing** |

Current active briefing: **`pipeline`** (live public data). Active period: **`2026-W26`**.

### Full User Flow (Current — Including Sprint 1)

```
/ (landing)
  → /onboarding/welcome          [Sprint 1 — first visit; skippable animation]
  → /onboarding/name             [Sprint 1 — display name]
  → /onboarding/greeting         [Sprint 1 — time-of-day salutation]
  → /onboarding/role             [profile: role]
  → /onboarding/region           [profile: region; quick-start OR customize]
  → /onboarding/interests        [optional — custom path; defaults pre-selected]
  → /onboarding/tour             [Sprint 1 — guided tour vs explore]
  → /dashboard                   [first visit: Week 1 hero + watchlist]
  → /signals/[id]                [optional depth]
```

**Quick path (onboarding compression):** welcome → name → greeting → role → region → **Start my briefing** → tour → dashboard (skips interests step).

### Explicitly Out of MVP Scope

- User accounts / login (IdentityService is local-only; auth stubs documented)
- Email digest (planned post-validation)
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
- [x] **Provider-agnostic analytics** — `lib/analytics/` (typed events, localStorage buffer, console dev logging, `registerAnalyticsSink()` seam)
- [x] **PostHog integration** — lazy-loaded via `lib/analytics/posthog.ts`; gated by `NEXT_PUBLIC_POSTHOG_KEY` (verified live on Vercel)
- [x] **Analytics events:** `onboarding_started`, `onboarding_role_selected`, `onboarding_region_selected`, `onboarding_completed`, `dashboard_viewed`, `change_hero_viewed`, `signal_click`, `signal_detail_viewed`, `start_over`
- [x] **ThemeToggle hydration fix** — neutral `aria-label` until mounted

### Landing (`/`)

- [x] Pre-onboarding hero: *"See what is changing before everyone else does."*
- [x] Provenance badge on hero
- [x] Honest subheadline — lists real pipeline sources when live
- [x] **DataTrustPanel** — sources, disclaimer, current week, refresh schedule
- [x] Landing pillars, **Why HorizonIQ?** section
- [x] Footer with briefing week + refresh schedule
- [x] CTA → `/onboarding/welcome` *(local Sprint 1; was `/onboarding/role` on main)*

### Sprint 1 — Premium First-Time Onboarding *(local, uncommitted)*

- [x] **Full-screen welcome** (`/onboarding/welcome`) — animated Observe · Predict · Lead + Skip
- [x] **Name capture** (`/onboarding/name`) — "What should we call you?"
- [x] **Personalized greeting** (`/onboarding/greeting`) — Good Morning/Afternoon/Evening + first name
- [x] **IdentityService** (`lib/identity/`) — `LocalIdentityService`, `horizoniq.identity.v1` in localStorage
- [x] **Future auth stubs** — `lib/identity/future-providers.ts` (Google/GitHub/Supabase — not implemented)
- [x] **Tour choice** (`/onboarding/tour`) — Start Guided Tour vs I'll Explore Myself
- [x] **Guided tour overlay** — highlights Dashboard, What Changed, Signals, Opportunities, Recommended Actions (`data-tour` attributes + fallback copy on first visit)
- [x] **`getFirstTimeOnboardingPath()`** — resume routing for returning first-time users

### Onboarding Compression *(local, uncommitted)*

- [x] **`ROLE_DEFAULT_INTERESTS`** — 3 smart defaults per role
- [x] **Region quick-start** — "Start my briefing" applies defaults, skips interests
- [x] **Interests pre-selection** — defaults applied on first visit to interests step
- [x] **Tour gate** — completion routes to `/onboarding/tour` before dashboard (not direct to dashboard)
- [x] **`onboarding_completed.path`** — `quick` | `custom` for analytics

### Profile Onboarding (`/onboarding/role` → `/region` → `/interests`)

- [x] 3-step flow with Observe → Understand → Act steps on role page
- [x] Role-aware curated interest lists (`ROLE_INTEREST_IDS`)
- [x] Student interests grouped: Technology · Science · Arts & Commerce
- [x] Preferences in localStorage (`horizoniq.preferences.v2`)
- [x] Legacy preference migration

### Dashboard (`/dashboard`) — First Visit vs Return Visit

**First visit (`!isReturnVisit`):**

- [x] Baseline briefing banner + trust disclaimer
- [x] **Week 1 Briefing** hero title
- [x] Provenance badge in change hero
- [x] New / Rising / Falling signal buckets
- [x] **Why this matters to you** + **Recommended action** labels
- [x] Briefing freshness: `briefingLabel` + **Updated [date]**
- [x] **Signals We're Tracking For You** (3–5 signals + watchlist)
- [x] Simplified layout (no preferences header, role lens, or four sections)

**Return visit (`isReturnVisitForPeriod`):**

- [x] **What Changed Since Your Last Visit** hero
- [x] Snapshot diff vs localStorage
- [x] Full dashboard: header, role lens, signals, skills, opportunities, actions
- [x] Role-based section ordering via `ROLE_EXPERIENCE`

**Footer (all visits):** Provenance · briefing week · period ID · last updated · refresh schedule

### Signal Detail (`/signals/[id]`)

- [x] Change-first layout with numbered sections
- [x] Live vs Sample source badges + legend
- [x] Trust disclaimer in tracking footer

### Data Layer (App)

- [x] Catalog + briefing architecture (`data/catalog/signals.json` — 17 signals; `data/briefings/2026-W26.json`)
- [x] `lib/data/briefings-registry.ts` — auto-generated by pipeline
- [x] `lib/data/resolve-signals.ts`, `lib/data/access.ts`
- [x] Personalized explanations by role and region

### Live Data Pipeline

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full`
- [x] **GitHub Actions** — Monday 06:00 UTC (`weekly-briefing.yml`)
- [x] Observation + score stores under `data/pipeline/`

### Trust Labeling

- [x] `lib/trust.ts`, provenance badges, DataTrustPanel, honest copy

### Retention Infrastructure

- [x] Visit snapshot (`horizoniq-visit-snapshot`)
- [x] `isReturnVisitForPeriod()` — return diff only within same `briefingPeriod`
- [x] First-visit baseline via `previousMomentum`
- [x] Snapshot + identity cleared on Start over *(identity clear — local Sprint 1)*

### Removed / Deprecated

- [x] Flat `data/signals.json`, signal relationship map, legacy TS data modules

### Still Dead Code

- [ ] `components/dashboard/story-intro.tsx` — unused; safe to delete

---

## 4. Pending Features

### Uncommitted Local Work (Commit + Deploy)

- [ ] Commit Sprint 1 onboarding + onboarding compression + doc updates
- [ ] Push to `main` → Vercel auto-deploy

### Post-Sprint 1 Improvements (High Priority)

- [ ] **Use display name on first dashboard visit** — e.g. baseline banner: *"Good morning, {name} — we're saving today as your baseline."*
- [ ] **PostHog funnels/insights** — Week 2 return, onboarding completion by `path`, change-hero → signal-detail conversion
- [ ] **Product Hunt rate limit hardening** — frequent HTTP 429 → `stale` source
- [ ] **Live source URLs in UI** — clickable HN/GitHub/arXiv/PH links in signal detail
- [ ] **Broader catalog coverage** — sparse interests: arts, commerce, biochemistry
- [ ] **More region-specific explanation variants** in catalog
- [ ] **Remove dead code** — `story-intro.tsx`

### Phase 2 — Experience (Approved, Not Built)

- [ ] **Immersive dashboard** — React Three Fiber (subtle, 2D fallback on mobile)
- [ ] Email capture / weekly digest
- [ ] Action follow-up loop ("Last week we recommended X…")

### Phase 3+ (Post-PMF)

- [ ] User accounts (wire IdentityService to Google/GitHub/Supabase)
- [ ] Premium / enterprise
- [ ] Living Intelligence Network (relationship graphs)
- [ ] Optional: Google Trends API alpha (6th source)

### Explicitly Not Using

- Google Trends scrapers, GitHub Trending scrapers, paid APIs, Reddit API

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
| Client state | **localStorage** — preferences, identity, visit snapshot, analytics buffer |
| Pipeline CLI | **tsx** + **dotenv** |
| CI data refresh | **GitHub Actions** (Node 24) |
| Hosting | **Vercel** (`horizoniq-beta.vercel.app`) |
| Not in use | Supabase, database, R3F/Three.js, user auth |

### End-to-End Data Flow

```
GitHub Actions (Monday 06:00 UTC)  OR  npm run pipeline:full
        ↓
lib/pipeline/ingest/*              → HN, arXiv, Wikimedia, GitHub, Product Hunt
        ↓
data/pipeline/observations/        → raw per-source metrics + samples
        ↓
lib/pipeline/score/*               → interest momentum/confidence
        ↓
data/pipeline/scores/
        ↓
lib/pipeline/generate/briefing     → briefings/{period}.json + meta + derived JSON
        ↓
lib/data/briefings-registry.ts       (auto-regenerated)
        ↓
lib/data/resolve-signals.ts        → catalog + briefing → SignalRecord[]
        ↓
lib/data/access.ts → lib/personalize.ts
        ↓
app/dashboard, app/signals/[id]
        ↓
lib/visit-snapshot.ts              → return-visit diff (localStorage)
```

### First-Time Onboarding Flow (Sprint 1)

```
/onboarding/welcome
  → identityService.markWelcomeComplete()
/onboarding/name
  → identityService.setDisplayName()
/onboarding/greeting
  → identityService.markGreetingComplete()
/onboarding/role → region → [interests] → /onboarding/tour
  → identityService.setTourChoice('guided' | 'solo')
/dashboard
  → if guided: GuidedTourOverlay → identityService.markGuidedTourComplete()
```

Resume helper: `lib/onboarding-flow.ts` → `getFirstTimeOnboardingPath()`

### Personalization Flow

```
Role + Region + Interests
        ↓
lib/preferences.tsx          → horizoniq.preferences.v2
lib/identity/*               → horizoniq.identity.v1 (display name, tour state)
        ↓
lib/personalize.ts
  - getTopSignals(), getRecommendedSkills(), getOpportunities()
  - getRecommendations(), getWhatChangedForYou()
        ↓
Dashboard + Signal Detail
```

### Analytics Flow

```
User action in UI
        ↓
lib/analytics/track()        → localStorage buffer (horizoniq.analytics.events.v1)
        ↓
registerAnalyticsSink()      → PostHog capture (if NEXT_PUBLIC_POSTHOG_KEY set at build time)
```

**Vercel env vars (Production):**

- `NEXT_PUBLIC_POSTHOG_KEY` = `phc_...`
- `NEXT_PUBLIC_POSTHOG_HOST` = `https://us.i.posthog.com` (or EU)

**Important:** `NEXT_PUBLIC_*` vars are baked in at **build time** — redeploy after adding/changing keys.

### Retention Flow (Visit Snapshot)

```
First dashboard visit:
  - isReturnVisit = false
  - Hero: "Week 1 Briefing"
  - UI: baseline banner + hero + Signals We're Tracking
  - Save snapshot on load

Return visit (same briefingPeriod):
  - isReturnVisit = true
  - Hero: "What Changed Since Your Last Visit"
  - UI: full dashboard sections
  - Diff momentum/confidence vs snapshot

New briefingPeriod in meta.json:
  - Weekly cycle resets; not a same-week return visit

Start over:
  - clearVisitSnapshot() + identityService.clear() + reset preferences → /
```

### Module Map (App)

| Module | Responsibility |
|---|---|
| `lib/types.ts` | Core TypeScript interfaces |
| `lib/options.ts` | Roles, regions, interests, defaults, `ROLE_EXPERIENCE` |
| `lib/trust.ts` | Provenance labels, disclaimers |
| `lib/data/*` | Schemas, access, resolve-signals, briefings-registry |
| `lib/personalize.ts` | Dashboard business logic |
| `lib/visit-snapshot.ts` | Return-visit diff |
| `lib/preferences.tsx` | Profile preferences context |
| `lib/identity/*` | IdentityService (Sprint 1) |
| `lib/onboarding.ts` | `trackOnboardingCompleted`, `ONBOARDING_TOUR_PATH` |
| `lib/onboarding-flow.ts` | First-time resume routing |
| `lib/analytics/*` | Event taxonomy, track, PostHog sink |
| `lib/pipeline/*` | Ingest, score, generate briefing |

---

## 6. Current File Structure

```
HorizonIQ/
├── .github/workflows/
│   └── weekly-briefing.yml              # Monday 06:00 UTC pipeline + git commit
│
├── app/
│   ├── page.tsx                         # Landing
│   ├── layout.tsx                       # Theme, Preferences, AnalyticsProvider
│   ├── globals.css
│   ├── dashboard/page.tsx               # First vs return visit + guided tour overlay
│   ├── onboarding/
│   │   ├── welcome/page.tsx             # Sprint 1 — full-screen welcome
│   │   ├── name/page.tsx                # Sprint 1 — display name
│   │   ├── greeting/page.tsx            # Sprint 1 — time-of-day greeting
│   │   ├── role/page.tsx
│   │   ├── region/page.tsx              # Quick-start + customize interests
│   │   ├── interests/page.tsx           # Pre-selected defaults
│   │   └── tour/page.tsx                # Sprint 1 — guided vs explore
│   └── signals/[id]/page.tsx
│
├── components/
│   ├── analytics/analytics-provider.tsx
│   ├── landing/                         # hero, pillars, data-trust-panel, why-horizoniq
│   ├── trust/provenance-badge.tsx
│   ├── onboarding/
│   │   ├── welcome-screen.tsx             # Sprint 1 animation
│   │   ├── first-time-shell.tsx           # Sprint 1 — name/greeting/tour layout
│   │   ├── guided-tour-overlay.tsx        # Sprint 1 dashboard tour
│   │   ├── onboarding-shell.tsx
│   │   ├── option-card.tsx, step-progress.tsx
│   │   └── observe-understand-act-steps.tsx
│   ├── dashboard/                         # what-changed-hero (RETENTION CORE), cards, etc.
│   ├── layout/                            # top-bar, intelligence-background
│   ├── motion/, theme/, ui/
│   └── brand/logo.tsx
│
├── lib/
│   ├── identity/                          # Sprint 1 — IdentityService
│   │   ├── types.ts
│   │   ├── local-identity-service.ts
│   │   ├── greeting.ts
│   │   ├── future-providers.ts
│   │   ├── use-identity.ts
│   │   └── index.ts
│   ├── analytics/                         # events, core, posthog, use-track-on-visible
│   ├── data/                              # access, schemas, resolve-signals, briefings-registry
│   ├── pipeline/                          # ingest, score, generate, config, store, utils
│   ├── onboarding.ts
│   ├── onboarding-flow.ts
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts
│   ├── trust.ts, types.ts, options.ts, utils.ts
│   └── neural-network.ts                  # Landing NeuralBackground
│
├── data/
│   ├── meta.json
│   ├── catalog/signals.json               # 17 evergreen signals
│   ├── briefings/2026-W26.json
│   ├── pipeline/observations/, scores/
│   ├── skills.json, jobs.json, recommendations.json, regions.json
│   └── README.md
│
├── scripts/                               # pipeline-ingest, generate, full
├── .env.example                           # GITHUB_TOKEN, PRODUCT_HUNT_TOKEN, POSTHOG keys
│
├── VISION.md, PROJECT_MEMORY.md, PROJECT_DECISIONS.md
├── ROADMAP.md, CHANGELOG.md
├── SESSION_HANDOFF_V5.md                  # This file
├── SESSION_HANDOFF_V4.md                  # Superseded
└── .cursorrules
```

---

## 7. UI Decisions

### Design Principles

1. Intelligence must be beautiful  
2. Every visual element must communicate meaning  
3. Animation is information — never decoration  
4. User understands the page within **10 seconds**  
5. Premium, calm, trustworthy — not cyberpunk / neon / crypto  

### Visual Language

- `PremiumCard` for elevated surfaces  
- `label-caps` for section labels  
- `display-title` / `section-title` for hierarchy  
- Change badges: New · Rising · Falling · Stable  
- Provenance badges: Live · Mixed · Sample  
- `IntelligenceBackground` on landing (2D neural mesh)  

### Page-Specific UI

| Surface | Decisions |
|---|---|
| Landing | Hero + provenance + DataTrustPanel + Why HorizonIQ; CTA → welcome flow |
| Welcome (Sprint 1) | Full-screen; staggered Observe/Predict/Lead; Skip top-right |
| Name / Greeting | `FirstTimeShell` — minimal, centered, no 3-step progress |
| Profile onboarding | 3-step progress (Role · Region · Interests); Observe/Understand/Act on role |
| Tour choice | Two cards + footer CTAs; before first dashboard |
| Dashboard (first) | Baseline banner → Week 1 hero → watchlist; optional guided tour overlay |
| Dashboard (return) | Change hero → header → role lens → 4 sections |
| Signal detail | Change-first; Live/Sample sources |

### First vs Return Visit (Critical)

| | First visit | Return visit |
|---|---|---|
| Hero title | Week 1 Briefing | What Changed Since Your Last Visit |
| Baseline banner | Yes | No |
| Signals We're Tracking | Yes | No |
| Dashboard header / stats | No | Yes |
| Role lens + 4 sections | No | Yes |
| Guided tour | If user chose "Start Guided Tour" | No |

### Role-Specific Dashboard Section Order (Return Visit)

| Role | Order |
|---|---|
| Student | signals → skills → opportunities → actions |
| Professional | signals → skills → actions → opportunities |
| Entrepreneur | signals → opportunities → actions → skills |
| Investor | signals → opportunities → skills → actions |

### Smart Default Interests (Quick-Start)

| Role | Defaults |
|---|---|
| Student | AI, Cybersecurity, Healthcare |
| Professional | AI, Cybersecurity, Cloud |
| Entrepreneur | AI, Healthcare, Finance |
| Investor | AI, Healthcare, Finance |

### Regions (8 Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

### Guided Tour Targets (`data-tour`)

| Attribute | Section |
|---|---|
| `dashboard` | Root dashboard container |
| `what-changed` | What Changed hero |
| `signals` | Watchlist (first visit) or signals section (return) |
| `opportunities` | Opportunities section (return) or fallback copy |
| `recommended-actions` | Primary action in hero or actions section |

---

## 8. Data Strategy

### Current (Live Pipeline + Curated Catalog)

- **Signals:** Pipeline weekly state overlaid on **curated catalog** (`data/catalog/signals.json`)
  - Explanations, role/region variants, actions — **curated**
  - Momentum, confidence, change, buckets, sources — **pipeline-generated**
- **Skills / jobs / recommendations:** Pipeline-updated from interest scores
- **No database** — JSON committed to git; Vercel bundles at build time
- **No paid APIs**

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

### Five Live Sources (Locked)

| Source | API | Token |
|---|---|---|
| Hacker News | Firebase + Algolia | None |
| arXiv | export.arxiv.org | None |
| Wikimedia Pageviews | wikimedia.org REST | None |
| GitHub REST Search | github.com | `GITHUB_TOKEN` local / Actions built-in |
| Product Hunt GraphQL v2 | producthunt.com | `PRODUCT_HUNT_TOKEN` |

### Briefing Registry

`lib/data/briefings-registry.ts` is **auto-generated** by pipeline. **Restart `npm run dev`** after `git pull` or `pipeline:full` to load new briefing JSON.

### Client-Side Storage Keys

| Key | Purpose |
|---|---|
| `horizoniq.preferences.v2` | Role, region, interests |
| `horizoniq.identity.v1` | Display name, welcome/greeting/tour state (Sprint 1) |
| `horizoniq-visit-snapshot` | Return-visit momentum/confidence snapshot |
| `horizoniq.analytics.events.v1` | Local analytics event buffer |
| `horizoniq.analytics.session-start` | Session timing for time-to-value |
| `horizoniq.theme` | Light/dark preference |

---

## 9. Trust Strategy

### Implemented

- [x] Honest landing copy — real pipeline sources only  
- [x] Provenance badges — Live / Mixed / Sample  
- [x] DataTrustPanel on landing  
- [x] Dashboard footer — provenance, period, updated date, refresh schedule  
- [x] Baseline banner disclaimer on first visit  
- [x] Signal detail — Live vs Sample badges + legend  
- [x] `dataProvenance` on briefing drives all UI via `lib/trust.ts`  
- [x] Momentum/confidence with expandable drivers  

### Remaining Gaps

| Gap | Severity |
|---|---|
| Live sources lack clickable URLs in UI | Medium |
| Pipeline source health (`stale`/`failed`) not shown to users | Low |
| Skills/jobs copy partially templated | Low |
| PostHog may be blocked by ad blockers in some browsers | Low |

### Trust Principles (Locked)

- Label mock vs live explicitly  
- Show reasoning, not just scores  
- Never overclaim beyond what pipeline ingests  
- Curated explanations are honest — activity metrics from live sources when `pipeline`  

---

## 10. Retention Strategy

### North Star

Users return because **something changed for them** — not because a static feed exists.

### Two Layers of Change

| Layer | Trigger | User-facing copy |
|---|---|---|
| **Weekly briefing** | New `briefingPeriod` / Monday pipeline | New week data from live sources |
| **Visit delta** | Return within same week | "What Changed Since Your Last Visit" |

### Implemented Mechanics

| Mechanic | Implementation |
|---|---|
| Visit snapshot | `horizoniq-visit-snapshot` |
| Return visit diff | Momentum/confidence vs snapshot |
| Briefing period gate | `isReturnVisitForPeriod()` |
| Signal buckets | New · Rising · Falling |
| First visit baseline | Week 1 + baseline banner + watchlist |
| Primary action | One recommended action in hero |
| Weekly live data | GitHub Actions Monday pipeline |
| Analytics | PostHog + local buffer for Week 2 return measurement |
| Guided tour | Optional orientation before first briefing (Sprint 1) |

### Retention Gaps

| Gap | Impact |
|---|---|
| localStorage only | Device-bound; no cross-device |
| No email/digest | No off-device pull mechanism |
| No action follow-up | No closed loop from last week's action |
| Sprint 1 adds pre-dashboard steps | May increase time-to-value unless quick-start used |
| Display name not yet shown on dashboard | Missed personalization payoff |

---

## 11. Known Issues

### Product / UX

| Issue | Severity | Notes |
|---|---|---|
| Sprint 1 adds 4 screens before profile setup | Medium | Quick-start mitigates; name not yet used on dashboard |
| 60-second promise vs full first-time flow | Medium | Quick path: role → region → briefing helps |
| First visit → return on page refresh | Low | Snapshot saved on first dashboard load |
| Empty states for some interest combos | Medium | arts, commerce, biochemistry thin |
| Guided tour: opportunities/actions not in DOM on first visit | Low | Fallback explanatory copy in overlay |
| `story-intro.tsx` unused | Low | Dead code |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| Sprint 1 + compression uncommitted | High | Deployed site may lag local |
| `briefings-registry.ts` must regenerate each new week | Low | Automated by pipeline |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| PostHog requires rebuild when env vars change | Low | `NEXT_PUBLIC_*` build-time |
| `.env.example` gitignored pattern — force-added for docs | Low | Use `.env.example` as template |
| Docs drift | Low | ROADMAP checkboxes partially stale |

### Data

| Issue | Severity | Notes |
|---|---|---|
| Catalog explanations curated, not LLM-generated | By design | Activity metrics live |
| Single briefing week until next Monday pipeline | Low | `2026-W26` active |

---

## 12. Next Tasks (Priority Order)

### 1. Commit and deploy Sprint 1 + onboarding compression

**Why:** Production (`horizoniq-beta.vercel.app`) does not yet include welcome flow, IdentityService, tour, or quick-start.  
**Do:** Commit local changes, push `main`, verify Vercel build.

### 2. Use display name on first dashboard visit

**Why:** Closes the personalization loop from name capture; highest-impact UX fix from Sprint 1 review.  
**Do:** Baseline banner or hero subline with time-of-day + first name from `identityService`.

### 3. PostHog funnels and retention insights

**Why:** Instrumentation exists; need dashboards for Week 2 return, `path: quick` vs `custom`, change-hero → signal-detail.  
**Do:** Create PostHog insights/funnels; optionally add `guided_tour_completed` event.

### 4. Product Hunt rate limit hardening

**Why:** PH frequently `stale` (HTTP 429) in CI.  
**Do:** Increase delay in `product-hunt.ts`; reduce parallel queries.

### 5. Live source URLs in signal detail

**Why:** Trust improves when users can click through to sources.  
**Do:** Add optional `url` to `DataSource` schema; pass observation sample URLs from pipeline.

### 6. Expand catalog coverage for sparse interests

**Why:** Empty sections for arts, commerce, biochemistry student paths.  
**Do:** Add signals + pipeline queries per thin interest.

### 7. More region-specific explanation variants

**Why:** Personalization depth for 8 regions.  
**Do:** Expand `byRegion` in `data/catalog/signals.json`.

### 8. Remove dead code

**Why:** Reduce noise.  
**Do:** Delete `components/dashboard/story-intro.tsx`.

### 9. Sync documentation

**Why:** ROADMAP checkboxes stale vs built pipeline + analytics + Sprint 1.  
**Do:** Update ROADMAP, ensure CHANGELOG reflects all shipped work after commit.

### 10. Onboarding time-to-value optimization

**Why:** Full Sprint 1 chain may exceed 60s.  
**Do:** Consider collapsing welcome+name; or skip welcome for returning users with identity already set.

---

## 13. Quick Start for Next Session

### Read First (in order)

1. `PROJECT_MEMORY.md` — canonical product spec  
2. `SESSION_HANDOFF_V5.md` — this file  
3. `PROJECT_DECISIONS.md` — decision log  
4. `CHANGELOG.md` — recent changes  
5. `.cursorrules` — agent rules  

### Run Locally

```powershell
cd C:\HorizonIQ
git pull                              # get latest briefing from GitHub Actions
copy .env.example .env.local          # first time; add tokens + optional PostHog keys
npm install
npm run dev
```

Or double-click `start-dev.bat`.

Open: `http://localhost:3000`

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key (`phc_...`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` or EU |

Redeploy after changing `NEXT_PUBLIC_*` vars.

### Test Full First-Time Flow

1. Clear localStorage (or Start over)  
2. Landing → Get started → Welcome → Name → Greeting  
3. Role → Region → **Start my briefing** OR Customize interests  
4. Tour choice → Dashboard  
5. If guided: complete tour overlay  
6. Return to `/dashboard` → expect return-visit UI  

### Test Analytics (Browser Console)

```javascript
JSON.parse(localStorage.getItem('horizoniq.analytics.events.v1'))
```

PostHog: Activity → Live events on production site.

### Git Workflow (When Actions Also Commits)

```powershell
git pull --rebase origin main
git push origin main
```

---

## 14. Recent Git History (Reference)

```
7e27e0c chore: trigger redeploy with posthog env
ef7e983 feat: add analytics instrumentation with optional PostHog
5c502ad feat: add honest trust labeling across landing and dashboard
4b3e9be chore(pipeline): weekly briefing [skip ci]
```

**Local uncommitted (as of handoff):** Sprint 1 onboarding, onboarding compression, doc updates.

---

## 15. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec |
| `PROJECT_DECISIONS.md` | Decision log (includes Sprint 1 entry) |
| `ROADMAP.md` | Phased roadmap (checkboxes partially stale) |
| `CHANGELOG.md` | Change history |
| `data/README.md` | Legacy manual refresh checklist |
| `.env.example` | Pipeline + PostHog token template |
| `HorizonIQ_UI_Constitution_v1.md` | UI constitution |

---

## 16. Strategic Context (Decisions Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| No auth for MVP (local IdentityService only) | Locked |
| IdentityService swappable for Google/GitHub/Supabase later | Locked (Sprint 1) |
| Five free pipeline sources | Locked |
| GitHub Actions for weekly briefing | **Built** |
| Trust labeling — honest provenance in UI | **Built** |
| Analytics — PostHog optional + local buffer | **Built** |
| Vercel hosting | **Live** (beta) |
| Sprint 1 welcome + name + greeting + tour | **Built locally** |
| Dashboard briefing logic unchanged | Locked |
| LLM summarization — not in pipeline | Locked |
| R3F dashboard — approved, not built | Future |

---

*End of Session Handoff V5*

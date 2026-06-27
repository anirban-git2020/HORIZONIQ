# HorizonIQ — Session Handoff V4

**Last updated:** 2026-06-27  
**Version:** MVP V1.1 (Change-First) + Live Pipeline  
**Status:** Active Development — Pre-launch (local + automated data)  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V3.md`, `SESSION_HANDOFF_V2.md`, `SESSION_HANDOFF.md`

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Hosting:** None deployed yet — run locally via `npm run dev` or `start-dev.bat`

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
| Week 2 return rate | Did change create habit? | **Not measured** — no analytics yet |
| Change hero engagement | Did users read "What Changed"? | **Not measured** |
| Signal detail from change | Did change drive depth? | **Not measured** |

### Success Metrics (Secondary)

- Time to first actionable insight (target < 60s — **not consistently met**; onboarding often > 60s)
- Onboarding completion rate — **not measured**
- Trust indicators (source reads, explanation engagement) — **not measured**

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

Current active briefing: **`pipeline`** (live public data).

### Explicitly Out of MVP Scope

- User accounts / login
- Email digest (planned post-validation)
- Relationship graphs / Living Intelligence Network
- Community / discussion boards
- Premium / enterprise tiers
- AI chatbot homepage
- **Paid APIs** for data ingestion
- **LLM summarization** in pipeline
- **Supabase** (future)

### Phase 2 Experience (Approved, Not Yet Built)

- **Cinematic welcome overlay** on landing (first visit only)
- **Immersive dashboard** — React Three Fiber (subtle, original, 2D fallback on mobile)

---

## 3. Completed Features

### Landing (`/`)

- [x] Pre-onboarding hero: *"See what is changing before everyone else does."*
- [x] **Provenance badge** on hero (`Live intelligence` / `Mixed live + sample data` / `Sample briefing`)
- [x] **Honest subheadline** — lists real pipeline sources when live; no overclaim of jobs/funding/patents scraping
- [x] **"About this briefing" panel** (`DataTrustPanel`) — sources, disclaimer, current week, refresh schedule
- [x] Landing pillars (How it works)
- [x] **Why HorizonIQ?** section (landing only)
- [x] Footer with **briefing week** + **"Refreshes every Monday at 06:00 UTC"**
- [x] CTA → `/onboarding/role`
- [x] `start-dev.bat` — Windows: `npm run dev` + open browser

### Onboarding (`/onboarding/role` → `/region` → `/interests`)

- [x] 3-step flow: Role → Region → Interests (**do not redesign**)
- [x] Observe → Understand → Act steps above role selection
- [x] Role cards with benefit-first copy
- [x] Role-aware curated interest lists via `ROLE_INTEREST_IDS`
- [x] Student interests grouped: Technology · Science · Arts & Commerce
- [x] Preferences in localStorage (`horizoniq.preferences.v2`)
- [x] Legacy preference migration

### Dashboard (`/dashboard`) — First Visit vs Return Visit

**First visit (`!isReturnVisit`):**
- [x] Baseline briefing banner + trust disclaimer
- [x] **Week 1 Briefing** hero title
- [x] **Provenance badge** in change hero
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

**Footer (all visits):**
- [x] Provenance label + briefing week + period ID + last updated + refresh schedule

### Signal Detail (`/signals/[id]`)

- [x] Change-first layout with numbered sections
- [x] **Live** vs **Sample** source badges (green vs muted)
- [x] Source legend explaining live vs sample
- [x] Trust disclaimer in tracking footer
- [x] Footer: *"We're tracking this signal for your next briefing."*

### Data Layer (App)

- [x] **Catalog + briefing architecture**
  - `data/catalog/signals.json` — 17 active signal definitions
  - `data/briefings/2026-W26.json` — weekly state (pipeline-generated)
  - `data/meta.json` — active period, `refreshSchedule`
- [x] `lib/data/briefings-registry.ts` — **auto-generated** by pipeline; imports briefing JSON
- [x] `lib/data/resolve-signals.ts` — catalog + briefing → `SignalRecord[]`
- [x] `lib/data/access.ts` — uses registry + `getDataProvenance()`, `getRefreshSchedule()`
- [x] `data/{skills,jobs,recommendations,regions}.json` — updated by briefing generator from pipeline scores
- [x] Personalized explanations by role and region

### Live Data Pipeline (Built)

- [x] **5-source ingest stack** (official free APIs only):

| Source | Module | Token |
|---|---|---|
| Hacker News (Firebase + Algolia) | `lib/pipeline/ingest/hacker-news.ts` | None |
| arXiv export API | `lib/pipeline/ingest/arxiv.ts` | None |
| Wikimedia Pageviews | `lib/pipeline/ingest/wikimedia.ts` | None |
| GitHub REST Search | `lib/pipeline/ingest/github.ts` | `GITHUB_TOKEN` in `.env.local` |
| Product Hunt GraphQL v2 | `lib/pipeline/ingest/product-hunt.ts` | `PRODUCT_HUNT_TOKEN` in `.env.local` |

- [x] Raw observation store: `data/pipeline/observations/latest.json`
- [x] Interest scores: `data/pipeline/scores/latest.json`
- [x] Rules-first scoring: `lib/pipeline/score/interest-scores.ts`
- [x] **Briefing generator**: `lib/pipeline/generate/briefing.ts`
  - Maps scores → `briefings/{period}.json`
  - Updates `meta.json`, `skills.json`, `jobs.json`, `recommendations.json`
  - Sets `dataProvenance`, live source labels on signals
  - Syncs `lib/data/briefings-registry.ts`
- [x] npm scripts:
  - `npm run pipeline:ingest` — fetch live data only
  - `npm run pipeline:generate` — build briefing from latest observations
  - `npm run pipeline:full` — ingest + generate
- [x] `.env.example` for local token setup
- [x] `dotenv` loads `.env.local` / `.env` for pipeline CLI

### GitHub Actions Automation (Built)

- [x] `.github/workflows/weekly-briefing.yml`
  - **Schedule:** Monday 06:00 UTC (`cron: "0 6 * * 1"`)
  - **Manual:** `workflow_dispatch`
  - Runs `npm run pipeline:full`
  - Commits `data/**` + `lib/data/briefings-registry.ts`
  - Uses `actions/checkout@v6`, `actions/setup-node@v6` (Node 24), `git-auto-commit-action@v7`
  - Secret required: `PRODUCT_HUNT_TOKEN` (repo Settings → Secrets → Actions)
  - GitHub Search uses Actions' built-in `GITHUB_TOKEN` in CI
- [x] Verified green runs; commits like `chore(pipeline): weekly briefing [skip ci]`

### Trust Labeling (Built)

- [x] `lib/trust.ts` — centralized provenance copy
- [x] `components/trust/provenance-badge.tsx`
- [x] `components/landing/data-trust-panel.tsx`
- [x] Landing, dashboard hero, baseline banner, signal detail, footers updated

### Retention Infrastructure

- [x] Visit snapshot (`lib/visit-snapshot.ts`, key: `horizoniq-visit-snapshot`)
- [x] `isReturnVisitForPeriod()` — return diff only within same `briefingPeriod`
- [x] First visit baseline via `previousMomentum` on first save
- [x] Snapshot cleared on Start over
- [x] First-visit return framing (baseline + watchlist)

### Removed / Deprecated

- [x] Flat `data/signals.json` (migrated to catalog + briefing)
- [x] Signal relationship map UI
- [x] Legacy TypeScript data modules
- [x] Hardcoded `BRIEFINGS` map in `access.ts` (replaced by `briefings-registry.ts`)

### Still Dead Code (Not Removed)

- [ ] `components/dashboard/story-intro.tsx` — unused (removed from dashboard; safe to delete)

---

## 4. Pending Features

### Pre-Launch (High Priority)

- [ ] **Analytics instrumentation** — Week 2 return, change hero engagement, onboarding completion (PostHog, Plausible, or lightweight events)
- [ ] **Product Hunt rate limit hardening** — PH often returns `stale` (HTTP 429); slow requests or batch queries
- [ ] **Broader signal catalog coverage** — sparse/empty states for arts, commerce, biochemistry interests
- [ ] **More region-specific explanation variants** in `data/catalog/signals.json`
- [ ] **Persona-specific return copy** — baseline banner / watchlist tailored per role
- [ ] **Onboarding compression** — true ≤60 second path (smart-default interests)
- [ ] **Live source URLs** — extend `DataSource` schema with `url` field; pipeline already has sample URLs in observations
- [ ] **Remove dead code** — `story-intro.tsx` (only; `lib/neural-network.ts` is used by `neural-background.tsx` → landing background)
- [ ] **Docs sync** — `ROADMAP.md`, `PROJECT_MEMORY.md`, `CHANGELOG.md` checkboxes and interest counts

### Phase 2 — Experience (Approved, Not Built)

- [ ] **Cinematic welcome overlay** on landing (first visit only)
  - `horizoniq.welcome.seen` in localStorage; skip button
  - **Do not** redesign onboarding routes
- [ ] **Immersive dashboard** — React Three Fiber
  - Subtle horizon grid + signal nodes; 2D panels over 3D background
  - Mobile / `prefers-reduced-motion` → 2D fallback

### Phase 3+ (Post-PMF)

- [ ] Email capture / weekly digest
- [ ] Action follow-up loop ("Last week we recommended X…")
- [ ] User accounts
- [ ] Premium / enterprise
- [ ] Living Intelligence Network (relationship graphs)
- [ ] Optional: Google Trends API alpha (6th source, if accepted)
- [ ] **Hosting / deployment** (Vercel or other) — not set up; local dev only today

### Explicitly Not Using

- Google Trends scrapers (`pytrends`, etc.)
- GitHub Trending page scrapers
- Paid APIs (Crunchbase, Apify, Twitter/X, etc.)
- Reddit API (restrictive/expensive)

---

## 5. Current Architecture

### Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** + shadcn/ui patterns
- **Framer Motion** (landing, dashboard, onboarding)
- **localStorage** for preferences + visit snapshots (no backend, no auth)
- **tsx** for pipeline CLI scripts
- **dotenv** for local pipeline tokens
- **GitHub Actions** for weekly automated data refresh
- **No R3F / Three.js yet**
- **No Vercel / Supabase / database**

### End-to-End Data Flow (Production Path Today)

```
GitHub Actions (Monday 06:00 UTC)
  OR locally: npm run pipeline:full
        ↓
lib/pipeline/ingest/*           → HN, arXiv, Wikimedia, GitHub, Product Hunt
        ↓
data/pipeline/observations/     → raw per-source, per-interest metrics + samples
        ↓
lib/pipeline/score/*            → interest momentum/confidence (rules-first)
        ↓
data/pipeline/scores/           → ranked interest scores
        ↓
lib/pipeline/generate/briefing  → BriefingRecord + meta + skills/jobs/recommendations
        ↓
data/briefings/{period}.json
data/meta.json
data/skills.json, jobs.json, recommendations.json
lib/data/briefings-registry.ts  (auto-regenerated)
        ↓
[git commit + push on CI]       → founder runs git pull locally
        ↓
lib/data/resolve-signals.ts     → catalog + briefing → SignalRecord[]
        ↓
lib/data/access.ts
        ↓
lib/personalize.ts
        ↓
app/dashboard, app/signals/[id]
        ↓
lib/visit-snapshot.ts           → localStorage return-visit diff
```

### Personalization Flow

```
User: Role + Region + Interests (onboarding)
        ↓
lib/preferences.tsx             → horizoniq.preferences.v2
        ↓
lib/personalize.ts
  - getTopSignals()
  - getRecommendedSkills()
  - getOpportunities()
  - getRecommendations()
  - getWhatChangedForYou()
        ↓
Dashboard + Signal Detail
```

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
  - clearVisitSnapshot() + clear preferences → /
```

### Pipeline Module Map

| Module | Responsibility |
|---|---|
| `lib/pipeline/config/interest-queries.ts` | HN / arXiv / Wikimedia queries per interest |
| `lib/pipeline/config/github-queries.ts` | GitHub search qualifiers per interest |
| `lib/pipeline/config/product-hunt-queries.ts` | PH topic slugs per interest |
| `lib/pipeline/config/env.ts` | Load `.env.local`; read tokens |
| `lib/pipeline/config/schedule.ts` | `BRIEFING_REFRESH_SCHEDULE` constant |
| `lib/pipeline/utils/http.ts` | Fetch, retries, `RateLimiter` |
| `lib/pipeline/utils/periods.ts` | ISO week, comparison date ranges |
| `lib/pipeline/utils/metrics.ts` | `buildMetrics()` helper |
| `lib/pipeline/ingest/*.ts` | Per-source ingestors |
| `lib/pipeline/ingest/index.ts` | `runPipelineIngest()` + stale fallback |
| `lib/pipeline/store/observations.ts` | Read/write observations + scores |
| `lib/pipeline/store/briefing.ts` | Write briefing artifacts + sync registry |
| `lib/pipeline/score/interest-scores.ts` | Cross-source interest scoring |
| `lib/pipeline/generate/briefing.ts` | Main briefing generator |
| `lib/pipeline/generate/signal-state.ts` | Per-signal states + buckets |
| `lib/pipeline/generate/sources.ts` | Live source labels from observations |
| `lib/pipeline/generate/derived-data.ts` | Skills/jobs/recommendations updates |
| `lib/pipeline/generate/run.ts` | `runBriefingGenerator()` |
| `lib/pipeline/run.ts` | `runPipeline()` orchestrator |

### App Module Map

| Module | Responsibility |
|---|---|
| `lib/types.ts` | TypeScript interfaces |
| `lib/options.ts` | Roles, regions, interests, `ROLE_INTEREST_IDS`, `ROLE_EXPERIENCE` |
| `lib/trust.ts` | Provenance labels, disclaimers, source copy |
| `lib/data/schemas.ts` | JSON + catalog/briefing types |
| `lib/data/briefings-registry.ts` | Auto-generated briefing imports |
| `lib/data/access.ts` | Data access, filters, provenance helpers |
| `lib/data/resolve-signals.ts` | Catalog + briefing merge |
| `lib/personalize.ts` | Business logic for dashboard views |
| `lib/visit-snapshot.ts` | localStorage snapshot + diff |
| `lib/preferences.tsx` | React context for onboarding |
| `lib/utils.ts` | `formatBriefingUpdatedAt`, `cn`, etc. |

---

## 6. Current File Structure

```
HorizonIQ/
├── .github/
│   └── workflows/
│       └── weekly-briefing.yml          # Monday 06:00 UTC automation
│
├── app/
│   ├── page.tsx                         # Landing (server; passes provenance)
│   ├── layout.tsx                       # Root layout, theme, preferences
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx                     # First vs return visit split
│   ├── onboarding/
│   │   ├── role/page.tsx
│   │   ├── region/page.tsx
│   │   └── interests/page.tsx
│   └── signals/
│       └── [id]/page.tsx                # Signal detail (change-first)
│
├── components/
│   ├── landing/
│   │   ├── landing-hero.tsx             # Provenance badge + honest copy
│   │   ├── landing-pillars.tsx
│   │   ├── data-trust-panel.tsx         # "About this briefing"
│   │   └── why-horizoniq.tsx
│   ├── trust/
│   │   └── provenance-badge.tsx
│   ├── onboarding/
│   │   ├── onboarding-shell.tsx
│   │   ├── option-card.tsx
│   │   ├── step-progress.tsx
│   │   └── observe-understand-act-steps.tsx
│   ├── dashboard/
│   │   ├── what-changed-hero.tsx        # RETENTION CORE
│   │   ├── baseline-briefing-banner.tsx
│   │   ├── signals-we-are-tracking.tsx
│   │   ├── signal-card.tsx
│   │   ├── signal-evidence.tsx
│   │   ├── change-badge.tsx
│   │   ├── skill-card.tsx
│   │   ├── opportunity-card.tsx
│   │   ├── action-card.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── role-lens.tsx
│   │   ├── section.tsx
│   │   └── story-intro.tsx              # UNUSED — dead code
│   ├── layout/
│   │   ├── top-bar.tsx
│   │   └── intelligence-background.tsx
│   ├── motion/                          # FadeIn, Stagger, AnimatedCounter
│   ├── theme/                           # ThemeProvider, ThemeToggle
│   └── ui/                              # Button, Badge, PremiumCard, etc.
│
├── data/
│   ├── meta.json                        # briefingPeriod, refreshSchedule, updatedAt
│   ├── catalog/
│   │   └── signals.json                 # 17 evergreen signal definitions
│   ├── briefings/
│   │   └── 2026-W26.json                # Pipeline-generated weekly state
│   ├── pipeline/
│   │   ├── observations/
│   │   │   ├── latest.json
│   │   │   └── {date}.json
│   │   └── scores/
│   │       ├── latest.json
│   │       └── {date}.json
│   ├── skills.json                      # Updated by pipeline generator
│   ├── jobs.json
│   ├── recommendations.json
│   ├── regions.json
│   └── README.md                        # Manual refresh checklist (superseded by CI for ops)
│
├── lib/
│   ├── trust.ts
│   ├── types.ts
│   ├── options.ts
│   ├── personalize.ts
│   ├── preferences.tsx
│   ├── visit-snapshot.ts
│   ├── utils.ts
│   ├── neural-network.ts                # Used by landing NeuralBackground
│   ├── data/
│   │   ├── access.ts
│   │   ├── schemas.ts
│   │   ├── resolve-signals.ts
│   │   └── briefings-registry.ts        # AUTO-GENERATED by pipeline
│   └── pipeline/
│       ├── types.ts
│       ├── run.ts
│       ├── config/
│       │   ├── interest-queries.ts
│       │   ├── github-queries.ts
│       │   ├── product-hunt-queries.ts
│       │   ├── env.ts
│       │   └── schedule.ts
│       ├── utils/
│       │   ├── http.ts
│       │   ├── periods.ts
│       │   └── metrics.ts
│       ├── ingest/
│       │   ├── index.ts
│       │   ├── hacker-news.ts
│       │   ├── arxiv.ts
│       │   ├── wikimedia.ts
│       │   ├── github.ts
│       │   └── product-hunt.ts
│       ├── store/
│       │   ├── observations.ts
│       │   └── briefing.ts
│       ├── score/
│       │   └── interest-scores.ts
│       └── generate/
│           ├── briefing.ts
│           ├── signal-state.ts
│           ├── sources.ts
│           ├── derived-data.ts
│           └── run.ts
│
├── scripts/
│   ├── pipeline-ingest.ts
│   ├── pipeline-generate.ts
│   └── pipeline-full.ts
│
├── .env.example                         # GITHUB_TOKEN, PRODUCT_HUNT_TOKEN
├── .env.local                           # Gitignored — local tokens
├── start-dev.bat
├── .cursorrules
├── .cursor/rules/horizoniq.mdc
│
├── VISION.md
├── PROJECT_MEMORY.md
├── PROJECT_DECISIONS.md
├── ROADMAP.md                           # Partially stale checkboxes
├── CHANGELOG.md
├── SESSION_HANDOFF_V3.md                # Superseded by this file
├── SESSION_HANDOFF_V4.md                # This file
├── HorizonIQ MVP — Product Review.txt
└── HorizonIQ_UI_Constitution_v1.md
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
- Change badges: New (primary) · Rising (success) · Falling (warning) · Stable (muted)
- Provenance badges: Live (success) · Mixed (warning) · Sample (muted)
- Source badges on signal detail: **Live** (green) · **Sample** (muted)
- `IntelligenceBackground` on landing (2D)

### Page-Specific UI

| Surface | Decisions |
|---|---|
| Landing | Hero + provenance badge + honest subheadline + pillars + **DataTrustPanel** + Why HorizonIQ; footer shows week + refresh schedule |
| Onboarding | 3-step progress; Observe/Understand/Act; **no** Why HorizonIQ block |
| Dashboard (first visit) | Baseline banner (with trust disclaimer) → Week 1 hero → Signals We're Tracking |
| Dashboard (return visit) | Change hero (with provenance badge) → header → role lens → 4 sections |
| Signal detail | Change-first; Live/Sample sources; trust disclaimer in footer |
| Dashboard footer | Provenance · briefing label · period ID · updated date · refresh schedule |

### First vs Return Visit (Critical)

| | First visit | Return visit |
|---|---|---|
| Hero title | Week 1 Briefing | What Changed Since Your Last Visit |
| Baseline banner | Yes | No |
| Signals We're Tracking | Yes | No |
| Dashboard header / stats | No | Yes |
| Role lens + 4 sections | No | Yes |

### Role-Specific Dashboard Section Order (Return Visit)

| Role | Order |
|---|---|
| Student | signals → skills → opportunities → actions |
| Professional | signals → skills → actions → opportunities |
| Entrepreneur | signals → opportunities → actions → skills |
| Investor | signals → opportunities → skills → actions |

### Onboarding Interest Lists (Curated per Role)

| Role | Count | IDs |
|---|---|---|
| Student | 11 | AI, cybersecurity, cloud, robotics, biotech, biochemistry, life-sciences, healthcare, energy, arts, commerce |
| Professional | 6 | AI, cybersecurity, cloud, healthcare, finance, manufacturing |
| Entrepreneur | 5 | AI, healthcare, finance, energy, manufacturing |
| Investor | 6 | AI, healthcare, finance, energy, quantum-computing, cybersecurity |

**Full interest catalog:** 19 IDs in `lib/options.ts` `INTERESTS` (includes business category not all shown in onboarding).

### Regions (8 Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

### How Users Know Which Week They're Seeing

| Location | What they see |
|---|---|
| Change hero | `briefingLabel` (e.g. Week of June 22, 2026 – June 28, 2026) + **Updated [date]** |
| Dashboard footer | `Briefing period 2026-W26` · Last updated · refresh schedule |
| Landing DataTrustPanel | Current briefing week + source list |
| Landing footer | `briefingLabel` + refreshes every Monday |

**When data refreshes:** Every **Monday at 06:00 UTC** (GitHub Actions). Locally: `git pull` after CI runs, or `npm run pipeline:full`.

---

## 8. Data Strategy

### Current (Live Pipeline + Curated Catalog)

- **Signals:** Pipeline-generated weekly briefing overlaid on **curated catalog** (`data/catalog/signals.json`)
  - Explanations, role/region variants, actions — **curated** in catalog
  - Momentum, confidence, change, buckets, sources — **pipeline-generated**
- **Skills / jobs / recommendations:** Pipeline-updated each `pipeline:generate` from interest scores + observation samples
- **Regions:** Static JSON with growth bias
- **No database** — all JSON files committed to git
- **No paid APIs**

### Catalog Record (`data/catalog/signals.json`)

Evergreen per signal: id, name, category, interest, `defaultCurrentState`, explanation variants (role/region), recommendedAction variants, affected industries/roles, related skills/opportunities, `introducedInPeriod`, `status`

**17 active signals** today.

### Briefing Record (`data/briefings/{period}.json`)

```json
{
  "briefingPeriod": "2026-W26",
  "briefingLabel": "Week of June 22, 2026 – June 28, 2026",
  "publishedAt": "ISO-8601",
  "dataProvenance": "pipeline",
  "buckets": { "new": [], "rising": [], "falling": [], "stable": [] },
  "signalStates": [ /* per-signal momentum, change, live sources */ ]
}
```

### Meta Record (`data/meta.json`)

```json
{
  "briefingPeriod": "2026-W26",
  "briefingLabel": "Week of June 22, 2026 – June 28, 2026",
  "updatedAt": "2026-06-27T11:08:48.439Z",
  "activeBriefingFile": "2026-W26.json",
  "refreshSchedule": "Every Monday at 06:00 UTC"
}
```

### Pipeline Observation Store

`data/pipeline/observations/latest.json` — per-source health (`ok` | `stale` | `failed`), per-interest metrics (current/previous/delta), sample titles/URLs.

### Pipeline Scores

`data/pipeline/scores/latest.json` — ranked interests with momentum, confidence, direction, drivers.

### Five Live Sources (Locked Decision)

| # | Source | API | Notes |
|---|---|---|---|
| 1 | Hacker News | Firebase + Algolia | No key |
| 2 | arXiv | export.arxiv.org | 3s rate limit; sorted fetch workaround (date filter unreliable) |
| 3 | Wikimedia Pageviews | wikimedia.org REST | 7-day lag for reliable data |
| 4 | GitHub | REST Search | **Not** trending page; OR queries need parentheses |
| 5 | Product Hunt | GraphQL v2 | Free developer token; rate limits → `stale` |

**Replaced:** Google Trends scrapers → Wikimedia Pageviews

### Briefing Registry

`lib/data/briefings-registry.ts` is **auto-generated** when pipeline writes a briefing. Next.js bundles imported JSON at build time — **restart `npm run dev`** after `git pull` or local `pipeline:full` to see new data.

When a **new ISO week** starts, pipeline creates `data/briefings/{new-period}.json` and regenerates registry imports.

### Local vs CI Tokens

| Environment | GitHub | Product Hunt |
|---|---|---|
| Local (`.env.local`) | `GITHUB_TOKEN` — read-only PAT | `PRODUCT_HUNT_TOKEN` |
| GitHub Actions | Built-in `GITHUB_TOKEN` | `PRODUCT_HUNT_TOKEN` repo secret |

Copy `.env.example` → `.env.local` for local pipeline runs.

---

## 9. Trust Strategy

### Implemented Trust Mechanisms

- [x] **Honest landing copy** — lists real pipeline sources; no jobs/funding/patents overclaim
- [x] **Provenance badges** — Live intelligence / Mixed / Sample (landing, dashboard hero)
- [x] **DataTrustPanel** on landing — sources, disclaimer, current week
- [x] **Dashboard footer** — provenance, period ID, updated date, refresh schedule
- [x] **Baseline banner disclaimer** — data type explained on first visit
- [x] **Signal sources** — **Live** vs **Sample** badges with legend
- [x] **Signal detail footer** — trust disclaimer + tracking message
- [x] `dataProvenance` field on briefing drives all UI labels via `lib/trust.ts`
- [x] Pipeline sets `type: "live"` on signal sources when observation samples exist
- [x] Momentum / confidence with expandable drivers (`SignalEvidence`)

### Trust Principles (Locked)

- Label mock vs live explicitly in UI
- Show reasoning, not just scores
- Never overclaim beyond what pipeline ingests
- Show stale/failed source status in pipeline logs (not yet in user-facing UI)
- Curated explanations are honest — activity metrics come from live sources when `pipeline`

### Remaining Trust Gaps

| Gap | Severity | Notes |
|---|---|---|
| Live sources lack clickable URLs in UI | Medium | Samples have URLs in observations; `DataSource` schema is label-only |
| Pipeline source health not shown to users | Low | `stale`/`failed` visible in CLI only |
| Skills/jobs copy partially templated | Low | Derived from pipeline but not fully live-sourced |
| Product review scores outdated | Low | Pre-pipeline trust was 5/10; labeling should improve |

### Product Review Scores (2026-06-23, Pre-Pipeline)

Clarity 7 · Time to value 6 · Trust 5 · Retention 6 · Delight 6 — **re-measure after user testing**

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
| Visit snapshot | `horizoniq-visit-snapshot` in localStorage |
| Return visit diff | Compare momentum/confidence vs snapshot |
| Briefing period gate | `isReturnVisitForPeriod()` |
| Signal buckets | New · Rising · Falling |
| First visit baseline | Week 1 + baseline banner + watchlist |
| Primary action | One recommended action in hero |
| Weekly live data | GitHub Actions Monday pipeline |
| Signal detail hook | Tracking footer for next briefing |
| Snapshot reset | Start over clears all |

### Retention Gaps

| Gap | Impact |
|---|---|
| localStorage only | Device-bound; no cross-device |
| No analytics | Cannot measure Week 2 return |
| No email/digest | No pull mechanism off-device |
| No action follow-up | No closed loop from last week's action |
| Product Hunt rate limits | Occasional `stale` source reduces confidence |
| No hosting | Users must run locally or wait for deploy decision |

---

## 11. Known Issues

### Product / UX

| Issue | Severity | Notes |
|---|---|---|
| 60-second promise vs onboarding length | Medium | 3 steps + multi-select often > 60s |
| First visit → return visit on page refresh | Low | Snapshot saved on first dashboard load |
| Empty states for some interest combos | Medium | arts, commerce, biochemistry thin |
| Persona-specific return copy not tailored | Medium | Generic baseline for all roles |
| Welcome cinematic overlay | Not built | Approved Phase 2 |
| No public URL / hosting | Medium | Local dev only; share via repo clone |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| `briefings-registry.ts` must regenerate each new week | Low | Automated by pipeline; manual `npm run dev` restart needed |
| Visit snapshot device-bound | Medium | No cross-device sync |
| Snapshot saved on every dashboard load | Low | Same-session refresh may show return UI |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale`; partial data |
| arXiv `submittedDate` filter returns 500 | Low | Workaround: sorted fetch + count in date range |
| Wikimedia needs 7-day lag | Low | `getLaggedComparisonRanges()` in ingest |
| GitHub OR queries need parentheses | Fixed | Was HTTP 422 without `(topic:a OR topic:b)` |
| `story-intro.tsx` unused | Low | Dead code — safe to delete |
| `git push` rejected when Actions commits | Low | Run `git pull --rebase origin main` before push |
| Docs drift | Low | ROADMAP, PROJECT_MEMORY, CHANGELOG behind reality |

### Data

| Issue | Severity | Notes |
|---|---|---|
| Catalog explanations curated, not LLM-generated | By design | Activity metrics live; copy static |
| Single briefing week in registry until new week | Low | `2026-W26` only until next Monday |
| Interest-level scores mapped to multiple signals | Low | Slight spread offset per signal in same interest |

### npm / Dev

| Issue | Severity | Notes |
|---|---|---|
| `npm ci` deprecation warnings in Actions | Low | eslint@8, glob@7 transitive; not blocking |
| 2 moderate npm audit vulnerabilities | Low | Dev dependencies |

---

## 12. Next 10 Tasks (Priority Order)

### 1. Analytics instrumentation

**Why:** MVP validates habit — cannot measure Week 2 return without it.  
**Do:** PostHog, Plausible, or lightweight events for first visit, return visit, change hero view, onboarding complete, signal detail from change.

### 2. Product Hunt rate limit hardening

**Why:** PH frequently `stale` (HTTP 429) in CI and local runs.  
**Do:** Increase delay in `product-hunt.ts` rate limiter; reduce parallel queries; optional retry with backoff.

### 3. Live source URLs in UI

**Why:** Trust improves when users can click through to HN/GitHub/arXiv/PH.  
**Do:** Add optional `url` to `DataSource` schema; pass observation sample URLs into briefing generator; link in signal detail badges.

### 4. Expand catalog coverage for sparse interests

**Why:** Empty sections for arts, commerce, biochemistry student paths.  
**Do:** Add 1–2 signals + skill + opportunity per thin interest in catalog; ensure pipeline queries cover them.

### 5. Persona-specific return copy

**Why:** Generic baseline message weak for student vs investor motivation.  
**Do:** Role-tailored lines in `baseline-briefing-banner.tsx` and `signals-we-are-tracking.tsx`.

### 6. Onboarding compression (≤60s path)

**Why:** 60-second promise not met.  
**Do:** Smart-default interests per role; optional "quick start" with 3 pre-selected interests.

### 7. More region-specific explanation variants

**Why:** Personalization depth for 8 regions.  
**Do:** Expand `byRegion` in `data/catalog/signals.json` for top signals.

### 8. Remove dead code

**Why:** Noise for next engineer.  
**Do:** Delete `story-intro.tsx` only (`neural-network.ts` powers landing background).

### 9. Sync documentation

**Why:** ROADMAP/PROJECT_MEMORY/CHANGELOG stale vs built pipeline.  
**Do:** Mark Phase 1 pipeline items complete; update CHANGELOG; bump PROJECT_MEMORY implementation status.

### 10. Cinematic welcome overlay (Phase 2 UI)

**Why:** Approved premium first-visit moment.  
**Do:** First visit only; `horizoniq.welcome.seen`; Observe → Predict → Lead sequence; **do not** change onboarding routes.

---

## 13. Quick Start for Next Session

### Read First (in order)

1. `PROJECT_MEMORY.md` — canonical product spec
2. `SESSION_HANDOFF_V4.md` — this file
3. `PROJECT_DECISIONS.md` — decision log
4. `CHANGELOG.md` — recent changes
5. `.cursor/rules/horizoniq.mdc` — agent rules

### Run Locally

```powershell
cd C:\HorizonIQ
git pull                              # get latest briefing from GitHub Actions
copy .env.example .env.local          # first time only; add tokens
npm install
npm run dev
```

Or double-click `start-dev.bat` (Windows).

Open: http://localhost:3000

### Run Pipeline Locally

```powershell
npm run pipeline:full                 # ingest + generate (~2–4 min)
npm run dev                           # restart to load new JSON
```

Requires `.env.local` with `GITHUB_TOKEN` and `PRODUCT_HUNT_TOKEN`.

### Test Retention Flow

1. **First visit:** Complete onboarding → dashboard  
   - Expect: baseline banner, Week 1 Briefing, Signals We're Tracking, provenance badge  
2. **Return visit:** Navigate away → return to `/dashboard`  
   - Expect: What Changed Since Your Last Visit, full sections  
3. **Signal detail:** Click signal → Live/Sample source badges  
4. **Reset:** Start over → clears snapshot and preferences

### Key localStorage Keys

| Key | Purpose |
|---|---|
| `horizoniq.preferences.v2` | Role, region, interests |
| `horizoniq-visit-snapshot` | Visit snapshot for retention diff |
| `horizoniq.welcome.seen` | *(Planned)* Welcome overlay dismissed |

### User Flow

```
/ (landing + trust panel)
  → /onboarding/role
  → /onboarding/region
  → /onboarding/interests
  → /dashboard
      first visit:  baseline + Week 1 hero + watchlist
      return visit: change hero + full briefing sections
  → /signals/[id] (optional depth)
```

### Git Workflow (When Actions Also Commits)

```powershell
git pull --rebase origin main
git push origin main
```

Actions bot commits briefing data — always pull before push if you've been working locally.

### GitHub Actions

- **Workflow:** Weekly intelligence briefing  
- **URL:** https://github.com/anirban-git2020/HORIZONIQ/actions/workflows/weekly-briefing.yml  
- **Schedule:** Monday 06:00 UTC  
- **Manual run:** Actions → Weekly intelligence briefing → Run workflow  
- **Secret required:** `PRODUCT_HUNT_TOKEN`

---

## 14. Strategic Context (Decisions Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| No auth for MVP | Locked |
| No paid APIs for pipelines | Locked |
| Five free sources: HN, arXiv, GitHub, Wikimedia, PH | Locked |
| Google Trends scrapers — do not use | Locked |
| GitHub Actions for weekly briefing (not manual JSON) | **Built** |
| Founder does not edit weekly briefing files manually | **Built** (CI handles) |
| Trust labeling — honest provenance in UI | **Built** |
| Welcome overlay on landing (not separate route) | Approved, not built |
| Onboarding flow — do not redesign | Locked |
| R3F dashboard — subtle, original, 2D fallback | Approved, not built |
| LLM summarization — not in pipeline | Locked |
| Supabase — not in MVP | Locked |
| Local dev primary; no Vercel assumed | Current state |

---

## 15. Recent Git History (Reference)

```
5c502ad feat: add honest trust labeling across landing and dashboard
4b3e9be chore(pipeline): weekly briefing [skip ci]
3d7d047 ci: upgrade workflow actions to Node 24
ec15829 chore(pipeline): weekly briefing [skip ci]
7f14561 Session handoff update
```

Pipeline + trust + CI work may not all be in separate commits on all clones — trust labeling is commit `5c502ad`. Earlier pipeline files landed across session commits and `chore(pipeline)` Action commits.

---

## 16. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (partially stale) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap (checkboxes stale) |
| `CHANGELOG.md` | Change history (needs pipeline + trust entries) |
| `data/README.md` | Legacy manual refresh checklist |
| `.env.example` | Pipeline token template |
| `HorizonIQ MVP — Product Review.txt` | Product review scores |
| `HorizonIQ_UI_Constitution_v1.md` | UI constitution |

---

*End of Session Handoff V4*

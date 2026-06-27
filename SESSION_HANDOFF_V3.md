# HorizonIQ — Session Handoff V3

**Last updated:** 2026-06-23  
**Version:** MVP V1.1 (Change-First)  
**Status:** Active Development — Pre-launch  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V2.md`, `SESSION_HANDOFF.md`

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

| Metric | Intent |
|---|---|
| Week 2 return rate | Did change create habit? |
| Change hero engagement | Did users read "What Changed"? |
| Signal detail from change | Did change drive depth? |

### Success Metrics (Secondary)

- Time to first actionable insight (target < 60s — not yet consistently met)
- Onboarding completion rate
- Trust indicators (source reads, explanation engagement)

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

### Explicitly Out of MVP Scope

- User accounts / login
- Email digest (planned post-validation)
- Relationship graphs / Living Intelligence Network
- Community / discussion boards
- Premium / enterprise tiers
- AI chatbot homepage

### Phase 2 (Approved, Not Yet Built)

Architecture approved for:
- **Automated free data pipelines** (no paid APIs)
- **Immersive dashboard** (React Three Fiber — original design, not copied)
- **Cinematic welcome overlay** on landing (first visit only)
- **GitHub Actions** weekly briefing generation (founder does not edit JSON manually)

Phase 2 explicitly **does not include:** Supabase, cron on Vercel (uses GitHub Actions), LLM summarization, authentication.

---

## 3. Completed Features

### Landing (`/`)

- [x] Pre-onboarding hero with value proposition
- [x] Headline: *"See what is changing before everyone else does."*
- [x] Subheadline (marketing — **not yet live ingestion**)
- [x] 60-second promise on CTA
- [x] Landing pillars (How it works: What is changing / Why it matters / What to do next)
- [x] **Why HorizonIQ?** section (Signals · Skills · Opportunities) — **landing only**, removed from onboarding
- [x] CTA → `/onboarding/role`
- [x] `start-dev.bat` — auto-starts dev server and opens browser

### Onboarding (`/onboarding/role` → `/region` → `/interests`)

- [x] 3-step flow: Role → Region → Interests (**do not redesign**)
- [x] Observe → Understand → Act steps above role selection
- [x] Role cards with benefit-first copy
- [x] Role-aware **curated** interest lists via `ROLE_INTEREST_IDS`
- [x] Student interests grouped: Technology · Science · Arts & Commerce
- [x] Preferences in localStorage (`horizoniq.preferences.v2`)
- [x] Legacy preference migration

### Dashboard (`/dashboard`) — First Visit vs Return Visit

**First visit (`!isReturnVisit`):**
- [x] **Baseline briefing banner** — *"This is your baseline briefing. When you return, HorizonIQ will show what changed since today."* + today's date
- [x] **Week 1 Briefing** hero title (not "What Changed This Week")
- [x] Subtitle: baseline set today; next visit shows delta
- [x] Change hero first (immediately after top bar)
- [x] New / Rising / Falling signal buckets in hero
- [x] **Why this matters to you** + **Recommended action** labels on signal rows
- [x] Briefing freshness: `briefingLabel` + **Updated [date]**
- [x] **Signals We're Tracking For You** — 3–5 personalized signals + next-briefing reveal list
- [x] **Simplified layout** — no preferences header, no role lens, no four sections
- [x] Adjust interests / Start over links at bottom

**Return visit (`isReturnVisitForPeriod`):**
- [x] **What Changed Since Your Last Visit** hero
- [x] Snapshot diff vs localStorage → New / Rising / Falling buckets
- [x] Full dashboard: preferences header, role lens, signals, skills, opportunities, actions
- [x] Role-based section ordering via `ROLE_EXPERIENCE`

### Signal Detail (`/signals/[id]`)

- [x] Change-first layout
- [x] Sections: What Changed · Why It Matters · Momentum Drivers · Affected Industries · Recommended Skills · Opportunities · Recommended Action
- [x] Labeled mock sources (`type: "mock"`)
- [x] Footer: *"We're tracking this signal for your next briefing."*

### Data Layer

- [x] **Catalog + briefing architecture**
  - `data/catalog/signals.json` — evergreen signal definitions (17 signals)
  - `data/briefings/2026-W26.json` — weekly state, buckets, signalStates
  - `data/meta.json` — active period pointer (`activeBriefingFile`)
- [x] `lib/data/resolve-signals.ts` — merges catalog + briefing → unified `SignalRecord`
- [x] `lib/data/access.ts` — swappable access layer (static imports today)
- [x] Skills, jobs, recommendations, regions still in flat JSON (mock)
- [x] Personalized explanations by role and region
- [x] `data/README.md` — weekly refresh checklist (manual ops doc; automation planned)

### Retention Infrastructure

- [x] Visit snapshot (`lib/visit-snapshot.ts`, key: `horizoniq-visit-snapshot`)
- [x] `isReturnVisitForPeriod()` — return diff only within same `briefingPeriod`
- [x] First visit baseline via `previousMomentum` trick
- [x] Snapshot cleared on Start over
- [x] First-visit return framing (baseline + watchlist)

### Removed / Deprecated

- [x] Flat `data/signals.json` (migrated to catalog + briefing)
- [x] Signal relationship map UI
- [x] Legacy TypeScript data modules
- [x] `next-briefing-preview.tsx` (replaced by `signals-we-are-tracking.tsx`)
- [x] `components/dashboard/story-intro.tsx` — unused (dead code)

---

## 4. Pending Features

### Phase 1 Gaps (Pre-launch, In Scope)

- [ ] **Honest trust labeling** — landing overclaims live ingestion; dashboard needs prominent curated/sample disclaimer
- [ ] **Analytics instrumentation** — Week 2 return, change hero engagement, onboarding completion
- [ ] **Broader signal coverage** — sparse/empty states for some interest combos (arts, commerce, biochemistry)
- [ ] **More region-specific explanation variants** in catalog JSON
- [ ] **Onboarding compression** — true ≤60 second path (smart-default interests)
- [ ] **Persona-specific return copy** — baseline banner / watchlist tailored per role
- [ ] **ROADMAP.md checkbox sync** — many Phase 1 items done but unchecked
- [ ] **Remove dead code** — `story-intro.tsx`, possibly `neural-network.ts`

### Phase 2 — Data Pipelines (Approved Architecture, Not Built)

**Reliable free sources only — no paid APIs:**

| Source | Official API | Token required |
|---|---|---|
| Hacker News Firebase + Algolia | Yes | No |
| arXiv export API | Yes | No |
| GitHub REST Search | Yes | Free PAT (5,000 req/hr) |
| Wikimedia Pageviews | Yes | No |
| Product Hunt GraphQL v2 | Yes | Free developer token |

**Not using:** Google Trends scrapers (unreliable), GitHub Trending scrapers (no official API), paid scrapers.

- [ ] Ingestion layer (`lib/pipeline/`)
- [ ] Raw observation store
- [ ] Scoring engine (rules-first, no LLM)
- [ ] Weekly briefing generator → writes `briefings/{period}.json`
- [ ] Derive skills/opportunities/actions from GitHub + HN + PH in same pass
- [ ] GitHub Action weekly cron (commit JSON + Vercel deploy)
- [ ] Access layer: dynamic active briefing load (remove hardcoded `BRIEFINGS` map)
- [ ] Source labels: `type: "live"` with real URLs

### Phase 2 — Experience (Approved, Not Built)

- [ ] **Cinematic welcome overlay** on landing (first visit only)
  - *"Welcome to HorizonIQ."* → Observe. → Predict. → Lead. → fade to landing
  - Skip button; `horizoniq.welcome.seen` in localStorage
  - **Do not** redesign onboarding flow
- [ ] **Immersive dashboard** — React Three Fiber
  - Subtle horizon grid + signal nodes (original design, Cognitra-*inspired* not copied)
  - 2D intelligence panels over 3D background
  - Mobile / `prefers-reduced-motion` → 2D fallback

### Phase 3+ (Post-PMF)

- [ ] Email capture / weekly digest
- [ ] Action follow-up loop ("Last week we recommended X…")
- [ ] User accounts
- [ ] Premium / enterprise
- [ ] Living Intelligence Network (relationship graphs)
- [ ] Optional: Google Trends API alpha (if accepted — 6th source)

---

## 5. Current Architecture

### Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** + shadcn/ui patterns
- **Framer Motion** (landing, dashboard, onboarding)
- **localStorage** for preferences + visit snapshots (no backend, no auth)
- **No R3F / Three.js yet**

### Data Flow (Current)

```
data/meta.json                    → active briefingPeriod + activeBriefingFile
data/catalog/signals.json         → evergreen signal identity + explanations
data/briefings/2026-W26.json      → weekly signalStates + buckets
data/{skills,jobs,recommendations,regions}.json  → mock (not yet pipelined)
        ↓
lib/data/resolve-signals.ts       → merge catalog + briefing → SignalRecord[]
        ↓
lib/data/access.ts                → getAllSignals(), getSignalById(), filters
        ↓
lib/personalize.ts                → getTopSignals(), getWhatChangedForYou(), etc.
        ↓
app/dashboard/page.tsx              → first-visit vs return-visit UI split
components/dashboard/*            → presentation
        ↓
lib/visit-snapshot.ts             → localStorage diff (retention)
```

### Data Flow (Phase 2 Target)

```
GitHub Action (weekly)
  → ingest HN / arXiv / GitHub / Wikimedia / PH
  → score + generate briefing JSON
  → commit data/briefings/{period}.json + meta.json
  → Vercel deploy
        ↓
lib/data/access.ts reads active briefing (API or build-time)
        ↓
(same personalize + UI layer — unchanged)
```

### Personalization Flow

```
User selects Role + Region + Interests (onboarding)
        ↓
lib/preferences.tsx               → localStorage horizoniq.preferences.v2
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
  - Save snapshot (baseline uses previousMomentum on first save)

Return visit (same briefingPeriod):
  - isReturnVisit = true
  - Hero: "What Changed Since Your Last Visit"
  - UI: full dashboard sections
  - Diff momentum/confidence vs snapshot → New/Rising/Falling

New briefingPeriod in meta.json:
  - Treated as new weekly cycle (not return visit for diff)

Start over:
  - clearVisitSnapshot() + clear preferences → /
```

### Key Modules

| Module | Responsibility |
|---|---|
| `lib/types.ts` | All TypeScript interfaces |
| `lib/options.ts` | Roles, regions, interests, `ROLE_INTEREST_IDS`, `ROLE_EXPERIENCE` |
| `lib/data/schemas.ts` | Raw JSON + catalog/briefing types |
| `lib/data/access.ts` | Data access, personalization text resolution |
| `lib/data/resolve-signals.ts` | Catalog + briefing merge |
| `lib/personalize.ts` | Business logic: signals, skills, jobs, actions, briefing |
| `lib/visit-snapshot.ts` | localStorage snapshot, diff, `isReturnVisitForPeriod` |
| `lib/preferences.tsx` | React context for onboarding state |
| `lib/utils.ts` | `formatBriefingUpdatedAt`, `formatTodayLabel`, `cn` |

---

## 6. Current File Structure

```
HorizonIQ/
├── app/
│   ├── page.tsx                         # Landing
│   ├── layout.tsx                       # Root layout, theme, preferences provider
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx                     # Dashboard (first vs return visit split)
│   ├── onboarding/
│   │   ├── role/page.tsx                # Step 1
│   │   ├── region/page.tsx              # Step 2
│   │   └── interests/page.tsx           # Step 3
│   └── signals/
│       └── [id]/page.tsx                # Signal detail (change-first)
│
├── components/
│   ├── landing/
│   │   ├── landing-hero.tsx
│   │   ├── landing-pillars.tsx
│   │   └── why-horizoniq.tsx            # Landing only
│   ├── onboarding/
│   │   ├── onboarding-shell.tsx
│   │   ├── option-card.tsx
│   │   ├── step-progress.tsx
│   │   └── observe-understand-act-steps.tsx
│   ├── dashboard/
│   │   ├── what-changed-hero.tsx        # RETENTION CORE
│   │   ├── baseline-briefing-banner.tsx # First visit only
│   │   ├── signals-we-are-tracking.tsx  # First visit only
│   │   ├── signal-card.tsx
│   │   ├── signal-evidence.tsx
│   │   ├── change-badge.tsx
│   │   ├── skill-card.tsx
│   │   ├── opportunity-card.tsx
│   │   ├── action-card.tsx
│   │   ├── dashboard-header.tsx         # Return visit only
│   │   ├── role-lens.tsx                # Return visit only
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
│   ├── meta.json                        # Active briefing pointer
│   ├── catalog/
│   │   └── signals.json                 # Evergreen signal definitions
│   ├── briefings/
│   │   └── 2026-W26.json                # Weekly overlay (only week registered)
│   ├── skills.json
│   ├── jobs.json
│   ├── recommendations.json
│   ├── regions.json
│   └── README.md                        # Manual refresh checklist
│
├── lib/
│   ├── types.ts
│   ├── options.ts
│   ├── personalize.ts
│   ├── preferences.tsx
│   ├── visit-snapshot.ts
│   ├── utils.ts
│   ├── data/
│   │   ├── access.ts
│   │   ├── schemas.ts
│   │   └── resolve-signals.ts
│   └── neural-network.ts                # Possibly unused legacy
│
├── start-dev.bat                        # Windows: npm run dev + open browser
├── .cursorrules
├── .cursor/rules/horizoniq.mdc
│
├── VISION.md
├── PROJECT_MEMORY.md                    # Canonical product spec
├── PROJECT_DECISIONS.md
├── ROADMAP.md                           # Checkboxes partially stale
├── CHANGELOG.md
├── SESSION_HANDOFF_V2.md                # Superseded by this file
├── SESSION_HANDOFF_V3.md                # This file
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
- `IntelligenceBackground` on landing (2D)

### Page-Specific UI

| Surface | Decisions |
|---|---|
| Landing | Hero + pillars + Why HorizonIQ; CTA to onboarding; no login |
| Onboarding | 3-step progress; Observe/Understand/Act; **no** Why HorizonIQ block |
| Dashboard (first visit) | Baseline banner → Week 1 hero → Signals We're Tracking; minimal chrome |
| Dashboard (return visit) | Change hero → header → role lens → 4 sections |
| Signal detail | Change-first; numbered sections; tracking footer |

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

**Full interest catalog:** 19 IDs in `lib/options.ts` `INTERESTS` (includes business category not shown in onboarding).

### Regions (8 Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

---

## 8. Data Strategy

### Current (MVP — Pre-launch)

- **Curated mock JSON** — no live pipeline running yet
- **Catalog + briefing split** for signals (automation-ready)
- Skills, jobs, recommendations still flat mock JSON
- Architecture designed for swap: JSON → generated JSON via CI → future API
- **Founder does not need weekly manual edits** during local testing (static `2026-W26` briefing is sufficient)
- **Production:** automated weekly generation via GitHub Actions (approved, not built)

### Catalog Record (`data/catalog/signals.json`)

Evergreen: id, name, category, interest, `defaultCurrentState`, explanation variants, recommendedAction variants, affected industries/roles, related skills/opportunities, `introducedInPeriod`, `status`

### Briefing Record (`data/briefings/{period}.json`)

Weekly: `briefingPeriod`, `signalStates[]`, explicit `buckets` (new/rising/falling/stable), `dataProvenance: "curated-mock"` today

### Meta Record (`data/meta.json`)

```json
{
  "briefingPeriod": "2026-W26",
  "briefingLabel": "Week of June 23, 2026",
  "updatedAt": "2026-06-23T00:00:00Z",
  "activeBriefingFile": "2026-W26.json"
}
```

### Phase 2 Pipeline Sources (Approved)

1. **Hacker News** — Firebase live + Algolia search (free, no key)
2. **arXiv** — export API (free, 1 req/3s, cache daily)
3. **GitHub REST Search** — official API (free PAT, 5000/hr) — **not** trending page scrape
4. **Wikimedia Pageviews** — official API (free, no key) — replaces unreliable Google Trends scrapers
5. **Product Hunt GraphQL** — official API (free developer token, non-commercial OK)

### Derivation (Same Weekly Pass)

| Output | Sources |
|---|---|
| Signals | All 5 sources cross-scored |
| Skills rising | GitHub languages/topics + arXiv categories |
| Opportunities | Product Hunt launches + HN Show HN / jobs |
| Actions | Top rising signal + role templates |

### Founder Setup (One-Time, Free)

- GitHub read-only Personal Access Token → Vercel env
- Product Hunt developer token → Vercel env
- HN, arXiv, Wikimedia: no signup

---

## 9. Trust Strategy

### Current Trust Mechanisms

- Mock sources labeled `"type": "mock"` on signals
- Momentum / confidence with expandable drivers (`SignalEvidence`)
- Change deltas visible in hero and cards
- Personalized "so what for you" explanations
- Footer: *"HorizonIQ · Curated demo data · {briefingLabel}"*
- Briefing freshness: Updated [date] in change hero

### Trust Gaps (Known — High Priority)

| Gap | Severity | Notes |
|---|---|---|
| Landing copy implies live ingestion | **High** | *"analyzes jobs, technology, funding, research…"* — mock only today |
| No prominent curated/sample disclaimer on dashboard | **High** | Footer-only is insufficient |
| Momentum scores feel authoritative without live provenance | Medium | Will improve when pipelines ship |
| Watchlist lists current rising signals as watch items | Low | Copy frames as baseline tracking, not past acceleration |

### Trust Principles

- Label mock vs live explicitly in UI
- Show reasoning, not just scores
- Never overclaim until pipeline exists
- Real source URLs when live (`type: "live"`)
- Show stale indicator if pipeline fails

### Product Review Scores (2026-06-23)

Clarity 7 · Time to value 6 · **Trust 5** · Retention 6 · Delight 6

---

## 10. Retention Strategy

### North Star

Users return because **something changed for them** — not because a static feed exists.

### Two Layers of Change

| Layer | Trigger | User-facing copy |
|---|---|---|
| **Weekly briefing** | New `briefingPeriod` in data | Week 1 / weekly change from JSON |
| **Visit delta** | Return within same week | "What Changed Since Your Last Visit" |

### Implemented Mechanics

| Mechanic | Implementation |
|---|---|
| Visit snapshot | `horizoniq-visit-snapshot` in localStorage |
| Return visit diff | Compare momentum/confidence vs snapshot |
| Briefing period gate | `isReturnVisitForPeriod()` |
| Signal buckets | New · Rising · Falling |
| First visit baseline | `previousMomentum` on first save |
| Primary action | One recommended action in hero |
| **First-visit return framing** | Baseline banner + Week 1 + watchlist |
| Signal detail hook | *"We're tracking this signal for your next briefing."* |
| Snapshot reset | Start over clears all |

### Retention Gaps

| Gap | Impact |
|---|---|
| localStorage only | Device-bound; no cross-device |
| Static mock data | Visit 3+ stale without pipeline or refresh |
| No email/digest | No pull mechanism |
| No action follow-up | No closed loop from last week's action |
| No analytics | Cannot measure Week 2 return yet |
| Landing overclaims | Trust blocks habit |

### What Improved (Recent Sessions)

- First visit now explains **why to return** (baseline + watchlist)
- First visit dashboard simplified (not a "complete report")
- Return visit mechanic unchanged and working

---

## 11. Known Issues

### Product / UX

| Issue | Severity | Notes |
|---|---|---|
| Landing copy overclaims data sources | **High (trust)** | Pipeline not live yet |
| 60-second promise vs onboarding length | Medium | 3 steps + multi-select often > 60s |
| First visit ≠ return visit on page refresh | Low | Snapshot saved on first load → refresh may show return UI |
| Empty states for some interest combos | Medium | Not all 19 interests have rich coverage |
| Persona-specific return copy not yet tailored | Medium | Generic baseline message for all roles |
| Welcome cinematic overlay | Not built | Approved for Phase 2 |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| `BRIEFINGS` map hardcoded in `access.ts` | Medium | Must register each new week until dynamic load |
| Visit snapshot device-bound | Medium | No cross-device sync |
| Snapshot saved on every dashboard load | Low | Same-session refresh overwrites |
| `story-intro.tsx` unused | Low | Dead code |
| `neural-network.ts` possibly unused | Low | Legacy |
| `ROADMAP.md` checkboxes stale | Low | Docs drift |
| `PROJECT_MEMORY.md` says 14 interests | Low | Code has 19 IDs |

### Data

| Issue | Severity | Notes |
|---|---|---|
| No automated pipeline yet | **High for production** | Approved architecture; not implemented |
| Skills/jobs/recommendations still mock | Medium | Phase 2 derivation planned |
| Limited signals for newer interests | Medium | arts, commerce, biochemistry thin |

### Documentation Drift

- `SESSION_HANDOFF_V2.md` outdated (references Next Briefing Preview, onboarding Why HorizonIQ, old first-visit copy)
- `ROADMAP.md` Phase 1 checkboxes need updating
- `PROJECT_MEMORY.md` interest count outdated

---

## 12. Next 10 Tasks (Priority Order)

Ranked for **pre-launch impact**: trust → live data → retention measurement → experience polish.

### 1. Honest trust labeling across product

**Why:** Trust score 5/10 blocks habit; landing overclaims live ingestion.  
**Do:** Soften landing subheadline or add "Sample briefing" badge; prominent dashboard "Curated intelligence demo" label; ensure mock labels visible in hero.

### 2. Automated pipeline Phase 2.0 — HN + arXiv + Wikimedia

**Why:** Reliable free sources, zero cost, no founder weekly edits.  
**Do:** `lib/pipeline/` ingestors; raw observation cache; respect arXiv rate limits; daily ingest schedule in GitHub Action.

### 3. Pipeline Phase 2.1 — GitHub + Product Hunt + scoring engine

**Why:** Completes approved 5-source stack; enables skills/opportunity derivation.  
**Do:** GitHub Search API with free PAT; PH GraphQL with free developer token; rules-first momentum/confidence; cross-source agreement.

### 4. Weekly briefing generator + GitHub Action

**Why:** Founder will not manually create briefing files.  
**Do:** Generate `briefings/{period}.json` + update `meta.json`; commit + Vercel deploy; fallback to last briefing on failure.

### 5. Dynamic briefing load in access layer

**Why:** Remove hardcoded `BRIEFINGS` registry; scale weekly automatically.  
**Do:** Read `meta.activeBriefingFile` at build or via API route; keep `resolveSignalsFromBriefing` unchanged.

### 6. Analytics instrumentation

**Why:** MVP validates habit — must measure Week 2 return.  
**Do:** Track first visit, return visit, change hero view, signal detail click, onboarding completion (Plausible, PostHog, or lightweight events).

### 7. Cinematic welcome overlay on landing

**Why:** Phase 2 approved; sets premium tone before onboarding.  
**Do:** First visit only; "Welcome to HorizonIQ." → Observe. → Predict. → Lead.; skip; `horizoniq.welcome.seen`; **do not** change onboarding routes.

### 8. Persona-specific return copy

**Why:** Generic baseline message weak for student vs investor motivation.  
**Do:** One line under baseline banner per role (skills/careers vs capital/sectors).

### 9. Expand catalog + briefing coverage for sparse interests

**Why:** Empty sections kill value for student science/arts paths.  
**Do:** At least 1–2 signals + skill + opportunity + action per onboarding interest per role.

### 10. Immersive dashboard shell (React Three Fiber)

**Why:** Phase 2 approved premium experience.  
**Do:** Subtle grid + nodes behind 2D panels; lazy load; mobile 2D fallback; **preserve all product logic and layout contracts**.

---

## 13. Quick Start for Next Session

### Read First (in order)

1. `PROJECT_MEMORY.md` — canonical product spec
2. `PROJECT_DECISIONS.md` — decision log
3. `SESSION_HANDOFF_V3.md` — this file
4. `CHANGELOG.md` — recent changes
5. `.cursor/rules/horizoniq.mdc` — agent rules

### Run Locally

```powershell
cd C:\HorizonIQ
npm run dev
```

Or double-click `start-dev.bat` (Windows).

Open: http://localhost:3000

### Test Retention Flow

1. **First visit:** Complete onboarding → dashboard  
   - Expect: baseline banner, **Week 1 Briefing**, Signals We're Tracking, **no** four sections  
2. **Return visit:** Navigate away → return to `/dashboard`  
   - Expect: **What Changed Since Your Last Visit**, full sections, no watchlist  
3. **Signal detail:** Click tracked signal → footer tracking message  
4. **Reset:** Start over → clears snapshot and preferences

### Key localStorage Keys

| Key | Purpose |
|---|---|
| `horizoniq.preferences.v2` | Role, region, interests |
| `horizoniq-visit-snapshot` | Visit snapshot for retention diff |
| `horizoniq.welcome.seen` | *(Planned)* Welcome overlay dismissed |

### User Flow

```
/ (landing)
  → /onboarding/role
  → /onboarding/region
  → /onboarding/interests
  → /dashboard
      first visit:  baseline + Week 1 hero + watchlist
      return visit: change hero + full briefing sections
  → /signals/[id] (optional depth)
```

---

## 14. Strategic Context (Decisions Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| No auth for MVP | Locked |
| No paid APIs for pipelines | Locked |
| Reliable free sources: HN, arXiv, GitHub, Wikimedia, PH | Locked |
| Google Trends scrapers — do not use | Locked |
| GitHub Actions for weekly briefing (not manual JSON) | Locked |
| Founder does not edit weekly files | Locked |
| Welcome overlay on landing (not separate route) | Locked |
| Onboarding flow — do not redesign | Locked |
| R3F dashboard — subtle, original, 2D fallback on mobile | Locked |
| LLM summarization — not in Phase 2 | Locked |
| Supabase — not in Phase 2 | Locked |

---

## 15. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap (partially stale) |
| `CHANGELOG.md` | Change history |
| `data/README.md` | Weekly refresh checklist (manual; superseded by CI plan) |
| `HorizonIQ MVP — Product Review.txt` | Product review scores |
| `HorizonIQ_UI_Constitution_v1.md` | UI constitution |
| `HorizonIQ_MVP_Blueprint_v1.md` | Early blueprint (partially superseded) |

---

*End of Session Handoff V3*

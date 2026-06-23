# HorizonIQ — Session Handoff V2

**Last updated:** 2026-06-23  
**Version:** MVP V1.1 (Change-First)  
**Status:** Active Development  
**Purpose:** Zero-context handoff for the next chat session or engineer.

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Core product principle:**

> Users do not return for signals. Users return for **changes in signals**.

**Product should feel like:** *"Your personal future analyst who tells you what changed."*

**Target users:** Student · Professional · Entrepreneur · Investor

**Design inspiration:** Apple · Linear · Stripe · Notion · Bloomberg

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP)

---

## 2. MVP Definition

### MVP V1.1 Objective

Validate **habit**, not just first-visit format.

A user receives useful, personalized intelligence within **60 seconds** and has a reason to **return weekly**.

### MVP Success Metrics (Primary)

| Metric | Intent |
|---|---|
| Week 2 return rate | Did change create habit? |
| Change hero engagement | Did users read "What Changed"? |
| Signal detail from change | Did change drive depth? |

### MVP Success Metrics (Secondary)

- Time to first actionable insight (< 60s)
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

- Live data ingestion pipeline
- User accounts / login
- Email digest (planned Phase 2)
- Relationship graphs / Living Intelligence Network
- Community / discussion boards
- Premium / enterprise tiers
- AI chatbot homepage

### Feature Retention Filter

Every new feature must pass:

> Does this give the user a reason to come back next week?

---

## 3. Completed Features

### Landing (`/`)

- [x] Pre-onboarding hero with value proposition
- [x] Headline: *"See what is changing before everyone else does."*
- [x] Subheadline describing jobs, technology, funding, research, market signals (marketing copy — not yet live ingestion)
- [x] 60-second promise: *"Get your personalized intelligence briefing in under 60 seconds."*
- [x] Landing pillars (How it works: What is changing / Why it matters / What to do next)
- [x] CTA → `/onboarding/role`

### Onboarding (`/onboarding/role` → `/region` → `/interests`)

- [x] 3-step flow: Role → Region → Interests
- [x] Observe → Understand → Act explanation above role selection
- [x] Role cards with benefit-first copy (who it's for + value)
- [x] Role-aware **curated** interest lists (not full 19-interest catalog)
- [x] Student interests grouped: Technology · Science · Arts & Commerce
- [x] Student fields: biotech, biochemistry, life sciences, arts, commerce + tech/science careers
- [x] "Why HorizonIQ?" section on all onboarding steps (Signals · Skills · Opportunities)
- [x] Preferences stored in localStorage (`horizoniq.preferences.v2`)
- [x] Legacy preference migration (old region/interest IDs)

### Dashboard (`/dashboard`)

- [x] **What Changed For You** hero (highest-priority retention feature)
- [x] First visit: *"What Changed This Week"* — grouped by mock `change.type`
- [x] Return visit: *"What Changed Since Your Last Visit"* — localStorage snapshot comparison
- [x] Signal buckets: **New Signals · Rising Signals · Falling Signals**
- [x] Primary recommended action in hero
- [x] Role lens + personalized header
- [x] Changed signals section with featured + grid cards
- [x] Skills Rising (demand change badges)
- [x] Opportunities (New This Week / Heating Up framing via growth change)
- [x] Actions (primary + secondary "Also consider")
- [x] Role-based section ordering via `ROLE_EXPERIENCE`

### Signal Detail (`/signals/[id]`)

- [x] Change-first layout
- [x] Sections: What Changed · Why It Matters · Momentum Drivers · Affected Industries · Recommended Skills · Opportunities · Recommended Action
- [x] Labeled mock sources
- [x] Links from signal cards

### Data Layer

- [x] JSON datasets in `/data`
- [x] Swappable access layer (`lib/data/access.ts`)
- [x] Change metadata on signals (`change.type`, `previousMomentum`, etc.)
- [x] Personalized explanations by role and region
- [x] ~17 signals covering major interests (mock)

### Retention Infrastructure

- [x] Visit snapshot (`lib/visit-snapshot.ts`, key: `horizoniq-visit-snapshot`)
- [x] First visit saves baseline using `previousMomentum` so return visits show movement
- [x] Snapshot cleared on dashboard "Start over"

### Removed / Deprecated

- [x] Signal relationship map UI
- [x] Relationship flow components
- [x] Legacy TypeScript data modules (`intelligence.ts`, `signal-intelligence.ts`, etc.)

---

## 4. Pending Features

### Phase 1 Gaps (In Scope, Not Done)

- [ ] **Weekly manual JSON refresh** operational process (critical for retention credibility)
- [ ] Visible **"Updated [date]"** / briefing freshness indicator in hero
- [ ] Broader mock signal coverage for all selectable interests (especially student science/arts/commerce)
- [ ] More region-specific explanation variants in JSON
- [ ] Analytics instrumentation (Week 2 return, change hero engagement)
- [ ] Dashboard simplification (top 3 changes only on first visit — recommended by product review)
- [ ] Honest MVP labeling in UI (curated/mock vs live ingestion claims)
- [ ] ROADMAP.md checkbox sync (many Phase 1 items are done but unchecked)

### Phase 2 (Post-MVP Validation)

- [ ] Email capture / weekly digest
- [ ] Action follow-up ("Last week we recommended X — here's what changed")
- [ ] Briefing period UX polish
- [ ] A/B test change hero formats

### Phase 3+ (Post-PMF)

- [ ] Live data ingestion (jobs, patents, research, funding, news, government reports)
- [ ] User accounts
- [ ] Premium / enterprise
- [ ] Living Intelligence Network (relationship graphs)

---

## 5. Current Architecture

### Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS**
- **Framer Motion** (used in some components; onboarding "Why HorizonIQ" has no animation by design)
- **localStorage** for preferences + visit snapshots (no backend, no auth)

### Data Flow

```
/data/*.json
    ↓
lib/data/access.ts          ← load & query datasets
    ↓
lib/personalize.ts          ← filter by preferences, build views, What Changed briefing
    ↓
app/dashboard/page.tsx      ← client component, reads/writes visit snapshot
    ↓
components/dashboard/*      ← presentation
```

### Personalization Flow

```
User selects Role + Region + Interests
    ↓
lib/preferences.tsx         ← localStorage persistence
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
  - No snapshot → "What Changed This Week" (from signal.change.type in JSON)
  - Save snapshot with previousMomentum baselines

Return dashboard visit:
  - Load snapshot → compare momentum/confidence
  - Classify into New / Rising / Falling buckets
  - Title: "What Changed Since Your Last Visit"
  - Update snapshot with current values

Reset / Start over:
  - clearVisitSnapshot() + clear preferences
```

### Key Modules

| Module | Responsibility |
|---|---|
| `lib/types.ts` | All TypeScript interfaces |
| `lib/options.ts` | Roles, regions, interests, role-specific interest lists, dashboard copy |
| `lib/data/access.ts` | JSON data access, personalization text resolution |
| `lib/data/schemas.ts` | Raw JSON record types |
| `lib/personalize.ts` | Business logic: signals, skills, jobs, actions, briefing |
| `lib/visit-snapshot.ts` | localStorage snapshot, diff, classification |
| `lib/preferences.tsx` | React context for onboarding state |

---

## 6. Current File Structure

```
HorizonIQ/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout, theme, preferences provider
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard (client)
│   ├── onboarding/
│   │   ├── role/page.tsx           # Step 1: role + Observe/Understand/Act
│   │   ├── region/page.tsx         # Step 2: region
│   │   └── interests/page.tsx      # Step 3: role-aware interests
│   └── signals/
│       └── [id]/page.tsx           # Signal detail (change-first)
│
├── components/
│   ├── landing/
│   │   ├── landing-hero.tsx
│   │   └── landing-pillars.tsx
│   ├── onboarding/
│   │   ├── onboarding-shell.tsx    # Shared onboarding layout + Why HorizonIQ
│   │   ├── option-card.tsx
│   │   ├── step-progress.tsx
│   │   ├── observe-understand-act-steps.tsx
│   │   └── why-horizoniq.tsx
│   ├── dashboard/
│   │   ├── what-changed-hero.tsx   # RETENTION CORE
│   │   ├── signal-card.tsx
│   │   ├── signal-evidence.tsx
│   │   ├── change-badge.tsx
│   │   ├── skill-card.tsx
│   │   ├── opportunity-card.tsx
│   │   ├── action-card.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── role-lens.tsx
│   │   ├── section.tsx
│   │   └── story-intro.tsx         # UNUSED (removed from dashboard)
│   ├── layout/
│   │   ├── top-bar.tsx
│   │   └── intelligence-background.tsx
│   ├── motion/                     # FadeIn, Stagger, AnimatedCounter
│   ├── theme/                      # ThemeProvider, ThemeToggle
│   └── ui/                         # Button, Badge, PremiumCard, etc.
│
├── data/                           # Curated mock datasets (MVP)
│   ├── meta.json                   # briefingPeriod, briefingLabel
│   ├── signals.json                # ~17 signals with change metadata
│   ├── skills.json
│   ├── jobs.json                   # Opportunities
│   ├── recommendations.json        # Actions
│   └── regions.json                # Region hubs, context, growth bias
│
├── lib/
│   ├── types.ts
│   ├── options.ts                  # Roles, regions, interests, ROLE_INTEREST_IDS
│   ├── personalize.ts
│   ├── preferences.tsx
│   ├── visit-snapshot.ts
│   ├── data/
│   │   ├── access.ts
│   │   └── schemas.ts
│   └── utils.ts
│
├── .cursor/rules/horizoniq.mdc     # Cursor agent rules
├── .cursorrules
│
├── PROJECT_MEMORY.md               # Canonical product spec (READ FIRST)
├── PROJECT_DECISIONS.md              # Decision log
├── ROADMAP.md                        # Phased plan (checkboxes partially stale)
├── CHANGELOG.md
├── VISION.md
├── SESSION_HANDOFF.md              # V1 handoff (superseded by this doc)
└── SESSION_HANDOFF_V2.md           # This file
```

---

## 7. UI Decisions

### Design Principles

1. Intelligence must be beautiful
2. Every visual element must communicate meaning
3. Animation is information — never decoration (some motion exists; avoid adding more without purpose)

### Visual Language

- Premium, calm, trustworthy — Apple/Linear/Bloomberg-inspired
- `PremiumCard` for elevated surfaces
- `label-caps` for section labels
- `display-title` / `section-title` for hierarchy
- Change badges: New (primary) · Rising (success) · Falling (warning) · Stable (muted)

### Page-Specific UI

| Surface | Decisions |
|---|---|
| Landing | Hero + pillars; no login CTA |
| Onboarding | 3-step progress; Observe/Understand/Act; Why HorizonIQ at bottom; no animations on Why section |
| Dashboard | Change hero first; role lens; section order varies by role |
| Signal detail | Change-first; numbered sections |

### Role-Specific Dashboard Section Order

| Role | Order |
|---|---|
| Student | signals → skills → opportunities → actions |
| Professional | signals → skills → actions → opportunities |
| Entrepreneur | signals → opportunities → actions → skills |
| Investor | signals → opportunities → skills → actions |

### Onboarding Interest Lists (Curated per Role)

| Role | Count | Focus |
|---|---|---|
| Student | 11 | Technology + Science + Arts & Commerce |
| Professional | 6 | Tech + industry careers |
| Entrepreneur | 5 | AI + key market sectors |
| Investor | 6 | AI + capital-relevant sectors |

**Note:** Full interest catalog has 19 IDs in `lib/options.ts`; onboarding shows only `ROLE_INTEREST_IDS[role]`. Business category interests (startups, VC, etc.) exist in data layer but are **not** shown in onboarding.

### Regions (8 Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

---

## 8. Data Strategy

### MVP Approach

- **Curated mock JSON files** — no live pipeline
- Architecture designed for future swap: JSON → API
- **Manual weekly refresh** required (operational, not yet productized)

### Data Files

| File | Contents |
|---|---|
| `signals.json` | Signals with change metadata, explanations, sources, momentum drivers |
| `skills.json` | Skills with demand + demandChange |
| `jobs.json` | Opportunities with growth + growthChange |
| `recommendations.json` | Actions with isPrimary, changeReason |
| `regions.json` | Region context, hubs, growth bias per interest |
| `meta.json` | `briefingPeriod`, `briefingLabel`, `updatedAt` |

### Signal Record Shape (Key Fields)

```json
{
  "id": "ai-agents",
  "name": "...",
  "interest": "artificial-intelligence",
  "currentState": "...",
  "momentum": 96,
  "confidence": 88,
  "previousMomentum": 84,
  "previousConfidence": 82,
  "change": { "type": "rising", "summary": "..." },
  "explanation": { "base": "...", "byRole": {}, "byRegion": {} },
  "recommendedAction": { "base": "...", "byRole": {} },
  "sources": [{ "label": "...", "type": "mock" }]
}
```

### Future Data Sources (Out of Scope)

Job boards · Research papers · Patents · Funding databases · News · Government reports · Startup databases

---

## 9. Trust Strategy

### Current Trust Mechanisms

- Mock sources labeled with `"type": "mock"` on signals
- Momentum / confidence with expandable drivers (`SignalEvidence`)
- Change deltas visible (↑/↓ momentum since last period or baseline)
- Personalized "so what for you" explanations
- No fake data without labels (non-negotiable)

### Trust Gaps (Known)

- Landing/subheadline **implies live ingestion** — product does not yet analyze jobs, funding, research in real time
- Momentum/confidence scores can feel authoritative without live provenance
- No global "curated demo data" disclaimer on dashboard
- Weekly refresh not visible to user when data is stale

### Trust Principles Going Forward

- Label mock vs live explicitly in UI
- Show reasoning, not just scores
- Never overclaim data sources until pipeline exists
- Every screen answers: *"What changed, why it matters, what to do"*

---

## 10. Retention Strategy

### North Star

Users return because **something changed for them** — not because a static feed exists.

### Implemented Mechanics

| Mechanic | Implementation |
|---|---|
| Visit snapshot | `horizoniq-visit-snapshot` in localStorage |
| Return visit diff | Compare momentum/confidence vs last snapshot |
| Signal buckets | New · Rising · Falling |
| First visit fallback | Weekly change from JSON `change.type` |
| Baseline trick | First save uses `previousMomentum` so visit 2 shows movement |
| Primary action | One recommended action per briefing in hero |
| Snapshot reset | Cleared on "Start over" |

### Retention Gaps

| Gap | Impact |
|---|---|
| localStorage only | Breaks across devices/browsers |
| Static JSON | Visit 3+ shows no new change if data not refreshed |
| No email/digest | No pull mechanism to return |
| No action follow-up | No closed loop from last week's recommendation |
| No analytics | Cannot measure Week 2 return yet |

### Retention Metrics to Track

1. Week 2 return rate
2. Change hero engagement
3. Signal detail clicks from change section
4. Time to first actionable insight

---

## 11. Known Issues

### Product / UX

| Issue | Severity | Notes |
|---|---|---|
| 60-second promise vs onboarding length | Medium | 3 steps + multi-select interests often exceeds 60s |
| Dashboard cognitive load | Medium | Hero + 4 sections competes for attention |
| Landing copy overclaims data sources | High (trust) | Says "analyzes jobs, funding, research" — mock only |
| First visit ≠ return visit experience | Low | Users may not understand retention feature until visit 2 |
| Empty states for some interest combos | Medium | Not all 19 interests have rich signal coverage |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| Visit snapshot is device-bound | Medium | No cross-device sync |
| Snapshot saved on every dashboard load | Low | Immediately after diff; correct for return visit but overwrites baselines on same-session refresh |
| `ROADMAP.md` checkboxes stale | Low | Many Phase 1 items done but marked incomplete |
| `story-intro.tsx` unused | Low | Dead code; removed from dashboard |
| `neural-network.ts` may be unused | Low | Legacy |
| Run dev from project root | Low | `npm run dev` must run from `C:\HorizonIQ`, not user home |

### Data

| Issue | Severity | Notes |
|---|---|---|
| No automated weekly refresh | High | Retention decays without manual JSON updates |
| Limited signals for newer interests | Medium | arts, commerce, biochemistry have signals but thin coverage |
| `PROJECT_MEMORY.md` interest list outdated | Low | Docs list 14 interests; code has 19 IDs |

### Documentation Drift

- `ROADMAP.md` Phase 1 checkboxes need updating
- `PROJECT_MEMORY.md` student interest expansion not fully reflected in interest options section

---

## 12. Next 10 Tasks (Priority Order)

Ranked by impact on retention, trust, and MVP validation.

### 1. Establish weekly mock data refresh + visible freshness UI

**Why:** Retention feature is meaningless without changing data.  
**Do:** Update `meta.json` + signal change fields weekly; show *"Updated [date]"* and *"Week of [date]"* prominently in change hero.

### 2. Simplify first-visit dashboard to one decision path

**Why:** Biggest clarity/time-to-value win from product review.  
**Do:** Hero with top 3 changes + primary action only; collapse skills/opportunities/actions below fold or defer to visit 2.

### 3. Add honest trust labeling across product

**Why:** Landing copy overclaims; trust blocks habit.  
**Do:** Dashboard footer *"Curated intelligence demo"*; soften landing subheadline or add *"Sample briefing"* badge; ensure all sources show mock label in hero.

### 4. Expand mock signal coverage for all onboarding interests

**Why:** Empty/sparse sections kill value for student science/arts paths.  
**Do:** At least 1–2 signals + 1 skill + 1 opportunity + 1 action per selectable interest per role.

### 5. Add lightweight return hook (email capture)

**Why:** localStorage alone cannot sustain weekly habit.  
**Do:** Optional *"Email me my weekly briefing"* on dashboard — no full accounts required for MVP.

### 6. Compress onboarding toward true ≤60 seconds

**Why:** Funnel leak before users reach retention feature.  
**Do:** Smart-default 2–3 interests per role; optional preview after role selection.

### 7. Instrument retention analytics

**Why:** MVP validates habit — need measurement.  
**Do:** Track first visit, return visit, change hero view, signal detail click, onboarding completion (Plausible, PostHog, or simple events).

### 8. Action follow-up loop

**Why:** Closes retention loop.  
**Do:** Store last primary action in snapshot; on return show *"Last time we recommended X — here's what changed."*

### 9. Sync documentation (ROADMAP + PROJECT_MEMORY)

**Why:** Next session context drift causes wrong decisions.  
**Do:** Check off completed Phase 1 items; update interest catalog to 19 IDs; document student science/arts interests.

### 10. Dashboard return-visit empty state handling

**Why:** When snapshot diff is empty, grouped sections disappear awkwardly.  
**Do:** Fallback copy: *"No major shifts since your last visit — here's what's still rising this week"* with stable/rising from JSON.

---

## 13. Quick Start for Next Session

### Read First (in order)

1. `PROJECT_MEMORY.md` — canonical product spec
2. `PROJECT_DECISIONS.md` — why decisions were made
3. `SESSION_HANDOFF_V2.md` — this file
4. `.cursor/rules/horizoniq.mdc` — agent rules

### Run Locally

```powershell
cd C:\HorizonIQ
npm run dev
```

Open: http://localhost:3000

### Test Retention Feature

1. Complete onboarding → dashboard (first visit: *What Changed This Week*)
2. Navigate away, return to `/dashboard` (return visit: *What Changed Since Your Last Visit* with New/Rising/Falling buckets)
3. Click *Start over* to clear snapshot and preferences

### Key localStorage Keys

| Key | Purpose |
|---|---|
| `horizoniq.preferences.v2` | Role, region, interests |
| `horizoniq-visit-snapshot` | Visit snapshot for retention diff |

### User Flow

```
/ (landing)
  → /onboarding/role
  → /onboarding/region
  → /onboarding/interests
  → /dashboard
  → /signals/[id] (optional depth)
```

---

## 14. Product Review Summary (2026-06-23)

Scores: Clarity 7 · Time to value 6 · Trust 5 · Retention 6 · Delight 6

**Verdict:** Strategy is correct; MVP proves briefing format but not yet weekly habit. Top blocker: **fresh, trusted, weekly change** delivered with **one clear action**.

Full review: `HorizonIQ MVP — Product Review.txt` (if present in repo)

---

## 15. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `HorizonIQ_MVP_Blueprint_v1.md` | Early blueprint (partially superseded) |
| `HorizonIQ_UI_Constitution_v1.md` | UI constitution |

---

*End of Session Handoff V2*

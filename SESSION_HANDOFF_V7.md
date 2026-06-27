# HorizonIQ — Session Handoff V7

**Last updated:** 2026-06-27  
**Version:** MVP V1.1 (Change-First) + Live Pipeline + Sprints 1–3C  
**Status:** Active Development — **Deployed to Vercel (beta)** + local dev  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V6.md`, `SESSION_HANDOFF_V5.md`, and earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `npm run dev` or `npm run dev:clean` → check terminal for port (often `http://localhost:3000`)

**Repo state (2026-06-27):**

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Sprints 1–3B: onboarding, intelligence reasoning, dashboard IA, premium visual system, analytics, trust labeling, live pipeline (`44c1c84` latest on remote) |
| **Local uncommitted** | Sprint 3C Living Intelligence Core, React 19 upgrade, R3F v9.5, safe WebGL loading pipeline, `next.config.mjs` webpack aliases, `.npmrc`, doc updates |

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `CHANGELOG.md` → `.cursorrules`

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Sprint 3C elevation:** HorizonIQ is becoming a **Personal Intelligence Operating System** — not a dashboard. The signature visual is the **Living Intelligence Core**: an abstract, data-reactive intelligence field (not a globe, brain, or neural-network cliché).

**Core product principle:**

> Users do not return for signals. Users return for **changes in signals**.

**Intelligence positioning (Sprint 2.5A):**

> HorizonIQ must behave like an **intelligence analyst**, not a trend aggregator.

**Experience goals:**

- Feel like *"Your personal future analyst who tells you what changed."*
- Users should **pause** on arrival — intelligence, confidence, discovery
- UI feels **alive** without becoming distracting
- The interface feels like an intelligence organism continuously learning

**Target users:** Student · Professional · Entrepreneur · Investor

**Design inspiration:** Apple · Linear · Stripe · Notion · Bloomberg · Raycast

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP) · dashboard overload · AI hype language · copying Draftly layouts

**Feature retention filter (every new feature):**

> Does this give the user a reason to come back next week?

**IA goal (Sprint 3A):** User understands the dashboard in **under 15 seconds** via one story: What changed → Why it matters → What to do.

**Visual goal (Sprint 3B):** Premium, dark-first, typography-led — intelligence made beautiful.

**Immersive goal (Sprint 3C):** One memorable signature visual — Living Intelligence Core — that breathes and reacts to real briefing data.

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
| Time to first actionable insight | < 60s | **Partially met** — quick-start helps; welcome flow adds steps |
| Onboarding completion rate | — | **Instrumented** — `onboarding_completed` with `path: quick \| custom` |
| Trust indicators | Source reads, confidence engagement | **Not instrumented** |
| 15-second dashboard comprehension | Sprint 3A goal | **Shipped (IA)** — not yet measured |
| Immersive welcome comprehension | Sprint 3C goal | **Built** — not yet measured |

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

### Living Intelligence Core Contract (Sprint 3C)

| Visual behavior | Data source |
|---|---|
| Motion energy | Signal momentum + rising/new change ratio |
| Brightness | Average confidence tier |
| Field reorganization | Region phase (8 regions) |
| Color tint | Role |
| Vertical density | Intelligence Focus Areas count |

**Render modes** (`IntelligenceFieldMode`):

| Mode | Behavior |
|---|---|
| `css` | Procedural CSS fallback only — **reliable, no WebGL** |
| `webgl` | Living Intelligence Core (R3F + GLSL) with error boundary |
| `auto` | `webgl` on welcome; `css` everywhere else |

**Current page assignments (local):**

| Page | Mode | Notes |
|---|---|---|
| `/` landing | `css` | Stable load; no R3F chunk |
| `/dashboard` | `css` | Procedural ambient background |
| `/signals/[id]` | `css` | Procedural ambient background |
| `/onboarding/welcome` | `webgl` | Phased reveal; CSS fallback on error / reduced motion |

### Data Provenance (Briefing)

| Value | Meaning | UI label |
|---|---|---|
| `pipeline` | ≥4 healthy live sources ingested | **Live intelligence** |
| `pipeline-mock` | 2–3 sources; partial live | **Mixed live + sample data** |
| `curated-mock` | No pipeline; demo only | **Sample briefing** |

**Active briefing:** `pipeline` · Period **`2026-W26`**

### Terminology (Sprint 3A+)

| Old (internal) | User-facing |
|---|---|
| Interests | **Intelligence Focus Areas** |
| `prefs.interests` | unchanged in code — label only |

Constants: `lib/copy.ts` — `TAGLINE_LINES`, `BETA_PREVIEW_LABEL`, `WELCOME_HEADLINE`, `INTELLIGENCE_FOCUS_AREAS_LABEL`, `ONBOARDING_STEP_FOCUS_AREAS_LABEL`, `STORY_ACTS`

### Full User Flow

```
/ (landing)
  → /onboarding/welcome          [Sprint 1 + 3C — greeting → Living Core → Enter]
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
- Full WebGL on every page (Sprint 3C uses CSS fallback on critical paths until stable)

---

## 3. Completed Features

### Deployment & Analytics (on `main`)

- [x] **Vercel deployment** — `https://horizoniq-beta.vercel.app/`
- [x] **Provider-agnostic analytics** — `lib/analytics/`
- [x] **PostHog** — optional via `NEXT_PUBLIC_POSTHOG_KEY`
- [x] **Events:** `onboarding_started`, `onboarding_role_selected`, `onboarding_region_selected`, `onboarding_completed`, `dashboard_viewed`, `change_hero_viewed`, `signal_click`, `signal_detail_viewed`, `start_over`
- [x] **ThemeToggle hydration fix**
- [x] **`<body suppressHydrationWarning>`** — extension attribute mismatches

### Landing (`/`)

- [x] Hero: *"See what is changing before everyone else does."*
- [x] Provenance badge + honest subheadline (live sources when `pipeline`)
- [x] **DataTrustPanel**, pillars, **Why HorizonIQ?**
- [x] **TaglineLockup** + **BetaBadge** (Sprint 3B)
- [x] CTA → `/onboarding/welcome`
- [x] Intelligence field background — CSS procedural (Sprint 3C local)

### Sprint 1 — Premium First-Time Onboarding (on `main`)

- [x] Welcome, name, greeting, tour choice, guided tour overlay
- [x] **IdentityService** — `horizoniq.identity.v1`
- [x] **`getFirstTimeOnboardingPath()`** resume routing
- [x] Onboarding compression — quick-start, `ROLE_DEFAULT_INTERESTS`, tour gate
- [x] Guided tour **SVG mask spotlight** — highlighted sections visible
- [x] Tour deferred until layout ready; visit snapshot deferred until tour complete
- [x] Identity onboarding guards on dashboard, tour, signal detail, welcome/name/greeting pages

### Live Data Pipeline (on `main`)

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full`
- [x] **GitHub Actions** — Monday 06:00 UTC (`weekly-briefing.yml`)
- [x] Catalog + briefing architecture (`data/catalog/signals.json` + `data/briefings/{period}.json`)

### Trust (on `main`)

- [x] Provenance badges, `DataTrustPanel`, honest copy via `lib/trust.ts`
- [x] Dashboard footer — provenance, period, updated date
- [x] **Clickable source URLs** — pipeline `url` + `resolveSourceUrl()` label fallback
- [x] Confidence explanation prose on every signal

### Sprint 2.5 / 2.5A — Intelligence Quality & Reasoning (on `main`)

- [x] **`lib/intelligence.ts`** — reasoning builders, outlook, confidence tiers
- [x] **`IntelligenceCard`** + `IntelligenceCardSection` + `IntelligenceCardEvidence`
- [x] `SignalView.intelligence` bundle on every personalized signal
- [x] Signal detail — full analyst brief
- [x] Source `url` on `DataSource`; pipeline preserves observation URLs

### Sprint 3A — Information Architecture (on `main`)

- [x] **Story-driven hero** — What changed → Why it matters → What to do (one card)
- [x] **`StorySection`** — story act headers
- [x] **`DashboardContextBar`** — role, region, Intelligence Focus Areas
- [x] **`DisclosurePanel`** — skills + opportunities collapsed by default
- [x] **Single-question cards** — `SignalCard` `focus="why"`, trimmed skill/opportunity/action cards
- [x] Primary action **once** in hero; actions section = secondary only
- [x] **Intelligence Focus Areas** label across dashboard, onboarding, guided tour
- [x] Removed from dashboard: `DashboardHeader`, `RoleLens`, duplicate intelligence in hero rows

### Sprint 3A Phase A Polish (on `main` — `44c1c84`)

- [x] Step progress step 3 → **Focus Areas** (`ONBOARDING_STEP_FOCUS_AREAS_LABEL`)
- [x] Deleted dead components: `dashboard-header.tsx`, `role-lens.tsx`, `story-intro.tsx`
- [x] Watchlist rows → single question ("What happened?")

### Sprint 3B — Premium Visual Experience (on `main` — `44c1c84`)

- [x] **Dark-first** premium palette — deep navy, restrained teal primary
- [x] **Outfit** headings + **Inter** body typography
- [x] **`BetaBadge`**, **`TaglineLockup`**, strengthened welcome + landing branding
- [x] **`lib/motion.ts`** — shared easing/duration tokens
- [x] Hairline surfaces, `flat` PremiumCard, reduced card noise
- [x] CSS page transition via `app/template.tsx` + `animate-page-in`
- [x] Refreshed buttons, top bar, dashboard hero spacing

### Sprint 3C — Immersive Intelligence Experience (local — uncommitted)

- [x] **Living Intelligence Core** — R3F + GLSL shader particle field
- [x] **`IntelligenceFieldLayer`** — lazy-loaded with error boundary
- [x] **`lib/intelligence-field/`** — params, shaders, WebGL safety probe
- [x] **Data-reactive uniforms** — energy, confidence, region, role, focus areas
- [x] **Welcome phased experience** — greeting → core reveal → "Enter HorizonIQ"
- [x] **`prefers-reduced-motion`** → CSS procedural fallback
- [x] **Safe loading** — `mode="css"` on landing/dashboard/signal; `webgl` on welcome only
- [x] **React 19** + **`@react-three/fiber@9.5.0`** — required for Next.js 15 compatibility
- [x] **`next.config.mjs`** — transpilePackages + client React dedupe
- [x] **`npm run dev:clean`** — clears stale `.next` cache
- [x] **`.npmrc`** — `legacy-peer-deps=true`

### Retention Infrastructure

- [x] Visit snapshot — `horizoniq-visit-snapshot`
- [x] `isReturnVisitForPeriod()` — same-week return diff
- [x] First visit: Week 1 hero + watchlist; return visit: full story + depth sections

---

## 4. Pending Features

### Commit & Deploy (High Priority)

- [ ] **Commit Sprint 3C + React 19 + safe WebGL pipeline** to `main`
- [ ] **Push → Vercel** auto-deploy
- [ ] Verify production build after React 19 upgrade
- [ ] Verify PostHog env vars on Vercel (redeploy after `NEXT_PUBLIC_*` changes)

### Sprint 3C Stabilization

- [ ] **Single shared WebGL canvas** across route changes (avoid remount)
- [ ] **GPU tier detection** — auto particle budget + quality presets
- [ ] **Re-enable WebGL on landing/dashboard** after canvas pooling (currently `mode="css"` for reliability)
- [ ] **WebGL load skeleton** — match CSS fallback until shaders compile
- [ ] **Dev FPS overlay** for performance monitoring
- [ ] Welcome timing A/B — core reveal duration

### Post-Sprint Polish

- [ ] **Display name on dashboard** — baseline banner / hero salutation from `identityService`
- [ ] **PostHog funnels** — Week 2 return, `path: quick` vs `custom`, change-hero → signal-detail
- [ ] **`guided_tour_completed`** analytics event
- [ ] **Product Hunt rate limit hardening** — frequent HTTP 429 → `stale`
- [ ] **Landing section pass** — pillars/trust panel aligned with 3B/3C surfaces
- [ ] **Onboarding profile steps** visual pass (role/region/interests)
- [ ] Measure **15-second dashboard comprehension**

### Product Gaps

- [ ] Broader catalog coverage — sparse focus areas (arts, commerce, biochemistry)
- [ ] More region-specific explanation variants in catalog
- [ ] Trust instrumentation (source clicks, evidence expand)

### Phase 2+ (Approved, Not Built)

- [ ] Email weekly digest
- [ ] Action follow-up loop
- [ ] User accounts (wire IdentityService to Google/GitHub/Supabase)
- [ ] Premium / enterprise
- [ ] Living Intelligence Network (relationship graphs)

### Explicitly Not Using

- Google Trends scrapers, GitHub Trending scrapers, paid APIs, Reddit API, LLM in pipeline, `@react-three/drei` (removed — unused)

---

## 5. Current Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15.5** (App Router) |
| Language | **TypeScript** (strict) |
| UI | **React 19** |
| Styling | **Tailwind CSS** + shadcn/ui patterns |
| Typography | **Outfit** (headings) + **Inter** (body) |
| Motion | **Framer Motion** + `lib/motion.ts` tokens + CSS `animate-page-in` |
| 3D (welcome) | **Three.js** + **@react-three/fiber 9.5** + GLSL shaders |
| Analytics | **posthog-js** (optional) + `lib/analytics` local buffer |
| Client state | **localStorage** — preferences, identity, visit snapshot, analytics |
| Pipeline CLI | **tsx** + **dotenv** |
| CI data refresh | **GitHub Actions** (Node 24) |
| Hosting | **Vercel** |
| Not in use | Supabase, database, user auth, `@react-three/drei` |

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

### Intelligence Field Flow (Sprint 3C)

```
Preferences + Signals (optional)
        ↓
hooks/use-intelligence-field-params.ts
        ↓
lib/intelligence-field/params.ts → computeIntelligenceFieldParams()
        ↓
components/intelligence-field/intelligence-field-layer.tsx
        ↓
intelligence-field-canvas.tsx    → mode: css | webgl | auto
        ├─ css  → intelligence-field-fallback.tsx (procedural gradients)
        └─ webgl → dynamic import → living-intelligence-core.tsx
                      ↓
                   intelligence-field-points.tsx (GLSL Points mesh)
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
| `lib/copy.ts` | User-facing labels (3A+), tagline, beta badge copy |
| `lib/motion.ts` | Premium easing/duration tokens (3B) |
| `lib/intelligence.ts` | Analyst reasoning assembly |
| `lib/intelligence-field/*` | Living Core params, shaders, WebGL probe (3C) |
| `lib/trust.ts` | Provenance, disclaimers, `resolveSourceUrl()` |
| `lib/data/*` | Schemas, access, resolve-signals, briefings-registry |
| `lib/personalize.ts` | Dashboard business logic |
| `lib/visit-snapshot.ts` | Return-visit diff |
| `lib/preferences.tsx` | Profile preferences context |
| `lib/identity/*` | IdentityService (Sprint 1) |
| `lib/onboarding-flow.ts` | First-time resume routing |
| `lib/analytics/*` | Event taxonomy, track, PostHog |
| `lib/pipeline/*` | Ingest, score, generate briefing |
| `hooks/use-intelligence-field-params.ts` | Signals + prefs → field uniforms |
| `hooks/use-reduced-motion.ts` | `prefers-reduced-motion` detection |

### Next.js Config (`next.config.mjs`)

- `transpilePackages: ["three", "@react-three/fiber"]`
- Client-only webpack alias deduping `react`, `react-dom`, jsx runtimes
- Required for R3F on Next.js 15 — prevents `ReactCurrentOwner` errors

---

## 6. Current File Structure

```
HorizonIQ/
├── .github/workflows/
│   └── weekly-briefing.yml
├── .npmrc                               # legacy-peer-deps=true (3C)
├── next.config.mjs                      # R3F transpile + React dedupe (3C)
│
├── app/
│   ├── page.tsx                         # Landing — IntelligenceFieldLayer mode=css
│   ├── layout.tsx                       # React 19, Outfit+Inter, dark default, Providers
│   ├── template.tsx                     # CSS page-in animation (3B)
│   ├── globals.css                      # Design tokens, premium palette (3B)
│   ├── dashboard/page.tsx               # Story hero + field + progressive depth
│   ├── onboarding/
│   │   ├── welcome/page.tsx             # WelcomeScreen — Living Core reveal
│   │   ├── name/page.tsx
│   │   ├── greeting/page.tsx
│   │   ├── role/page.tsx
│   │   ├── region/page.tsx              # Quick-start + customize focus areas
│   │   ├── interests/page.tsx
│   │   └── tour/page.tsx
│   └── signals/[id]/page.tsx            # Full IntelligenceCard + field
│
├── components/
│   ├── analytics/analytics-provider.tsx
│   ├── brand/
│   │   ├── logo.tsx                     # Optional BetaBadge
│   │   ├── beta-badge.tsx               # Sprint 3B
│   │   └── tagline-lockup.tsx           # Observe · Predict · Lead (3B)
│   ├── intelligence/                    # Sprint 2.5A — analyst cards
│   │   ├── intelligence-card.tsx
│   │   ├── intelligence-card-section.tsx
│   │   └── intelligence-card-evidence.tsx
│   ├── intelligence-field/              # Sprint 3C — Living Intelligence Core
│   │   ├── intelligence-field-layer.tsx
│   │   ├── intelligence-field-canvas.tsx
│   │   ├── intelligence-field-error-boundary.tsx
│   │   ├── intelligence-field-fallback.tsx
│   │   ├── intelligence-field-points.tsx
│   │   └── living-intelligence-core.tsx
│   ├── landing/                         # hero, pillars, data-trust-panel, why-horizoniq
│   ├── trust/provenance-badge.tsx
│   ├── onboarding/
│   │   ├── welcome-screen.tsx           # Phased greeting → core → Enter
│   │   ├── first-time-shell.tsx
│   │   ├── guided-tour-overlay.tsx      # SVG mask spotlight
│   │   ├── onboarding-shell.tsx
│   │   ├── step-progress.tsx            # Focus Areas label (3A polish)
│   │   └── observe-understand-act-steps.tsx
│   ├── dashboard/
│   │   ├── what-changed-hero.tsx        # RETENTION CORE — story acts
│   │   ├── story-section.tsx
│   │   ├── dashboard-context-bar.tsx
│   │   ├── disclosure-panel.tsx
│   │   ├── signal-card.tsx              # focus: change | why | action
│   │   ├── skill-card.tsx, opportunity-card.tsx, action-card.tsx
│   │   ├── signals-we-are-tracking.tsx
│   │   ├── baseline-briefing-banner.tsx
│   │   ├── change-badge.tsx, signal-evidence.tsx, section.tsx
│   ├── layout/                          # top-bar, intelligence-background, neural-background
│   ├── motion/, theme/, ui/
│   └── brand/
│
├── hooks/
│   ├── use-intelligence-field-params.ts
│   └── use-reduced-motion.ts
│
├── lib/
│   ├── identity/
│   ├── analytics/
│   ├── data/
│   ├── pipeline/
│   ├── intelligence-field/              # params.ts, shaders.ts, safe-webgl.ts
│   ├── intelligence.ts
│   ├── copy.ts
│   ├── motion.ts
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
├── SESSION_HANDOFF_V7.md                # This file
├── SESSION_HANDOFF_V6.md                # Superseded
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

### Visual Language (Sprint 3B+)

| Token / component | Purpose |
|---|---|
| `display-title` | Primary hero headlines (Outfit, tight tracking) |
| `section-title` | Secondary headings |
| `label-caps` | Section eyebrows |
| `prose-lead` | Lead paragraphs |
| `tagline-line` | Observe · Predict · Lead |
| `PremiumCard` | Elevated surfaces (`flat` variant reduces noise) |
| `BetaBadge` | "Beta Preview" — memorable branding |
| `TaglineLockup` | Reusable tagline typography |
| Change badges | New · Rising · Falling · Stable |
| Provenance badges | Live · Mixed · Sample |
| `IntelligenceFieldFallback` | Procedural CSS ambient (always safe) |
| Living Intelligence Core | WebGL particle field (welcome only, for now) |

### Color (Sprint 3B)

- **Dark-first** — default theme `dark` on `<html>`
- Deep background: `228 44% 4%`
- Restrained teal primary: `196 58% 48%` — not neon cyan
- Light mode exists as companion theme via ThemeToggle

### Sprint 3A — Dashboard IA

| Principle | Implementation |
|---|---|
| One primary message | Hero `display-title` + story acts — no competing header |
| Progressive disclosure | Skills/opportunities in `DisclosurePanel` (collapsed) |
| One story | Hero: changed → matters → action |
| No visual competition | Removed stats row, RoleLens, duplicate intelligence blocks |
| One question per card | `SignalCard focus="why"`; skill/opportunity/action single Q |
| Intelligence Focus Areas | Replaces "Interests" in all user-facing copy |

### Sprint 3C — Welcome Experience

| Phase | Duration (approx) | UI |
|---|---|---|
| Greeting | 0–2.8s | Welcome to HorizonIQ + tagline animation + field at low intensity |
| Core reveal | 2.8–4.2s | Copy fades; field intensifies; "Intelligence awakening" pulse |
| Ready | 4.2s+ | Tagline + **Enter HorizonIQ** CTA |

Skip available throughout. WebGL falls back to CSS on error or `prefers-reduced-motion`.

### Page-Specific UI

| Surface | Decisions |
|---|---|
| Landing | Tagline lockup + Beta badge + hero; CSS field background; `z-10` content stack |
| Welcome | Phased Living Core reveal; WebGL with fallback |
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

### Five Live Sources (Locked)

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
- Living Intelligence Core labeled decorative (`aria-hidden`) — does not imply fake live data  

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
- Visual effects represent intelligence metaphor — not fabricated metrics  

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
| Immersive welcome | Living Core reveal — emotional hook for first visit |

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
| Sprint 3C uncommitted | **High** | Production lacks Living Core + React 19 |
| WebGL disabled on landing/dashboard | Medium | `mode="css"` workaround for R3F crash — welcome only has WebGL |
| Display name captured but not shown on dashboard | Medium | Identity loop incomplete |
| 60-second promise vs full first-time flow | Medium | Quick-start mitigates |
| Empty states for some focus area combos | Medium | arts, commerce, biochemistry thin |
| Guided tour: opportunities inside collapsed disclosure on return | Low | Tour uses fallback copy on first visit |
| Light mode less refined than dark | Low | Dark-first by design |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| **R3F v8 incompatible with Next.js 15** | **Fixed locally** | Requires React 19 + `@react-three/fiber@9.5.0` |
| **`ReactCurrentOwner` runtime error** | **Fixed locally** | React upgrade + webpack alias + CSS mode on landing |
| Stale `.next` cache crashes | Medium | `ENOENT _document.js` — run `npm run dev:clean` |
| Multiple dev servers on ports 3000/3002 | Medium | Kill old terminals before dev |
| `briefings-registry.ts` must regenerate each new week | Low | Automated by pipeline |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| PostHog `NEXT_PUBLIC_*` build-time | Low | Redeploy after env change |
| WebGL canvas remounts on navigation | Medium | Performance concern — needs shared canvas |
| Browser extensions on `<body>` | Low | `suppressHydrationWarning` applied |

### Data

| Issue | Severity | Notes |
|---|---|---|
| Catalog explanations curated, not LLM-generated | By design | Activity metrics live |
| Single briefing week until next Monday pipeline | Low | `2026-W26` active |

---

## 12. Next Tasks (Priority Order)

### 1. Commit and deploy Sprint 3C + React 19

**Why:** Production is on `44c1c84` (3B only). Local has Living Core, React 19, safe WebGL pipeline.  
**Do:** Stage all changes, commit, push `main`, verify Vercel build.

### 2. Stabilize WebGL across pages

**Why:** Landing/dashboard use CSS-only workaround. Need shared canvas + GPU tier detection before re-enabling WebGL everywhere.  
**Do:** Single WebGL context; FPS monitoring; gradual rollout.

### 3. Use display name on dashboard

**Why:** Closes personalization loop from name capture.  
**Do:** Baseline banner or hero subline with time-of-day + first name from `identityService`.

### 4. PostHog funnels and retention insights

**Why:** MVP validates habit — need Week 2 return, onboarding path, change-hero → signal-detail.  
**Do:** Create PostHog insights; add `guided_tour_completed` event.

### 5. Product Hunt rate limit hardening

**Why:** PH frequently `stale` (HTTP 429) in CI.

### 6. Expand catalog coverage for sparse focus areas

**Why:** Empty sections for arts, commerce, biochemistry paths.

### 7. More region-specific explanation variants

**Why:** Personalization depth for 8 regions.

### 8. Landing + onboarding visual pass

**Why:** Pillars, trust panel, role/region steps not fully aligned with 3B/3C surfaces.

### 9. Trust instrumentation

**Why:** Source clicks, evidence expand — secondary retention/trust metrics.

### 10. Measure 15-second dashboard + welcome comprehension

**Why:** Validate Sprint 3A/3C goals with real users or PostHog timing.

---

## 13. Quick Start for Next Session

### Run Locally

```powershell
cd C:\HorizonIQ
git pull
copy .env.example .env.local          # first time
npm install                             # uses legacy-peer-deps via .npmrc
npm run dev:clean                       # recommended — clears stale .next
```

Or:

```powershell
npm run dev
```

**Important:** If you see `ReactCurrentOwner`, `ENOENT _document.js`, or blank pages:

1. Stop **all** running `next dev` processes  
2. `Remove-Item -Recurse -Force .next`  
3. `npm install`  
4. `npm run dev:clean`  
5. Open the URL printed in terminal (not always port 3000)

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` or EU |

Redeploy after changing `NEXT_PUBLIC_*` vars.

### Test Full First-Time Flow

1. Clear localStorage (or Start over on dashboard)  
2. Landing → Get started → **Welcome** (watch Living Core reveal) → Name → Greeting  
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
44c1c84 feat: premium visual experience (Sprint 3B) and IA polish
a43eeaa feat: intelligence reasoning layer, dashboard IA, and onboarding fixes
42fd6c7 feat: Sprint 1 premium onboarding, compression, and handoff V5
7e27e0c chore: trigger redeploy with posthog env
ef7e983 feat: add analytics instrumentation with optional PostHog
```

**Local uncommitted:** Sprint 3C Living Intelligence Core, React 19, R3F v9.5, safe WebGL modes, `next.config.mjs`, `.npmrc`, `dev:clean`, doc updates.

---

## 15. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (canonical) |
| `PROJECT_DECISIONS.md` | Decision log (Sprints 1, 2.5, 2.5A, 3A, 3B, 3C) |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `data/README.md` | Weekly refresh checklist |
| `.env.example` | Pipeline + PostHog tokens |
| `.cursorrules` | Agent engineering + design rules |
| `SESSION_HANDOFF_V6.md` | Superseded handoff |

---

## 16. Strategic Context (Decisions Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| Intelligence analyst, not trend aggregator | Locked (2.5A) |
| Dashboard story: changed → matters → action | Locked (3A) |
| Intelligence Focus Areas (not "Interests" in UI) | Locked (3A) |
| Dark-first premium visual system | Locked (3B) |
| Living Intelligence Core as signature visual | Locked (3C) |
| Not a globe, brain, or neural-network cliché | Locked (3C) |
| WebGL represents intelligence — CSS fallback when unsafe | Locked (3C) |
| No auth for MVP (local IdentityService) | Locked |
| Five free pipeline sources — no new sources until post-PMF | Locked |
| GitHub Actions for weekly briefing | Built |
| Trust labeling — honest provenance | Built |
| Analytics — PostHog optional + local buffer | Built |
| Vercel hosting | Live (beta) |
| React 19 + R3F v9 for Next.js 15 | Required (3C) |
| LLM summarization — not in pipeline | Locked |
| Relationship graphs — post-MVP | Locked |

---

## 17. Project Memory

*Condensed from `PROJECT_MEMORY.md`. For full spec, read that file.*

### Core Principle

HorizonIQ is a **signal change platform**. Users return for **changes in signals**, not static feeds.

### Retention Test

> Does this give the user a reason to come back next week?

### Product Vision

Personalized intelligence platform — a **Personal Intelligence Operating System** — helping users discover emerging technologies, skills, careers, opportunities, and industry shifts **before they become mainstream**.

**Tagline:** Observe. Predict. Lead.

### Target Users

| User | Core questions |
|---|---|
| Student | What to learn? Growing jobs? What technologies matter? |
| Professional | What skills to add? What trends affect my role? |
| Entrepreneur | What to build? Which markets growing? |
| Investor | Where is the next opportunity? |

### UX Philosophy

Apple · Linear · Stripe · Notion · Bloomberg · Raycast — premium, calm, trustworthy, alive.  
Avoid cyberpunk, neon, crypto aesthetics, generic AI dashboards, Draftly copies.

### Intelligence Layer

**Dashboard story (3A):** What changed → Why it matters → What to do.

**Signal intelligence (2.5A):** Seven-question `IntelligenceCard` on detail; single-question cards on dashboard.

**Living Core (3C):** Data-reactive abstract field; WebGL on welcome, CSS elsewhere until stable.

**Personalization:** Role × Region × Intelligence Focus Areas (14 predefined, multi-select).

### Onboarding Flow

Welcome (Core reveal) → Name → Greeting → Role → Region → [Focus Areas] → Tour → Dashboard.

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

**Approved:** Change hero, visit snapshot, personalized explanations, labeled sources, weekly refresh, intelligence cards, story IA, immersive welcome.

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
- Visual effects must not block page load (Sprint 3C)  

### Retention Metrics

| Primary | Secondary |
|---|---|
| Week 2 return rate | Time to first insight (<60s) |
| Change hero engagement | Onboarding completion |
| Signal detail from change | Trust indicators |
| | 15s dashboard comprehension |
| | Welcome core engagement |

### Implementation Status Summary

| Area | Status |
|---|---|
| Change-first dashboard + visit snapshot | On `main` |
| Live pipeline + trust labeling | On `main` |
| Sprint 1 onboarding + tour | On `main` |
| Intelligence reasoning (2.5A) | On `main` |
| Dashboard IA (3A) + polish | On `main` |
| Premium visual system (3B) | On `main` |
| Living Intelligence Core (3C) | **Local uncommitted** |
| React 19 + R3F v9 | **Local uncommitted** |
| PostHog funnels | Not built |
| Email digest / accounts | Not started |
| Broader focus area catalog coverage | Needs improvement |

### Living Intelligence Network (Future)

Signal relationship graphs — cause/effect visualization. Explicitly out of MVP.

---

*End of Session Handoff V7*

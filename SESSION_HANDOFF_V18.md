# HorizonIQ — Session Handoff V18

**Last updated:** 2026-07-06  
**Version:** MVP V1.1 (Change-First) + Intelligence Exchange (Epic 4–6) + Living Intelligence Field (Epic 5)  
**Status:** Active Development — **Intelligence Exchange rebuild in progress** on feature branch (uncommitted)  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V17.md`, `SESSION_HANDOFF_V16.md`, and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main` (production)  
**Active feature branch:** `feature/intelligence-exchange-ui` (local, **not merged to main**)  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `docs/analytics/metrics.md` → `docs/feedback/README.md` → `CHANGELOG.md` → `.cursorrules` → `.cursor/rules/communication.mdc`

**Known-good fallback:** `FALLBACK_TIMELINE.md` — tag `fallback/2026-06-28-v1.1-stable` at `aab7e55`. Use only if onboarding auto-repair regresses.

---

## Repo State (2026-07-06)

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Through `52a5129` / `f3cdaa2` — MVP V1.1 stack, analytics, brand/legal, feedback, welcome CTA polish. **Dashboard still uses legacy change-first layout on production.** |
| **On `feature/intelligence-exchange-ui` (local, uncommitted)** | Full **Intelligence Exchange** rebuild: Hero, World Intelligence Pulse, Living Intelligence Field (canvas), new `ExchangeHeader`. **Not pushed. Not on production.** |
| **Production briefing** | `2026-W28` — Week of July 6, 2026 – July 12, 2026 |
| **Working tree (feature branch)** | Modified `app/dashboard/page.tsx` + new `components/exchange/`, `components/background/`, `lib/exchange/`, `lib/background/` |

**Recent commits on `main` (most recent first):**

```
52a5129 docs: add SESSION_HANDOFF_V17 comprehensive zero-context handoff
f3cdaa2 fix(welcome): simplify Enter CTA to bold label only
3e686e4 fix(welcome): black HorizonIQ label on Enter button with aligned arrow
97263d1 feat(feedback): Sprint 3.95 in-app feedback and brand wordmark
1558d75 feat(brand): Sprint 3.9 footer, legal pages, SEO, and site navigation
a2d38de feat(analytics): Sprint 4A product analytics and Vercel Web Analytics
f344a10 fix(pipeline): ensure weekly briefing deploys to Vercel
```

**Product owner context:**

- Product owner is **not technical** — follow `.cursor/rules/communication.mdc` (plain English, numbered steps).
- **Do not change welcome screen** without explicit product owner approval (layout locked; CTA is **Enter** only — bold).
- Supabase feedback is **configured and verified working** in production.
- Stale onboarding cookies self-heal via `lib/onboarding-reconcile.ts` — do not revert.
- **Intelligence Exchange is the new strategic direction for `/dashboard`** — but it is **not yet merged** to `main`.

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**New strategic elevation (Epic 4 — Intelligence Exchange):**

> The dashboard is becoming **Intelligence Exchange** — a flagship experience that feels like tomorrow's front page, not admin software. Users discover intelligence progressively (newspaper-style), not by navigating away.

**Core product principle (unchanged):**

> Users do not return for signals. Users return for **changes in signals**.

**Intelligence positioning (Sprint 2.5A):**

> HorizonIQ must behave like an **intelligence analyst**, not a trend aggregator.

**Signature visual identity (dual implementation — important):**

| Surface | Background | Technology |
|---|---|---|
| Landing `/`, Signal detail `/signals/[id]` | **Living Intelligence Core** (Sprint 3C) | React Three Fiber + GLSL WebGL |
| Dashboard `/dashboard` (feature branch) | **Living Intelligence Field** (Epic 5) | HTML Canvas 2D — nodes + connections |

Both represent "intelligence flowing beneath the interface." They are **not the same codebase**. Do not conflate them.

**Experience goals:**

- Feel like *"Your personal future analyst who tells you what changed."*
- Intelligence Exchange should feel like **reading tomorrow's newspaper** — editorial, collectible, urgent
- UI feels **alive** without distracting from reading (atmospheric field at ~5–18% opacity)
- Premium, calm, trustworthy — Apple · Linear · Stripe · Bloomberg · Financial Times quality
- Onboarding must **self-heal** in normal browsers
- Product is **measurable** in production (Sprint 4A) — **but new dashboard page does not yet emit analytics**
- Public Beta ready — legal pages, footer, SEO, in-app feedback (Sprints 3.9, 3.95)

**Target users:** Student · Professional · Entrepreneur · Investor

**Explicitly avoid:** Cyberpunk · neon · crypto dashboards · relationship graphs (MVP) · community (MVP) · dashboard overload · TradingView styling · admin-table aesthetics

**Feature retention filter:**

> Does this give the user a reason to come back next week?

**Brand wordmark:**

- **Horizon** — white on dark; **IQ** — `#00c5ff`
- Component: `HorizonIQWordmark` in `components/brand/horizoniq-wordmark.tsx`

---

## 2. MVP Definition

**Version:** MVP V1.1 (Change-First) — **dashboard UX in transition**  
**Objective:** Validate weekly return when intelligence shows personalized change.

### What MVP Must Deliver (platform-wide — still true)

1. Change-first intelligence (signal detail + data layer still implements this)
2. Personalized onboarding — role × region × Intelligence Focus Areas
3. Weekly briefing cadence — catalog + 5-source pipeline
4. Return-visit delta — visit snapshot (implemented in **legacy** dashboard code, **not wired** to new dashboard page)
5. Trust without documentation — labeled sources, confidence prose
6. Premium first impression — welcome flow
7. Reliable onboarding routing — cookie + middleware
8. Product analytics — `lib/analytics/`
9. Public Beta readiness — footer, legal, feedback

### Intelligence Exchange (feature branch — partial)

| Epic | Phase | Status |
|---|---|---|
| Epic 4 | Phase 1 — Hero Experience | ✅ Shipped locally |
| Epic 4 | Phase 2 — Live Intelligence Market (table) | ✅ Built then **removed** in Phase 3 |
| Epic 4 | Phase 3 — World Intelligence Pulse (editorial tiles) | ✅ Shipped locally |
| Epic 4 | Phase 4 — Editorial Intelligence Tiles | ✅ Shipped locally |
| Epic 5 | Phase 1 — Living Intelligence Field (canvas) | ✅ Shipped locally |
| Epic 6 | Phase 1 — Intelligence Brief (progressive disclosure) | ✅ Shipped locally |

**All Exchange UI uses mock/placeholder data.** No API wiring yet.

### Explicitly Out of MVP

- User accounts / login (except optional feedback email)
- Relationship graphs · community · AI chatbot homepage
- Email digest (Phase 2)
- Additional pipeline sources beyond locked five

### Non-Negotiables

- No login required for MVP
- No fake data without labels (Exchange tiles are mock — must be labeled before production)
- **Do not change welcome screen** without product owner approval
- **Do not use `router.push` for cross-phase onboarding** — use `navigateOnboarding()`
- **UI calls `track()` only** — never import provider SDKs in components
- **Do not restore `app/template.tsx`** opacity page transitions

---

## 3. Completed Features

### Deployment & Infrastructure

- [x] Vercel production — `https://horizoniq-beta.vercel.app/`
- [x] GitHub Actions weekly pipeline — Monday 06:00 UTC
- [x] Pipeline CI hardened — sync-registry, verify, build before push
- [x] Briefings: `2026-W26`, `2026-W27`, `2026-W28`

### Sprint 4A — Product Analytics

- [x] Vercel Analytics + Speed Insights
- [x] Provider-agnostic `lib/analytics/`
- [x] Anonymous visitor ID + session tracking
- [x] Typed events — `docs/analytics/metrics.md`

**Still instrumented on:** onboarding pages, signal detail, landing (partial), feedback footer links  
**Not instrumented on:** new Intelligence Exchange dashboard page (feature branch)

### Intelligence Layer (Sprints 2.5, 2.5A — still in codebase)

- [x] `IntelligenceCard` — seven-section analyst contract
- [x] `lib/intelligence.ts` — reasoning, outlook, confidence
- [x] Signal detail at `/signals/[id]` — full intelligence brief layout
- [x] Legacy dashboard components in `components/dashboard/` — **still exist, not used on new `/dashboard`**

### Visual & Immersive (Sprints 3B, 3C)

- [x] Dark-first premium palette, Outfit + Inter typography
- [x] Living Intelligence Core (R3F + GLSL) on landing + signal detail
- [x] Welcome uses CSS field (reliability)

### Onboarding (Sprint 1 + routing)

- [x] Welcome → Name → Landing → Role → Region → Interests → Tour → Dashboard
- [x] Cookie + middleware (`hziq_ob_v3`) + auto-repair
- [x] Guided tour overlay (targets **legacy** dashboard `data-tour` attributes — **missing on new dashboard**)

### Sprint 3.9 — Brand, Legal & Trust

- [x] Global `SiteFooter`, site pages, SEO, founder attribution
- [x] `SiteNav` in `TopBar` (landing, signal detail, site pages)

### Sprint 3.95 — Feedback

- [x] Global `FeedbackWidget` — Supabase-backed, verified in production

### Epic 4 — Intelligence Exchange (feature branch only)

#### Phase 1 — Hero Experience

- [x] `IntelligenceHero` — two-column hero (65/35 desktop)
- [x] Label: LIVE GLOBAL INTELLIGENCE
- [x] Headline: "The world is changing faster than ever."
- [x] Three CTAs (no functionality): Explore Signals, Weekly Briefing, Forecasts
- [x] `FeaturedOpportunityCard` — glass card, Agentic AI, Momentum 97, placeholder metrics

#### Phase 3–4 — World Intelligence Pulse

- [x] `WorldIntelligencePulse` — editorial tile layout (not table)
- [x] Three tiers: 1 hero, 3 featured, 8 compact tiles
- [x] 12 technology stories with editorial headlines, momentum `97 ▲ +18` format
- [x] `PulseSparkline` on every tile — minimal SVG, Apple Stocks inspired
- [x] Forecast as narrative (Rapid Adoption, Infrastructure Expansion, etc.)
- [x] Evidence as prose stats, not admin badges

#### Epic 6 Phase 1 — Intelligence Brief (progressive disclosure)

- [x] Expandable tiles — one open at a time, in-grid expansion (no modal)
- [x] Sections: Why This Matters, Evidence, Who Is Driving This, Related Signals, Forecast
- [x] CTA placeholder: Read Full Brief → (no navigation yet)
- [x] `aria-expanded`, `aria-controls`, keyboard toggle, 300ms animation
- [x] Mock brief data in `lib/exchange/pulse-brief-data.ts`

#### Exchange Chrome (feature branch)

- [x] `ExchangeHeader` — Logo, tagline, region selector, notifications, avatar (static)
- [x] `TickerPlaceholder` — full-width live intelligence ticker (static items)
- [x] `SiteFooter` reused on dashboard

### Epic 5 — Living Intelligence Field (feature branch only)

- [x] `LivingIntelligenceField` — fixed full-viewport canvas layer (`z-0`, `pointer-events: none`)
- [x] `IntelligenceFieldEngine` — 25–90 nodes by viewport, slow drift, fading connections
- [x] HorizonIQ blue tint on nodes; no glow
- [x] Pauses on hidden tab; freezes on `prefers-reduced-motion`
- [x] Future hooks: `getNodeIntensity`, `getRegionBias` (not wired)

### Removed during Epic 4 iteration (intentionally deleted)

- Live Intelligence Market table (`live-intelligence-market.tsx`, row/card components, `market-mock-data.ts`)
- `HeroDotGrid` replaced by `LivingIntelligenceField` on dashboard (file still exists, unused)

---

## 4. Pending Features

### Intelligence Exchange — Critical (before merge to main)

- [ ] **Commit and merge** `feature/intelligence-exchange-ui` to `main` (product owner approval)
- [ ] **Restore onboarding guards** on `/dashboard` — new page is a server component with no `usePreferences`, no redirect to onboarding, no identity check
- [ ] **Restore analytics** — `dashboard_loaded`, `return_visit`, `change_hero_viewed` (or new Exchange-specific events)
- [ ] **Wire mock → live data** — pulse tiles, hero featured card, ticker from briefing/pipeline
- [ ] **Wire Read Full Brief →** `/signals/[id]` or in-page deep brief
- [ ] **Wire hero CTAs** — Explore Signals, Weekly Briefing, Forecasts
- [ ] **Label mock data** honestly in UI before production (Beta / Sample provenance)
- [ ] **Reconnect guided tour** or redesign tour for Exchange layout
- [ ] **Reconnect visit snapshot** / "What Changed Since Your Last Visit" (retention layer) — decide if it returns in Exchange or stays on signal detail only
- [ ] **Instrument new events:** `brief_expanded`, `pulse_tile_opened`, `brief_cta_clicked`
- [ ] **Related Signals chips** — enable navigation between tiles (currently disabled)
- [ ] **Living Intelligence Field** — wire `getNodeIntensity` to signal momentum (Epic 5 Phase 2+)

### Analytics & Measurement (platform)

- [ ] PostHog funnels — Week 2 return, onboarding, feedback
- [ ] Clarity session replay (`NEXT_PUBLIC_CLARITY_PROJECT_ID`)
- [ ] Trust interaction analytics
- [ ] Wire deferred events: `search_executed`, `recommendation_opened`, `forecast_opened`

### Feedback (Post-Ship)

- [ ] Admin dashboard UI (presets exist in `lib/feedback/admin-queries.ts`)
- [ ] Email/Slack notification on new feedback

### Sprint 3C Stabilization (R3F — landing/signals)

- [ ] Single shared WebGL canvas across route changes
- [ ] GPU tier detection
- [ ] Onboarding field continuity

### Guided Tour

- [ ] Fix step 4 spotlight on **legacy** dashboard (if legacy tour kept)
- [ ] Return-visit tour variants

### Brand & Legal

- [ ] GitHub footer link (placeholder)
- [ ] Formal legal review of Terms and Privacy

### Post-MVP (Phase 2+)

- [ ] Email weekly digest
- [ ] User accounts
- [ ] Relationship graphs (Living Intelligence Network)
- [ ] Additional pipeline sources

---

## 5. Current Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.19 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19.2.7 |
| Styling | Tailwind CSS + shadcn/ui patterns |
| Typography | Outfit (headings) + Inter (body) |
| Motion | Framer Motion + `lib/motion.ts` (Exchange hero uses CSS `animate-fade-up`) |
| 3D (landing/signals) | Three.js 0.185 + @react-three/fiber 9.5 + GLSL |
| 2D field (dashboard) | HTML Canvas 2D — `lib/background/intelligence-field-engine.ts` |
| Analytics | `lib/analytics/` + Vercel Analytics + Speed Insights |
| Feedback | Supabase via `POST /api/feedback` |
| Routing guard | `middleware.ts` + `hziq_ob_v3` cookie |
| State repair | `lib/onboarding-reconcile.ts` |
| Client state | Cookie (routing) + localStorage (prefs, identity, analytics, visit snapshot) |
| Pipeline | tsx + dotenv; GitHub Actions Node 24 |
| Hosting | Vercel |

### Dashboard Page Architecture (feature branch)

```
app/dashboard/page.tsx (Server Component)
├── LivingIntelligenceField (client)     ← fixed z-0, canvas, pointer-events: none
├── ExchangeHeader (server)              ← sticky z-40
├── TickerPlaceholder (server)           ← static ticker
├── <main className="relative z-10">
│   ├── IntelligenceHero (server)        ← Epic 4 Phase 1
│   └── WorldIntelligencePulse (client)  ← Epic 4/6, expandedId state
└── SiteFooter (server)                  ← z-10
```

**FeedbackWidget** still mounts globally from `app/layout.tsx` — unaffected.

### Intelligence Exchange Data Flow (current — mock only)

```
lib/exchange/pulse-mock-data.ts     → tile summaries (12 technologies)
lib/exchange/pulse-brief-data.ts   → expanded brief content keyed by tile id
         ↓
WorldIntelligencePulse (expandedId state, one tile open)
         ↓
IntelligencePulseTileCard → IntelligencePulseBriefPanel
```

**Not connected to:** `lib/data/access.ts`, `lib/personalize.ts`, pipeline, visit snapshot.

### Living Intelligence Field Architecture

```
LivingIntelligenceField (React client)
  → IntelligenceFieldEngine (canvas RAF loop)
       ├─ resize listener
       ├─ visibilitychange pause
       ├─ node drift + neighbor connections
       └─ config hooks: getNodeIntensity, getRegionBias (future)
```

### Legacy Dashboard Architecture (still on `main` production)

```
app/dashboard/page.tsx (client)
  → IntelligenceFieldLayer (WebGL)
  → WhatChangedHero, StorySection, SignalCard, visit snapshot, guided tour, analytics
```

**This code still exists in git history on `main`.** Feature branch **replaced** the page entirely.

### Onboarding Architecture (unchanged)

**Phases:** `welcome` → `name` → `landing` → `profile` → `complete`

| Phase | Path(s) |
|---|---|
| welcome | `/onboarding/welcome` |
| name | `/onboarding/name` |
| landing | `/` |
| profile | `/onboarding/role`, `region`, `interests`, `tour` |
| complete | `/dashboard`, `/signals/*` |

Middleware allows `/dashboard` only when phase = `complete`. New dashboard page does not verify preferences are complete client-side.

### End-to-End Data Flow (pipeline — unchanged)

```
GitHub Actions (Monday 06:00 UTC) OR npm run pipeline:full
  → ingest (HN, arXiv, Wikimedia, GitHub, Product Hunt)
  → score → generate briefing JSON
  → sync-registry → verify → build → git push → Vercel deploy
  → lib/data/resolve-signals.ts
  → /signals/[id] (live) | /dashboard Exchange (mock, feature branch)
```

---

## 6. Current File Structure

```
HorizonIQ/
├── middleware.ts
├── FALLBACK_TIMELINE.md
├── SESSION_HANDOFF_V18.md          ← This file (canonical)
├── SESSION_HANDOFF_V17.md          ← Superseded
├── .cursor/rules/
│   ├── horizoniq.mdc
│   └── communication.mdc
├── .github/workflows/weekly-briefing.yml
├── supabase/schema/feedback.sql
├── docs/
│   ├── analytics/metrics.md
│   └── feedback/README.md
│
├── app/
│   ├── layout.tsx                  # Analytics, FeedbackWidget, cookie init, JsonLd
│   ├── page.tsx                    # Landing (WebGL IntelligenceFieldLayer)
│   ├── dashboard/page.tsx          # ★ Intelligence Exchange (feature branch)
│   ├── signals/[id]/page.tsx       # Signal detail (IntelligenceCard, WebGL field)
│   ├── api/feedback/route.ts
│   ├── (site)/                     # About, Contact, Privacy, Terms, Changelog, Roadmap
│   └── onboarding/                 # welcome, name, greeting, role, region, interests, tour
│
├── components/
│   ├── background/                 # ★ NEW (Epic 5)
│   │   └── living-intelligence-field.tsx
│   ├── exchange/                   # ★ NEW (Epic 4–6)
│   │   ├── exchange-header.tsx
│   │   ├── ticker-placeholder.tsx
│   │   ├── intelligence-hero.tsx
│   │   ├── featured-opportunity-card.tsx
│   │   ├── world-intelligence-pulse.tsx      # client — expansion state
│   │   ├── intelligence-pulse-tile.tsx       # client — expandable tile
│   │   ├── intelligence-pulse-brief.tsx      # expanded brief sections
│   │   ├── pulse-sparkline.tsx
│   │   └── hero-dot-grid.tsx                 # UNUSED — superseded by LivingIntelligenceField
│   ├── analytics/
│   ├── brand/
│   ├── feedback/
│   ├── intelligence/               # IntelligenceCard family (signal detail)
│   ├── intelligence-field/         # R3F Living Intelligence Core (landing, signals)
│   ├── layout/                     # top-bar, site-footer, site-nav
│   ├── landing/
│   ├── dashboard/                  # LEGACY — WhatChangedHero, SignalCard, etc.
│   ├── onboarding/                 # welcome-screen (LOCKED)
│   └── ui/
│
├── hooks/
│   ├── useFeedback.ts
│   ├── use-intelligence-field-params.ts   # R3F field (not used on new dashboard)
│   └── use-reduced-motion.ts              # Used by LivingIntelligenceField + pulse tiles
│
├── lib/
│   ├── background/                 # ★ NEW (Epic 5)
│   │   └── intelligence-field-engine.ts
│   ├── exchange/                   # ★ NEW (Epic 4–6)
│   │   ├── pulse-mock-data.ts
│   │   └── pulse-brief-data.ts
│   ├── analytics/
│   ├── feedback/
│   ├── data/                       # catalog, briefings, access, resolve-signals
│   ├── pipeline/
│   ├── identity/
│   ├── intelligence.ts
│   ├── intelligence-field/         # R3F shaders + params
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts, trust.ts
│   └── onboarding-*.ts
│
├── data/
│   ├── meta.json                   # 2026-W28
│   ├── catalog/signals.json
│   ├── briefings/2026-W26|W27|W28.json
│   └── skills.json, jobs.json, recommendations.json
│
└── VISION.md, PROJECT_MEMORY.md, PROJECT_DECISIONS.md, ROADMAP.md, CHANGELOG.md
```

**Deleted during Epic 4 (feature branch):** `live-intelligence-market.tsx`, `intelligence-market-row.tsx`, `intelligence-market-card.tsx`, `lib/exchange/market-mock-data.ts`

---

## 7. UI Decisions

### Design Principles (unchanged)

1. Simplicity → Clarity → Performance → Scalability → Accessibility  
2. Intelligence must be beautiful; every element communicates meaning  
3. Animation supports comprehension — never decoration at the cost of reading  
4. Dark-first premium aesthetic — no cyberpunk, neon overload, crypto dashboards  

### Intelligence Exchange — Locked Decisions (feature branch)

| Element | Decision |
|---|---|
| **Page name** | Intelligence Exchange (not "Dashboard" in UX copy) |
| **Header** | `ExchangeHeader` — separate from marketing `TopBar`; static region/notifications/avatar |
| **Ticker** | `TickerPlaceholder` — full-width, static scroll items |
| **Hero** | Phase 1 locked layout — do not redesign without approval |
| **Pulse section** | World Intelligence Pulse — editorial tiles, NOT tables |
| **Tile hierarchy** | 1 hero + 3 featured + 8 compact |
| **Tile content** | Editorial headlines (≤10 words), supporting (≤20 words), momentum `N ▲ +Δ` |
| **Expansion** | In-place Intelligence Brief — no modal, no routing, one open at a time |
| **Background** | `LivingIntelligenceField` canvas — not R3F on dashboard |
| **Max content width** | 1500px centered (hero + pulse) |
| **Inspiration** | Apple News · Financial Times Weekend · The Economist — NOT TradingView |

### Welcome Screen — LOCKED (Product Owner)

Route: `/onboarding/welcome` — **Do not change without approval.**  
CTA: **Enter** only (bold). See V17 for full spec.

### Global Chrome

| Surface | Components |
|---|---|
| Landing / Signal detail | `TopBar` + `SiteFooter` + `FeedbackWidget` |
| Intelligence Exchange | `ExchangeHeader` + `SiteFooter` + `FeedbackWidget` |
| Site pages | `TopBar showNav` + `SiteFooter` |

### Legacy Dashboard IA (still on `main` production)

Story: What changed → Why it matters → What to do  
Components: `WhatChangedHero`, `StorySection`, `DisclosurePanel`, `SignalCard`

### Signal Detail (unchanged)

`/signals/[id]` — full `IntelligenceCard` analyst layout, WebGL ambient field, `TopBar`.

---

## 8. Data Strategy

### Platform Data (unchanged — live)

- **Catalog:** `data/catalog/signals.json`
- **Weekly briefing:** `data/briefings/{period}.json`
- **Active:** `2026-W28` per `data/meta.json`
- **Access:** `lib/data/access.ts` → `lib/personalize.ts`
- **Five sources:** HN, arXiv, Wikimedia, GitHub, Product Hunt

### Intelligence Exchange Data (feature branch — mock)

| File | Contents |
|---|---|
| `lib/exchange/pulse-mock-data.ts` | 12 tile summaries: headline, momentum, sparkline points, tier, evidence counts |
| `lib/exchange/pulse-brief-data.ts` | Expanded briefs: whyItMatters, evidence %, drivers, relatedSignals, forecast paragraph |

**Hero featured card** uses hardcoded Agentic AI metrics in `featured-opportunity-card.tsx`.

**Ticker** uses static `DEFAULT_ITEMS` in `ticker-placeholder.tsx`.

### Personalization (not wired to Exchange yet)

- Role, region, Intelligence Focus Areas from `lib/preferences.tsx`
- Visit snapshot: `horizoniq-visit-snapshot` — legacy dashboard only

### Pipeline Commands

```bash
npm run pipeline:ingest
npm run pipeline:generate
npm run pipeline:full
npm run pipeline:sync-registry
npm run pipeline:verify
```

---

## 9. Trust Strategy

### Implemented (platform)

- Honest provenance on signal detail — Live / Mixed / Sample
- `IntelligenceCard` seven-section contract with evidence + sources
- Legal pages, footer trust badges
- Feedback privacy — optional email, anonymous IDs

### Intelligence Exchange Trust Gaps (feature branch)

| Gap | Risk |
|---|---|
| All pulse/hero data is **mock** | Must label before production merge |
| Evidence stats in briefs are **fabricated percentages** | Need pipeline-backed numbers or clear "illustrative" label |
| "18 sec ago" timestamps are static | Need honest freshness from briefing |
| Read Full Brief → does nothing | User expectation mismatch until wired |

### Trust Principles (locked)

- Label mock vs live explicitly
- Show reasoning, not just scores
- Never overclaim beyond pipeline data
- Users should trust HorizonIQ without reading documentation

---

## 10. Retention Strategy

### North Star (unchanged)

Users return because **something changed for them**.

### Legacy retention mechanics (on `main`, not on Exchange branch)

- Visit snapshot + "What Changed Since Your Last Visit"
- Story hero: changed → matters → action
- Signal buckets: New · Rising · Falling
- Guided tour on first visit
- Analytics: `return_visit`, `change_hero_viewed`, `signal_opened`

### Intelligence Exchange retention opportunity (not yet built)

- **Progressive disclosure** — brief expansion keeps users on page (Epic 6 Phase 1 ✅ interaction, mock content)
- **Editorial front page** — collectible tiles encourage exploration
- **Related Signals chips** — future cross-tile navigation
- **Wire to real weekly delta** — tiles should reflect briefing changes

### Retention Gaps

- New dashboard has **no visit snapshot**, **no change hero**, **no analytics**
- localStorage only — device-bound
- No email digest (Phase 2)
- Week 2 return funnels not built

---

## 11. Known Issues

### Critical (feature branch — before merge)

| Issue | Severity | Notes |
|---|---|---|
| Dashboard page has **no onboarding/preferences guard** | **High** | Server component; users with incomplete prefs may see Exchange |
| Dashboard **analytics not firing** | **High** | No `dashboard_loaded`, no `return_visit` |
| **All Exchange data is mock** | **High** | Must wire or label before production |
| **Guided tour broken** on new dashboard | **High** | No `data-tour` attributes; tour targets legacy layout |
| **Visit snapshot not saved** from new dashboard | **Medium** | Retention layer disconnected |
| **Dual Living Intelligence implementations** | **Medium** | R3F on landing/signals; Canvas on dashboard — intentional but document for engineers |
| `hero-dot-grid.tsx` orphaned | **Low** | Delete or repurpose |

### Open / Monitor (platform — from V17)

| Issue | Severity | Notes |
|---|---|---|
| Guided tour step 4 spotlight (legacy) | Medium | `recommended-actions` target |
| WebGL canvas remounts on navigation | Medium | Landing ↔ signals |
| Product Hunt HTTP 429 in CI | Medium |
| Light mode less refined than dark | Low |
| Vercel Analytics lag | Info | 15–60 min |

### What NOT To Do

- Do not merge Exchange to `main` without onboarding + analytics restoration plan
- Do not present mock Exchange data as live without labeling
- Do not use R3F for dashboard background (Epic 5 decision: Canvas 2D)
- Do not redesign Hero without product owner approval
- Do not change welcome screen without approval
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Do not import analytics SDKs in UI components — use `track()`

---

## 12. Next 5 Tasks (Priority Order)

### 1. Restore dashboard production readiness before merge

Re-add onboarding guard (`usePreferences`, identity check, redirect) and analytics (`dashboard_loaded`, new `brief_expanded` events) to `app/dashboard/page.tsx` **without redesigning Exchange UI**.

**Done when:** Incomplete onboarding redirects; analytics events fire on dashboard load and tile expand.

### 2. Wire Intelligence Exchange to live briefing data

Connect pulse tiles + hero featured card to `lib/personalize.ts` / active briefing. Replace mock IDs with catalog signals where possible. Label anything still illustrative.

**Done when:** At least top 12 signals come from `data/` layer; provenance visible.

### 3. Wire Read Full Brief → signal detail

`Read Full Brief →` navigates to `/signals/[id]` with `track("signal_opened", { source: "pulse_brief" })`.

**Done when:** Every expanded brief CTA opens the matching signal page.

### 4. Commit, review, and merge `feature/intelligence-exchange-ui`

Product owner review of Intelligence Exchange on preview URL. Merge to `main`, deploy Vercel production.

**Done when:** Production dashboard shows Intelligence Exchange; fallback documented.

### 5. Epic 5 Phase 2 — data-reactive Living Intelligence Field

Wire `getNodeIntensity` in `IntelligenceFieldEngine` to expanded tile or top momentum signals. Subtle brightness pulse on active technology — no spectacle.

**Done when:** Field visibly responds when a pulse tile is expanded; reduced-motion still freezes.

---

## 13. Quick Start for Next Session

```powershell
cd C:\HorizonIQ
git checkout feature/intelligence-exchange-ui   # or main for production state
git status
npm install
npm run dev:clean
```

**Verify:**

```powershell
npx tsx scripts/test-onboarding-state.ts
npm run pipeline:verify
npm run build
```

**Smoke test (feature branch):**

1. Complete onboarding → `/dashboard`
2. Confirm: ExchangeHeader, ticker, Hero, pulse tiles, canvas field, footer
3. Click a pulse tile → Intelligence Brief expands in place
4. Confirm only one tile open at a time
5. Feedback FAB still works

**Smoke test (production `main`):**

1. Dashboard still shows legacy change-first layout until merge
2. Signal detail `/signals/[id]` still works with IntelligenceCard

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision |
| `PROJECT_MEMORY.md` | Living product spec (may lag Exchange work — update after merge) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history (Exchange not yet logged) |
| `docs/analytics/metrics.md` | Analytics event definitions |
| `docs/feedback/README.md` | Feedback setup |
| `FALLBACK_TIMELINE.md` | Rollback reference |
| `.cursor/rules/communication.mdc` | Product owner communication |

---

## 15. Strategic Context (Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| Intelligence analyst, not trend aggregator | Locked |
| **Intelligence Exchange as new dashboard experience** | **In progress (feature branch)** |
| **Progressive disclosure via Intelligence Brief** | **Shipped locally (Epic 6 P1)** |
| **Canvas Living Intelligence Field on dashboard** | **Shipped locally (Epic 5 P1)** |
| **R3F Living Intelligence Core on landing/signals** | Locked (unchanged) |
| Dark-first premium visual system | Locked |
| Horizon white + IQ `#00c5ff` wordmark | Locked |
| No auth for MVP | Locked |
| Five pipeline sources | Locked |
| Welcome screen locked — CTA **Enter** only | Locked |
| Cookie + middleware onboarding (`hziq_ob_v3`) | Locked |
| Analytics via `track()` only | Locked |
| Feedback via Supabase service role | Locked |
| Simple communication with product owner | Locked |

---

*End of Session Handoff V18*

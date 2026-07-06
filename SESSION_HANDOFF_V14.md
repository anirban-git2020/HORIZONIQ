# HorizonIQ — Session Handoff V14

**Last updated:** 2026-07-06  
**Version:** MVP V1.1 (Change-First) + Sprint 4A Analytics  
**Status:** Active Development — production analytics shipped; weekly pipeline deploy hardened  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V13.md`, `SESSION_HANDOFF_V12.md`, and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `docs/analytics/metrics.md` → `CHANGELOG.md` → `.cursorrules`

**Known-good fallback (pre auto-repair):** `FALLBACK_TIMELINE.md` — tag `fallback/2026-06-28-v1.1-stable` at `aab7e55`. Use only if onboarding auto-repair (`668d31e`+) introduces regressions.

---

## Repo State (2026-07-06)

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Through `a2d38de` — Sprints 1–3C, live pipeline, intelligence layer, cookie+middleware onboarding, auto-repair, **Sprint 4A analytics**, **pipeline deploy hardening** |
| **Production briefing** | `2026-W28` — Week of July 6, 2026 – July 12, 2026 |
| **Local uncommitted** | `SESSION_WORKLOG_2026-07-06.md` (optional worklog; not required for builds) |

**Recent commits (most recent first):**

```
a2d38de feat(analytics): Sprint 4A product analytics and Vercel Web Analytics
f344a10 fix(pipeline): ensure weekly briefing deploys to Vercel
9c06d06 chore(pipeline): weekly briefing (W28 data)
d72399c fix(pipeline): roll weekly briefing to W27 and repair Monday auto-refresh
fb6e433 docs: add SESSION_HANDOFF_V12 for zero-context onboarding handoff
```

**⚠️ Product owner context:** Normal browsers previously landed mid-onboarding because stale `hziq_ob_v3=profile` cookies were never reconciled against localStorage. Auto-repair (`668d31e`+) fixes this on every page load. Do not change welcome screen design without explicit approval.

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Sprint 3C elevation:** HorizonIQ is a **Personal Intelligence Operating System** — not a dashboard. The signature visual is the **Living Intelligence Core**: an abstract, data-reactive intelligence field (wireframe mesh + sparse particles — not a globe, brain, or neural-network cliché).

**Core product principle:**

> Users do not return for signals. Users return for **changes in signals**.

**Intelligence positioning (Sprint 2.5A):**

> HorizonIQ must behave like an **intelligence analyst**, not a trend aggregator.

**Experience goals:**

- Feel like *"Your personal future analyst who tells you what changed."*
- Users should **pause** on arrival — intelligence, confidence, discovery
- UI feels **alive** without becoming distracting or unreadable
- Text must remain legible over all visual effects
- Personalization is visible: **name**, role, region, Intelligence Focus Areas
- Premium, calm, trustworthy — Apple · Linear · Stripe · Bloomberg quality
- Onboarding must **self-heal** in normal browsers without DevTools or incognito
- Product is now **measurable** in production (Sprint 4A) without changing UX

**Target users:** Student · Professional · Entrepreneur · Investor

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP) · dashboard overload · AI hype language

**Feature retention filter (every new feature):**

> Does this give the user a reason to come back next week?

**IA goal (Sprint 3A):** User understands the dashboard in **under 15 seconds** via one story: What changed → Why it matters → What to do.

---

## 2. MVP Definition

**Version:** MVP V1.1 (Change-First)  
**Objective:** Validate that users **return weekly** when intelligence shows personalized change.

### What MVP Must Deliver

1. **Change-first intelligence** — every signal shows what changed, why, why it matters to *this* user, and what to do
2. **Personalized onboarding** — Welcome → Name → Landing → role × region × Intelligence Focus Areas within 60 seconds (quick-start path on region page)
3. **Weekly briefing cadence** — catalog + live pipeline data, refreshed Mondays 06:00 UTC
4. **Return-visit delta** — "What Changed Since Your Last Visit" via localStorage visit snapshot (no login)
5. **Trust without documentation** — labeled sources, provenance, confidence in plain English
6. **Premium first impression** — welcome, name, personalized landing, guided tour option
7. **Reliable onboarding routing** — cookie + middleware authority, auto-repair stale state, full-page navigation across phases
8. **Product analytics** — anonymous visitor/session tracking + typed events (Sprint 4A)

### MVP Success Metrics

| Metric | Target |
|---|---|
| Week 2 return rate | Primary validation metric |
| Change hero engagement | User reads "What Changed" |
| Signal detail from change | Depth driven by change layer |
| Time to first actionable insight | < 60 seconds |
| 15-second dashboard comprehension | Sprint 3A IA goal |
| Onboarding completion (no stuck states) | Full flow on Vercel in normal browser |

### Explicitly Out of MVP

- User accounts / login
- Relationship graphs
- Community / discussion
- AI chatbot homepage
- Email digest (Phase 2)
- Additional data sources beyond locked five
- LLM summarization in pipeline
- Analytics admin UI

### Non-Negotiables

- No login required for MVP
- No fake data without labels
- No dashboard overload
- Every screen reinforces: what changed, why it matters, what to do
- **Do not restore `app/template.tsx` opacity page transitions** — caused invisible pages on client navigation
- **Do not change welcome screen layout/copy** without product owner approval
- **Do not use `router.push` for cross-phase onboarding navigation** — use `navigateOnboarding()`
- **Do not blind-sync cookie phase from localStorage** — caused skip-ahead bugs; use `reconcileOnboardingState()` instead
- **UI calls `track()` only** — never import provider SDKs directly in components

---

## 3. Completed Features

### Deployment & Infrastructure

- [x] Vercel production — `https://horizoniq-beta.vercel.app/`
- [x] GitHub Actions weekly pipeline — Monday 06:00 UTC (`.github/workflows/weekly-briefing.yml`)
- [x] Pipeline CI hardened — `pipeline:sync-registry`, `pipeline:verify`, `npm run build` before git push (`f344a10`)
- [x] Explicit `git add data/ lib/data/briefings-registry.ts` in CI (fixes registry-not-committed deploy failures)
- [x] Removed `[skip ci]` from pipeline commits so Vercel always redeploys on new briefing data
- [x] `GITHUB_TOKEN` in CI for GitHub source ingest

### Sprint 4A — Product Analytics (2026-07-06)

- [x] **Vercel Web Analytics** — `<Analytics />` in `app/layout.tsx` (`@vercel/analytics/react`)
- [x] **Vercel Speed Insights** — `<SpeedInsights />` in `app/layout.tsx` (`@vercel/speed-insights/next`)
- [x] **Microsoft Clarity** — lazy-loaded in production when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set
- [x] **Provider-agnostic abstraction** — `lib/analytics/analytics.ts`; UI calls `track()` only
- [x] **Anonymous visitor ID** — UUID in `horizoniq.analytics.visitor-id.v1`
- [x] **Session tracking** — `horizoniq.analytics.session.v1` + archive `horizoniq.analytics.sessions.v1`
- [x] **Typed Sprint 4A events** — `lib/analytics/events.ts`
- [x] **AnalyticsProvider** — `components/analytics/analytics-provider.tsx` (bootstrap, `app_opened`, provider init)
- [x] **Optional PostHog sink** — `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`
- [x] **Metrics documentation** — `docs/analytics/metrics.md`
- [x] **localStorage event buffer** — for future backend sync / debugging

**Events instrumented today:**

`app_opened`, `role_selected`, `region_selected`, `interest_selected`, `onboarding_completed`, `guided_tour_started`, `guided_tour_skipped`, `guided_tour_completed`, `dashboard_loaded`, `return_visit`, `change_hero_viewed`, `signal_opened`, `briefing_expanded`, `cta_clicked`

**Events defined but not wired (no UI yet):**

`search_executed`, `recommendation_opened`, `forecast_opened`, `footer_link_clicked`

### Intelligence & Dashboard (Sprints 2.5, 2.5A, 3A)

- [x] `IntelligenceCard` — seven-section analyst contract on signal detail
- [x] `lib/intelligence.ts` — reasoning, outlook, confidence tiers
- [x] Story-driven dashboard: What changed → Why it matters → What to do
- [x] `WhatChangedHero`, `StorySection`, `DashboardContextBar`, `DisclosurePanel`
- [x] Visit snapshot — return-visit diff (`horizoniq-visit-snapshot`)
- [x] Signal detail at `/signals/[id]`
- [x] Clickable source URLs — pipeline `url` + `resolveSourceUrl()`

### Visual & Immersive (Sprints 3B, 3C)

- [x] Dark-first premium palette, Outfit + Inter typography
- [x] `BetaBadge`, `TaglineLockup`, `lib/motion.ts`
- [x] Living Intelligence Core — R3F + GLSL on landing, dashboard, signal detail
- [x] CSS fallback + `prefers-reduced-motion` support
- [x] React 19.2.7 + `@react-three/fiber` 9.5.0 + Three.js 0.185

### Live Data Pipeline

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full` | `pipeline:sync-registry` | `pipeline:verify`
- [x] Catalog + briefing architecture
- [x] Briefings on disk: `2026-W26.json`, `2026-W27.json`, `2026-W28.json`
- [x] Week rollover fix in `loadPreviousBriefing()` (`d72399c`)
- [x] Registry auto-sync script (`scripts/sync-briefings-registry.ts`)

### Onboarding (Sprint 1 + routing rebuild + auto-repair)

- [x] `WelcomeScreen` — approved design at `/onboarding/welcome` (CSS intelligence field, not WebGL)
- [x] Name capture — `/onboarding/name`
- [x] Personalized landing — salutation on `/` when phase = `landing`
- [x] Profile steps — role, region, interests (14 Intelligence Focus Areas)
- [x] Tour choice — `/onboarding/tour` (guided vs solo)
- [x] Guided tour overlay — 4-step portal-based spotlight tour
- [x] Quick-start on region page — skips interests with role defaults
- [x] Display name on dashboard — time-of-day salutation (return visits)
- [x] **Cookie + middleware onboarding** — `hziq_ob_v3` phase cookie, `middleware.ts` enforces linear flow
- [x] **Full-page phase navigation** — `lib/onboarding-nav.ts` → `navigateOnboarding()` (not `router.push`)
- [x] **Onboarding auto-repair** — `lib/onboarding-reconcile.ts` reconciles cookie vs localStorage on every load
- [x] Inline reconcile script — runs before React; redirects if URL invalid for repaired phase
- [x] `OnboardingBootstrap` — React fallback reconcile + redirect
- [x] **Start fresh** link — mid-onboarding escape hatch (`components/onboarding/start-fresh-link.tsx`)
- [x] Start over — full reset on dashboard via `clearAllHorizonIQClientState()`
- [x] Unit tests — `scripts/test-onboarding-state.ts` (phase + reconcile scenarios)
- [x] Schema version tracking — `horizoniq.onboarding.schemaVersion` = `4`

### Navigation Stabilization

- [x] Removed `app/template.tsx` — fixed blank/invisible client navigations
- [x] `ScrollToTop` in root layout
- [x] `PageLoader` — visible loading during redirects
- [x] `OnboardingBootstrap` — client init after inline cookie script

### Documentation & Rollback

- [x] `FALLBACK_TIMELINE.md` — restore point at `aab7e55` (tag `fallback/2026-06-28-v1.1-stable`)
- [x] `SESSION_HANDOFF_V13.md` — Sprint 4A analytics snapshot (superseded by this file)
- [x] `CHANGELOG.md`, `PROJECT_MEMORY.md`, `PROJECT_DECISIONS.md`, `ROADMAP.md` updated for Sprint 4A

---

## 4. Pending Features

### 🟡 Product Owner Verification (Normal Browser)

- [ ] Confirm stale `hziq_ob_v3=profile` cookie self-heals to Welcome without DevTools
- [ ] Confirm legitimately complete users still reach dashboard (not reset to Welcome)
- [ ] Full flow walkthrough in normal browser on current production (`a2d38de`)

### Analytics & Measurement (Sprint 4A follow-through)

- [ ] Add `NEXT_PUBLIC_CLARITY_PROJECT_ID` to Vercel Production env and verify session replay
- [ ] Verify Vercel Web Analytics in production (Network tab → `va.vercel-scripts.com`; dashboard lags 15–60 min)
- [ ] PostHog funnels — Week 2 return, onboarding path, tour completion
- [ ] Wire deferred events when UI exists: `search_executed`, `recommendation_opened`, `forecast_opened`, `footer_link_clicked`
- [ ] Trust interaction analytics (source clicks, evidence expand)
- [ ] Backend session/event sync (deferred)
- [ ] Analytics admin UI (deferred)

### Sprint 3C Stabilization

- [ ] Single shared WebGL canvas across route changes
- [ ] GPU tier detection — auto particle budget
- [ ] WebGL load skeleton
- [ ] Onboarding field continuity on role/region/interests steps

### Guided Tour

- [ ] Return-visit tour step variants (steps 2–3 target first-visit-only elements)
- [ ] Fix step 4 spotlight (`recommended-actions`) after scroll from watchlist steps

### Architecture Cleanup

- [ ] Simplify redundant client-side `useEffect` redirects where middleware already enforces phase
- [ ] Reduce race conditions and loader flashes between middleware + inline script + bootstrap

### Data & Content

- [ ] Broader catalog coverage (arts, commerce, biochemistry)
- [ ] Product Hunt HTTP 429 hardening in CI
- [ ] More region-specific explanation variants in catalog
- [ ] Step progress label polish: "Interests" → Intelligence Focus Areas

### Documentation

- [ ] Consider new fallback tag post pipeline hardening if production proves stable over multiple Mondays
- [ ] Commit `SESSION_WORKLOG_2026-07-06.md` if product owner wants it in repo

### Post-MVP (Phase 2+)

- [ ] Email weekly digest
- [ ] User accounts
- [ ] Relationship graphs (Living Intelligence Network)
- [ ] Additional pipeline data sources

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
| Motion | Framer Motion + `lib/motion.ts` |
| 3D | Three.js 0.185 + @react-three/fiber 9.5 + GLSL |
| Analytics | `lib/analytics/` abstraction + Vercel Analytics + Speed Insights + optional PostHog + Clarity |
| Routing guard | **Next.js `middleware.ts`** + phase cookie |
| State repair | **`lib/onboarding-reconcile.ts`** — cookie vs localStorage |
| Client state | Cookie (routing) + localStorage (data + analytics) |
| Navigation | **`lib/onboarding-nav.ts`** — full-page `window.location.assign` |
| Pipeline | tsx + dotenv |
| CI | GitHub Actions (Node 24) |
| Hosting | Vercel |
| Not in use | Supabase, database, auth, `@react-three/drei`, `app/template.tsx` |

### Analytics Architecture (Sprint 4A)

```
UI / pages / components
    ↓ track(eventName, props)  — never import @vercel/analytics or posthog-js in UI
lib/analytics/analytics.ts
    ├─ enrich with visitorId + sessionId
    ├─ localStorage event buffer (horizoniq.analytics.events.v1)
    └─ provider sinks (lib/analytics/providers.ts)
         ├─ Vercel Analytics (custom events via track())
         ├─ PostHog (optional, NEXT_PUBLIC_POSTHOG_KEY)
         └─ Clarity (session replay, production lazy load)
```

**Bootstrap flow:**

1. `AnalyticsProvider` mounts in `app/layout.tsx` (client component)
2. Ensures visitor ID (`lib/analytics/visitor.ts`) and session (`lib/analytics/session.ts`)
3. Fires `app_opened` once per session
4. Initializes provider sinks

**Privacy (locked):**

- No emails, passwords, or search query text in events
- Anonymous UUID only — no authentication
- Clarity loads only in production when env var is set

### Onboarding Architecture (Critical)

**Routing authority:** `hziq_ob_v3` cookie (`lib/onboarding-phase.ts` → `ONBOARDING_COOKIE_NAME`)

**Phases (strict linear order):**

| Phase | Cookie value | Required path | Set by |
|---|---|---|---|
| Welcome | `welcome` | `/onboarding/welcome` | Default (no cookie) / Start over / Start fresh |
| Name | `name` | `/onboarding/name` | `identityService.markWelcomeComplete()` |
| Landing | `landing` | `/` | `advanceOnboardingPhase("landing")` on name continue |
| Profile | `profile` | `/onboarding/role` (+ region, interests, tour) | `identityService.markGreetingComplete()` on landing CTA |
| Complete | `complete` | `/dashboard` (+ `/`, `/signals/*`) | `advanceOnboardingPhase("complete")` on tour → dashboard |

**Four layers (do not conflate):**

1. **`middleware.ts`** — Server-side. Runs before page load. Reads cookie. Redirects if path not allowed for phase. Unknown/missing cookie → `welcome`. Legacy cookies (`horizoniq_phase_v2`, etc.) are **not** read by middleware.
2. **Inline `<script>` in `app/layout.tsx`** — `ONBOARDING_COOKIE_INIT_SCRIPT` from `onboarding-cookie-init.tsx`. Runs **before React on every load**. Reconciles cookie with localStorage. Redirects via `window.location.replace()` if repaired phase disallows current path. **No early return when cookie exists.**
3. **`OnboardingBootstrap`** — React fallback. Calls `bootstrapOnboardingState()` → `reconcileOnboardingState()`. Redirects via `navigateOnboarding()` if needed.
4. **Page actions** — User completes steps; cookie advanced via `advanceOnboardingPhase()` or identity service. Cross-phase navigation uses `navigateOnboarding()`, not `router.push`.

**Reconciliation layer (`lib/onboarding-reconcile.ts`):**

```
Every page load:
  1. Clear legacy cookies + storage keys
  2. Read cookie phase + onboarding record + preferences
  3. Validate identity chain (welcome → name → landing → profile ordering)
  4. Derive canonical phase from storage (never skip ahead)
  5. Compare cookie vs canonical:
     - Cookie ahead of storage → rewind cookie + wipe impossible downstream flags
     - Cookie behind + storage complete → advance to complete (returning user)
     - Cookie complete + empty/corrupt storage → reset to welcome
  6. Write repaired record, cookie, schema version (4)
  7. Redirect if current pathname invalid for canonical phase
```

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
npm run pipeline:sync-registry   → lib/data/briefings-registry.ts
        ↓
npm run pipeline:verify          → registry matches meta.json
        ↓
npm run build                    → CI gate before git push
        ↓
git commit + push                → Vercel auto-deploy
        ↓
lib/data/resolve-signals.ts      → catalog + briefing → SignalRecord[]
        ↓
lib/data/access.ts + lib/personalize.ts + lib/intelligence.ts
        ↓
app/dashboard, app/signals/[id]
        ↓
lib/visit-snapshot.ts            → return-visit diff (localStorage)
```

### Weekly Pipeline CI Flow (Hardened — `f344a10`)

```
cron: Monday 06:00 UTC (or workflow_dispatch)
  → npm run pipeline:full
  → npm run pipeline:sync-registry
  → npm run pipeline:verify
  → npm run build                    ← catches missing registry entries
  → git add data/ lib/data/briefings-registry.ts
  → commit "chore(pipeline): weekly briefing"
  → git push                         ← triggers Vercel deploy (no [skip ci])
```

**Past failure modes (now fixed):**

| Failure | Cause | Fix |
|---|---|---|
| W27 data committed but production stuck on W26 | Pipeline commit had `[skip ci]` | Removed skip ci (`d72399c`) |
| W28 pipeline ran but Vercel build ERROR | `briefings-registry.ts` not committed by broken `file_pattern` in CI | Explicit `git add` + sync-registry + build verify (`f344a10`) |
| Wrong prior-week briefing loaded | Week rollover bug in `loadPreviousBriefing()` | Fixed in `lib/pipeline/generate/briefing.ts` + `periods.ts` (`d72399c`) |

### Intelligence Field Flow (Sprint 3C)

```
Preferences + Signals (optional)
        ↓
hooks/use-intelligence-field-params.ts
        ↓
lib/intelligence-field/params.ts
        ↓
components/intelligence-field/intelligence-field-layer.tsx
        ├─ css  → intelligence-field-fallback.tsx
        └─ webgl → living-intelligence-core.tsx (mesh + particles)
```

### Approved First-Time Flow (Product Owner — Lock This In)

```
① /onboarding/welcome     Welcome to HorizonIQ + tagline + Enter HorizonIQ
② /onboarding/name          "What should we call you?"
③ / (landing page)          Personalized salutation + "See what is changing…"
④ Build my dashboard CTA    → /onboarding/role
⑤ role → region → [interests] → /onboarding/tour
⑥ /dashboard (+ guided tour if user chose "guided")
```

**`/onboarding/greeting`** — legacy URL; redirects via `getFirstTimeOnboardingPath()`. Greeting content lives on landing page during `landing` phase.

### Module Map (Key Files)

| Area | Key paths |
|---|---|
| **Onboarding routing** | `middleware.ts`, `lib/onboarding-phase.ts`, `lib/onboarding-reconcile.ts`, `lib/onboarding-nav.ts` |
| **Onboarding UI** | `components/onboarding/welcome-screen.tsx` (locked), `guided-tour-overlay.tsx` |
| **Analytics** | `lib/analytics/*`, `components/analytics/analytics-provider.tsx`, `docs/analytics/metrics.md` |
| **Data access** | `lib/data/access.ts`, `resolve-signals.ts`, `briefings-registry.ts` |
| **Pipeline** | `lib/pipeline/*`, `scripts/pipeline-*.ts`, `.github/workflows/weekly-briefing.yml` |
| **Intelligence** | `lib/intelligence.ts`, `components/intelligence/intelligence-card.tsx` |
| **Dashboard** | `app/dashboard/page.tsx`, `components/dashboard/what-changed-hero.tsx` |
| **3D field** | `components/intelligence-field/*`, `lib/intelligence-field/*` |

---

## 6. Current File Structure

```
HorizonIQ/
├── middleware.ts                         # ONBOARDING ROUTING GUARD (server)
├── FALLBACK_TIMELINE.md                  # Rollback reference (aab7e55)
├── SESSION_HANDOFF_V14.md                # This file (canonical handoff)
├── SESSION_HANDOFF_V13.md                # Superseded — Sprint 4A snapshot
├── SESSION_HANDOFF_V12.md                # Superseded — pre-analytics full handoff
├── SESSION_WORKLOG_2026-07-06.md          # Optional local worklog (untracked)
├── .github/workflows/weekly-briefing.yml # Monday 06:00 UTC + build verify
├── .npmrc                                # legacy-peer-deps=true
├── next.config.mjs                       # R3F transpile + React dedupe
├── start-dev.bat
│
├── app/
│   ├── layout.tsx                        # Cookie init + Analytics + SpeedInsights + AnalyticsProvider
│   ├── page.tsx                          # Landing (phase: landing)
│   ├── globals.css
│   ├── dashboard/page.tsx
│   ├── onboarding/
│   │   ├── layout.tsx
│   │   ├── welcome/page.tsx
│   │   ├── name/page.tsx
│   │   ├── greeting/page.tsx             # Legacy redirect
│   │   ├── role/page.tsx
│   │   ├── region/page.tsx
│   │   ├── interests/page.tsx
│   │   └── tour/page.tsx
│   └── signals/[id]/page.tsx
│
├── components/
│   ├── analytics/
│   │   └── analytics-provider.tsx        # Visitor/session bootstrap + app_opened
│   ├── brand/                            # logo, beta-badge, tagline-lockup
│   ├── intelligence/                     # IntelligenceCard family
│   ├── intelligence-field/               # Living Intelligence Core (3C)
│   ├── landing/
│   │   ├── landing-hero.tsx
│   │   ├── landing-entry-guard.tsx       # Passthrough (middleware handles)
│   │   ├── data-trust-panel.tsx, landing-pillars.tsx, why-horizoniq.tsx
│   ├── navigation/scroll-to-top.tsx
│   ├── onboarding/
│   │   ├── welcome-screen.tsx            # APPROVED DESIGN — do not change
│   │   ├── onboarding-start-link.tsx
│   │   ├── onboarding-bootstrap.tsx
│   │   ├── onboarding-cookie-init.tsx    # Inline reconcile (every load)
│   │   ├── start-fresh-link.tsx          # Mid-onboarding escape hatch
│   │   ├── guided-tour-overlay.tsx
│   │   ├── first-time-shell.tsx, onboarding-shell.tsx, option-card.tsx
│   ├── dashboard/                        # what-changed-hero, signal-card, etc.
│   ├── layout/top-bar.tsx
│   ├── motion/fade-in.tsx
│   ├── theme/, ui/page-loader.tsx
│   └── trust/provenance-badge.tsx
│
├── docs/
│   └── analytics/metrics.md              # Sprint 4A metric definitions
│
├── hooks/
│   ├── use-intelligence-field-params.ts
│   ├── use-reduced-motion.ts
│   └── use-require-identity-onboarding.ts
│
├── lib/
│   ├── analytics/
│   │   ├── analytics.ts                  # Core track() + sinks
│   │   ├── events.ts                     # Typed event taxonomy
│   │   ├── types.ts, visitor.ts, session.ts
│   │   ├── providers.ts, clarity.ts, posthog.ts
│   │   ├── index.ts, use-track-on-visible.ts
│   ├── onboarding-phase.ts               # Phase enum, paths, cookie name
│   ├── onboarding-cookie.ts              # Cookie helpers
│   ├── onboarding-state.ts               # Storage + bootstrap + wipe
│   ├── onboarding-reconcile.ts           # Auto-repair layer
│   ├── onboarding-nav.ts                 # Full-page phase navigation
│   ├── onboarding-flow.ts                # Public onboarding API
│   ├── onboarding-bootstrap.ts           # Re-exports clear/bootstrap
│   ├── identity/                         # LocalIdentityService, greeting.ts, repair.ts
│   ├── data/
│   │   ├── access.ts, resolve-signals.ts, schemas.ts
│   │   └── briefings-registry.ts         # Auto-synced; must match briefings on disk
│   ├── pipeline/                         # ingest, score, generate, store, utils
│   ├── intelligence-field/, intelligence.ts
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts
│   ├── trust.ts, types.ts, options.ts, copy.ts, motion.ts
│
├── data/
│   ├── meta.json                         # activeBriefing: 2026-W28
│   ├── catalog/signals.json
│   ├── briefings/
│   │   ├── 2026-W26.json
│   │   ├── 2026-W27.json
│   │   └── 2026-W28.json                 # Current production week
│   ├── pipeline/, skills.json, jobs.json, recommendations.json
│
├── scripts/
│   ├── pipeline-ingest.ts, pipeline-generate.ts, pipeline-full.ts
│   ├── sync-briefings-registry.ts        # Regenerates briefings-registry.ts
│   ├── verify-briefing.ts                # Validates meta + registry + files
│   └── test-onboarding-state.ts          # Phase + reconcile unit tests
│
├── VISION.md, PROJECT_MEMORY.md, PROJECT_DECISIONS.md
├── ROADMAP.md, CHANGELOG.md
└── .cursorrules
```

**Deleted / do not restore:** `app/template.tsx`, `lib/onboarding-entry.ts`, `lib/analytics/core.ts` (replaced by `analytics.ts`), `components/onboarding/onboarding-entry-link.tsx`

---

## 7. UI Decisions

### Design Principles (`.cursorrules`)

1. Simplicity → Clarity → Performance → Scalability → Accessibility  
2. Intelligence must be beautiful; every element communicates meaning  
3. Animation serves comprehension — never decoration at the cost of readability  
4. User understands the page within **10–15 seconds**  
5. **Never prioritize visual effects over usability**

### Visual Language (Sprint 3B+)

| Token / component | Purpose |
|---|---|
| `display-title` | Primary headlines (Outfit) |
| `label-caps` | Section eyebrows |
| `prose-lead` | Lead paragraphs |
| `tagline-line` | Observe · Predict · Lead |
| `PremiumCard` | Surfaces (`flat` variant on dashboard) |
| `BetaBadge` | "Beta Preview" |
| `TaglineLockup` | Reusable tagline typography |
| Living Intelligence Core | WebGL field on landing/dashboard/signal detail; CSS on welcome |

### Welcome Screen — APPROVED DESIGN (Locked)

The welcome screen **must** match this experience:

- Full-screen dark background with subtle **CSS intelligence field** ambient glow (not WebGL on welcome — reliability)
- Centered: **"HORIZONIQ"** label + **Beta Preview** badge
- Large headline: **"Welcome to HorizonIQ"**
- Animated tagline: **Observe. · Predict. · Lead.**
- Primary CTA: **"Enter HorizonIQ →"**
- Top-right: **Skip** (marks welcome complete, still advances to name)
- Route: `/onboarding/welcome`
- Component: `components/onboarding/welcome-screen.tsx`

**Do not** change this screen's layout, copy, or field mode without explicit product owner approval.

### Landing Page (`/` — phase: `landing`)

- Hero headline: **"See what is changing before everyone else does."** (`LANDING_HERO_HEADLINE`)
- During `landing` phase: personalized salutation (e.g. "Good Evening, Alex.") above hero
- WebGL intelligence field behind hero
- CTA: **Build my dashboard** → `/onboarding/role` (marks landing acknowledged)
- Shown **after** welcome + name — not as the app's first screen for new users

### Onboarding Shells

- `onboarding-shell.tsx` and `first-time-shell.tsx` include subtle **Start fresh** link at bottom
- Start fresh → `clearAllHorizonIQClientState()` + navigate to `/onboarding/welcome`
- Dashboard **Start over** in context bar — same full wipe behavior

### Dashboard IA (Sprint 3A)

| Principle | Implementation |
|---|---|
| One story | Hero: changed → matters → action |
| Progressive disclosure | Skills/opportunities in `DisclosurePanel` |
| One question per card | `SignalCard focus="why"` |
| Intelligence Focus Areas | UI label (not "Interests") |

### Guided Tour Targets (`data-tour`)

| Attribute | Element | Step |
|---|---|---|
| `what-changed` | Briefing hero `<header>` | 1 |
| `watchlist` | Watchlist section | 2 (first visit) |
| `next-briefing` | "Your next briefing will reveal:" | 3 (first visit) |
| `recommended-actions` | Full `StoryAct` in `what-changed-hero.tsx` | 4 |

### Analytics UI Rule (Sprint 4A)

- Components fire events via `track()` from `lib/analytics`
- No visual analytics UI in MVP
- No provider SDK imports in page/component files

---

## 8. Data Strategy

### Architecture

- **Evergreen catalog:** `data/catalog/signals.json`
- **Weekly briefing:** `data/briefings/{period}.json`
- **Registry:** `lib/data/briefings-registry.ts` — maps period → import path; **must stay in sync** with files on disk
- **Merge:** `lib/data/resolve-signals.ts`
- **Derived:** `skills.json`, `jobs.json`, `recommendations.json`
- **No database** — JSON in git; Vercel bundles at build

### Active Meta (`data/meta.json`)

```json
{
  "briefingPeriod": "2026-W28",
  "briefingLabel": "Week of July 6, 2026 – July 12, 2026",
  "updatedAt": "2026-07-06T10:10:56.566Z",
  "activeBriefingFile": "2026-W28.json",
  "refreshSchedule": "Every Monday at 06:00 UTC"
}
```

### Five Live Sources (Locked)

| Source | API | Token |
|---|---|---|
| Hacker News | Firebase + Algolia | None |
| arXiv | export.arxiv.org | None |
| Wikimedia Pageviews | wikimedia.org REST | None |
| GitHub REST Search | github.com | `GITHUB_TOKEN` |
| Product Hunt GraphQL v2 | producthunt.com | `PRODUCT_HUNT_TOKEN` |

### Pipeline Commands

```bash
npm run pipeline:ingest       # Fetch live observations
npm run pipeline:generate     # Score + generate briefing JSON
npm run pipeline:full         # ingest + generate
npm run pipeline:sync-registry  # Regenerate briefings-registry.ts
npm run pipeline:verify       # Validate meta + registry + files
```

Restart `npm run dev` after `pipeline:full` locally — registry may change.

**Critical:** After adding a new briefing file locally, always run `pipeline:sync-registry` before `npm run build`. A missing registry entry causes production build failure: `No briefing registered for period "YYYY-Www"`.

### Personalization Dimensions

- **Role:** student, professional, entrepreneur, investor
- **Region:** 8 fixed regions (no free text)
- **Intelligence Focus Areas:** 14 predefined interests, multi-select

### Visit State (Retention)

Stored in `horizoniq-visit-snapshot` (localStorage):

- `lastVisitAt`
- Snapshot of signal states at last visit
- Powers "What Changed Since Your Last Visit" within same briefing period

### Analytics State (Sprint 4A)

| Key | Purpose |
|---|---|
| `horizoniq.analytics.visitor-id.v1` | Anonymous UUID |
| `horizoniq.analytics.session.v1` | Current session |
| `horizoniq.analytics.sessions.v1` | Session archive |
| `horizoniq.analytics.events.v1` | Local event buffer |

---

## 9. Trust Strategy

### Implemented

- Honest landing copy — real pipeline sources only
- Provenance badges — Live / Mixed / Sample
- `DataTrustPanel` on landing
- Dashboard footer — provenance, period, updated date
- Clickable source URLs on every signal
- Confidence tiers in plain English — High / Medium / Low
- Outlook clearly labeled **projection**, not fact
- Living Intelligence Core is decorative (`aria-hidden`)
- Seven-section `IntelligenceCard` analyst contract on signal detail
- `buildConfidenceExplanation()` — human-readable trust prose

### Trust Contract (Per Signal)

| Element | Implementation |
|---|---|
| Evidence | Momentum + confidence drivers |
| Source links | Live pipeline URLs + `resolveSourceUrl()` fallback |
| Confidence | Plain English tier + explanation prose |
| Last updated | Briefing `meta.updatedAt` |
| Region relevance | Explicit calibration copy |
| Role relevance | Explicit impact copy |

### Remaining Gaps

- Trust interaction analytics not instrumented (`source_clicked`, evidence expand)
- PostHog funnels not built
- Skills/jobs copy partially templated

### Trust Principles (Locked)

- Label mock vs live explicitly
- Show reasoning, not just scores
- Never overclaim beyond what pipeline ingests
- Curated explanations are honest — activity metrics from live sources when available
- Users should trust HorizonIQ without reading documentation

---

## 10. Retention Strategy

### North Star

Users return because **something changed for them** — not because a static feed exists.

### Two Layers of Change

| Layer | Trigger | User-facing copy |
|---|---|---|
| Weekly briefing | New `briefingPeriod` / Monday pipeline | Fresh live source activity |
| Visit delta | Return within same week | "What Changed Since Your Last Visit" |

### Implemented Mechanics

- Visit snapshot + `isReturnVisitForPeriod()`
- Story hero: What changed → matters → action
- Signal buckets: New · Rising · Falling
- First visit: Week 1 hero + watchlist
- Return visit: full depth sections
- Weekly live data via GitHub Actions (now with build-verify gate)
- Guided tour when user chooses "guided" (once per `guidedTourCompletedAt`)
- Personalized "so what for you" per signal (role × region × interests)
- One primary recommended action per briefing
- **Sprint 4A:** `return_visit`, `dashboard_loaded`, `change_hero_viewed`, `signal_opened` events for measuring engagement

### Feature Retention Filter

Every proposed feature must pass:

> Does this give the user a reason to come back next week?

### Retention Gaps

- localStorage only — device-bound, no cross-device
- No email/digest (Phase 2)
- Week 2 return measurable in theory via `return_visit` + Vercel Analytics — funnels not built yet
- Onboarding reliability addressed via auto-repair — habit formation unblocked
- Pipeline deploy reliability addressed — users now receive fresh Monday briefings

### MVP Success Metrics

| Metric | Role | Measurement (Sprint 4A) |
|---|---|---|
| Week 2 return rate | Primary validation | `return_visit` + visitor ID persistence |
| Change hero engagement | Did they read "What Changed"? | `change_hero_viewed` |
| Signal detail from change | Did change drive depth? | `signal_opened` after hero |
| Time to first actionable insight | < 60 seconds | `onboarding_completed` → `dashboard_loaded` timing |
| Onboarding completion | First-visit habit prerequisite | Funnel: role → region → interests → tour → dashboard |

---

## 11. Known Issues

### 🟢 Resolved — Stale Cookie Mid-Onboarding (2026-06-28)

**Symptom:** Normal browser opened production and landed on role/region mid-onboarding. Incognito worked. Hard refresh did not help.

**Fix:** `lib/onboarding-reconcile.ts` + inline script rewrite (`668d31e`, build fix `42c0687`).

### 🟢 Resolved — Stale Briefing Data on Vercel (2026-06-29 / 2026-07-06)

**Symptom:** Pipeline ran and committed new week data, but production still showed old week (W26/W27 while W27/W28 existed in git).

**Root causes:**

1. Pipeline commits included `[skip ci]` → Vercel skipped deploy (`d72399c` fix)
2. `briefings-registry.ts` not committed by CI → Vercel build ERROR, production stuck on last good deploy (`f344a10` fix)
3. Week rollover bug in prior-week briefing load (`d72399c`)

**Current state:** Production at W28 as of 2026-07-06.

### 🟡 Product Owner — Confirm Normal Browser

User should verify their own browser (no DevTools clear) lands correctly on current production. Legitimately complete users must still reach dashboard.

### Analytics Caveats (Sprint 4A)

| Issue | Notes |
|---|---|
| Vercel Analytics dashboard lag | 15–60 minutes after deploy |
| `localhost` visits | Do not appear in Vercel Analytics dashboard |
| Ad blockers | Block `va.vercel-scripts.com` — no events recorded |
| Clarity not active until env set | `NEXT_PUBLIC_CLARITY_PROJECT_ID` required in Vercel Production |
| Enabling Web Analytics in Vercel dashboard alone | Insufficient without `<Analytics />` in deployed code (now shipped `a2d38de`) |

### Guided Tour Step 4

- Step 4 (`recommended-actions`) may fail to spotlight when scrolling back from watchlist steps
- `guided-tour-overlay.tsx` has `scrollWindowToTop: true` + extended measure delays — verify on first-visit guided tour

### Other Known Issues

| Issue | Severity | Notes |
|---|---|---|
| Middleware vs inline script race | Medium | Returning complete users may briefly see Welcome before client advances to `complete` |
| WebGL canvas remounts on navigation | Medium | Performance — multiple canvases on route changes |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| Stale `.next` cache crashes dev | Medium | Use `npm run dev:clean` |
| Light mode less refined than dark | Low | Dark-first by design |
| Empty states for some focus area combos | Medium | arts, commerce, biochemistry thin |
| Redundant client guards + middleware | Low | Dashboard/role pages still have client redirects; should align with cookie only |
| Vercel bot PR for alternate Analytics import | Low | Branch `vercel/vercel-web-analytics-to-projec-gnynjm` may suggest `@vercel/analytics/next`; production uses `@vercel/analytics/react` per `a2d38de` |

### What NOT To Do (Lessons Learned)

- Do **not** use localStorage flags for routing decisions
- Do **not** auto-sync cookie phase from localStorage without chain validation (caused skip-ahead)
- Do **not** return early from inline init when cookie exists (prevents self-heal)
- Do **not** use `router.push` across middleware phase boundaries after cookie update
- Do **not** add smart routing that jumps to `/dashboard` from stale prefs
- Do **not** restore `app/template.tsx` opacity animations
- Do **not** change welcome screen design without approval
- Do **not** bump `hziq_ob_v3` → `v4` on every deploy (would reset all returning users)
- Do **not** add `[skip ci]` to pipeline commits (blocks Vercel deploy)
- Do **not** rely on `git-auto-commit-action` multiline `file_pattern` for registry — use explicit `git add`
- Do **not** import `@vercel/analytics` or `posthog-js` directly in UI components — use `track()`

---

## 12. Next 5 Tasks (Priority Order)

### 1. Verify analytics in production end-to-end

Confirm Vercel Web Analytics receives page views and custom events after `a2d38de` deploy. Use DevTools → Network → filter `vercel`. Add `NEXT_PUBLIC_CLARITY_PROJECT_ID` to Vercel Production if session replay is desired. Document baseline within 24–48 hours of deploy.

### 2. Build Week 2 return measurement (PostHog or Vercel)

Use `return_visit` + `horizoniq.analytics.visitor-id.v1` to define Week 2 return funnel. If PostHog is configured, build onboarding completion + change-hero → signal-detail funnels per `docs/analytics/metrics.md`.

### 3. Product owner verification in normal browser

Open production in the user's regular browser (not incognito). Confirm stale state self-heals to Welcome or correct linear step. Confirm complete users still reach dashboard. Document any failure with cookie value + URL + localStorage keys.

### 4. Fix guided tour step 4 spotlight (isolated)

In `guided-tour-overlay.tsx` only — ensure `[data-tour='recommended-actions']` highlights reliably after steps 2–3. Do not break steps 1–3.

### 5. Simplify client-side guards + Sprint 3C performance

Remove redundant `useEffect` redirects where middleware and reconcile already enforce phase. Then: single shared WebGL canvas, GPU tier detection, onboarding field continuity on profile steps.

---

## 13. Quick Start for Next Session

```powershell
cd C:\HorizonIQ
git pull
git log -5 --oneline
npm install
npm run dev:clean
```

**Run onboarding tests:**

```powershell
npx tsx scripts/test-onboarding-state.ts
```

**Verify briefing + build:**

```powershell
npm run pipeline:verify
npm run build
```

**Browser test (fresh):**

1. Incognito or clear all site data for horizoniq-beta.vercel.app
2. Open `/` → must redirect to `/onboarding/welcome`
3. Walk full flow: Welcome → Name → Landing → Role → Region → Interests → Tour → Dashboard

**Browser test (stale cookie repair):**

1. Set cookie `hziq_ob_v3=profile` with empty localStorage
2. Visit `/onboarding/role` → should redirect to `/onboarding/welcome`

**Analytics test (production):**

1. Open `https://horizoniq-beta.vercel.app/` (not localhost)
2. DevTools → Network → filter `vercel` or `insights`
3. Complete onboarding → confirm `track()` events in console buffer (`horizoniq.analytics.events.v1`)

**If broken** (`ReactCurrentOwner`, blank pages):

```powershell
Remove-Item -Recurse -Force .next
npm run dev:clean
```

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| *(none required)* | Vercel Analytics + Speed Insights work on Vercel deploy |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity session replay (production) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://us.i.posthog.com` |
| `GITHUB_TOKEN` | Pipeline GitHub source (CI secret) |
| `PRODUCT_HUNT_TOKEN` | Pipeline Product Hunt source (CI secret) |

See `.env.example`.

### Vercel Dashboard Steps (Analytics)

1. **Project → Analytics → Enable Web Analytics** (if not already on)
2. **Project → Speed Insights → Enable**
3. **Settings → Environment Variables** — add `NEXT_PUBLIC_CLARITY_PROJECT_ID` for Production
4. Redeploy after adding Clarity ID

### Client Storage Reference

| Key / Cookie | Purpose |
|---|---|
| `hziq_ob_v3` (cookie) | **Routing phase** — middleware authority |
| `horizoniq.onboarding.v1` (localStorage) | Name, welcome/landing timestamps, tour state |
| `horizoniq.preferences.v2` (localStorage) | Role, region, Intelligence Focus Areas |
| `horizoniq-visit-snapshot` (localStorage) | Return-visit signal snapshot |
| `horizoniq.onboarding.schemaVersion` (localStorage) | Reconcile schema version (`4`) |
| `horizoniq.analytics.visitor-id.v1` (localStorage) | Anonymous analytics visitor UUID |
| `horizoniq.analytics.session.v1` (localStorage) | Current analytics session |
| `horizoniq.analytics.events.v1` (localStorage) | Local analytics event buffer |

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (canonical) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `docs/analytics/metrics.md` | Sprint 4A metric definitions |
| `FALLBACK_TIMELINE.md` | Rollback to `aab7e55` if auto-repair regresses |
| `SESSION_HANDOFF_V13.md` | Superseded — Sprint 4A snapshot |
| `SESSION_HANDOFF_V12.md` | Superseded — pre-analytics full handoff |
| `.cursorrules` | Agent engineering + design rules |
| `.env.example` | Pipeline + analytics tokens |

---

## 15. Strategic Context (Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| Intelligence analyst, not trend aggregator | Locked |
| Dashboard story: changed → matters → action | Locked |
| Intelligence Focus Areas (not "Interests" in UI) | Locked |
| Dark-first premium visual system | Locked |
| Living Intelligence Core as signature visual | Locked |
| No auth for MVP | Locked |
| Five free pipeline sources | Locked |
| No `app/template.tsx` opacity page transitions | Locked |
| Welcome screen design (Section 7) | Locked — do not change without approval |
| First-time flow: Welcome → Name → Landing → Profile | Locked |
| Onboarding routing: cookie + middleware (`hziq_ob_v3`) | Locked |
| Cross-phase navigation: `navigateOnboarding()` full-page | Locked |
| Onboarding auto-repair on every page load | Locked — do not revert to cookie-exists early return |
| Canonical phase from storage with chain validation | Locked — never blind-sync cookie from localStorage |
| Analytics via `track()` abstraction only | Locked — Sprint 4A |
| Pipeline CI must verify build before push | Locked — `f344a10` |
| Anonymous analytics only (no PII in events) | Locked — Sprint 4A |

---

*End of Session Handoff V14*

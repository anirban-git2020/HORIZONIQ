# HorizonIQ — Session Handoff V17

**Last updated:** 2026-07-06  
**Version:** MVP V1.1 (Change-First) + Sprints 4A, 3.9, 3.95  
**Status:** Active Development — public Beta live; feedback + legal + brand shipped  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V16.md`, `SESSION_HANDOFF_V15.md`, `SESSION_HANDOFF_V14.md`, and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `docs/analytics/metrics.md` → `docs/feedback/README.md` → `CHANGELOG.md` → `.cursorrules` → `.cursor/rules/communication.mdc`

**Known-good fallback:** `FALLBACK_TIMELINE.md` — tag `fallback/2026-06-28-v1.1-stable` at `aab7e55`. Use only if onboarding auto-repair regresses.

---

## Repo State (2026-07-06)

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Through `f3cdaa2` — full MVP V1.1 stack + analytics + brand/legal + feedback + welcome CTA polish |
| **Production briefing** | `2026-W28` — Week of July 6, 2026 – July 12, 2026 |
| **Working tree** | Clean — all changes pushed |

**Recent commits (most recent first):**

```
f3cdaa2 fix(welcome): simplify Enter CTA to bold label only
3e686e4 fix(welcome): black HorizonIQ label on Enter button with aligned arrow
97263d1 feat(feedback): Sprint 3.95 in-app feedback and brand wordmark
1dc7d84 docs: add session handoff V14 and July 6 worklog
1558d75 feat(brand): Sprint 3.9 footer, legal pages, SEO, and site navigation
a2d38de feat(analytics): Sprint 4A product analytics and Vercel Web Analytics
f344a10 fix(pipeline): ensure weekly briefing deploys to Vercel
```

**Product owner context:**

- Product owner is **not technical** — follow `.cursor/rules/communication.mdc` (plain English, numbered steps).
- **Do not change welcome screen** without explicit product owner approval (layout is locked; CTA is now **Enter** only — bold).
- Supabase feedback is **configured and verified working** in production (Vercel env + table + storage bucket).
- Stale onboarding cookies self-heal via `lib/onboarding-reconcile.ts` — do not revert.

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Sprint 3C elevation:** HorizonIQ is a **Personal Intelligence Operating System** — not a dashboard. The signature visual is the **Living Intelligence Core**: an abstract, data-reactive intelligence field (sparse particles + mesh — not a globe, brain, or neural-network cliché).

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
- Product is **measurable** in production (Sprint 4A)
- Product is **public-Beta ready** — legal pages, footer, SEO, in-app feedback (Sprints 3.9, 3.95)

**Target users:** Student · Professional · Entrepreneur · Investor

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP) · dashboard overload · AI hype language

**Feature retention filter (every new feature):**

> Does this give the user a reason to come back next week?

**IA goal (Sprint 3A):** User understands the dashboard in **under 15 seconds** via one story: What changed → Why it matters → What to do.

**Brand wordmark (Sprint 3.9+):**

- **Horizon** — white (`#ffffff`) on dark surfaces; foreground on light
- **IQ** — `#00c5ff` everywhere except monochrome contexts (e.g. button labels)
- Component: `HorizonIQWordmark` / `BrandName` in `components/brand/horizoniq-wordmark.tsx`

---

## 2. MVP Definition

**Version:** MVP V1.1 (Change-First)  
**Objective:** Validate that users **return weekly** when intelligence shows personalized change.

### What MVP Must Deliver

1. **Change-first intelligence** — every signal shows what changed, why, why it matters to *this* user, and what to do
2. **Personalized onboarding** — Welcome → Name → Landing → role × region × Intelligence Focus Areas within 60 seconds
3. **Weekly briefing cadence** — catalog + live pipeline data, refreshed Mondays 06:00 UTC
4. **Return-visit delta** — "What Changed Since Your Last Visit" via localStorage visit snapshot (no login)
5. **Trust without documentation** — labeled sources, provenance, confidence in plain English
6. **Premium first impression** — welcome, name, personalized landing, guided tour option
7. **Reliable onboarding routing** — cookie + middleware authority, auto-repair stale state
8. **Product analytics** — anonymous visitor/session tracking + typed events (Sprint 4A)
9. **Public Beta readiness** — footer, legal pages, SEO, feedback (Sprints 3.9, 3.95)

### MVP Success Metrics

| Metric | Target |
|---|---|
| Week 2 return rate | Primary validation metric |
| Change hero engagement | User reads "What Changed" |
| Signal detail from change | Depth driven by change layer |
| Time to first actionable insight | < 60 seconds |
| 15-second dashboard comprehension | Sprint 3A IA goal |
| Onboarding completion (no stuck states) | Full flow on Vercel in normal browser |
| Feedback submission success | In-app feedback reaches Supabase |

### Explicitly Out of MVP

- User accounts / login (except optional feedback email)
- Relationship graphs
- Community / discussion
- AI chatbot homepage
- Email digest (Phase 2)
- Additional data sources beyond locked five
- LLM summarization in pipeline
- Analytics admin UI
- Feedback admin dashboard UI

### Non-Negotiables

- No login required for MVP
- No fake data without labels
- No dashboard overload
- Every screen reinforces: what changed, why it matters, what to do
- **Do not restore `app/template.tsx` opacity page transitions** — caused invisible pages
- **Do not change welcome screen** without product owner approval
- **Do not use `router.push` for cross-phase onboarding** — use `navigateOnboarding()`
- **Do not blind-sync cookie phase from localStorage** — use `reconcileOnboardingState()`
- **UI calls `track()` only** — never import provider SDKs directly in components
- **Communicate simply with product owner** — see `communication.mdc`

---

## 3. Completed Features

### Deployment & Infrastructure

- [x] Vercel production — `https://horizoniq-beta.vercel.app/`
- [x] GitHub Actions weekly pipeline — Monday 06:00 UTC (`.github/workflows/weekly-briefing.yml`)
- [x] Pipeline CI hardened — `pipeline:sync-registry`, `pipeline:verify`, `npm run build` before git push
- [x] Explicit `git add data/ lib/data/briefings-registry.ts` in CI
- [x] Removed `[skip ci]` from pipeline commits
- [x] `GITHUB_TOKEN` + `PRODUCT_HUNT_TOKEN` in CI secrets

### Sprint 4A — Product Analytics

- [x] Vercel Web Analytics + Speed Insights in root layout
- [x] Microsoft Clarity scaffold (lazy, production-only, `NEXT_PUBLIC_CLARITY_PROJECT_ID`)
- [x] Provider-agnostic `lib/analytics/` — UI calls `track()` only
- [x] Anonymous visitor ID + session tracking
- [x] Typed Sprint 4A events — `docs/analytics/metrics.md`
- [x] Optional PostHog sink

**Events instrumented:** `app_opened`, `role_selected`, `region_selected`, `interest_selected`, `onboarding_completed`, `guided_tour_*`, `dashboard_loaded`, `return_visit`, `change_hero_viewed`, `signal_opened`, `briefing_expanded`, `cta_clicked`, `footer_link_clicked`

**Events defined but not wired (no UI yet):** `search_executed`, `recommendation_opened`, `forecast_opened`

### Intelligence & Dashboard (Sprints 2.5, 2.5A, 3A)

- [x] `IntelligenceCard` — seven-section analyst contract
- [x] `lib/intelligence.ts` — reasoning, outlook, confidence tiers
- [x] Story-driven dashboard: What changed → Why it matters → What to do
- [x] `WhatChangedHero`, `StorySection`, `DashboardContextBar`, `DisclosurePanel`
- [x] Visit snapshot — return-visit diff (`horizoniq-visit-snapshot`)
- [x] Signal detail at `/signals/[id]`
- [x] Clickable source URLs

### Visual & Immersive (Sprints 3B, 3C)

- [x] Dark-first premium palette, Outfit + Inter typography
- [x] `BetaBadge`, `TaglineLockup`, `HorizonIQWordmark`, `lib/motion.ts`
- [x] Living Intelligence Core — R3F + GLSL on landing, dashboard, signal detail
- [x] CSS fallback + `prefers-reduced-motion`
- [x] Welcome uses CSS intelligence field (not WebGL — reliability)

### Live Data Pipeline

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `pipeline:ingest` | `generate` | `full` | `sync-registry` | `verify`
- [x] Briefings: `2026-W26.json`, `2026-W27.json`, `2026-W28.json`
- [x] Week rollover fix in `loadPreviousBriefing()`

### Onboarding (Sprint 1 + routing + auto-repair)

- [x] Welcome → Name → Landing → Role → Region → Interests → Tour → Dashboard
- [x] Cookie + middleware (`hziq_ob_v3`) + auto-repair on every load
- [x] `navigateOnboarding()` full-page navigation
- [x] Guided tour overlay (4 steps)
- [x] Quick-start on region page
- [x] Start fresh / Start over
- [x] Unit tests — `scripts/test-onboarding-state.ts`

### Sprint 3.9 — Brand, Legal & Trust

- [x] Global `SiteFooter` on landing, dashboard, signal detail, site pages
- [x] Pages: `/about`, `/contact`, `/privacy`, `/terms`, `/changelog`, `/roadmap`
- [x] `SiteNav` in `TopBar` (desktop + mobile menu)
- [x] Founder attribution (About, Contact, footer)
- [x] SEO: metadata, OG image, icon, manifest, sitemap, robots, JSON-LD
- [x] Public path allowlist — legal pages during onboarding
- [x] `footer_link_clicked` analytics wired

### Sprint 3.95 — Feedback System

- [x] Global `FeedbackWidget` — floating FAB bottom-right
- [x] Premium modal — 5 types, message, optional email, optional screenshot (5 MB)
- [x] Auto metadata (visitor, session, URL, page, device, preferences)
- [x] `POST /api/feedback` → Supabase `feedback` table + Storage
- [x] Success state with tagline
- [x] Admin query presets in `lib/feedback/admin-queries.ts` (no admin UI)
- [x] **Verified working in production** (product owner confirmed)

### Welcome Screen Polish (2026-07-06)

- [x] Primary CTA simplified to **Enter** only — bold, black on primary button (`f3cdaa2`)
- [x] Headline retains `Welcome to` + `HorizonIQWordmark` (white Horizon + cyan IQ)

---

## 4. Pending Features

### Analytics & Measurement

- [ ] Add `NEXT_PUBLIC_CLARITY_PROJECT_ID` to Vercel if session replay desired
- [ ] PostHog funnels — Week 2 return, onboarding path, feedback funnel
- [ ] Trust interaction analytics (source clicks, evidence expand)
- [ ] Wire deferred events when UI ships: `search_executed`, `recommendation_opened`, `forecast_opened`
- [ ] Analytics admin UI (deferred)

### Feedback (Post-Ship)

- [ ] Feedback admin dashboard UI (query presets exist)
- [ ] Email/Slack notification on new feedback
- [ ] Status workflow UI (NEW → OPEN → RESOLVED → ARCHIVED)

### Sprint 3C Stabilization

- [ ] Single shared WebGL canvas across route changes
- [ ] GPU tier detection — auto particle budget
- [ ] WebGL load skeleton
- [ ] Onboarding field continuity on role/region/interests steps

### Guided Tour

- [ ] Return-visit tour step variants
- [ ] Fix step 4 spotlight (`recommended-actions`) after watchlist scroll

### Brand & Legal

- [ ] GitHub footer link (placeholder until repo public)
- [ ] Formal legal review of Terms and Privacy copy

### Architecture Cleanup

- [ ] Simplify redundant client `useEffect` redirects where middleware handles phase
- [ ] Reduce loader flashes between middleware + inline script + bootstrap

### Data & Content

- [ ] Broader catalog coverage (arts, commerce, biochemistry)
- [ ] Product Hunt HTTP 429 hardening in CI
- [ ] More region-specific explanation variants
- [ ] Step progress label: "Interests" → Intelligence Focus Areas (if not done everywhere)

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
| Analytics | `lib/analytics/` + Vercel Analytics + Speed Insights + optional PostHog + Clarity |
| Feedback backend | Supabase (`feedback` table + `feedback-screenshots` bucket) via `POST /api/feedback` |
| Routing guard | `middleware.ts` + `hziq_ob_v3` cookie |
| State repair | `lib/onboarding-reconcile.ts` |
| Client state | Cookie (routing) + localStorage (prefs, identity, analytics, visit snapshot) |
| Navigation | `lib/onboarding-nav.ts` — full-page `window.location.assign` |
| Pipeline | tsx + dotenv |
| CI | GitHub Actions (Node 24) |
| Hosting | Vercel |
| Not in use | User auth, Supabase for app data (only feedback), `@react-three/drei`, `app/template.tsx` |

### Analytics Architecture

```
UI → track() → lib/analytics/analytics.ts
    ├─ visitor ID + session enrichment
    ├─ localStorage event buffer
    └─ sinks: Vercel Analytics, PostHog (optional), Clarity (optional)
```

### Feedback Architecture (Sprint 3.95)

```
FeedbackWidget (global in layout)
  → hooks/useFeedback.ts
  → services/feedbackService.ts
  → POST /api/feedback (FormData)
       ├─ optional screenshot → Supabase Storage (service role)
       └─ insert → public.feedback (status: NEW)
```

Server uses `SUPABASE_SERVICE_ROLE_KEY` only — never exposed to browser.

Required env:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_FEEDBACK_BUCKET` (optional, default `feedback-screenshots`)

### Onboarding Architecture (Critical)

**Phases (linear):** `welcome` → `name` → `landing` → `profile` → `complete`

| Phase | Path(s) |
|---|---|
| welcome | `/onboarding/welcome` |
| name | `/onboarding/name` |
| landing | `/` |
| profile | `/onboarding/role`, `region`, `interests`, `tour` |
| complete | `/dashboard`, `/signals/*`, `/` |

**Public paths (any phase):** `/about`, `/contact`, `/privacy`, `/terms`, `/changelog`, `/roadmap` — via `isPublicSitePath()` in `lib/onboarding-phase.ts`

**Four layers:**

1. `middleware.ts` — server redirect if path not allowed
2. Inline script in `app/layout.tsx` — reconcile before React
3. `OnboardingBootstrap` — React fallback
4. Page actions — `navigateOnboarding()` / `advanceOnboardingPhase()`

### End-to-End Data Flow

```
GitHub Actions (Monday 06:00 UTC) OR npm run pipeline:full
  → ingest (HN, arXiv, Wikimedia, GitHub, Product Hunt)
  → score → generate briefing JSON
  → sync-registry → verify → build → git push → Vercel deploy
  → lib/data/resolve-signals.ts → dashboard + signal detail
  → lib/visit-snapshot.ts (return-visit diff)
```

### Intelligence Field Flow

```
Preferences + Signals → use-intelligence-field-params.ts
  → lib/intelligence-field/params.ts
  → IntelligenceFieldLayer (CSS fallback or WebGL)
```

Welcome screen: **CSS only** (`mode="css"`). Landing/dashboard/signals: **WebGL**.

---

## 6. Current File Structure

```
HorizonIQ/
├── middleware.ts
├── FALLBACK_TIMELINE.md
├── SESSION_HANDOFF_V17.md          ← This file (canonical)
├── SESSION_HANDOFF_V16.md            ← Superseded
├── SESSION_HANDOFF_V15.md            ← Superseded
├── SESSION_HANDOFF_V14.md            ← Superseded (detailed onboarding reference)
├── .cursor/rules/
│   ├── horizoniq.mdc
│   └── communication.mdc           ← Product owner is non-technical
├── .github/workflows/weekly-briefing.yml
├── supabase/schema/feedback.sql
├── docs/
│   ├── analytics/metrics.md
│   └── feedback/README.md
│
├── app/
│   ├── layout.tsx                  # Cookie init, Analytics, FeedbackWidget, JsonLd
│   ├── page.tsx                    # Landing
│   ├── globals.css
│   ├── icon.tsx, opengraph-image.tsx, manifest.ts, robots.ts, sitemap.ts
│   ├── api/feedback/route.ts       # Supabase feedback API
│   ├── dashboard/page.tsx
│   ├── signals/[id]/page.tsx
│   ├── (site)/                     # About, Contact, Privacy, Terms, Changelog, Roadmap
│   │   ├── layout.tsx              # TopBar + SiteFooter
│   │   └── {about,contact,privacy,terms,changelog,roadmap}/page.tsx
│   └── onboarding/
│       ├── welcome, name, greeting, role, region, interests, tour
│
├── components/
│   ├── analytics/analytics-provider.tsx
│   ├── brand/                      # logo, beta-badge, tagline-lockup, horizoniq-wordmark
│   ├── feedback/                   # widget, fab, modal, form, success, type-selector
│   ├── intelligence/               # IntelligenceCard family
│   ├── intelligence-field/         # Living Intelligence Core
│   ├── layout/                     # top-bar, site-footer, site-nav, content-page, footer-link
│   ├── landing/                    # hero, pillars, trust panel, why-horizoniq
│   ├── dashboard/                  # what-changed-hero, signal-card, etc.
│   ├── onboarding/                 # welcome-screen (LOCKED), guided-tour, cookie-init
│   ├── site/founder-section.tsx
│   ├── seo/json-ld.tsx
│   └── ui/                         # button, premium-card, badge, etc.
│
├── hooks/
│   ├── useFeedback.ts
│   ├── use-intelligence-field-params.ts
│   └── use-reduced-motion.ts
│
├── services/
│   └── feedbackService.ts
│
├── types/
│   └── feedback.ts
│
├── lib/
│   ├── analytics/                  # track(), events, visitor, session, providers
│   ├── feedback/                   # metadata, supabase-server, admin-queries, constants
│   ├── site.ts                     # brand colors, founder, public paths, SITE_VERSION
│   ├── seo.ts                      # metadata + JSON-LD
│   ├── site-content/               # changelog.ts, roadmap.ts (page data)
│   ├── onboarding-phase.ts         # phases + public path allowlist
│   ├── onboarding-reconcile.ts     # auto-repair
│   ├── onboarding-nav.ts
│   ├── intelligence.ts
│   ├── data/                       # access, schemas, briefings-registry, resolve-signals
│   ├── pipeline/                   # ingest, score, generate, store
│   ├── identity/
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts, trust.ts
│   └── intelligence-field/
│
├── data/
│   ├── meta.json                   # activeBriefing: 2026-W28
│   ├── catalog/signals.json
│   ├── briefings/2026-W26|W27|W28.json
│   └── skills.json, jobs.json, recommendations.json
│
├── scripts/
│   ├── pipeline-*.ts, sync-briefings-registry.ts, verify-briefing.ts
│   └── test-onboarding-state.ts
│
├── VISION.md, PROJECT_MEMORY.md, PROJECT_DECISIONS.md, ROADMAP.md, CHANGELOG.md
└── .cursorrules
```

**Deleted / do not restore:** `app/template.tsx`, `lib/analytics/core.ts` (use `analytics.ts`)

---

## 7. UI Decisions

### Design Principles

1. Simplicity → Clarity → Performance → Scalability → Accessibility
2. Intelligence must be beautiful; every element communicates meaning
3. Animation serves comprehension — never decoration at the cost of readability
4. User understands the page within **10–15 seconds**
5. Dark-first premium aesthetic — no cyberpunk, neon overload, or crypto dashboards

### Brand

| Element | Rule |
|---|---|
| Wordmark | `Horizon` white + `IQ` `#00c5ff` via `HorizonIQWordmark` |
| Tagline | Observe. Predict. Lead. — `TaglineLockup` |
| Beta label | `BetaBadge` — "Beta Preview" |
| Version | `Beta Preview v0.1` in footer |

### Welcome Screen — LOCKED (Product Owner)

Route: `/onboarding/welcome`  
Component: `components/onboarding/welcome-screen.tsx`

| Element | Spec |
|---|---|
| Background | CSS intelligence field (not WebGL) |
| Eyebrow | `HorizonIQWordmark` + `BetaBadge` |
| Headline | "Welcome to" + `HorizonIQWordmark` |
| Tagline | `TaglineLockup` animated, size lg |
| Primary CTA | **Enter** only — bold, primary button (`f3cdaa2`) |
| Skip | Top-right ghost button |

**Do not change without product owner approval.**

### Global Chrome

| Surface | Components |
|---|---|
| Top bar | `TopBar` — Logo + optional `SiteNav` + theme toggle |
| Footer | `SiteFooter` — brand, legal links, founder credit, tech stack |
| Feedback | `FeedbackWidget` — FAB bottom-right, all pages |

### Dashboard IA (Sprint 3A)

One story: **What changed → Why it matters → What to do**

- Hero: `WhatChangedHero`
- Supporting: `DisclosurePanel` for skills/opportunities
- Cards: single-question focus (`focus="why"`)

### Site Pages

`(site)` layout: `TopBar showNav` + `SiteFooter` — no intelligence field layers.

---

## 8. Data Strategy

### Architecture

- **Evergreen catalog:** `data/catalog/signals.json`
- **Weekly briefing:** `data/briefings/{period}.json`
- **Registry:** `lib/data/briefings-registry.ts` — must match files on disk
- **Merge:** `lib/data/resolve-signals.ts`
- **Derived:** `skills.json`, `jobs.json`, `recommendations.json`
- **No app database** — JSON in git; Vercel bundles at build
- **Supabase** — feedback submissions only (not signal data)

### Active Meta (`data/meta.json`)

```json
{
  "briefingPeriod": "2026-W28",
  "briefingLabel": "Week of July 6, 2026 – July 12, 2026",
  "activeBriefingFile": "2026-W28.json",
  "refreshSchedule": "Every Monday at 06:00 UTC"
}
```

### Five Live Sources (Locked)

| Source | Token |
|---|---|
| Hacker News | None |
| arXiv | None |
| Wikimedia Pageviews | None |
| GitHub REST | `GITHUB_TOKEN` |
| Product Hunt | `PRODUCT_HUNT_TOKEN` |

### Pipeline Commands

```bash
npm run pipeline:ingest
npm run pipeline:generate
npm run pipeline:full
npm run pipeline:sync-registry   # Required after new briefing file
npm run pipeline:verify
```

**Critical:** After new briefing locally, run `sync-registry` before `build`. Missing registry entry breaks production build.

### Personalization

- **Role:** student, professional, entrepreneur, investor
- **Region:** 8 fixed regions
- **Intelligence Focus Areas:** 14 predefined interests, multi-select

### Visit State (Retention)

`horizoniq-visit-snapshot` — powers "What Changed Since Your Last Visit" within same briefing period.

### Feedback Data (Supabase)

Table `public.feedback` — see `supabase/schema/feedback.sql` and `docs/feedback/README.md`.

---

## 9. Trust Strategy

### Implemented

- Honest provenance — Live / Mixed / Sample badges
- `DataTrustPanel` on landing
- Clickable source URLs on every signal
- Seven-section `IntelligenceCard` analyst contract
- Confidence tiers in plain English + explanation prose
- Legal pages: Privacy, Terms (with legal-review placeholders)
- Footer copyright + extended notice
- Feedback privacy — optional email only; anonymous visitor/session IDs in metadata
- Living Intelligence Core is decorative (`aria-hidden`)

### Trust Contract (Per Signal)

Evidence · Source links · Confidence · Last updated · Role/region relevance

### Remaining Gaps

- Trust interaction analytics not instrumented
- Terms/Privacy need formal legal review
- Some skills/jobs copy templated

### Principles (Locked)

- Label mock vs live explicitly
- Show reasoning, not just scores
- Never overclaim beyond pipeline data
- Users should trust HorizonIQ without reading documentation

---

## 10. Retention Strategy

### North Star

Users return because **something changed for them** — not because a static feed exists.

### Two Layers of Change

| Layer | Trigger | Copy |
|---|---|---|
| Weekly briefing | New `briefingPeriod` / Monday pipeline | Fresh source activity |
| Visit delta | Return within same week | "What Changed Since Your Last Visit" |

### Implemented Mechanics

- Visit snapshot + `isReturnVisitForPeriod()`
- Story hero: changed → matters → action
- Signal buckets: New · Rising · Falling
- First visit: Week 1 hero + watchlist; return visit: full depth
- Weekly live data via GitHub Actions
- Personalized "so what for you" per signal
- One primary recommended action per briefing
- Analytics: `return_visit`, `change_hero_viewed`, `signal_opened`
- In-app feedback loop (Sprint 3.95)

### Retention Gaps

- localStorage only — device-bound
- No email/digest (Phase 2)
- Week 2 return measurable in theory — funnels not built yet
- PostHog/Clarity optional — not fully instrumented for funnels

### MVP Success Metrics

| Metric | Measurement |
|---|---|
| Week 2 return | `return_visit` + visitor ID persistence |
| Change hero engagement | `change_hero_viewed` |
| Signal depth from change | `signal_opened` after hero |
| Time to value | `onboarding_completed` → `dashboard_loaded` |
| Feedback loop | Supabase `feedback` table rows |

---

## 11. Known Issues

### Resolved (2026-07-06)

| Issue | Fix |
|---|---|
| Feedback button missing on production | Code not pushed until `97263d1` |
| Feedback not reaching Supabase | Env vars + SQL + storage bucket + redeploy |
| Weekly briefing stuck on old week | Pipeline CI hardening + removed `[skip ci]` |
| Stale cookie mid-onboarding | `onboarding-reconcile.ts` |
| Welcome button readability | Simplified to **Enter** only (`f3cdaa2`) |

### Open / Monitor

| Issue | Severity | Notes |
|---|---|---|
| Guided tour step 4 spotlight | Medium | May fail after watchlist scroll |
| WebGL canvas remounts on navigation | Medium | Performance — multiple contexts |
| Product Hunt HTTP 429 in CI | Medium | Source marked stale |
| Middleware vs inline script race | Low | Brief Welcome flash for returning users |
| Light mode less refined than dark | Low | Dark-first by design |
| Redundant client onboarding guards | Low | Align with middleware-only |
| Vercel Analytics dashboard lag | Info | 15–60 min delay |
| Duplicate Supabase env vars on Vercel | Info | Only `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` required for feedback |

### What NOT To Do

- Do not use localStorage for routing decisions
- Do not blind-sync cookie from localStorage
- Do not use `router.push` across onboarding phases
- Do not restore `app/template.tsx`
- Do not change welcome screen without approval
- Do not add `[skip ci]` to pipeline commits
- Do not import analytics SDKs in UI components
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client

---

## 12. Next 5 Tasks (Priority Order)

### 1. Build Week 2 return measurement

Use `return_visit` + `horizoniq.analytics.visitor-id.v1` to define Week 2 return funnel. Configure PostHog if available, or analyze via Vercel Analytics + local event buffer.

**Done when:** Dashboard or doc shows baseline Week 2 return rate.

### 2. Fix guided tour step 4 spotlight

In `guided-tour-overlay.tsx` only — ensure `[data-tour='recommended-actions']` highlights reliably after steps 2–3.

**Done when:** First-visit guided tour completes all 4 steps on production.

### 3. Enable Clarity session replay (optional but high value)

Add `NEXT_PUBLIC_CLARITY_PROJECT_ID` to Vercel Production if not set. Redeploy. Verify replays in Clarity dashboard.

**Done when:** Session replays appear for production visits.

### 4. Sprint 3C performance — shared WebGL canvas

Single canvas across route changes; reduce remount cost on landing → dashboard → signal navigation.

**Done when:** No duplicate WebGL contexts on client navigation; FPS stable.

### 5. Feedback admin read path (architecture only — no full UI required)

Optional thin internal page or Supabase dashboard workflow documented for triaging `NEW` feedback, marking `OPEN`/`RESOLVED`. Query presets exist in `lib/feedback/admin-queries.ts`.

**Done when:** Product owner can review and triage feedback without SQL editor.

---

## 13. Quick Start for Next Session

```powershell
cd C:\HorizonIQ
git pull
git log -5 --oneline
npm install
npm run dev:clean
```

**Verify:**

```powershell
npx tsx scripts/test-onboarding-state.ts
npm run pipeline:verify
npm run build
```

**Production smoke test:**

1. Incognito → `/` → redirects to `/onboarding/welcome`
2. Full flow → dashboard
3. Feedback FAB → submit test → row in Supabase `feedback` table
4. Footer links → `/about`, `/privacy`, etc.

**Vercel env (feedback):**

| Key | Required |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| `SUPABASE_FEEDBACK_BUCKET` | Optional (default `feedback-screenshots`) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optional |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional |

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision |
| `PROJECT_MEMORY.md` | Living product spec |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `docs/analytics/metrics.md` | Analytics event definitions |
| `docs/feedback/README.md` | Feedback setup + schema |
| `FALLBACK_TIMELINE.md` | Rollback reference |
| `.cursor/rules/communication.mdc` | How to talk to product owner |

---

## 15. Strategic Context (Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| Intelligence analyst, not trend aggregator | Locked |
| Dashboard story: changed → matters → action | Locked |
| Intelligence Focus Areas (not "Interests" in UI) | Locked |
| Dark-first premium visual system | Locked |
| Living Intelligence Core signature visual | Locked |
| Horizon white + IQ `#00c5ff` wordmark | Locked |
| No auth for MVP | Locked |
| Five pipeline sources | Locked |
| Welcome screen locked — CTA is **Enter** only | Locked (`f3cdaa2`) |
| Cookie + middleware onboarding (`hziq_ob_v3`) | Locked |
| `navigateOnboarding()` for cross-phase nav | Locked |
| Onboarding auto-repair every page load | Locked |
| Analytics via `track()` only | Locked |
| Feedback via Supabase service role on server | Locked |
| Public legal pages during onboarding | Locked |
| Simple communication with product owner | Locked (`communication.mdc`) |

---

*End of Session Handoff V17*

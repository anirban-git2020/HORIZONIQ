# HorizonIQ — Session Handoff V11

**Last updated:** 2026-06-28  
**Version:** MVP V1.1 (Change-First)  
**Status:** Active Development — onboarding routing rebuilt (cookie + middleware); **verify full flow on Vercel after `6f040a7`**  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V10.md` and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `CHANGELOG.md` → `.cursorrules`

---

## Repo State (2026-06-28)

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Through `6f040a7` — Sprints 1–3C, live pipeline, intelligence layer, cookie+middleware onboarding (`hziq_ob_v3`) |
| **Local uncommitted** | None expected — verify with `git status` |

**Recent commits (onboarding-focused):**

```
6f040a7 fix: reset onboarding with hziq_ob_v3 cookie and wipe stale prefs
bfd8e49 fix: cookie + middleware onboarding routing replaces localStorage guards
a95e69d fix: unified onboarding state machine to end localStorage drift
7d00fa1 fix: stabilize onboarding flow Welcome to Name to Landing to Profile
87cc677 fix: revert smart onboarding routing that skipped to dashboard
e8b1a70 feat: Living Intelligence Core (Sprint 3C) with React 19 and guided tour fix
```

**⚠️ Product owner context:** Multiple onboarding regressions were caused by stale `localStorage` and legacy phase cookies (`horizoniq_phase_v2=profile`) skipping Welcome/Name/Landing. Latest fix uses **server middleware + new cookie name**. User must hard-refresh after deploy; do not change welcome screen design without explicit approval.

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

### MVP Success Metrics

| Metric | Target |
|---|---|
| Week 2 return rate | Primary validation metric |
| Change hero engagement | User reads "What Changed" |
| Signal detail from change | Depth driven by change layer |
| Time to first actionable insight | < 60 seconds |
| 15-second dashboard comprehension | Sprint 3A IA goal |

### Explicitly Out of MVP

- User accounts / login
- Relationship graphs
- Community / discussion
- AI chatbot homepage
- Email digest (Phase 2)
- Additional data sources beyond locked five
- LLM summarization in pipeline

### Non-Negotiables

- No login required for MVP
- No fake data without labels
- No dashboard overload
- Every screen reinforces: what changed, why it matters, what to do
- **Do not restore `app/template.tsx` opacity page transitions** — caused invisible pages on client navigation
- **Do not change welcome screen layout/copy** without product owner approval

---

## 3. Completed Features

### Deployment & Analytics

- [x] Vercel — `https://horizoniq-beta.vercel.app/`
- [x] Provider-agnostic analytics — `lib/analytics/`
- [x] PostHog optional via `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`
- [x] Events: `onboarding_started`, `onboarding_role_selected`, `onboarding_region_selected`, `onboarding_completed`, `dashboard_viewed`, `change_hero_viewed`, `signal_click`, `signal_detail_viewed`, `start_over`, `guided_tour_completed`

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
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full`
- [x] GitHub Actions — Monday 06:00 UTC (`.github/workflows/weekly-briefing.yml`)
- [x] Catalog + briefing architecture

### Onboarding (Sprint 1 + routing rebuild)

- [x] `WelcomeScreen` — approved design at `/onboarding/welcome` (CSS intelligence field, not WebGL)
- [x] Name capture — `/onboarding/name`
- [x] Personalized landing — salutation on `/` when phase = `landing`
- [x] Profile steps — role, region, interests (14 Intelligence Focus Areas)
- [x] Tour choice — `/onboarding/tour` (guided vs solo)
- [x] Guided tour overlay — 4-step portal-based spotlight tour
- [x] Quick-start on region page — skips interests with role defaults
- [x] Display name on dashboard — time-of-day salutation (return visits)
- [x] **Cookie + middleware onboarding** — `hziq_ob_v3` phase cookie, `middleware.ts` enforces linear flow
- [x] Stale storage wipe — incomplete onboarding clears prefs + identity data
- [x] Start over — full reset + nav to `/onboarding/welcome`

### Navigation Stabilization

- [x] Removed `app/template.tsx` — fixed blank/invisible client navigations
- [x] `ScrollToTop` in root layout
- [x] `PageLoader` — visible loading during redirects
- [x] `OnboardingBootstrap` — client init after inline cookie script

---

## 4. Pending Features

### 🔴 Verify Onboarding on Vercel (post-`6f040a7`)

- [ ] **End-to-end smoke test** on production with hard refresh (Ctrl+Shift+R)
- [ ] **Confirm Welcome → Name → Landing → Role → Tour → Dashboard** with fresh browser
- [ ] **Confirm stale `horizoniq_phase_v2` cookie no longer skips to role**
- [ ] **Guided tour step 4** — spotlight on `data-tour="recommended-actions"` after scroll from watchlist

### Sprint 3C Stabilization

- [ ] Single shared WebGL canvas across route changes
- [ ] GPU tier detection — auto particle budget
- [ ] WebGL load skeleton
- [ ] Onboarding field continuity on role/region/interests steps

### Guided Tour

- [ ] Return-visit tour step variants (steps 2–3 target first-visit-only elements)
- [ ] Verify all 4 steps after onboarding routing stabilizes

### Analytics & Retention Measurement

- [ ] PostHog funnels — Week 2 return, onboarding path, tour completion
- [ ] Trust interaction analytics (source clicks, evidence expand)
- [ ] 15-second dashboard comprehension instrumentation

### Data & Content

- [ ] Broader catalog coverage (arts, commerce, biochemistry)
- [ ] Product Hunt HTTP 429 hardening in CI
- [ ] More region-specific explanation variants in catalog

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
| Analytics | posthog-js (optional) + `lib/analytics` |
| Routing guard | **Next.js `middleware.ts`** + phase cookie |
| Client state | Cookie (routing) + localStorage (data) |
| Pipeline | tsx + dotenv |
| CI | GitHub Actions (Node 24) |
| Hosting | Vercel |
| Not in use | Supabase, database, auth, `@react-three/drei`, `app/template.tsx` |

### Onboarding Architecture (Current — Critical)

**Routing authority:** `hziq_ob_v3` cookie (`lib/onboarding-phase.ts` → `ONBOARDING_COOKIE_NAME`)

**Phases (strict linear order):**

| Phase | Cookie value | Required path | Set by |
|---|---|---|---|
| Welcome | `welcome` | `/onboarding/welcome` | Default (no cookie) / Start over |
| Name | `name` | `/onboarding/name` | `identityService.markWelcomeComplete()` |
| Landing | `landing` | `/` | `advanceOnboardingPhase("landing")` on name continue |
| Profile | `profile` | `/onboarding/role` (+ region, interests, tour) | `identityService.markGreetingComplete()` on landing CTA |
| Complete | `complete` | `/dashboard` (+ `/`, `/signals/*`) | `advanceOnboardingPhase("complete")` on tour → dashboard |

**Three layers (do not conflate):**

1. **`middleware.ts`** — Server-side. Runs before page load. Reads cookie. Redirects if path not allowed for phase. **Legacy cookies (`horizoniq_phase_v2`, etc.) are ignored** — unknown cookie → `welcome`.
2. **Inline `<script>` in `app/layout.tsx`** — `ONBOARDING_COOKIE_INIT_SCRIPT`. Sets cookie if missing. Wipes stale localStorage if not strictly complete. Migrates fully complete users to `complete`.
3. **`OnboardingBootstrap` + pages** — Client init. Clears legacy artifacts. Does **not** sync phase from localStorage (that caused skip-ahead bugs).

**localStorage (data only — NOT routing):**

| Key | Purpose |
|---|---|
| `horizoniq.onboarding.v1` | Display name, welcome/landing timestamps, tour choice |
| `horizoniq.preferences.v2` | Role, region, Intelligence Focus Areas |
| `horizoniq-visit-snapshot` | Return-visit signal snapshot |

**Legacy keys cleared on bootstrap:** `horizoniq.identity.v1`, `horizoniq.onboarding.flowVersion`, `horizoniq.preferences.v1`, cookies `horizoniq_phase`, `horizoniq_phase_v1`, `horizoniq_phase_v2`

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

### Guided Tour Flow

```
User chose "guided" on tour page AND guidedTourCompletedAt is null
        ↓
dashboard/page.tsx → shouldShowGuidedTour() → overlay after 900ms
        ↓
guided-tour-overlay.tsx → createPortal(document.body)
   Step 1: data-tour="what-changed"
   Step 2: data-tour="watchlist" (first visit only)
   Step 3: data-tour="next-briefing" (first visit only)
   Step 4: data-tour="recommended-actions" — verify spotlight after scroll-up fix
        ↓
Finish/Skip → markGuidedTourComplete() → persist visit snapshot
```

### Module Map (Onboarding — Key Files)

| Module | Responsibility |
|---|---|
| `middleware.ts` | Server routing guard from cookie phase |
| `lib/onboarding-phase.ts` | Phase types, paths, allowed routes, cookie name |
| `lib/onboarding-cookie.ts` | Client cookie read/write/clear |
| `lib/onboarding-state.ts` | localStorage record, bootstrap, wipe, strict-complete check |
| `lib/onboarding-flow.ts` | Public API: paths, migrate complete users |
| `lib/identity/local-identity-service.ts` | Identity API; sets cookie on welcome/greeting |
| `components/onboarding/onboarding-cookie-init.tsx` | Inline script source |
| `components/onboarding/onboarding-bootstrap.tsx` | Client bootstrap wrapper |
| `components/onboarding/onboarding-start-link.tsx` | Landing CTA; marks greeting on click |
| `components/onboarding/welcome-screen.tsx` | Approved welcome UI (do not redesign) |
| `components/onboarding/guided-tour-overlay.tsx` | 4-step spotlight tour |
| `components/landing/landing-entry-guard.tsx` | Passthrough only (middleware handles access) |

---

## 6. Current File Structure

```
HorizonIQ/
├── middleware.ts                         # ONBOARDING ROUTING GUARD (server)
├── .github/workflows/weekly-briefing.yml
├── .npmrc                                # legacy-peer-deps=true
├── next.config.mjs                       # R3F transpile + React dedupe
├── start-dev.bat
│
├── app/
│   ├── layout.tsx                        # Cookie init script + OnboardingBootstrap
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
│   │   ├── onboarding-cookie-init.tsx
│   │   ├── guided-tour-overlay.tsx
│   │   ├── first-time-shell.tsx, onboarding-shell.tsx, option-card.tsx
│   ├── dashboard/                        # what-changed-hero, signal-card, etc.
│   ├── layout/top-bar.tsx
│   ├── motion/fade-in.tsx
│   ├── theme/, ui/page-loader.tsx
│   └── trust/provenance-badge.tsx
│
├── hooks/
│   ├── use-intelligence-field-params.ts
│   ├── use-reduced-motion.ts
│   └── use-require-identity-onboarding.ts
│
├── lib/
│   ├── onboarding-phase.ts               # Phase enum, paths, cookie name
│   ├── onboarding-cookie.ts              # Cookie helpers
│   ├── onboarding-state.ts               # Storage + bootstrap + wipe
│   ├── onboarding-flow.ts                # Public onboarding API
│   ├── onboarding-bootstrap.ts           # Re-exports clear/bootstrap
│   ├── identity/                         # LocalIdentityService, greeting.ts
│   ├── analytics/, data/, pipeline/
│   ├── intelligence-field/, intelligence.ts
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts
│   ├── trust.ts, types.ts, options.ts, copy.ts, motion.ts
│
├── data/
│   ├── meta.json                         # activeBriefing: 2026-W26
│   ├── catalog/signals.json
│   ├── briefings/2026-W26.json
│   ├── pipeline/, skills.json, jobs.json, recommendations.json
│
├── scripts/
│   ├── pipeline-ingest.ts, pipeline-generate.ts, pipeline-full.ts
│   └── test-onboarding-state.ts          # Phase/middleware unit tests
│
├── VISION.md, PROJECT_MEMORY.md, PROJECT_DECISIONS.md
├── ROADMAP.md, CHANGELOG.md
├── SESSION_HANDOFF_V11.md                # This file
├── SESSION_HANDOFF_V10.md                # Superseded
└── .cursorrules
```

**Deleted / do not restore:** `app/template.tsx`, `lib/onboarding-entry.ts`, `components/onboarding/onboarding-entry-link.tsx`

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

---

## 8. Data Strategy

### Architecture

- **Evergreen catalog:** `data/catalog/signals.json`
- **Weekly briefing:** `data/briefings/{period}.json`
- **Merge:** `lib/data/resolve-signals.ts`
- **Derived:** `skills.json`, `jobs.json`, `recommendations.json`
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
| GitHub REST Search | github.com | `GITHUB_TOKEN` |
| Product Hunt GraphQL v2 | producthunt.com | `PRODUCT_HUNT_TOKEN` |

### Pipeline Commands

```bash
npm run pipeline:ingest
npm run pipeline:generate
npm run pipeline:full
```

Restart `npm run dev` after `pipeline:full` — `briefings-registry.ts` is auto-generated.

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

### Remaining Gaps

- Trust interaction analytics not instrumented
- PostHog funnels not built
- Skills/jobs copy partially templated

### Trust Principles (Locked)

- Label mock vs live explicitly
- Show reasoning, not just scores
- Never overclaim beyond what pipeline ingests
- Curated explanations are honest — activity metrics from live sources when available

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
- Weekly live data via GitHub Actions
- Guided tour when user chooses "guided" (once per `guidedTourCompletedAt`)

### Retention Gaps

- localStorage only — device-bound, no cross-device
- No email/digest
- Week 2 return not measured in PostHog funnels
- Onboarding must work reliably for first-visit habit formation

---

## 11. Known Issues

### 🟡 Onboarding — Verify After `hziq_ob_v3` Deploy

**History:** Stale `localStorage` and legacy cookies (`horizoniq_phase_v2=profile`) caused skipping Welcome/Name/Landing and landing directly on role page ("Who are you here as?").

**Latest fix (`6f040a7`):**

- New cookie `hziq_ob_v3` — old cookies ignored by middleware
- Incomplete onboarding wipes preferences + identity localStorage
- Middleware enforces phase before page load

**Still verify:**

1. Production hard refresh → Welcome screen first (not role)
2. Full flow: Welcome → Name → Landing (salutation) → Build my dashboard → Role → Tour → Dashboard
3. Stale browser with old cookies — should reset to Welcome without manual DevTools clear
4. **Start over** on dashboard — returns to Welcome with clean state

### Guided Tour Step 4

- Step 4 (`recommended-actions`) may fail to spotlight when scrolling back from watchlist steps
- `guided-tour-overlay.tsx` has `scrollWindowToTop: true` + extended measure delays — verify on first-visit guided tour

### Other Known Issues

| Issue | Severity | Notes |
|---|---|---|
| First request vs inline script race | Medium | Middleware runs before HTML; returning complete users may briefly see Welcome before client migrates to `complete` |
| WebGL canvas remounts on navigation | Medium | Performance |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| Stale `.next` cache crashes dev | Medium | Use `npm run dev:clean` |
| Light mode less refined than dark | Low | Dark-first by design |
| Empty states for some focus area combos | Medium | arts, commerce, biochemistry thin |
| Dual client guards + middleware | Low | Dashboard/role pages still have client redirects; should align with cookie only |

### What NOT To Do (Lessons Learned)

- Do **not** use localStorage flags for routing decisions
- Do **not** auto-sync cookie phase from localStorage (caused skip-ahead)
- Do **not** add smart routing that jumps to `/dashboard` from stale prefs
- Do **not** restore `app/template.tsx` opacity animations
- Do **not** change welcome screen design without approval
- Do **not** reuse old cookie names without bumping version suffix

---

## 12. Next 5 Tasks (Priority Order)

### 1. Verify onboarding on Vercel end-to-end (BLOCKER)

Hard refresh production. Walk full flow with fresh + stale browser. Confirm Welcome is first screen. Document any failure with cookie value + URL.

**Verification checklist:**

1. Clear cookies OR use incognito
2. Open `https://horizoniq-beta.vercel.app/` → **Welcome to HorizonIQ**
3. Enter HorizonIQ → Name → Landing (salutation visible) → Build my dashboard → Role → Region → Interests → Tour → Dashboard
4. Guided tour (if chosen) — all 4 steps, step 4 spotlight visible
5. Start over → back to Welcome
6. Test with old `horizoniq_phase_v2=profile` cookie set manually → should still land on Welcome

### 2. Simplify client-side guards to trust middleware only

Remove redundant `useEffect` redirects on role/dashboard/welcome where middleware already enforces phase. Reduces race conditions and loader flashes.

### 3. Fix guided tour step 4 spotlight (isolated)

In `guided-tour-overlay.tsx` only — ensure `[data-tour='recommended-actions']` highlights reliably after steps 2–3. Do not break steps 1–3.

### 4. PostHog funnels + retention measurement

Week 2 return, onboarding step completion (cookie phase transitions), change-hero → signal-detail, guided tour completion/skip.

### 5. Sprint 3C performance stabilization

Single shared WebGL canvas, GPU tier detection, onboarding field continuity on profile steps.

---

## 13. Quick Start for Next Session

```powershell
cd C:\HorizonIQ
git pull
git log -5 --oneline
npm install
npm run dev:clean
```

**Test onboarding:**

```powershell
npx tsx scripts/test-onboarding-state.ts
```

**Browser test (fresh):**

1. Incognito or clear all site data for horizoniq-beta.vercel.app
2. Open `/` → must redirect to `/onboarding/welcome`
3. Walk full flow per Section 12 checklist

**If broken** (`ReactCurrentOwner`, blank pages):

```powershell
Remove-Item -Recurse -Force .next
npm run dev:clean
```

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://us.i.posthog.com` |
| `GITHUB_TOKEN` | Pipeline GitHub source (CI) |
| `PRODUCT_HUNT_TOKEN` | Pipeline Product Hunt source (CI) |

### Client Storage Reference

| Key / Cookie | Purpose |
|---|---|
| `hziq_ob_v3` (cookie) | **Routing phase** — middleware authority |
| `horizoniq.onboarding.v1` (localStorage) | Name, welcome/landing timestamps, tour state |
| `horizoniq.preferences.v2` (localStorage) | Role, region, Intelligence Focus Areas |
| `horizoniq-visit-snapshot` (localStorage) | Return-visit signal snapshot |

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (canonical) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `SESSION_HANDOFF_V10.md` | Superseded — pre-cookie-middleware state |
| `.cursorrules` | Agent engineering + design rules |
| `.env.example` | Pipeline + PostHog tokens |

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
| Onboarding routing: cookie + middleware (`hziq_ob_v3`) | Locked — do not revert to localStorage routing |

---

*End of Session Handoff V11*

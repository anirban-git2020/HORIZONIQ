# HorizonIQ — Session Handoff V10

**Last updated:** 2026-06-28  
**Version:** MVP V1.1 (Change-First)  
**Status:** Active Development — **ONBOARDING REGRESSION — DO NOT DEPLOY UNTIL FIXED**  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V9.md` and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `CHANGELOG.md` → `.cursorrules`

---

## Repo State (2026-06-28)

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Through `87cc677` — Sprints 1–3C, live pipeline, stabilization partial revert (`OnboardingEntryLink` removed, simple `Link` to welcome restored on landing CTAs) |
| **Local uncommitted (NOT on Vercel)** | Onboarding flow rework: `LandingEntryGuard`, `OnboardingStartLink`, `lib/onboarding-entry.ts`, greeting page redirect-only, landing-after-name flow, guided tour step 4 spotlight fix attempt — **user reports welcome screen + personalization still broken** |

**Recent commits (onboarding-related):**

```
87cc677 fix: revert smart onboarding routing that skipped to dashboard
d05e95b fix: restore full onboarding flow before dashboard and guided tour
46fc427 fix: navigation, onboarding reliability, guided tour, and personalization
e8b1a70 feat: Living Intelligence Core (Sprint 3C) with React 19 and guided tour fix
```

**⚠️ Critical:** Do **not** push to Vercel until onboarding is fixed, locally tested, and explicitly approved by the product owner.

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
2. **Personalized onboarding** — role × region × Intelligence Focus Areas within 60 seconds (quick-start path available)
3. **Weekly briefing cadence** — catalog + live pipeline data, refreshed Mondays 06:00 UTC
4. **Return-visit delta** — "What Changed Since Your Last Visit" via localStorage visit snapshot (no login)
5. **Trust without documentation** — labeled sources, provenance, confidence in plain English
6. **Premium first impression** — welcome, name, guided experience before dashboard depth

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

---

## 3. Completed Features

### Deployment & Analytics

- [x] Vercel — `https://horizoniq-beta.vercel.app/`
- [x] Provider-agnostic analytics — `lib/analytics/`
- [x] PostHog optional via `NEXT_PUBLIC_POSTHOG_KEY`
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
- [x] React 19.2.7 + `@react-three/fiber` 9.5.0

### Live Data Pipeline

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full`
- [x] GitHub Actions — Monday 06:00 UTC (`weekly-briefing.yml`)
- [x] Catalog + briefing architecture

### Onboarding (Sprint 1 — partially regressed)

- [x] `IdentityService` — `horizoniq.identity.v1` in localStorage
- [x] Welcome screen component — `WelcomeScreen` with CSS intelligence field
- [x] Name capture — `/onboarding/name`
- [x] Profile steps — role, region, interests (14 focus areas)
- [x] Tour choice — `/onboarding/tour` (guided vs solo)
- [x] Guided tour overlay — 4-step portal-based spotlight tour
- [x] Quick-start on region page — skips interests with role defaults
- [x] Identity guards on profile steps — `useRequireIdentityOnboarding`
- [x] Display name on dashboard — time-of-day salutation (when flow completes)

### Navigation Stabilization (on `main`)

- [x] Removed `app/template.tsx` — fixed blank/invisible client navigations
- [x] `ScrollToTop` in root layout
- [x] `PageLoader` — visible loading during redirects
- [x] Start over — clears identity + preferences + visit snapshot; full-page nav to `/`

---

## 4. Pending Features

### 🔴 BLOCKER — Onboarding & Personalization (see Known Issues)

- [ ] **Restore approved first-time flow** — see Section 11
- [ ] **Restore welcome screen** to product-owner-approved design (no unintended visual/flow changes)
- [ ] **Restore personalization** — name capture + personalized greeting before landing/profile
- [ ] **Fix guided tour step 4 spotlight** — recommended action block must highlight in briefing hero
- [ ] **Single cohesive commit** — only after local sign-off; then deploy to Vercel

### Sprint 3C Stabilization

- [ ] Single shared WebGL canvas across route changes
- [ ] GPU tier detection — auto particle budget
- [ ] WebGL load skeleton
- [ ] Onboarding field continuity on role/region/interests steps

### Guided Tour

- [ ] Return-visit tour step variants (steps 2–3 target first-visit-only elements)
- [ ] Verify step 4 spotlight after onboarding fix (do not break other steps)

### Post-MVP

- [ ] PostHog funnels — Week 2 return, onboarding path, tour completion
- [ ] Product Hunt rate limit hardening (HTTP 429)
- [ ] Broader catalog coverage (arts, commerce, biochemistry)
- [ ] Email weekly digest, user accounts, relationship graphs (Phase 2+)

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
| Client state | localStorage + sessionStorage (onboarding flags) |
| Pipeline | tsx + dotenv |
| CI | GitHub Actions (Node 24) |
| Hosting | Vercel |
| Not in use | Supabase, database, auth, `@react-three/drei`, `app/template.tsx` |

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

### Onboarding Flow — INTENDED (product owner, 2026-06-28)

**This is what the user wants. It is NOT reliably working in the current codebase.**

```
App entry (/) OR explicit CTA
        ↓
① /onboarding/welcome     Welcome to HorizonIQ + tagline + Enter HorizonIQ
        ↓
② /onboarding/name          "What should we call you?"
        ↓
③ / (landing page)          "See what is changing before everyone else does."
        ↓
④ Build my dashboard CTA
        ↓
⑤ /onboarding/role → region → [interests] → /onboarding/tour
        ↓
⑥ /dashboard (+ guided tour if user chose "guided")
```

### Onboarding Flow — ORIGINAL SPRINT 1 (still in PROJECT_MEMORY)

```
welcome → name → greeting (personalized salutation) → role → region → interests → tour → dashboard
```

**Conflict:** Greeting page (`/onboarding/greeting`) was repurposed in uncommitted work to redirect to `/`. The personalized greeting step may be missing entirely.

### Onboarding Flow — CURRENT UNCOMMITTED CODE (fragile)

```
/ (LandingEntryGuard)
   ├─ !welcome → /onboarding/welcome
   ├─ !name    → /onboarding/name
   └─ auto markGreetingComplete() → show landing

/onboarding/name → router.push("/") after name

/lib/onboarding-flow.ts getFirstTimeOnboardingPath():
   welcome → name → "/" (not greeting) → role
```

### Guided Tour Flow (on `main`)

```
User chose "guided" on tour page AND guidedTourCompletedAt is null
        ↓
dashboard/page.tsx → shouldShowGuidedTour() → overlay after 900ms
        ↓
guided-tour-overlay.tsx → createPortal(document.body)
   Step 1: what-changed header
   Step 2: watchlist (first visit only)
   Step 3: next-briefing (first visit only)
   Step 4: recommended-actions StoryAct — KNOWN BUG: spotlight often missing
        ↓
Finish/Skip → markGuidedTourComplete() → persist visit snapshot
```

### Client-Side Storage Keys

| Key | Storage | Purpose |
|---|---|---|
| `horizoniq.preferences.v2` | localStorage | Role, region, focus areas |
| `horizoniq.identity.v1` | localStorage | Display name, welcome/greeting/tour state |
| `horizoniq-visit-snapshot` | localStorage | Return-visit signal snapshot |
| `horizoniq.onboarding.from-landing` | sessionStorage | Force welcome on landing CTA click (uncommitted) |
| `horizoniq.analytics.events.v1` | localStorage | Analytics buffer |
| `horizoniq.theme` | localStorage | Light/dark |

### Module Map (key files)

| Module | Responsibility |
|---|---|
| `lib/onboarding-flow.ts` | Resume paths, `hasCompletedIdentityOnboarding()` |
| `lib/onboarding-entry.ts` | sessionStorage landing-entry flag (uncommitted) |
| `lib/onboarding.ts` | `ONBOARDING_TOUR_PATH`, `trackOnboardingCompleted()` |
| `lib/identity/*` | `LocalIdentityService`, greeting copy |
| `lib/preferences.tsx` | Profile preferences context |
| `lib/personalize.ts` | Dashboard briefing assembly |
| `lib/intelligence.ts` | Analyst reasoning on signals |
| `lib/visit-snapshot.ts` | Return-visit diff |
| `lib/data/*` | Catalog, briefings, access layer |
| `lib/pipeline/*` | Ingest, score, generate |
| `components/onboarding/welcome-screen.tsx` | Welcome UI |
| `components/onboarding/guided-tour-overlay.tsx` | 4-step tour |
| `components/landing/landing-entry-guard.tsx` | Landing access guard (uncommitted) |
| `components/onboarding/onboarding-start-link.tsx` | Landing CTA resolver (uncommitted) |
| `hooks/use-require-identity-onboarding.ts` | Profile step identity guard |

---

## 6. Current File Structure

```
HorizonIQ/
├── .github/workflows/weekly-briefing.yml
├── .npmrc                          # legacy-peer-deps=true
├── next.config.mjs                 # R3F transpile + React dedupe
├── start-dev.bat
│
├── app/
│   ├── page.tsx                    # Landing — wrapped in LandingEntryGuard (uncommitted)
│   ├── layout.tsx                  # Providers + ScrollToTop
│   ├── globals.css
│   ├── dashboard/page.tsx
│   ├── onboarding/
│   │   ├── layout.tsx
│   │   ├── welcome/page.tsx
│   │   ├── name/page.tsx
│   │   ├── greeting/page.tsx       # Redirect-only to / (uncommitted)
│   │   ├── role/page.tsx
│   │   ├── region/page.tsx
│   │   ├── interests/page.tsx
│   │   └── tour/page.tsx
│   └── signals/[id]/page.tsx
│
├── components/
│   ├── brand/                      # logo, beta-badge, tagline-lockup
│   ├── intelligence/                 # IntelligenceCard family
│   ├── intelligence-field/           # Living Intelligence Core (3C)
│   ├── landing/
│   │   ├── landing-hero.tsx
│   │   ├── landing-entry-guard.tsx # uncommitted
│   │   ├── data-trust-panel.tsx, landing-pillars.tsx, why-horizoniq.tsx
│   ├── navigation/scroll-to-top.tsx
│   ├── onboarding/
│   │   ├── welcome-screen.tsx
│   │   ├── onboarding-start-link.tsx  # uncommitted (replaces deleted onboarding-entry-link)
│   │   ├── guided-tour-overlay.tsx
│   │   ├── guided-tour-overlay.tsx    # step 4 fix uncommitted
│   │   ├── first-time-shell.tsx, onboarding-shell.tsx, option-card.tsx
│   ├── dashboard/                  # what-changed-hero, signal-card, etc.
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
│   ├── identity/                   # LocalIdentityService, greeting.ts
│   ├── analytics/, data/, pipeline/
│   ├── intelligence-field/, intelligence.ts
│   ├── onboarding-flow.ts
│   ├── onboarding-entry.ts         # uncommitted
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts
│   ├── trust.ts, types.ts, options.ts, copy.ts, motion.ts
│
├── data/
│   ├── meta.json                   # activeBriefing: 2026-W26
│   ├── catalog/signals.json
│   ├── briefings/2026-W26.json
│   └── pipeline/, skills.json, jobs.json, recommendations.json
│
├── scripts/                        # pipeline CLI
│
├── VISION.md, PROJECT_MEMORY.md, PROJECT_DECISIONS.md
├── ROADMAP.md, CHANGELOG.md
├── SESSION_HANDOFF_V10.md          # This file
├── SESSION_HANDOFF_V9.md           # Superseded
└── .cursorrules
```

**Deleted since V8/V9:** `app/template.tsx`, `components/onboarding/onboarding-entry-link.tsx` (replaced by `onboarding-start-link.tsx` in uncommitted work)

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

### Welcome Screen — APPROVED DESIGN (product owner reference)

The welcome screen **must** match this experience:

- Full-screen dark background with subtle **CSS intelligence field** ambient glow (not WebGL on welcome — reliability)
- Centered: **"HORIZONIQ"** label + **Beta Preview** badge
- Large headline: **"Welcome to HorizonIQ"**
- Animated tagline: **Observe. · Predict. · Lead.**
- Primary CTA: **"Enter HorizonIQ →"**
- Top-right: **Skip** (marks welcome complete, still advances to name)
- Route: `/onboarding/welcome`
- Component: `components/onboarding/welcome-screen.tsx`

**Do not** change this screen's layout, copy, or field mode without explicit approval.

### Landing Page (`/`)

- Hero headline: **"See what is changing before everyone else does."** (`LANDING_HERO_HEADLINE` in `lib/copy.ts`)
- WebGL intelligence field behind hero
- CTA: **Build my dashboard** → profile setup (after identity steps complete)
- Shown **after** welcome + name in the intended flow — **not** as the app's first screen

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
- Curated explanations are honest — activity metrics from live sources when `pipeline`

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

- localStorage only — device-bound
- No email/digest
- Week 2 return not measured in PostHog funnels
- Onboarding breakage blocks first-visit habit formation

---

## 11. Known Issues

### 🔴 CRITICAL — Onboarding & Personalization Regression (2026-06-28)

**Reported by product owner:** Welcome screen has changed from the approved design; personalization flow is broken again after multiple fix attempts across commits `46fc427`, `d05e95b`, `87cc677`, and uncommitted local changes.

#### Symptoms

1. **Welcome screen not shown as first screen** — user expects `/onboarding/welcome` (Welcome to HorizonIQ + tagline + Enter HorizonIQ) before anything else; instead sees landing, role page, dashboard, or guided tour depending on stale `localStorage` and which code path runs
2. **Personalization gone** — name/greeting experience skipped or auto-completed without user seeing personalized content
3. **Guided tour step 4** — shows fallback copy *"Your primary recommended action lives in the briefing hero above"* with **no spotlight highlight** on the recommended action block (full-screen dim only)

#### Root Causes (investigated — do not re-introduce)

| Change | File / Commit | Problem |
|---|---|---|
| `OnboardingEntryLink` smart routing to `/dashboard` when profile in localStorage | `46fc427` | Skipped entire onboarding on landing CTA click |
| Revert to simple `Link` | `87cc677` | Partial fix; stale localStorage still skips welcome |
| `getAvailableSteps()` filtering tour steps | `d05e95b` | Could collapse tour to final step only |
| `LandingEntryGuard` on `/` | uncommitted | Redirects `/` to welcome/name; auto-`markGreetingComplete()` on landing view — **skips personalized greeting page** |
| Greeting page redirect to `/` | uncommitted | Removed dedicated greeting UI (`formatPersonalizedGreeting`) |
| `getFirstTimeOnboardingPath()` returns `/` instead of `/onboarding/greeting` | uncommitted | Identity resume logic conflates landing with greeting completion |
| `sessionStorage` `from-landing` flag | uncommitted | Added complexity; easy to get wrong across navigations |
| Guided tour `measureTarget()` viewport math | uncommitted fix attempt | Step 4 fails when scrolling back from watchlist — element off-screen during measure |
| Tour on every visit (removed `shouldShowGuidedTour`) | `46fc427` | Reverted on `main`; verify current dashboard uses `shouldShowGuidedTour()` |

#### Approved First-Time Flow (product owner — lock this in next session)

```
① Welcome to HorizonIQ     /onboarding/welcome
② What should we call you? /onboarding/name
③ Landing page             /  ("See what is changing before everyone else does.")
④ Build my dashboard       → role → region → interests → tour → dashboard
```

**Optional:** Restore `/onboarding/greeting` as step ③ with personalized salutation + landing headline, then landing as step ④ — **confirm with product owner before implementing**.

#### What NOT to do in the next fix

- Do **not** add smart routing that jumps to `/dashboard` from landing CTAs based on localStorage alone
- Do **not** auto-`markGreetingComplete()` without showing greeting or landing intentionally
- Do **not** filter guided tour steps with `getAvailableSteps()` — use fixed 4 steps + fallback copy
- Do **not** restore `app/template.tsx` opacity animations
- Do **not** push to Vercel until product owner tests full flow locally and approves
- Do **not** change welcome screen visuals without explicit approval
- Make **minimal, focused diffs** — onboarding routing only; do not touch dashboard intelligence, pipeline, or 3C visuals

#### Files most likely involved in the fix

```
app/onboarding/welcome/page.tsx
app/onboarding/name/page.tsx
app/onboarding/greeting/page.tsx          # may need restoration
app/page.tsx
components/landing/landing-entry-guard.tsx
components/onboarding/onboarding-start-link.tsx
components/onboarding/welcome-screen.tsx  # do not redesign — only fix routing TO it
lib/onboarding-flow.ts
lib/onboarding-entry.ts
lib/identity/greeting.ts
components/onboarding/guided-tour-overlay.tsx   # step 4 spotlight only
components/dashboard/what-changed-hero.tsx      # data-tour="recommended-actions"
```

#### Verification checklist for next session

1. Clear all `horizoniq.*` localStorage + sessionStorage (or Start over)
2. Open `http://localhost:3000/` → must land on **Welcome to HorizonIQ** (not landing)
3. Enter HorizonIQ → **What should we call you?**
4. Enter name → **Landing page** with globe + headline
5. Build my dashboard → role → region → interests (or quick-start) → tour choice
6. Choose guided tour → dashboard → complete all **4 tour steps** with visible spotlight on step 4
7. Start over → repeat from step 1
8. Test with **stale localStorage** (pre-filled identity + preferences) — landing CTA must still show welcome → name → landing, not skip to dashboard

### Other Known Issues

| Issue | Severity | Notes |
|---|---|---|
| Uncommitted local changes not on Vercel | High | Production may differ from local |
| Guided tour steps 2–3 missing on return visits | Medium | Watchlist only on first visit |
| WebGL canvas remounts on navigation | Medium | Performance |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| Stale `.next` cache crashes dev | Medium | Use `npm run dev:clean` |
| Light mode less refined than dark | Low | Dark-first by design |
| Empty states for some focus area combos | Medium | arts, commerce, biochemistry thin |

---

## 12. Next 5 Tasks (Priority Order)

### 1. Stabilize onboarding to the approved flow (BLOCKER)

Restore and lock: **Welcome → Name → Landing → Profile → Tour → Dashboard**. Remove or simplify `LandingEntryGuard`, `onboarding-entry.ts` session flags, and auto-greeting logic until the flow is deterministic. **Do not change welcome screen design.** Minimal diff. Local test with fresh + stale localStorage.

### 2. Restore personalization step

Either restore `/onboarding/greeting` with `formatPersonalizedGreeting()` (salutation + *"See what is changing before everyone else does."*) **between name and landing**, OR add equivalent personalized salutation on landing after name — **confirm with product owner**. Do not silently `markGreetingComplete()` on landing mount.

### 3. Fix guided tour step 4 spotlight (isolated change)

In `guided-tour-overlay.tsx` only: ensure `[data-tour='recommended-actions']` highlights after scrolling back from watchlist steps. Uncommitted fix uses viewport intersection + `instantScroll: true` — verify locally; do not break steps 1–3.

### 4. Commit + deploy only after product owner sign-off

Single cohesive commit message. Full smoke test on local → then push to `main` → verify Vercel. Update `CHANGELOG.md`. Do not deploy partial fixes.

### 5. PostHog funnels + retention measurement

Week 2 return, onboarding step completion, change-hero → signal-detail, guided tour completion/skip. Prerequisite: onboarding must work first.

---

## 13. Quick Start for Next Session

```powershell
cd C:\HorizonIQ
git status                    # expect uncommitted onboarding files
npm install
npm run dev:clean             # or .\start-dev.bat
```

**Test onboarding (clear state first):**

1. DevTools → Application → Local Storage → delete all `horizoniq.*`
2. DevTools → Session Storage → clear
3. Open `http://localhost:3000/`
4. Walk through full flow per Section 11 checklist

**If broken** (`ReactCurrentOwner`, blank pages):

```powershell
# Stop all next dev processes
Remove-Item -Recurse -Force .next
npm run dev:clean
```

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://us.i.posthog.com` |

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (canonical) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `SESSION_HANDOFF_V9.md` | Superseded — onboarding state outdated |
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
| Welcome screen design (see Section 7) | Locked — do not change without approval |
| First-time flow: Welcome → Name → Landing → Profile | **Required** — not reliably implemented |

---

*End of Session Handoff V10*

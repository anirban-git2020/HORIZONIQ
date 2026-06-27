# HorizonIQ — Session Handoff V9

**Last updated:** 2026-06-28  
**Version:** MVP V1.1 (Change-First) + Live Pipeline + Sprints 1–3C + Stabilization Pass  
**Status:** Active Development — **Sprint 3C on `main` (`e8b1a70`)** + **local uncommitted stabilization fixes**  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V8.md`, `SESSION_HANDOFF_V7.md`, and earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Repo state (2026-06-28):**

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Sprints 1–3C: onboarding, intelligence reasoning, dashboard IA, premium visual system, Living Intelligence Core, React 19 + R3F v9.5, analytics, trust labeling, live pipeline, guided tour portal fix (`e8b1a70`) |
| **Local uncommitted** | Navigation/onboarding stabilization: removed `app/template.tsx`, `ScrollToTop`, `PageLoader`, `OnboardingEntryLink` (full-page nav), simplified welcome screen, smart entry routing, identity guards on profile steps, display name on dashboard, Start over fix, guided tour step 4 highlight + tour-on-every-visit |

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `CHANGELOG.md` → `.cursorrules`

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Sprint 3C elevation:** HorizonIQ is a **Personal Intelligence Operating System** — not a dashboard. The signature visual is the **Living Intelligence Core**: an abstract, data-reactive intelligence field (wireframe mesh + sparse nodes — not a globe, brain, or neural-network cliché).

**Core product principle:**

> Users do not return for signals. Users return for **changes in signals**.

**Intelligence positioning (Sprint 2.5A):**

> HorizonIQ must behave like an **intelligence analyst**, not a trend aggregator.

**Experience goals:**

- Feel like *"Your personal future analyst who tells you what changed."*
- Users should **pause** on arrival — intelligence, confidence, discovery
- UI feels **alive** without becoming distracting or unreadable
- Text must remain legible over all visual effects
- Personalization is visible: name, role, region, Intelligence Focus Areas
- Guided tour offered on **every dashboard visit** — user skips or completes

**Target users:** Student · Professional · Entrepreneur · Investor

**Design inspiration:** Apple · Linear · Stripe · Notion · Bloomberg · Raycast

**Explicitly avoid:** Cyberpunk aesthetics · neon effects · crypto dashboards · relationship graphs (MVP) · community features (MVP) · dashboard overload · AI hype language · copying Draftly layouts verbatim

**Feature retention filter (every new feature):**

> Does this give the user a reason to come back next week?

**IA goal (Sprint 3A):** User understands the dashboard in **under 15 seconds** via one story: What changed → Why it matters → What to do.

**Visual goal (Sprint 3B):** Premium, dark-first, typography-led — intelligence made beautiful.

**Immersive goal (Sprint 3C):** One memorable signature visual — Living Intelligence Core — that breathes and reacts to real briefing data without obscuring content.

---

## 2. Completed Features

### Deployment & Analytics (on `main`)

- [x] **Vercel deployment** — `https://horizoniq-beta.vercel.app/`
- [x] **Provider-agnostic analytics** — `lib/analytics/`
- [x] **PostHog** — optional via `NEXT_PUBLIC_POSTHOG_KEY`
- [x] **Events:** `onboarding_started`, `onboarding_role_selected`, `onboarding_region_selected`, `onboarding_completed`, `dashboard_viewed`, `change_hero_viewed`, `signal_click`, `signal_detail_viewed`, `start_over`, `guided_tour_completed`
- [x] **ThemeToggle hydration fix**
- [x] **`<body suppressHydrationWarning>`** — extension attribute mismatches

### Landing (`/`)

- [x] Hero: *"See what is changing before everyone else does."*
- [x] Provenance badge + honest subheadline (live sources when `pipeline`)
- [x] **DataTrustPanel**, pillars, **Why HorizonIQ?**
- [x] **TaglineLockup** + **BetaBadge** (Sprint 3B)
- [x] **OnboardingEntryLink** — smart CTA routing + full-page navigation (local)
- [x] Intelligence field background — WebGL with CSS fallback (Sprint 3C)

### Sprint 1 — Premium First-Time Onboarding (on `main`, polished locally)

- [x] Welcome, name, greeting, tour choice, guided tour overlay
- [x] **IdentityService** — `horizoniq.identity.v1`
- [x] **`getFirstTimeOnboardingPath()`** + **`getOnboardingEntryPath()`** resume routing (local)
- [x] Onboarding compression — quick-start, `ROLE_DEFAULT_INTERESTS`, tour gate
- [x] Identity guards on dashboard, tour, signal detail, welcome/name/greeting, role/region/interests (local)

### Guided Tour (on `main`, enhanced locally)

- [x] **4-step tour** — briefing hero → watchlist → next briefing → recommended action
- [x] **SVG mask spotlight** with highlight ring
- [x] **`createPortal` to `document.body`** — fixed positioning works reliably
- [x] **Decoupled scroll from measure** — scroll once per step; re-measure on scroll/resize
- [x] **Viewport-safe card placement**
- [x] **Step 4 highlight fix** — `data-tour` on full action `StoryAct`; extended measure delays + `scrollBlock: "start"` (local)
- [x] **Tour on every dashboard visit** — user skips or finishes each time (local)
- [x] **Keyboard support** — Esc skips, Enter/→ advances
- [x] Visit snapshot deferred until tour dismissed

### Navigation & Onboarding Stabilization (local — uncommitted)

- [x] **Removed `app/template.tsx`** — fixed blank/invisible pages on client-side navigation (`animate-page-in` opacity trap)
- [x] **`ScrollToTop`** in root layout — scroll resets on route change
- [x] **`PageLoader`** — visible loading state instead of blank `null` screens
- [x] **`OnboardingEntryLink`** — `window.location.assign()` at click time for reliable navigation
- [x] **Simplified welcome screen** — static headline + tagline always visible; CSS field (no timed phase hide)
- [x] **`app/onboarding/layout.tsx`** — `min-h-dvh` background on all onboarding routes
- [x] **Start over** — full-page navigation to landing; clears identity + preferences + visit snapshot
- [x] **`useRequireIdentityOnboarding`** — profile steps cannot skip name/greeting

### Personalization (local)

- [x] **Display name on dashboard** — time-of-day salutation on first + return visits
- [x] **Stricter `getDisplayName()`** — empty/whitespace names treated as missing

### Live Data Pipeline (on `main`)

- [x] 5-source ingest: Hacker News, arXiv, Wikimedia, GitHub, Product Hunt
- [x] `npm run pipeline:ingest` | `pipeline:generate` | `pipeline:full`
- [x] **GitHub Actions** — Monday 06:00 UTC (`weekly-briefing.yml`)
- [x] Catalog + briefing architecture

### Trust (on `main`)

- [x] Provenance badges, `DataTrustPanel`, honest copy via `lib/trust.ts`
- [x] Dashboard footer — provenance, period, updated date
- [x] **Clickable source URLs** — pipeline `url` + `resolveSourceUrl()` label fallback
- [x] Confidence explanation prose on every signal

### Sprint 2.5 / 2.5A — Intelligence Quality & Reasoning (on `main`)

- [x] **`lib/intelligence.ts`** — reasoning builders, outlook, confidence tiers
- [x] **`IntelligenceCard`** + section/evidence subcomponents
- [x] Seven-part analyst contract on signal detail
- [x] Source `url` on `DataSource`; pipeline preserves observation URLs

### Sprint 3A — Information Architecture (on `main`)

- [x] Story-driven hero: What changed → Why it matters → What to do
- [x] **`StorySection`**, **`DashboardContextBar`**, **`DisclosurePanel`**
- [x] Single-question dashboard cards
- [x] **Intelligence Focus Areas** label (not "Interests" in UI)

### Sprint 3B — Premium Visual Experience (on `main`)

- [x] Dark-first premium palette, Outfit + Inter typography
- [x] **`BetaBadge`**, **`TaglineLockup`**, `lib/motion.ts`
- [x] Hairline surfaces, flat PremiumCard, reduced card noise

### Sprint 3C — Immersive Intelligence Experience (on `main`)

- [x] **Living Intelligence Core** — R3F + GLSL wireframe mesh + sparse particles
- [x] **`IntelligenceFieldLayer`** — lazy WebGL + CSS fallback + error boundary
- [x] **`IntelligenceFieldOverlay`** — readability scrims
- [x] Data-reactive uniforms (energy, confidence, region, role, focus areas)
- [x] WebGL on landing, dashboard, signal detail; CSS on welcome (local)
- [x] **React 19.2.7** + **@react-three/fiber 9.5.0**
- [x] **`next.config.mjs`**, **`.npmrc`**, **`start-dev.bat`**, **`npm run dev:clean`**

### Retention Infrastructure (on `main`)

- [x] Visit snapshot — `horizoniq-visit-snapshot`
- [x] `isReturnVisitForPeriod()` — same-week return diff
- [x] First visit: Week 1 hero + watchlist; return visit: full story + depth sections

---

## 3. Pending Features

### Commit & Deploy (Highest Priority)

- [ ] **Commit local stabilization pass** (navigation, onboarding, tour, personalization)
- [ ] **Push → Vercel** and smoke-test production
- [ ] Verify PostHog env vars after deploy

### Sprint 3C Stabilization

- [ ] **Single shared WebGL canvas** across route changes
- [ ] **GPU tier detection** — auto particle budget + quality presets
- [ ] **WebGL load skeleton** — match CSS fallback until shaders compile
- [ ] **Dev FPS overlay**
- [ ] Onboarding field continuity on role/region/interests steps
- [ ] Re-enable WebGL welcome field once navigation is fully stable (optional)

### Guided Tour — Return Visit UX

- [ ] **Return-visit tour steps** — steps 2–3 target watchlist/next-briefing which only exist on first visit; add return-visit step variants or skip gracefully

### Post-Sprint Polish

- [ ] **PostHog funnels** — Week 2 return, onboarding path, change-hero → signal-detail, guided tour completion/skip rates
- [ ] **Product Hunt rate limit hardening** — HTTP 429 → `stale`
- [ ] **Landing section pass** — pillars/trust panel aligned with 3B/3C
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

- Google Trends scrapers, GitHub Trending scrapers, paid APIs, Reddit API, LLM in pipeline, `@react-three/drei`

---

## 4. Current Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15.5.19** (App Router) |
| Language | **TypeScript** (strict) |
| UI | **React 19.2.7** |
| Styling | **Tailwind CSS** + shadcn/ui patterns |
| Typography | **Outfit** (headings) + **Inter** (body) |
| Motion | **Framer Motion** + `lib/motion.ts` tokens |
| 3D | **Three.js 0.185** + **@react-three/fiber 9.5** + GLSL shaders |
| Analytics | **posthog-js** (optional) + `lib/analytics` local buffer |
| Client state | **localStorage** — preferences, identity, visit snapshot, analytics |
| Pipeline CLI | **tsx** + **dotenv** |
| CI data refresh | **GitHub Actions** (Node 24) |
| Hosting | **Vercel** |
| Not in use | Supabase, database, user auth, `@react-three/drei`, `app/template.tsx` (removed) |

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
        ├─ css  → intelligence-field-fallback.tsx + intelligence-field-overlay.tsx
        └─ webgl → dynamic import → living-intelligence-core.tsx
                      ├─ intelligence-field-mesh.tsx (wireframe icosahedron)
                      └─ intelligence-field-points.tsx (sparse GLSL particles)
```

### Onboarding Entry Flow (local)

```
Landing CTA (OnboardingEntryLink)
        ↓
window.location.assign(destination)   ← full-page nav (reliable)
        ↓
getOnboardingEntryPath(isProfileComplete)
        ├─ identity incomplete → getFirstTimeOnboardingPath() (welcome/name/greeting/role)
        ├─ profile complete    → /dashboard
        └─ profile incomplete  → /onboarding/role
```

### Guided Tour Flow (current)

```
Every dashboard visit (hydrated + profile complete)
        ↓
dashboard/page.tsx               → setGuidedTourActive(true) after 900ms
        ↓
guided-tour-overlay.tsx          → createPortal(..., document.body)
        ├─ Step change: scrollIntoView ONCE per target
        ├─ Measure: getBoundingClientRect (never re-scrolls)
        ├─ Step 4: scrollBlock "start" + extended measure delays
        ├─ Spotlight: SVG mask cutout + ring highlight
        └─ Card: viewport-safe placement
        ↓
User Skip or Finish → guided_tour_completed event → persist visit snapshot
```

**Important:** `app/template.tsx` was **removed**. Do not re-add CSS page-in opacity animations on a layout wrapper — they caused invisible pages on client navigation.

### Personalization Flow

```
Identity: welcome → name → greeting (horizoniq.identity.v1)
Profile:  role → region → interests → tour (horizoniq.preferences.v2)
        ↓
lib/personalize.ts + lib/intelligence.ts
        ↓
Dashboard + Signal Detail (IntelligenceCard)
        ↓
Display name salutation on dashboard (local)
```

### Module Map

| Module | Responsibility |
|---|---|
| `lib/types.ts` | Core interfaces (`SignalView`, `SignalIntelligence`, preferences) |
| `lib/options.ts` | Roles, regions, focus areas, `ROLE_EXPERIENCE`, defaults |
| `lib/copy.ts` | User-facing labels, tagline, beta badge copy |
| `lib/motion.ts` | Premium easing/duration tokens |
| `lib/intelligence.ts` | Analyst reasoning assembly |
| `lib/intelligence-field/*` | Living Core params, shaders, WebGL probe |
| `lib/trust.ts` | Provenance, disclaimers, `resolveSourceUrl()` |
| `lib/data/*` | Schemas, access, resolve-signals, briefings-registry |
| `lib/personalize.ts` | Dashboard business logic |
| `lib/visit-snapshot.ts` | Return-visit diff |
| `lib/preferences.tsx` | Profile preferences context |
| `lib/identity/*` | IdentityService (Sprint 1) |
| `lib/onboarding-flow.ts` | Entry path + identity completion guards |
| `lib/analytics/*` | Event taxonomy, track, PostHog |
| `lib/pipeline/*` | Ingest, score, generate briefing |
| `hooks/use-intelligence-field-params.ts` | Signals + prefs → field uniforms |
| `hooks/use-reduced-motion.ts` | `prefers-reduced-motion` detection |
| `hooks/use-require-identity-onboarding.ts` | Redirect if name/greeting incomplete (local) |
| `components/navigation/scroll-to-top.tsx` | Scroll reset on route change (local) |
| `components/onboarding/onboarding-entry-link.tsx` | Smart CTA + full-page nav (local) |
| `components/ui/page-loader.tsx` | Visible loading shell (local) |

### Next.js Config (`next.config.mjs`)

- `transpilePackages: ["three", "@react-three/fiber"]`
- Client-only webpack alias deduping `react`, `react-dom`, jsx runtimes
- Dev `snapshot.managedPaths` for `node_modules`
- Required for R3F on Next.js 15 — prevents `ReactCurrentOwner` errors

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

## 5. Current File Structure

```
HorizonIQ/
├── .github/workflows/
│   └── weekly-briefing.yml
├── .npmrc                               # legacy-peer-deps=true
├── next.config.mjs                      # R3F transpile + React dedupe
├── start-dev.bat                        # Kill port 3000, clear cache, open browser
│
├── app/
│   ├── page.tsx                         # Landing — OnboardingEntryLink CTAs
│   ├── layout.tsx                       # Providers + ScrollToTop (local)
│   ├── globals.css                      # Design tokens, premium palette
│   ├── dashboard/page.tsx               # Story hero + tour every visit + field
│   ├── onboarding/
│   │   ├── layout.tsx                   # min-h-dvh wrapper (local)
│   │   ├── welcome/page.tsx             # WelcomeScreen or resume redirect
│   │   ├── name/page.tsx
│   │   ├── greeting/page.tsx
│   │   ├── role/page.tsx                # identity guard (local)
│   │   ├── region/page.tsx              # identity guard (local)
│   │   ├── interests/page.tsx           # identity guard (local)
│   │   └── tour/page.tsx
│   └── signals/[id]/page.tsx            # Full IntelligenceCard + field
│
├── components/
│   ├── analytics/analytics-provider.tsx
│   ├── brand/                           # logo, beta-badge, tagline-lockup
│   ├── intelligence/                    # IntelligenceCard family (2.5A)
│   ├── intelligence-field/              # Living Intelligence Core (3C)
│   ├── landing/                           # hero, pillars, data-trust-panel
│   ├── navigation/
│   │   └── scroll-to-top.tsx            # (local)
│   ├── onboarding/
│   │   ├── welcome-screen.tsx           # Static welcome + CSS field (local)
│   │   ├── onboarding-entry-link.tsx    # Smart CTA (local)
│   │   ├── guided-tour-overlay.tsx      # Portal + SVG spotlight
│   │   ├── first-time-shell.tsx
│   │   ├── onboarding-shell.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── what-changed-hero.tsx        # Story acts + data-tour targets
│   │   ├── signals-we-are-tracking.tsx  # Watchlist (first visit only)
│   │   ├── baseline-briefing-banner.tsx # Name salutation (local)
│   │   └── ...
│   ├── layout/                          # top-bar, backgrounds
│   ├── motion/                          # fade-in (immediate prop)
│   ├── theme/, ui/
│   │   └── page-loader.tsx              # (local)
│   └── trust/provenance-badge.tsx
│
├── hooks/
│   ├── use-intelligence-field-params.ts
│   ├── use-reduced-motion.ts
│   └── use-require-identity-onboarding.ts  # (local)
│
├── lib/
│   ├── identity/                        # LocalIdentityService
│   ├── analytics/
│   ├── data/
│   ├── pipeline/
│   ├── intelligence-field/
│   ├── intelligence.ts
│   ├── onboarding-flow.ts               # getOnboardingEntryPath (local)
│   ├── personalize.ts, preferences.tsx, visit-snapshot.ts
│   ├── trust.ts, types.ts, options.ts, copy.ts, motion.ts, utils.ts
│   └── ...
│
├── data/
│   ├── meta.json                        # activeBriefing: 2026-W26
│   ├── catalog/signals.json
│   ├── briefings/2026-W26.json
│   ├── pipeline/observations/, scores/
│   └── skills.json, jobs.json, recommendations.json, regions.json
│
├── scripts/                             # pipeline-ingest, generate, full
│
├── VISION.md
├── PROJECT_MEMORY.md
├── PROJECT_DECISIONS.md
├── ROADMAP.md, CHANGELOG.md
├── SESSION_HANDOFF_V9.md                # This file
├── SESSION_HANDOFF_V8.md                # Superseded
└── .cursorrules
```

**Removed since V8:** `app/template.tsx` (caused navigation bugs — do not restore without fixing opacity animation)

---

## 6. UI Decisions

### Design Principles (`.cursorrules`)

1. Simplicity → Clarity → Performance → Scalability → Accessibility  
2. Intelligence must be beautiful; every element communicates meaning  
3. Animation serves comprehension — never decoration at the cost of readability  
4. User understands the page within **10–15 seconds**  
5. Premium, calm, trustworthy — Apple / Linear / Stripe quality  
6. **Never prioritize visual effects over usability**

### Visual Language (Sprint 3B+)

| Token / component | Purpose |
|---|---|
| `display-title` | Primary hero headlines (Outfit) |
| `section-title` | Secondary headings |
| `label-caps` | Section eyebrows |
| `prose-lead` | Lead paragraphs |
| `tagline-line` | Observe · Predict · Lead |
| `PremiumCard` | Elevated surfaces (`flat` variant reduces noise) |
| `BetaBadge` | "Beta Preview" |
| `TaglineLockup` | Reusable tagline typography |
| Change badges | New · Rising · Falling · Stable |
| Provenance badges | Live · Mixed · Sample |
| `IntelligenceFieldOverlay` | Readability scrims over WebGL |
| Living Intelligence Core | Wireframe mesh + sparse nodes |

### Color (Sprint 3B)

- **Dark-first** — default theme `dark` on `<html>`
- Deep background: `228, 44%, 4%`
- Restrained teal primary: `196 58% 48%`
- Light mode companion via ThemeToggle

### Welcome Screen (local — simplified)

- **Always visible:** Welcome to HorizonIQ + TaglineLockup + Enter HorizonIQ + Skip
- **CSS field only** on welcome (`mode="css"`) — reliability over spectacle
- **`min-h-dvh`** layout — no `position: fixed` (avoids transform traps)

### Navigation (local — critical)

- **No page-wrapper opacity animations** — caused blank screens on client nav
- **Full-page navigation** for onboarding CTAs via `OnboardingEntryLink`
- **`ScrollToTop`** on every route change
- **`PageLoader`** instead of returning `null` during guard redirects

### Sprint 3A — Dashboard IA

| Principle | Implementation |
|---|---|
| One primary message | Hero story acts — no competing header |
| Progressive disclosure | Skills/opportunities in `DisclosurePanel` |
| One story | Hero: changed → matters → action |
| One question per card | `SignalCard focus="why"` |
| Intelligence Focus Areas | Replaces "Interests" in UI |

### Guided Tour

| Decision | Rationale |
|---|---|
| Portal to `document.body` | Escapes any transformed ancestor |
| Tour every dashboard visit | User chooses skip or finish each time |
| Step 4 targets full `StoryAct` | Single-line `<p>` was too small to highlight |
| Step 4 `scrollBlock: "start"` | Scrolls back to hero action after watchlist steps |
| Visit snapshot after tour | Avoids diffing before user sees baseline |

### Page-Specific Layout

| Surface | First visit | Return visit |
|---|---|---|
| Hero title | Week 1 Briefing | What Changed Since Your Last Visit |
| Name salutation | In baseline banner | Above hero |
| Watchlist | Yes | No |
| Signal grid (why cards) | No | Yes |
| Supporting disclosure | No | Yes |
| Guided tour | Yes (every visit, local) | Yes (every visit, local) |

### Guided Tour Targets (`data-tour`)

| Attribute | Element | Step |
|---|---|---|
| `what-changed` | Briefing hero `<header>` | 1 |
| `watchlist` | Watchlist header section | 2 (first visit only) |
| `next-briefing` | "Your next briefing will reveal:" | 3 (first visit only) |
| `recommended-actions` | Full action `StoryAct` in hero | 4 |

---

## 7. Data Strategy

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
npm run pipeline:ingest
npm run pipeline:generate
npm run pipeline:full
```

**Important:** Restart `npm run dev` after `git pull` or `pipeline:full` — `briefings-registry.ts` is auto-generated.

### Data Provenance

| Value | UI label |
|---|---|
| `pipeline` | Live intelligence |
| `pipeline-mock` | Mixed live + sample data |
| `curated-mock` | Sample briefing |

---

## 8. Trust Strategy

### Implemented

- Honest landing copy — real pipeline sources only  
- Provenance badges — Live / Mixed / Sample  
- `DataTrustPanel` on landing  
- Dashboard footer — provenance, period, updated, refresh schedule  
- Signal detail + IntelligenceCard evidence — labeled sources  
- **Clickable source URLs** (pipeline `url` or search fallback)  
- Confidence tiers in plain English — High / Medium / Low  
- Outlook clearly labeled **projection**, not fact  
- Living Intelligence Core is decorative (`aria-hidden`) — does not imply fake live data  

### Remaining Gaps

| Gap | Severity |
|---|---|
| Pipeline source health not shown to users | Low |
| Skills/jobs copy partially templated | Low |
| PostHog blocked by ad blockers | Low |
| Trust interaction analytics not instrumented | Medium |

### Trust Principles (Locked)

- Label mock vs live explicitly  
- Show reasoning, not just scores  
- Never overclaim beyond what pipeline ingests  
- Curated explanations are honest — activity metrics from live sources when `pipeline`  
- No AI-generated hype in reasoning copy  

---

## 9. Retention Strategy

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
| Guided tour | Every dashboard visit (local) |
| Personalization | Name salutation + role × region × focus areas |
| Full intelligence depth | Signal detail page |

### Retention Gaps

| Gap | Impact |
|---|---|
| localStorage only | Device-bound; no cross-device |
| No email/digest | No off-device pull |
| No action follow-up | No closed loop from last week's action |
| Week 2 return not measured in PostHog | Cannot validate MVP hypothesis |
| Tour steps 2–3 missing on return visits | Weaker tour on revisit |

### Retention Metrics (MVP Success)

| Metric | Status |
|---|---|
| Week 2 return rate | Instrumented — funnels not built |
| Change hero engagement | Instrumented — `change_hero_viewed` |
| Signal detail from change | Instrumented — `signal_click` + source |
| Time to first actionable insight (< 60s) | Partially met |
| 15-second dashboard comprehension | Shipped IA — not measured |

---

## 10. Known Issues

### Product / UX

| Issue | Severity | Notes |
|---|---|---|
| **Local stabilization uncommitted** | **High** | Production lacks navigation/tour/personalization fixes |
| Guided tour steps 2–3 absent on return visits | Medium | Watchlist only on first visit |
| Tour every visit may feel repetitive | Low | By design — user skips; monitor analytics |
| 60-second promise vs full first-time flow | Medium | Quick-start mitigates |
| Empty states for some focus area combos | Medium | arts, commerce, biochemistry thin |
| Light mode less refined than dark | Low | Dark-first by design |

### Technical

| Issue | Severity | Notes |
|---|---|---|
| Stale `.next` cache crashes dev | Medium | Use `npm run dev:clean` or `start-dev.bat` |
| Multiple dev servers on port 3000 | Medium | `start-dev.bat` kills stale process |
| WebGL canvas remounts on navigation | Medium | Performance — needs shared canvas |
| `briefings-registry.ts` must regenerate each new week | Low | Automated by pipeline |
| Product Hunt HTTP 429 in CI | Medium | Source marked `stale` |
| PostHog `NEXT_PUBLIC_*` build-time | Low | Redeploy after env change |
| Do **not** restore `app/template.tsx` opacity animation | **High** | Caused invisible pages on client nav |

### Data

| Issue | Severity | Notes |
|---|---|---|
| Catalog explanations curated, not LLM-generated | By design | Activity metrics live |
| Single briefing week until next Monday pipeline | Low | `2026-W26` active |

---

## 11. Next 5 Tasks (Priority Order)

### 1. Commit and deploy stabilization pass

**Why:** Production is on `e8b1a70` (Sprint 3C) but missing navigation fixes, onboarding reliability, tour improvements, and display name.  
**Do:** Stage all local changes, commit with clear message, push `main`, verify Vercel build, smoke-test full flow: landing → welcome → name → greeting → role → dashboard → guided tour (all 4 steps) → Start over.

### 2. Guided tour return-visit step variants

**Why:** Steps 2–3 target first-visit-only watchlist elements; return visits show fallback copy without spotlight.  
**Do:** Add conditional tour steps for return visits (e.g. signal grid, disclosure, or skip steps 2–3 when targets missing).

### 3. PostHog funnels and retention insights

**Why:** MVP validates habit — need Week 2 return, tour skip vs complete rates, change-hero → signal-detail.  
**Do:** Create PostHog dashboards for primary metrics; confirm events fire on production.

### 4. Stabilize WebGL performance (shared canvas + GPU tier)

**Why:** WebGL remounts on landing, dashboard, signal detail — performance risk on lower-end devices.  
**Do:** Single shared WebGL context across routes; GPU tier detection for particle budget.

### 5. Broader catalog coverage + trust instrumentation

**Why:** Sparse focus areas produce empty states; trust interactions unmeasured.  
**Do:** Add catalog signals for under-covered interests; instrument source clicks and evidence expand.

---

## 12. Project Memory (Condensed)

*For full spec, read `PROJECT_MEMORY.md`.*

### Core Principle

HorizonIQ is a **signal change platform**. Users return for **changes in signals**, not static feeds.

### Retention Test

> Does this give the user a reason to come back next week?

### Target Users

| User | Core questions |
|---|---|
| Student | What to learn? Growing jobs? What technologies matter? |
| Professional | What skills to add? What trends affect my role? |
| Entrepreneur | What to build? Which markets growing? |
| Investor | Where is the next opportunity? |

### Intelligence Layer

**Dashboard story (3A):** What changed → Why it matters → What to do.

**Signal intelligence (2.5A):** Seven-question `IntelligenceCard` on detail; single-question cards on dashboard.

**Living Core (3C):** Data-reactive wireframe field; WebGL on landing/dashboard/signal detail; CSS on welcome.

**Personalization:** Role × Region × Intelligence Focus Areas (14 predefined, multi-select) + display name.

### Onboarding Flow

```
Landing (Build my dashboard / Get started)
  → welcome → name → greeting → role → region
  → [interests] OR quick-start
  → tour choice → dashboard (+ guided tour every visit)
```

**Smart entry:** Returning users with complete profile go directly to `/dashboard`.

**Quick-start:** Skips interests with role defaults.

### Intelligence Focus Areas (14)

**Technology:** AI, Robotics, Quantum, Cybersecurity, Cloud  
**Industry:** Manufacturing, Supply Chain, Healthcare, Finance, Energy  
**Science (student):** Biotechnology, Biochemistry, Life Sciences  
**Arts & Commerce (student):** Arts, Commerce  
**Business:** Entrepreneurship, Startups, VC, Product Management  

*(Route: `/onboarding/interests`; internal key: `interests`.)*

### MVP Priority Stack

1. Change metadata in JSON datasets ✓  
2. Visit snapshot in localStorage ✓  
3. "What Changed For You" hero ✓  
4. Personalized explanations ✓  
5. Reframe skills/opportunities/actions ✓  
6. Signal detail (change-first) ✓  
7. Remove relationship graphs ✓  
8. Living Intelligence Core (3C) ✓  
9. Navigation/onboarding reliability (local) — **commit pending**  
10. Retention measurement (PostHog funnels) — **not built**

### Non-Negotiables

- No login required for MVP  
- No dashboard overload  
- No fake data without labels  
- No relationship graphs in MVP  
- Every screen reinforces: what changed, why it matters, what to do  
- User understands page in under 15 seconds  
- Visual effects must not block page load or obscure text  
- **Do not use layout-level opacity animations that start at opacity 0**

### How the Product Remembers You (No Login)

| Storage key | Remembers |
|---|---|
| `horizoniq.identity.v1` | Name, welcome/greeting completion, tour timestamps |
| `horizoniq.preferences.v2` | Role, region, Intelligence Focus Areas |
| `horizoniq-visit-snapshot` | Signal state at last visit for change diff |

Display name shown on dashboard via time-of-day salutation (local).

**Start over** on dashboard clears all three and returns to landing via full-page navigation.

### Strategic Context (Locked)

| Decision | Status |
|---|---|
| Signal change platform, not signal platform | Locked |
| Intelligence analyst, not trend aggregator | Locked |
| Dashboard story: changed → matters → action | Locked |
| Intelligence Focus Areas (not "Interests" in UI) | Locked |
| Dark-first premium visual system | Locked |
| Living Intelligence Core as signature visual | Locked |
| Guided tour portals to document.body | Locked |
| No `app/template.tsx` opacity page transitions | Locked (removed) |
| Guided tour offered every dashboard visit | Locked (local) |
| Full-page nav for onboarding CTAs | Locked (local) |
| No auth for MVP | Locked |
| Five free pipeline sources | Locked |
| LLM summarization — not in pipeline | Locked |
| Relationship graphs — post-MVP | Locked |

---

## 13. Quick Start for Next Session

### Run Locally

```powershell
cd C:\HorizonIQ
git pull
copy .env.example .env.local          # first time
npm install
```

**Recommended (Windows):**

```powershell
.\start-dev.bat
```

Or:

```powershell
npm run dev:clean
```

**If broken** (`ReactCurrentOwner`, blank pages, `ENOENT _document.js`):

1. Stop all `next dev` processes  
2. `Remove-Item -Recurse -Force .next`  
3. `npm run dev:clean`

### Test Full First-Time Flow

1. Clear localStorage (or Start over on dashboard)  
2. Landing → **Build my dashboard**  
3. Welcome (headline + tagline visible) → Enter → Name → Greeting  
4. Role → Region → Continue (pick focus areas) OR Quick start  
5. Tour choice → Dashboard  
6. Complete or skip **4-step guided tour** (step 4 highlights full action block)  
7. Return to `/dashboard` → tour appears again  

### Test Start Over

Dashboard → **Start over** → lands on landing with clean state.

### Vercel Environment Variables

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://us.i.posthog.com` |

Redeploy after changing `NEXT_PUBLIC_*` vars.

---

## 14. Recent Git History

```
e8b1a70 feat: Living Intelligence Core (Sprint 3C) with React 19 and guided tour fix
44c1c84 feat: premium visual experience (Sprint 3B) and IA polish
a43eeaa feat: intelligence reasoning layer, dashboard IA, and onboarding fixes
42fd6c7 feat: Sprint 1 premium onboarding, compression, and handoff V5
ef7e983 feat: add analytics instrumentation with optional PostHog
```

**Local uncommitted:** Navigation stabilization (removed template), onboarding entry link, welcome simplification, identity guards, display name on dashboard, Start over fix, guided tour step 4 + every-visit tour, PageLoader, ScrollToTop.

---

## 15. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision statement |
| `PROJECT_MEMORY.md` | Living product spec (canonical) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history |
| `data/README.md` | Weekly refresh checklist |
| `.env.example` | Pipeline + PostHog tokens |
| `.cursorrules` | Agent engineering + design rules |
| `SESSION_HANDOFF_V8.md` | Superseded handoff |

---

*End of Session Handoff V9*

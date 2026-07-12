# HorizonIQ — Session Handoff V19

**Last updated:** 2026-07-07  
**Version:** MVP V1.1 (Change-First) + Intelligence Exchange (Epic 4–7) + Living Intelligence Field (Epic 5)  
**Status:** Active Development — **Intelligence Exchange + Focus Mode** on `feature/intelligence-exchange-ui` (local, **uncommitted**)  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V18.md`, `SESSION_HANDOFF_V17.md`, and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main` (production)  
**Active feature branch:** `feature/intelligence-exchange-ui` (local, **not merged to main**, **not pushed**)  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `docs/analytics/metrics.md` → `docs/feedback/README.md` → `CHANGELOG.md` → `.cursorrules` → `.cursor/rules/communication.mdc`

**Known-good fallback:** `FALLBACK_TIMELINE.md` — tag `fallback/2026-06-28-v1.1-stable` at `aab7e55`. Use only if onboarding auto-repair regresses.

---

## Repo State (2026-07-07)

| State | Contents |
|---|---|
| **On `main` (committed + deployed)** | Through `52a5129` — MVP V1.1 stack, analytics (Sprint 4A), brand/legal (Sprint 3.9), feedback (Sprint 3.95), welcome CTA polish. **Dashboard still uses legacy change-first layout on production.** |
| **On `feature/intelligence-exchange-ui` (local, uncommitted)** | Full **Intelligence Exchange** rebuild (Epic 4–6) + **Focus Mode** (Epic 7) + Living Intelligence Field (Epic 5). All new exchange/background code is untracked or modified. **Not pushed. Not on production.** |
| **Production briefing** | `2026-W28` — Week of July 6, 2026 – July 12, 2026 |
| **Local build** | `npm run build` passes on feature branch (verified 2026-07-07) |

**Uncommitted working tree (feature branch):**

```
M  app/dashboard/page.tsx
?? SESSION_HANDOFF_V18.md
?? SESSION_HANDOFF_V19.md          ← This file
?? components/background/
?? components/exchange/
?? hooks/use-exchange-chrome-insets.ts
?? hooks/use-focus-trap.ts
?? hooks/use-scroll-lock.ts
?? lib/background/
?? lib/exchange/
```

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
- **Intelligence Exchange is the new strategic direction for `/dashboard`** — not yet merged to `main`.
- **Focus Mode (Epic 7)** is the signature interaction for pulse tiles — replaces in-grid card expansion. Shipped locally; validated in browser.

---

## 1. Current Product Vision

**Tagline:** Observe. Predict. Lead.

**Mission:** Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Positioning:** HorizonIQ is a **personalized intelligence platform** and a **signal change platform** — not a trend tracker, not a generic AI dashboard, not a chatbot.

**Strategic elevation — Intelligence Exchange (Epic 4):**

> The dashboard is becoming **Intelligence Exchange** — a flagship experience that feels like tomorrow's front page, not admin software. Users discover intelligence progressively (newspaper-style), without navigating away.

**Signature interaction — Focus Mode (Epic 7):**

> When a user clicks a pulse tile, the **entire interface shifts attention** toward that signal. No modals. No drawers. No navigation. The page changes state into a calm, premium **focused intelligence reading mode**.

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
- Focus Mode should feel like **entering a reading state**, not opening another screen
- UI feels **alive** without distracting from reading (atmospheric field; soft glow behind focused signal)
- Premium, calm, trustworthy — Apple · Linear · Stripe · Bloomberg · Financial Times quality
- Onboarding must **self-heal** in normal browsers
- Product is **measurable** in production (Sprint 4A) — **but new dashboard does not yet emit analytics**
- Public Beta ready — legal pages, footer, SEO, in-app feedback (Sprints 3.9, 3.95)

**Target users:** Student · Professional · Entrepreneur · Investor

**Explicitly avoid:** Cyberpunk · neon · crypto dashboards · relationship graphs (MVP) · community (MVP) · dashboard overload · TradingView styling · admin-table aesthetics · modals/drawers for brief expansion

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
4. Return-visit delta — visit snapshot (implemented in **legacy** dashboard code, **not wired** to new dashboard)
5. Trust without documentation — labeled sources, confidence prose
6. Premium first impression — welcome flow
7. Reliable onboarding routing — cookie + middleware
8. Product analytics — `lib/analytics/`
9. Public Beta readiness — footer, legal, feedback

### Intelligence Exchange + Focus Mode (feature branch)

| Epic | Phase | Status |
|---|---|---|
| Epic 4 | Phase 1 — Hero Experience | ✅ Shipped locally |
| Epic 4 | Phase 2 — Live Intelligence Market (table) | ✅ Built then **removed** in Phase 3 |
| Epic 4 | Phase 3 — World Intelligence Pulse (editorial tiles) | ✅ Shipped locally |
| Epic 4 | Phase 4 — Editorial Intelligence Tiles | ✅ Shipped locally |
| Epic 5 | Phase 1 — Living Intelligence Field (canvas) | ✅ Shipped locally |
| Epic 6 | Phase 1 — Intelligence Brief (progressive disclosure) | ✅ Shipped locally (now inside Focus Mode) |
| **Epic 7** | **Phase 1 — Focus Mode** | **✅ Shipped locally + validated** |

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
- **Focus Mode:** no modals, drawers, navigation, or new pages for brief expansion

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
**Not instrumented on:** new Intelligence Exchange dashboard (feature branch)

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

### Epic 4 — Intelligence Exchange (feature branch)

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

#### Exchange Chrome

- [x] `ExchangeHeader` — Logo, tagline, region selector, notifications, avatar (static); dims during Focus Mode
- [x] `TickerPlaceholder` — full-width live intelligence ticker (static items); dims during Focus Mode
- [x] `IntelligenceExchangeShell` — orchestrates Focus Mode provider, backdrop, footer chrome, chrome metrics
- [x] `SiteFooter` reused on dashboard (hidden during Focus Mode)

### Epic 5 — Living Intelligence Field (feature branch)

- [x] `LivingIntelligenceField` — fixed full-viewport canvas layer (`z-0`, `pointer-events: none`)
- [x] `IntelligenceFieldEngine` — 25–90 nodes by viewport, slow drift, fading connections
- [x] HorizonIQ blue tint on nodes; soft radial glow behind focused signal (Epic 7)
- [x] Pauses on hidden tab; freezes on `prefers-reduced-motion`
- [x] Hooks: `focusGlow` wired from Focus Mode; `getNodeIntensity`, `getRegionBias` (future)

### Epic 6 — Intelligence Brief (feature branch)

- [x] Brief sections inside Focus Mode: Why This Matters, Evidence, Who Is Driving This, Related Signals, Forecast
- [x] `IntelligencePulseBriefPanel` — editorial sections, compact variant for Focus Mode
- [x] CTA placeholder: Read Full Brief → (no navigation yet)
- [x] Mock brief data in `lib/exchange/pulse-brief-data.ts`

### Epic 7 — Focus Mode (feature branch) ★ NEW

- [x] **Replaces in-grid card expansion** — page changes state, not a new screen
- [x] `FocusModeProvider` — global focus state, related-signal mapping, scroll lock, ESC + click-outside exit
- [x] `FocusModeBackdrop` — `backdrop-blur-lg` + dim layer behind focused card (inside `main`, z-20)
- [x] `FocusModeFooterChrome` — hides footer during Focus Mode (prevents footer clipping focused card)
- [x] Focused card — `position: fixed`, viewport-sized via CSS variables, internal scroll for long briefs
- [x] Hero dims to ~22% opacity; dimmed tiles ~18%; related tiles ~42% with accent ring
- [x] Header + ticker dim and blur during Focus Mode
- [x] Living Intelligence Field glow follows focused card position
- [x] `useFocusTrap` — keyboard trap with `preventScroll: true`; dialog scroll resets to top
- [x] `useScrollLock` — fixed-body technique preserves scroll position
- [x] `useExchangeChromeInsets` — measures header + ticker; sets `--exchange-focus-top`, `--exchange-focus-max-h`
- [x] Accessibility: `role="dialog"`, `aria-modal`, focus trap, ESC, `prefers-reduced-motion` fallbacks
- [x] Animation: 300ms ease-in-out throughout
- [x] **Validated in browser** (desktop + mobile viewport, bottom cards, footer overlap fixed)

### Removed during Epic 4 iteration (intentionally deleted)

- Live Intelligence Market table (`live-intelligence-market.tsx`, row/card components, `market-mock-data.ts`)
- `HeroDotGrid` replaced by `LivingIntelligenceField` (file still exists, unused)
- In-grid tile expansion (`expandedId` col-span logic) — superseded by Epic 7 Focus Mode

---

## 4. Pending Features

### Intelligence Exchange — Critical (before merge to main)

- [ ] **Commit and push** `feature/intelligence-exchange-ui` (product owner approval)
- [ ] **Restore onboarding guards** on `/dashboard` — shell has no `usePreferences`, no redirect to onboarding, no identity check
- [ ] **Restore analytics** — `dashboard_loaded`, `return_visit`, plus Focus Mode events: `focus_mode_entered`, `focus_mode_exited`, `pulse_brief_viewed`
- [ ] **Wire mock → live data** — pulse tiles, hero featured card, ticker from briefing/pipeline
- [ ] **Wire Read Full Brief →** `/signals/[id]` with `track("signal_opened", { source: "focus_mode" })`
- [ ] **Wire hero CTAs** — Explore Signals, Weekly Briefing, Forecasts
- [ ] **Label mock data** honestly in UI before production (Beta / Sample provenance)
- [ ] **Reconnect guided tour** or redesign tour for Exchange + Focus Mode layout
- [ ] **Reconnect visit snapshot** / "What Changed Since Your Last Visit" — decide if it returns in Exchange or stays on signal detail only
- [ ] **Related Signals chips** — enable click to switch Focus Mode to related tile
- [ ] **Living Intelligence Field Phase 2** — wire `getNodeIntensity` to focused tile momentum
- [ ] **Update PROJECT_MEMORY.md, CHANGELOG.md, ROADMAP.md** after merge

### Focus Mode — Polish (post-merge acceptable)

- [ ] Add `focus_mode_entered` / `focus_mode_exited` analytics events
- [ ] Visual scroll affordance when brief content overflows (subtle fade at dialog bottom)
- [ ] Delete orphaned `hero-dot-grid.tsx`
- [ ] Consider dimming Feedback FAB during Focus Mode (currently still visible — intentional for beta feedback)

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
- [ ] Redesign tour for Intelligence Exchange layout

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
| Motion | Framer Motion + `lib/motion.ts`; Exchange/Focus Mode uses CSS 300ms ease-in-out |
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
app/dashboard/page.tsx
└── IntelligenceExchangeShell (client)
    └── FocusModeProvider
        ├── ExchangeChromeMetrics          ← sets CSS vars for focus card sizing
        └── <div.relative.min-h-dvh>
            ├── LivingIntelligenceField    ← z-0, canvas, focusGlow from context
            ├── ExchangeHeader             ← sticky z-40, dims on focus
            ├── TickerPlaceholder          ← dims on focus
            ├── ExchangeMain               ← z-10; z-[60] during Focus Mode
            │   ├── FocusModeBackdrop      ← fixed z-20 inside main, backdrop-blur
            │   ├── IntelligenceHero       ← dims on focus
            │   └── WorldIntelligencePulse ← tile click → enterFocus()
            └── FocusModeFooterChrome      ← hides SiteFooter during Focus Mode
                └── SiteFooter
```

**Focused pulse tile (when active):**

```
IntelligencePulseTileCard
├── position: fixed; z-[50] (inside main's z-[60] context)
├── top: var(--exchange-focus-top)       ← header + ticker + 16px
├── max-h: var(--exchange-focus-max-h)   ← 100dvh - top - 24px
├── [role=dialog] scrollable inner panel
│   ├── TileSummary (compact)
│   └── IntelligencePulseBriefPanel (compact)
└── data-focus-signal="" (click-outside exempt)
```

**FeedbackWidget** still mounts globally from `app/layout.tsx` — unaffected.

### Focus Mode State Flow

```
User clicks tile
  → WorldIntelligencePulse.enterFocus(tileId)
  → FocusModeProvider.focusedId = tileId
  → relatedIds computed via lib/exchange/focus-mode.ts
  → useScrollLock: body position fixed (preserves scroll)
  → ExchangeChromeMetrics: CSS vars updated
  → FocusModeBackdrop: opacity 100, backdrop-blur-lg
  → ExchangeMain: z-[60]
  → FocusModeFooterChrome: footer hidden
  → Tile: fixed positioning, dialog scrollTop = 0
  → LivingIntelligenceField: focusGlow at card center
  → useFocusTrap: focus dialog container (preventScroll)

Exit: ESC or pointerdown outside [data-focus-signal]
  → exitFocus() → restore scroll, clear glow, show footer
```

### Intelligence Exchange Data Flow (current — mock only)

```
lib/exchange/pulse-mock-data.ts     → 12 tile summaries (hero/featured/compact tiers)
lib/exchange/pulse-brief-data.ts    → brief content keyed by tile id
lib/exchange/focus-mode.ts          → getRelatedTileIds() for related signal accents
         ↓
WorldIntelligencePulse
         ↓
IntelligencePulseTileCard (Focus Mode when isFocused)
         ↓
IntelligencePulseBriefPanel
```

**Not connected to:** `lib/data/access.ts`, `lib/personalize.ts`, pipeline, visit snapshot.

### Living Intelligence Field Architecture

```
LivingIntelligenceField (React client)
  → IntelligenceFieldEngine (canvas RAF loop)
       ├─ resize listener
       ├─ visibilitychange pause
       ├─ node drift + neighbor connections
       ├─ focusGlow radial gradient (Epic 7)
       └─ config hooks: getNodeIntensity, getRegionBias (future)
```

### Legacy Dashboard Architecture (still on `main` production)

```
app/dashboard/page.tsx (client)
  → IntelligenceFieldLayer (WebGL)
  → WhatChangedHero, StorySection, SignalCard, visit snapshot, guided tour, analytics
```

**Legacy code still exists in `components/dashboard/`.** Feature branch **replaced** the page entirely.

### Onboarding Architecture (unchanged)

**Phases:** `welcome` → `name` → `landing` → `profile` → `complete`

| Phase | Path(s) |
|---|---|
| welcome | `/onboarding/welcome` |
| name | `/onboarding/name` |
| landing | `/` |
| profile | `/onboarding/role`, `region`, `interests`, `tour` |
| complete | `/dashboard`, `/signals/*` |

Middleware allows `/dashboard` only when phase = `complete`. New dashboard shell does not verify preferences client-side.

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
├── SESSION_HANDOFF_V19.md          ← This file (canonical)
├── SESSION_HANDOFF_V18.md          ← Superseded
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
│   ├── dashboard/page.tsx          # ★ IntelligenceExchangeShell (feature branch)
│   ├── signals/[id]/page.tsx       # Signal detail (IntelligenceCard, WebGL field)
│   ├── api/feedback/route.ts
│   ├── (site)/                     # About, Contact, Privacy, Terms, Changelog, Roadmap
│   └── onboarding/                 # welcome, name, greeting, role, region, interests, tour
│
├── components/
│   ├── background/                 # ★ Epic 5
│   │   └── living-intelligence-field.tsx
│   ├── exchange/                   # ★ Epic 4–7
│   │   ├── intelligence-exchange-shell.tsx   # Dashboard orchestrator
│   │   ├── focus-mode-context.tsx              # Epic 7 state
│   │   ├── focus-mode-backdrop.tsx             # Epic 7 blur layer
│   │   ├── focus-mode-footer-chrome.tsx        # Epic 7 footer hide
│   │   ├── exchange-header.tsx                 # client — dims on focus
│   │   ├── ticker-placeholder.tsx              # client — dims on focus
│   │   ├── intelligence-hero.tsx               # client — dims on focus
│   │   ├── featured-opportunity-card.tsx
│   │   ├── world-intelligence-pulse.tsx        # client — focus orchestration
│   │   ├── intelligence-pulse-tile.tsx       # client — Focus Mode card
│   │   ├── intelligence-pulse-brief.tsx        # brief sections (compact variant)
│   │   ├── pulse-sparkline.tsx
│   │   └── hero-dot-grid.tsx                   # UNUSED — delete candidate
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
│   ├── use-exchange-chrome-insets.ts   # ★ Epic 7 — viewport sizing CSS vars
│   ├── use-focus-trap.ts               # ★ Epic 7 — keyboard trap
│   ├── use-scroll-lock.ts              # ★ Epic 7 — body scroll lock
│   ├── use-intelligence-field-params.ts   # R3F field (landing/signals only)
│   ├── use-reduced-motion.ts
│   └── use-require-identity-onboarding.ts
│
├── lib/
│   ├── background/                 # ★ Epic 5
│   │   └── intelligence-field-engine.ts
│   ├── exchange/                   # ★ Epic 4–7
│   │   ├── pulse-mock-data.ts
│   │   ├── pulse-brief-data.ts
│   │   └── focus-mode.ts           # related signal mapping
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

**Deleted during Epic 4:** `live-intelligence-market.tsx`, `intelligence-market-row.tsx`, `intelligence-market-card.tsx`, `lib/exchange/market-mock-data.ts`

---

## 7. UI Decisions

### Design Principles (unchanged)

1. Simplicity → Clarity → Performance → Scalability → Accessibility  
2. Intelligence must be beautiful; every element communicates meaning  
3. Animation supports comprehension — never decoration at the cost of reading  
4. Dark-first premium aesthetic — no cyberpunk, neon overload, crypto dashboards  

### Intelligence Exchange — Locked Decisions

| Element | Decision |
|---|---|
| **Page name** | Intelligence Exchange (not "Dashboard" in UX copy) |
| **Header** | `ExchangeHeader` — separate from marketing `TopBar`; static region/notifications/avatar |
| **Ticker** | `TickerPlaceholder` — full-width, static scroll items |
| **Hero** | Phase 1 locked layout — do not redesign without approval |
| **Pulse section** | World Intelligence Pulse — editorial tiles, NOT tables |
| **Tile hierarchy** | 1 hero + 3 featured + 8 compact |
| **Tile content** | Editorial headlines (≤10 words), supporting (≤20 words), momentum `N ▲ +Δ` |
| **Background** | `LivingIntelligenceField` canvas — not R3F on dashboard |
| **Max content width** | 1500px centered (hero + pulse) |
| **Inspiration** | Apple News · Financial Times Weekend · The Economist — NOT TradingView |

### Epic 7 — Focus Mode — Locked Decisions ★ NEW

| Element | Decision |
|---|---|
| **Interaction name** | Focus Mode (not "expand", not "modal", not "drawer") |
| **Trigger** | Click any pulse tile |
| **Exit** | ESC · click outside focused/related tile · (no toggle-off on same tile click) |
| **Focused card position** | `position: fixed`, centered horizontally, sized to viewport via CSS variables |
| **Focused card z-index** | z-[50] inside main at z-[60] during focus |
| **Backdrop** | `FocusModeBackdrop` inside `main` at z-[20] — `backdrop-blur-lg` + `bg-background/45` |
| **Footer** | Hidden during Focus Mode (`FocusModeFooterChrome`) — prevents clipping |
| **Hero opacity** | ~22% during focus |
| **Dimmed tiles** | ~18% opacity, `pointer-events-none` |
| **Related tiles** | ~42% opacity, accent ring, clickable to switch focus |
| **Header/ticker** | ~28% opacity + `blur-[3px]` during focus |
| **Brief reveal** | Inside focused card — Why This Matters, Evidence, Who Is Driving This, Related Signals, Forecast, Read Full Brief |
| **Long content** | Scroll inside focused card dialog — page scroll locked |
| **Animation** | 300ms ease-in-out; no bounce; no scale transform on focused card |
| **Accessibility** | Focus trap, `role="dialog"`, `aria-modal`, `preventScroll` on focus, reduced-motion fallbacks |
| **Field glow** | Canvas `focusGlow` follows focused card center |
| **Do NOT** | Modals · drawers · navigation · new pages · APIs · charts · maps |

### CSS Variables (Focus Mode sizing)

Set by `useExchangeChromeInsets` on `document.documentElement`:

| Variable | Purpose |
|---|---|
| `--exchange-focus-top` | Distance from viewport top to focused card (header + ticker + 16px) |
| `--exchange-focus-bottom` | Bottom clearance (24px) |
| `--exchange-focus-max-h` | `calc(100dvh - top - bottom)` |

### Welcome Screen — LOCKED (Product Owner)

Route: `/onboarding/welcome` — **Do not change without approval.**  
CTA: **Enter** only (bold).

### Global Chrome

| Surface | Components |
|---|---|
| Landing / Signal detail | `TopBar` + `SiteFooter` + `FeedbackWidget` |
| Intelligence Exchange | `ExchangeHeader` + `SiteFooter` (hidden in focus) + `FeedbackWidget` |
| Site pages | `TopBar showNav` + `SiteFooter` |

### Legacy Dashboard IA (still on `main` production)

Story: What changed → Why it matters → What to do  
Components: `WhatChangedHero`, `StorySection`, `DisclosurePanel`, `SignalCard`

### Signal Detail (unchanged)

`/signals/[id]` — full `IntelligenceCard` analyst layout, WebGL ambient field, `TopBar`.

---

## 8. Data Strategy

### Platform Data (live — unchanged)

- **Catalog:** `data/catalog/signals.json`
- **Weekly briefing:** `data/briefings/{period}.json`
- **Active:** `2026-W28` per `data/meta.json`
- **Access:** `lib/data/access.ts` → `lib/personalize.ts`
- **Five sources:** HN, arXiv, Wikimedia, GitHub, Product Hunt

### Intelligence Exchange Data (feature branch — mock)

| File | Contents |
|---|---|
| `lib/exchange/pulse-mock-data.ts` | 12 tile summaries: headline, momentum, sparkline, tier, evidence counts |
| `lib/exchange/pulse-brief-data.ts` | Briefs: whyItMatters, evidence %, drivers, relatedSignals, forecast |
| `lib/exchange/focus-mode.ts` | `getRelatedTileIds()` — maps brief related labels to tile ids |

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
| Evidence stats in briefs are **fabricated percentages** | Need pipeline-backed numbers or "illustrative" label |
| `"18 sec ago"` timestamps are static | Need honest freshness from briefing |
| Read Full Brief → does nothing | User expectation mismatch until wired to `/signals/[id]` |
| Focus Mode presents mock brief as authoritative | Label as Beta / Sample until live data wired |

### Trust Principles (locked)

- Label mock vs live explicitly
- Show reasoning, not just scores
- Never overclaim beyond pipeline data
- Users should trust HorizonIQ without reading documentation
- Focus Mode must not feel like a deceptive overlay — content must be honest

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

### Intelligence Exchange + Focus Mode retention opportunity

- **Focus Mode** — immersive reading without leaving the page; encourages depth per signal
- **Progressive disclosure** — brief inside focus keeps users engaged
- **Related signals** — accent + click-to-switch (wiring pending)
- **Editorial front page** — collectible tiles encourage exploration
- **Wire to real weekly delta** — tiles should reflect briefing changes
- **Read Full Brief → signal detail** — bridge from Exchange to full `IntelligenceCard` analyst layout

### Retention Gaps

- New dashboard has **no visit snapshot**, **no change hero**, **no analytics**
- Focus Mode events not instrumented yet
- localStorage only — device-bound
- No email digest (Phase 2)
- Week 2 return funnels not built

---

## 11. Known Issues

### Critical (feature branch — before merge)

| Issue | Severity | Notes |
|---|---|---|
| Dashboard has **no onboarding/preferences guard** | **High** | Shell is client but no redirect for incomplete prefs |
| Dashboard **analytics not firing** | **High** | No `dashboard_loaded`, no Focus Mode events |
| **All Exchange data is mock** | **High** | Must wire or label before production |
| **Guided tour broken** on new dashboard | **High** | No `data-tour` attributes; tour targets legacy layout |
| **Visit snapshot not saved** from new dashboard | **Medium** | Retention layer disconnected |
| **Read Full Brief** does nothing | **Medium** | CTA visible in Focus Mode but no navigation |
| **Dual Living Intelligence implementations** | **Medium** | R3F on landing/signals; Canvas on dashboard — intentional |
| `hero-dot-grid.tsx` orphaned | **Low** | Delete or repurpose |

### Focus Mode — Resolved (2026-07-07 session)

| Issue | Resolution |
|---|---|
| Card tops clipped on focus | Fixed positioning + `preventScroll` on focus trap + scroll lock |
| Entire screen blurred including focused card | Backdrop moved inside `main`; focused card z-[50], main z-[60] during focus |
| Footer cut off bottom of focused card | Footer hidden during Focus Mode; max-h uses viewport insets |
| Focus trap scrolled dialog to bottom | Focus container (not Read Full Brief button); `scrollTop = 0` on enter |

### Open / Monitor (platform)

| Issue | Severity | Notes |
|---|---|---|
| Guided tour step 4 spotlight (legacy) | Medium | `recommended-actions` target |
| WebGL canvas remounts on navigation | Medium | Landing ↔ signals |
| Product Hunt HTTP 429 in CI | Medium |
| Light mode less refined than dark | Low |
| Vercel Analytics lag | Info | 15–60 min |
| Long briefs require scroll inside card | Info | By design — not a bug; consider scroll affordance |

### What NOT To Do

- Do not merge Exchange to `main` without onboarding + analytics restoration plan
- Do not present mock Exchange data as live without labeling
- Do not use R3F for dashboard background (Epic 5 decision: Canvas 2D)
- Do not redesign Hero or Focus Mode without product owner approval
- Do not change welcome screen without approval
- Do not put FocusModeBackdrop outside `main` at root z-index (will blur focused card)
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Do not import analytics SDKs in UI components — use `track()`
- Do not add modals/drawers for brief expansion — Focus Mode only

---

## 12. Next 5 Tasks (Priority Order)

### 1. Restore dashboard production readiness before merge

Re-add onboarding guard (`usePreferences`, identity check, redirect) and analytics (`dashboard_loaded`, `focus_mode_entered`, `focus_mode_exited`) to the Exchange shell **without redesigning UI**.

**Done when:** Incomplete onboarding redirects; analytics events fire on dashboard load and Focus Mode enter/exit.

### 2. Wire Intelligence Exchange to live briefing data

Connect pulse tiles + hero featured card to `lib/personalize.ts` / active briefing. Replace mock IDs with catalog signals where possible. Label anything still illustrative.

**Done when:** At least top 12 signals come from `data/` layer; provenance visible.

### 3. Wire Read Full Brief → signal detail

`Read Full Brief →` navigates to `/signals/[id]` with `track("signal_opened", { source: "focus_mode" })`. Exit Focus Mode before navigation.

**Done when:** Every focused brief CTA opens the matching signal page.

### 4. Commit, review, and merge `feature/intelligence-exchange-ui`

Product owner review of Intelligence Exchange + Focus Mode on preview URL. Merge to `main`, deploy Vercel production. Update `CHANGELOG.md`, `PROJECT_MEMORY.md`.

**Done when:** Production dashboard shows Intelligence Exchange with Focus Mode; fallback documented.

### 5. Epic 5 Phase 2 — data-reactive Living Intelligence Field

Wire `getNodeIntensity` in `IntelligenceFieldEngine` to focused tile momentum. Subtle brightness pulse on active technology — no spectacle.

**Done when:** Field visibly responds when Focus Mode is active; reduced-motion still freezes.

---

## 13. Quick Start for Next Session

```powershell
cd C:\HorizonIQ
git checkout feature/intelligence-exchange-ui
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

**Smoke test (feature branch — Intelligence Exchange + Focus Mode):**

1. Complete onboarding → `/dashboard`
2. Confirm: ExchangeHeader, ticker, Hero, pulse tiles, canvas field, footer
3. Click any pulse tile → **Focus Mode** activates
4. Confirm: hero/tiles dim, backdrop blurs background, focused card sharp and fully visible
5. Confirm: technology label visible at top; scroll inside card if brief is long
6. Confirm: footer hidden during focus; returns on exit
7. Press ESC or click outside → Focus Mode exits
8. Click related tile (accent ring) → focus switches
9. Feedback FAB still works

**Smoke test (production `main`):**

1. Dashboard still shows legacy change-first layout until merge
2. Signal detail `/signals/[id]` still works with IntelligenceCard

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| `VISION.md` | Original vision |
| `PROJECT_MEMORY.md` | Living product spec (lags Exchange/Focus Mode — update after merge) |
| `PROJECT_DECISIONS.md` | Decision log |
| `ROADMAP.md` | Phased roadmap |
| `CHANGELOG.md` | Change history (Exchange + Focus Mode not yet logged) |
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
| **Focus Mode as signature tile interaction (Epic 7)** | **Shipped locally** |
| **Progressive disclosure via Intelligence Brief inside Focus Mode** | **Shipped locally** |
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
| No modals/drawers/navigation for brief expansion | Locked (Epic 7) |

---

*End of Session Handoff V19*

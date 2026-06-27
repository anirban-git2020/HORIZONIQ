# Changelog

All notable product and strategy changes to HorizonIQ.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Sprint 1 — Premium First-Time Onboarding

#### Added

- **Full-screen welcome** (`/onboarding/welcome`) — animated Observe · Predict · Lead with Skip
- **Name capture** (`/onboarding/name`) — "What should we call you?" stored via IdentityService
- **Personalized greeting** (`/onboarding/greeting`) — time-of-day salutation (Good Morning/Afternoon/Evening)
- **Guided tour choice** (`/onboarding/tour`) — Start Guided Tour vs I'll Explore Myself before first briefing
- **Guided tour overlay** on dashboard — highlights Dashboard, What Changed, Signals, Opportunities, Recommended Actions
- **`IdentityService` abstraction** (`lib/identity/`) — `LocalIdentityService` + localStorage; future Google/GitHub/Supabase stubs documented (no auth implemented)
- **`lib/onboarding-flow.ts`** — resume-path helper for first-time flow
- Landing CTAs route to `/onboarding/welcome`

#### Changed

- Onboarding completion (quick + custom paths) routes to `/onboarding/tour` before dashboard
- Start over clears identity state alongside preferences and visit snapshot
- Dashboard: `data-tour` attributes + guided tour overlay only (no briefing logic changes)

### Strategy

- Pivot MVP from signal platform to **signal change platform**
- New core product principle: users return for **changes in signals**, not signals
- New intelligence layer: **"What Changed For You"**
- MVP version bumped to **V1.1 (Change-First)**
- MVP now validates **habit** (Week 2 return), not just first-visit format

### Added

- **Weekly Intelligence Refresh foundation:** catalog + active briefing data architecture
- `data/catalog/signals.json` — evergreen signal definitions
- `data/briefings/2026-W26.json` — weekly signal states and change buckets
- `lib/data/resolve-signals.ts` — merges catalog + briefing into unified `SignalRecord`
- `meta.json` `activeBriefingFile` pointer for active weekly briefing
- **MVP retention feature:** "What Changed Since Your Last Visit" with localStorage snapshot comparison
- Signal buckets: **New Signals**, **Rising Signals**, **Falling Signals**
- First visit baseline snapshot (uses `previousMomentum` from mock data) so return visits show movement
- Snapshot cleared on dashboard reset
- Data access layer: `lib/data/access.ts`, `lib/data/schemas.ts`
- Visit snapshot: `lib/visit-snapshot.ts` (localStorage, no login)
- Dashboard hero: `components/dashboard/what-changed-hero.tsx`
- Change badges: `components/dashboard/change-badge.tsx`
- Signal detail page: `app/signals/[id]/page.tsx` (change-first layout)
- Personalized "so what for you" on every signal
- First-visit fallback: "What Changed This Week"
- Return visit: "What Changed Since Your Last Visit"
- Interest categories in onboarding (Technology / Industry / Business)
- Preferences migration for legacy region/interest IDs
- Pre-onboarding hero copy on landing page (value proposition + 60-second promise)
- Observe → Understand → Act steps above role selection (`observe-understand-act-steps.tsx`)
- "Why HorizonIQ?" section below onboarding steps (Signals, Skills, Opportunities)
- Student interest fields: biotechnology, biochemistry, life sciences, arts, commerce
- Role-aware curated interest lists per persona
- **Briefing freshness in change hero:** `briefingLabel` and "Updated [date]" shown prominently
- **`formatBriefingUpdatedAt`** utility for consistent date display
- **`isReturnVisitForPeriod`** — return-visit diff only within the same `briefingPeriod`
- **`data/README.md`** — weekly mock data refresh checklist
- **First-visit return framing:** Week 1 Briefing label, baseline banner, today's date, signal tracking watchlist, signal detail tracking footer

### Changed

- Signal data access reads **catalog + active briefing** instead of flat `signals.json`
- First-visit hero title → **Week 1 Briefing** (return visits unchanged)
- First-visit subtitle explains baseline date and next-visit delta
- **Next Briefing Preview** replaced with **Signals We're Tracking For You** (3–5 personalized signals + next-briefing reveal list)
- First-visit dashboard simplified: hero + watchlist only; full sections on return visits
- `MetaRecord` extended with `activeBriefingFile`
- New schema types: `SignalCatalogRecord`, `SignalBriefingState`, `BriefingRecord`
- Data layer: TypeScript modules → JSON files with change metadata
- Regions: 6 combined regions → 8 fixed regions
- Interests: 8 flat topics → 14 categorized interests with role-specific onboarding lists
- Student onboarding: Technology, Science, and Arts & Commerce sections
- Landing hero headline and subheadline updated for onboarding clarity
- Role card copy: benefit-first taglines with clear "For…" audience lines
- Dashboard: hero-first layout, removed signal map
- Signal cards: change badges, delta indicators, link to detail
- Skills section → "Skills Rising" with demand change
- Opportunities section → "New This Week" / "Heating Up" with growth change
- Actions section → primary action + secondary suggestions
- Dashboard header title → "What changed for you"
- **`meta.json`** refreshed to briefing period `2026-W26` (Week of June 23, 2026)
- Sample signal change fields updated (`ai-agents`, `humanoid-robotics`) for weekly refresh demo
- Dashboard uses briefing-period-aware return visit detection
- **What Changed hero is first on dashboard** — immediately after top bar, before preferences header
- Signal rows use explicit **"Why this matters to you"** and **"Recommended action"** labels
- Briefing-level primary action label aligned to **"Recommended action"**
- Fallback grouping keeps **New / Rising / Falling Signals** buckets when weekly change data is available

### Removed

- Flat `data/signals.json` (migrated to catalog + briefing split)
- Signal relationship map and flow UI
- Legacy TypeScript data modules (`intelligence.ts`, `signal-intelligence.ts`, etc.)
- `map` section from dashboard section order

### Documentation

- Updated `PROJECT_MEMORY.md` with change-first strategy, data spec, implementation status, codebase gaps
- Updated `PROJECT_DECISIONS.md` with retention pivot decisions
- Created `ROADMAP.md`
- Created `CHANGELOG.md`

---

## [2026-06-22] — Strategy Session

### Context

Product strategy review with YC Partner, Product Strategist, Retention Expert, and UX Researcher lenses.

### Key Insights

- **Biggest weekly return driver:** A briefing that shows what changed and what to do differently
- **Biggest churn risk:** Static, generic content disguised as personalized intelligence
- **Biggest missing feature:** Weekly intelligence delta ("What Changed" layer)
- **Smallest high-impact feature:** One personalized "so what for you" sentence per signal

### Decisions

- HorizonIQ is a signal **change** platform, not a signal platform
- Curated mock datasets for MVP — no live data pipeline
- Fixed regions (8) and predefined interests (14, multi-select) — no free text
- Signal detail view is core differentiator for depth, but change layer drives return
- Weekly manual JSON refresh is an operational requirement, not optional
- Every feature must pass retention test before inclusion in MVP

### Data Strategy (MVP V1)

- Use local JSON: `signals.json`, `skills.json`, `jobs.json`, `recommendations.json`
- Architecture must allow future swap to live APIs
- Future sources (out of scope): job boards, research papers, patents, funding, news, government reports

### Onboarding Spec

**Regions:** North America, Europe, India, China, Southeast Asia, Middle East, Africa, Latin America

**Interests:**

- Technology: AI, Robotics, Quantum Computing, Cybersecurity, Cloud Computing
- Industry: Manufacturing, Supply Chain, Healthcare, Finance, Energy
- Business: Entrepreneurship, Startups, Venture Capital, Product Management

### MVP Objective

User receives useful, personalized intelligence within **60 seconds**.

Every screen reinforces: What is changing? Why does it matter? What should I do next?

Priorities: clarity over feature count · intelligence over visuals · usefulness over complexity

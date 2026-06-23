# Changelog

All notable product and strategy changes to HorizonIQ.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Strategy

- Pivot MVP from signal platform to **signal change platform**
- New core product principle: users return for **changes in signals**, not signals
- New intelligence layer: **"What Changed For You"**
- MVP version bumped to **V1.1 (Change-First)**
- MVP now validates **habit** (Week 2 return), not just first-visit format

### Added

- JSON datasets: `data/signals.json`, `data/skills.json`, `data/jobs.json`, `data/recommendations.json`, `data/regions.json`, `data/meta.json`
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
- Student interest fields: biotechnology, biochemistry, life sciences, arts, commerce
- Role-aware curated interest lists per persona

### Changed

- Data layer: TypeScript modules → JSON files with change metadata
- Regions: 6 combined regions → 8 fixed regions
- Interests: 8 flat topics → 14 categorized interests with role-specific onboarding lists
- Student onboarding: Technology, Science, and Arts & Commerce sections
- Landing hero headline and subheadline updated for onboarding clarity
- Dashboard: hero-first layout, removed signal map
- Signal cards: change badges, delta indicators, link to detail
- Skills section → "Skills Rising" with demand change
- Opportunities section → "New This Week" / "Heating Up" with growth change
- Actions section → primary action + secondary suggestions
- Dashboard header title → "What changed for you"

### Removed

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

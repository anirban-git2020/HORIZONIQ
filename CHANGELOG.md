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

### Added (Planned)

- Dashboard hero: "What Changed Since Your Last Visit"
- First-visit fallback: "What Changed This Week"
- Dashboard contract: What Changed · Why It Matters · What To Do
- Signal contract: Current State · Change Since Last Period · Explanation · Recommended Action
- Personalized explanations by role, region, and interests
- Change metadata in mock datasets
- localStorage visit snapshot for return-visit diffs
- Signal detail view (change-first layout)
- JSON data files: `signals.json`, `skills.json`, `jobs.json`, `recommendations.json`
- Feature retention filter (litmus test for all new features)
- Retention success metrics (Week 2 return, change hero engagement)
- `ROADMAP.md` with phased build plan

### Changed (Planned)

- Data layer: TypeScript modules → JSON files with change metadata
- Regions: 6 combined regions → 8 fixed regions
- Interests: 8 flat topics → 14 categorized interests (Technology / Industry / Business)
- Skills section → "Skills Rising" (change-framed)
- Opportunities section → "New This Week" / "Heating Up"
- Actions section → one primary action per briefing
- Momentum / confidence → always show change delta
- Signal detail → lead with What Changed, not overview
- Product feel: "personal future analyst" → "personal future analyst who tells you what changed"

### Removed / Deprioritized (MVP)

- Signal relationship map (existing UI to be hidden)
- Relationship flow visualizations (existing UI to be hidden)
- Community features
- Discussion boards
- User accounts
- Live data ingestion
- Premium features

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

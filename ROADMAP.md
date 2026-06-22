# HorizonIQ Roadmap

Last updated: 2026-06-22

---

## North Star

Help people understand **what is changing**, **why it matters**, and **what to do next** — before everyone else.

**Retention principle:** Users return for **changes in signals**, not signals themselves.

---

## Phase 0 — Foundation (Complete)

- [x] Product vision and positioning ("Observe. Predict. Lead.")
- [x] User personas (student, professional, entrepreneur, investor)
- [x] Design principles and non-negotiables
- [x] Role-first onboarding flow
- [x] Initial dashboard shell
- [x] Role-based dashboard copy and section ordering

---

## Phase 1 — MVP V1.1: Change-First (Current)

**Objective:** Validate that users **return weekly** when intelligence shows personalized change.

**Success metric:** Week 2 return rate + change hero engagement.

### 1.1 Data Layer

- [ ] Create `signals.json`, `skills.json`, `jobs.json`, `recommendations.json`
- [ ] Add change metadata to every signal (type, summary, delta)
- [ ] Add personalized explanation variants (role, region, interest)
- [ ] Add labeled mock sources to every signal
- [ ] Build swappable data access layer (JSON now, API later)
- [ ] Establish weekly manual data refresh cadence

### 1.2 Onboarding Alignment

- [ ] Update regions to 8 fixed options (remove "Global", split Asia Pacific)
- [ ] Update interests to 14 categorized options with multi-select
- [ ] Group interests by Technology / Industry / Business in UI

### 1.3 What Changed For You (Core)

- [ ] localStorage visit snapshot (`lastVisitAt`, signal state snapshot)
- [ ] Hero section: "What Changed Since Your Last Visit"
- [ ] First-visit fallback: "What Changed This Week"
- [ ] Dashboard contract on every visit: What Changed · Why It Matters · What To Do
- [ ] One primary recommended action per briefing

### 1.4 Signal Intelligence

- [ ] Personalized "so what for you" on every signal card
- [ ] Change badges on signals (new · rising · falling · stable)
- [ ] Momentum / confidence with change arrows
- [ ] Signal detail page (change-first layout)
- [ ] Signal detail sections: Overview, What Changed, Momentum Drivers, Affected Industries, Recommended Skills, Opportunities, Recommended Actions

### 1.5 Dashboard Reframe

- [ ] Reframe skills → "Skills Rising"
- [ ] Reframe opportunities → "New This Week" / "Heating Up"
- [ ] Reframe actions → primary action + optional secondary
- [ ] Remove / hide signal relationship map
- [ ] Remove / hide relationship flow components

### 1.6 Trust & Explainability

- [ ] Labeled sources on all signals
- [ ] Expandable momentum / confidence drivers
- [ ] Clear mock data labeling where applicable

---

## Phase 2 — Retention & Habit (Post-MVP Validation)

**Prerequisite:** Phase 1 shows Week 2 return > baseline.

- [ ] Email / digest for weekly briefing (requires accounts or email capture)
- [ ] Briefing period labels ("Week of Jun 22")
- [ ] Action follow-up ("Last week we recommended X — here's what changed")
- [ ] Expanded signal library with richer change history
- [ ] A/B test change hero formats

---

## Phase 3 — Live Data (Post-PMF)

**Prerequisite:** Proven retention with curated data.

- [ ] Job board integrations
- [ ] Research paper ingestion
- [ ] Patent data
- [ ] Funding databases
- [ ] News sources
- [ ] Government reports
- [ ] Automated change detection pipeline
- [ ] Real momentum / confidence scoring

---

## Phase 4 — Platform Expansion

- [ ] User accounts and saved preferences
- [ ] Premium tier (advanced intelligence, forecasting, reports, scoring)
- [ ] Enterprise (API, custom intelligence, white-label)
- [ ] Living Intelligence Network (relationship graphs, cause/effect visualization)
- [ ] Community / discussion (only if change layer retention is proven)

---

## Explicitly Out of Scope (MVP V1.1)

- Live data ingestion
- Relationship graphs
- Community / discussion boards
- User accounts
- Premium / enterprise features
- AI chatbot homepage

---

## Retention Metrics by Phase

| Phase | Primary Metric |
|---|---|
| Phase 1 | Week 2 return rate |
| Phase 1 | Change hero engagement |
| Phase 1 | Time to first actionable insight (< 60s) |
| Phase 2 | Week 4 return rate |
| Phase 2 | Digest open rate |
| Phase 3 | Change accuracy vs manual curation |

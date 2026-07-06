# HorizonIQ Roadmap

Last updated: 2026-07-06

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

- [x] Catalog + briefing JSON architecture (`signals.json` catalog, weekly briefings, derived skills/jobs/recommendations)
- [x] Change metadata on every signal (type, summary, delta)
- [x] Personalized explanation variants (role, region, interest)
- [x] Labeled sources on every signal (live pipeline URLs where available)
- [x] Swappable data access layer (`lib/data/access.ts`)
- [x] Weekly data refresh cadence (GitHub Actions Monday 06:00 UTC + manual `pipeline:full`)

### 1.2 Onboarding Alignment

- [x] 8 fixed regions
- [x] 14 categorized interests with multi-select
- [x] Group interests by Technology / Industry / Business (and student sections) in UI
- [ ] Step progress label: "Interests" → Intelligence Focus Areas (Sprint 3A polish)

### 1.3 What Changed For You (Core)

- [x] localStorage visit snapshot (`lastVisitAt`, signal state snapshot)
- [x] Hero section: "What Changed Since Your Last Visit"
- [x] First-visit fallback: "What Changed This Week" / Week 1 Briefing
- [x] Dashboard contract on every visit: What Changed · Why It Matters · What To Do
- [x] One primary recommended action per briefing

### 1.4 Signal Intelligence

- [x] Personalized "so what for you" on every signal
- [x] Change badges on signals (new · rising · falling · stable)
- [x] Momentum / confidence with change context
- [x] Signal detail page (change-first / full IntelligenceCard layout)
- [x] Sprint 2.5A seven-section analyst reasoning (`IntelligenceCard`)

### 1.5 Dashboard Reframe

- [x] Reframe skills → "Skills Rising"
- [x] Reframe opportunities → "New This Week" / "Heating Up"
- [x] Reframe actions → primary in hero + secondary section
- [x] Remove / hide signal relationship map
- [x] Remove / hide relationship flow components
- [x] **Sprint 3A:** Story-driven IA, progressive disclosure, single-question cards
- [x] **Sprint 3B:** Premium visual system — dark-first, typography-led, branding lockup
- [x] **Sprint 3C:** Living Intelligence Core — R3F + GLSL, data-reactive field, welcome reveal

### 1.6 Trust & Explainability

- [x] Labeled sources on all signals
- [x] Confidence explanation prose + plain-English tiers
- [x] Honest provenance labeling (Live / Mixed / Sample)
- [ ] Trust interaction analytics (source clicks, evidence expand)

### 1.7 Sprint 1 — Premium Onboarding (Complete)

- [x] Welcome, name, greeting, guided tour choice, tour overlay
- [x] IdentityService (localStorage, no auth)

### 1.8 Sprint 4A — Product Analytics (Complete)

- [x] Vercel Analytics + Speed Insights in root layout
- [x] Microsoft Clarity scaffold (lazy, production-only, env-gated)
- [x] Provider-agnostic `lib/analytics/` abstraction
- [x] Anonymous visitor ID + session tracking (localStorage)
- [x] Sprint 4A typed product events
- [x] `docs/analytics/metrics.md` metric definitions
- [ ] Analytics dashboard UI (deferred)
- [ ] Wire `search_executed`, `recommendation_opened`, `forecast_opened` when features ship

### 1.9 Sprint 3.9 — Brand, Legal & Trust (Complete)

- [x] Global production footer on all primary surfaces
- [x] About, Contact, Privacy, Terms, Changelog, Roadmap pages
- [x] Founder attribution (About + Contact + footer credit)
- [x] Site navigation (desktop + mobile)
- [x] SEO metadata, Open Graph, JSON-LD, sitemap, robots
- [x] Favicon and web manifest
- [x] Public path allowlist for legal pages during onboarding
- [x] `footer_link_clicked` analytics wired
- [ ] GitHub footer link (placeholder until public repo)
- [ ] Formal legal review of Terms and Privacy copy

### 1.10 Sprint 3.95 — Feedback System (Complete)

- [x] Floating Feedback button (global)
- [x] Premium feedback modal with five types
- [x] Optional email + screenshot upload (5 MB, PNG/JPEG/WEBP)
- [x] Automatic metadata capture
- [x] Supabase `feedback` table + Storage integration
- [x] Success confirmation with tagline
- [x] Modular architecture + admin query presets (no admin UI)
- [ ] Configure Supabase env vars in Vercel Production
- [ ] Admin dashboard UI (deferred)

---

## Phase 2 — Retention & Habit (Post-MVP Validation)

**Prerequisite:** Phase 1 shows Week 2 return > baseline.

- [ ] Email / digest for weekly briefing (requires accounts or email capture)
- [ ] Briefing period labels in digest UX
- [ ] Action follow-up ("Last week we recommended X — here's what changed")
- [ ] Expanded signal library with richer change history
- [ ] A/B test change hero formats
- [ ] PostHog funnels: Week 2 return, onboarding path, change-hero → signal-detail
- [ ] Display name on dashboard (identity loop closure)

---

## Phase 3 — Live Data Expansion (Post-PMF)

**Prerequisite:** Proven retention with curated + pipeline data.

**Note:** Five-source live pipeline is **built** (HN, arXiv, Wikimedia, GitHub, Product Hunt). Phase 3 adds *additional* sources.

- [ ] Job board integrations
- [ ] Research paper ingestion (beyond arXiv)
- [ ] Patent data
- [ ] Funding databases
- [ ] News sources
- [ ] Government reports
- [ ] Automated change detection beyond weekly cadence
- [ ] Real momentum / confidence scoring at scale

---

## Phase 4 — Platform Expansion

- [ ] User accounts and saved preferences
- [ ] Premium tier (advanced intelligence, forecasting, reports, scoring)
- [ ] Enterprise (API, custom intelligence, white-label)
- [ ] Living Intelligence Network (relationship graphs, cause/effect visualization)
- [ ] Community / discussion (only if change layer retention is proven)

---

## Explicitly Out of Scope (MVP V1.1)

- Relationship graphs
- Community / discussion boards
- User accounts
- Premium / enterprise features
- AI chatbot homepage
- LLM summarization in pipeline
- Additional data sources beyond locked five (until post-PMF)

---

## Retention Metrics by Phase

| Phase | Primary Metric |
|---|---|
| Phase 1 | Week 2 return rate |
| Phase 1 | Change hero engagement |
| Phase 1 | Time to first actionable insight (< 60s) |
| Phase 1 | 15-second dashboard comprehension (Sprint 3A) |
| Phase 2 | Week 4 return rate |
| Phase 2 | Digest open rate |
| Phase 3 | Change accuracy vs manual curation |

# HorizonIQ — Project Memory

Version: MVP V1.1 (Change-First)
Status: Active Development

---

## Core Product Principle

Users do not return for signals.

Users return for **changes in signals**.

HorizonIQ is not a signal platform.

HorizonIQ is a **signal change platform**.

Every feature must pass the retention test:

> Does this give the user a reason to come back next week?

If not, cut it or redesign it.

---

## Product Vision

HorizonIQ is not a trend website.

HorizonIQ is a personalized intelligence platform.

Mission:

Help people discover:

- Emerging technologies
- Future skills
- Future careers
- Business opportunities
- Investment opportunities
- Industry shifts

before they become mainstream.

Tagline:

Observe. Predict. Lead.

---

## Core Problem

Information is fragmented.

Users currently need:

- Reddit
- Quora
- LinkedIn
- Google Trends
- Job Boards
- Industry Reports
- News Sites

to understand what is happening.

HorizonIQ becomes the single place where users discover:

- What is changing
- Why it matters
- What to do next

---

## Target Users

### Student

Needs:

- Future skills
- Career paths
- Technologies worth learning

Questions:

- What should I learn?
- Which jobs are growing?
- Which technologies matter?

---

### Professional

Needs:

- Career growth
- Skill upgrades
- Industry intelligence

Questions:

- What skills should I add?
- What trends affect my role?

---

### Entrepreneur

Needs:

- Market opportunities
- Startup ideas
- Emerging demand

Questions:

- What should I build?
- Which markets are growing?

---

### Investor

Needs:

- Growth sectors
- Technology adoption
- Capital flow signals

Questions:

- Where is the next opportunity?

---

## UX Philosophy

Inspired by:

- Apple
- Linear
- Stripe
- Notion
- Bloomberg

Avoid:

- Cyberpunk
- Hacker aesthetics
- Neon effects
- Crypto dashboards
- Generic SaaS templates

The product should feel:

- Premium
- Intelligent
- Calm
- Trustworthy
- Beautiful

---

## Design Principles

Rule #1

Intelligence must be beautiful.

Rule #2

Every visual element must communicate meaning.

Rule #3

Animation is information.

Never decoration.

---

## Intelligence Layer: What Changed For You

The primary intelligence layer of MVP V1.

Not a feature. The product.

### Dashboard Contract

Every dashboard must contain:

1. **What Changed** — what is new, rising, falling, or different
2. **Why It Matters** — personalized impact for this user
3. **What To Do** — one clear recommended action

### Top-Level Section (Required)

**"What Changed Since Your Last Visit"**

- Hero section at top of dashboard
- First thing user sees after onboarding
- Answers: "What is different since I was here last?"

First visit fallback: **"What Changed This Week"** (global briefing period).

Return visits: compare against last visit snapshot (localStorage, no login).

### Signal Contract

Every signal must contain:

| Field | Purpose |
|---|---|
| **Current State** | What is happening now |
| **Change Since Last Period** | New · Rising · Falling · Stable — with delta detail |
| **Explanation** | Why the change matters — personalized by role, region, interests |
| **Recommended Action** | What this user should do about it |

Legacy Observe → Understand → Act maps to this structure:

- Observe = Current State + Change
- Understand = Explanation (personalized)
- Act = Recommended Action

### Personalization Dimensions

Every explanation must account for:

- **Role** — student, professional, entrepreneur, investor
- **Region** — fixed region list (8 regions)
- **Interests** — multi-select predefined categories

Same signal. Different "so what" per user.

---

## Current MVP Flow

Step 1 — User selects role, region, interests

Step 2 — System creates personalized intelligence briefing

Step 3 — User sees **What Changed Since Your Last Visit** (hero)

Step 4 — User sees changed signals, skills, opportunities, actions

Step 5 — User opens signal detail for full change context

**Time target:** Useful personalized intelligence within 60 seconds.

---

## Signal Metadata

Every signal includes:

Current State

Change Since Last Period (type, summary, delta)

Explanation (base + role/region/interest variants)

Recommended Action (base + role variants)

Momentum + Confidence (with drivers)

Sources (labeled — mock data must be labeled)

Affected Industries

Affected Roles

---

## Data Strategy (MVP V1)

Curated mock datasets. No live pipeline.

Files:

- `signals.json`
- `skills.json`
- `jobs.json`
- `recommendations.json`

Architecture must allow swapping JSON for live APIs later.

Each signal record must include **change metadata** and **personalized explanation variants**.

Mock data must be **refreshed on a weekly cadence** (manual updates acceptable for MVP).

Visit state stored in localStorage:

- `lastVisitAt`
- Snapshot of signal states at last visit

Enables "since your last visit" without accounts.

---

## Region Options (Fixed)

North America · Europe · India · China · Southeast Asia · Middle East · Africa · Latin America

No free text.

---

## Interest Options (Fixed, Multi-Select)

**Technology:** Artificial Intelligence · Robotics · Quantum Computing · Cybersecurity · Cloud Computing

**Industry:** Manufacturing · Supply Chain · Healthcare · Finance · Energy

**Business:** Entrepreneurship · Startups · Venture Capital · Product Management

---

## Signal Detail View

Clicking a signal opens a dedicated page.

Sections:

- Overview (current state)
- What Changed (since last period)
- Momentum Drivers
- Affected Industries
- Recommended Skills
- Opportunities
- Recommended Actions

Each section answers the six user questions:

1. What is happening?
2. Why does it matter?
3. What industries are affected?
4. What skills are relevant?
5. What opportunities are emerging?
6. What action should the user take?

No relationship graphs in MVP.

---

## Feature Retention Filter

Every proposed feature must pass:

> Does this give the user a reason to come back next week?

If the data did not change, would this feature still feel valuable on visit 2?

- **Yes** → build or keep (possibly reframed)
- **No** → cut, hide, or defer

### Approved (Improves Weekly Return)

- "What Changed Since Your Last Visit" hero
- Change metadata in signal datasets
- localStorage visit snapshot (no login)
- Personalized explanations (role × region × interest)
- "What Changed This Week" first-visit fallback
- One primary action per briefing
- Labeled sources on every signal
- Signal detail with change-first layout
- Weekly manual data refresh (operational requirement)

### Conditional (Reframe Required)

- **Skills** → "Skills Rising" (demand change only)
- **Opportunities** → "New This Week" / "Heating Up" only
- **Actions** → one primary + optional secondary
- **Momentum / confidence** → always show change arrow (↑/↓ since last period)
- **Signal detail** → lead with What Changed, not overview

### Rejected for MVP (Does Not Improve Weekly Return)

- Signal relationship map
- Relationship flow visualizations
- Community / discussion boards
- More signals on dashboard (volume ≠ value)
- AI chatbot as homepage
- User accounts (defer — email digest is post-MVP retention multiplier)

---

## MVP Priority Stack (Build Order)

1. Change metadata in JSON datasets
2. Visit snapshot in localStorage
3. "What Changed For You" hero section
4. Personalized "so what for you" explanations
5. Reframe downstream sections (skills rising, new opportunities)
6. Signal detail page (change-first layout)
7. Remove / hide signal map and relationship UI

Deprioritized / removed from MVP:

- Signal relationship map
- Relationship flow visualizations
- Community features
- Discussion boards
- User accounts
- Live data ingestion
- Premium features

---

## Implementation Status

### Already Exists

- Core vision and product direction
- User personas and design principles
- Onboarding flow (role → region → interests) with 8 regions and 14 categorized interests
- **What Changed For You** hero section
- Dashboard with change-first signals, skills rising, opportunities, actions
- Signal detail pages (`/signals/[id]`) with change-first layout
- JSON data layer (`data/*.json`) with change metadata
- Data access layer (`lib/data/access.ts`)
- Visit snapshot (`lib/visit-snapshot.ts`) for return-visit diffs
- Role-based personalization ("so what for you")
- Primary action per briefing

### Needs Improvement

- Weekly manual data refresh process (operational)
- Broader signal coverage across all 14 interests
- Analytics for Week 2 return rate
- More region-specific explanation variants

### Not Yet Started

- Live data ingestion
- Relationship graph (future)
- Discussion boards
- User accounts
- Premium features
- Community features
- Email digest for weekly briefing

---

## Living Intelligence Network

Future Version

Signals should connect.

Example:

Battery Technology
→ Energy Storage
→ Renewables
→ Grid Modernization

Users should understand:

- causes
- effects
- dependencies

through visualization.

---

## Data Sources (Future)

Jobs
Patents
Research Papers
Funding
News
Government Reports
Startup Databases

---

## Business Model

Freemium

Free:
Basic intelligence

Premium:
Advanced intelligence
Forecasting
Industry reports
Opportunity scoring

Enterprise:
API
Custom intelligence
White-label dashboards

---

## Non Negotiables

No login required for MVP.

No AI chatbot as homepage.

No dashboard overload.

No random metrics.

No fake data without labels.

No dark cyberpunk aesthetics.

No unnecessary 3D.

No meaningless animations.

No relationship graphs in MVP.

No community or discussion features in MVP.

Every screen must answer:

"What changed, why it matters, and what to do."

for the user.

---

## Retention Metrics (MVP Success)

Primary:

- **Week 2 return rate** — did they come back?
- **Change section engagement** — did they read "What Changed"?
- **Signal detail from change** — did change drive depth?

Secondary:

- Time to first actionable insight (< 60 seconds)
- Onboarding completion rate
- Trust indicators (source expansion, explanation reads)

MVP validates **habit**, not just **format**.

---

## Current Direction

The platform should feel like:

"Your personal future analyst who tells you what changed."

not

"An AI tool"

not

"A dashboard"

not

"A trend tracker"

not

"A static signal feed"

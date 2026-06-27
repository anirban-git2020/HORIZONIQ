# Project Decisions

## 2026-06-22 — Foundation

Decision:
No cyberpunk aesthetic.

Reason:
Users span students, professionals, entrepreneurs, and investors.
Need broad trust and accessibility.

---

Decision:
Observe. Predict. Lead.

Reason:
Simple and memorable positioning.

---

Decision:
Role-first onboarding.

Reason:
Personalization is core differentiator.

---

Decision:
Curated mock datasets for MVP — no live data pipeline.

Reason:
Validate product value and UX before building large-scale data collection.
Use local files: `signals.json`, `skills.json`, `jobs.json`, `recommendations.json`.
Architecture must allow future swap to live APIs.

Future data sources (out of scope): job boards, research papers, patents, funding databases, news, government reports.

---

Decision:
Fixed regions — no free text.

Regions: North America, Europe, India, China, Southeast Asia, Middle East, Africa, Latin America.

Reason:
Consistent experiences and easier future analytics.

---

Decision:
Predefined interests with multi-select — no custom interests in MVP.

14 categories across Technology, Industry, and Business.

Reason:
Controlled personalization scope for MVP. Custom interests deferred to future versions.

---

Decision:
Signal detail view on click — dedicated page per signal.

Sections: Overview, What Changed, Momentum Drivers, Affected Industries, Recommended Skills, Opportunities, Recommended Actions.

Reason:
Core differentiator for depth and explainability. No relationship graphs in MVP.

---

Decision:
MVP objective — useful personalized intelligence within 60 seconds.

Reason:
Clarity over feature count. Intelligence over visuals. Usefulness over complexity.

---

## 2026-06-22 — Product Direction

### Decision

HorizonIQ is not a signal platform.

HorizonIQ is a signal change platform.

### Reason

Users return because something changed.

Not because a signal exists.

### Outcome

Approved

---

## 2026-06-22 — Retention Pivot

Decision:
New core product principle — "What Changed For You" intelligence layer.

Reason:
First-visit depth alone does not create weekly return.
Retention requires visible delta, personalized explanation, and clear action.

---

Decision:
Required dashboard contract — What Changed · Why It Matters · What To Do.

Reason:
Every screen must reinforce the three questions users return for.
Static signal lists fail the retention test.

---

Decision:
Top-level dashboard section — "What Changed Since Your Last Visit".

Reason:
Return visits need a hero answer to "what is different since I was here?"
First visit falls back to "What Changed This Week".

Implementation:
localStorage visit snapshot (no login required for MVP).

---

Decision:
Every signal must include Current State, Change Since Last Period, Explanation, Recommended Action.

Reason:
Signals are units of change, not units of information.
Detail without delta does not drive return.

---

Decision:
Personalize explanations by role, region, and interests.

Reason:
Generic change alerts feel like newsletters.
Personalized change feels like an analyst.

---

Decision:
Remove relationship graphs from MVP scope.

Reason:
Graphs optimize for exploration, not return.
They add complexity without improving weekly habit.
Existing signal map / relationship flow UI is out of MVP.

---

Decision:
Deprioritize skills, opportunities, and actions lists unless framed as change.

Reason:
Static lists do not improve weekly return.
Only "skills rising," "new opportunities," and "updated actions" pass retention test.

---

Decision:
Curated mock data must include change metadata and weekly refresh cadence.

Reason:
Without change in data, "What Changed For You" becomes theater.
Manual weekly JSON updates are acceptable for MVP validation.

---

Decision:
Explicitly out of MVP — community, discussion boards, accounts, live ingestion.

Reason:
Focus retention engineering on change layer and trust before scale features.

---

Decision:
Smallest high-impact feature — personalized "so what for you" one-liner per signal.

Reason:
Proves personalization, delivers 60-second value, anchors signal detail, low build cost.

---

Decision:
MVP validates habit (Week 2 return), not just first-visit format.

Primary metrics: Week 2 return rate, change hero engagement, signal detail from change.

Reason:
Strategic critique identified that first-visit depth alone does not create weekly return.

---

Decision:
Feature retention filter required for all new features.

Litmus test: "Does this give the user a reason to come back next week?"

Reason:
Prevents feature creep that improves first visit but not return visits.

---

## 2026-06-27 — Sprint 1: Premium First-Time Onboarding

### Decision

First-time users see a welcome animation, name capture, personalized greeting, and optional guided tour before the first briefing.

### Reason

Premium first impression and clearer orientation without changing dashboard intelligence logic.

### Implementation

- Routes: `/onboarding/welcome`, `/name`, `/greeting`, `/tour`
- `IdentityService` with `LocalIdentityService` (localStorage key `horizoniq.identity.v1`)
- Future auth providers documented in `lib/identity/future-providers.ts` — not implemented
- Guided tour overlay on dashboard via `data-tour` attributes only
- Tour choice required before first dashboard visit

### Outcome

Approved

---

### Decision

No authentication in Sprint 1.

### Reason

Identity layer must be swappable before Google/GitHub/Supabase integration.

### Outcome

Approved


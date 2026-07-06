# HorizonIQ — Product Analytics Metrics

**Sprint 4A** — definitions only. No dashboard UI in this sprint.

All metrics use **anonymous** visitor and session IDs. No PII, emails, passwords, or raw search text.

---

## Activation Rate

**Definition:** Share of new visitors who complete onboarding (`onboarding_completed`) and reach `dashboard_loaded` with `visitType: first`.

**Formula:** `onboarding_completed` ÷ `app_opened` (first-time cohort)

**Source events:** `app_opened`, `onboarding_completed`, `dashboard_loaded`

**Target (MVP):** Establish baseline in first 30 days of beta.

---

## Guided Tour Completion

**Definition:** Share of users who start the guided tour and finish all steps without skipping.

**Formula:** `guided_tour_completed` ÷ `guided_tour_started`

**Source events:** `guided_tour_started`, `guided_tour_completed`, `guided_tour_skipped`

---

## Dashboard Load Time

**Definition:** Time from `app_opened` to `dashboard_loaded` for first-time users.

**Formula:** `dashboard_loaded.timeToValueMs` (median, p75)

**Source events:** `dashboard_loaded`, `app_opened`

**Also measured by:** Vercel Speed Insights (Core Web Vitals, LCP, INP, CLS)

---

## Average Session Length

**Definition:** Mean duration of browser sessions.

**Formula:** Archived session `durationMs` from `horizoniq.analytics.sessions.v1` (local) → future backend sync

**Source:** Session tracking (`startSession`, `endSession`)

---

## Return Rate

**Definition:** Share of visitors who return within 7 days of first `dashboard_loaded`.

**Formula:** Unique visitors with `return_visit` ÷ unique visitors with first `dashboard_loaded`

**Source events:** `dashboard_loaded`, `return_visit`

---

## Weekly Return Rate (North Star)

**Definition:** Share of users who open the dashboard in a new briefing period after their first visit.

**Formula:** Visitors with `return_visit` where `briefingPeriod` changed ÷ first-week cohort

**Source events:** `return_visit`, `dashboard_loaded`

**Product goal:** Validates habit — users return because **something changed**.

---

## Recommendation Open Rate

**Definition:** Share of dashboard sessions where a recommendation is opened.

**Formula:** Sessions with `recommendation_opened` ÷ `dashboard_loaded`

**Status:** Infrastructure ready — wire when recommendations become interactive.

---

## Search Usage

**Definition:** Share of sessions that execute search.

**Formula:** Sessions with `search_executed` ÷ `dashboard_loaded`

**Status:** Infrastructure ready — wire when search ships. **Never log query text.**

---

## Change Hero Engagement

**Definition:** Share of dashboard visits where the change hero scrolls into view.

**Formula:** `change_hero_viewed` ÷ `dashboard_loaded`

**Source events:** `change_hero_viewed`, `dashboard_loaded`

---

## Signal Depth Rate

**Definition:** Share of dashboard sessions that open at least one signal.

**Formula:** Sessions with `signal_opened` ÷ `dashboard_loaded`

**Segment by:** `signal_opened.source` (change-hero, watchlist, dashboard-signals)

---

## Briefing Expansion Rate

**Definition:** Share of return visits where supporting intelligence is expanded.

**Formula:** `briefing_expanded` ÷ `dashboard_loaded` where `visitType: return`

**Source events:** `briefing_expanded`, `dashboard_loaded`

---

## Data Sources by Layer

| Layer | Tool | Purpose |
|---|---|---|
| Page views & Web Vitals | Vercel Analytics + Speed Insights | Traffic, performance |
| Session replay | Microsoft Clarity (production, lazy) | UX debugging |
| Product events | `lib/analytics` abstraction | Funnels, retention |
| Optional | PostHog (`NEXT_PUBLIC_POSTHOG_KEY`) | Advanced funnels |

---

## Privacy Constraints

- Anonymous UUID visitor ID only (`horizoniq.analytics.visitor-id.v1`)
- No emails, passwords, or typed search content
- Interest IDs are predefined categories — not free text
- Event buffer capped at 200 events in localStorage

---

*Last updated: Sprint 4A — 2026-07-06*

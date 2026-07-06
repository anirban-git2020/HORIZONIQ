# HorizonIQ — Session Handoff V13

**Last updated:** 2026-07-06  
**Version:** MVP V1.1 (Change-First) + Sprint 4A Analytics  
**Status:** Active Development — production analytics layer shipped  
**Supersedes:** `SESSION_HANDOFF_V12.md`

**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Read first:** This file → `PROJECT_MEMORY.md` → `docs/analytics/metrics.md`

---

## Sprint 4A Summary — Product Analytics

HorizonIQ is now **measurable** in production without changing product logic or UI design.

### What shipped

| Layer | Implementation |
|---|---|
| **Vercel Analytics** | `<Analytics />` in `app/layout.tsx` |
| **Speed Insights** | `<SpeedInsights />` in `app/layout.tsx` |
| **Microsoft Clarity** | Lazy-loaded in production when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set |
| **Abstraction** | `lib/analytics/` — UI calls `track()` only |
| **Visitor ID** | UUID in `horizoniq.analytics.visitor-id.v1` |
| **Sessions** | `horizoniq.analytics.session.v1` + archive `horizoniq.analytics.sessions.v1` |
| **Events** | Typed Sprint 4A taxonomy in `lib/analytics/events.ts` |
| **Metrics docs** | `docs/analytics/metrics.md` |

### Architecture

```
UI / pages
    ↓ track(name, props)
lib/analytics/analytics.ts
    ├─ localStorage event buffer
    ├─ visitor + session enrichment
    └─ provider sinks (providers.ts)
         ├─ Vercel Analytics (custom events)
         ├─ PostHog (optional, NEXT_PUBLIC_POSTHOG_KEY)
         └─ Clarity (session replay, production lazy load)
```

### Key files

| Path | Role |
|---|---|
| `lib/analytics/analytics.ts` | Core `track()`, sink registration |
| `lib/analytics/events.ts` | Typed event taxonomy |
| `lib/analytics/providers.ts` | Provider initialization |
| `lib/analytics/visitor.ts` | Anonymous UUID |
| `lib/analytics/session.ts` | Session lifecycle + signal source memory |
| `lib/analytics/clarity.ts` | Clarity lazy loader |
| `lib/analytics/posthog.ts` | Optional PostHog sink |
| `components/analytics/analytics-provider.tsx` | Client bootstrap |
| `docs/analytics/metrics.md` | Metric definitions |

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| *(none)* | — | Vercel Analytics + Speed Insights on Vercel deploy |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Optional | Microsoft Clarity (production only) |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | PostHog product events |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | PostHog API host |

See `.env.example`.

### Vercel dashboard steps

1. **Project → Analytics → Enable Web Analytics** (if not already on)
2. **Project → Speed Insights → Enable**
3. **Settings → Environment Variables** — add `NEXT_PUBLIC_CLARITY_PROJECT_ID` for Production
4. Redeploy after adding Clarity ID

### Events instrumented today

`app_opened`, `role_selected`, `region_selected`, `interest_selected`, `onboarding_completed`, `guided_tour_started`, `guided_tour_skipped`, `guided_tour_completed`, `dashboard_loaded`, `return_visit`, `change_hero_viewed`, `signal_opened`, `briefing_expanded`, `cta_clicked`

### Events defined but not wired (no UI yet)

`search_executed`, `recommendation_opened`, `forecast_opened`, `footer_link_clicked`

### Privacy (locked)

- No emails, passwords, or search query text
- Anonymous UUID only — no authentication

---

## Prior context (unchanged)

- **Change-first platform** — users return for changes in signals
- **Onboarding** — cookie + middleware + auto-repair (`hziq_ob_v3`)
- **Weekly pipeline** — Monday 06:00 UTC; CI verifies build before push
- **Production briefing** — W28 as of 2026-07-06

See `SESSION_HANDOFF_V12.md` for full onboarding architecture.

---

## Deferred to future sprints

- PostHog funnel dashboards
- Backend session/event sync
- Wire search, recommendation, forecast, footer events when UI exists
- Analytics admin UI

---

*End of Session Handoff V13*

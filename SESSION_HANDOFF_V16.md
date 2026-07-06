# HorizonIQ — Session Handoff V16

**Last updated:** 2026-07-06  
**Version:** MVP V1.1 + Sprint 4A + Sprint 3.9 + Sprint 3.95 Feedback  
**Supersedes:** `SESSION_HANDOFF_V15.md`

## Sprint 3.95 — Feedback System

### Shipped

- Global `FeedbackWidget` in `app/layout.tsx` (inside `PreferencesProvider`)
- `POST /api/feedback` — Supabase insert + optional screenshot upload
- `supabase/schema/feedback.sql` — run in Supabase SQL editor
- `docs/feedback/README.md` — full setup guide

### Required Vercel env (Production)

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_FEEDBACK_BUCKET=feedback-screenshots  # optional
```

### Supabase setup checklist

1. Run `supabase/schema/feedback.sql`
2. Create Storage bucket `feedback-screenshots` (public recommended for MVP)
3. Add env vars to Vercel → redeploy

### Key paths

```
types/feedback.ts
services/feedbackService.ts
hooks/useFeedback.ts
lib/feedback/
components/feedback/
app/api/feedback/route.ts
```

### Deferred

- Admin dashboard UI (query presets in `lib/feedback/admin-queries.ts`)
- Email notifications on new feedback
- Status workflow UI (NEW → OPEN → RESOLVED → ARCHIVED)

See `SESSION_HANDOFF_V15.md` for prior sprint context.

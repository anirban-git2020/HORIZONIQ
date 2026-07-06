# HorizonIQ Feedback System (Sprint 3.95)

In-app feedback for Beta Preview — Supabase-backed, no email client required.

## Database schema

Table: `public.feedback`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, `gen_random_uuid()` |
| `type` | `text` | `bug_report`, `feature_request`, `improvement`, `question`, `general_feedback` |
| `message` | `text` | 8–4000 characters |
| `email` | `text` | Optional contact email |
| `screenshot_url` | `text` | Supabase Storage public URL (nullable) |
| `metadata` | `jsonb` | Auto-captured context (visitor, session, page, device, preferences) |
| `status` | `text` | Default `NEW` — `OPEN`, `RESOLVED`, `ARCHIVED` for admin workflow |
| `created_at` | `timestamptz` | Default `now()` |

Indexes: `(status, created_at)`, `(type, created_at)`, `(created_at)`.

SQL: `supabase/schema/feedback.sql`

## Storage bucket

| Setting | Value |
|---|---|
| **Name** | `feedback-screenshots` (override via `SUPABASE_FEEDBACK_BUCKET`) |
| **Public** | Recommended for simple public URLs stored in `screenshot_url` |
| **MIME types** | `image/png`, `image/jpeg`, `image/webp` |
| **Max size** | 5 MB (enforced in API route) |
| **Path pattern** | `{visitorId}/{timestamp}-{uuid}.{ext}` |

## API flow

```
FeedbackWidget (client)
  → hooks/useFeedback.ts
  → services/feedbackService.ts (validate + FormData)
  → POST /api/feedback
       ├─ upload screenshot → Supabase Storage (service role)
       └─ insert row → public.feedback (service role)
  → Success UI
```

All writes use `SUPABASE_SERVICE_ROLE_KEY` on the server. The browser never receives the service role key.

## Automatic metadata (`metadata` jsonb)

- `timestamp`, `visitorId`, `sessionId`
- `url`, `page` (human label)
- `appVersion`, `browser`, `operatingSystem`
- `viewportWidth`, `viewportHeight`, `screenWidth`, `screenHeight`
- `role`, `region`, `interests` (when preferences exist)

## Future admin dashboard (deferred)

Query presets live in `lib/feedback/admin-queries.ts`:

- Newest feedback
- Open (NEW + OPEN)
- Resolved / Archived
- Feature requests / Bug reports
- Most requested features (grouped)

No admin UI in Sprint 3.95. Add authenticated admin routes later using the same service role or RLS for staff roles.

## Environment variables

See `.env.example` — Feedback section.

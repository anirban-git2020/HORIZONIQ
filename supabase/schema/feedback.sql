-- HorizonIQ Sprint 3.95 — Feedback system schema
-- Run in Supabase SQL editor or via migration tooling.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  type text not null check (
    type in (
      'bug_report',
      'feature_request',
      'improvement',
      'question',
      'general_feedback'
    )
  ),
  message text not null check (char_length(message) between 8 and 4000),
  email text,
  screenshot_url text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'NEW' check (
    status in ('NEW', 'OPEN', 'RESOLVED', 'ARCHIVED')
  ),
  created_at timestamptz not null default now()
);

create index if not exists feedback_status_created_at_idx
  on public.feedback (status, created_at desc);

create index if not exists feedback_type_created_at_idx
  on public.feedback (type, created_at desc);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

comment on table public.feedback is
  'Beta in-app feedback — admin dashboard reads via service role.';

-- Storage bucket (create in Supabase Dashboard → Storage):
-- Name: feedback-screenshots
-- Public: optional (public URLs stored in screenshot_url)
-- MIME allowlist: image/png, image/jpeg, image/webp
-- Max file size: 5 MB (enforced in API route)

-- RLS: keep disabled or deny all for anon/authenticated.
-- All writes go through Next.js API route using SUPABASE_SERVICE_ROLE_KEY.

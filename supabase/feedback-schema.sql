-- HorizonIQ — feedback backend schema
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent). Matches the columns written by
-- app/api/feedback/route.ts and the values in types/feedback.ts.

-- 1. Table -------------------------------------------------------------------
create table if not exists public.feedback (
  id             uuid primary key default gen_random_uuid(),
  type           text        not null check (type in (
                   'bug_report','feature_request','improvement','question','general_feedback')),
  message        text        not null check (char_length(message) between 8 and 4000),
  email          text,
  screenshot_url text,
  metadata       jsonb       not null,
  status         text        not null default 'NEW' check (status in (
                   'NEW','OPEN','RESOLVED','ARCHIVED')),
  created_at     timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_status_idx     on public.feedback (status);
create index if not exists feedback_type_idx       on public.feedback (type);

-- 2. Row Level Security ------------------------------------------------------
-- The API authenticates with the SERVICE-ROLE key, which bypasses RLS. Enable
-- RLS with NO public policies: the server can read/write, the public cannot.
-- (If SUPABASE_SERVICE_ROLE_KEY is mistakenly set to the ANON key, inserts are
--  blocked here and you get exactly the "Unable to save feedback" 500 — fix the
--  env var, not the policy.)
alter table public.feedback enable row level security;

-- 3. Screenshot storage bucket ----------------------------------------------
-- Public read so getPublicUrl() resolves; uploads run via the service role.
insert into storage.buckets (id, name, public)
values ('feedback-screenshots', 'feedback-screenshots', true)
on conflict (id) do nothing;

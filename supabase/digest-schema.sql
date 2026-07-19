-- HorizonIQ — weekly email digest fields on the profiles table.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Idempotent.
-- Requires supabase/profiles-schema.sql to have been run first.

alter table public.profiles
  add column if not exists digest_opt_in      boolean     not null default false,
  add column if not exists digest_cadence     text        not null default 'weekly',
  -- Per-user momentum baseline from the last send: { "<interestId>": <momentum> }.
  -- The sender diffs current scores against this; absent = first send (baseline only).
  add column if not exists digest_snapshot    jsonb,
  add column if not exists digest_last_sent_at timestamptz,
  -- Opaque token for the one-click unsubscribe link (no login needed to opt out).
  add column if not exists unsubscribe_token  uuid        not null default gen_random_uuid();

-- Cadence is weekly-only for now; guard the column so bad values can't slip in.
alter table public.profiles
  drop constraint if exists profiles_digest_cadence_check;
alter table public.profiles
  add constraint profiles_digest_cadence_check
  check (digest_cadence in ('weekly'));

-- The sender (service role) looks up opted-in users; index for a cheap scan.
create index if not exists profiles_digest_opt_in_idx
  on public.profiles (digest_opt_in)
  where digest_opt_in;

-- Unsubscribe route resolves a user by token; make that lookup fast + unique.
create unique index if not exists profiles_unsubscribe_token_idx
  on public.profiles (unsubscribe_token);

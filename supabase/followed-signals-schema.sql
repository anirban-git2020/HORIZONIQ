-- HorizonIQ — followed signals (action follow-through, cross-device)
-- Run once in Supabase: SQL Editor → New query → paste → Run. Idempotent.
-- Requires Supabase Auth. One row per (user, signal); RLS locks rows to owner.

create table if not exists public.followed_signals (
  user_id            uuid        not null references auth.users (id) on delete cascade,
  signal_id          text        not null,
  followed_at        timestamptz not null default now(),
  -- The signal's momentum at the moment the user followed it — the baseline the
  -- "You're following" panel measures movement against.
  momentum_at_follow integer     not null,
  primary key (user_id, signal_id)
);

alter table public.followed_signals enable row level security;

drop policy if exists "followed_select_own" on public.followed_signals;
create policy "followed_select_own"
  on public.followed_signals for select
  using (auth.uid() = user_id);

drop policy if exists "followed_insert_own" on public.followed_signals;
create policy "followed_insert_own"
  on public.followed_signals for insert
  with check (auth.uid() = user_id);

drop policy if exists "followed_delete_own" on public.followed_signals;
create policy "followed_delete_own"
  on public.followed_signals for delete
  using (auth.uid() = user_id);

create index if not exists followed_signals_user_idx
  on public.followed_signals (user_id);

-- HorizonIQ — user profiles (cross-device preference sync)
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent). Requires Supabase Auth to be enabled (it is by
-- default). Row Level Security locks every row to its owner.

-- 1. Table -------------------------------------------------------------------
-- id === auth.users.id, so a profile is 1:1 with an authenticated user.
-- Deleting the auth user cascades to the profile.
create table if not exists public.profiles (
  id           uuid        primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  role         text,
  region       text,
  interests    jsonb       not null default '[]'::jsonb,
  updated_at   timestamptz not null default now()
);

-- 2. Row Level Security ------------------------------------------------------
-- Enable RLS, then allow each user to see and change ONLY their own row.
-- Without a matching policy, all access is denied by default.
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Auto-create a profile row when a user signs up --------------------------
-- SECURITY DEFINER so the trigger can insert regardless of the caller's RLS.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Keep updated_at fresh on every write ------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

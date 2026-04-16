-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements D-02, D-09, and D-10 by defining the canonical internal user identifier
-- mapping (email/username) and account-state flags used by server-side sign-in checks.

create table if not exists public.internal_user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  username text not null unique,
  is_locked boolean not null default false,
  is_deactivated boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.internal_user_profiles enable row level security;

revoke all on table public.internal_user_profiles from anon, authenticated;

-- Allow authenticated users to read ONLY their own profile row.
-- This supports non-privileged runtime checks (e.g., role-gated routing) without exposing other users.
grant select on table public.internal_user_profiles to authenticated;

drop policy if exists internal_user_profiles_read_own on public.internal_user_profiles;
create policy internal_user_profiles_read_own
  on public.internal_user_profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create index if not exists internal_user_profiles_email_idx
  on public.internal_user_profiles (email);

create index if not exists internal_user_profiles_username_idx
  on public.internal_user_profiles (username);

-- Seed example for local/dev (replace ids/emails with non-production test data only):
-- insert into public.internal_user_profiles (user_id, email, username, is_locked, is_deactivated)
-- values (
--   '00000000-0000-0000-0000-000000000001',
--   'staff.demo@tainghe.local',
--   'staff.demo',
--   false,
--   false
-- )
-- on conflict (user_id) do update
-- set
--   email = excluded.email,
--   username = excluded.username,
--   is_locked = excluded.is_locked,
--   is_deactivated = excluded.is_deactivated,
--   updated_at = timezone('utc', now());

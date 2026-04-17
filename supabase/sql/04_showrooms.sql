-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements CAT-03 (Phase 5): Showroom directory records for downstream inventory & operations.
-- This script is idempotent (safe to run multiple times).

create table if not exists public.showrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint showrooms_name_unique unique (name)
);

alter table public.showrooms enable row level security;

revoke all on table public.showrooms from anon, authenticated;

grant select, insert, update, delete on table public.showrooms to authenticated;

-- Only active internal users (staff/admin) may read & manage showrooms.
-- This checks the caller's own profile row (internal_user_profiles RLS permits reading own row).
drop policy if exists showrooms_select_internal on public.showrooms;
create policy showrooms_select_internal
  on public.showrooms
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.internal_user_profiles p
      where p.user_id = auth.uid()
        and p.is_locked = false
        and p.is_deactivated = false
        and p.role in ('admin', 'staff')
    )
  );

drop policy if exists showrooms_insert_internal on public.showrooms;
create policy showrooms_insert_internal
  on public.showrooms
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.internal_user_profiles p
      where p.user_id = auth.uid()
        and p.is_locked = false
        and p.is_deactivated = false
        and p.role in ('admin', 'staff')
    )
  );

drop policy if exists showrooms_update_internal on public.showrooms;
create policy showrooms_update_internal
  on public.showrooms
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.internal_user_profiles p
      where p.user_id = auth.uid()
        and p.is_locked = false
        and p.is_deactivated = false
        and p.role in ('admin', 'staff')
    )
  )
  with check (
    exists (
      select 1
      from public.internal_user_profiles p
      where p.user_id = auth.uid()
        and p.is_locked = false
        and p.is_deactivated = false
        and p.role in ('admin', 'staff')
    )
  );

drop policy if exists showrooms_delete_internal on public.showrooms;
create policy showrooms_delete_internal
  on public.showrooms
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.internal_user_profiles p
      where p.user_id = auth.uid()
        and p.is_locked = false
        and p.is_deactivated = false
        and p.role in ('admin', 'staff')
    )
  );

create index if not exists showrooms_created_at_idx on public.showrooms (created_at desc);

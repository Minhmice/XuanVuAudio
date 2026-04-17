-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements Phase 4 (CAT-01, CAT-02): brand + category taxonomies with publish controls.
-- This script is idempotent (safe to run multiple times).

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Helpers
-- ------------------------------------------------------------
create or replace function public.is_internal_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.internal_user_profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
      and p.is_deactivated = false
  );
$$;

-- ------------------------------------------------------------
-- Brands
-- ------------------------------------------------------------
create table if not exists public.catalog_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  logo_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_brands_slug_unique'
  ) then
    alter table public.catalog_brands
      add constraint catalog_brands_slug_unique unique (slug);
  end if;
end $$;

create index if not exists catalog_brands_slug_idx
  on public.catalog_brands (slug);

create index if not exists catalog_brands_published_idx
  on public.catalog_brands (is_published);

alter table public.catalog_brands enable row level security;

revoke all on table public.catalog_brands from anon, authenticated;

-- Public read is limited to published rows (future storefront-safe default).
grant select on table public.catalog_brands to anon;

drop policy if exists catalog_brands_public_read_published on public.catalog_brands;
create policy catalog_brands_public_read_published
  on public.catalog_brands
  for select
  to anon
  using (is_published = true);

-- Authenticated read for internal usage (still limited by future app routing).
grant select on table public.catalog_brands to authenticated;

drop policy if exists catalog_brands_authenticated_read on public.catalog_brands;
create policy catalog_brands_authenticated_read
  on public.catalog_brands
  for select
  to authenticated
  using (is_published = true or public.is_internal_admin());

-- Writes are restricted to internal admins.
grant insert, update, delete on table public.catalog_brands to authenticated;

drop policy if exists catalog_brands_admin_insert on public.catalog_brands;
create policy catalog_brands_admin_insert
  on public.catalog_brands
  for insert
  to authenticated
  with check (public.is_internal_admin());

drop policy if exists catalog_brands_admin_update on public.catalog_brands;
create policy catalog_brands_admin_update
  on public.catalog_brands
  for update
  to authenticated
  using (public.is_internal_admin())
  with check (public.is_internal_admin());

drop policy if exists catalog_brands_admin_delete on public.catalog_brands;
create policy catalog_brands_admin_delete
  on public.catalog_brands
  for delete
  to authenticated
  using (public.is_internal_admin());

-- ------------------------------------------------------------
-- Categories
-- ------------------------------------------------------------
create table if not exists public.catalog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_categories_slug_unique'
  ) then
    alter table public.catalog_categories
      add constraint catalog_categories_slug_unique unique (slug);
  end if;
end $$;

create index if not exists catalog_categories_slug_idx
  on public.catalog_categories (slug);

create index if not exists catalog_categories_published_idx
  on public.catalog_categories (is_published);

alter table public.catalog_categories enable row level security;

revoke all on table public.catalog_categories from anon, authenticated;

grant select on table public.catalog_categories to anon;

drop policy if exists catalog_categories_public_read_published on public.catalog_categories;
create policy catalog_categories_public_read_published
  on public.catalog_categories
  for select
  to anon
  using (is_published = true);

grant select on table public.catalog_categories to authenticated;

drop policy if exists catalog_categories_authenticated_read on public.catalog_categories;
create policy catalog_categories_authenticated_read
  on public.catalog_categories
  for select
  to authenticated
  using (is_published = true or public.is_internal_admin());

grant insert, update, delete on table public.catalog_categories to authenticated;

drop policy if exists catalog_categories_admin_insert on public.catalog_categories;
create policy catalog_categories_admin_insert
  on public.catalog_categories
  for insert
  to authenticated
  with check (public.is_internal_admin());

drop policy if exists catalog_categories_admin_update on public.catalog_categories;
create policy catalog_categories_admin_update
  on public.catalog_categories
  for update
  to authenticated
  using (public.is_internal_admin())
  with check (public.is_internal_admin());

drop policy if exists catalog_categories_admin_delete on public.catalog_categories;
create policy catalog_categories_admin_delete
  on public.catalog_categories
  for delete
  to authenticated
  using (public.is_internal_admin());


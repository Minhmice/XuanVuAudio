-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements CAT-04 (Phase 6): canonical product core records with publish controls and gallery boundary.
-- This script is idempotent (safe to run multiple times).

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Helpers
-- ------------------------------------------------------------
-- Keep the helper here so this script can run independently.
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
-- Products (core record)
-- ------------------------------------------------------------
create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  brand_id uuid not null references public.catalog_brands(id) on delete restrict,
  category_id uuid not null references public.catalog_categories(id) on delete restrict,
  description text,
  status text not null default 'active',
  image_urls text[] not null default '{}'::text[],
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_products_slug_unique'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_slug_unique unique (slug);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_products_status_check'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_status_check
        check (status in ('active', 'inactive', 'archived'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_products_gallery_limit_check'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_gallery_limit_check
        check (coalesce(array_length(image_urls, 1), 0) <= 12);
  end if;
end $$;

create index if not exists catalog_products_slug_idx
  on public.catalog_products (slug);

create index if not exists catalog_products_brand_id_idx
  on public.catalog_products (brand_id);

create index if not exists catalog_products_category_id_idx
  on public.catalog_products (category_id);

create index if not exists catalog_products_published_idx
  on public.catalog_products (is_published);

create index if not exists catalog_products_status_idx
  on public.catalog_products (status);

alter table public.catalog_products enable row level security;

revoke all on table public.catalog_products from anon, authenticated;

-- Public read is limited to published rows (future storefront-safe default).
grant select on table public.catalog_products to anon;

drop policy if exists catalog_products_public_read_published on public.catalog_products;
create policy catalog_products_public_read_published
  on public.catalog_products
  for select
  to anon
  using (is_published = true);

-- Authenticated read for internal usage (still limited by future app routing).
grant select on table public.catalog_products to authenticated;

drop policy if exists catalog_products_authenticated_read on public.catalog_products;
create policy catalog_products_authenticated_read
  on public.catalog_products
  for select
  to authenticated
  using (is_published = true or public.is_internal_admin());

-- Writes are restricted to internal admins.
grant insert, update, delete on table public.catalog_products to authenticated;

drop policy if exists catalog_products_admin_insert on public.catalog_products;
create policy catalog_products_admin_insert
  on public.catalog_products
  for insert
  to authenticated
  with check (public.is_internal_admin());

drop policy if exists catalog_products_admin_update on public.catalog_products;
create policy catalog_products_admin_update
  on public.catalog_products
  for update
  to authenticated
  using (public.is_internal_admin())
  with check (public.is_internal_admin());

drop policy if exists catalog_products_admin_delete on public.catalog_products;
create policy catalog_products_admin_delete
  on public.catalog_products
  for delete
  to authenticated
  using (public.is_internal_admin());


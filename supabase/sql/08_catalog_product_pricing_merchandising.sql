-- Apply in Supabase Dashboard -> SQL Editor.
-- Phase 8 (CAT-06, CAT-07): pricing, merchandising flags, first publish timestamp.
-- Idempotent. Requires public.catalog_products from 06_product_core_records.sql.

-- ------------------------------------------------------------
-- Columns
-- ------------------------------------------------------------
alter table public.catalog_products
  add column if not exists price_selling_vnd bigint;

alter table public.catalog_products
  add column if not exists price_compare_at_vnd bigint;

alter table public.catalog_products
  add column if not exists merch_is_featured boolean not null default false;

alter table public.catalog_products
  add column if not exists merch_is_recommended boolean not null default false;

alter table public.catalog_products
  add column if not exists first_published_at timestamptz;

comment on column public.catalog_products.price_selling_vnd is 'Selling price in integer VND (đồng).';
comment on column public.catalog_products.price_compare_at_vnd is 'Optional compare-at / strike-through price in VND.';
comment on column public.catalog_products.merch_is_featured is 'Staff merchandising: featured placement.';
comment on column public.catalog_products.merch_is_recommended is 'Staff merchandising: recommended placement.';
comment on column public.catalog_products.first_published_at is 'Set once on first transition to published; not cleared on unpublish.';

-- ------------------------------------------------------------
-- Compare-at must be >= selling when both are set
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_products_compare_at_gte_selling_vnd'
  ) then
    alter table public.catalog_products
      add constraint catalog_products_compare_at_gte_selling_vnd
        check (
          price_compare_at_vnd is null
          or price_selling_vnd is null
          or price_compare_at_vnd >= price_selling_vnd
        );
  end if;
end $$;

create index if not exists catalog_products_merch_featured_idx
  on public.catalog_products (merch_is_featured)
  where merch_is_featured = true and is_published = true;

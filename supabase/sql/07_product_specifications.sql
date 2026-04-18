-- Apply this script in Supabase Dashboard -> SQL Editor.
-- CAT-05 (Phase 7): structured product specifications + per-product values.
-- Idempotent. Requires catalog_products and is_internal_staff / is_internal_admin from 06_product_core_records.sql.

-- ------------------------------------------------------------
-- Attribute definitions (taxonomy)
-- ------------------------------------------------------------
create table if not exists public.catalog_spec_attributes (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  label_vi text not null,
  group_name text not null,
  value_type text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint catalog_spec_attributes_slug_unique unique (slug),
  constraint catalog_spec_attributes_value_type_check
    check (value_type in ('text', 'number', 'boolean'))
);

create index if not exists catalog_spec_attributes_group_sort_idx
  on public.catalog_spec_attributes (group_name, sort_order);

create index if not exists catalog_spec_attributes_active_idx
  on public.catalog_spec_attributes (is_active) where is_active = true;

-- ------------------------------------------------------------
-- Per-product values
-- ------------------------------------------------------------
create table if not exists public.catalog_product_spec_values (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  attribute_id uuid not null references public.catalog_spec_attributes (id) on delete restrict,
  value_text text,
  value_number numeric,
  value_boolean boolean,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint catalog_product_spec_values_product_attribute_unique unique (product_id, attribute_id)
);

create index if not exists catalog_product_spec_values_product_id_idx
  on public.catalog_product_spec_values (product_id);

create index if not exists catalog_product_spec_values_attribute_id_idx
  on public.catalog_product_spec_values (attribute_id);

-- ------------------------------------------------------------
-- RLS: attributes — staff read; admin write
-- ------------------------------------------------------------
alter table public.catalog_spec_attributes enable row level security;

revoke all on table public.catalog_spec_attributes from anon, authenticated;

grant select on table public.catalog_spec_attributes to authenticated;
grant insert, update, delete on table public.catalog_spec_attributes to authenticated;

drop policy if exists catalog_spec_attributes_staff_select on public.catalog_spec_attributes;
create policy catalog_spec_attributes_staff_select
  on public.catalog_spec_attributes
  for select
  to authenticated
  using (public.is_internal_staff());

drop policy if exists catalog_spec_attributes_admin_insert on public.catalog_spec_attributes;
create policy catalog_spec_attributes_admin_insert
  on public.catalog_spec_attributes
  for insert
  to authenticated
  with check (public.is_internal_admin());

drop policy if exists catalog_spec_attributes_admin_update on public.catalog_spec_attributes;
create policy catalog_spec_attributes_admin_update
  on public.catalog_spec_attributes
  for update
  to authenticated
  using (public.is_internal_admin())
  with check (public.is_internal_admin());

drop policy if exists catalog_spec_attributes_admin_delete on public.catalog_spec_attributes;
create policy catalog_spec_attributes_admin_delete
  on public.catalog_spec_attributes
  for delete
  to authenticated
  using (public.is_internal_admin());

-- ------------------------------------------------------------
-- RLS: values — same staff pattern as catalog_products
-- ------------------------------------------------------------
alter table public.catalog_product_spec_values enable row level security;

revoke all on table public.catalog_product_spec_values from anon, authenticated;

grant select, insert, update, delete on table public.catalog_product_spec_values to authenticated;

drop policy if exists catalog_product_spec_values_staff_select on public.catalog_product_spec_values;
create policy catalog_product_spec_values_staff_select
  on public.catalog_product_spec_values
  for select
  to authenticated
  using (public.is_internal_staff());

drop policy if exists catalog_product_spec_values_staff_insert on public.catalog_product_spec_values;
create policy catalog_product_spec_values_staff_insert
  on public.catalog_product_spec_values
  for insert
  to authenticated
  with check (public.is_internal_staff());

drop policy if exists catalog_product_spec_values_staff_update on public.catalog_product_spec_values;
create policy catalog_product_spec_values_staff_update
  on public.catalog_product_spec_values
  for update
  to authenticated
  using (public.is_internal_staff())
  with check (public.is_internal_staff());

drop policy if exists catalog_product_spec_values_staff_delete on public.catalog_product_spec_values;
create policy catalog_product_spec_values_staff_delete
  on public.catalog_product_spec_values
  for delete
  to authenticated
  using (public.is_internal_staff());

-- ------------------------------------------------------------
-- Seed (headphone-oriented)
-- ------------------------------------------------------------
insert into public.catalog_spec_attributes (slug, label_vi, group_name, value_type, sort_order, is_active)
values
  ('driver_size_mm', 'Cỡ driver (mm)', 'Âm thanh', 'number', 10, true),
  ('impedance_ohm', 'Trở kháng (Ω)', 'Âm thanh', 'number', 20, true),
  ('sensitivity_db', 'Độ nhạy (dB)', 'Âm thanh', 'number', 30, true),
  ('frequency_response', 'Dải tần số', 'Âm thanh', 'text', 40, true),
  ('weight_g', 'Trọng lượng (g)', 'Vật lý', 'number', 10, true),
  ('bluetooth_codec', 'Codec Bluetooth', 'Kết nối', 'text', 10, true),
  ('has_anc', 'Chống ồn chủ động (ANC)', 'Tính năng', 'boolean', 10, true)
on conflict (slug) do nothing;

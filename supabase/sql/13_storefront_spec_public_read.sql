-- Apply in Supabase Dashboard -> SQL Editor.
-- Phase 13 (SHOP-02): anon read for spec taxonomy + values tied to published products only.
-- Idempotent. Requires 07_product_specifications.sql.

-- ------------------------------------------------------------
-- catalog_spec_attributes: public read (active definitions only)
-- ------------------------------------------------------------
grant select on table public.catalog_spec_attributes to anon;

drop policy if exists catalog_spec_attributes_public_read_active on public.catalog_spec_attributes;
create policy catalog_spec_attributes_public_read_active
  on public.catalog_spec_attributes
  for select
  to anon
  using (is_active = true);

-- ------------------------------------------------------------
-- catalog_product_spec_values: public read when product is published
-- ------------------------------------------------------------
grant select on table public.catalog_product_spec_values to anon;

drop policy if exists catalog_product_spec_values_public_read_published_product on public.catalog_product_spec_values;
create policy catalog_product_spec_values_public_read_published_product
  on public.catalog_product_spec_values
  for select
  to anon
  using (
    exists (
      select 1
      from public.catalog_products p
      where p.id = catalog_product_spec_values.product_id
        and p.is_published = true
    )
  );

-- ------------------------------------------------------------
-- Seed: form factor (CONTEXT D-07)
-- ------------------------------------------------------------
insert into public.catalog_spec_attributes (slug, label_vi, group_name, value_type, sort_order, is_active)
values ('form_factor', 'Kiểu / form factor', 'Vật lý', 'text', 5, true)
on conflict (slug) do nothing;

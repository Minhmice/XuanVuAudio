-- Phase 19 (SHOP-05): storefront-safe spec rows for published products only.
-- Option A: security definer RPC — anon has no direct SELECT on catalog_product_spec_values.
-- Apply in Supabase Dashboard → SQL Editor. Idempotent.

create or replace function public.storefront_product_spec_rows(p_product_id uuid)
returns table (
  group_name text,
  label_vi text,
  sort_order int,
  value_display text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    a.group_name,
    a.label_vi,
    a.sort_order,
    case a.value_type
      when 'text' then coalesce(v.value_text, '')
      when 'number' then case
        when v.value_number is null then ''
        else trim(to_char(v.value_number, 'FM999999999999999999999999999999'))
      end
      when 'boolean' then case
        when v.value_boolean is true then 'Có'
        when v.value_boolean is false then 'Không'
        else ''
      end
      else ''
    end as value_display
  from public.catalog_products p
  join public.catalog_product_spec_values v on v.product_id = p.id
  join public.catalog_spec_attributes a on a.id = v.attribute_id and a.is_active = true
  where p.id = p_product_id
    and p.is_published = true
    and p.status = 'active'
  order by a.group_name, a.sort_order, a.label_vi;
$$;

comment on function public.storefront_product_spec_rows(uuid) is
  'Phase 19 SHOP-05: spec rows for PDP; only published+active products.';

revoke all on function public.storefront_product_spec_rows(uuid) from public;
grant execute on function public.storefront_product_spec_rows(uuid) to anon, authenticated, service_role;

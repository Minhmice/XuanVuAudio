-- Apply in Supabase Dashboard -> SQL Editor.
-- Phase 17 (INV-03): anon-safe aggregate stock per product (sum across showrooms).
-- Idempotent (safe to run multiple times).

-- Aggregate only — no per-showroom columns (storefront-safe).
create or replace function public.storefront_product_stock_totals(p_product_ids uuid[])
returns table (product_id uuid, total_on_hand bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    si.product_id,
    sum(si.quantity_on_hand)::bigint as total_on_hand
  from public.showroom_inventory si
  where si.product_id = any (p_product_ids)
  group by si.product_id;
$$;

comment on function public.storefront_product_stock_totals(uuid[]) is
  'Phase 17 INV-03: sum quantity_on_hand per product for storefront; no showroom breakdown.';

revoke all on function public.storefront_product_stock_totals(uuid[]) from public;

grant execute on function public.storefront_product_stock_totals(uuid[]) to anon;
grant execute on function public.storefront_product_stock_totals(uuid[]) to authenticated;
grant execute on function public.storefront_product_stock_totals(uuid[]) to service_role;

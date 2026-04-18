-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Phase 16 (INV-02): append-only audit log for showroom inventory changes.
-- Idempotent (safe to run multiple times).

-- ------------------------------------------------------------
-- Adjustments (append-only)
-- ------------------------------------------------------------
create table if not exists public.showroom_inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  showroom_id uuid not null references public.showrooms (id) on delete restrict,
  product_id uuid not null references public.catalog_products (id) on delete restrict,
  quantity_before integer not null,
  quantity_after integer not null,
  note text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  constraint showroom_inventory_adj_qty_before_non_negative check (quantity_before >= 0),
  constraint showroom_inventory_adj_qty_after_non_negative check (quantity_after >= 0)
);

create index if not exists showroom_inventory_adj_showroom_created_idx
  on public.showroom_inventory_adjustments (showroom_id, created_at desc);

create index if not exists showroom_inventory_adj_product_created_idx
  on public.showroom_inventory_adjustments (product_id, created_at desc);

comment on table public.showroom_inventory_adjustments is 'Append-only inventory adjustment events (INV-02).';

-- ------------------------------------------------------------
-- RLS: staff/admin read + insert only (no update/delete)
-- ------------------------------------------------------------
alter table public.showroom_inventory_adjustments enable row level security;

revoke all on table public.showroom_inventory_adjustments from anon, authenticated;

grant select, insert on table public.showroom_inventory_adjustments to authenticated;

drop policy if exists showroom_inventory_adj_select_internal on public.showroom_inventory_adjustments;
create policy showroom_inventory_adj_select_internal
  on public.showroom_inventory_adjustments
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

drop policy if exists showroom_inventory_adj_insert_internal on public.showroom_inventory_adjustments;
create policy showroom_inventory_adj_insert_internal
  on public.showroom_inventory_adjustments
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

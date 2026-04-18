-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Phase 15 (INV-01): per-showroom product quantity ledger.
-- Idempotent (safe to run multiple times).

-- ------------------------------------------------------------
-- Ledger table
-- ------------------------------------------------------------
create table if not exists public.showroom_inventory (
  id uuid primary key default gen_random_uuid(),
  showroom_id uuid not null references public.showrooms (id) on delete restrict,
  product_id uuid not null references public.catalog_products (id) on delete restrict,
  quantity_on_hand integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint showroom_inventory_quantity_non_negative check (quantity_on_hand >= 0)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'showroom_inventory_showroom_product_uidx'
  ) then
    alter table public.showroom_inventory
      add constraint showroom_inventory_showroom_product_uidx unique (showroom_id, product_id);
  end if;
end $$;

create index if not exists showroom_inventory_showroom_id_idx
  on public.showroom_inventory (showroom_id);

create index if not exists showroom_inventory_product_id_idx
  on public.showroom_inventory (product_id);

-- updated_at is set by application code on upsert (matches showrooms pattern).

-- ------------------------------------------------------------
-- RLS (staff/admin only; same predicate as showrooms)
-- ------------------------------------------------------------
alter table public.showroom_inventory enable row level security;

revoke all on table public.showroom_inventory from anon, authenticated;

grant select, insert, update, delete on table public.showroom_inventory to authenticated;

drop policy if exists showroom_inventory_select_internal on public.showroom_inventory;
create policy showroom_inventory_select_internal
  on public.showroom_inventory
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

drop policy if exists showroom_inventory_insert_internal on public.showroom_inventory;
create policy showroom_inventory_insert_internal
  on public.showroom_inventory
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

drop policy if exists showroom_inventory_update_internal on public.showroom_inventory;
create policy showroom_inventory_update_internal
  on public.showroom_inventory
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

drop policy if exists showroom_inventory_delete_internal on public.showroom_inventory;
create policy showroom_inventory_delete_internal
  on public.showroom_inventory
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

comment on table public.showroom_inventory is 'Per-showroom on-hand quantity per product (INV-01).';

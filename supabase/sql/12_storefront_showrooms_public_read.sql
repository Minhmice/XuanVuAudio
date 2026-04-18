-- Apply in Supabase Dashboard -> SQL Editor.
-- Phase 12 (SHOP-01): public read-only access to showroom directory for storefront homepage.
-- Idempotent. Requires public.showrooms from 04_showrooms.sql.

grant select on table public.showrooms to anon;

drop policy if exists showrooms_public_read on public.showrooms;
create policy showrooms_public_read
  on public.showrooms
  for select
  to anon
  using (true);

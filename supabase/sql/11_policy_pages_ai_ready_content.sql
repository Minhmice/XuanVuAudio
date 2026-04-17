-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements Phase 11 (CMS-04, CMS-05):
-- - Policy pages (delivery, returns, warranty, contact) with publish controls.
-- - A future-proof extension point for AI-assisted editorial workflows (no AI required in v1).
-- This script is idempotent (safe to run multiple times).

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Helpers
-- ------------------------------------------------------------
-- Keep in-sync with earlier phases. Re-defined here to avoid ordering dependency.
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
-- Policy pages
-- ------------------------------------------------------------
create table if not exists public.policy_pages (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  title text not null,
  slug text not null,
  excerpt text,
  content_markdown text not null default '',

  -- AI-ready extension points (nullable; not required in v1).
  content_plaintext text,
  content_json jsonb,
  ai_metadata jsonb,

  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'policy_pages_key_unique'
  ) then
    alter table public.policy_pages
      add constraint policy_pages_key_unique unique (key);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'policy_pages_slug_unique'
  ) then
    alter table public.policy_pages
      add constraint policy_pages_slug_unique unique (slug);
  end if;
end $$;

create index if not exists policy_pages_slug_idx
  on public.policy_pages (slug);

create index if not exists policy_pages_published_idx
  on public.policy_pages (is_published);

alter table public.policy_pages enable row level security;

revoke all on table public.policy_pages from anon, authenticated;

-- Public read is limited to published rows.
grant select on table public.policy_pages to anon;

drop policy if exists policy_pages_public_read_published on public.policy_pages;
create policy policy_pages_public_read_published
  on public.policy_pages
  for select
  to anon
  using (is_published = true);

-- Internal reads for authenticated users (internal app still guards at routing layer).
grant select on table public.policy_pages to authenticated;

drop policy if exists policy_pages_authenticated_read on public.policy_pages;
create policy policy_pages_authenticated_read
  on public.policy_pages
  for select
  to authenticated
  using (true);

-- Writes are restricted to internal admins.
grant insert, update, delete on table public.policy_pages to authenticated;

drop policy if exists policy_pages_admin_insert on public.policy_pages;
create policy policy_pages_admin_insert
  on public.policy_pages
  for insert
  to authenticated
  with check (public.is_internal_admin());

drop policy if exists policy_pages_admin_update on public.policy_pages;
create policy policy_pages_admin_update
  on public.policy_pages
  for update
  to authenticated
  using (public.is_internal_admin())
  with check (public.is_internal_admin());

drop policy if exists policy_pages_admin_delete on public.policy_pages;
create policy policy_pages_admin_delete
  on public.policy_pages
  for delete
  to authenticated
  using (public.is_internal_admin());

-- ------------------------------------------------------------
-- AI-ready content runs (extension point; unused in v1)
-- ------------------------------------------------------------
create table if not exists public.ai_content_runs (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  content_id uuid not null,
  intent text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  input_json jsonb,
  output_json jsonb,
  error_message text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists ai_content_runs_content_lookup_idx
  on public.ai_content_runs (content_type, content_id, created_at desc);

alter table public.ai_content_runs enable row level security;

revoke all on table public.ai_content_runs from anon, authenticated;

grant select, insert, update, delete on table public.ai_content_runs to authenticated;

drop policy if exists ai_content_runs_admin_all on public.ai_content_runs;
create policy ai_content_runs_admin_all
  on public.ai_content_runs
  for all
  to authenticated
  using (public.is_internal_admin())
  with check (public.is_internal_admin());


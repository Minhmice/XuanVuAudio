-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements Phase 10 (CMS-01, CMS-03): articles with draft/publish workflow + metadata.
-- This script is idempotent (safe to run multiple times).

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Helpers
-- ------------------------------------------------------------
create or replace function public.is_internal_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.internal_user_profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'staff')
      and p.is_deactivated = false
  );
$$;

-- ------------------------------------------------------------
-- Articles
-- ------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text,
  cover_image_url text,
  author_name text,
  category_id uuid references public.article_categories (id) on delete set null,
  content text not null default '',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'articles_slug_unique'
  ) then
    alter table public.articles
      add constraint articles_slug_unique unique (slug);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'articles_title_unique'
  ) then
    alter table public.articles
      add constraint articles_title_unique unique (title);
  end if;
end $$;

create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists articles_published_idx on public.articles (is_published);
create index if not exists articles_category_idx on public.articles (category_id);

alter table public.articles enable row level security;

revoke all on table public.articles from anon, authenticated;

grant select on table public.articles to anon;

drop policy if exists articles_public_read_published on public.articles;
create policy articles_public_read_published
  on public.articles
  for select
  to anon
  using (is_published = true);

grant select on table public.articles to authenticated;

drop policy if exists articles_authenticated_read on public.articles;
create policy articles_authenticated_read
  on public.articles
  for select
  to authenticated
  using (
    is_published = true
    or public.is_internal_staff()
  );

grant insert, update, delete on table public.articles to authenticated;

drop policy if exists articles_staff_insert on public.articles;
create policy articles_staff_insert
  on public.articles
  for insert
  to authenticated
  with check (public.is_internal_staff());

drop policy if exists articles_staff_update on public.articles;
create policy articles_staff_update
  on public.articles
  for update
  to authenticated
  using (public.is_internal_staff())
  with check (public.is_internal_staff());

drop policy if exists articles_staff_delete on public.articles;
create policy articles_staff_delete
  on public.articles
  for delete
  to authenticated
  using (public.is_internal_staff());


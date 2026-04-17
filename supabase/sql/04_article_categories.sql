-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements CMS-02: article category management (editorial taxonomy).
-- This script is idempotent (safe to run multiple times).

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Constraints (idempotent via DO blocks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'article_categories_name_unique'
  ) THEN
    ALTER TABLE public.article_categories
      ADD CONSTRAINT article_categories_name_unique UNIQUE (name);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'article_categories_slug_unique'
  ) THEN
    ALTER TABLE public.article_categories
      ADD CONSTRAINT article_categories_slug_unique UNIQUE (slug);
  END IF;
END $$;

create index if not exists article_categories_slug_idx
  on public.article_categories (slug);

alter table public.article_categories enable row level security;

-- Default posture: internal-only access via server-side admin client.
revoke all on table public.article_categories from anon, authenticated;

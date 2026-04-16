-- Apply this script in Supabase Dashboard -> SQL Editor.
-- Implements PLAT-02: adds `role` column to internal_user_profiles
-- constraining values to 'admin' or 'staff'. All users default to 'staff'.
-- This script is idempotent (safe to run multiple times).

DO $$
BEGIN
  -- Add role column if it does not already exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'internal_user_profiles'
      AND column_name = 'role'
  ) THEN
    ALTER TABLE public.internal_user_profiles
      ADD COLUMN role text NOT NULL DEFAULT 'staff'
        CHECK (role IN ('admin', 'staff'));

    RAISE NOTICE 'Column role added to internal_user_profiles.';
  ELSE
    RAISE NOTICE 'Column role already exists on internal_user_profiles. Skipping.';
  END IF;
END $$;

-- Index to speed up role-based queries (e.g., list all admins)
CREATE INDEX IF NOT EXISTS internal_user_profiles_role_idx
  ON public.internal_user_profiles (role);

-- Dev seed: promote an existing user to admin (replace UUID and email):
-- UPDATE public.internal_user_profiles
-- SET role = 'admin', updated_at = timezone('utc', now())
-- WHERE email = 'admin.demo@tainghe.local';

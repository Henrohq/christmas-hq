-- =====================================================
-- Christmas HQ - Migration v3: Sky Color Customization
-- =====================================================
-- Run this migration AFTER supabase-migration-v2.sql
-- This adds sky color customization for user trees

-- Add sky_color column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS sky_color TEXT DEFAULT '#090A0F';

-- Update existing profiles to have default sky color
UPDATE profiles
SET sky_color = '#090A0F'
WHERE sky_color IS NULL;


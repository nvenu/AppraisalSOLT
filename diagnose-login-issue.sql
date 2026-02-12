-- ============================================
-- DIAGNOSE LOGIN ISSUE
-- ============================================
-- Run this in Supabase SQL Editor to diagnose why login is failing

-- Step 1: Check if profiles table exists
SELECT 'Checking if profiles table exists...' as step;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Step 2: Check all profiles in database
SELECT 'All profiles in database:' as step;
SELECT id, phone, pin, full_name, role, experience_level, years_of_experience, created_at
FROM profiles
ORDER BY created_at DESC;

-- Step 3: Check if test account exists
SELECT 'Checking for test account 1111111111:' as step;
SELECT id, phone, pin, full_name, role, experience_level, years_of_experience
FROM profiles
WHERE phone = '1111111111';

-- Step 4: Check RLS (Row Level Security) policies
SELECT 'Checking RLS policies on profiles table:' as step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Step 5: Check if RLS is enabled
SELECT 'Checking if RLS is enabled:' as step;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- ============================================
-- FIX: Create test account if it doesn't exist
-- ============================================
SELECT 'Creating/updating test accounts...' as step;

INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  ('1111111111', '1111', 'Test Junior Employee', 'Employee', 1, 'Junior'),
  ('3333333333', '3333', 'Test Midlevel Employee', 'Employee', 4, 'Mid-level'),
  ('5555555555', '5555', 'Test Senior Employee', 'Employee', 8, 'Senior')
ON CONFLICT (phone) DO UPDATE SET
  pin = EXCLUDED.pin,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  years_of_experience = EXCLUDED.years_of_experience,
  experience_level = EXCLUDED.experience_level;

-- Step 6: Verify test accounts were created
SELECT 'Verifying test accounts:' as step;
SELECT phone, pin, full_name, role, experience_level, years_of_experience
FROM profiles
WHERE phone IN ('1111111111', '3333333333', '5555555555')
ORDER BY years_of_experience;

-- ============================================
-- FIX: Ensure RLS policies allow login
-- ============================================
SELECT 'Fixing RLS policies...' as step;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public insert to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Create permissive policies for authentication
CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to profiles"
ON profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow users to update own profile"
ON profiles FOR UPDATE
USING (true);

-- Verify policies were created
SELECT 'Verifying RLS policies:' as step;
SELECT policyname, cmd, permissive
FROM pg_policies
WHERE tablename = 'profiles';

SELECT 'Diagnosis complete! Try logging in now.' as result;

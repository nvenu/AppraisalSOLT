-- ============================================
-- QUICK FIX FOR LOGIN ISSUE
-- ============================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN

-- 1. Disable RLS temporarily to test
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public insert to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- 3. Create test accounts
DELETE FROM profiles WHERE phone IN ('1111111111', '3333333333', '5555555555');

INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  ('1111111111', '1111', 'Test Junior Employee', 'Employee', 1, 'Junior'),
  ('3333333333', '3333', 'Test Midlevel Employee', 'Employee', 4, 'Mid-level'),
  ('5555555555', '5555', 'Test Senior Employee', 'Employee', 8, 'Senior');

-- 4. Verify accounts exist
SELECT 'Test accounts created:' as status;
SELECT phone, pin, full_name, role, experience_level 
FROM profiles 
WHERE phone IN ('1111111111', '3333333333', '5555555555');

-- 5. Re-enable RLS with permissive policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create new permissive policies
CREATE POLICY "Allow all operations on profiles"
ON profiles
FOR ALL
USING (true)
WITH CHECK (true);

-- 7. Final verification
SELECT 'RLS Status:' as check;
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

SELECT 'Policies:' as check;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';

SELECT '✅ Setup complete! Try logging in with 1111111111 / 1111' as result;

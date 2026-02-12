-- Run this in Supabase SQL Editor to verify everything is set up

-- 1. Check if profiles table exists
SELECT 'Step 1: Checking profiles table' as status;
SELECT COUNT(*) as total_profiles FROM profiles;

-- 2. Check if test account exists
SELECT 'Step 2: Checking test account 1111111111' as status;
SELECT phone, pin, full_name, role, experience_level, years_of_experience 
FROM profiles 
WHERE phone = '1111111111';

-- 3. If no results above, create the test account
SELECT 'Step 3: Creating test account if missing' as status;
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) 
VALUES ('1111111111', '1111', 'Test Junior Employee', 'Employee', 1, 'Junior')
ON CONFLICT (phone) DO UPDATE SET
  pin = '1111',
  full_name = 'Test Junior Employee',
  role = 'Employee',
  years_of_experience = 1,
  experience_level = 'Junior';

-- 4. Verify it exists now
SELECT 'Step 4: Final verification' as status;
SELECT phone, pin, full_name, role, experience_level 
FROM profiles 
WHERE phone = '1111111111';

-- 5. Check RLS policies
SELECT 'Step 5: Checking RLS policies' as status;
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- 6. Test the exact query the app uses
SELECT 'Step 6: Testing login query' as status;
SELECT * FROM profiles 
WHERE phone = '1111111111' AND pin = '1111';

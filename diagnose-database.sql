-- ============================================
-- DATABASE DIAGNOSTIC SCRIPT
-- Run this to check if everything is set up correctly
-- ============================================

-- Check if tables exist
SELECT 
  'profiles' as table_name,
  COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT 
  'appraisals' as table_name,
  COUNT(*) as row_count
FROM appraisals
UNION ALL
SELECT 
  'appraisal_criteria' as table_name,
  COUNT(*) as row_count
FROM appraisal_criteria;

-- Check profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check appraisals table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'appraisals'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'appraisals', 'appraisal_criteria');

-- Check if test users exist
SELECT id, phone, full_name, role, experience_level, years_of_experience
FROM profiles
WHERE phone IN ('1111111111', '3333333333', '5555555555', '9999999999')
ORDER BY years_of_experience;

-- Check if criteria exist for all levels
SELECT experience_level, COUNT(*) as criteria_count
FROM appraisal_criteria
GROUP BY experience_level
ORDER BY experience_level;

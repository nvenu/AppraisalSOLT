-- ============================================
-- FIX USER ISSUE
-- Run this to check and fix user accounts
-- ============================================

-- First, let's see what users exist
SELECT id, phone, full_name, role, experience_level, years_of_experience
FROM profiles
ORDER BY created_at DESC;

-- If you created an account but it's not showing above,
-- you can manually create it here:

-- Example: If you signed up with phone 1234567890
-- Uncomment and modify this:

/*
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level)
VALUES ('1234567890', '1234', 'Your Name', 'Employee', 1, 'Junior')
ON CONFLICT (phone) DO UPDATE SET
  pin = EXCLUDED.pin,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  years_of_experience = EXCLUDED.years_of_experience,
  experience_level = EXCLUDED.experience_level
RETURNING *;
*/

-- Or use one of the test accounts:
-- These should already exist if you ran supabase-complete-setup.sql

SELECT 'Test accounts:' as info;
SELECT id, phone, full_name, role, experience_level
FROM profiles
WHERE phone IN ('1111111111', '3333333333', '5555555555', '9999999999');

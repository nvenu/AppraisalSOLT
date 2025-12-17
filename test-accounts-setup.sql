-- ============================================
-- SIMPLE TEST ACCOUNTS FOR END-TO-END TESTING
-- ============================================
-- Run this in Supabase SQL Editor to create test accounts

-- Delete existing test accounts if they exist
DELETE FROM profiles WHERE phone IN ('1111111111', '3333333333', '5555555555', '9999999999');

-- Create one test account for each experience level
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  -- Junior Developer (0-2 years)
  ('1111111111', '1111', 'Test Junior', 'Employee', 1, 'Junior'),
  
  -- Mid-level Developer (3-6 years)
  ('3333333333', '3333', 'Test Midlevel', 'Employee', 4, 'Mid-level'),
  
  -- Senior Developer (7-10+ years)
  ('5555555555', '5555', 'Test Senior', 'Employee', 8, 'Senior'),
  
  -- Manager/Admin Account
  ('9999999999', '9999', 'Test Manager', 'Manager', 15, 'Senior')
ON CONFLICT (phone) DO UPDATE SET
  pin = EXCLUDED.pin,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  years_of_experience = EXCLUDED.years_of_experience,
  experience_level = EXCLUDED.experience_level;

-- Verify accounts were created
SELECT phone, full_name, role, experience_level, years_of_experience 
FROM profiles 
WHERE phone IN ('1111111111', '3333333333', '5555555555', '9999999999')
ORDER BY years_of_experience;

-- Create test accounts for ALL experience levels
-- Run this in Supabase SQL Editor

-- Delete existing test accounts
DELETE FROM profiles WHERE phone IN ('1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666');

-- Create test accounts for each experience level
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  -- Junior (0-2 years) - 2 accounts
  ('1111111111', '1111', 'Alex Junior (1yr)', 'Employee', 1, 'Junior'),
  ('2222222222', '2222', 'Sam Beginner (2yr)', 'Employee', 2, 'Junior'),
  
  -- Mid-level (3-6 years) - 2 accounts
  ('3333333333', '3333', 'Taylor Mid-Level (4yr)', 'Employee', 4, 'Mid-level'),
  ('4444444444', '4444', 'Jordan Experienced (6yr)', 'Employee', 6, 'Mid-level'),
  
  -- Senior (7-10+ years) - 2 accounts
  ('5555555555', '5555', 'Morgan Senior (8yr)', 'Employee', 8, 'Senior'),
  ('6666666666', '6666', 'Casey Expert (10yr)', 'Employee', 10, 'Senior');

-- Verify all accounts created
SELECT 'All test accounts created successfully!' as status;
SELECT phone, pin, full_name, experience_level, years_of_experience 
FROM profiles 
WHERE phone IN ('1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666')
ORDER BY years_of_experience;

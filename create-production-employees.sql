-- ============================================
-- CREATE PRODUCTION EMPLOYEE ACCOUNTS
-- Source of Life Technologies - 16 Employees
-- ============================================

-- Delete test accounts (keep them commented if you want to keep for testing)
-- DELETE FROM profiles WHERE phone IN ('1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666');

-- Create production employee accounts
-- Note: years_of_experience will be set to 0 initially
-- Employees will update this on first login via popup
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  ('8271918008', 'otp', 'Alok', 'Employee', 0, 'Junior'),
  ('7065682533', 'otp', 'Pramendra', 'Employee', 0, 'Junior'),
  ('8800105387', 'otp', 'Akshay Soren', 'Employee', 0, 'Junior'),
  ('8448168107', 'otp', 'Aman', 'Employee', 0, 'Junior'),
  ('8800490391', 'otp', 'Ashish Arya', 'Employee', 0, 'Junior'),
  ('8053206785', 'otp', 'Chetan Shankar', 'Employee', 0, 'Junior'),
  ('8303779699', 'otp', 'Jitendra Gupta', 'Employee', 0, 'Junior'),
  ('7289819231', 'otp', 'Manoj Kumar', 'Employee', 0, 'Junior'),
  ('9756346959', 'otp', 'Paras Yadav', 'Employee', 0, 'Junior'),
  ('8935014580', 'otp', 'Prabhat Yadav', 'Employee', 0, 'Junior'),
  ('8130179307', 'otp', 'Priyanka Sharma', 'Employee', 0, 'Junior'),
  ('8406851952', 'otp', 'Sagar', 'Employee', 0, 'Junior'),
  ('8810620651', 'otp', 'Sanoj Chaudhary', 'Employee', 0, 'Junior'),
  ('9716066934', 'otp', 'Sumit Jha', 'Employee', 0, 'Junior'),
  ('9899404505', 'otp', 'Tapas', 'Employee', 0, 'Junior'),
  ('9818216984', 'otp', 'Neeraj Venu', 'Employee', 0, 'Junior')
ON CONFLICT (phone) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  pin = EXCLUDED.pin;

-- Verify all accounts created
SELECT 'Production employees created successfully!' as status;
SELECT phone, full_name, years_of_experience, experience_level 
FROM profiles 
WHERE phone IN (
  '8271918008', '7065682533', '8800105387', '8448168107', '8800490391',
  '8053206785', '8303779699', '7289819231', '9756346959', '8935014580',
  '8130179307', '8406851952', '8810620651', '9716066934', '9899404505',
  '9818216984'
)
ORDER BY full_name;

SELECT COUNT(*) as total_production_employees FROM profiles WHERE pin = 'otp';

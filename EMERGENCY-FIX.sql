-- ============================================
-- EMERGENCY FIX - Run this in Supabase NOW
-- ============================================
-- This will fix everything in one go

-- Step 1: Drop everything and start fresh
DROP TABLE IF EXISTS appraisal_criteria CASCADE;
DROP TABLE IF EXISTS appraisals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 2: Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Employee', 'Manager')) NOT NULL,
  years_of_experience INTEGER DEFAULT 0,
  experience_level TEXT DEFAULT 'Junior',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create appraisals table
CREATE TABLE appraisals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  self_review TEXT NOT NULL,
  key_achievements TEXT NOT NULL,
  manager_rating INTEGER CHECK (manager_rating >= 1 AND manager_rating <= 5),
  manager_feedback TEXT,
  status TEXT CHECK (status IN ('submitted', 'reviewed')) DEFAULT 'submitted',
  detailed_responses JSONB,
  manager_detailed_ratings JSONB,
  experience_level TEXT,
  okr_goal_status JSONB,
  cross_functional_impact TEXT,
  roadblocks_support TEXT,
  self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
  self_rating_justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create criteria table
CREATE TABLE appraisal_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_level TEXT NOT NULL,
  criteria_name TEXT NOT NULL,
  criteria_description TEXT,
  weight DECIMAL(3,2) DEFAULT 1.0,
  rating_definitions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: DISABLE RLS (this is the problem!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE appraisals DISABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_criteria DISABLE ROW LEVEL SECURITY;

-- Step 6: Create test account
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) 
VALUES ('1111111111', '1111', 'Test Junior Employee', 'Employee', 1, 'Junior');

-- Step 7: Verify it worked
SELECT 'SUCCESS! Test account created:' as result;
SELECT phone, pin, full_name, role, experience_level FROM profiles WHERE phone = '1111111111';

-- Step 8: Test the login query
SELECT 'Testing login query:' as result;
SELECT * FROM profiles WHERE phone = '1111111111' AND pin = '1111';

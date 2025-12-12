-- Employee Appraisal Application Database Setup
-- Run these commands in your Supabase SQL Editor

-- Drop existing table if it exists to recreate with proper constraints
DROP TABLE IF EXISTS appraisals;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Employee', 'Manager')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appraisals table
CREATE TABLE appraisals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  self_review TEXT NOT NULL,
  key_achievements TEXT NOT NULL,
  manager_rating INTEGER CHECK (manager_rating >= 1 AND manager_rating <= 5),
  manager_feedback TEXT,
  status TEXT CHECK (status IN ('submitted', 'reviewed')) DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_appraisals_employee_id ON appraisals(employee_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_status ON appraisals(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisals ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (true);

-- Create policies for appraisals table
CREATE POLICY "Users can view all appraisals" ON appraisals
  FOR SELECT USING (true);

CREATE POLICY "Employees can insert their own appraisals" ON appraisals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Managers can update appraisals" ON appraisals
  FOR UPDATE USING (true);

-- Insert sample data (optional)
INSERT INTO profiles (phone, pin, full_name, role) VALUES
  ('1234567890', '1234', 'John Doe', 'Employee'),
  ('0987654321', '5678', 'Jane Smith', 'Manager')
ON CONFLICT (phone) DO NOTHING;
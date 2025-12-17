-- ============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Employee Appraisal System
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will create all tables and set up the database

-- ============================================
-- STEP 1: Create Base Tables
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS appraisal_criteria CASCADE;
DROP TABLE IF EXISTS appraisals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
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

-- Create appraisals table
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

-- Create appraisal criteria table
CREATE TABLE appraisal_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_level TEXT NOT NULL,
  criteria_name TEXT NOT NULL,
  criteria_description TEXT,
  weight DECIMAL(3,2) DEFAULT 1.0,
  rating_definitions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: Create Indexes
-- ============================================

CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_appraisals_employee_id ON appraisals(employee_id);
CREATE INDEX idx_appraisals_status ON appraisals(status);
CREATE INDEX idx_criteria_experience_level ON appraisal_criteria(experience_level);

-- ============================================
-- STEP 3: Enable Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appraisal_criteria ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create RLS Policies
-- ============================================

-- Profiles policies
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Appraisals policies
CREATE POLICY "Allow all operations on appraisals" ON appraisals FOR ALL USING (true) WITH CHECK (true);

-- Criteria policies (read-only for all)
CREATE POLICY "Allow read access to criteria" ON appraisal_criteria FOR SELECT USING (true);

-- ============================================
-- STEP 5: Insert Appraisal Criteria
-- ============================================

-- Junior Developer Criteria (0-2 years)
INSERT INTO appraisal_criteria (experience_level, criteria_name, criteria_description, weight, rating_definitions) VALUES
('Junior', 'Code Quality & Standards', 'Describe your approach to writing clean, readable code. Include examples of coding standards you follow and how you ensure quality.', 1.0, '{
  "1": "Minimal evidence of code quality practices. Code is difficult to read, lacks structure, or has significant maintainability issues.",
  "3": "Demonstrates consistent application of basic coding standards. Code is readable and maintainable with some room for improvement.",
  "5": "Exceptional code quality with clear documentation, optimal structure, and proactive refactoring. Sets the standard for the team."
}'::jsonb),
('Junior', 'Learning & Skill Development', 'Detail your learning journey, new technologies explored, and specific skills developed during this period.', 1.0, '{
  "1": "Limited engagement with learning opportunities. Slow progress in skill development or resistance to new technologies.",
  "3": "Actively learning new technologies and improving skills. Shows consistent progress and applies new knowledge to work.",
  "5": "Exceptional learning velocity. Proactively seeks advanced knowledge, masters new technologies quickly, and shares learnings with team."
}'::jsonb),
('Junior', 'Task Execution & Delivery', 'Explain how you manage assigned tasks, meet deadlines, and handle changing requirements.', 1.0, '{
  "1": "Frequently misses deadlines or delivers incomplete work. Struggles with task management and prioritization.",
  "3": "Consistently delivers assigned tasks on time with acceptable quality. Manages workload effectively.",
  "5": "Exceptional delivery record. Proactively manages tasks, anticipates issues, and consistently exceeds expectations."
}'::jsonb),
('Junior', 'Team Communication', 'Describe how you communicate with team members, ask for help, and contribute to team discussions.', 0.8, '{
  "1": "Poor communication habits. Rarely asks for help when needed or provides unclear updates.",
  "3": "Communicates effectively with team. Asks appropriate questions and provides clear status updates.",
  "5": "Outstanding communicator. Proactively shares information, facilitates discussions, and helps others communicate better."
}'::jsonb),
('Junior', 'Problem Solving Approach', 'Provide examples of technical problems you solved and your debugging methodology.', 0.9, '{
  "1": "Struggles with problem-solving. Requires significant guidance for basic debugging tasks.",
  "3": "Demonstrates solid problem-solving skills. Can debug issues independently and find solutions.",
  "5": "Exceptional problem solver. Tackles complex issues independently and develops innovative solutions."
}'::jsonb),
('Junior', 'Goal Achievement & Growth', 'Reflect on your progress toward personal development goals and areas where you exceeded expectations.', 0.9, '{
  "1": "Limited progress toward goals. Shows minimal growth or improvement over the period.",
  "3": "Achieves personal development goals. Shows consistent growth and improvement.",
  "5": "Significantly exceeds goals. Demonstrates exceptional growth and takes on additional challenges."
}'::jsonb);

-- Mid-level Developer Criteria (3-6 years)
INSERT INTO appraisal_criteria (experience_level, criteria_name, criteria_description, weight, rating_definitions) VALUES
('Mid-level', 'Technical Leadership & Expertise', 'Describe your technical contributions, code review practices, and how you guide technical decisions.', 1.0, '{
  "1": "Limited technical leadership. Rarely provides guidance or makes technical decisions independently.",
  "3": "Demonstrates solid technical expertise. Provides guidance to junior developers and contributes to technical decisions.",
  "5": "Outstanding technical leadership. Drives major technical decisions, mentors effectively, and significantly elevates team capabilities."
}'::jsonb),
('Mid-level', 'Mentoring & Knowledge Transfer', 'Explain your experience mentoring junior developers and sharing knowledge across the team.', 1.0, '{
  "1": "Minimal mentoring activity. Limited knowledge transfer or ineffective guidance to junior team members.",
  "3": "Actively mentors junior developers with clear guidance. Shares knowledge regularly and helps team members grow.",
  "5": "Exceptional mentor who transforms junior developers into productive team members. Creates comprehensive learning resources and culture."
}'::jsonb),
('Mid-level', 'Project Ownership & Impact', 'Detail projects you owned end-to-end, including planning, execution, and measurable business impact.', 1.0, '{
  "1": "Limited project ownership. Struggles to drive projects independently or deliver measurable impact.",
  "3": "Successfully owns and delivers projects. Demonstrates clear business impact and effective project management.",
  "5": "Exceptional project ownership. Delivers high-impact projects that significantly advance business objectives."
}'::jsonb),
('Mid-level', 'System Design & Architecture', 'Describe your contributions to system architecture, design patterns, and technical debt management.', 0.9, '{
  "1": "Limited architectural contributions. Rarely considers system design implications or technical debt.",
  "3": "Contributes effectively to system design. Makes sound architectural decisions and manages technical debt.",
  "5": "Outstanding architectural contributions. Designs scalable systems and proactively addresses technical debt."
}'::jsonb),
('Mid-level', 'Cross-functional Collaboration', 'Explain how you work with different teams, manage dependencies, and drive cross-team initiatives.', 0.8, '{
  "1": "Struggles with cross-functional work. Poor communication or coordination with other teams.",
  "3": "Collaborates effectively across teams. Manages dependencies well and contributes to cross-team initiatives.",
  "5": "Exceptional cross-functional leader. Drives major initiatives across teams and builds strong partnerships."
}'::jsonb),
('Mid-level', 'Innovation & Process Improvement', 'Describe innovations you introduced, processes you improved, and efficiency gains you delivered.', 0.9, '{
  "1": "Limited innovation or process improvement. Rarely suggests or implements improvements.",
  "3": "Actively improves processes and introduces innovations. Delivers measurable efficiency gains.",
  "5": "Exceptional innovator. Introduces transformative improvements that significantly impact team productivity."
}'::jsonb);

-- Senior Developer Criteria (7-10+ years)
INSERT INTO appraisal_criteria (experience_level, criteria_name, criteria_description, weight, rating_definitions) VALUES
('Senior', 'Strategic Technical Leadership', 'Describe how you influence technical strategy, lead architectural decisions, and guide long-term technical direction.', 1.0, '{
  "1": "Limited strategic impact. Focuses mainly on tactical execution without broader technical vision.",
  "3": "Provides strategic technical leadership. Influences architecture decisions and guides long-term technical direction.",
  "5": "Exceptional strategic leader who shapes organizational technical strategy. Drives innovation and creates lasting technical impact."
}'::jsonb),
('Senior', 'Organizational Impact & Mentoring', 'Detail your mentoring activities, knowledge sharing initiatives, and impact on team/organizational capabilities.', 1.0, '{
  "1": "Limited organizational impact. Mentoring efforts don''t translate to measurable team capability improvements.",
  "3": "Significant organizational impact through effective mentoring. Develops team capabilities and shares knowledge broadly.",
  "5": "Transformational organizational impact. Creates scalable mentoring programs and dramatically elevates organizational capabilities."
}'::jsonb),
('Senior', 'Business Alignment & Strategy', 'Explain how you align technical decisions with business objectives and contribute to strategic planning.', 1.0, '{
  "1": "Poor business alignment. Technical decisions often misaligned with business objectives.",
  "3": "Strong business alignment. Technical decisions consistently support business objectives and strategy.",
  "5": "Exceptional business partner. Shapes business strategy through technical insights and drives strategic initiatives."
}'::jsonb),
('Senior', 'Innovation & Technical Excellence', 'Describe major innovations, technical improvements, and how you drive engineering excellence across teams.', 0.9, '{
  "1": "Limited innovation. Maintains status quo without driving technical improvements.",
  "3": "Drives innovation and technical excellence. Introduces improvements that elevate engineering standards.",
  "5": "Transformational innovator. Creates breakthrough solutions and establishes new standards of technical excellence."
}'::jsonb),
('Senior', 'Stakeholder Management & Communication', 'Explain how you manage stakeholder relationships, communicate complex technical concepts, and influence decision-making.', 0.8, '{
  "1": "Poor stakeholder management. Struggles to communicate technical concepts or influence decisions.",
  "3": "Effective stakeholder management. Communicates clearly and influences key decisions appropriately.",
  "5": "Exceptional stakeholder partner. Masterfully communicates complex concepts and drives strategic decisions."
}'::jsonb),
('Senior', 'Organizational Growth & Culture', 'Describe your contributions to company culture, hiring, and developing organizational technical capabilities.', 0.9, '{
  "1": "Limited cultural impact. Minimal contribution to hiring or organizational development.",
  "3": "Positive cultural impact. Contributes to hiring and helps develop organizational capabilities.",
  "5": "Transformational cultural leader. Shapes company culture, builds exceptional teams, and creates lasting organizational impact."
}'::jsonb);

-- ============================================
-- STEP 6: Insert Demo/Test Users (Optional)
-- ============================================

INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  ('1111111111', '1111', 'Alex Junior', 'Employee', 1, 'Junior'),
  ('2222222222', '2222', 'Sam Beginner', 'Employee', 2, 'Junior'),
  ('3333333333', '3333', 'Taylor Mid-Level', 'Employee', 4, 'Mid-level'),
  ('4444444444', '4444', 'Jordan Experienced', 'Employee', 6, 'Mid-level'),
  ('5555555555', '5555', 'Morgan Senior', 'Employee', 8, 'Senior'),
  ('6666666666', '6666', 'Casey Expert', 'Employee', 10, 'Senior'),
  ('7777777777', '7777', 'System Administrator', 'Manager', 15, 'Senior')
ON CONFLICT (phone) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready to use.
-- You can delete test users later with:
-- DELETE FROM profiles WHERE phone LIKE '1111111111%';
-- Or delete all data with:
-- TRUNCATE appraisals, profiles CASCADE;

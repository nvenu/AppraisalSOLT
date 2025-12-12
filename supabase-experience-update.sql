-- Add experience level to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'Junior';

-- Update existing users with experience data
UPDATE profiles SET 
  years_of_experience = 2, 
  experience_level = 'Junior' 
WHERE phone = '1234567890';

UPDATE profiles SET 
  years_of_experience = 10, 
  experience_level = 'Senior' 
WHERE phone = '0987654321';

-- Add experience-based appraisal criteria
CREATE TABLE IF NOT EXISTS appraisal_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_level TEXT NOT NULL,
  criteria_name TEXT NOT NULL,
  criteria_description TEXT,
  weight DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert criteria for different experience levels
INSERT INTO appraisal_criteria (experience_level, criteria_name, criteria_description, weight) VALUES
-- Junior Developer (0-2 years)
('Junior', 'Code Quality', 'Ability to write clean, readable, and maintainable code', 1.0),
('Junior', 'Learning & Growth', 'Willingness to learn new technologies and improve skills', 1.0),
('Junior', 'Task Completion', 'Ability to complete assigned tasks within deadlines', 1.0),
('Junior', 'Communication', 'Effective communication with team members and stakeholders', 0.8),
('Junior', 'Problem Solving', 'Basic problem-solving skills and debugging abilities', 0.9),

-- Mid-level Developer (3-6 years)
('Mid-level', 'Technical Expertise', 'Proficiency in core technologies and frameworks', 1.0),
('Mid-level', 'Code Review & Mentoring', 'Ability to review code and guide junior developers', 1.0),
('Mid-level', 'Project Ownership', 'Taking ownership of features and delivering end-to-end solutions', 1.0),
('Mid-level', 'Architecture Understanding', 'Understanding of system architecture and design patterns', 0.9),
('Mid-level', 'Cross-team Collaboration', 'Working effectively across different teams', 0.8),

-- Senior Developer (7-10+ years)
('Senior', 'Technical Leadership', 'Leading technical decisions and architecture design', 1.0),
('Senior', 'Mentoring & Knowledge Sharing', 'Mentoring team members and sharing knowledge', 1.0),
('Senior', 'Strategic Thinking', 'Contributing to long-term technical strategy', 1.0),
('Senior', 'Innovation & Best Practices', 'Introducing new technologies and improving processes', 0.9),
('Senior', 'Stakeholder Management', 'Managing relationships with stakeholders and clients', 0.8);

-- Update appraisals table to include detailed responses and manager ratings
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS detailed_responses JSONB;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS manager_detailed_ratings JSONB;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS experience_level TEXT;
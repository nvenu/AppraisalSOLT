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
  rating_definitions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert criteria for different experience levels
INSERT INTO appraisal_criteria (experience_level, criteria_name, criteria_description, weight) VALUES
-- Junior Developer (0-2 years)
('Junior', 'Code Quality & Standards', 'Describe your approach to writing clean, readable code. Include examples of coding standards you follow and how you ensure quality.', 1.0),
('Junior', 'Learning & Skill Development', 'Detail your learning journey, new technologies explored, and specific skills developed during this period.', 1.0),
('Junior', 'Task Execution & Delivery', 'Explain how you manage assigned tasks, meet deadlines, and handle changing requirements.', 1.0),
('Junior', 'Team Communication', 'Describe how you communicate with team members, ask for help, and contribute to team discussions.', 0.8),
('Junior', 'Problem Solving Approach', 'Provide examples of technical problems you solved and your debugging methodology.', 0.9),
('Junior', 'Goal Achievement & Growth', 'Reflect on your progress toward personal development goals and areas where you exceeded expectations.', 0.9),

-- Mid-level Developer (3-6 years)
('Mid-level', 'Technical Leadership & Expertise', 'Describe your technical contributions, code review practices, and how you guide technical decisions.', 1.0),
('Mid-level', 'Mentoring & Knowledge Transfer', 'Explain your experience mentoring junior developers and sharing knowledge across the team.', 1.0),
('Mid-level', 'Project Ownership & Impact', 'Detail projects you owned end-to-end, including planning, execution, and measurable business impact.', 1.0),
('Mid-level', 'System Design & Architecture', 'Describe your contributions to system architecture, design patterns, and technical debt management.', 0.9),
('Mid-level', 'Cross-functional Collaboration', 'Explain how you work with different teams, manage dependencies, and drive cross-team initiatives.', 0.8),
('Mid-level', 'Innovation & Process Improvement', 'Describe innovations you introduced, processes you improved, and efficiency gains you delivered.', 0.9),

-- Senior Developer (7-10+ years)
('Senior', 'Strategic Technical Leadership', 'Describe how you influence technical strategy, lead architectural decisions, and guide long-term technical direction.', 1.0),
('Senior', 'Organizational Impact & Mentoring', 'Detail your mentoring activities, knowledge sharing initiatives, and impact on team/organizational capabilities.', 1.0),
('Senior', 'Business Alignment & Strategy', 'Explain how you align technical decisions with business objectives and contribute to strategic planning.', 1.0),
('Senior', 'Innovation & Technical Excellence', 'Describe major innovations, technical improvements, and how you drive engineering excellence across teams.', 0.9),
('Senior', 'Stakeholder Management & Communication', 'Explain how you manage stakeholder relationships, communicate complex technical concepts, and influence decision-making.', 0.8),
('Senior', 'Organizational Growth & Culture', 'Describe your contributions to company culture, hiring, and developing organizational technical capabilities.', 0.9);

-- Update appraisals table to include detailed responses and manager ratings
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS detailed_responses JSONB;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS manager_detailed_ratings JSONB;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Add new goal-based and alignment fields
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS okr_goal_status JSONB;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS cross_functional_impact TEXT;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS roadblocks_support TEXT;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5);
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS self_rating_justification TEXT;
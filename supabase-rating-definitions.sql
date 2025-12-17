-- Add AI Rating Definitions to Appraisal Criteria
-- Run this after supabase-experience-update.sql

-- Update Junior Developer criteria with rating definitions
UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Minimal evidence of code quality practices. Code is difficult to read, lacks structure, or has significant maintainability issues.",
  "3": "Demonstrates consistent application of basic coding standards. Code is readable and maintainable with some room for improvement.",
  "5": "Exceptional code quality with clear documentation, optimal structure, and proactive refactoring. Sets the standard for the team."
}'::jsonb WHERE experience_level = 'Junior' AND criteria_name = 'Code Quality & Standards';

UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Limited engagement with learning opportunities. Slow progress in skill development or resistance to new technologies.",
  "3": "Actively learning new technologies and improving skills. Shows consistent progress and applies new knowledge to work.",
  "5": "Exceptional learning velocity. Proactively seeks advanced knowledge, masters new technologies quickly, and shares learnings with team."
}'::jsonb WHERE experience_level = 'Junior' AND criteria_name = 'Learning & Skill Development';

-- Update Mid-level Developer criteria with rating definitions
UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Limited technical leadership. Rarely provides guidance or makes technical decisions independently.",
  "3": "Demonstrates solid technical expertise. Provides guidance to junior developers and contributes to technical decisions.",
  "5": "Outstanding technical leadership. Drives major technical decisions, mentors effectively, and significantly elevates team capabilities."
}'::jsonb WHERE experience_level = 'Mid-level' AND criteria_name = 'Technical Leadership & Expertise';

UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Minimal mentoring activity. Limited knowledge transfer or ineffective guidance to junior team members.",
  "3": "Actively mentors junior developers with clear guidance. Shares knowledge regularly and helps team members grow.",
  "5": "Exceptional mentor who transforms junior developers into productive team members. Creates comprehensive learning resources and culture."
}'::jsonb WHERE experience_level = 'Mid-level' AND criteria_name = 'Mentoring & Knowledge Transfer';

-- Update Senior Developer criteria with rating definitions
UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Limited strategic impact. Focuses mainly on tactical execution without broader technical vision.",
  "3": "Provides strategic technical leadership. Influences architecture decisions and guides long-term technical direction.",
  "5": "Exceptional strategic leader who shapes organizational technical strategy. Drives innovation and creates lasting technical impact."
}'::jsonb WHERE experience_level = 'Senior' AND criteria_name = 'Strategic Technical Leadership';

UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Limited organizational impact. Mentoring efforts don't translate to measurable team capability improvements.",
  "3": "Significant organizational impact through effective mentoring. Develops team capabilities and shares knowledge broadly.",
  "5": "Transformational organizational impact. Creates scalable mentoring programs and dramatically elevates organizational capabilities."
}'::jsonb WHERE experience_level = 'Senior' AND criteria_name = 'Organizational Impact & Mentoring';

-- Add default rating definitions for criteria without specific ones
UPDATE appraisal_criteria SET rating_definitions = '{
  "1": "Performance significantly below expectations. Minimal evidence of meeting criteria requirements.",
  "3": "Performance meets expectations. Demonstrates consistent application of required skills and behaviors.",
  "5": "Performance significantly exceeds expectations. Exceptional demonstration of criteria with measurable impact."
}'::jsonb WHERE rating_definitions IS NULL;
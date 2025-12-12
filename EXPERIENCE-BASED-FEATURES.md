# Narrative-Based Experience Appraisal System

## 🎯 Overview
The application features a comprehensive narrative-based appraisal system where employees provide detailed written responses for experience-specific criteria, and managers review and rate these responses.

## 📝 Experience Levels & Narrative Criteria

### Junior Developer (0-2 years)
- **Code Quality**: Describe your approach to writing clean, readable, and maintainable code. Include examples of how you ensure code quality.
- **Learning & Growth**: Detail your learning journey, new technologies you've explored, and how you've improved your skills.
- **Task Completion**: Explain how you manage and complete assigned tasks, including your approach to meeting deadlines.
- **Communication**: Describe how you communicate with team members, ask for help, and share updates on your work.
- **Problem Solving**: Provide examples of problems you've solved and your debugging approach when facing challenges.

### Mid-level Developer (3-6 years)
- **Technical Expertise**: Describe your proficiency in core technologies, frameworks, and how you apply best practices in your work.
- **Code Review & Mentoring**: Explain your experience reviewing code and mentoring junior developers. Include specific examples.
- **Project Ownership**: Detail projects you've owned end-to-end, including planning, execution, and delivery.
- **Architecture Understanding**: Describe your understanding of system architecture, design patterns, and how you apply them.
- **Cross-team Collaboration**: Explain how you work with different teams, handle dependencies, and contribute to cross-functional projects.

### Senior Developer (7-10+ years)
- **Technical Leadership**: Describe how you lead technical decisions, influence architecture, and guide technical direction.
- **Mentoring & Knowledge Sharing**: Detail your mentoring activities, knowledge sharing initiatives, and how you develop team capabilities.
- **Strategic Thinking**: Explain your contributions to long-term technical strategy and how you balance technical debt with feature delivery.
- **Innovation & Best Practices**: Describe innovations you've introduced, process improvements, and how you drive technical excellence.
- **Stakeholder Management**: Explain how you manage relationships with stakeholders, communicate technical concepts, and handle expectations.

## 🔧 New Features

### 1. Enhanced Signup Process
- Added "Years of Experience" field for employees (0-10+ years)
- Automatic experience level classification:
  - 0-2 years → Junior
  - 3-6 years → Mid-level
  - 7-10+ years → Senior

### 2. Narrative-Based Appraisal Forms
- **Experience-specific criteria**: Different evaluation categories based on level
- **Detailed text responses**: Employees write comprehensive responses for each criteria
- **Manager rating system**: Managers rate each detailed response (1-5 scale)
- **Contextual prompts**: Clear guidance on what to include in each response

### 3. Enhanced Manager Dashboard
- **Experience level indicators**: Shows employee's experience level
- **Detailed response review**: Displays employee's written responses for each criteria
- **Individual criteria rating**: Managers rate each response separately
- **Comprehensive feedback**: Overall rating and detailed feedback system

### 4. Database Schema Updates
- `profiles` table: Added `years_of_experience` and `experience_level` columns
- `appraisals` table: Added `detailed_responses` (JSONB), `manager_detailed_ratings` (JSONB), and `experience_level` columns
- `appraisal_criteria` table: Stores criteria definitions and prompts for each experience level

## 🚀 Usage

### For Employees:
1. **Sign up** with years of experience
2. **Write detailed responses** for each experience-appropriate criteria
3. **Provide comprehensive examples** and explanations
4. **Submit narrative** self-review and achievements
5. **View detailed feedback** and ratings from managers

### For Managers:
1. **Review detailed responses** for each criteria
2. **Rate individual responses** (1-5 scale) based on quality and depth
3. **Provide overall rating** and comprehensive feedback
4. **Consider experience level** when evaluating responses

## 📋 Setup Instructions

### Database Setup:
Run `supabase-experience-update.sql` to add the new schema:
```sql
-- Adds experience fields and criteria tables
-- Includes sample data for all experience levels
```

### Application Features:
- ✅ **Automatic level detection** based on years of experience
- ✅ **Dynamic form generation** with appropriate criteria
- ✅ **Fallback to defaults** if database criteria not available
- ✅ **Mobile responsive** design for all new components
- ✅ **Real-time validation** and error handling

## 🎨 UI Enhancements
- **Experience badges** showing developer level
- **Criteria cards** with descriptions and rating dropdowns
- **Progress indicators** for form completion
- **Contextual help text** explaining expectations for each level

This creates a comprehensive, fair, and level-appropriate appraisal system that grows with developers throughout their careers!
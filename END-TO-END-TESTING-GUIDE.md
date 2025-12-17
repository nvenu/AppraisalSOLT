# 🧪 End-to-End Testing Guide

## Quick Setup

### Step 1: Create Test Accounts in Supabase

1. Go to: https://supabase.com/dashboard/project/bbimzzctitxpxgmcuisu/sql
2. Click "New Query"
3. Copy and paste the content from `test-accounts-setup.sql`
4. Click "Run" (or press Ctrl+Enter)
5. You should see 4 test accounts created

### Step 2: Start the App

```bash
npm run dev
```

Visit: **http://localhost:3001**

---

## 🎯 Test Accounts

| Experience Level | Phone | PIN | Name | Use Case |
|-----------------|-------|-----|------|----------|
| **Junior** | 1111111111 | 1111 | Test Junior | Test junior developer form |
| **Mid-level** | 3333333333 | 3333 | Test Midlevel | Test mid-level developer form |
| **Senior** | 5555555555 | 5555 | Test Senior | Test senior developer form |
| **Manager** | 9999999999 | 9999 | Test Manager | Test manager review |

**Admin Access**: Username: `admin`, Password: `Admin@2024` (at `/admin`)

---

## 📋 Complete End-to-End Test Flow

### Test 1: Junior Developer Flow

#### Part A: Submit Appraisal (Employee)

1. **Login as Junior Developer**
   - Visit: http://localhost:3001
   - Phone: `1111111111`
   - PIN: `1111`
   - Click "Login"

2. **Verify Junior Form Loads**
   - Should see "Junior Developer" badge
   - Should see 6 Junior-level criteria:
     - Code Quality & Standards
     - Learning & Skill Development
     - Task Execution & Delivery
     - Team Communication
     - Problem Solving Approach
     - Goal Achievement & Growth

3. **Fill Out Appraisal**
   
   **Goals & Organizational Alignment:**
   - Goal 1: "Complete React fundamentals course - In Progress: 70% done"
   - Goal 2: "Fix 20 bugs this quarter - Achieved: Fixed 25 bugs"
   - Goal 3: "Improve code review participation - In Progress: Reviewing 3 PRs/week"
   - Cross-Functional Impact: "Helped QA team by writing detailed bug reproduction steps, reducing back-and-forth by 30%"
   - Roadblocks: "Need more guidance on complex architectural decisions. Would benefit from weekly 1-on-1s with senior developer."

   **Criteria Responses** (fill each with 2-3 sentences):
   - Code Quality: "I follow team coding standards and use ESLint. I've been learning about clean code principles and applying them to my work."
   - Learning & Skill Development: "Completed 3 online courses on React and TypeScript. Applied new knowledge to refactor legacy components."
   - Task Execution: "Consistently deliver assigned tasks on time. Use Jira to track progress and communicate blockers early."
   - Team Communication: "Actively participate in daily standups. Ask questions when stuck and provide clear status updates."
   - Problem Solving: "Improved debugging skills using Chrome DevTools. Successfully resolved 25 bugs independently this quarter."
   - Goal Achievement: "Exceeded bug-fix goal by 25%. Made significant progress on learning objectives."

   **Self-Rating:**
   - Rating: 4 (Exceeds Expectations)
   - Justification: "Exceeded bug-fix targets, completed learning goals ahead of schedule, and received positive feedback from team on code quality improvements."

4. **Submit Appraisal**
   - Click "Submit Appraisal"
   - Should see success message
   - Appraisal should appear in "Your Appraisals" section with "Submitted" badge

5. **Logout**
   - Click "Logout" button

#### Part B: Review Appraisal (Manager)

6. **Login as Manager**
   - Visit: http://localhost:3001/admin
   - Username: `admin`
   - Password: `Admin@2024`
   - Click "Login as Admin"

7. **Verify Pending Appraisals**
   - Should see "Pending Appraisals" section
   - Should see "Test Junior" appraisal
   - Should show "Junior Level" badge
   - Should see submission date

8. **Review the Appraisal**
   - Click "Start Review"
   - Review employee's goals and self-rating (4/5)
   - Review each criteria response

9. **Rate Each Criteria**
   - Code Quality & Standards: 4 (Exceeds Expectations)
   - Learning & Skill Development: 5 (Outstanding)
   - Task Execution & Delivery: 4 (Exceeds Expectations)
   - Team Communication: 4 (Exceeds Expectations)
   - Problem Solving Approach: 4 (Exceeds Expectations)
   - Goal Achievement & Growth: 5 (Outstanding)

10. **Provide Overall Feedback**
    - Overall Rating: 4 (Exceeds Expectations)
    - Feedback: "Excellent performance for a junior developer. Your learning velocity is impressive, and you've exceeded your bug-fix targets significantly. Continue focusing on code quality and don't hesitate to ask for architectural guidance. Great job on helping the QA team - that's the kind of cross-functional collaboration we value. Keep up the excellent work!"

11. **Complete Review**
    - Click "Complete Review"
    - Should see success message
    - Appraisal should move to "Review History" section

12. **Verify Review History**
    - Scroll down to "Review History"
    - Should see "Test Junior" with rating 4/5
    - Click to expand and verify all details are saved

13. **Logout**
    - Click "Logout"

#### Part C: View Feedback (Employee)

14. **Login as Junior Developer Again**
    - Phone: `1111111111`
    - PIN: `1111`

15. **Check Appraisal History**
    - Should see appraisal with "Reviewed" badge
    - Should show rating: 4/5
    - Click to expand

16. **Verify Feedback Details**
    - Should see your goals and self-rating
    - Should see manager's detailed ratings for each criteria
    - Should see manager's overall feedback
    - All information should be preserved

17. **Logout**

---

### Test 2: Mid-level Developer Flow

Repeat the same process with:

**Login**: `3333333333` / `3333`

**Expected Form**: Mid-level criteria
- Technical Leadership & Expertise
- Mentoring & Knowledge Transfer
- Project Ownership & Impact
- System Design & Architecture
- Cross-functional Collaboration
- Innovation & Process Improvement

**Sample Responses**:
- Goal 1: "Lead microservices migration - Completed: Migrated 5 services"
- Goal 2: "Mentor 2 junior developers - Achieved: Both promoted"
- Goal 3: "Reduce API latency by 40% - Achieved: Reduced by 45%"
- Technical Leadership: "Led architecture decisions for new payment service. Conducted code reviews for 50+ PRs. Mentored 2 junior developers who both received promotions."
- Self-Rating: 5 (Outstanding)

---

### Test 3: Senior Developer Flow

Repeat the same process with:

**Login**: `5555555555` / `5555`

**Expected Form**: Senior criteria
- Strategic Technical Leadership
- Organizational Impact & Mentoring
- Business Alignment & Strategy
- Innovation & Technical Excellence
- Stakeholder Management & Communication
- Organizational Growth & Culture

**Sample Responses**:
- Goal 1: "Define 2025 technical roadmap - Completed"
- Goal 2: "Establish engineering best practices - Implemented across 3 teams"
- Goal 3: "Reduce infrastructure costs by 30% - Achieved: Reduced by 35%"
- Strategic Leadership: "Defined company-wide technical strategy for 2025. Led architectural review board. Influenced hiring strategy to build stronger engineering team."
- Self-Rating: 5 (Outstanding)

---

## ✅ Verification Checklist

After completing all tests, verify:

### Database Verification
1. Go to Supabase → Table Editor → `appraisals`
2. Should see 3 appraisals (Junior, Mid-level, Senior)
3. All should have `status = 'reviewed'`
4. All should have `manager_rating` and `manager_feedback`
5. All should have `manager_detailed_ratings` (JSONB)

### UI Verification
- [ ] Junior form shows 6 junior-specific criteria
- [ ] Mid-level form shows 6 mid-level-specific criteria
- [ ] Senior form shows 6 senior-specific criteria
- [ ] Goals & Alignment section works for all levels
- [ ] Self-rating (1-5) required for all levels
- [ ] Manager can see all submitted appraisals
- [ ] Manager can rate each criteria individually
- [ ] Manager can provide overall rating and feedback
- [ ] Reviewed appraisals move to "Review History"
- [ ] Employees can see manager feedback
- [ ] All data persists in database

### Feature Verification
- [ ] Experience badges display correctly
- [ ] Expandable cards work (employee and manager views)
- [ ] Status badges update (Submitted → Reviewed)
- [ ] Ratings display correctly (X/5 format)
- [ ] JSONB fields save and load properly
- [ ] Timestamps show correct dates
- [ ] No console errors in browser (F12)

---

## 🔍 Troubleshooting

### Issue: Can't login with test accounts
**Solution**: 
1. Check if SQL script ran successfully
2. Go to Supabase → Table Editor → `profiles`
3. Verify test accounts exist
4. Check phone numbers match exactly (10 digits, no spaces)

### Issue: Form doesn't show criteria
**Solution**:
1. Check browser console (F12) for errors
2. Go to Supabase → Table Editor → `appraisal_criteria`
3. Verify criteria exist for all experience levels
4. Run `supabase-complete-setup.sql` if criteria missing

### Issue: Appraisal doesn't appear after submission
**Solution**:
1. Check browser console for errors
2. Go to Supabase → Table Editor → `appraisals`
3. Verify appraisal was created
4. Check `employee_id` matches user's ID
5. Refresh the page

### Issue: Review History shows "No reviewed appraisals"
**Solution**:
1. Click "🔍 Debug Storage" button
2. Check browser console logs
3. Go to Supabase → Table Editor → `appraisals`
4. Verify `status = 'reviewed'` for completed reviews
5. Check `manager_rating` and `manager_feedback` are not null

---

## 📊 Expected Results

After completing all 3 test flows:

### In Supabase Database:

**profiles table**: 4 users
```
| phone      | full_name     | role     | experience_level |
|------------|---------------|----------|------------------|
| 1111111111 | Test Junior   | Employee | Junior           |
| 3333333333 | Test Midlevel | Employee | Mid-level        |
| 5555555555 | Test Senior   | Employee | Senior           |
| 9999999999 | Test Manager  | Manager  | Senior           |
```

**appraisals table**: 3 appraisals (all reviewed)
```
| employee_id | experience_level | status   | manager_rating |
|-------------|------------------|----------|----------------|
| (Junior)    | Junior           | reviewed | 4              |
| (Midlevel)  | Mid-level        | reviewed | 5              |
| (Senior)    | Senior           | reviewed | 5              |
```

### In Manager Dashboard:
- Pending Appraisals: 0
- Review History: 3 appraisals

### In Employee Dashboards:
- Each employee sees their own reviewed appraisal
- With manager ratings and feedback

---

## 🧹 Cleanup After Testing

When ready to remove test data:

```sql
-- Delete test appraisals
DELETE FROM appraisals WHERE employee_id IN (
  SELECT id FROM profiles WHERE phone IN ('1111111111', '3333333333', '5555555555')
);

-- Delete test accounts
DELETE FROM profiles WHERE phone IN ('1111111111', '3333333333', '5555555555', '9999999999');
```

Or keep them for future testing!

---

## 🎉 Success Criteria

You've successfully tested the system if:
- ✅ All 3 experience levels work correctly
- ✅ Forms adapt based on experience level
- ✅ Appraisals save to database
- ✅ Manager can review all appraisals
- ✅ Employees can see feedback
- ✅ Review history works for manager
- ✅ All data persists in Supabase
- ✅ No errors in browser console

**Ready to share with your team for feedback!** 🚀

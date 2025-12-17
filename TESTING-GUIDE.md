# 🧪 Testing Guide - Employee Appraisal System

## Quick Start Testing

### 1. Start the Application
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 2. Clear Browser Storage (Important!)
Before testing, clear any cached data:
1. Open DevTools: Press `F12`
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear site data** or manually delete **localStorage**
4. Refresh the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**OR** use the "Clear Storage" button on the login page!

---

## 📋 Test Scenarios

### Scenario 1: Junior Developer Experience

**Login Credentials:**
- Phone: `1111111111`
- PIN: `1111`

**Expected Behavior:**
- Login as "Alex Junior"
- See "Junior Developer" badge
- Form shows Junior-level criteria:
  - Code Quality & Standards
  - Learning & Skill Development
  - Task Execution & Delivery
  - Team Communication
  - Problem Solving Approach
  - Goal Achievement & Growth

**Test Steps:**
1. Fill out detailed responses for each criteria
2. Complete Goals & Alignment section
3. Provide self-rating (1-5) with justification
4. Submit appraisal
5. Verify submission appears in "Your Appraisals" section

---

### Scenario 2: Mid-level Developer Experience

**Login Credentials:**
- Phone: `3333333333`
- PIN: `3333`

**Expected Behavior:**
- Login as "Taylor Mid-Level"
- See "Mid-level Developer" badge
- Form shows Mid-level criteria:
  - Technical Leadership & Expertise
  - Mentoring & Knowledge Transfer
  - Project Ownership & Impact
  - System Design & Architecture
  - Cross-functional Collaboration
  - Innovation & Process Improvement

**Test Steps:**
1. Fill out detailed responses for each criteria
2. Document OKR/Goal status (3 goals)
3. Describe cross-functional impact
4. Identify roadblocks and support needed
5. Provide self-rating with justification
6. Submit appraisal

---

### Scenario 3: Senior Developer Experience

**Login Credentials:**
- Phone: `5555555555`
- PIN: `5555`

**Expected Behavior:**
- Login as "Morgan Senior"
- See "Senior Developer" badge
- Form shows Senior-level criteria:
  - Strategic Technical Leadership
  - Organizational Impact & Mentoring
  - Business Alignment & Strategy
  - Innovation & Technical Excellence
  - Stakeholder Management & Communication
  - Organizational Growth & Culture

**Test Steps:**
1. Fill out detailed responses for senior-level criteria
2. Document strategic goals and organizational impact
3. Describe stakeholder management activities
4. Provide self-rating with comprehensive justification
5. Submit appraisal

---

### Scenario 4: Manager Review Process

**Admin Login:**
1. Visit: `http://localhost:3000/admin`
2. Username: `admin`
3. Password: `Admin@2024`

**Expected Behavior:**
- Login as "System Administrator"
- See Manager Dashboard
- View all submitted appraisals from employees

**Test Steps:**
1. Review employee narratives for each criteria
2. Click "Start Review" on an appraisal
3. Rate each criteria individually (1-5)
4. Use AI Suggestion Badge to get rating recommendations
5. Provide overall rating (1-5)
6. Write comprehensive manager feedback
7. Click "Complete Review"
8. Verify appraisal status changes to "Reviewed"

---

### Scenario 5: AI Rating Suggestions (Optional)

**Prerequisites:**
- Add OpenAI API key to `.env.local`:
  ```
  LLM_API_KEY=your_openai_api_key_here
  LLM_API_BASE_URL=https://api.openai.com/v1
  LLM_MODEL=gpt-4
  ```

**Test Steps:**
1. Login as admin/manager
2. Start reviewing an appraisal
3. Click "Get AI Suggestion" on any criteria
4. Wait for AI analysis (shows loading state)
5. Review suggested rating and justification
6. Click "Apply Rating" to use suggestion
7. Modify if needed and complete review

**Fallback Mode:**
- If no API key is configured, system uses rule-based suggestions
- Tests heuristic scoring based on narrative length and keywords

---

## 🔍 Verification Checklist

### Authentication
- [ ] Can login with all demo credentials
- [ ] Can create new employee account
- [ ] Cannot create manager account (signup only allows Employee)
- [ ] Admin login works at `/admin`
- [ ] Logout works correctly
- [ ] Redirects work based on role

### Experience-Based Forms
- [ ] Junior form shows correct criteria
- [ ] Mid-level form shows correct criteria
- [ ] Senior form shows correct criteria
- [ ] Experience badge displays correctly
- [ ] Form adapts when creating new accounts with different experience years

### Appraisal Submission
- [ ] Can submit appraisal with all fields
- [ ] Goals & Alignment section saves correctly
- [ ] Self-rating and justification required
- [ ] Submission appears in employee history
- [ ] Status shows as "Submitted"

### Manager Review
- [ ] Can see all submitted appraisals
- [ ] Employee names display correctly
- [ ] Experience level shown for context
- [ ] Can rate each criteria individually
- [ ] AI suggestions work (if API key configured)
- [ ] Overall rating and feedback required
- [ ] Review submission updates status to "Reviewed"

### Employee History
- [ ] Past appraisals display correctly
- [ ] Can expand/collapse appraisal details
- [ ] Manager ratings visible after review
- [ ] Detailed ratings shown per criteria
- [ ] Manager feedback displayed
- [ ] Self-rating and goals visible

---

## 🐛 Common Issues & Solutions

### Issue: Login not working with `3333333333/3333`

**Solutions:**
1. **Clear localStorage**: F12 → Application → Clear site data
2. **Hard refresh**: Ctrl+Shift+R or Cmd+Shift+R
3. **Use Clear Storage button**: On login page, click "Clear Storage (Troubleshooting)"
4. **Try incognito mode**: Open new private/incognito window
5. **Verify no typos**: Copy-paste credentials from this guide

### Issue: Form not showing correct criteria

**Solutions:**
1. Logout and login again
2. Check experience level badge matches expected level
3. Clear localStorage and re-login
4. Verify years_of_experience is set correctly

### Issue: AI suggestions not working

**Solutions:**
1. Check `.env.local` has `LLM_API_KEY` configured
2. Verify API key is valid
3. Check console for error messages
4. Fallback to rule-based suggestions (should work automatically)

### Issue: Appraisals not appearing

**Solutions:**
1. Check localStorage has `appraisals` key
2. Verify employee_id matches logged-in user
3. Clear storage and create new appraisal
4. Check browser console for errors

---

## 📊 Test Data

### All Demo Users

| Name | Phone | PIN | Experience | Level |
|------|-------|-----|------------|-------|
| Alex Junior | 1111111111 | 1111 | 1 year | Junior |
| Sam Beginner | 2222222222 | 2222 | 2 years | Junior |
| Taylor Mid-Level | 3333333333 | 3333 | 4 years | Mid-level |
| Jordan Experienced | 4444444444 | 4444 | 6 years | Mid-level |
| Morgan Senior | 5555555555 | 5555 | 8 years | Senior |
| Casey Expert | 6666666666 | 6666 | 10+ years | Senior |

### Admin Access
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `Admin@2024`

---

## 🎯 Testing Workflow

### Complete End-to-End Test

1. **Clear Storage**: Use Clear Storage button or DevTools
2. **Test Junior Login**: Login as Alex Junior (1111111111/1111)
3. **Submit Junior Appraisal**: Fill form and submit
4. **Logout**: Click logout button
5. **Test Mid-level Login**: Login as Taylor Mid-Level (3333333333/3333)
6. **Submit Mid-level Appraisal**: Fill form and submit
7. **Logout**: Click logout button
8. **Test Senior Login**: Login as Morgan Senior (5555555555/5555)
9. **Submit Senior Appraisal**: Fill form and submit
10. **Logout**: Click logout button
11. **Admin Login**: Go to `/admin`, login with admin credentials
12. **Review All Appraisals**: Review each submitted appraisal
13. **Test AI Suggestions**: Try AI suggestions on different criteria
14. **Complete Reviews**: Submit reviews for all appraisals
15. **Verify Employee View**: Login as each employee and verify feedback

---

## 📝 Notes

- All data is stored in **localStorage** for demo purposes
- No backend/database required for testing
- Data persists until localStorage is cleared
- Each browser/incognito window has separate storage
- Use multiple browser windows to test concurrent users

---

**Happy Testing! 🚀**

# ⚡ Quick Test Guide

## 🚀 Setup (One Time)

1. **Run SQL in Supabase**:
   - Open: https://supabase.com/dashboard/project/bbimzzctitxpxgmcuisu/sql
   - Copy content from `test-accounts-setup.sql`
   - Click "Run"

2. **Start App**:
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3001

---

## 🎯 Test Accounts

| Type | Phone | PIN | Name |
|------|-------|-----|------|
| **Junior** | 1111111111 | 1111 | Test Junior |
| **Mid-level** | 3333333333 | 3333 | Test Midlevel |
| **Senior** | 5555555555 | 5555 | Test Senior |
| **Admin** | admin | Admin@2024 | (at /admin) |

---

## 📋 Quick Test Flow

### 1️⃣ Submit Appraisal (2 minutes)

```
Login: 1111111111 / 1111
→ Fill Goals (3 goals)
→ Fill Cross-functional impact
→ Fill Roadblocks
→ Fill each criteria (6 text boxes)
→ Self-rate (1-5) + justification
→ Submit
→ Logout
```

### 2️⃣ Review Appraisal (2 minutes)

```
Visit: /admin
Login: admin / Admin@2024
→ Click "Start Review"
→ Rate each criteria (1-5)
→ Overall rating (1-5)
→ Overall feedback (text)
→ Complete Review
→ Check "Review History" section
→ Logout
```

### 3️⃣ View Feedback (1 minute)

```
Login: 1111111111 / 1111
→ See "Reviewed" badge
→ Click to expand
→ See manager ratings & feedback
→ Done!
```

---

## ✅ Success Checklist

- [ ] Junior form shows 6 junior criteria
- [ ] Mid-level form shows 6 mid-level criteria  
- [ ] Senior form shows 6 senior criteria
- [ ] Appraisal saves to database
- [ ] Manager sees pending appraisal
- [ ] Manager can rate and review
- [ ] Review moves to "Review History"
- [ ] Employee sees manager feedback
- [ ] No errors in console (F12)

---

## 🔍 Quick Debug

**Issue**: Can't login
```
→ Check Supabase Table Editor → profiles
→ Verify test accounts exist
```

**Issue**: No criteria showing
```
→ Check Supabase Table Editor → appraisal_criteria
→ Run supabase-complete-setup.sql if empty
```

**Issue**: Appraisal not appearing
```
→ Check browser console (F12)
→ Check Supabase Table Editor → appraisals
→ Refresh page
```

---

## 🧹 Clean Test Data

```sql
DELETE FROM appraisals WHERE employee_id IN (
  SELECT id FROM profiles WHERE phone LIKE '1111111111%'
);
```

---

**Full Guide**: See `END-TO-END-TESTING-GUIDE.md` for detailed instructions

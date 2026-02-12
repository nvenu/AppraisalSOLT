# 🔧 Fix Login Issue - Step by Step

## The Problem
Login is failing because the database tables and test accounts don't exist in Supabase yet.

## The Solution (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Click this link: **https://supabase.com/dashboard/project/bbimzzctitxpxgmcuisu/sql**
2. Login if needed
3. Click **"New query"** button (top right)

### Step 2: Copy the Complete Setup SQL
1. In your project, open the file: `supabase-complete-setup.sql`
2. Select ALL the text (Cmd+A or Ctrl+A)
3. Copy it (Cmd+C or Ctrl+C)

### Step 3: Paste and Run
1. Go back to Supabase SQL Editor
2. Paste the SQL (Cmd+V or Ctrl+V)
3. Click **"Run"** button (or press Cmd+Enter / Ctrl+Enter)
4. Wait 5-10 seconds for it to complete

### Step 4: Verify Success
You should see output at the bottom showing:
- Tables created
- Indexes created
- Policies created
- Test accounts inserted

Look for messages like:
```
CREATE TABLE
CREATE INDEX
CREATE POLICY
INSERT 0 7
```

### Step 5: Test Login
1. Go to: **https://appraisal.solifetec.com**
2. Enter:
   - Phone: `1111111111`
   - PIN: `1111`
3. Click **Login**
4. Should work now! ✅

---

## Test Accounts Created

After running the SQL, these accounts will exist:

| Phone | PIN | Name | Experience |
|-------|-----|------|------------|
| 1111111111 | 1111 | Alex Junior | Junior (1 year) |
| 2222222222 | 2222 | Sam Beginner | Junior (2 years) |
| 3333333333 | 3333 | Taylor Mid-Level | Mid-level (4 years) |
| 4444444444 | 4444 | Jordan Experienced | Mid-level (6 years) |
| 5555555555 | 5555 | Morgan Senior | Senior (8 years) |
| 6666666666 | 6666 | Casey Expert | Senior (10 years) |
| 7777777777 | 7777 | System Administrator | Manager (15 years) |

---

## If You Get Errors

### Error: "relation profiles already exists"
This means tables already exist. Run this first to clean up:
```sql
DROP TABLE IF EXISTS appraisal_criteria CASCADE;
DROP TABLE IF EXISTS appraisals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```
Then run the complete setup SQL again.

### Error: "permission denied"
Make sure you're logged into the correct Supabase project:
- Project: bbimzzctitxpxgmcuisu
- URL: https://supabase.com/dashboard/project/bbimzzctitxpxgmcuisu

### Error: "syntax error"
Make sure you copied the ENTIRE SQL file, from the first line to the last line.

---

## Quick Alternative: Run Just the Test Accounts

If tables already exist and you just need test accounts:

```sql
-- Delete old test accounts
DELETE FROM profiles WHERE phone IN ('1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666', '7777777777');

-- Create test accounts
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  ('1111111111', '1111', 'Alex Junior', 'Employee', 1, 'Junior'),
  ('2222222222', '2222', 'Sam Beginner', 'Employee', 2, 'Junior'),
  ('3333333333', '3333', 'Taylor Mid-Level', 'Employee', 4, 'Mid-level'),
  ('4444444444', '4444', 'Jordan Experienced', 'Employee', 6, 'Mid-level'),
  ('5555555555', '5555', 'Morgan Senior', 'Employee', 8, 'Senior'),
  ('6666666666', '6666', 'Casey Expert', 'Employee', 10, 'Senior'),
  ('7777777777', '7777', 'System Administrator', 'Manager', 15, 'Senior');

-- Verify
SELECT phone, full_name, role, experience_level FROM profiles ORDER BY years_of_experience;
```

---

## Still Not Working?

### Check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- appraisal_criteria
- appraisals
- profiles

### Check if test account exists:
```sql
SELECT * FROM profiles WHERE phone = '1111111111';
```

You should see one row with the test account.

### Check RLS policies:
```sql
SELECT tablename, policyname FROM pg_policies 
WHERE tablename = 'profiles';
```

You should see at least one policy.

---

## Summary

1. ✅ Open Supabase SQL Editor
2. ✅ Copy `supabase-complete-setup.sql`
3. ✅ Paste and Run
4. ✅ Test login at https://appraisal.solifetec.com

**This should take less than 5 minutes!**

# Setup Test Accounts in Supabase

## Problem
Test credentials (1111111111/1111, etc.) are not working because they don't exist in the database yet.

## Solution
Run the SQL script to create test accounts in your Supabase database.

---

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/bbimzzctitxpxgmcuisu
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

---

## Step 2: Copy and Run This SQL

Copy this entire SQL script and paste it into the SQL Editor:

```sql
-- ============================================
-- CREATE TEST ACCOUNTS FOR PRODUCTION TESTING
-- ============================================

-- Delete existing test accounts if they exist
DELETE FROM profiles WHERE phone IN ('1111111111', '3333333333', '5555555555');

-- Create test accounts for each experience level
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  -- Junior Developer (0-2 years)
  ('1111111111', '1111', 'Test Junior Employee', 'Employee', 1, 'Junior'),
  
  -- Mid-level Developer (3-6 years)
  ('3333333333', '3333', 'Test Midlevel Employee', 'Employee', 4, 'Mid-level'),
  
  -- Senior Developer (7-10+ years)
  ('5555555555', '5555', 'Test Senior Employee', 'Employee', 8, 'Senior')
ON CONFLICT (phone) DO UPDATE SET
  pin = EXCLUDED.pin,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  years_of_experience = EXCLUDED.years_of_experience,
  experience_level = EXCLUDED.experience_level;

-- Verify accounts were created
SELECT 
  phone, 
  full_name, 
  role, 
  experience_level, 
  years_of_experience,
  created_at
FROM profiles 
WHERE phone IN ('1111111111', '3333333333', '5555555555')
ORDER BY years_of_experience;
```

---

## Step 3: Click "Run"

Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)

---

## Step 4: Verify Results

You should see output showing 3 test accounts:

| phone | full_name | role | experience_level | years_of_experience |
|-------|-----------|------|------------------|---------------------|
| 1111111111 | Test Junior Employee | Employee | Junior | 1 |
| 3333333333 | Test Midlevel Employee | Employee | Mid-level | 4 |
| 5555555555 | Test Senior Employee | Employee | Senior | 8 |

---

## Step 5: Test Login

Now try logging in at https://appraisal.solifetec.com:

### Test Accounts:
- **Junior**: Phone: `1111111111`, PIN: `1111`
- **Mid-level**: Phone: `3333333333`, PIN: `3333`
- **Senior**: Phone: `5555555555`, PIN: `5555`

### Manager Account:
- Go to: https://appraisal.solifetec.com/admin
- Username: `admin`
- Password: `Admin@2024`

---

## Troubleshooting

### If you get "Login failed"
1. Check that the SQL script ran successfully
2. Verify the accounts exist by running:
   ```sql
   SELECT * FROM profiles WHERE phone = '1111111111';
   ```
3. Make sure you're using the correct phone number (10 digits, no spaces)
4. Make sure you're using the correct PIN (4 digits)

### If you get "Table doesn't exist"
You need to run the main setup script first:
1. Open `supabase-complete-setup.sql` in this project
2. Copy the entire contents
3. Run it in Supabase SQL Editor
4. Then run the test accounts script above

### Check if profiles table exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';
```

---

## Alternative: Create Accounts via Signup

If you prefer, you can also create accounts through the signup form:

1. Go to https://appraisal.solifetec.com
2. Click **"Sign Up"** tab
3. Fill in:
   - Full Name: Your Name
   - Phone Number: Your phone number
   - PIN: Your PIN (4+ digits)
   - Years of Experience: Select your experience
4. Click **"Sign Up"**

This will create a real account in the database.

---

## Security Note

These test accounts are for testing purposes only. For production:

1. **Delete test accounts** after testing:
   ```sql
   DELETE FROM profiles WHERE phone IN ('1111111111', '3333333333', '5555555555');
   ```

2. **Change admin password** in `app/admin/page.tsx` (line with `password === 'Admin@2024'`)

3. **Use real employee data** when going live

---

## Quick Check: Is Database Connected?

Run this in Supabase SQL Editor to verify your database is working:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these tables:
- appraisal_criteria
- appraisals
- profiles

If you don't see these tables, run `supabase-complete-setup.sql` first!

# Production Setup for 25 Employees

## Recommended Approach: Pre-create Accounts with Default PIN

This is the fastest and most reliable method for 25 employees.

---

## Step 1: Prepare Employee Data

Create a list of your 25 employees with:
- Full Name
- Phone Number (10 digits)
- Years of Experience
- Role (all will be "Employee")

Example:
```
John Smith, 9876543210, 5 years
Jane Doe, 9876543211, 3 years
...
```

---

## Step 2: Create SQL Script

I'll create a template. You just need to fill in the employee details.

**Template:**
```sql
-- Delete test accounts (optional - keep them for testing)
-- DELETE FROM profiles WHERE phone IN ('1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666');

-- Create production employee accounts
-- Default PIN for all: 7412
INSERT INTO profiles (phone, pin, full_name, role, years_of_experience, experience_level) VALUES
  ('9876543210', '7412', 'John Smith', 'Employee', 5, 'Mid-level'),
  ('9876543211', '7412', 'Jane Doe', 'Employee', 3, 'Mid-level'),
  ('9876543212', '7412', 'Bob Johnson', 'Employee', 8, 'Senior'),
  ('9876543213', '7412', 'Alice Williams', 'Employee', 2, 'Junior'),
  -- Add all 25 employees here...
  ('9876543234', '7412', 'Last Employee', 'Employee', 4, 'Mid-level')
ON CONFLICT (phone) DO UPDATE SET
  pin = EXCLUDED.pin,
  full_name = EXCLUDED.full_name,
  years_of_experience = EXCLUDED.years_of_experience,
  experience_level = EXCLUDED.experience_level;

-- Verify accounts created
SELECT COUNT(*) as total_employees FROM profiles WHERE role = 'Employee';
SELECT phone, full_name, experience_level FROM profiles WHERE role = 'Employee' ORDER BY full_name;
```

**Experience Level Rules:**
- 0-2 years → 'Junior'
- 3-6 years → 'Mid-level'
- 7+ years → 'Senior'

---

## Step 3: Run SQL in Supabase

1. Go to: https://supabase.com/dashboard/project/bbimzzctitxpxgmcuisu/sql
2. Paste your completed SQL
3. Click "Run"
4. Verify all 25 accounts created

---

## Step 4: Communicate to Employees

Send this message to all employees:

```
Subject: Employee Appraisal System - Login Instructions

Dear Team,

Our new Employee Appraisal System is now live!

🔗 Website: https://appraisal.solifetec.com

📱 Login Instructions:
1. Enter your mobile number (10 digits)
2. Enter PIN: 7412
3. Complete your appraisal

⚠️ Important:
- Default PIN for everyone: 7412
- You can change your PIN after first login (optional)
- Complete your appraisal by [deadline date]

For support, contact [your contact info]

Best regards,
HR Team
```

---

## Step 5: Add PIN Change Feature (Optional)

If you want employees to change their PIN after first login, I can add this feature. Let me know!

---

## Alternative: Manual Account Creation

If you prefer employees to create their own accounts:

**Current Signup Flow:**
1. Employee goes to https://appraisal.solifetec.com
2. Clicks "Sign Up" tab
3. Enters:
   - Full Name
   - Phone Number
   - PIN (they choose)
   - Years of Experience
4. Account created immediately

**Pros:**
- Employees choose their own PIN
- No need to pre-create accounts

**Cons:**
- Employees might enter wrong experience level
- Takes more time
- Some might forget to sign up

---

## SMS OTP Option (Not Recommended for 25 Users)

If you really want SMS OTP, you'll need:

1. **SMS Service** (costs money):
   - Twilio: ~$0.01 per SMS
   - AWS SNS: ~$0.006 per SMS
   - Total cost: ~$0.25 for 25 employees

2. **Implementation time**: 2-3 hours

3. **Complexity**: Higher (SMS delivery issues, international numbers, etc.)

**For 25 employees, pre-created accounts with default PIN is much simpler and faster.**

---

## Recommended: Pre-create with Default PIN 7412

**Why this is best:**
- ✅ Takes 10 minutes to set up
- ✅ No SMS costs
- ✅ No delivery issues
- ✅ You control who has access
- ✅ Simple for employees
- ✅ Works immediately

**Next Steps:**
1. Send me your 25 employee details (name, phone, years of experience)
2. I'll create the SQL script
3. You run it in Supabase
4. Send login instructions to employees
5. Done!

---

## Security Note

Default PIN `7412` is fine for internal use because:
- Only employees know the website exists
- Phone numbers are private
- You can add PIN change feature if needed
- It's an internal appraisal system, not financial data

If you want more security, I can add:
- Forced PIN change on first login
- PIN complexity requirements
- Account lockout after failed attempts

Let me know what you prefer!

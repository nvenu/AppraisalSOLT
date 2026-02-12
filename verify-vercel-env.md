# Verify Vercel Environment Variables

## Check if Environment Variables are Set in Vercel

If login still fails after running the SQL, the issue might be that Vercel doesn't have the environment variables.

### Step 1: Go to Vercel Dashboard
1. Go to: **https://vercel.com/dashboard**
2. Click on your **"AppraisalSOLT"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

### Step 2: Check These Variables Exist

You should see these two variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://bbimzzctitxpxgmcuisu.supabase.co`

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaW16emN0aXR4cHhnbWN1aXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjA3MjYsImV4cCI6MjA4MTA5NjcyNn0.EkSjnZeWKEDMDZPwGFLUqCPphV4GOCdP63WVeDDaNzY`

### Step 3: If Variables are Missing

If you don't see these variables:

1. Click **"Add New"** button
2. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://bbimzzctitxpxgmcuisu.supabase.co`
   - Environment: Check all (Production, Preview, Development)
   - Click **"Save"**

3. Repeat for the second variable:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaW16emN0aXR4cHhnbWN1aXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjA3MjYsImV4cCI6MjA4MTA5NjcyNn0.EkSjnZeWKEDMDZPwGFLUqCPphV4GOCdP63WVeDDaNzY`
   - Environment: Check all (Production, Preview, Development)
   - Click **"Save"**

### Step 4: Redeploy

After adding environment variables, you need to redeploy:

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for deployment to complete

### Step 5: Test Again

After redeployment completes:
1. Go to: https://appraisal.solifetec.com
2. Try logging in with: `1111111111` / `1111`

---

## Alternative: Test Locally First

To verify everything works, test locally:

```bash
npm run dev
```

Then open: http://localhost:3000

Try logging in with `1111111111` / `1111`

If it works locally but not on Vercel, the issue is definitely the environment variables in Vercel.

---

## Check Browser Console for Errors

1. Open https://appraisal.solifetec.com
2. Press **F12** (or right-click → Inspect)
3. Click **"Console"** tab
4. Try to login
5. Look for any red error messages

Common errors:
- `supabaseUrl is required` → Environment variables not set in Vercel
- `Invalid API key` → Wrong anon key in Vercel
- `Failed to fetch` → Network issue or wrong URL

Take a screenshot of any errors and share them!

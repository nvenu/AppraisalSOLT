# 🚀 Quick Start: Deploy in 15 Minutes

## Your Goal
Deploy to: **appraisal.solifetec.com**

## What You Have
- ✅ Code on GitHub: https://github.com/nvenu/AppraisalSOLT
- ✅ Supabase database configured
- ✅ GoDaddy domain: solifetec.com
- ✅ Plesk hosting (for main site)

## What You Need
- ✅ Vercel account (FREE - sign up with GitHub)
- ✅ 15 minutes of your time

---

## Step 1: Deploy to Vercel (5 minutes)

### 1.1 Sign Up
1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel

### 1.2 Import Your Project
1. Click **"Add New Project"**
2. Find **"AppraisalSOLT"** repository
3. Click **"Import"**

### 1.3 Add Environment Variables
Click **"Environment Variables"** and add these:

```
NEXT_PUBLIC_SUPABASE_URL
https://bbimzzctitxpxgmcuisu.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaW16emN0aXR4cHhnbWN1aXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjA3MjYsImV4cCI6MjA4MTA5NjcyNn0.EkSjnZeWKEDMDZPwGFLUqCPphV4GOCdP63WVeDDaNzY
```

**Optional (for AI features):**
```
LLM_API_KEY
your_openai_api_key_here

LLM_API_BASE_URL
https://api.openai.com/v1

LLM_MODEL
gpt-4
```

### 1.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes ☕
3. You'll get a URL like: `https://appraisal-solt.vercel.app`

---

## Step 2: Configure GoDaddy DNS (5 minutes)

### 2.1 Login to GoDaddy
1. Go to: **https://dnsmanagement.godaddy.com**
2. Login with your GoDaddy account
3. Select domain: **solifetec.com**

### 2.2 Add CNAME Record
1. Click **"Add"** (or "Add Record")
2. Fill in:
   - **Type**: CNAME
   - **Name**: `appraisal`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 600 (or leave default)
3. Click **"Save"**

---

## Step 3: Add Custom Domain in Vercel (2 minutes)

### 3.1 Go to Vercel Dashboard
1. Click on your project
2. Go to **"Settings"** tab
3. Click **"Domains"** in sidebar

### 3.2 Add Your Domain
1. Type: `appraisal.solifetec.com`
2. Click **"Add"**
3. Vercel will verify DNS (may show "pending")

---

## Step 4: Wait & Test (30-60 minutes)

### 4.1 DNS Propagation
- DNS changes take 10-60 minutes to propagate
- You can check status at: https://dnschecker.org

### 4.2 Test Your Site
1. Visit: **https://appraisal.solifetec.com**
2. Should see your login page
3. SSL certificate automatically enabled 🔒

---

## Test Accounts

### Employee Account
- Phone: `1111111111`
- PIN: `1111`

### Manager Account
1. Go to: `https://appraisal.solifetec.com/admin`
2. Username: `admin`
3. Password: `Admin@2024`

---

## Costs

### Vercel
- **FREE** for your use case (200 users)
- Includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - SSL certificate
  - Global CDN

### Supabase
- **FREE** tier includes:
  - 500MB database
  - 2GB bandwidth/month
  - 50,000 monthly active users
- More than enough for 200 users

### OpenAI (Optional)
- Only if you want AI suggestions
- ~$2-4/month for 200 users
- Can skip this initially

### Total Cost
- **$0/month** (without AI)
- **~$3/month** (with AI)

---

## What Happens Next?

### Automatic Updates
Every time you push to GitHub:
1. Vercel automatically detects changes
2. Builds new version
3. Deploys to production
4. Takes ~2 minutes

### To Update Your App
```bash
git add .
git commit -m "Your update message"
git push
```

That's it! Vercel handles the rest.

---

## Troubleshooting

### "Domain not verified" in Vercel
- **Wait**: DNS takes 10-60 minutes
- **Check**: GoDaddy CNAME record is correct
- **Verify**: Use https://dnschecker.org

### "Failed to submit appraisal"
- **Check**: Environment variables in Vercel
- **Verify**: Supabase URL and key are correct
- **Test**: Run SQL scripts in Supabase

### "AI suggestions not working"
- **Check**: LLM_API_KEY in Vercel environment variables
- **Verify**: OpenAI API key is valid
- **Note**: AI is optional, app works without it

---

## Need Help?

### Documentation
- Full guide: `PRODUCTION-DEPLOYMENT-GUIDE.md`
- Detailed Plesk guide: `PLESK-DEPLOYMENT-GUIDE.md`
- Checklist: `DEPLOYMENT-CHECKLIST.md`
- DNS setup: `GODADDY-DNS-SETUP.md`

### Support
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Your repo: https://github.com/nvenu/AppraisalSOLT

---

## Summary

1. ✅ **Vercel** (5 min): Sign up → Import → Add env vars → Deploy
2. ✅ **GoDaddy** (5 min): Add CNAME record
3. ✅ **Vercel** (2 min): Add custom domain
4. ⏳ **Wait** (30-60 min): DNS propagation
5. 🎉 **Done**: Visit appraisal.solifetec.com

**Total active time: ~15 minutes**
**Total wait time: ~30-60 minutes**

---

## Ready to Start?

Go to: **https://vercel.com/signup**

Click "Continue with GitHub" and follow Step 1 above!

🚀 You'll be live in less than an hour!

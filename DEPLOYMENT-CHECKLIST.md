# ✅ Production Deployment Checklist

## Pre-Deployment (Do This First!)

### 1. Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser (F12)
- [ ] No TypeScript errors: `npm run build`
- [ ] Company logo added to `public/images/solt-logo.svg`
- [ ] Admin password changed from default (optional)

### 2. Database Setup
- [ ] Supabase database created
- [ ] SQL scripts run (`supabase-complete-setup.sql`)
- [ ] Test accounts work
- [ ] Decide: Keep or delete test data

### 3. Environment Variables Ready
- [ ] Supabase URL: `https://bbimzzctitxpxgmcuisu.supabase.co`
- [ ] Supabase Anon Key: (from Supabase dashboard)
- [ ] OpenAI API Key: (optional, from platform.openai.com)

### 4. Git Repository
- [ ] Code committed to Git
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] `.env.local` NOT in repository (check `.gitignore`)

---

## Deployment Steps (Vercel - Recommended)

### Step 1: Sign Up
- [ ] Go to https://vercel.com/signup
- [ ] Sign up with GitHub account

### Step 2: Import Project
- [ ] Click "Add New Project"
- [ ] Select your repository
- [ ] Framework: Next.js (auto-detected)

### Step 3: Configure
- [ ] Add environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  LLM_API_KEY (optional)
  LLM_API_BASE_URL (optional)
  LLM_MODEL (optional)
  ```

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] Get production URL

---

## Post-Deployment Testing

### Test 1: Basic Access
- [ ] Visit production URL
- [ ] Page loads without errors
- [ ] Company logo appears
- [ ] Footer shows company name

### Test 2: Employee Flow
- [ ] Create new employee account
- [ ] Login successful
- [ ] Submit appraisal
- [ ] Appraisal appears in history

### Test 3: Manager Flow
- [ ] Visit `/admin`
- [ ] Login with admin credentials
- [ ] See pending appraisals
- [ ] Review and rate appraisal
- [ ] Check auto-calculated rating
- [ ] Submit review

### Test 4: AI Features (if enabled)
- [ ] Click "Get AI Suggestion"
- [ ] AI provides rating and justification
- [ ] Can apply or dismiss suggestion

### Test 5: Mobile View
- [ ] Open on mobile device
- [ ] All pages responsive
- [ ] Forms work correctly
- [ ] Footer displays properly

---

## Share with Team

### Step 1: Prepare Communication
- [ ] Production URL ready
- [ ] Admin credentials documented (securely!)
- [ ] User guide prepared (use DEMO-CREDENTIALS.md)

### Step 2: Notify Team
- [ ] Send email with URL
- [ ] Share admin credentials with managers
- [ ] Provide signup instructions for employees
- [ ] Schedule training session (optional)

### Step 3: Support
- [ ] Monitor for issues first week
- [ ] Collect feedback
- [ ] Address any problems quickly

---

## Monitoring Setup

### Vercel
- [ ] Enable Analytics in Vercel dashboard
- [ ] Set up error notifications
- [ ] Monitor deployment status

### Supabase
- [ ] Check database usage
- [ ] Monitor API requests
- [ ] Set up alerts for limits

### OpenAI (if using)
- [ ] Check usage at platform.openai.com/usage
- [ ] Set spending limit ($20-50/month)
- [ ] Enable email alerts

---

## Security

### Immediate
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secure
- [ ] No sensitive data in Git

### Within First Week
- [ ] Change admin password from default
- [ ] Review Supabase RLS policies
- [ ] Set up regular backups

### Ongoing
- [ ] Rotate API keys quarterly
- [ ] Monitor access logs
- [ ] Update dependencies monthly

---

## Backup Plan

### Database Backup
- [ ] Supabase auto-backups enabled (free tier: 7 days)
- [ ] Manual backup scheduled (monthly)
- [ ] Backup location documented

### Code Backup
- [ ] Git repository is backup
- [ ] Multiple team members have access
- [ ] README.md up to date

---

## Cost Tracking

### Set Up Monitoring
- [ ] Vercel: Free tier (monitor usage)
- [ ] Supabase: Free tier (monitor database size)
- [ ] OpenAI: Set $20/month limit

### Expected Costs (200 users)
- Vercel: $0/month (free tier)
- Supabase: $0/month (free tier)
- OpenAI: ~$2-4/month (optional)
- Domain: ~$1/month (optional)
- **Total: ~$3-5/month**

---

## Troubleshooting

### If Build Fails
1. [ ] Run `npm run build` locally
2. [ ] Fix any TypeScript errors
3. [ ] Check all dependencies installed
4. [ ] Redeploy

### If Database Connection Fails
1. [ ] Verify Supabase URL in environment variables
2. [ ] Check anon key is correct
3. [ ] Ensure Supabase project not paused
4. [ ] Test connection locally

### If AI Not Working
1. [ ] Check LLM_API_KEY in environment variables
2. [ ] Verify API key valid at platform.openai.com
3. [ ] Check API credits available
4. [ ] Fallback to rule-based suggestions

---

## Success Criteria

You're successfully deployed when:

- ✅ Production URL accessible
- ✅ Employees can sign up and login
- ✅ Employees can submit appraisals
- ✅ Managers can review appraisals
- ✅ Auto-calculated ratings work
- ✅ AI suggestions work (if enabled)
- ✅ Mobile view works
- ✅ No errors in production
- ✅ Team has access
- ✅ Monitoring set up

---

## Next Steps After Deployment

### Week 1
- [ ] Monitor for issues
- [ ] Collect user feedback
- [ ] Fix any bugs quickly
- [ ] Document common questions

### Month 1
- [ ] Review usage analytics
- [ ] Optimize based on feedback
- [ ] Add requested features
- [ ] Update documentation

### Ongoing
- [ ] Regular backups
- [ ] Security updates
- [ ] Feature improvements
- [ ] User training

---

## Quick Commands

### Deploy to Vercel (CLI)
```bash
npm install -g vercel
vercel login
vercel
```

### Update Production
```bash
git add .
git commit -m "Update description"
git push
# Vercel auto-deploys!
```

### Check Build Locally
```bash
npm run build
npm start
```

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Your Docs**: See `PRODUCTION-DEPLOYMENT-GUIDE.md`

---

**Ready to deploy? Start with Vercel - it's the easiest!** 🚀

**Estimated time: 15-30 minutes from start to live!**

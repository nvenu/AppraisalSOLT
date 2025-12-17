# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] Supabase database is set up and working
- [ ] Test accounts work locally
- [ ] All features tested end-to-end
- [ ] Company logo added to `public/images/`
- [ ] Environment variables ready
- [ ] OpenAI API key obtained (optional)
- [ ] Test data cleaned (optional)

---

## Option 1: Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ **Free tier** - Perfect for 200 users
- ✅ **Automatic deployments** from Git
- ✅ **Built for Next.js** - Zero configuration
- ✅ **Global CDN** - Fast worldwide
- ✅ **SSL certificate** - Automatic HTTPS
- ✅ **Custom domain** - Free

### Step 1: Prepare Your Code

1. **Commit your code to Git**:
```bash
git add .
git commit -m "Ready for production deployment"
```

2. **Push to GitHub** (if not already):
```bash
# Create new repo on GitHub first, then:
git remote add origin https://github.com/your-username/employee-appraisal.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to**: https://vercel.com/signup
2. **Sign up** with GitHub account
3. **Click** "Add New Project"
4. **Import** your GitHub repository
5. **Configure**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://bbimzzctitxpxgmcuisu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   LLM_API_KEY = your_openai_api_key (optional)
   LLM_API_BASE_URL = https://api.openai.com/v1
   LLM_MODEL = gpt-4
   ```

7. **Click** "Deploy"
8. **Wait** 2-3 minutes for deployment
9. **Done!** You'll get a URL like: `https://your-app.vercel.app`

### Step 3: Add Custom Domain (Optional)

1. **In Vercel dashboard**, go to your project
2. **Click** "Settings" → "Domains"
3. **Add** your domain (e.g., `appraisal.sourceoflife.com`)
4. **Follow DNS instructions** to point domain to Vercel
5. **SSL certificate** automatically provisioned

### Step 4: Test Production

1. **Visit** your Vercel URL
2. **Test login** with test accounts
3. **Submit appraisal** as employee
4. **Review as manager**
5. **Verify** all features work

---

## Option 2: Netlify (Alternative)

### Why Netlify?
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Good for Next.js
- ✅ Automatic HTTPS

### Deployment Steps

1. **Go to**: https://netlify.com
2. **Sign up** with GitHub
3. **Click** "Add new site" → "Import an existing project"
4. **Connect** to GitHub
5. **Select** your repository
6. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. **Add environment variables** (same as Vercel)
8. **Deploy**

---

## Option 3: Self-Hosted (VPS/Cloud)

### Requirements
- Ubuntu/Debian server
- Node.js 18+
- PM2 or similar process manager
- Nginx (reverse proxy)

### Step 1: Server Setup

```bash
# SSH into your server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Deploy Application

```bash
# Clone your repository
git clone https://github.com/your-username/employee-appraisal.git
cd employee-appraisal

# Install dependencies
npm install

# Create .env.local file
nano .env.local
# Add your environment variables, then save (Ctrl+X, Y, Enter)

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "appraisal-app" -- start
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/appraisal

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/appraisal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables for Production

### Required Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://bbimzzctitxpxgmcuisu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (Optional - for AI suggestions)
LLM_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4
```

### Security Notes

- ✅ Never commit `.env.local` to Git
- ✅ Use environment variables in hosting platform
- ✅ Rotate keys periodically
- ✅ Use different keys for production vs development

---

## Database Preparation

### Clean Test Data (Optional)

Before going live, you may want to remove test data:

```sql
-- Delete test appraisals
DELETE FROM appraisals WHERE employee_id IN (
  SELECT id FROM profiles WHERE phone LIKE '1111111111%'
);

-- Delete test users
DELETE FROM profiles WHERE phone IN (
  '1111111111', '2222222222', '3333333333', 
  '4444444444', '5555555555', '6666666666', 
  '7777777777', '9999999999'
);

-- Verify clean database
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM appraisals;
```

### Or Keep Test Data

You can keep test accounts for:
- Training new managers
- Demonstrating the system
- Testing new features

Just make sure employees know which are test accounts!

---

## Post-Deployment Steps

### 1. Update Admin Credentials

For security, change the default admin password:

Edit `app/admin/page.tsx`:

```typescript
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'YourSecurePassword123!'  // Change this!
```

Then redeploy.

### 2. Set Up Monitoring

**Vercel Analytics** (Free):
1. Go to Vercel dashboard
2. Enable Analytics for your project
3. Monitor page views, performance

**Supabase Monitoring**:
1. Go to Supabase dashboard
2. Check "Database" → "Usage"
3. Monitor API requests, storage

**OpenAI Usage**:
1. Go to: https://platform.openai.com/usage
2. Monitor API costs
3. Set spending alerts

### 3. Create Backups

**Supabase Backups**:
- Free tier: Daily backups (7 days retention)
- Pro tier: Point-in-time recovery

**Manual Backup**:
```sql
-- Export all data
COPY profiles TO '/tmp/profiles_backup.csv' CSV HEADER;
COPY appraisals TO '/tmp/appraisals_backup.csv' CSV HEADER;
```

### 4. Share with Team

1. **Send URL** to your team
2. **Share admin credentials** with managers (securely!)
3. **Provide user guide** (use DEMO-CREDENTIALS.md as template)
4. **Schedule training** session

---

## Scaling Considerations

### For 200 Users

**Vercel Free Tier Limits:**
- ✅ 100 GB bandwidth/month (plenty for 200 users)
- ✅ Unlimited requests
- ✅ 100 deployments/day

**Supabase Free Tier Limits:**
- ✅ 500 MB database (enough for thousands of appraisals)
- ✅ 50,000 monthly active users
- ✅ 2 GB bandwidth/month

**You're well within limits!** No need to upgrade.

### If You Grow Beyond 200 Users

**Vercel Pro** ($20/month):
- 1 TB bandwidth
- Advanced analytics
- Team collaboration

**Supabase Pro** ($25/month):
- 8 GB database
- Daily backups
- Email support

---

## Troubleshooting Production Issues

### Issue: Build Fails on Vercel

**Check:**
1. All dependencies in `package.json`
2. No TypeScript errors: `npm run build` locally
3. Environment variables set correctly
4. Node.js version compatible (18+)

### Issue: Database Connection Fails

**Check:**
1. Supabase URL correct in environment variables
2. Anon key correct
3. RLS policies allow access
4. Supabase project not paused (free tier pauses after 7 days inactivity)

### Issue: AI Suggestions Not Working

**Check:**
1. `LLM_API_KEY` set in production environment
2. API key valid and has credits
3. Check Vercel logs for errors
4. Fallback to rule-based suggestions works

### Issue: Slow Performance

**Solutions:**
1. Enable Vercel Analytics to identify bottlenecks
2. Add database indexes (already done in setup SQL)
3. Optimize images (use Next.js Image component)
4. Enable caching

---

## Maintenance

### Regular Tasks

**Weekly:**
- [ ] Check Supabase usage
- [ ] Check OpenAI usage and costs
- [ ] Review error logs

**Monthly:**
- [ ] Backup database
- [ ] Review user feedback
- [ ] Update dependencies: `npm update`

**Quarterly:**
- [ ] Rotate API keys
- [ ] Review and clean old appraisals
- [ ] Update documentation

### Updates and Improvements

To deploy updates:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys!
# Or manually trigger deployment in Vercel dashboard
```

---

## Cost Summary

### Monthly Costs (200 Users)

| Service | Free Tier | Paid Tier | Your Cost |
|---------|-----------|-----------|-----------|
| **Vercel** | ✅ Free | $20/month | **$0** |
| **Supabase** | ✅ Free | $25/month | **$0** |
| **OpenAI** | $5 credits | Pay-as-you-go | **~$2-4/month** |
| **Domain** | - | $10-15/year | **$1/month** |
| **Total** | | | **~$3-5/month** |

**Extremely affordable for 200 employees!**

---

## Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables not in Git
- [ ] Admin password changed from default
- [ ] Supabase RLS policies enabled
- [ ] API keys rotated regularly
- [ ] Spending limits set on OpenAI
- [ ] Regular backups scheduled
- [ ] Error monitoring enabled

---

## Support & Resources

### Documentation
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs

### Your Project Docs
- `README.md` - Project overview
- `DEPLOYMENT.md` - Basic deployment info
- `END-TO-END-TESTING-GUIDE.md` - Testing guide
- `OPENAI-API-KEY-SETUP.md` - AI setup
- `BRANDING-GUIDE.md` - Customization

---

## Quick Deployment Commands

### Vercel CLI (Alternative Method)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add LLM_API_KEY

# Deploy to production
vercel --prod
```

---

## Success Checklist

After deployment, verify:

- [ ] Can access production URL
- [ ] Login page loads with company logo
- [ ] Can create new employee account
- [ ] Can submit appraisal
- [ ] Admin login works
- [ ] Manager can review appraisals
- [ ] AI suggestions work (if enabled)
- [ ] Auto-calculated ratings work
- [ ] Employee can see feedback
- [ ] Footer shows company branding
- [ ] Mobile view works
- [ ] No console errors

---

**You're ready to go live!** 🎉

**Recommended: Start with Vercel** - It's the easiest and most reliable option for Next.js apps.

# 🚀 Plesk Deployment Guide - appraisal.solifetec.com

## Overview

Deploy your Employee Appraisal System to Plesk hosting with subdomain `appraisal.solifetec.com`.

**Challenge**: Plesk is designed for traditional PHP apps, not Node.js apps. We have two options:

---

## ⚠️ Important: Plesk Limitations

Most Plesk shared hosting plans **don't support Node.js applications** well because:
- No persistent Node.js process
- Limited SSH access
- No PM2 or process managers
- Designed for PHP/static sites

### Recommended Solution: Use Vercel + Custom Domain

**Best approach**: Deploy to Vercel (free) and point your subdomain to it.

**Benefits**:
- ✅ Free hosting
- ✅ Automatic deployments
- ✅ Built for Next.js
- ✅ SSL certificate included
- ✅ Global CDN
- ✅ Easy to maintain

---

## Option 1: Vercel with Custom Domain (Recommended)

### Step 1: Deploy to Vercel

1. **Go to**: https://vercel.com/signup
2. **Sign up** with GitHub
3. **Import** your repository
4. **Add environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bbimzzctitxpxgmcuisu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   LLM_API_KEY=your_openai_key (optional)
   LLM_API_BASE_URL=https://api.openai.com/v1
   LLM_MODEL=gpt-4
   ```
5. **Deploy** (takes 2-3 minutes)
6. **Get Vercel URL**: `https://your-app.vercel.app`

### Step 2: Configure DNS in GoDaddy

1. **Login to GoDaddy**: https://dnsmanagement.godaddy.com
2. **Select** your domain: `solifetec.com`
3. **Add CNAME Record**:
   - **Type**: CNAME
   - **Name**: `appraisal`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 600 seconds (10 minutes)
4. **Save** changes

### Step 3: Add Domain in Vercel

1. **In Vercel dashboard**, go to your project
2. **Click** "Settings" → "Domains"
3. **Add domain**: `appraisal.solifetec.com`
4. **Vercel will verify** DNS (may take 5-60 minutes)
5. **SSL certificate** automatically provisioned

### Step 4: Test

1. **Wait** 10-60 minutes for DNS propagation
2. **Visit**: https://appraisal.solifetec.com
3. **Should see** your app with SSL!

---

## Option 2: Plesk with Node.js (If Supported)

### Prerequisites

Check if your Plesk supports Node.js:
1. Login to Plesk
2. Go to "Websites & Domains"
3. Look for "Node.js" option

**If you don't see Node.js option**, use Option 1 (Vercel) instead.

### Step 1: Enable Node.js in Plesk

1. **Login to Plesk**
2. **Go to**: Websites & Domains → `solifetec.com`
3. **Click**: "Node.js"
4. **Enable** Node.js
5. **Select** Node.js version: 18.x or higher

### Step 2: Create Subdomain

1. **In Plesk**, go to "Subdomains"
2. **Click** "Add Subdomain"
3. **Subdomain name**: `appraisal`
4. **Document root**: `/appraisal` (or custom path)
5. **Create**

### Step 3: Upload Application

**Option A: Using Git (Recommended)**

1. **In Plesk**, go to "Git"
2. **Add repository**: Your GitHub repo URL
3. **Branch**: `main`
4. **Deploy path**: `/httpdocs/appraisal`
5. **Deploy**

**Option B: Using FTP/File Manager**

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload these files** via FTP or Plesk File Manager:
   ```
   .next/
   node_modules/
   public/
   package.json
   package-lock.json
   next.config.js
   server.js (create this - see below)
   ```

3. **Create `.env.local`** in Plesk File Manager with your environment variables

### Step 4: Create server.js

Create `server.js` in your app root:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

### Step 5: Configure Node.js in Plesk

1. **Go to**: Node.js settings for `appraisal.solifetec.com`
2. **Application mode**: Production
3. **Application root**: `/httpdocs/appraisal`
4. **Application startup file**: `server.js`
5. **Custom environment variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bbimzzctitxpxgmcuisu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   LLM_API_KEY=your_openai_key
   LLM_API_BASE_URL=https://api.openai.com/v1
   LLM_MODEL=gpt-4
   ```
6. **Click** "Enable Node.js"
7. **Restart** application

### Step 6: Install Dependencies

1. **SSH into your server** (if available):
   ```bash
   ssh your-username@your-server-ip
   cd /var/www/vhosts/solifetec.com/httpdocs/appraisal
   npm install --production
   ```

2. **Or use Plesk terminal** (if available)

### Step 7: Configure SSL

1. **In Plesk**, go to "SSL/TLS Certificates"
2. **For** `appraisal.solifetec.com`
3. **Install** Let's Encrypt certificate (free)
4. **Enable** "Redirect from HTTP to HTTPS"

---

## Option 3: Static Export (Limited Functionality)

If Plesk doesn't support Node.js, you can export as static HTML (but you'll lose server-side features):

### Build Static Export

```bash
# Add to next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

# Build
npm run build

# Upload 'out' folder to Plesk
```

**⚠️ Limitations**:
- No server-side API routes
- No AI suggestions (requires server)
- No dynamic features
- **Not recommended for this app**

---

## DNS Configuration (GoDaddy)

### For Vercel (Recommended)

1. **Login**: https://dnsmanagement.godaddy.com
2. **Domain**: solifetec.com
3. **Add Record**:
   - Type: **CNAME**
   - Name: **appraisal**
   - Value: **cname.vercel-dns.com**
   - TTL: **600**

### For Plesk Server

1. **Login**: https://dnsmanagement.godaddy.com
2. **Domain**: solifetec.com
3. **Add Record**:
   - Type: **A Record**
   - Name: **appraisal**
   - Value: **Your Plesk Server IP** (e.g., 123.45.67.89)
   - TTL: **600**

### Check DNS Propagation

```bash
# Check if DNS is working
nslookup appraisal.solifetec.com

# Or use online tool
# https://dnschecker.org
```

---

## Troubleshooting

### Issue: Plesk doesn't have Node.js option

**Solution**: Use Option 1 (Vercel). Most shared Plesk hosting doesn't support Node.js.

### Issue: DNS not propagating

**Solutions**:
1. Wait 10-60 minutes
2. Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
3. Check DNS with: https://dnschecker.org

### Issue: SSL certificate error

**Solutions**:
1. Wait for DNS to fully propagate
2. In Plesk, reissue Let's Encrypt certificate
3. Ensure CNAME/A record is correct

### Issue: App not starting in Plesk

**Solutions**:
1. Check Node.js version (needs 18+)
2. Check application logs in Plesk
3. Verify `server.js` exists
4. Ensure `npm install` completed
5. Check environment variables set

---

## Comparison: Vercel vs Plesk

| Feature | Vercel | Plesk |
|---------|--------|-------|
| **Setup Time** | 15 minutes | 1-2 hours |
| **Cost** | Free | Included in hosting |
| **Maintenance** | Automatic | Manual |
| **SSL** | Automatic | Manual setup |
| **Deployments** | Git push | Manual upload |
| **Performance** | Global CDN | Single server |
| **Node.js Support** | Native | May not be available |
| **Recommended** | ✅ Yes | Only if Node.js available |

---

## Recommended Approach

### Best Solution: Vercel + Custom Domain

1. **Deploy to Vercel** (free, 15 minutes)
2. **Point subdomain** to Vercel (GoDaddy DNS)
3. **Use Plesk** for your main website (solifetec.com)
4. **Use Vercel** for appraisal app (appraisal.solifetec.com)

**Benefits**:
- ✅ Best performance
- ✅ Automatic deployments
- ✅ Free hosting
- ✅ Easy maintenance
- ✅ Professional setup

**Your main site** (solifetec.com) stays on Plesk
**Your appraisal app** (appraisal.solifetec.com) runs on Vercel

---

## Step-by-Step: Vercel + GoDaddy

### 1. Deploy to Vercel (10 minutes)

```bash
# Push to GitHub
git add .
git commit -m "Ready for production"
git push

# Go to vercel.com
# Sign up with GitHub
# Import repository
# Add environment variables
# Deploy
```

### 2. Configure GoDaddy DNS (5 minutes)

1. Login to GoDaddy
2. Go to DNS Management
3. Add CNAME record:
   - Name: `appraisal`
   - Value: `cname.vercel-dns.com`
4. Save

### 3. Add Domain in Vercel (2 minutes)

1. Vercel dashboard → Your project
2. Settings → Domains
3. Add: `appraisal.solifetec.com`
4. Wait for verification

### 4. Test (30-60 minutes)

1. Wait for DNS propagation
2. Visit: https://appraisal.solifetec.com
3. Done!

---

## Environment Variables

### In Vercel Dashboard

Add these in Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://bbimzzctitxpxgmcuisu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
LLM_API_KEY=your_openai_api_key
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4
```

### In Plesk (if using Plesk)

Add in Node.js → Environment Variables or create `.env.local` file.

---

## Support

### Vercel Support
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

### GoDaddy DNS Support
- Help: https://www.godaddy.com/help
- DNS Management: https://dnsmanagement.godaddy.com

### Plesk Support
- Docs: https://docs.plesk.com
- Check with your hosting provider

---

## Quick Commands

### Check DNS
```bash
nslookup appraisal.solifetec.com
```

### Test SSL
```bash
curl -I https://appraisal.solifetec.com
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

**Recommendation: Use Vercel with your custom domain. It's the easiest, fastest, and most reliable solution!** 🚀

**Total time: ~30 minutes + DNS propagation (30-60 minutes)**

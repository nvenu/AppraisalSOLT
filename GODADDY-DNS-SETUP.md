# 🌐 GoDaddy DNS Setup for appraisal.solifetec.com

## Quick Setup Guide

### Step 1: Login to GoDaddy

1. Go to: https://dnsmanagement.godaddy.com
2. Login with your GoDaddy account
3. Select domain: **solifetec.com**

### Step 2: Add CNAME Record

```
┌─────────────────────────────────────────────────────┐
│ DNS Management - solifetec.com                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [Add] [Edit] [Delete]                               │
│                                                     │
│ Type    Name        Value                    TTL    │
│ ────────────────────────────────────────────────────│
│ A       @           123.45.67.89            600     │
│ CNAME   www         @                       3600    │
│ CNAME   appraisal   cname.vercel-dns.com    600  ← ADD THIS
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Click "Add" and enter:**
- **Type**: CNAME
- **Name**: `appraisal`
- **Value**: `cname.vercel-dns.com`
- **TTL**: `600` (10 minutes)

### Step 3: Save Changes

Click "Save" or "Add Record"

---

## Detailed Instructions

### 1. Access DNS Management

**Option A: From GoDaddy Dashboard**
1. Login to https://account.godaddy.com
2. Click "My Products"
3. Find "solifetec.com"
4. Click "DNS" button

**Option B: Direct Link**
1. Go to: https://dnsmanagement.godaddy.com
2. Select "solifetec.com"

### 2. Add CNAME Record

1. **Click** "Add" button (usually at top or bottom)
2. **Select** "CNAME" from Type dropdown
3. **Enter details**:

```
┌─────────────────────────────────────┐
│ Add DNS Record                      │
├─────────────────────────────────────┤
│                                     │
│ Type: [CNAME ▼]                     │
│                                     │
│ Name: [appraisal              ]     │
│       (subdomain name)              │
│                                     │
│ Value: [cname.vercel-dns.com  ]     │
│        (points to Vercel)           │
│                                     │
│ TTL: [600 ▼] seconds                │
│      (10 minutes)                   │
│                                     │
│      [Cancel]  [Save]               │
└─────────────────────────────────────┘
```

4. **Click** "Save"

### 3. Verify DNS Record

After saving, you should see:

```
Type    Name        Value                   TTL
────────────────────────────────────────────────
CNAME   appraisal   cname.vercel-dns.com    600
```

---

## What Each Field Means

### Type: CNAME
- **CNAME** = Canonical Name
- Points your subdomain to another domain
- Used for subdomains pointing to external services

### Name: appraisal
- This is your **subdomain**
- Creates: `appraisal.solifetec.com`
- Don't include the main domain (GoDaddy adds it automatically)

### Value: cname.vercel-dns.com
- This is **Vercel's DNS endpoint**
- Tells DNS to route traffic to Vercel
- Vercel then serves your app

### TTL: 600
- **Time To Live** in seconds
- How long DNS servers cache this record
- 600 = 10 minutes (good for testing)
- Can increase to 3600 (1 hour) after confirmed working

---

## DNS Propagation

### How Long Does It Take?

- **Minimum**: 10 minutes (your TTL setting)
- **Typical**: 30-60 minutes
- **Maximum**: 24-48 hours (rare)

### Check Propagation Status

**Option 1: Command Line**
```bash
# Windows
nslookup appraisal.solifetec.com

# Mac/Linux
dig appraisal.solifetec.com
```

**Option 2: Online Tools**
- https://dnschecker.org
- https://www.whatsmydns.net
- Enter: `appraisal.solifetec.com`

### What You Should See

**Before propagation:**
```
Server:  UnKnown
Address:  192.168.1.1

Non-authoritative answer:
*** appraisal.solifetec.com can't find appraisal.solifetec.com: Non-existent domain
```

**After propagation:**
```
Server:  UnKnown
Address:  192.168.1.1

Non-authoritative answer:
Name:    cname.vercel-dns.com
Address:  76.76.21.21
Aliases:  appraisal.solifetec.com
```

---

## Troubleshooting

### Issue: Can't find "Add" button

**Solution**:
1. Scroll down the DNS records page
2. Look for "Add Record" or "Add" button
3. May be at top or bottom of records list

### Issue: CNAME not saving

**Possible causes**:
1. **Name conflict**: Remove any existing A or CNAME record for "appraisal"
2. **Invalid value**: Ensure `cname.vercel-dns.com` (no https://, no trailing slash)
3. **Permissions**: Ensure you have admin access to domain

### Issue: DNS not propagating after 2 hours

**Solutions**:
1. **Check record is saved**: Go back to DNS management, verify CNAME exists
2. **Clear local DNS cache**:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
   - Linux: `sudo systemd-resolve --flush-caches`
3. **Try different network**: Use mobile data or different WiFi
4. **Check with online tool**: https://dnschecker.org

### Issue: Shows old IP address

**Solution**:
1. Delete any old A record for "appraisal"
2. Keep only the CNAME record
3. Wait for TTL to expire (10 minutes with TTL=600)

---

## Alternative: Using A Record (If Deploying to Plesk)

If you're deploying directly to your Plesk server instead of Vercel:

### Add A Record Instead

```
Type    Name        Value              TTL
────────────────────────────────────────────
A       appraisal   123.45.67.89       600
```

**Where to find your server IP**:
1. Login to Plesk
2. Look at top right corner
3. Or ask your hosting provider

---

## After DNS is Set Up

### 1. Add Domain in Vercel

1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add: `appraisal.solifetec.com`
5. Vercel will verify DNS

### 2. Wait for SSL Certificate

- Vercel automatically provisions SSL
- Takes 5-10 minutes after DNS verification
- You'll get HTTPS automatically

### 3. Test Your Site

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://appraisal.solifetec.com

# Test HTTPS
curl -I https://appraisal.solifetec.com
```

Or just visit in browser: https://appraisal.solifetec.com

---

## DNS Record Examples

### Correct CNAME Record ✅

```
Type: CNAME
Name: appraisal
Value: cname.vercel-dns.com
TTL: 600
```

### Common Mistakes ❌

**Wrong - Including full domain in Name:**
```
Name: appraisal.solifetec.com  ❌
Should be: appraisal  ✅
```

**Wrong - Including protocol in Value:**
```
Value: https://cname.vercel-dns.com  ❌
Should be: cname.vercel-dns.com  ✅
```

**Wrong - Trailing dot or slash:**
```
Value: cname.vercel-dns.com.  ❌
Value: cname.vercel-dns.com/  ❌
Should be: cname.vercel-dns.com  ✅
```

---

## Quick Reference

### For Vercel Deployment

| Field | Value |
|-------|-------|
| Type | CNAME |
| Name | appraisal |
| Value | cname.vercel-dns.com |
| TTL | 600 |

### For Plesk Deployment

| Field | Value |
|-------|-------|
| Type | A |
| Name | appraisal |
| Value | Your server IP |
| TTL | 600 |

---

## Support

### GoDaddy Support
- **Help Center**: https://www.godaddy.com/help
- **Phone**: 1-480-505-8877
- **Chat**: Available in account dashboard

### DNS Tools
- **Check propagation**: https://dnschecker.org
- **DNS lookup**: https://mxtoolbox.com
- **What's my DNS**: https://www.whatsmydns.net

---

## Next Steps

After DNS is configured:

1. ✅ Wait 30-60 minutes for propagation
2. ✅ Add domain in Vercel dashboard
3. ✅ Wait for SSL certificate
4. ✅ Test: https://appraisal.solifetec.com
5. ✅ Share with your team!

---

**Estimated total time: 5 minutes to configure + 30-60 minutes for propagation** ⏱️

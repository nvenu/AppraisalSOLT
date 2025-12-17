# 🔑 OpenAI API Key Setup Guide

## Step-by-Step Instructions

### Step 1: Create OpenAI Account

1. **Go to**: https://platform.openai.com/signup
2. **Sign up** with:
   - Email address, OR
   - Google account, OR
   - Microsoft account
3. **Verify your email** (check inbox)
4. **Complete profile** setup

### Step 2: Add Payment Method (Required)

⚠️ **Important**: OpenAI requires a payment method, but you only pay for what you use.

1. **Go to**: https://platform.openai.com/account/billing/overview
2. **Click** "Add payment method"
3. **Enter** credit/debit card details
4. **Set spending limit** (recommended: $10-20/month)

**Pricing for your use case:**
- GPT-4: ~$0.01-0.02 per AI suggestion
- 200 employees × 6 criteria = 1,200 suggestions
- **Total cost**: ~$12-24 per appraisal cycle
- **Very affordable!**

### Step 3: Get Free Credits (Optional)

New accounts get **$5 free credits** valid for 3 months!
- Check at: https://platform.openai.com/account/billing/overview
- Enough for ~250-500 AI suggestions
- Perfect for testing!

### Step 4: Create API Key

1. **Go to**: https://platform.openai.com/api-keys
2. **Click** "Create new secret key"
3. **Name it**: "Employee Appraisal System"
4. **Click** "Create secret key"
5. **IMPORTANT**: Copy the key immediately!
   - It looks like: `sk-proj-xxxxxxxxxxxxxxxxxxxxx`
   - You can only see it once!
   - Store it safely

### Step 5: Add Key to Your App

1. **Open** `.env.local` file in your project
2. **Add these lines**:

```env
# OpenAI API Configuration
LLM_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4
```

3. **Replace** `sk-proj-xxxxxxxxxxxxxxxxxxxxx` with your actual key
4. **Save** the file

### Step 6: Restart Your App

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 7: Test AI Suggestions

1. **Visit**: http://localhost:3001/admin
2. **Login**: admin / Admin@2024
3. **Review an appraisal**
4. **Click** "Get AI Suggestion" on any criteria
5. **Should see**: AI-generated rating and justification!

---

## Quick Reference

### OpenAI Platform Links

| Purpose | URL |
|---------|-----|
| **Sign Up** | https://platform.openai.com/signup |
| **API Keys** | https://platform.openai.com/api-keys |
| **Billing** | https://platform.openai.com/account/billing/overview |
| **Usage** | https://platform.openai.com/usage |
| **Documentation** | https://platform.openai.com/docs |

### Your `.env.local` File Should Look Like:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bbimzzctitxpxgmcuisu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI API Configuration
LLM_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4
```

---

## Cost Estimation

### For 200 Employees

**Scenario 1: Full AI Usage**
- 200 employees × 6 criteria = 1,200 AI suggestions
- Cost per suggestion: ~$0.01-0.02
- **Total**: $12-24 per appraisal cycle
- **Annual** (2 cycles): $24-48

**Scenario 2: Selective AI Usage**
- Use AI for 50% of criteria (600 suggestions)
- **Total**: $6-12 per appraisal cycle
- **Annual** (2 cycles): $12-24

**Scenario 3: Testing Phase**
- 10 test appraisals × 6 criteria = 60 suggestions
- **Total**: $0.60-1.20
- **Free credits cover**: 250-500 suggestions

### Cost Comparison

| Model | Cost per 1K tokens | Recommendation |
|-------|-------------------|----------------|
| **GPT-4** | $0.03 input / $0.06 output | Best quality, recommended |
| **GPT-3.5-turbo** | $0.0005 / $0.0015 | 10x cheaper, good quality |
| **GPT-4-turbo** | $0.01 / $0.03 | Faster, cheaper than GPT-4 |

**To use GPT-3.5-turbo** (cheaper):
```env
LLM_MODEL=gpt-3.5-turbo
```

---

## Security Best Practices

### ✅ DO:
- Store API key in `.env.local` (server-side only)
- Add `.env.local` to `.gitignore` (already done)
- Set spending limits in OpenAI dashboard
- Monitor usage regularly
- Rotate keys periodically

### ❌ DON'T:
- Commit API key to Git
- Share API key publicly
- Use API key in client-side code
- Leave unlimited spending enabled

---

## Troubleshooting

### Issue: "Invalid API Key"

**Solutions:**
1. Check key starts with `sk-proj-` or `sk-`
2. No extra spaces before/after key
3. Key copied completely (very long string)
4. Try creating a new key

### Issue: "Insufficient Quota"

**Solutions:**
1. Add payment method at: https://platform.openai.com/account/billing
2. Check free credits haven't expired
3. Increase spending limit

### Issue: "Rate Limit Exceeded"

**Solutions:**
1. You're making too many requests too fast
2. Wait a few seconds between requests
3. Upgrade to higher tier plan

### Issue: AI Suggestions Not Appearing

**Solutions:**
1. Check `.env.local` has correct key
2. Restart development server
3. Check browser console (F12) for errors
4. Verify API key is active at platform.openai.com

---

## Alternative Options

### Option 1: Use GPT-3.5-turbo (Cheaper)

```env
LLM_MODEL=gpt-3.5-turbo
```
- 10x cheaper than GPT-4
- Still very good quality
- Faster responses

### Option 2: Use Rule-Based Fallback (Free)

Don't add API key - system automatically uses rule-based suggestions:
- Analyzes narrative length
- Checks for keywords
- Provides basic scoring
- No cost, but less sophisticated

### Option 3: Use Local LLM (Free, Private)

Install Ollama or LM Studio:
```env
LLM_API_BASE_URL=http://localhost:11434/v1
LLM_MODEL=llama2
```
- Completely free
- Runs on your computer
- 100% private
- Requires setup

---

## Monitoring Usage

### Check Your Usage

1. **Go to**: https://platform.openai.com/usage
2. **View**:
   - Daily usage
   - Cost breakdown
   - Token consumption
   - Request counts

### Set Spending Alerts

1. **Go to**: https://platform.openai.com/account/billing/limits
2. **Set**:
   - Monthly budget limit
   - Email notifications
   - Hard limit (stops API if exceeded)

**Recommended for 200 employees:**
- Soft limit: $20/month
- Hard limit: $50/month
- Email alerts: $10, $20, $30

---

## Testing Your Setup

### Quick Test

1. **Open terminal** in your project
2. **Run**:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Say hello"}]
  }'
```

3. **Replace** `YOUR_API_KEY` with your actual key
4. **Should see**: JSON response with "Hello" message

### In-App Test

1. **Restart app**: `npm run dev`
2. **Login as manager**
3. **Review appraisal**
4. **Click "Get AI Suggestion"**
5. **Should see**: AI rating and justification

---

## Support

### OpenAI Support
- **Help Center**: https://help.openai.com
- **Community**: https://community.openai.com
- **Status**: https://status.openai.com

### Common Questions

**Q: Do I need to pay upfront?**
A: No, you only pay for what you use (pay-as-you-go).

**Q: Can I cancel anytime?**
A: Yes, just remove your payment method.

**Q: What if I exceed my budget?**
A: Set a hard limit to automatically stop API access.

**Q: Is my data safe?**
A: OpenAI doesn't use API data for training (with proper settings).

---

## Next Steps

1. ✅ Create OpenAI account
2. ✅ Add payment method
3. ✅ Create API key
4. ✅ Add to `.env.local`
5. ✅ Restart app
6. ✅ Test AI suggestions
7. ✅ Set spending limits
8. ✅ Monitor usage

**You're ready to use AI-powered appraisal assessments!** 🚀

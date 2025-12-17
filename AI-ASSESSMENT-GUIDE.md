# 🤖 AI Assessment Guide

## Overview

Your Employee Appraisal System has **TWO AI-powered features**:

### 1. ✅ AI Rating Suggestions (Already Built!)
- **Status**: Fully implemented
- **Location**: Manager review interface
- **Feature**: AI suggests ratings for each criteria based on employee narratives
- **Documentation**: See `AI-RATING-SYSTEM.md`

### 2. ✅ Auto-Calculated Overall Rating (Just Added!)
- **Status**: Just implemented
- **Feature**: Automatically calculates overall rating from detailed criteria ratings
- **Method**: Weighted average of all criteria scores

---

## Feature 1: AI Rating Suggestions

### How It Works

When a manager reviews an appraisal, they can click **"Get AI Suggestion"** on any criteria to:

1. **AI analyzes** the employee's narrative response
2. **Considers** the experience level (Junior/Mid-level/Senior)
3. **Compares** against rating definitions
4. **Suggests** a rating (1-5) with detailed justification
5. **Manager** can accept, modify, or ignore the suggestion

### Setup Required

#### Step 1: Add OpenAI API Key

Edit `.env.local`:

```env
# Existing Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://bbimzzctitxpxgmcuisu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# Add these for AI features
LLM_API_KEY=your_openai_api_key_here
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4
```

#### Step 2: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Create account or login
3. Click "Create new secret key"
4. Copy the key
5. Paste into `.env.local`

#### Step 3: Restart App

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Using AI Suggestions

1. **Login as Manager** (admin/Admin@2024)
2. **Start reviewing** an appraisal
3. **For each criteria**, you'll see:
   ```
   ┌─────────────────────────────────────┐
   │ Code Quality & Standards            │
   │ Employee response: "I follow..."    │
   │                                     │
   │ [Get AI Suggestion] 🤖              │
   │                                     │
   │ Rating: [Select 1-5]                │
   └─────────────────────────────────────┘
   ```
4. **Click "Get AI Suggestion"**
5. **AI analyzes** and shows:
   ```
   ┌─────────────────────────────────────┐
   │ 🤖 AI Suggestion: 4/5               │
   │ Exceeds Expectations                │
   │                                     │
   │ Justification:                      │
   │ "The employee demonstrates strong   │
   │  code quality practices..."         │
   │                                     │
   │ [Apply Rating] [Dismiss]            │
   └─────────────────────────────────────┘
   ```
6. **Click "Apply Rating"** to use it, or manually select different rating

### Fallback Mode

If no API key is configured, the system uses **rule-based suggestions**:
- Analyzes narrative length
- Checks for keywords
- Provides basic scoring
- Still helpful, but less sophisticated

---

## Feature 2: Auto-Calculated Overall Rating

### How It Works

After rating all criteria, the system **automatically calculates** the overall rating:

```
Overall Rating = Average of all criteria ratings (rounded)
```

**Example:**
```
Code Quality: 4
Learning: 5
Task Execution: 4
Communication: 4
Problem Solving: 4
Goal Achievement: 5

Auto-calculated: (4+5+4+4+4+5) / 6 = 4.33 → 4/5
```

### Using Auto-Calculation

1. **Rate all criteria** (1-5 for each)
2. **See auto-calculated rating** displayed in blue box:
   ```
   ┌─────────────────────────────────────┐
   │ 📊 Auto-Calculated Overall Rating   │
   │ Based on average of all criteria    │
   │                                     │
   │              4/5                    │
   │      Exceeds Expectations           │
   └─────────────────────────────────────┘
   ```
3. **Option 1**: Leave "Overall Rating" empty → Uses auto-calculated
4. **Option 2**: Manually select different rating → Overrides auto-calculated

### Benefits

- ✅ **Consistent**: Based on objective criteria
- ✅ **Fair**: No bias, pure mathematics
- ✅ **Fast**: Automatic calculation
- ✅ **Flexible**: Can override if needed
- ✅ **Transparent**: Shows calculation to manager

---

## Complete AI-Enhanced Workflow

### Step 1: Employee Submits Appraisal
- Fills detailed narratives for each criteria
- Provides goals, self-rating, justification

### Step 2: Manager Reviews with AI
1. **Opens appraisal** for review
2. **For each criteria**:
   - Reads employee narrative
   - Clicks "Get AI Suggestion" 🤖
   - Reviews AI's suggested rating and justification
   - Accepts or modifies the rating
3. **Sees auto-calculated overall rating** 📊
4. **Optionally overrides** overall rating
5. **Provides overall feedback**
6. **Submits review**

### Step 3: Employee Sees Results
- Views detailed ratings per criteria
- Sees overall rating
- Reads manager feedback

---

## AI Prompt Engineering

The AI uses this prompt structure:

```
You are an HR Calibration Analyst reviewing employee appraisals.

Experience Level: {Junior/Mid-level/Senior}
Criteria: {Criteria Name}
Employee Response: {Narrative}

Rating Definitions:
1 - Needs Improvement: {definition}
3 - Meets Expectations: {definition}
5 - Outstanding: {definition}

Analyze and suggest rating (1-5) with justification.
```

### Customizing AI Behavior

Edit `app/actions/llm.actions.ts`:

```typescript
const prompt = `You are an HR Calibration Analyst...

Additional instructions:
- Focus on specific examples
- Consider experience level expectations
- Be objective and fair
- Provide constructive feedback
`
```

---

## Cost Considerations

### OpenAI Pricing (GPT-4)

- **Input**: ~$0.03 per 1K tokens
- **Output**: ~$0.06 per 1K tokens
- **Per suggestion**: ~$0.01-0.02

**Example costs:**
- 10 appraisals × 6 criteria = 60 suggestions
- Cost: ~$0.60-1.20
- Very affordable for 200 employees!

### Free Alternatives

1. **Use rule-based fallback** (no API key needed)
2. **Use GPT-3.5-turbo** (10x cheaper than GPT-4)
3. **Use local LLM** (Ollama, LM Studio)

---

## Testing AI Features

### Test 1: AI Suggestions

1. **Add API key** to `.env.local`
2. **Restart app**
3. **Login as manager**
4. **Review an appraisal**
5. **Click "Get AI Suggestion"** on any criteria
6. **Verify**: Should see AI-generated rating and justification

### Test 2: Auto-Calculated Rating

1. **Login as manager**
2. **Start reviewing** an appraisal
3. **Rate all criteria** (e.g., all 4s)
4. **Verify**: Blue box shows "4/5" auto-calculated
5. **Leave overall rating empty**
6. **Submit review**
7. **Verify**: Overall rating saved as 4/5

### Test 3: Override Auto-Calculation

1. **Rate all criteria** (e.g., all 4s)
2. **See auto-calculated**: 4/5
3. **Manually select**: 5/5 (override)
4. **Submit review**
5. **Verify**: Overall rating saved as 5/5 (manual override)

---

## Troubleshooting

### AI Suggestions Not Working?

**Check:**
1. API key in `.env.local`
2. API key is valid (test at platform.openai.com)
3. Restart development server
4. Check browser console (F12) for errors
5. Check API usage at platform.openai.com

**Fallback:**
- System automatically uses rule-based suggestions if API fails
- Still provides helpful guidance

### Auto-Calculation Not Showing?

**Check:**
1. All criteria have been rated
2. Blue box appears after rating criteria
3. Refresh page if needed

---

## Advanced Features

### Batch AI Analysis

Want to analyze all criteria at once? Edit `app/actions/llm.actions.ts`:

```typescript
export async function analyzeAllCriteria(
  responses: Record<string, string>,
  experienceLevel: string
) {
  // Analyze all criteria in one API call
  // More efficient and cheaper
}
```

### Custom Rating Scales

Want different rating scales? Edit database:

```sql
-- Add custom rating scale
ALTER TABLE appraisals ADD COLUMN rating_scale TEXT DEFAULT '1-5';

-- Support 1-10 scale
UPDATE appraisals SET rating_scale = '1-10';
```

### AI-Generated Feedback

Want AI to suggest overall feedback? Add to `llm.actions.ts`:

```typescript
export async function suggestOverallFeedback(
  detailedRatings: Record<string, number>,
  narratives: Record<string, string>
) {
  // Generate comprehensive feedback based on all criteria
}
```

---

## Security & Privacy

### API Key Security

✅ **Secure**: API key stored in `.env.local` (server-side only)
✅ **Never exposed**: Not sent to browser
✅ **Server Actions**: All AI calls happen on server

### Data Privacy

- Employee narratives sent to OpenAI for analysis
- No personal identifiable information (PII) sent
- Responses not stored by OpenAI (with proper settings)
- Consider data privacy policies

### Compliance

For sensitive data:
1. Use **local LLM** (Ollama, LM Studio)
2. Use **Azure OpenAI** (enterprise compliance)
3. Use **rule-based fallback** (no external API)

---

## Documentation

- **AI-RATING-SYSTEM.md** - Complete AI rating system docs
- **app/actions/llm.actions.ts** - AI implementation code
- **components/AISuggestionBadge.tsx** - AI UI component
- **supabase-rating-definitions.sql** - Rating definitions for AI

---

**Your system is AI-ready! Just add an OpenAI API key to unlock AI suggestions.** 🤖✨

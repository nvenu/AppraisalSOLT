# AI-Powered Rating Suggestion System

## 🤖 Overview

The Employee Appraisal System now includes an intelligent AI-powered rating suggestion feature that helps managers make objective, evidence-based performance evaluations.

## 🎯 Features

### **For Managers:**
- **AI-Powered Analysis**: Click "AI Suggest" to get intelligent rating recommendations
- **Evidence-Based Justification**: See detailed reasoning for each suggested rating
- **One-Click Application**: Apply AI suggestions instantly or use as guidance
- **Fallback Intelligence**: Works with or without LLM API (rule-based fallback)

### **Key Benefits:**
- ✅ **Objective Evaluation**: Reduces bias with evidence-based analysis
- ✅ **Time Savings**: Quick initial assessment of detailed narratives
- ✅ **Consistency**: Standardized evaluation across all appraisals
- ✅ **Learning Tool**: Helps managers understand rating calibration

## 🏗 Architecture

### **Components:**

1. **Server Action** (`app/actions/llm.actions.ts`)
   - Secure API key handling (server-side only)
   - LLM integration with structured prompts
   - Rule-based fallback when LLM unavailable
   - Error handling and graceful degradation

2. **UI Component** (`components/AISuggestionBadge.tsx`)
   - "AI Suggest" button with loading states
   - Suggested rating badge with justification
   - One-click rating application
   - Expandable justification view

3. **Database Schema** (`rating_definitions` column)
   - JSONB storage for rating criteria
   - Defines expectations for scores 1, 3, and 5
   - Experience-level specific definitions

## 🔧 Setup & Configuration

### **1. Database Setup**

Run the SQL migrations in order:
```bash
# 1. Base schema
supabase-setup.sql

# 2. Experience features
supabase-experience-update.sql

# 3. Rating definitions
supabase-rating-definitions.sql
```

### **2. Environment Variables**

Add to your `.env.local`:

```env
# Optional - for AI-powered suggestions
LLM_API_KEY=your_openai_api_key
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-3.5-turbo
```

**Without LLM API**: System automatically uses intelligent rule-based suggestions.

### **3. Supported LLM Providers**

#### **OpenAI (Recommended)**
```env
LLM_API_KEY=sk-...
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-3.5-turbo
```

#### **Anthropic Claude**
```env
LLM_API_KEY=sk-ant-...
LLM_API_URL=https://api.anthropic.com/v1/messages
LLM_MODEL=claude-3-sonnet-20240229
```

#### **Azure OpenAI**
```env
LLM_API_KEY=your_azure_key
LLM_API_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview
LLM_MODEL=gpt-35-turbo
```

## 📊 How It Works

### **1. Manager Workflow**

1. **Review Employee Narrative**: Read the detailed response for each criteria
2. **Click "AI Suggest"**: Triggers intelligent analysis
3. **Review AI Analysis**: See suggested rating (1-5) and justification
4. **Apply or Adjust**: Use suggestion as-is or adjust based on judgment

### **2. AI Analysis Process**

```
Employee Narrative
    ↓
Server Action (Secure)
    ↓
Fetch Rating Definitions (Supabase)
    ↓
Construct HR Analyst Prompt
    ↓
LLM API Call (or Rule-Based Fallback)
    ↓
Parse Structured Response
    ↓
Return Suggestion + Justification
    ↓
Display in UI
```

### **3. Prompt Engineering**

The system uses a specialized "HR Calibration Analyst" prompt that:
- Provides clear rating scale definitions (1, 3, 5)
- Requests evidence-based analysis
- Considers experience level expectations
- Returns structured JSON output
- Focuses on objectivity and fairness

### **4. Rule-Based Fallback**

When LLM API is unavailable, the system uses intelligent heuristics:
- **Keyword Analysis**: Identifies positive/negative indicators
- **Length Analysis**: Considers response depth
- **Pattern Matching**: Recognizes achievement patterns
- **Default to 3**: Conservative "meets expectations" baseline

## 🎨 UI/UX Design

### **AI Suggestion Badge States:**

1. **Initial State**: "AI Suggest" button
2. **Loading State**: Spinner with "Analyzing..." text
3. **Suggestion State**: Badge showing "Suggested: X/5"
4. **Expanded State**: Justification panel with detailed reasoning

### **Visual Indicators:**
- ✨ **Sparkles Icon**: Indicates AI-powered feature
- 🔵 **Blue Badge**: Suggested rating display
- ℹ️ **Info Icon**: Click to see justification
- ✅ **Apply Button**: One-click rating application

## 🔒 Security & Privacy

### **Security Measures:**
- ✅ **Server-Side Only**: API keys never exposed to client
- ✅ **Next.js Server Actions**: Secure backend execution
- ✅ **Environment Variables**: Sensitive data in `.env.local`
- ✅ **Error Handling**: Graceful failures without data exposure

### **Privacy Considerations:**
- Employee narratives sent to LLM API (if configured)
- Consider data privacy policies for your organization
- Option to use rule-based system (no external API calls)
- All data processing complies with standard practices

## 📈 Performance

### **Response Times:**
- **LLM API**: 2-5 seconds (depends on provider)
- **Rule-Based**: < 100ms (instant)
- **Database Query**: < 50ms

### **Cost Optimization:**
- Uses GPT-3.5-turbo by default (cost-effective)
- Structured output reduces token usage
- Temperature 0.3 for consistent results
- Max 500 tokens per response

## 🧪 Testing

### **Test the AI System:**

1. **Login as Admin**: Visit `/admin` (admin / Admin@2024)
2. **Wait for Employee Submissions**: Or create test data
3. **Start Review**: Click "Start Review" on any appraisal
4. **Test AI Suggest**: Click "AI Suggest" for each criteria
5. **Review Justification**: Click the badge to see reasoning
6. **Apply or Adjust**: Use suggestion or modify manually

### **Test Scenarios:**

**Scenario 1: Strong Performance**
- Narrative with multiple achievements
- Expected: Rating 4-5 with positive justification

**Scenario 2: Meets Expectations**
- Balanced narrative with steady performance
- Expected: Rating 3 with neutral justification

**Scenario 3: Needs Improvement**
- Narrative mentioning challenges/struggles
- Expected: Rating 1-2 with constructive feedback

## 🔧 Troubleshooting

### **"AI Suggestion Unavailable"**
- **Cause**: LLM API error or no API key
- **Solution**: Check environment variables or use rule-based mode

### **Slow Response Times**
- **Cause**: LLM API latency
- **Solution**: Consider faster model or rule-based mode

### **Unexpected Ratings**
- **Cause**: Ambiguous narrative or edge cases
- **Solution**: Review justification and adjust manually

### **API Rate Limits**
- **Cause**: Too many requests to LLM provider
- **Solution**: Implement rate limiting or use rule-based mode

## 🚀 Future Enhancements

### **Potential Features:**
- **Batch Analysis**: Analyze all criteria at once
- **Historical Calibration**: Learn from past ratings
- **Custom Prompts**: Organization-specific evaluation criteria
- **Multi-Language**: Support for non-English narratives
- **Confidence Scores**: Show AI confidence level
- **Comparative Analysis**: Compare across team members

## 📚 Best Practices

### **For Managers:**
1. **Use as Guidance**: AI suggestions are starting points, not final decisions
2. **Read Justifications**: Understand the reasoning behind suggestions
3. **Consider Context**: Factor in information AI doesn't have
4. **Maintain Judgment**: Your expertise and knowledge matter most
5. **Provide Feedback**: Note when AI suggestions are helpful or not

### **For Administrators:**
1. **Monitor Usage**: Track API costs and usage patterns
2. **Update Definitions**: Keep rating definitions current
3. **Review Accuracy**: Periodically check AI suggestion quality
4. **Train Managers**: Ensure proper use of AI assistance
5. **Maintain Privacy**: Follow data protection policies

---

**The AI Rating System enhances manager efficiency while maintaining human judgment and fairness in performance evaluations.**
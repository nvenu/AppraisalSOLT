'use server'

import { supabase } from '@/lib/supabase'

interface RatingDefinitions {
  '1': string
  '3': string
  '5': string
}

interface SuggestRatingInput {
  employee_narrative: string
  criterion_name: string
  experience_level: string
}

interface SuggestRatingOutput {
  suggested_rating: number
  llm_justification: string
  error?: string
}

/**
 * Server Action: Suggests a rating for an employee's narrative response
 * using an LLM to analyze the content against rating definitions
 */
export async function suggestRating(
  input: SuggestRatingInput
): Promise<SuggestRatingOutput> {
  try {
    // Fetch rating definitions from Supabase
    const { data: criteria, error: dbError } = await supabase
      .from('appraisal_criteria')
      .select('rating_definitions')
      .eq('experience_level', input.experience_level)
      .eq('criteria_name', input.criterion_name)
      .single()

    if (dbError || !criteria?.rating_definitions) {
      // Fallback to default rating definitions if not found
      const defaultDefinitions: RatingDefinitions = {
        '1': 'Performance significantly below expectations. Minimal evidence of meeting criteria requirements.',
        '3': 'Performance meets expectations. Demonstrates consistent application of required skills and behaviors.',
        '5': 'Performance significantly exceeds expectations. Exceptional demonstration of criteria with measurable impact.'
      }
      return analyzeWithLLM(input, defaultDefinitions)
    }

    return analyzeWithLLM(input, criteria.rating_definitions as RatingDefinitions)
  } catch (error) {
    console.error('Error in suggestRating:', error)
    return {
      suggested_rating: 3,
      llm_justification: 'AI Suggestion Unavailable',
      error: 'Failed to generate AI suggestion. Please rate manually.'
    }
  }
}

/**
 * Analyzes employee narrative using LLM API
 */
async function analyzeWithLLM(
  input: SuggestRatingInput,
  ratingDefinitions: RatingDefinitions
): Promise<SuggestRatingOutput> {
  const llmApiKey = process.env.LLM_API_KEY
  const llmApiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions'

  // If no API key, return a rule-based suggestion
  if (!llmApiKey) {
    return generateRuleBasedSuggestion(input, ratingDefinitions)
  }

  try {
    // Construct the HR Calibration Analyst prompt
    const prompt = constructCalibrationPrompt(input, ratingDefinitions)

    const response = await fetch(llmApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmApiKey}`
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR Calibration Analyst. Analyze employee performance narratives objectively and provide structured ratings based on evidence.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in LLM response')
    }

    const parsed = JSON.parse(content)
    
    return {
      suggested_rating: Math.min(5, Math.max(1, parseInt(parsed.suggested_rating) || 3)),
      llm_justification: parsed.justification || 'Analysis completed'
    }
  } catch (error) {
    console.error('LLM API error:', error)
    // Fallback to rule-based suggestion
    return generateRuleBasedSuggestion(input, ratingDefinitions)
  }
}

/**
 * Constructs the HR Calibration Analyst prompt
 */
function constructCalibrationPrompt(
  input: SuggestRatingInput,
  ratingDefinitions: RatingDefinitions
): string {
  return `As an HR Calibration Analyst, analyze the following employee narrative and suggest an objective rating (1-5).

**Criterion**: ${input.criterion_name}
**Experience Level**: ${input.experience_level}

**Rating Scale Definitions**:
- **Rating 1**: ${ratingDefinitions['1']}
- **Rating 3**: ${ratingDefinitions['3']}
- **Rating 5**: ${ratingDefinitions['5']}

**Employee's Narrative**:
"${input.employee_narrative}"

**Instructions**:
1. Identify specific evidence in the narrative that aligns with each rating level
2. Consider the experience level expectations
3. Look for concrete examples, measurable outcomes, and impact
4. Be objective and evidence-based
5. Ratings of 2 and 4 represent intermediate performance between the defined levels

**Required Output Format** (JSON):
{
  "suggested_rating": <integer 1-5>,
  "justification": "<2-3 sentences explaining the rating based on specific evidence from the narrative>"
}

Provide your analysis now:`
}

/**
 * Generates a rule-based suggestion when LLM is unavailable
 */
function generateRuleBasedSuggestion(
  input: SuggestRatingInput,
  ratingDefinitions: RatingDefinitions
): SuggestRatingOutput {
  const narrative = input.employee_narrative.toLowerCase()
  const wordCount = input.employee_narrative.split(/\s+/).length

  // Simple heuristic-based scoring
  let score = 3 // Default to meets expectations

  // Positive indicators
  const positiveKeywords = [
    'exceeded', 'exceptional', 'outstanding', 'significantly', 'improved',
    'led', 'mentored', 'innovative', 'proactive', 'achieved', 'delivered',
    'impact', 'success', 'excellence', 'transformed'
  ]

  // Negative indicators
  const negativeKeywords = [
    'struggled', 'difficulty', 'limited', 'minimal', 'below', 'failed',
    'incomplete', 'delayed', 'issues', 'problems'
  ]

  const positiveCount = positiveKeywords.filter(word => narrative.includes(word)).length
  const negativeCount = negativeKeywords.filter(word => narrative.includes(word)).length

  // Adjust score based on indicators
  if (positiveCount >= 3 && wordCount > 100) {
    score = 5
  } else if (positiveCount >= 2) {
    score = 4
  } else if (negativeCount >= 2) {
    score = 2
  } else if (negativeCount >= 3) {
    score = 1
  }

  return {
    suggested_rating: score,
    llm_justification: `Based on narrative analysis: ${positiveCount} positive indicators, ${negativeCount} areas for improvement. Response length: ${wordCount} words. This is a rule-based suggestion - consider the specific evidence provided.`
  }
}
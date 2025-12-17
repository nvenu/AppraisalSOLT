'use client'

import { useState, useEffect } from 'react'
import { supabase, type AppraisalCriteria } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Star, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface ExperienceBasedAppraisalFormProps {
  user: {
    id: string
    full_name: string
    experience_level?: string
    years_of_experience?: number
  }
  onSubmitSuccess: () => void
}

// Default criteria for different experience levels
const defaultCriteria = {
  Junior: [
    { criteria_name: 'Code Quality', criteria_description: 'Describe your approach to writing clean, readable, and maintainable code. Include examples of how you ensure code quality. (0-2 years experience)', weight: 1.0 },
    { criteria_name: 'Learning & Growth', criteria_description: 'Detail your learning journey, new technologies you\'ve explored, and how you\'ve improved your skills.', weight: 1.0 },
    { criteria_name: 'Task Completion', criteria_description: 'Explain how you manage and complete assigned tasks, including your approach to meeting deadlines.', weight: 1.0 },
    { criteria_name: 'Communication', criteria_description: 'Describe how you communicate with team members, ask for help, and share updates on your work.', weight: 0.8 },
    { criteria_name: 'Problem Solving', criteria_description: 'Provide examples of problems you\'ve solved and your debugging approach when facing challenges.', weight: 0.9 }
  ],
  'Mid-level': [
    { criteria_name: 'Technical Expertise', criteria_description: 'Describe your proficiency in core technologies, frameworks, and how you apply best practices in your work. (3-6 years experience)', weight: 1.0 },
    { criteria_name: 'Code Review & Mentoring', criteria_description: 'Explain your experience reviewing code and mentoring junior developers. Include specific examples.', weight: 1.0 },
    { criteria_name: 'Project Ownership', criteria_description: 'Detail projects you\'ve owned end-to-end, including planning, execution, and delivery.', weight: 1.0 },
    { criteria_name: 'Architecture Understanding', criteria_description: 'Describe your understanding of system architecture, design patterns, and how you apply them.', weight: 0.9 },
    { criteria_name: 'Cross-team Collaboration', criteria_description: 'Explain how you work with different teams, handle dependencies, and contribute to cross-functional projects.', weight: 0.8 }
  ],
  Senior: [
    { criteria_name: 'Technical Leadership', criteria_description: 'Describe how you lead technical decisions, influence architecture, and guide technical direction. (7-10+ years experience)', weight: 1.0 },
    { criteria_name: 'Mentoring & Knowledge Sharing', criteria_description: 'Detail your mentoring activities, knowledge sharing initiatives, and how you develop team capabilities.', weight: 1.0 },
    { criteria_name: 'Strategic Thinking', criteria_description: 'Explain your contributions to long-term technical strategy and how you balance technical debt with feature delivery.', weight: 1.0 },
    { criteria_name: 'Innovation & Best Practices', criteria_description: 'Describe innovations you\'ve introduced, process improvements, and how you drive technical excellence.', weight: 0.9 },
    { criteria_name: 'Stakeholder Management', criteria_description: 'Explain how you manage relationships with stakeholders, communicate technical concepts, and handle expectations.', weight: 0.8 }
  ]
}

export function ExperienceBasedAppraisalForm({ user, onSubmitSuccess }: ExperienceBasedAppraisalFormProps) {
  const [criteria, setCriteria] = useState<AppraisalCriteria[]>([])
  const [selfReview, setSelfReview] = useState('')
  const [keyAchievements, setKeyAchievements] = useState('')
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // New goal-based fields
  const [okrGoals, setOkrGoals] = useState<Record<string, string>>({
    'Goal 1': '',
    'Goal 2': '',
    'Goal 3': ''
  })
  const [crossFunctionalImpact, setCrossFunctionalImpact] = useState('')
  const [roadblocksSupport, setRoadblocksSupport] = useState('')
  const [selfRating, setSelfRating] = useState<number>(3)
  const [selfRatingJustification, setSelfRatingJustification] = useState('')

  const experienceLevel = user.experience_level || 'Junior'

  useEffect(() => {
    fetchCriteria()
  }, [experienceLevel])

  const fetchCriteria = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('appraisal_criteria')
        .select('*')
        .eq('experience_level', experienceLevel)

      if (error) throw error
      
      // Use database criteria if available, otherwise use defaults
      const criteriaData = data && data.length > 0 
        ? data 
        : defaultCriteria[experienceLevel as keyof typeof defaultCriteria] || defaultCriteria.Junior

      setCriteria(criteriaData)
      
      // Initialize responses
      const initialResponses: Record<string, string> = {}
      criteriaData.forEach((criterion: any) => {
        initialResponses[criterion.criteria_name] = ''
      })
      setResponses(initialResponses)
    } catch (error) {
      console.error('Error fetching criteria:', error)
      // Fallback to default criteria
      const fallbackCriteria = defaultCriteria[experienceLevel as keyof typeof defaultCriteria] || defaultCriteria.Junior
      const fallbackWithIds = fallbackCriteria.map((c, index) => ({
        ...c,
        id: `fallback-${index}`,
        experience_level: experienceLevel
      }))
      setCriteria(fallbackWithIds as AppraisalCriteria[])
      
      const initialResponses: Record<string, string> = {}
      fallbackCriteria.forEach((criterion) => {
        initialResponses[criterion.criteria_name] = ''
      })
      setResponses(initialResponses)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponseChange = (criteriaName: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [criteriaName]: response
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if all required fields are filled
    const missingResponses = criteria.filter(criterion => !responses[criterion.criteria_name]?.trim())
    const missingGoals = Object.values(okrGoals).filter(goal => !goal.trim())
    
    if (!selfReview.trim() || !keyAchievements.trim() || missingResponses.length > 0 || 
        !crossFunctionalImpact.trim() || !roadblocksSupport.trim() || 
        !selfRatingJustification.trim() || missingGoals.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('📝 Submitting appraisal with data:', {
        employee_id: user.id,
        experience_level: experienceLevel,
        self_rating: selfRating,
        status: 'submitted'
      })

      // Create new appraisal in Supabase
      const { data, error } = await supabase
        .from('appraisals')
        .insert({
          employee_id: user.id,
          self_review: selfReview.trim(),
          key_achievements: keyAchievements.trim(),
          experience_level: experienceLevel,
          detailed_responses: responses,
          okr_goal_status: okrGoals,
          cross_functional_impact: crossFunctionalImpact.trim(),
          roadblocks_support: roadblocksSupport.trim(),
          self_rating: selfRating,
          self_rating_justification: selfRatingJustification.trim(),
          status: 'submitted'
        })
        .select()

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ Appraisal submitted successfully:', data)
      toast.success('Appraisal submitted successfully!')
      
      setSelfReview('')
      setKeyAchievements('')
      setCrossFunctionalImpact('')
      setRoadblocksSupport('')
      setSelfRating(3)
      setSelfRatingJustification('')
      
      // Reset responses and goals
      const resetResponses: Record<string, string> = {}
      criteria.forEach((criterion) => {
        resetResponses[criterion.criteria_name] = ''
      })
      setResponses(resetResponses)
      setOkrGoals({ 'Goal 1': '', 'Goal 2': '', 'Goal 3': '' })
      
      onSubmitSuccess()
    } catch (error: any) {
      console.error('❌ Error submitting appraisal:', error)
      console.error('❌ Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      })
      toast.error(`Failed to submit appraisal: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5" />
          {experienceLevel} Developer Appraisal
        </CardTitle>
        <CardDescription>
          Provide detailed responses for each criteria based on your {experienceLevel.toLowerCase()} level expectations
          {user.years_of_experience && ` (${user.years_of_experience} years experience)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Goal & Alignment Section */}
          <div className="space-y-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-semibold text-blue-900">Goals & Organizational Alignment</Label>
            </div>
            
            {/* OKR/Goal Status */}
            <div className="space-y-4">
              <Label className="font-medium">Top 3 OKR/Goal Status *</Label>
              <p className="text-sm text-gray-600">List your top 3 goals/OKRs for this review period and their current status.</p>
              {Object.entries(okrGoals).map(([goalKey, goalValue]) => (
                <div key={goalKey} className="space-y-2">
                  <Label className="text-sm font-medium">{goalKey}</Label>
                  <Textarea
                    placeholder="Goal description and status (e.g., 'Improve API response time by 30% - Achieved: Reduced from 200ms to 140ms')"
                    value={goalValue}
                    onChange={(e) => setOkrGoals(prev => ({ ...prev, [goalKey]: e.target.value }))}
                    className="min-h-[60px]"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Cross-Functional Impact */}
            <div className="space-y-2">
              <Label htmlFor="cross-functional-impact">Cross-Functional Impact *</Label>
              <p className="text-sm text-gray-600">Describe one major contribution that positively affected another team(Technical team, QA team, Operations, etc.)</p>
              <Textarea
                id="cross-functional-impact"
                placeholder="Example: Collaborated with Marketing team to implement analytics tracking, resulting in 25% better campaign insights..."
                value={crossFunctionalImpact}
                onChange={(e) => setCrossFunctionalImpact(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Roadblocks & Support */}
            <div className="space-y-2">
              <Label htmlFor="roadblocks-support">Roadblocks & Support Needed *</Label>
              <p className="text-sm text-gray-600">What was your biggest obstacle, and what support do you need from management or other teams?</p>
              <Textarea
                id="roadblocks-support"
                placeholder="Example: Limited access to production logs slowed debugging. Need read-only production access or better monitoring tools..."
                value={roadblocksSupport}
                onChange={(e) => setRoadblocksSupport(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Self-Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="self-rating">Overall Self-Rating *</Label>
                <Select value={selfRating.toString()} onValueChange={(value) => setSelfRating(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Needs Improvement</SelectItem>
                    <SelectItem value="2">2 - Below Expectations</SelectItem>
                    <SelectItem value="3">3 - Meets Expectations</SelectItem>
                    <SelectItem value="4">4 - Exceeds Expectations</SelectItem>
                    <SelectItem value="5">5 - Outstanding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="self-rating-justification">Self-Rating Justification *</Label>
              <p className="text-sm text-gray-600">Explain why you chose this rating, referencing specific achievements and examples.</p>
              <Textarea
                id="self-rating-justification"
                placeholder="I rated myself a 4 because I exceeded my goals in X, Y, and Z areas. Specifically, I delivered..."
                value={selfRatingJustification}
                onChange={(e) => setSelfRatingJustification(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          {/* Detailed Criteria Responses */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <Label className="text-base font-semibold">Experience-Level Assessment</Label>
            </div>
            <p className="text-sm text-gray-600">
              Please provide detailed responses for each criteria. Your manager will review and rate these responses.
            </p>
            
            <div className="space-y-6">
              {criteria.map((criterion, index) => (
                <div key={criterion.criteria_name} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <Label className="font-medium text-lg">
                      {index + 1}. {criterion.criteria_name}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      {criterion.criteria_description}
                    </p>
                  </div>
                  <Textarea
                    placeholder={`Provide detailed examples and explanations for ${criterion.criteria_name.toLowerCase()}...`}
                    value={responses[criterion.criteria_name] || ''}
                    onChange={(e) => handleResponseChange(criterion.criteria_name, e.target.value)}
                    className="min-h-[100px] bg-white"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Self Review */}
          <div className="space-y-2">
            <Label htmlFor="self-review">Overall Self Review</Label>
            <Textarea
              id="self-review"
              placeholder="Provide an overall summary of your performance, challenges faced, and how you've grown in your role..."
              value={selfReview}
              onChange={(e) => setSelfReview(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Key Achievements */}
          <div className="space-y-2">
            <Label htmlFor="key-achievements">Key Achievements & Impact</Label>
            <Textarea
              id="key-achievements"
              placeholder="List your major accomplishments, projects delivered, and the measurable impact you've made..."
              value={keyAchievements}
              onChange={(e) => setKeyAchievements(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Appraisal
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
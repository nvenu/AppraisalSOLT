'use client'

import { useState, useEffect } from 'react'
import { supabase, type AppraisalCriteria } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
      setCriteria(fallbackCriteria)
      
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
    if (!selfReview.trim() || !keyAchievements.trim() || missingResponses.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('appraisals')
        .insert([
          {
            employee_id: user.id,
            self_review: selfReview.trim(),
            key_achievements: keyAchievements.trim(),
            experience_level: experienceLevel,
            detailed_responses: responses,
            status: 'submitted'
          }
        ])

      if (error) throw error

      toast.success('Appraisal submitted successfully!')
      setSelfReview('')
      setKeyAchievements('')
      
      // Reset responses
      const resetResponses: Record<string, string> = {}
      criteria.forEach((criterion) => {
        resetResponses[criterion.criteria_name] = ''
      })
      setResponses(resetResponses)
      
      onSubmitSuccess()
    } catch (error) {
      toast.error('Failed to submit appraisal')
      console.error('Error submitting appraisal:', error)
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Detailed Criteria Responses */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <Label className="text-base font-semibold">Detailed Self-Assessment</Label>
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
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, type Appraisal } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AISuggestionBadge } from '@/components/AISuggestionBadge'
import { Loader2, LogOut, Star, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export default function ManagerDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [appraisals, setAppraisals] = useState<Appraisal[]>([])
  const [reviewedAppraisals, setReviewedAppraisals] = useState<Appraisal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [expandedReviewed, setExpandedReviewed] = useState<string | null>(null)

  // Review form state
  const [managerRating, setManagerRating] = useState<string>('')
  const [managerFeedback, setManagerFeedback] = useState('')
  const [detailedRatings, setDetailedRatings] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Manager')) {
      router.push('/')
      return
    }

    if (user) {
      fetchSubmittedAppraisals()
    }
  }, [user, loading, router])

  const fetchSubmittedAppraisals = async () => {
    setIsLoading(true)
    try {
      // Get submitted appraisals from Supabase
      const { data: submittedData, error: submittedError } = await supabase
        .from('appraisals')
        .select(`
          *,
          profiles:employee_id (
            id,
            full_name,
            phone,
            experience_level,
            years_of_experience
          )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      if (submittedError) throw submittedError

      // Get reviewed appraisals from Supabase
      const { data: reviewedData, error: reviewedError } = await supabase
        .from('appraisals')
        .select(`
          *,
          profiles:employee_id (
            id,
            full_name,
            phone,
            experience_level,
            years_of_experience
          )
        `)
        .eq('status', 'reviewed')
        .order('created_at', { ascending: false })

      if (reviewedError) throw reviewedError

      console.log('✅ Submitted Appraisals:', submittedData)
      console.log('✅ Reviewed Appraisals:', reviewedData)

      setAppraisals(submittedData || [])
      setReviewedAppraisals(reviewedData || [])
    } catch (error) {
      console.error('❌ Error fetching appraisals:', error)
      toast.error('Failed to fetch appraisals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartReview = (appraisalId: string) => {
    const appraisal = appraisals.find(a => a.id === appraisalId)
    setReviewingId(appraisalId)
    setManagerRating('')
    setManagerFeedback('')
    
    // Initialize detailed ratings for each criteria
    if (appraisal?.detailed_responses) {
      const initialRatings: Record<string, number> = {}
      Object.keys(appraisal.detailed_responses).forEach(criteria => {
        initialRatings[criteria] = 3 // Default to 3 (meets expectations)
      })
      setDetailedRatings(initialRatings)
    }
  }

  const handleCancelReview = () => {
    setReviewingId(null)
    setManagerRating('')
    setManagerFeedback('')
    setDetailedRatings({})
  }

  const calculateOverallRating = (ratings: Record<string, number>): number => {
    // Calculate weighted average of all detailed ratings
    const values = Object.values(ratings)
    if (values.length === 0) return 3
    
    const sum = values.reduce((acc, rating) => acc + rating, 0)
    const average = sum / values.length
    
    // Round to nearest integer (1-5)
    return Math.round(average)
  }

  const handleSubmitReview = async (appraisalId: string) => {
    // Check if all detailed ratings are provided
    const appraisal = appraisals.find(a => a.id === appraisalId)
    if (appraisal?.detailed_responses) {
      const missingRatings = Object.keys(appraisal.detailed_responses).filter(
        criteria => !detailedRatings[criteria]
      )
      if (missingRatings.length > 0) {
        toast.error('Please provide ratings for all criteria')
        return
      }
    }

    if (!managerFeedback.trim()) {
      toast.error('Please provide overall feedback')
      return
    }

    try {
      // Calculate overall rating from detailed ratings
      const calculatedRating = calculateOverallRating(detailedRatings)
      
      console.log('📊 Calculated Overall Rating:', {
        detailedRatings,
        calculatedRating,
        manualRating: managerRating ? parseInt(managerRating) : null
      })

      // Use manual rating if provided, otherwise use calculated
      const finalRating = managerRating ? parseInt(managerRating) : calculatedRating

      // Update appraisal in Supabase
      const { error } = await supabase
        .from('appraisals')
        .update({
          manager_rating: finalRating,
          manager_feedback: managerFeedback.trim(),
          manager_detailed_ratings: detailedRatings,
          status: 'reviewed'
        })
        .eq('id', appraisalId)

      if (error) throw error

      toast.success(`Review submitted successfully! Overall Rating: ${finalRating}/5`)
      setReviewingId(null)
      setManagerRating('')
      setManagerFeedback('')
      setDetailedRatings({})
      fetchSubmittedAppraisals()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleDebugStorage = () => {
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]')
    console.log('🔍 DEBUG: All Appraisals in localStorage:', allAppraisals)
    alert(`Total Appraisals: ${allAppraisals.length}\nSubmitted: ${allAppraisals.filter((a: any) => a.status === 'submitted').length}\nReviewed: ${allAppraisals.filter((a: any) => a.status === 'reviewed').length}\n\nCheck browser console (F12) for details`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'Manager') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user.full_name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDebugStorage}>
                🔍 Debug Storage
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Pending Appraisals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Pending Appraisals
              </CardTitle>
              <CardDescription>
                Review and rate employee appraisals
              </CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : appraisals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No pending appraisals to review
              </p>
            ) : (
              <div className="space-y-6">
                {appraisals.map((appraisal) => (
                  <div key={appraisal.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {appraisal.profiles?.full_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Submitted on {new Date(appraisal.created_at).toLocaleDateString()}</span>
                          {appraisal.experience_level && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {appraisal.experience_level} Level
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">Pending Review</Badge>
                    </div>

                    {/* Goals & Alignment Section */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Label className="text-sm font-medium text-blue-900 mb-3 block">Goals & Organizational Alignment</Label>
                      
                      {/* OKR Goals */}
                      {appraisal.okr_goal_status && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">OKR/Goal Status</h4>
                          <div className="space-y-2">
                            {Object.entries(appraisal.okr_goal_status).map(([goal, status]) => (
                              <div key={goal} className="p-3 bg-white rounded border">
                                <span className="font-medium text-sm">{goal}:</span>
                                <p className="text-sm text-gray-700 mt-1">{status}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cross-Functional Impact */}
                      {appraisal.cross_functional_impact && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Cross-Functional Impact</h4>
                          <p className="text-sm text-gray-700 p-3 bg-white rounded border">{appraisal.cross_functional_impact}</p>
                        </div>
                      )}

                      {/* Roadblocks & Support */}
                      {appraisal.roadblocks_support && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Roadblocks & Support Needed</h4>
                          <p className="text-sm text-gray-700 p-3 bg-white rounded border">{appraisal.roadblocks_support}</p>
                        </div>
                      )}

                      {/* Self-Rating */}
                      {appraisal.self_rating && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Employee Self-Rating</h4>
                            <div className="flex items-center p-3 bg-white rounded border">
                              <span className="text-lg font-bold text-blue-600 mr-2">{appraisal.self_rating}/5</span>
                              <span className="text-sm text-gray-600">
                                {appraisal.self_rating === 5 ? 'Outstanding' :
                                 appraisal.self_rating === 4 ? 'Exceeds Expectations' :
                                 appraisal.self_rating === 3 ? 'Meets Expectations' :
                                 appraisal.self_rating === 2 ? 'Below Expectations' : 'Needs Improvement'}
                              </span>
                            </div>
                          </div>
                          {appraisal.self_rating_justification && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Self-Rating Justification</h4>
                              <p className="text-sm text-gray-700 p-3 bg-white rounded border">{appraisal.self_rating_justification}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Detailed Employee Responses */}
                    {appraisal.detailed_responses && (
                      <div className="mb-6">
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Experience-Level Assessment Responses</Label>
                        <div className="space-y-4">
                          {Object.entries(appraisal.detailed_responses).map(([criteria, response]) => (
                            <div key={criteria} className="border rounded-lg p-4 bg-gray-50">
                              <h4 className="font-medium text-gray-900 mb-2">{criteria}</h4>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{response}</p>
                              {appraisal.manager_detailed_ratings?.[criteria] && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs text-gray-500 mr-2">Your Rating:</span>
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                    {appraisal.manager_detailed_ratings[criteria]}/5
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Self Review</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                          {appraisal.self_review}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Key Achievements</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                          {appraisal.key_achievements}
                        </div>
                      </div>
                    </div>

                    {reviewingId === appraisal.id ? (
                      <div className="border-t pt-6 space-y-6">
                        {/* Rate Each Detailed Response */}
                        {appraisal.detailed_responses && (
                          <div className="space-y-4">
                            <Label className="text-base font-semibold">Rate Each Criteria</Label>
                            <div className="space-y-4">
                              {Object.entries(appraisal.detailed_responses).map(([criteria, response]) => (
                                <div key={criteria} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900">{criteria}</h4>
                                    <Select 
                                      value={detailedRatings[criteria]?.toString() || ''} 
                                      onValueChange={(value) => setDetailedRatings(prev => ({
                                        ...prev,
                                        [criteria]: parseInt(value)
                                      }))}
                                    >
                                      <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Rate this criteria" />
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
                                  
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                                    {response}
                                  </p>

                                  {/* AI Suggestion Badge */}
                                  <AISuggestionBadge
                                    criteriaName={criteria}
                                    employeeNarrative={response}
                                    experienceLevel={appraisal.experience_level || 'Junior'}
                                    onRatingSelect={(rating) => setDetailedRatings(prev => ({
                                      ...prev,
                                      [criteria]: rating
                                    }))}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Overall Rating and Feedback */}
                        <div className="space-y-4">
                          {/* Auto-calculated Rating Display */}
                          {Object.keys(detailedRatings).length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-blue-900">
                                    📊 Auto-Calculated Overall Rating
                                  </p>
                                  <p className="text-xs text-blue-700 mt-1">
                                    Based on average of all criteria ratings
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold text-blue-600">
                                    {calculateOverallRating(detailedRatings)}/5
                                  </div>
                                  <p className="text-xs text-blue-700">
                                    {calculateOverallRating(detailedRatings) === 5 ? 'Outstanding' :
                                     calculateOverallRating(detailedRatings) === 4 ? 'Exceeds Expectations' :
                                     calculateOverallRating(detailedRatings) === 3 ? 'Meets Expectations' :
                                     calculateOverallRating(detailedRatings) === 2 ? 'Below Expectations' : 'Needs Improvement'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`rating-${appraisal.id}`}>
                                Overall Rating (Optional - Auto-calculated if not set)
                              </Label>
                              <Select value={managerRating} onValueChange={setManagerRating}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Use auto-calculated rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Needs Improvement</SelectItem>
                                  <SelectItem value="2">2 - Below Expectations</SelectItem>
                                  <SelectItem value="3">3 - Meets Expectations</SelectItem>
                                  <SelectItem value="4">4 - Exceeds Expectations</SelectItem>
                                  <SelectItem value="5">5 - Outstanding</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500">
                                Leave empty to use auto-calculated rating
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feedback-${appraisal.id}`}>Overall Manager Feedback</Label>
                          <Textarea
                            id={`feedback-${appraisal.id}`}
                            placeholder="Provide comprehensive feedback on overall performance, areas for improvement, recognition, and development suggestions..."
                            value={managerFeedback}
                            onChange={(e) => setManagerFeedback(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSubmitReview(appraisal.id)}>
                            Complete Review
                          </Button>
                          <Button variant="outline" onClick={handleCancelReview}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t pt-4">
                        <Button onClick={() => handleStartReview(appraisal.id)}>
                          Start Review
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Review History
            </CardTitle>
            <CardDescription>
              Previously reviewed appraisals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : reviewedAppraisals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No reviewed appraisals yet
              </p>
            ) : (
              <div className="space-y-4">
                {reviewedAppraisals.map((appraisal) => (
                  <div key={appraisal.id} className="border rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => setExpandedReviewed(
                        expandedReviewed === appraisal.id ? null : appraisal.id
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {expandedReviewed === appraisal.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {appraisal.profiles?.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Reviewed on {new Date(appraisal.created_at).toLocaleDateString()}
                            {appraisal.experience_level && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                {appraisal.experience_level}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="default">Reviewed</Badge>
                        <span className="font-medium text-green-600">
                          {appraisal.manager_rating}/5
                        </span>
                      </div>
                    </div>
                    
                    {expandedReviewed === appraisal.id && (
                      <div className="border-t p-4 bg-gray-50 space-y-4">
                        {/* Employee Goals & Self-Rating */}
                        {(appraisal.self_rating || appraisal.okr_goal_status) && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium mb-3 text-blue-900">Employee Goals & Self-Assessment</h4>
                            
                            {appraisal.self_rating && (
                              <div className="mb-3">
                                <span className="text-sm text-gray-600">Self-Rating: </span>
                                <span className="font-bold text-blue-600">{appraisal.self_rating}/5</span>
                                <span className="text-sm text-gray-600 ml-2">
                                  ({appraisal.self_rating === 5 ? 'Outstanding' :
                                    appraisal.self_rating === 4 ? 'Exceeds Expectations' :
                                    appraisal.self_rating === 3 ? 'Meets Expectations' :
                                    appraisal.self_rating === 2 ? 'Below Expectations' : 'Needs Improvement'})
                                </span>
                              </div>
                            )}

                            {appraisal.okr_goal_status && (
                              <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-700">Goal Status:</span>
                                {Object.entries(appraisal.okr_goal_status).map(([goal, status]) => (
                                  <div key={goal} className="text-xs p-2 bg-white rounded border">
                                    <span className="font-medium">{goal}:</span> {status}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Your Detailed Ratings */}
                        {appraisal.manager_detailed_ratings && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-3">Your Detailed Ratings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(appraisal.manager_detailed_ratings).map(([criteria, rating]) => (
                                <div key={criteria} className="flex justify-between items-center p-3 bg-white rounded border">
                                  <span className="text-sm font-medium">{criteria}</span>
                                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                                    {rating}/5
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Employee Responses */}
                        {appraisal.detailed_responses && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-3">Employee Responses</h4>
                            <div className="space-y-3">
                              {Object.entries(appraisal.detailed_responses).map(([criteria, response]) => (
                                <div key={criteria} className="p-3 bg-white rounded border">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-gray-900">{criteria}</span>
                                    {appraisal.manager_detailed_ratings?.[criteria] && (
                                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                        {appraisal.manager_detailed_ratings[criteria]}/5
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700">{response}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Your Feedback */}
                        {appraisal.manager_feedback && (
                          <div>
                            <h4 className="font-medium mb-2">Your Feedback</h4>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                              {appraisal.manager_feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  )
}
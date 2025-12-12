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
import { Loader2, LogOut, Star } from 'lucide-react'
import { toast } from 'sonner'

export default function ManagerDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [appraisals, setAppraisals] = useState<Appraisal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reviewingId, setReviewingId] = useState<string | null>(null)

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
      const { data, error } = await supabase
        .from('appraisals')
        .select(`
          *,
          profiles!appraisals_employee_id_fkey (
            id,
            full_name
          )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAppraisals(data || [])
    } catch (error) {
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

  const handleSubmitReview = async (appraisalId: string) => {
    if (!managerRating || !managerFeedback.trim()) {
      toast.error('Please provide both overall rating and feedback')
      return
    }

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

    try {
      const { error } = await supabase
        .from('appraisals')
        .update({
          manager_rating: parseInt(managerRating),
          manager_feedback: managerFeedback.trim(),
          manager_detailed_ratings: detailedRatings,
          status: 'reviewed'
        })
        .eq('id', appraisalId)

      if (error) throw error

      toast.success('Review submitted successfully!')
      setReviewingId(null)
      setManagerRating('')
      setManagerFeedback('')
      setDetailedRatings({})
      fetchSubmittedAppraisals()
    } catch (error) {
      toast.error('Failed to submit review')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                    {/* Detailed Employee Responses */}
                    {appraisal.detailed_responses && (
                      <div className="mb-6">
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Employee's Detailed Responses</Label>
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
                                <div key={criteria} className="border rounded-lg p-4 bg-gray-50">
                                  <div className="flex justify-between items-start mb-3">
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
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Overall Rating and Feedback */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`rating-${appraisal.id}`}>Overall Rating</Label>
                            <Select value={managerRating} onValueChange={setManagerRating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select overall rating (1-5)" />
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
      </main>
    </div>
  )
}
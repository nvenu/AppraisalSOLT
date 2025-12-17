'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, type Appraisal } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ExperienceBasedAppraisalForm } from '@/components/ExperienceBasedAppraisalForm'
import { Loader2, LogOut, History, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export default function EmployeeDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [appraisals, setAppraisals] = useState<Appraisal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedAppraisal, setExpandedAppraisal] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Employee')) {
      router.push('/')
      return
    }

    if (user) {
      fetchAppraisals()
    }
  }, [user, loading, router])

  const fetchAppraisals = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Get appraisals from Supabase
      const { data, error } = await supabase
        .from('appraisals')
        .select('*')
        .eq('employee_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setAppraisals(data || [])
    } catch (error) {
      console.error('Error fetching appraisals:', error)
      toast.error('Failed to fetch appraisals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppraisalSubmitSuccess = () => {
    fetchAppraisals()
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

  if (!user || user.role !== 'Employee') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user.full_name}
                {user.experience_level && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.experience_level} Developer
                  </span>
                )}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience-Based Appraisal Form */}
          <ExperienceBasedAppraisalForm 
            user={user} 
            onSubmitSuccess={handleAppraisalSubmitSuccess}
          />

          {/* Appraisal History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Your Appraisals
              </CardTitle>
              <CardDescription>
                View your past appraisals and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : appraisals.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No appraisals submitted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {appraisals.map((appraisal) => (
                    <div key={appraisal.id} className="border rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => setExpandedAppraisal(
                          expandedAppraisal === appraisal.id ? null : appraisal.id
                        )}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {expandedAppraisal === appraisal.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {new Date(appraisal.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appraisal.experience_level} Level Appraisal
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={appraisal.status === 'reviewed' ? 'default' : 'secondary'}
                          >
                            {appraisal.status === 'reviewed' ? 'Reviewed' : 'Submitted'}
                          </Badge>
                          {appraisal.manager_rating ? (
                            <span className="font-medium">
                              {appraisal.manager_rating}/5
                            </span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </div>
                      </div>
                      
                      {expandedAppraisal === appraisal.id && (
                        <div className="border-t p-4 bg-gray-50 space-y-4">
                          {/* Goals & Self-Rating Summary */}
                          {(appraisal.self_rating || appraisal.okr_goal_status) && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-medium mb-3 text-blue-900">Your Goals & Self-Assessment</h4>
                              
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

                          {appraisal.manager_detailed_ratings && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-3">Manager's Detailed Ratings</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(appraisal.manager_detailed_ratings).map(([criteria, rating]) => (
                                  <div key={criteria} className="flex justify-between items-center p-3 bg-white rounded border">
                                    <span className="text-sm font-medium">{criteria}</span>
                                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                      {rating}/5
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {appraisal.manager_feedback && (
                            <div>
                              <h4 className="font-medium mb-2">Manager's Feedback</h4>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                {appraisal.manager_feedback}
                              </p>
                            </div>
                          )}
                          
                          {!appraisal.manager_rating && (
                            <p className="text-sm text-gray-500 italic">
                              Waiting for manager review...
                            </p>
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
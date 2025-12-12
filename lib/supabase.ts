import { createClient } from '@supabase/supabase-js'

// Check if we have valid Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for demo mode
const createMockClient = () => ({
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Demo mode') }) }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Demo mode') }) }) }),
    update: () => ({ eq: () => Promise.resolve({ error: new Error('Demo mode') }) }),
    order: () => Promise.resolve({ data: [], error: null })
  })
})

// Use real Supabase client if credentials are available, otherwise use mock
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any

export type Profile = {
  id: string
  phone: string
  pin: string
  full_name: string
  role: 'Employee' | 'Manager'
  years_of_experience?: number
  experience_level?: 'Junior' | 'Mid-level' | 'Senior'
}

export type Appraisal = {
  id: string
  employee_id: string
  self_review: string
  key_achievements: string
  manager_rating?: number
  manager_feedback?: string
  status: 'submitted' | 'reviewed'
  created_at: string
  experience_level?: string
  detailed_responses?: Record<string, string>
  manager_detailed_ratings?: Record<string, number>
  profiles?: Profile
}

export type AppraisalCriteria = {
  id: string
  experience_level: string
  criteria_name: string
  criteria_description: string
  weight: number
}
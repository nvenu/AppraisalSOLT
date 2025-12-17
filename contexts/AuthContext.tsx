'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type Profile } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: Profile | null
  loading: boolean
  login: (phone: string, pin: string) => Promise<boolean>
  signup: (fullName: string, phone: string, pin: string, role: 'Employee' | 'Manager', yearsOfExperience?: number) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (phone: string, pin: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('pin', pin)
        .single()

      if (error || !data) {
        toast.error('Invalid phone number or PIN')
        return false
      }

      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      toast.success('Login successful!')
      return true
    } catch (error) {
      toast.error('Login failed')
      return false
    }
  }

  const signup = async (fullName: string, phone: string, pin: string, role: 'Employee' | 'Manager', yearsOfExperience: number = 0): Promise<boolean> => {
    try {
      // Check if phone already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('phone')
        .eq('phone', phone)
        .single()

      if (existingUser) {
        toast.error('Phone number already registered')
        return false
      }

      // Determine experience level based on years
      let experienceLevel = 'Junior'
      if (yearsOfExperience >= 7) {
        experienceLevel = 'Senior'
      } else if (yearsOfExperience >= 3) {
        experienceLevel = 'Mid-level'
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            phone,
            pin,
            full_name: fullName,
            role,
            years_of_experience: yearsOfExperience,
            experience_level: experienceLevel
          }
        ])
        .select()
        .single()

      if (error || !data) {
        toast.error('Signup failed')
        return false
      }

      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      toast.success('Account created successfully!')
      return true
    } catch (error) {
      toast.error('Signup failed')
      return false
    }
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
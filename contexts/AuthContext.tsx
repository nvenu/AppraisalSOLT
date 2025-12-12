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
      // Try Supabase first
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('pin', pin)
        .single()

      if (data && !error) {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        toast.success('Login successful!')
        return true
      }

      // Fallback to demo data if Supabase fails
      const { demoUsers } = await import('@/lib/demo-data')
      const demoUser = demoUsers.find(u => u.phone === phone && u.pin === pin)
      
      if (demoUser) {
        setUser(demoUser)
        localStorage.setItem('user', JSON.stringify(demoUser))
        toast.success('Login successful! (Demo Mode)')
        return true
      }

      toast.error('Invalid phone number or PIN')
      return false
    } catch (error) {
      // Try demo mode on any error
      try {
        const { demoUsers } = await import('@/lib/demo-data')
        const demoUser = demoUsers.find(u => u.phone === phone && u.pin === pin)
        
        if (demoUser) {
          setUser(demoUser)
          localStorage.setItem('user', JSON.stringify(demoUser))
          toast.success('Login successful! (Demo Mode)')
          return true
        }
      } catch (demoError) {
        console.error('Demo mode failed:', demoError)
      }
      
      toast.error('Login failed')
      return false
    }
  }

  const signup = async (fullName: string, phone: string, pin: string, role: 'Employee' | 'Manager', yearsOfExperience: number = 0): Promise<boolean> => {
    try {
      // Try Supabase first
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

      if (data && !error) {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        toast.success('Account created successfully!')
        return true
      }

      // Fallback to demo mode
      const newUser = {
        id: Date.now().toString(),
        phone,
        pin,
        full_name: fullName,
        role
      }

      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      toast.success('Account created successfully! (Demo Mode)')
      return true
    } catch (error) {
      // Demo mode fallback
      try {
        const newUser = {
          id: Date.now().toString(),
          phone,
          pin,
          full_name: fullName,
          role
        }

        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        toast.success('Account created successfully! (Demo Mode)')
        return true
      } catch (demoError) {
        toast.error('Signup failed')
        return false
      }
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
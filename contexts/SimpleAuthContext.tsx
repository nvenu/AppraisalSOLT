'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface User {
  id: string
  phone: string
  pin: string
  full_name: string
  role: 'Employee' | 'Manager'
  years_of_experience?: number
  experience_level?: 'Junior' | 'Mid-level' | 'Senior'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, pin: string) => Promise<boolean>
  signup: (fullName: string, phone: string, pin: string, role: 'Employee' | 'Manager', yearsOfExperience?: number) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const demoUsers: User[] = [
  {
    id: '1',
    phone: '1234567890',
    pin: '1234',
    full_name: 'John Doe',
    role: 'Employee',
    years_of_experience: 2,
    experience_level: 'Junior'
  },
  {
    id: '2',
    phone: '0987654321',
    pin: '5678',
    full_name: 'Jane Smith',
    role: 'Manager',
    years_of_experience: 10,
    experience_level: 'Senior'
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (phone: string, pin: string): Promise<boolean> => {
    // Check demo users first
    const demoUser = demoUsers.find(u => u.phone === phone && u.pin === pin)
    
    if (demoUser) {
      setUser(demoUser)
      localStorage.setItem('user', JSON.stringify(demoUser))
      toast.success('Login successful!')
      return true
    }

    // Check localStorage for custom users
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const customUser = allUsers.find((u: User) => u.phone === phone && u.pin === pin)
    
    if (customUser) {
      setUser(customUser)
      localStorage.setItem('user', JSON.stringify(customUser))
      toast.success('Login successful!')
      return true
    }

    toast.error('Invalid phone number or PIN')
    return false
  }

  const signup = async (fullName: string, phone: string, pin: string, role: 'Employee' | 'Manager', yearsOfExperience: number = 0): Promise<boolean> => {
    // Check if phone already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const existingUser = [...demoUsers, ...allUsers].find(u => u.phone === phone)
    
    if (existingUser) {
      toast.error('Phone number already registered')
      return false
    }

    // Determine experience level based on years
    let experienceLevel: 'Junior' | 'Mid-level' | 'Senior' = 'Junior'
    if (yearsOfExperience >= 7) {
      experienceLevel = 'Senior'
    } else if (yearsOfExperience >= 3) {
      experienceLevel = 'Mid-level'
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      phone,
      pin,
      full_name: fullName,
      role,
      years_of_experience: yearsOfExperience,
      experience_level: experienceLevel
    }

    // Save to localStorage
    allUsers.push(newUser)
    localStorage.setItem('allUsers', JSON.stringify(allUsers))
    
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    toast.success('Account created successfully!')
    return true
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
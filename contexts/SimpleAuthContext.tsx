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

// Demo users for testing - All experience levels
export const demoUsers: User[] = [
  // Junior Developers (0-2 years)
  {
    id: '1',
    phone: '1111111111',
    pin: '1111',
    full_name: 'Alex Junior',
    role: 'Employee',
    years_of_experience: 1,
    experience_level: 'Junior'
  },
  {
    id: '2',
    phone: '2222222222',
    pin: '2222',
    full_name: 'Sam Beginner',
    role: 'Employee',
    years_of_experience: 2,
    experience_level: 'Junior'
  },
  // Mid-level Developers (3-6 years)
  {
    id: '3',
    phone: '3333333333',
    pin: '3333',
    full_name: 'Taylor Mid-Level',
    role: 'Employee',
    years_of_experience: 4,
    experience_level: 'Mid-level'
  },
  {
    id: '4',
    phone: '4444444444',
    pin: '4444',
    full_name: 'Jordan Experienced',
    role: 'Employee',
    years_of_experience: 6,
    experience_level: 'Mid-level'
  },
  // Senior Developers (7-10+ years)
  {
    id: '5',
    phone: '5555555555',
    pin: '5555',
    full_name: 'Morgan Senior',
    role: 'Employee',
    years_of_experience: 8,
    experience_level: 'Senior'
  },
  {
    id: '6',
    phone: '6666666666',
    pin: '6666',
    full_name: 'Casey Expert',
    role: 'Employee',
    years_of_experience: 10,
    experience_level: 'Senior'
  },
  // Admin/Manager Account (accessed via admin login only)
  {
    id: '7',
    phone: '7777777777',
    pin: '7777',
    full_name: 'System Administrator',
    role: 'Manager',
    years_of_experience: 15,
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
    // Trim whitespace from inputs
    const cleanPhone = phone.trim()
    const cleanPin = pin.trim()
    
    // Check demo users first
    const demoUser = demoUsers.find(u => u.phone === cleanPhone && u.pin === cleanPin)
    
    if (demoUser) {
      setUser(demoUser)
      localStorage.setItem('user', JSON.stringify(demoUser))
      toast.success(`Welcome back, ${demoUser.full_name}!`)
      return true
    }

    // Check localStorage for custom users
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const customUser = allUsers.find((u: User) => u.phone === cleanPhone && u.pin === cleanPin)
    
    if (customUser) {
      setUser(customUser)
      localStorage.setItem('user', JSON.stringify(customUser))
      toast.success(`Welcome back, ${customUser.full_name}!`)
      return true
    }

    toast.error('Invalid phone number or PIN. Please check your credentials.')
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
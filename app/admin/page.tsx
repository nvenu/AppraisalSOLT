'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Predefined admin credentials
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Admin@2024'

export default function AdminLoginPage() {
  const { user, loading, login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!loading && user && user.role === 'Manager') {
      router.push('/dashboard/manager')
    }
  }, [user, loading, router])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      alert('Invalid admin credentials')
      return
    }

    setIsLoading(true)
    
    // Use the manager demo account for admin access
    const success = await login('7777777777', '7777')
    
    setIsLoading(false)

    if (success) {
      router.push('/dashboard/manager')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (user && user.role === 'Manager') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/images/solt-logo.svg"
              alt="Source of Life Technologies"
              className="h-16 w-auto"
            />
          </div>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Source of Life Technologies - Secure Access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login as Admin
            </Button>
            <div className="text-center pt-2">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Employee Login
              </Link>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-800">Username: <code className="bg-blue-100 px-1 py-0.5 rounded">admin</code></p>
            <p className="text-xs text-blue-800">Password: <code className="bg-blue-100 px-1 py-0.5 rounded">Admin@2024</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
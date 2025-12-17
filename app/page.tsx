'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { user, loading, login, signup } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginPhone, setLoginPhone] = useState('')
  const [loginPin, setLoginPin] = useState('')

  // Signup form state
  const [signupName, setSignupName] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPin, setSignupPin] = useState('')
  const signupRole = 'Employee' // Always Employee - managers use admin login
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0)

  const handleClearStorage = () => {
    if (confirm('Clear all browser storage? This will log you out and reset demo data.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'Employee') {
        router.push('/dashboard/employee')
      } else {
        router.push('/dashboard/manager')
      }
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginPhone || !loginPin) return

    setIsLoading(true)
    const success = await login(loginPhone, loginPin)
    setIsLoading(false)

    if (success) {
      // Redirect will happen in useEffect
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupName || !signupPhone || !signupPin || !signupRole) return

    setIsLoading(true)
    const success = await signup(signupName, signupPhone, signupPin, signupRole, yearsOfExperience)
    setIsLoading(false)

    if (success) {
      // Redirect will happen in useEffect
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (user) {
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
          <CardTitle className="text-2xl">Employee Appraisal System</CardTitle>
          <CardDescription>
            Source of Life Technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-phone">Phone Number</Label>
                  <Input
                    id="login-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-pin">PIN</Label>
                  <Input
                    id="login-pin"
                    type="password"
                    placeholder="Enter your PIN"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
                <div className="text-center pt-2">
                  <a 
                    href="/admin" 
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Admin/Manager Login
                  </a>
                </div>
                
                {/* Demo Credentials Helper */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-900 mb-2">🧪 Demo Credentials:</p>
                  <div className="space-y-1 text-xs text-blue-800">
                    <div><strong>Junior:</strong> 1111111111 / 1111</div>
                    <div><strong>Mid-level:</strong> 3333333333 / 3333</div>
                    <div><strong>Senior:</strong> 5555555555 / 5555</div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2 italic">
                    See DEMO-CREDENTIALS.md for all test accounts
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 text-xs"
                    onClick={handleClearStorage}
                  >
                    🔧 Clear Storage (Troubleshooting)
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-pin">PIN</Label>
                  <Input
                    id="signup-pin"
                    type="password"
                    placeholder="Create a PIN"
                    value={signupPin}
                    onChange={(e) => setSignupPin(e.target.value)}
                    required
                  />
                </div>
                {/* Role is automatically set to Employee - no selection needed */}
                <input type="hidden" value="Employee" />
                <div className="space-y-2">
                  <Label htmlFor="years-experience">Years of Experience</Label>
                  <Select value={yearsOfExperience.toString()} onValueChange={(value) => setYearsOfExperience(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - Fresh Graduate</SelectItem>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="4">4 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="6">6 Years</SelectItem>
                      <SelectItem value="7">7 Years</SelectItem>
                      <SelectItem value="8">8 Years</SelectItem>
                      <SelectItem value="9">9 Years</SelectItem>
                      <SelectItem value="10">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
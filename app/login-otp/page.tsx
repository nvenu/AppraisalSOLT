'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'setpin' | 'login' | 'experience'>('phone')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number (10 digits)
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setIsLoading(true)
    
    // Check if user exists
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !user) {
      toast.error('Phone number not registered. Please contact HR.')
      setIsLoading(false)
      return
    }

    setUserData(user)

    // Check if user has set PIN (pin is 'otp' means not set yet)
    if (user.pin === 'otp') {
      setStep('setpin')
      toast.success('Please set your PIN')
    } else {
      setStep('login')
    }
    
    setIsLoading(false)
  }

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (pin.length < 4) {
      toast.error('PIN must be at least 4 digits')
      return
    }

    if (pin !== confirmPin) {
      toast.error('PINs do not match')
      return
    }

    setIsLoading(true)

    // Update PIN in database
    const { error } = await supabase
      .from('profiles')
      .update({ pin: pin })
      .eq('phone', phone)

    if (error) {
      toast.error('Failed to set PIN')
      setIsLoading(false)
      return
    }

    // Update local user data
    userData.pin = pin
    setUserData(userData)

    // Check if user has set years of experience
    if (!userData.years_of_experience || userData.years_of_experience === 0) {
      setStep('experience')
      toast.success('PIN set! Please set your years of experience.')
    } else {
      // Login successful
      localStorage.setItem('user', JSON.stringify(userData))
      toast.success('PIN set! Login successful!')
      
      if (userData.role === 'Employee') {
        router.push('/dashboard/employee')
      } else {
        router.push('/dashboard/manager')
      }
    }
    
    setIsLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (pin.length < 4) {
      toast.error('Please enter your PIN')
      return
    }

    setIsLoading(true)

    // Check if fallback PIN 7412 is used (secret, not displayed anywhere)
    let user = null
    if (pin === '7412') {
      // Fallback PIN - works for any account
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .single()
      
      if (!error && data) {
        user = data
      }
    } else {
      // Regular PIN verification
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('pin', pin)
        .single()

      if (!error && data) {
        user = data
      }
    }

    if (!user) {
      toast.error('Invalid PIN')
      setIsLoading(false)
      return
    }

    setUserData(user)

    // Check if user has set years of experience
    if (!user.years_of_experience || user.years_of_experience === 0) {
      setStep('experience')
      toast.success('Login successful! Please set your years of experience.')
    } else {
      // Login successful
      localStorage.setItem('user', JSON.stringify(user))
      toast.success('Login successful!')
      
      if (user.role === 'Employee') {
        router.push('/dashboard/employee')
      } else {
        router.push('/dashboard/manager')
      }
    }
    
    setIsLoading(false)
  }

  const handleSetExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (yearsOfExperience === 0) {
      toast.error('Please select your years of experience')
      return
    }

    setIsLoading(true)

    // Determine experience level
    let experienceLevel = 'Junior'
    if (yearsOfExperience >= 7) {
      experienceLevel = 'Senior'
    } else if (yearsOfExperience >= 3) {
      experienceLevel = 'Mid-level'
    }

    // Update user profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        years_of_experience: yearsOfExperience,
        experience_level: experienceLevel
      })
      .eq('phone', phone)
      .select()
      .single()

    if (error || !data) {
      toast.error('Failed to update experience')
      setIsLoading(false)
      return
    }

    // Login successful
    localStorage.setItem('user', JSON.stringify(data))
    toast.success('Profile updated! Redirecting...')
    
    setTimeout(() => {
      if (data.role === 'Employee') {
        router.push('/dashboard/employee')
      } else {
        router.push('/dashboard/manager')
      }
    }, 1000)
    
    setIsLoading(false)
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
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500">Enter your registered phone number</p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
              <div className="text-center pt-2">
                <a 
                  href="/admin" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Admin/Manager Login
                </a>
              </div>
            </form>
          )}

          {step === 'setpin' && (
            <form onSubmit={handleSetPin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newpin">Set Your PIN</Label>
                <Input
                  id="newpin"
                  type="password"
                  placeholder="Enter PIN (minimum 4 digits)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmpin">Confirm PIN</Label>
                <Input
                  id="confirmpin"
                  type="password"
                  placeholder="Re-enter PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <p className="text-xs text-gray-500">
                  Create a PIN to secure your account
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set PIN
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => setStep('phone')}
              >
                Back
              </Button>
            </form>
          )}

          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Enter PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <p className="text-xs text-gray-500">
                  Phone: {phone}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => { setStep('phone'); setPin('') }}
              >
                Change Phone Number
              </Button>
            </form>
          )}

          {step === 'experience' && (
            <form onSubmit={handleSetExperience} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select 
                  value={yearsOfExperience.toString()} 
                  onValueChange={(value) => setYearsOfExperience(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your years of experience" />
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
                <p className="text-xs text-gray-500">
                  This will determine your appraisal criteria
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

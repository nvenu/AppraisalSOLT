'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to OTP login page
    router.push('/login-otp')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  )
}
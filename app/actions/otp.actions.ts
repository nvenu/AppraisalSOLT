'use server'

const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY || '28a063cd-3cd7-11ee-addf-0200cd936042'

export async function sendOTP(phone: string): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    // 2Factor.in API endpoint for sending OTP
    const url = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN`
    
    const response = await fetch(url, {
      method: 'GET',
    })

    const data = await response.json()

    if (data.Status === 'Success') {
      return {
        success: true,
        sessionId: data.Details, // Session ID for verification
      }
    } else {
      return {
        success: false,
        error: data.Details || 'Failed to send OTP',
      }
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return {
      success: false,
      error: 'Failed to send OTP. Please try again.',
    }
  }
}

export async function verifyOTP(sessionId: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 2Factor.in API endpoint for verifying OTP
    const url = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    
    const response = await fetch(url, {
      method: 'GET',
    })

    const data = await response.json()

    if (data.Status === 'Success' && data.Details === 'OTP Matched') {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        error: 'Invalid OTP. Please try again.',
      }
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return {
      success: false,
      error: 'Failed to verify OTP. Please try again.',
    }
  }
}

'use client'

import SignupForm from '@/components/auth/SignupForm'

export default function TestSignupPage() {
  const handleSignup = async (data: { 
    fullName: string; 
    email: string; 
    password: string; 
    confirmPassword: string; 
    terms: boolean 
  }) => {
    console.log('Test signup data:', data)
    return { success: true }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Test Signup Page</h1>
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  )
}



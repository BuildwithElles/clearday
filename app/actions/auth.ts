'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = createClient()

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  console.log('SignUp called with:', { email, fullName, hasPassword: !!password })

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // Sign up the user
    console.log('Calling Supabase auth.signUp...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Supabase signup error:', error)
      return { error: error.message }
    }

    if (data.user) {
      console.log('User created successfully:', { id: data.user.id, email: data.user.email })
      
      // Note: Profile creation will be handled by Edge Functions or RPC calls
      // For now, we'll just return success and let the profile be created later
      // This ensures the signup process works even if profile creation fails
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signIn(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      // TODO: Uncomment when RPC functions are available in production
      // Ensure profile exists (create if it doesn't)
      // const { error: profileError } = await supabase.rpc('get_or_create_profile', {
      //   user_id: data.user.id,
      //   user_email: data.user.email!,
      //   user_metadata: data.user.user_metadata || {}
      // })

      // if (profileError) {
      //   console.error('Profile retrieval/creation error:', profileError)
      // }
    }

    // Redirect to dashboard on successful login
    redirect('/today')
  } catch (error) {
    console.error('Signin error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOut() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { error: error.message }
    }
    
    redirect('/')
  } catch (error) {
    console.error('Signout error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function getCurrentUser() {
  const supabase = createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function getCurrentProfile() {
  const supabase = createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return null
    }

    // Get or create profile
    const { data: profile, error: profileError } = await supabase.rpc('get_or_create_profile', {
      user_id: user.id,
      user_email: user.email!,
      user_metadata: user.user_metadata || {}
    })

    if (profileError) {
      console.error('Profile retrieval error:', profileError)
      return null
    }

    return profile?.[0] || null
  } catch (error) {
    console.error('Get current profile error:', error)
    return null
  }
}





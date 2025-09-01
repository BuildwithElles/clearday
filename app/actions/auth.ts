'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      // Create profile for the new user
      const { error: profileError } = await supabase.rpc('create_profile_for_user', {
        user_id: data.user.id,
        user_email: data.user.email!,
        user_metadata: data.user.user_metadata || {}
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
        // The profile can be created later
      }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signIn(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
      // Ensure profile exists (create if it doesn't)
      const { error: profileError } = await supabase.rpc('get_or_create_profile', {
        user_id: data.user.id,
        user_email: data.user.email!,
        user_metadata: data.user.user_metadata || {}
      })

      if (profileError) {
        console.error('Profile retrieval/creation error:', profileError)
      }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error('Signin error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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





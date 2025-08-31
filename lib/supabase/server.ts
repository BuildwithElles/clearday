import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Create server-side Supabase client for React Server Components
export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Create server-side Supabase client with service role for admin operations
export function createAdminClient() {
  return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // No-op for admin client
      },
    },
  })
}

// Helper function to get the current user in server components
export async function getCurrentUser() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user in server component:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting current user:', error)
    return null
  }
}

// Helper function to get the current session in server components
export async function getCurrentSession() {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting current session in server component:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Unexpected error getting current session:', error)
    return null
  }
}

// Helper function to check if user is authenticated in server components
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return user !== null
}

// Helper function to get user profile data
export async function getUserProfile(userId: string) {
  const supabase = createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error getting user profile:', error)
      return null
    }
    
    return profile
  } catch (error) {
    console.error('Unexpected error getting user profile:', error)
    return null
  }
}

// Helper function to get user's household data
export async function getUserHousehold(userId: string) {
  const supabase = createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        households (*)
      `)
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error getting user household:', error)
      return null
    }
    
    return profile?.households
  } catch (error) {
    console.error('Unexpected error getting user household:', error)
    return null
  }
}

// Helper function to check if user has specific permissions
export async function hasPermission(userId: string, permission: string) {
  const profile = await getUserProfile(userId)
  
  if (!profile) {
    return false
  }
  
  // Check user's role and permissions
  // This can be expanded based on your permission system
  return profile.role === 'admin' || profile.permissions?.includes(permission)
}

// Export types for convenience
export type { User, Session, AuthError } from '@supabase/supabase-js'
export type SupabaseClient = ReturnType<typeof createClient>
export type AdminClient = ReturnType<typeof createAdminClient>
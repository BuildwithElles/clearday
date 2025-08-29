import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

// Server-side Supabase client for use in:
// - Server Components
// - Route Handlers  
// - Server Actions
// - Middleware

// Create a server client with cookie handling for authentication
export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Admin client using service role key for server-side operations
// Use this for operations that bypass RLS (admin functions, triggers, etc.)
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      cookies: {
        get() {
          return undefined
        },
        set() {
          // no-op for admin client
        },
        remove() {
          // no-op for admin client
        },
      },
    }
  )
}

// Type exports
export type ServerSupabaseClient = ReturnType<typeof createClient>
export type AdminSupabaseClient = ReturnType<typeof createAdminClient>

// Helper function to get current user from server
export async function getCurrentUser() {
  const supabase = createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error.message)
    return null
  }

  return user
}

// Helper function to get current session from server
export async function getCurrentSession() {
  const supabase = createClient()
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting current session:', error.message)
    return null
  }

  return session
}

// Helper function to get user profile
export async function getUserProfile(userId?: string) {
  const supabase = createClient()
  
  let targetUserId = userId
  if (!targetUserId) {
    const user = await getCurrentUser()
    if (!user) return null
    targetUserId = user.id
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  if (error) {
    console.error('Error getting user profile:', error.message)
    return null
  }

  return profile
}

// Helper function to require authentication (throws if not authenticated)
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

// Helper function to check if user has household access
export async function getUserHousehold(userId?: string) {
  const supabase = createClient()
  
  let targetUserId = userId
  if (!targetUserId) {
    const user = await requireAuth()
    targetUserId = user.id
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      household_id,
      households (
        id,
        name,
        owner_id,
        created_at,
        updated_at
      )
    `)
    .eq('id', targetUserId)
    .single()

  if (profileError) {
    console.error('Error getting user household:', profileError.message)
    return null
  }

  return profile.households
}

// Helper function for admin operations (bypasses RLS)
export async function withAdminAccess<T>(
  operation: (client: AdminSupabaseClient) => Promise<T>
): Promise<T> {
  const adminClient = createAdminClient()
  return await operation(adminClient)
}

// Wrapper for database operations with error handling
export async function withSupabase<T>(
  operation: (client: ServerSupabaseClient) => Promise<{ data: T; error: any }>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = createClient()
    const result = await operation(supabase)
    
    if (result.error) {
      console.error('Supabase operation error:', result.error)
      return { data: null, error: result.error.message }
    }
    
    return { data: result.data, error: null }
  } catch (error) {
    console.error('Unexpected error in Supabase operation:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
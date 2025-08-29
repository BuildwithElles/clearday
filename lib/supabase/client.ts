import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

// Create a singleton supabase client for client-side operations
// This client handles authentication state and persists sessions in localStorage
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export a singleton instance for convenience
export const supabase = createClient()

// Type exports for convenience
export type SupabaseClient = ReturnType<typeof createClient>

// Helper function to handle auth state changes
export function handleAuthStateChange(callback: (user: any) => void) {
  const client = createClient()
  
  // Get initial session
  client.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ?? null)
  })

  // Listen for auth state changes
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}

// Helper function to check if user is authenticated
export async function getCurrentUser() {
  const client = createClient()
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error.message)
    return null
  }

  return user
}

// Helper function to get current session
export async function getCurrentSession() {
  const client = createClient()
  const {
    data: { session },
    error,
  } = await client.auth.getSession()

  if (error) {
    console.error('Error getting current session:', error.message)
    return null
  }

  return session
}

// Helper function to sign out
export async function signOut() {
  const client = createClient()
  const { error } = await client.auth.signOut()

  if (error) {
    console.error('Error signing out:', error.message)
    throw error
  }
}

// Helper function to refresh session
export async function refreshSession() {
  const client = createClient()
  const { data, error } = await client.auth.refreshSession()

  if (error) {
    console.error('Error refreshing session:', error.message)
    throw error
  }

  return data.session
}
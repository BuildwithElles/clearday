'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

// Define the profile type from our database schema
type Profile = Database['public']['Tables']['profiles']['Row']

// Auth context interface
interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      return null
    }
  }

  // Function to refresh session
  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Error refreshing session:', error)
        return
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)

        // Fetch profile if user exists
        if (data.session.user) {
          const userProfile = await fetchProfile(data.session.user.id)
          setProfile(userProfile)
        }
      }
    } catch (error) {
      console.error('Unexpected error refreshing session:', error)
    }
  }

  // Function to sign out
  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Error signing out:', error)
        throw error
      }

      // Clear local state
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
      throw error
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting initial session:', error)
          setLoading(false)
          return
        }

        if (mounted) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)

          // Fetch profile if user exists
          if (initialSession?.user) {
            const userProfile = await fetchProfile(initialSession.user.id)
            setProfile(userProfile)
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Unexpected error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.id)

        setSession(session)
        setUser(session?.user ?? null)

        // Handle profile updates based on auth events
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    // Cleanup function
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Context value
  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

// Export the context for advanced usage
export { AuthContext }
export type { AuthContextType, Profile }

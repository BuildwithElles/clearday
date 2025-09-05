import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpdateProfileData {
  full_name?: string
  email?: string
  timezone?: string
  local_mode?: boolean
  privacy_mode?: boolean
  avatar_url?: string
}

export async function updateProfile(data: UpdateProfileData) {
  try {
    const supabase = createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { success: false, error: 'User not authenticated' }
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return { success: false, error: 'Failed to update profile' }
    }

    // Revalidate settings page to reflect changes
    revalidatePath('/settings')

    return { success: true, data: profile }
  } catch (error) {
    console.error('Unexpected error updating profile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getProfile() {
  try {
    const supabase = createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { success: false, error: 'User not authenticated' }
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error getting profile:', profileError)
      return { success: false, error: 'Failed to get profile' }
    }

    return { success: true, data: profile }
  } catch (error) {
    console.error('Unexpected error getting profile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

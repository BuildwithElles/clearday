'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface PrivacyToggleProps {
  initialValue?: boolean
  onToggle?: (value: boolean) => void
  disabled?: boolean
}

export function PrivacyToggle({
  initialValue = false,
  onToggle,
  disabled = false
}: PrivacyToggleProps) {
  const [isLocalMode, setIsLocalMode] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load current privacy setting from database
  useEffect(() => {
    const loadPrivacySetting = async () => {
      try {
        setIsInitializing(true)
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          console.warn('User not authenticated, using initial value')
          setIsLocalMode(initialValue)
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('local_mode')
          .eq('id', user.id)
          .single()

        if (error) {
          console.warn('Could not load privacy setting from database:', error.message)
          setIsLocalMode(initialValue)
        } else {
          // Use the actual value from database, fallback to initialValue
          const currentLocalMode = profile?.local_mode ?? initialValue
          setIsLocalMode(currentLocalMode)
        }
      } catch (err) {
        console.error('Error loading privacy setting:', err)
        setIsLocalMode(initialValue)
      } finally {
        setIsInitializing(false)
      }
    }

    loadPrivacySetting()
  }, [initialValue])

  // Handle toggle change
  const handleToggle = async (checked: boolean) => {
    if (disabled || isInitializing) return

    setIsLoading(true)
    setError(null)

    try {
      // Update local state immediately for responsive UI
      setIsLocalMode(checked)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        setIsLocalMode(!checked)
        setError('User not authenticated')
        return
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          local_mode: checked,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        // Revert on error
        setIsLocalMode(!checked)
        setError('Failed to update privacy settings')
        console.error('Error updating privacy settings:', error)
        return
      }

      // Call optional callback
      onToggle?.(checked)

    } catch (err) {
      // Revert on error
      setIsLocalMode(!checked)
      setError('Failed to update privacy settings')
      console.error('Privacy toggle error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`transition-all duration-200 ${isLocalMode ? 'border-green-200 bg-green-50/50' : 'border-orange-200 bg-orange-50/50'}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <Shield className={`h-5 w-5 ${isLocalMode ? 'text-green-600' : 'text-orange-600'}`} />
              <Label htmlFor="privacy-toggle" className="text-base font-medium">
                Local Mode
              </Label>
              <Badge variant={isLocalMode ? 'default' : 'secondary'} className="text-xs">
                {isLocalMode ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isLocalMode
                ? "Your data is stored locally on your device. No information is sent to our servers."
                : "Your data is synced with our secure cloud servers for cross-device access and backups."
              }
            </p>

            {/* Benefits/Features */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                {isLocalMode ? (
                  <>
                    <EyeOff className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Enhanced Privacy - No cloud sync</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-700">Cloud Sync - Access on all devices</span>
                  </>
                )}
              </div>

              {isLocalMode && (
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">Offline functionality</span>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Toggle Switch */}
          <div className="flex flex-col items-center space-y-2">
            <Switch
              id="privacy-toggle"
              checked={isLocalMode}
              onCheckedChange={handleToggle}
              disabled={disabled || isLoading || isInitializing}
              className="data-[state=checked]:bg-green-600"
            />
            {(isLoading || isInitializing) && (
              <div className="text-xs text-muted-foreground animate-pulse">
                {isInitializing ? 'Loading...' : 'Saving...'}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>What changes:</strong> {
                isLocalMode
                  ? "Tasks and events are stored only on this device"
                  : "Tasks and events sync across your devices"
              }
            </p>
            <p>
              <strong>Backup:</strong> {
                isLocalMode
                  ? "Manual export required for backups"
                  : "Automatic cloud backups enabled"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for using PrivacyToggle with profile data
export function usePrivacyToggle() {
  const [isLocalMode, setIsLocalMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load current privacy setting from profile
    // This would typically fetch from the user's profile
    const loadPrivacySetting = async () => {
      try {
        // For now, we'll use localStorage as a placeholder
        const stored = localStorage.getItem('privacy-local-mode')
        if (stored !== null) {
          setIsLocalMode(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Failed to load privacy setting:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPrivacySetting()
  }, [])

  const updatePrivacySetting = async (value: boolean) => {
    try {
      // Update localStorage (placeholder for database update)
      localStorage.setItem('privacy-local-mode', JSON.stringify(value))
      setIsLocalMode(value)
      return { success: true }
    } catch (error) {
      console.error('Failed to update privacy setting:', error)
      return { success: false, error: 'Failed to save privacy setting' }
    }
  }

  return {
    isLocalMode,
    isLoading,
    updatePrivacySetting
  }
}

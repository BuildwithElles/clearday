import { supabase } from '@/lib/supabase/client'

export interface AnalyticsEvent {
  event_name: string
  event_data?: Record<string, any>
  timestamp?: string
  user_id?: string
  session_id?: string
}

export interface PrivacySettings {
  local_mode: boolean
  analytics_disabled?: boolean
}

class Analytics {
  private sessionId: string
  private isInitialized = false
  private privacySettings: PrivacySettings | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async checkPrivacySettings(): Promise<boolean> {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // For non-authenticated users, we can still track basic analytics
        // but we'll be conservative and only track essential events
        return false
      }

      // Check user's privacy settings
      const { data: profile } = await supabase
        .from('profiles')
        .select('local_mode')
        .eq('id', user.id)
        .single()

      this.privacySettings = {
        local_mode: profile?.local_mode ?? false,
        analytics_disabled: profile?.local_mode ?? false // Local mode disables analytics
      }

      return this.privacySettings.analytics_disabled ?? false
    } catch (error) {
      console.warn('Failed to check privacy settings:', error)
      // Default to disabled for safety
      return true
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const isDisabled = await this.checkPrivacySettings()

      if (!isDisabled) {
        // Track initial page load
        await this.trackPageView()

        // Set up automatic page view tracking for SPA navigation
        this.setupPageViewTracking()
      }

      this.isInitialized = true
    } catch (error) {
      console.warn('Analytics initialization failed:', error)
    }
  }

  private setupPageViewTracking(): void {
    // Track page views on navigation (for SPA)
    if (typeof window !== 'undefined') {
      // Listen for Next.js route changes
      const handleRouteChange = () => {
        this.trackPageView()
      }

      // Use Next.js router events if available
      // For now, we'll use a simple approach
      let currentPath = window.location.pathname

      const checkRouteChange = () => {
        const newPath = window.location.pathname
        if (newPath !== currentPath) {
          currentPath = newPath
          this.trackPageView()
        }
      }

      // Check for route changes periodically (simple approach)
      setInterval(checkRouteChange, 1000)
    }
  }

  async trackPageView(pagePath?: string, pageTitle?: string): Promise<void> {
    const isDisabled = await this.checkPrivacySettings()
    if (isDisabled) return

    const event: AnalyticsEvent = {
      event_name: 'page_view',
      event_data: {
        page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
        page_title: pageTitle || (typeof window !== 'undefined' ? document.title : ''),
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString()
      },
      session_id: this.sessionId
    }

    await this.sendEvent(event)
  }

  async trackTaskCompletion(taskId: string, taskTitle: string): Promise<void> {
    const isDisabled = await this.checkPrivacySettings()
    if (isDisabled) return

    const event: AnalyticsEvent = {
      event_name: 'task_completed',
      event_data: {
        task_id: taskId,
        task_title: taskTitle,
        completion_time: new Date().toISOString()
      },
      session_id: this.sessionId
    }

    await this.sendEvent(event)
  }

  async trackTaskCreated(taskTitle: string, priority?: string): Promise<void> {
    const isDisabled = await this.checkPrivacySettings()
    if (isDisabled) return

    const event: AnalyticsEvent = {
      event_name: 'task_created',
      event_data: {
        task_title: taskTitle,
        priority: priority || 'medium',
        creation_time: new Date().toISOString()
      },
      session_id: this.sessionId
    }

    await this.sendEvent(event)
  }

  async trackEvent(eventName: string, eventData?: Record<string, any>): Promise<void> {
    const isDisabled = await this.checkPrivacySettings()
    if (isDisabled) return

    const event: AnalyticsEvent = {
      event_name: eventName,
      event_data: {
        ...eventData,
        timestamp: new Date().toISOString()
      },
      session_id: this.sessionId
    }

    await this.sendEvent(event)
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        event.user_id = user.id
      }

      // For now, we'll log to console in development
      // In production, this would send to your analytics service
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', event)
      }

      // TODO: Send to analytics service (e.g., PostHog, Mixpanel, etc.)
      // Example implementation:
      /*
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
      */

    } catch (error) {
      console.warn('Failed to send analytics event:', error)
    }
  }

  async getPrivacySettings(): Promise<PrivacySettings | null> {
    if (!this.privacySettings) {
      await this.checkPrivacySettings()
    }
    return this.privacySettings
  }

  async isTrackingEnabled(): Promise<boolean> {
    const isDisabled = await this.checkPrivacySettings()
    return !isDisabled
  }

  // Utility method to anonymize data for privacy
  private anonymizeData(data: Record<string, any>): Record<string, any> {
    const anonymized = { ...data }

    // Remove or hash potentially sensitive information
    if (anonymized.email) {
      anonymized.email = this.hashString(anonymized.email)
    }

    return anonymized
  }

  private hashString(str: string): string {
    // Simple hash for anonymization (not cryptographically secure)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }
}

// Export singleton instance
export const analytics = new Analytics()

// React hook for using analytics
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackTaskCompletion: analytics.trackTaskCompletion.bind(analytics),
    trackTaskCreated: analytics.trackTaskCreated.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    getPrivacySettings: analytics.getPrivacySettings.bind(analytics),
    isTrackingEnabled: analytics.isTrackingEnabled.bind(analytics)
  }
}

// Initialize analytics on app start
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    analytics.initialize()
  })
}

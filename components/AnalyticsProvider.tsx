'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize analytics on mount
    analytics.initialize()
  }, [])

  return <>{children}</>
}

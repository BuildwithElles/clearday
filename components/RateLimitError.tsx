'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Using Card components for error display instead of Alert

interface RateLimitErrorProps {
  message?: string
  retryAfter?: number
  onRetry?: () => void
  className?: string
}

export function RateLimitError({
  message = 'Too many requests. Please try again later.',
  retryAfter,
  onRetry,
  className
}: RateLimitErrorProps) {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (retryAfter) {
      setCountdown(retryAfter)
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            return null
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [retryAfter])

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle className="text-lg text-orange-900">Rate Limit Exceeded</CardTitle>
        <CardDescription>
          You've made too many requests recently
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <p className="text-sm text-orange-800">{message}</p>
        </div>

        {countdown !== null && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              You can try again in:
            </div>
            <div className="text-2xl font-mono font-bold text-orange-600">
              {formatTime(countdown)}
            </div>
          </div>
        )}

        {onRetry && countdown === null && (
          <Button
            onClick={onRetry}
            className="w-full"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>
            <strong>Why this happens:</strong> We limit requests to ensure fair usage for all users.
          </p>
          <p>
            <strong>What you can do:</strong> Wait a moment and try again, or reduce the frequency of your actions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for handling rate limit errors in forms and components
export function useRateLimitError() {
  const [rateLimitError, setRateLimitError] = useState<{
    message: string
    retryAfter?: number
  } | null>(null)

  const handleRateLimitError = (error: any) => {
    if (error?.message?.includes('Rate limit exceeded') ||
        error?.message?.includes('Too many')) {
      setRateLimitError({
        message: error.message,
        retryAfter: error.retryAfter || 60
      })
      return true // Indicates this was a rate limit error
    }
    return false // Not a rate limit error
  }

  const clearRateLimitError = () => {
    setRateLimitError(null)
  }

  return {
    rateLimitError,
    handleRateLimitError,
    clearRateLimitError,
    RateLimitErrorComponent: rateLimitError ? (
      <RateLimitError
        message={rateLimitError.message}
        retryAfter={rateLimitError.retryAfter}
        onRetry={clearRateLimitError}
      />
    ) : null
  }
}

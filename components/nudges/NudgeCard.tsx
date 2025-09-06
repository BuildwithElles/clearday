'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Lightbulb,
  Target,
  Zap,
  Heart,
  Star,
  Flame,
  Clock,
  Trophy,
  ArrowRight,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type NudgeType =
  | 'motivation'
  | 'reminder'
  | 'achievement'
  | 'streak'
  | 'productivity'
  | 'break'
  | 'celebration'
  | 'warning'

export type NudgePriority = 'low' | 'medium' | 'high' | 'urgent'

interface NudgeCardProps {
  id?: string
  type: NudgeType
  title: string
  message: string
  priority?: NudgePriority
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
  dismissible?: boolean
  autoHide?: boolean
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}

const nudgeConfigs = {
  motivation: {
    icon: Lightbulb,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    badge: 'Motivation'
  },
  reminder: {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badge: 'Reminder'
  },
  achievement: {
    icon: Trophy,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badge: 'Achievement'
  },
  streak: {
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badge: 'Streak'
  },
  productivity: {
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badge: 'Productivity'
  },
  break: {
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    badge: 'Break Time'
  },
  celebration: {
    icon: Star,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    badge: 'Celebration'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badge: 'Warning'
  }
}

export function NudgeCard({
  id,
  type,
  title,
  message,
  priority = 'medium',
  actionLabel,
  onAction,
  onDismiss,
  dismissible = true,
  autoHide = false,
  className,
  icon
}: NudgeCardProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissing, setIsDismissing] = useState(false)

  const config = nudgeConfigs[type]
  const IconComponent = (icon || config.icon) as React.ComponentType<{ className?: string }>

  const handleDismiss = () => {
    setIsDismissing(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, 300)
  }

  const handleAction = () => {
    onAction?.()
    if (autoHide) {
      handleDismiss()
    }
  }

  const getPriorityStyles = () => {
    switch (priority) {
      case 'urgent':
        return 'ring-2 ring-red-300 shadow-lg'
      case 'high':
        return 'ring-1 ring-orange-300 shadow-md'
      case 'medium':
        return 'shadow-sm'
      case 'low':
        return ''
      default:
        return 'shadow-sm'
    }
  }

  if (!isVisible) return null

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-in-out',
        config.bgColor,
        config.borderColor,
        getPriorityStyles(),
        isDismissing && 'transform translate-x-full opacity-0',
        className
      )}
    >
      {/* Priority indicator */}
      {priority === 'urgent' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
      )}
      {priority === 'high' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn('flex-shrink-0 mt-1', config.color)}>
            <IconComponent className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {/* Badge */}
                <Badge
                  variant="secondary"
                  className={cn('mb-2 text-xs', config.bgColor, config.color)}
                >
                  {config.badge}
                </Badge>

                {/* Title */}
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {title}
                </h3>

                {/* Message */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Dismiss button */}
              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-shrink-0 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Action button */}
            {actionLabel && (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={handleAction}
                  className={cn(
                    'text-xs',
                    type === 'warning' && 'bg-red-600 hover:bg-red-700',
                    type === 'celebration' && 'bg-indigo-600 hover:bg-indigo-700'
                  )}
                >
                  {actionLabel}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 opacity-10">
          {type === 'motivation' && <Lightbulb className="h-8 w-8" />}
          {type === 'achievement' && <Trophy className="h-8 w-8" />}
          {type === 'streak' && <Flame className="h-8 w-8" />}
          {type === 'celebration' && <Star className="h-8 w-8" />}
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-configured nudge components for common use cases
export function MotivationNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="motivation"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function ReminderNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="reminder"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function AchievementNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="achievement"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function StreakNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="streak"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function ProductivityNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="productivity"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function BreakNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="break"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function CelebrationNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="celebration"
      title={title}
      message={message}
      {...props}
    />
  )
}

export function WarningNudge({
  title,
  message,
  ...props
}: Omit<NudgeCardProps, 'type'>) {
  return (
    <NudgeCard
      type="warning"
      title={title}
      message={message}
      priority="high"
      {...props}
    />
  )
}




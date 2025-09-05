'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Target,
  CheckCircle,
  Circle,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Flame
} from 'lucide-react'

interface ProgressCardProps {
  date?: string
  showStreak?: boolean
  showWeeklyGoal?: boolean
  compact?: boolean
}

interface DailyStats {
  completed: number
  total: number
  streak: number
  weeklyGoal: number
  weeklyCompleted: number
}

export function ProgressCard({
  date,
  showStreak = true,
  showWeeklyGoal = true,
  compact = false
}: ProgressCardProps) {
  const [stats, setStats] = useState<DailyStats>({
    completed: 0,
    total: 0,
    streak: 0,
    weeklyGoal: 7,
    weeklyCompleted: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading daily progress data
  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setIsLoading(true)

        // In a real implementation, this would fetch from the database
        // For now, we'll simulate some progress data
        const mockStats: DailyStats = {
          completed: 5,
          total: 8,
          streak: 3,
          weeklyGoal: 7,
          weeklyCompleted: 5
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        setStats(mockStats)
      } catch (error) {
        console.error('Failed to load progress data:', error)
        // Fallback to default stats
        setStats(prev => prev)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgressData()
  }, [date])

  const dailyProgress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
  const weeklyProgress = stats.weeklyGoal > 0 ? (stats.weeklyCompleted / stats.weeklyGoal) * 100 : 0

  const getMotivationalMessage = () => {
    if (dailyProgress === 100) {
      return "🎉 Amazing! You've completed all your tasks today!"
    } else if (dailyProgress >= 75) {
      return "🚀 You're crushing it! Almost there!"
    } else if (dailyProgress >= 50) {
      return "💪 Great progress! Keep going!"
    } else if (dailyProgress >= 25) {
      return "📈 You're building momentum!"
    } else {
      return "🌟 Every task completed is a win. Let's get started!"
    }
  }

  const getStreakIcon = () => {
    if (stats.streak >= 7) return <Flame className="h-4 w-4 text-orange-500" />
    if (stats.streak >= 3) return <Zap className="h-4 w-4 text-yellow-500" />
    return <Target className="h-4 w-4 text-blue-500" />
  }

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                {stats.completed}/{stats.total} tasks
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Math.round(dailyProgress)}%
            </Badge>
          </div>
          <Progress value={dailyProgress} className="mt-2 h-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Today's Progress
        </CardTitle>
        <CardDescription>
          {getMotivationalMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Daily Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {stats.completed}/{stats.total}
              </span>
              <Badge variant="secondary" className="text-xs">
                {Math.round(dailyProgress)}%
              </Badge>
            </div>
          </div>
          <Progress value={dailyProgress} className="h-3" />
        </div>

        {/* Streak Counter */}
        {showStreak && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              {getStreakIcon()}
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold">{stats.streak}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
        )}

        {/* Weekly Goal */}
        {showWeeklyGoal && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Weekly Goal</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.weeklyCompleted}/{stats.weeklyGoal} days
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.weeklyGoal - stats.weeklyCompleted} more days to reach your weekly goal!
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            View Stats
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Target className="h-4 w-4 mr-1" />
            Set Goals
          </Button>
        </div>

        {/* Achievement Badges */}
        {stats.streak >= 3 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {stats.streak >= 3 && (
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Consistency Champion
              </Badge>
            )}
            {stats.streak >= 7 && (
              <Badge variant="outline" className="text-xs">
                <Flame className="h-3 w-3 mr-1" />
                Week Warrior
              </Badge>
            )}
            {dailyProgress === 100 && (
              <Badge variant="outline" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                Perfect Day
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

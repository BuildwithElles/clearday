// Core application types
export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  householdId?: string
  privacyMode: boolean
  localMode: boolean
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  userId: string
  householdId?: string
  title: string
  description?: string
  dueDate?: string
  dueTime?: string
  completed: boolean
  completedAt?: string
  priority: 1 | 2 | 3 | 4
  tags: string[]
  recurringRule?: RecurringRule
  source: 'manual' | 'calendar' | 'habit'
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  userId: string
  integrationId?: string
  externalId?: string
  title: string
  description?: string
  location?: string
  startTime: string
  endTime: string
  allDay: boolean
  attendees?: Attendee[]
  travelTime?: number
  preparationTime?: number
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  userId: string
  taskId?: string
  eventId?: string
  type: 'task' | 'event' | 'habit'
  scheduledTime: string
  actualTime?: string
  dismissed: boolean
  snoozedUntil?: string
  personalizationLabel?: string
  strategy: 'aggressive' | 'gentle' | 'smart'
  effectivenessScore?: number
  createdAt: string
  updatedAt: string
}

export interface Nudge {
  id: string
  userId: string
  type: 'eco' | 'health' | 'productivity' | 'social'
  title: string
  message: string
  actionType?: 'task_creation' | 'habit_start' | 'reminder_set'
  actionData?: Record<string, unknown>
  impactKg?: number
  shownAt?: string
  actedOn: boolean
  actedAt?: string
  expiresAt?: string
  createdAt: string
}

export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  targetCount: number
  currentStreak: number
  longestStreak: number
  autoRules?: Record<string, unknown>
  reminderTime?: string
  category?: string
  impactPerCompletion?: number
  createdAt: string
  updatedAt: string
}

export interface Progress {
  id: string
  userId: string
  periodType: 'daily' | 'weekly' | 'monthly'
  periodStart: string
  tasksCompleted: number
  habitsCompleted: number
  eventsAttended: number
  co2Kg: number
  productivityScore?: number
  wellnessScore?: number
  createdAt: string
  updatedAt: string
}

// Supporting types
export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[]
  dayOfMonth?: number
  endDate?: string
}

export interface Attendee {
  email: string
  name?: string
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction'
}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// Feature flag types
export interface FeatureFlags {
  enableLocalMode: boolean
  enableHousehold: boolean
  enableCo2Tracking: boolean
}

// Privacy types
export interface PrivacySettings {
  privacyMode: boolean
  localMode: boolean
  dataRetentionDays?: number
  allowAnalytics: boolean
  allowThirdPartyIntegrations: boolean
}
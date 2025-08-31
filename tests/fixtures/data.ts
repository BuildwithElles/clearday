import type { User, Task, Event, Reminder, Nudge, Habit, Progress } from '@/types'

// Test user fixtures
export const testUsers: User[] = [
  {
    id: 'user-1',
    email: 'test1@example.com',
    fullName: 'Test User One',
    avatarUrl: 'https://example.com/avatar1.jpg',
    householdId: 'household-1',
    privacyMode: false,
    localMode: false,
    timezone: 'UTC',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    email: 'test2@example.com',
    fullName: 'Test User Two',
    avatarUrl: undefined,
    householdId: undefined,
    privacyMode: true,
    localMode: true,
    timezone: 'America/New_York',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

// Test task fixtures
export const testTasks: Task[] = [
  {
    id: 'task-1',
    userId: 'user-1',
    householdId: 'household-1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    dueDate: '2024-01-15',
    dueTime: '17:00',
    completed: false,
    completedAt: undefined,
    priority: 1,
    tags: ['work', 'documentation'],
    recurringRule: undefined,
    source: 'manual',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 'task-2',
    userId: 'user-1',
    householdId: 'household-1',
    title: 'Buy groceries',
    description: 'Get items for dinner tonight',
    dueDate: '2024-01-10',
    dueTime: '18:00',
    completed: true,
    completedAt: '2024-01-10T17:30:00Z',
    priority: 2,
    tags: ['personal', 'shopping'],
    recurringRule: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [1], // Monday
      endDate: undefined
    },
    source: 'manual',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-10T17:30:00Z'
  }
]

// Test event fixtures
export const testEvents: Event[] = [
  {
    id: 'event-1',
    userId: 'user-1',
    integrationId: 'google-calendar-1',
    externalId: 'google-event-123',
    title: 'Team Meeting',
    description: 'Weekly team sync meeting',
    location: 'Conference Room A',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T11:00:00Z',
    allDay: false,
    attendees: [
      {
        email: 'colleague@company.com',
        name: 'John Doe',
        responseStatus: 'accepted'
      }
    ],
    travelTime: 15,
    preparationTime: 5,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'event-2',
    userId: 'user-1',
    integrationId: undefined,
    externalId: undefined,
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    location: 'Medical Center',
    startTime: '2024-01-20T14:00:00Z',
    endTime: '2024-01-20T15:00:00Z',
    allDay: false,
    attendees: [],
    travelTime: 30,
    preparationTime: 10,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  }
]

// Test reminder fixtures
export const testReminders: Reminder[] = [
  {
    id: 'reminder-1',
    userId: 'user-1',
    taskId: 'task-1',
    eventId: undefined,
    type: 'task',
    scheduledTime: '2024-01-15T16:30:00Z',
    actualTime: undefined,
    dismissed: false,
    snoozedUntil: undefined,
    personalizationLabel: 'work-task',
    strategy: 'smart',
    effectivenessScore: undefined,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 'reminder-2',
    userId: 'user-1',
    taskId: undefined,
    eventId: 'event-1',
    type: 'event',
    scheduledTime: '2024-01-15T09:45:00Z',
    actualTime: '2024-01-15T09:45:00Z',
    dismissed: true,
    snoozedUntil: undefined,
    personalizationLabel: 'meeting',
    strategy: 'aggressive',
    effectivenessScore: 0.8,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-15T09:45:00Z'
  }
]

// Test nudge fixtures
export const testNudges: Nudge[] = [
  {
    id: 'nudge-1',
    userId: 'user-1',
    type: 'eco',
    title: 'Take the bus today',
    message: 'Consider taking public transportation to reduce your carbon footprint',
    actionType: 'task_creation',
    actionData: {
      taskTitle: 'Take bus to work',
      estimatedCO2Saved: 2.5
    },
    impactKg: 2.5,
    shownAt: '2024-01-15T07:00:00Z',
    actedOn: true,
    actedAt: '2024-01-15T07:05:00Z',
    expiresAt: '2024-01-15T23:59:59Z',
    createdAt: '2024-01-15T06:00:00Z'
  },
  {
    id: 'nudge-2',
    userId: 'user-1',
    type: 'health',
    title: 'Time for a break',
    message: 'You\'ve been working for 2 hours. Take a 5-minute break to stretch',
    actionType: undefined,
    actionData: undefined,
    impactKg: undefined,
    shownAt: '2024-01-15T11:00:00Z',
    actedOn: false,
    actedAt: undefined,
    expiresAt: '2024-01-15T12:00:00Z',
    createdAt: '2024-01-15T09:00:00Z'
  }
]

// Test habit fixtures
export const testHabits: Habit[] = [
  {
    id: 'habit-1',
    userId: 'user-1',
    name: 'Daily Exercise',
    description: '30 minutes of physical activity',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 7,
    longestStreak: 15,
    autoRules: {
      reminderTime: '06:00',
      weatherDependent: true
    },
    reminderTime: '06:00',
    category: 'health',
    impactPerCompletion: 0.5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'habit-2',
    userId: 'user-1',
    name: 'Read Books',
    description: 'Read for 20 minutes before bed',
    frequency: 'daily',
    targetCount: 1,
    currentStreak: 3,
    longestStreak: 10,
    autoRules: {
      reminderTime: '21:00',
      locationBased: 'home'
    },
    reminderTime: '21:00',
    category: 'learning',
    impactPerCompletion: 0.1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
]

// Test progress fixtures
export const testProgress: Progress[] = [
  {
    id: 'progress-1',
    userId: 'user-1',
    periodType: 'daily',
    periodStart: '2024-01-15T00:00:00Z',
    tasksCompleted: 5,
    habitsCompleted: 2,
    eventsAttended: 3,
    co2Kg: 1.2,
    productivityScore: 0.85,
    wellnessScore: 0.78,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T23:59:59Z'
  },
  {
    id: 'progress-2',
    userId: 'user-1',
    periodType: 'weekly',
    periodStart: '2024-01-08T00:00:00Z',
    tasksCompleted: 25,
    habitsCompleted: 12,
    eventsAttended: 8,
    co2Kg: 8.5,
    productivityScore: 0.82,
    wellnessScore: 0.75,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-14T23:59:59Z'
  }
]

// Helper functions to generate test data
export const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: `user-${Date.now()}`,
  email: `test-${Date.now()}@example.com`,
  fullName: 'Test User',
  avatarUrl: undefined,
  householdId: undefined,
  privacyMode: false,
  localMode: false,
  timezone: 'UTC',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createTestTask = (overrides: Partial<Task> = {}): Task => ({
  id: `task-${Date.now()}`,
  userId: 'user-1',
  householdId: undefined,
  title: 'Test Task',
  description: 'Test task description',
  dueDate: undefined,
  dueTime: undefined,
  completed: false,
      completedAt: undefined,
  priority: 2,
  tags: ['test'],
      recurringRule: undefined,
  source: 'manual',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createTestEvent = (overrides: Partial<Event> = {}): Event => ({
  id: `event-${Date.now()}`,
  userId: 'user-1',
  integrationId: undefined,
  externalId: undefined,
  title: 'Test Event',
  description: 'Test event description',
  location: undefined,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 3600000).toISOString(),
  allDay: false,
  attendees: [],
  travelTime: undefined,
  preparationTime: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

// Test data for different scenarios
export const testScenarios = {
  emptyUser: {
    user: createTestUser(),
    tasks: [],
    events: [],
    reminders: [],
    nudges: [],
    habits: [],
    progress: []
  },
  busyUser: {
    user: createTestUser({ fullName: 'Busy User' }),
    tasks: testTasks,
    events: testEvents,
    reminders: testReminders,
    nudges: testNudges,
    habits: testHabits,
    progress: testProgress
  },
  privacyFocusedUser: {
    user: createTestUser({ 
      fullName: 'Privacy User',
      privacyMode: true,
      localMode: true
    }),
    tasks: testTasks.slice(0, 1),
    events: [],
    reminders: [],
    nudges: [],
    habits: testHabits.slice(0, 1),
    progress: testProgress.slice(0, 1)
  }
}

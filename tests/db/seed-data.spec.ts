import { test, expect } from '@playwright/test'

// Helper function to create admin client with error handling
async function createAdminClient() {
  try {
    const { createAdminClient } = await import('@/lib/supabase/server')
    return createAdminClient()
  } catch (error) {
    console.warn('Database not available for testing:', error)
    return null
  }
}

test.describe('Seed Data Script', () => {
  test('should create test users in auth.users', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: users, error } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .in('email', [
        'john.doe@clearday.test',
        'jane.smith@clearday.test', 
        'bob.wilson@clearday.test'
      ])
    
    expect(error).toBeNull()
    expect(users).toHaveLength(3)
    
    // Check user data
    const john = users?.find(u => u.email === 'john.doe@clearday.test')
    const jane = users?.find(u => u.email === 'jane.smith@clearday.test')
    const bob = users?.find(u => u.email === 'bob.wilson@clearday.test')
    
    expect(john).toBeDefined()
    expect(jane).toBeDefined()
    expect(bob).toBeDefined()
    
    expect(john?.raw_user_meta_data).toMatchObject({
      full_name: 'John Doe',
      avatar_url: expect.stringContaining('dicebear.com')
    })
  })

  test('should create corresponding profiles for test users', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .in('email', [
        'john.doe@clearday.test',
        'jane.smith@clearday.test',
        'bob.wilson@clearday.test'
      ])
    
    expect(error).toBeNull()
    expect(profiles).toHaveLength(3)
    
    // Check profile data
    const johnProfile = profiles?.find(p => p.email === 'john.doe@clearday.test')
    const janeProfile = profiles?.find(p => p.email === 'jane.smith@clearday.test')
    const bobProfile = profiles?.find(p => p.email === 'bob.wilson@clearday.test')
    
    expect(johnProfile).toBeDefined()
    expect(janeProfile).toBeDefined()
    expect(bobProfile).toBeDefined()
    
    // Check household membership
    expect(johnProfile?.household_id).toBeDefined()
    expect(janeProfile?.household_id).toBeDefined()
    expect(bobProfile?.household_id).toBeNull() // Bob is individual user
  })

  test('should create household with proper relationships', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: households, error } = await supabase
      .from('households')
      .select('*')
      .eq('name', 'The Doe Family')
    
    expect(error).toBeNull()
    expect(households).toHaveLength(1)
    
    const household = households?.[0]
    expect(household?.name).toBe('The Doe Family')
    
    // Check that John and Jane are in the same household
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, household_id')
      .in('email', ['john.doe@clearday.test', 'jane.smith@clearday.test'])
    
    const householdMembers = profiles?.filter(p => p.household_id === household?.id)
    expect(householdMembers).toHaveLength(2)
  })

  test('should create integrations for users', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    // Get user IDs
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .in('email', ['john.doe@clearday.test', 'jane.smith@clearday.test'])
    
    const userIds = profiles?.map(p => p.id) || []
    
    const { data: integrations, error } = await supabase
      .from('integrations')
      .select('*')
      .in('user_id', userIds)
    
    expect(error).toBeNull()
    expect(integrations).toHaveLength(2)
    
    // Check integration types
    const googleIntegration = integrations?.find(i => i.provider === 'google_calendar')
    const outlookIntegration = integrations?.find(i => i.provider === 'outlook')
    
    expect(googleIntegration).toBeDefined()
    expect(outlookIntegration).toBeDefined()
  })

  test('should create tasks with proper relationships', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .in('title', [
        'Review quarterly reports',
        'Book dentist appointment',
        'Grocery shopping',
        'Finish project proposal',
        'Learn TypeScript'
      ])
    
    expect(error).toBeNull()
    expect(tasks?.length).toBeGreaterThan(0)
    
    // Check task properties
    const quarterlyTask = tasks?.find(t => t.title === 'Review quarterly reports')
    expect(quarterlyTask?.priority).toBe('high')
    expect(quarterlyTask?.tags).toContain('work')
    expect(quarterlyTask?.tags).toContain('quarterly')
    
    // Check household tasks
    const householdTasks = tasks?.filter(t => t.household_id !== null)
    expect(householdTasks?.length).toBeGreaterThan(0)
  })

  test('should create events with proper relationships', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .in('title', [
        'Team standup',
        'Client presentation',
        'Design review',
        'Company retreat'
      ])
    
    expect(error).toBeNull()
    expect(events?.length).toBeGreaterThan(0)
    
    // Check event properties
    const standupEvent = events?.find(e => e.title === 'Team standup')
    expect(standupEvent?.location).toBe('Conference Room A')
    expect(standupEvent?.all_day).toBe(false)
    
    // Check all-day events
    const allDayEvents = events?.filter(e => e.all_day === true)
    expect(allDayEvents?.length).toBeGreaterThan(0)
  })

  test('should create reminders with proper relationships', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .in('message', [
        'Quarterly reports review in 30 minutes',
        'Team standup in 15 minutes',
        'Time for your morning workout!'
      ])
    
    expect(error).toBeNull()
    expect(reminders?.length).toBeGreaterThan(0)
    
    // Check reminder properties
    const quarterlyReminder = reminders?.find(r => r.message.includes('Quarterly reports'))
    expect(quarterlyReminder?.type).toBe('notification')
    expect(quarterlyReminder?.strategy).toBe('smart')
    expect(quarterlyReminder?.effectiveness_score).toBeGreaterThan(0)
    
    // Check personalization
    expect(quarterlyReminder?.personalization).toMatchObject({
      tone: 'professional',
      urgency: 'medium',
      context: 'work'
    })
  })

  test('should create habits with proper data', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .in('name', [
        'Morning Workout',
        'Meditation',
        'Walk to work',
        'Learn coding'
      ])
    
    expect(error).toBeNull()
    expect(habits?.length).toBeGreaterThan(0)
    
    // Check habit properties
    const workoutHabit = habits?.find(h => h.name === 'Morning Workout')
    expect(workoutHabit?.frequency).toBe('daily')
    expect(workoutHabit?.target_count).toBe(1)
    expect(workoutHabit?.current_streak).toBeGreaterThan(0)
    expect(workoutHabit?.category).toBe('health')
    expect(workoutHabit?.co2_impact_per_completion).toBe(0.5)
    
    // Check auto rules
    expect(workoutHabit?.auto_rules).toMatchObject({
      time_of_day: '07:00',
      location: 'home gym'
    })
  })

  test('should create nudges with proper data', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    const { data: nudges, error } = await supabase
      .from('nudges')
      .select('*')
      .in('title', [
        'Sustainable Commute',
        'Energy Saving',
        'Hydration Reminder',
        'Focus Time'
      ])
    
    expect(error).toBeNull()
    expect(nudges?.length).toBeGreaterThan(0)
    
    // Check nudge properties
    const ecoNudge = nudges?.find(n => n.title === 'Sustainable Commute')
    expect(ecoNudge?.type).toBe('eco')
    expect(ecoNudge?.action_type).toBe('button')
    expect(ecoNudge?.co2_impact).toBe(3.5)
    
    // Check action data
    expect(ecoNudge?.action_data).toMatchObject({
      label: 'Plan Route',
      action: 'open_maps'
    })
  })

  test('should maintain referential integrity', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    // Check that all foreign keys are valid
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('user_id, household_id')
      .not('user_id', 'is', null)
    
    expect(tasksError).toBeNull()
    
    // Verify all task user_ids exist in profiles
    if (tasks && tasks.length > 0) {
      const userIds = Array.from(new Set(tasks.map(t => t.user_id)))
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', userIds)
      
      expect(profilesError).toBeNull()
      expect(profiles?.length).toBe(userIds.length)
    }
    
    // Check event relationships
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('user_id, integration_id')
      .not('user_id', 'is', null)
    
    expect(eventsError).toBeNull()
    
    // Verify all event user_ids exist in profiles
    if (events && events.length > 0) {
      const userIds = Array.from(new Set(events.map(e => e.user_id)))
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', userIds)
      
      expect(profilesError).toBeNull()
      expect(profiles?.length).toBe(userIds.length)
    }
  })

  test('should have realistic data distribution', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    // Check data distribution across users
    const { data: tasks } = await supabase
      .from('tasks')
      .select('user_id')
      .not('user_id', 'is', null)
    
    const { data: events } = await supabase
      .from('events')
      .select('user_id')
      .not('user_id', 'is', null)
    
    const { data: habits } = await supabase
      .from('habits')
      .select('user_id')
      .not('user_id', 'is', null)
    
    // Each user should have some data
    expect(tasks?.length).toBeGreaterThan(0)
    expect(events?.length).toBeGreaterThan(0)
    expect(habits?.length).toBeGreaterThan(0)
    
    // Check that data is distributed across multiple users
    const taskUserIds = Array.from(new Set(tasks?.map(t => t.user_id) || []))
    const eventUserIds = Array.from(new Set(events?.map(e => e.user_id) || []))
    const habitUserIds = Array.from(new Set(habits?.map(h => h.user_id) || []))
    
    expect(taskUserIds.length).toBeGreaterThan(1)
    expect(eventUserIds.length).toBeGreaterThan(1)
    expect(habitUserIds.length).toBeGreaterThan(1)
  })

  test('should have proper timestamps and metadata', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    // Check that all records have proper timestamps
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('created_at, updated_at')
      .in('email', ['john.doe@clearday.test', 'jane.smith@clearday.test', 'bob.wilson@clearday.test'])
    
    expect(error).toBeNull()
    expect(profiles?.length).toBe(3)
    
    profiles?.forEach(profile => {
      expect(profile.created_at).toBeDefined()
      expect(profile.updated_at).toBeDefined()
      expect(new Date(profile.created_at).getTime()).toBeGreaterThan(0)
      expect(new Date(profile.updated_at).getTime()).toBeGreaterThan(0)
    })
  })

  test('should handle JSON fields properly', async () => {
    const supabase = await createAdminClient()
    
    if (!supabase) {
      test.skip()
      return
    }
    
    // Check JSON fields in tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('tags, recurring_rule')
      .not('tags', 'is', null)
      .limit(1)
    
    expect(tasksError).toBeNull()
    if (tasks && tasks.length > 0) {
      expect(Array.isArray(tasks[0].tags)).toBe(true)
    }
    
    // Check JSON fields in habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('auto_rules')
      .not('auto_rules', 'is', null)
      .limit(1)
    
    expect(habitsError).toBeNull()
    if (habits && habits.length > 0) {
      expect(typeof habits[0].auto_rules).toBe('object')
    }
    
    // Check JSON fields in nudges
    const { data: nudges, error: nudgesError } = await supabase
      .from('nudges')
      .select('action_data')
      .not('action_data', 'is', null)
      .limit(1)
    
    expect(nudgesError).toBeNull()
    if (nudges && nudges.length > 0) {
      expect(typeof nudges[0].action_data).toBe('object')
    }
  })
})

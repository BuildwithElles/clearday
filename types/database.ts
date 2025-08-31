// This file contains TypeScript types for the ClearDay database schema
// Generated based on Supabase migrations 001-007

// Export the main Database interface
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          household_id: string | null
          role: 'user' | 'admin' | 'household_admin'
          permissions: string[] | null
          privacy_mode: boolean
          local_mode: boolean
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          household_id?: string | null
          role?: 'user' | 'admin' | 'household_admin'
          permissions?: string[] | null
          privacy_mode?: boolean
          local_mode?: boolean
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          household_id?: string | null
          role?: 'user' | 'admin' | 'household_admin'
          permissions?: string[] | null
          privacy_mode?: boolean
          local_mode?: boolean
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      households: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          household_id: string | null
          due_date: string | null
          completed_at: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          tags: string[] | null
          recurring_rule: {
            frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
            interval: number
            end_date?: string
            days_of_week?: number[]
            day_of_month?: number
          } | null
          source: 'manual' | 'calendar' | 'ai' | 'import'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          household_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          tags?: string[] | null
          recurring_rule?: {
            frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
            interval: number
            end_date?: string
            days_of_week?: number[]
            day_of_month?: number
          } | null
          source?: 'manual' | 'calendar' | 'ai' | 'import'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          household_id?: string | null
          due_date?: string | null
          completed_at?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          tags?: string[] | null
          recurring_rule?: {
            frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
            interval: number
            end_date?: string
            days_of_week?: number[]
            day_of_month?: number
          } | null
          source?: 'manual' | 'calendar' | 'ai' | 'import'
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: 'google' | 'outlook' | 'apple' | 'other'
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          external_user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'google' | 'outlook' | 'apple' | 'other'
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          external_user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'google' | 'outlook' | 'apple' | 'other'
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          external_user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          user_id: string
          integration_id: string | null
          external_id: string | null
          start_time: string
          end_time: string
          all_day: boolean
          location: string | null
          attendees: {
            email: string
            name: string | null
            response: 'accepted' | 'declined' | 'pending' | 'tentative'
          }[] | null
          travel_time: number | null
          preparation_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          user_id: string
          integration_id?: string | null
          external_id?: string | null
          start_time: string
          end_time: string
          all_day?: boolean
          location?: string | null
          attendees?: {
            email: string
            name: string | null
            response: 'accepted' | 'declined' | 'pending' | 'tentative'
          }[] | null
          travel_time?: number | null
          preparation_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          user_id?: string
          integration_id?: string | null
          external_id?: string | null
          start_time?: string
          end_time?: string
          all_day?: boolean
          location?: string | null
          attendees?: {
            email: string
            name: string | null
            response: 'accepted' | 'declined' | 'pending' | 'tentative'
          }[] | null
          travel_time?: number | null
          preparation_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          event_id: string | null
          habit_id: string | null
          scheduled_time: string
          actual_time: string | null
          dismissed_at: string | null
          snoozed_until: string | null
          message: string
          type: 'notification' | 'email' | 'sms'
          strategy: 'smart' | 'fixed' | 'adaptive'
          personalization: {
            tone: 'friendly' | 'professional' | 'casual' | 'motivational'
            urgency: 'low' | 'medium' | 'high'
            context: string | null
          } | null
          effectiveness_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          event_id?: string | null
          habit_id?: string | null
          scheduled_time: string
          actual_time?: string | null
          dismissed_at?: string | null
          snoozed_until?: string | null
          message: string
          type?: 'notification' | 'email' | 'sms'
          strategy?: 'smart' | 'fixed' | 'adaptive'
          personalization?: {
            tone: 'friendly' | 'professional' | 'casual' | 'motivational'
            urgency: 'low' | 'medium' | 'high'
            context: string | null
          } | null
          effectiveness_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          event_id?: string | null
          habit_id?: string | null
          scheduled_time?: string
          actual_time?: string | null
          dismissed_at?: string | null
          snoozed_until?: string | null
          message?: string
          type?: 'notification' | 'email' | 'sms'
          strategy?: 'smart' | 'fixed' | 'adaptive'
          personalization?: {
            tone: 'friendly' | 'professional' | 'casual' | 'motivational'
            urgency: 'low' | 'medium' | 'high'
            context: string | null
          } | null
          effectiveness_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      nudges: {
        Row: {
          id: string
          user_id: string
          type: 'eco' | 'health' | 'productivity' | 'social'
          title: string
          message: string
          action_type: 'link' | 'button' | 'dismiss'
          action_data: {
            url?: string
            label?: string
            action?: string
          } | null
          co2_impact: number | null
          shown_at: string | null
          acted_upon_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'eco' | 'health' | 'productivity' | 'social'
          title: string
          message: string
          action_type?: 'link' | 'button' | 'dismiss'
          action_data?: {
            url?: string
            label?: string
            action?: string
          } | null
          co2_impact?: number | null
          shown_at?: string | null
          acted_upon_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'eco' | 'health' | 'productivity' | 'social'
          title?: string
          message?: string
          action_type?: 'link' | 'button' | 'dismiss'
          action_data?: {
            url?: string
            label?: string
            action?: string
          } | null
          co2_impact?: number | null
          shown_at?: string | null
          acted_upon_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          target_count: number
          current_streak: number
          longest_streak: number
          auto_rules: {
            time_of_day?: string
            location?: string
            trigger?: string
          } | null
          reminder_time: string | null
          category: 'health' | 'productivity' | 'eco' | 'social' | 'other'
          co2_impact_per_completion: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          target_count?: number
          current_streak?: number
          longest_streak?: number
          auto_rules?: {
            time_of_day?: string
            location?: string
            trigger?: string
          } | null
          reminder_time?: string | null
          category?: 'health' | 'productivity' | 'eco' | 'social' | 'other'
          co2_impact_per_completion?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          target_count?: number
          current_streak?: number
          longest_streak?: number
          auto_rules?: {
            time_of_day?: string
            location?: string
            trigger?: string
          } | null
          reminder_time?: string | null
          category?: 'health' | 'productivity' | 'eco' | 'social' | 'other'
          co2_impact_per_completion?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      performance_metrics: {
        Row: {
          table_name: string
          row_count: number
          last_updated: string
          index_count: number
        }
      }
    }
    Functions: {
      handle_new_user: {
        Args: {
          user_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Returns: void
      }
    }
    Enums: {
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      task_source: 'manual' | 'calendar' | 'ai' | 'import'
      user_role: 'user' | 'admin' | 'household_admin'
      integration_provider: 'google' | 'outlook' | 'apple' | 'other'
      attendee_response: 'accepted' | 'declined' | 'pending' | 'tentative'
      reminder_type: 'notification' | 'email' | 'sms'
      reminder_strategy: 'smart' | 'fixed' | 'adaptive'
      nudge_type: 'eco' | 'health' | 'productivity' | 'social'
      nudge_action_type: 'link' | 'button' | 'dismiss'
      habit_frequency: 'daily' | 'weekly' | 'monthly'
      habit_category: 'health' | 'productivity' | 'eco' | 'social' | 'other'
    }
  }
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Profile = Tables<'profiles'>
export type Household = Tables<'households'>
export type Task = Tables<'tasks'>
export type Integration = Tables<'integrations'>
export type Event = Tables<'events'>
export type Reminder = Tables<'reminders'>
export type Nudge = Tables<'nudges'>
export type Habit = Tables<'habits'>

// Insert types
export type ProfileInsert = Inserts<'profiles'>
export type HouseholdInsert = Inserts<'households'>
export type TaskInsert = Inserts<'tasks'>
export type IntegrationInsert = Inserts<'integrations'>
export type EventInsert = Inserts<'events'>
export type ReminderInsert = Inserts<'reminders'>
export type NudgeInsert = Inserts<'nudges'>
export type HabitInsert = Inserts<'habits'>

// Update types
export type ProfileUpdate = Updates<'profiles'>
export type HouseholdUpdate = Updates<'households'>
export type TaskUpdate = Updates<'tasks'>
export type IntegrationUpdate = Updates<'integrations'>
export type EventUpdate = Updates<'events'>
export type ReminderUpdate = Updates<'reminders'>
export type NudgeUpdate = Updates<'nudges'>
export type HabitUpdate = Updates<'habits'>

// View types
export type PerformanceMetrics = Database['public']['Views']['performance_metrics']['Row']

// Function types
export type HandleNewUserFunction = Database['public']['Functions']['handle_new_user']

// Enum types
export type TaskPriority = Database['public']['Enums']['task_priority']
export type TaskSource = Database['public']['Enums']['task_source']
export type UserRole = Database['public']['Enums']['user_role']
export type IntegrationProvider = Database['public']['Enums']['integration_provider']
export type AttendeeResponse = Database['public']['Enums']['attendee_response']
export type ReminderType = Database['public']['Enums']['reminder_type']
export type ReminderStrategy = Database['public']['Enums']['reminder_strategy']
export type NudgeType = Database['public']['Enums']['nudge_type']
export type NudgeActionType = Database['public']['Enums']['nudge_action_type']
export type HabitFrequency = Database['public']['Enums']['habit_frequency']
export type HabitCategory = Database['public']['Enums']['habit_category']


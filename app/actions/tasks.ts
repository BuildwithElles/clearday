import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

export async function fetchTasks(date?: string): Promise<Task[]> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null); // Only get non-deleted tasks

    // Filter by date if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('due_date', startOfDay.toISOString())
        .lte('due_date', endOfDay.toISOString());
    }

    // Sort by priority (high first) then by due time
    const { data: tasks, error } = await query
      .order('priority', { ascending: false }) // high priority first
      .order('due_time', { ascending: true, nullsFirst: false }); // earlier times first

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }

    return tasks || [];
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    throw error;
  }
}

export async function createTask(taskData: {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}): Promise<Task> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Prepare task data for insertion
    const taskInsert: TaskInsert = {
      title: taskData.title,
      description: taskData.description || null,
      user_id: user.id,
      due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
      priority: taskData.priority || 'medium',
      source: 'manual',
    };

    // Insert the task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }

    if (!task) {
      throw new Error('Task creation failed - no data returned');
    }

    return task;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
}

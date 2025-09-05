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

export async function updateTask(
  taskId: string,
  taskData: {
    title?: string;
    description?: string;
    due_date?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }
): Promise<Task> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Prepare update data
    const updateData: Partial<TaskInsert> = {
      updated_at: new Date().toISOString(),
    };

    if (taskData.title !== undefined) {
      updateData.title = taskData.title;
    }

    if (taskData.description !== undefined) {
      updateData.description = taskData.description;
    }

    if (taskData.due_date !== undefined) {
      updateData.due_date = taskData.due_date ? new Date(taskData.due_date).toISOString() : null;
    }

    if (taskData.priority !== undefined) {
      updateData.priority = taskData.priority;
    }

    // Update the task
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', user.id) // Ensure user can only update their own tasks
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }

    if (!task) {
      throw new Error('Task update failed - no data returned');
    }

    return task;
  } catch (error) {
    console.error('Error in updateTask:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Soft delete the task by setting deleted_at timestamp
    const { error } = await supabase
      .from('tasks')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('user_id', user.id) // Ensure user can only delete their own tasks
      .is('deleted_at', null); // Only delete if not already deleted

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
}
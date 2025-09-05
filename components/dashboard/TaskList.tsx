import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { TaskItem } from './TaskItem';
import { AddTaskDialog } from './AddTaskDialog';
import { fetchTasks } from '@/app/actions/tasks';

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low' | 'urgent'
  due_time?: string
  created_at: string
}

interface TaskListProps {
  date?: string
}

export function TaskList({ date }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await fetchTasks(date);
        // Map database tasks to component interface
        const mappedTasks: Task[] = fetchedTasks.map(dbTask => ({
          id: dbTask.id,
          title: dbTask.title,
          completed: dbTask.completed_at !== null,
          priority: dbTask.priority,
          due_time: dbTask.due_date || undefined,
          created_at: dbTask.created_at
        }));
        setTasks(mappedTasks);
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [date]);

  const handleTaskAdded = () => {
    // Reload tasks when a new task is added
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await fetchTasks(date);
        // Map database tasks to component interface
        const mappedTasks: Task[] = fetchedTasks.map(dbTask => ({
          id: dbTask.id,
          title: dbTask.title,
          completed: dbTask.completed_at !== null,
          priority: dbTask.priority,
          due_time: dbTask.due_date || undefined,
          created_at: dbTask.created_at
        }));
        setTasks(mappedTasks);
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  };

  const handleToggleComplete = async (taskId: string) => {
    // TODO: Implement task completion toggle in Task 53
    console.log('Toggle task completion:', taskId);
  };

  const handleEdit = (taskId: string) => {
    // TODO: Implement task editing in Task 67
    console.log('Edit task:', taskId);
  };

  const handleDelete = (taskId: string) => {
    // TODO: Implement task deletion in Task 69
    console.log('Delete task:', taskId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
                <div className="h-5 w-12 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Circle className="h-8 w-8 mb-2 text-red-500" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Today's Tasks
          </CardTitle>
          <AddTaskDialog onTaskAdded={handleTaskAdded} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mb-2" />
              <p>No tasks for today</p>
              <p className="text-xs mt-1">Add your first task to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

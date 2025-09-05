'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskItem } from './TaskItem';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { fetchTasks, updateTask, deleteTask } from '@/app/actions/tasks';
import { Database } from '@/types/database';
import { TaskListSkeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  usePagination,
} from '@/components/ui/pagination';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskListProps {
  date?: string
}

export function TaskList({ date }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await fetchTasks(date);
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [date]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await fetchTasks(date);
      setTasks(fetchedTasks);
      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const pagination = usePagination({
    totalItems: tasks.length,
    itemsPerPage,
    currentPage,
  });

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTaskAdded = () => {
    loadTasks();
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Toggle completion status
      const isCurrentlyCompleted = task.completed_at !== null;
      const updateData = isCurrentlyCompleted
        ? { completed_at: null }
        : { completed_at: new Date().toISOString() };

      await updateTask(taskId, updateData);
      await loadTasks();
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditComplete = () => {
    setEditingTask(null);
    loadTasks();
  };

  const handleDelete = (taskId: string) => {
    setDeletingTaskId(taskId);
  };

  const confirmDelete = async () => {
    if (!deletingTaskId) return;

    try {
      await deleteTask(deletingTaskId);
      setDeletingTaskId(null);
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaskListSkeleton count={5} />
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
    <>
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
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mb-2" />
                <p>No tasks for today</p>
                <p className="text-xs mt-1">Add your first task to get started</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mb-2" />
                <p>No tasks found on this page</p>
                <p className="text-xs mt-1">Try navigating to a different page</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {tasks.length > itemsPerPage && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>
                  Showing {pagination.startItem}-{pagination.endItem} of {pagination.totalItems} tasks
                </span>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={cn(
                        !pagination.hasPrevPage && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>

                  {pagination.getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={cn(
                        !pagination.hasNextPage && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onTaskUpdated={handleEditComplete}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTaskId} onOpenChange={() => setDeletingTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

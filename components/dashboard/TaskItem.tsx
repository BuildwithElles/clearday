import { useState } from 'react';
import { CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_time?: string;
  created_at: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return null;
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        task.completed ? 'opacity-60' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-0.5"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-medium text-sm leading-tight ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
              <Badge
                variant="secondary"
                className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </Badge>
            </div>

            {task.due_time && (
              <p className="text-xs text-gray-500">
                Due: {formatTime(task.due_time)}
              </p>
            )}
          </div>

          <div className={`flex items-center gap-1 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task.id)}
              className="h-8 w-8 p-0 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

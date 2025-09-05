import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

interface Task {
  id: number
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface TaskListProps {
  tasks?: Task[]
  isLoading?: boolean
}

export function TaskList({ tasks = [], isLoading = false }: TaskListProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Today's Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <button className="flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {task.title}
                  </p>
                </div>
                <Badge
                  variant={
                    task.priority === 'high' ? 'destructive' :
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {task.priority}
                </Badge>
              </div>
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

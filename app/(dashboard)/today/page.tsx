import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, CheckCircle, Circle, Calendar, Clock, Target } from 'lucide-react'

export default function TodayPage() {
  // Get current date
  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Mock data for demonstration
  const todaysTasks = [
    { id: 1, title: 'Review project proposal', completed: false, priority: 'high' },
    { id: 2, title: 'Team standup meeting', completed: true, priority: 'medium' },
    { id: 3, title: 'Update documentation', completed: false, priority: 'low' },
  ]

  const todaysEvents = [
    { id: 1, title: 'Client presentation', time: '10:00 AM', duration: '1h' },
    { id: 2, title: 'Lunch with team', time: '12:30 PM', duration: '30m' },
  ]

  const completedTasks = todaysTasks.filter(task => task.completed).length
  const totalTasks = todaysTasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Today</h1>
        <p className="text-muted-foreground">{dateString}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Summary Section */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Overview */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Task Completion</p>
                  <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Progress</p>
                  <Progress value={completionRate} className="w-24" />
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>AI Insight:</strong> You&apos;re making great progress! You have {totalTasks - completedTasks} tasks remaining.
                  Consider tackling your high-priority items first to maximize your productivity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Today&apos;s Tasks
              </CardTitle>
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => (
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
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar/Events Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today&apos;s Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-2 rounded-lg border">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.time} • {event.duration}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-2" />
                  <p>No events scheduled</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule Event
              </Button>
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-1" />
                Set Goal
              </Button>
              <Button variant="outline" size="sm">
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, CheckCircle, Circle, Calendar, Clock, Target } from 'lucide-react'
import { DailySummary } from '@/components/dashboard/DailySummary'
import { TaskList } from '@/components/dashboard/TaskList'

export default function TodayPage() {
  // Get current date
  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Format date for database query (YYYY-MM-DD)
  const todayISO = today.toISOString().split('T')[0]

  const todaysEvents = [
    { id: 1, title: 'Client presentation', time: '10:00 AM', duration: '1h' },
    { id: 2, title: 'Lunch with team', time: '12:30 PM', duration: '30m' },
  ]

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
        <DailySummary />

        {/* Tasks Section */}
        <div className="md:col-span-1 lg:col-span-2">
          <TaskList date={todayISO} />
        </div>

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

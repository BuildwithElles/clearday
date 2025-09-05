import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, CheckCircle, Circle, Calendar, Clock, Target } from 'lucide-react'
import { DailySummary } from '@/components/dashboard/DailySummary'
import { TaskList } from '@/components/dashboard/TaskList'
import { CalendarView } from '@/components/dashboard/CalendarView'
import { fetchEvents } from '@/app/actions/events'

export default async function TodayPage() {
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

  // Fetch real events from database
  const todaysEvents = await fetchEvents(todayISO)

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
        <CalendarView
          events={todaysEvents}
          date={todayISO}
        />

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

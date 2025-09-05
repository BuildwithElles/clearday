import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, CheckCircle, Circle, Calendar, Clock, Target } from 'lucide-react'
import { DailySummary } from '@/components/dashboard/DailySummary'
import { TaskList } from '@/components/dashboard/TaskList'
import { CalendarView } from '@/components/dashboard/CalendarView'

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
        <CalendarView
          events={todaysEvents.map(event => {
            // Convert time like "10:00 AM" to proper ISO time
            const [time, period] = event.time.split(' ');
            const [hours, minutes] = time.split(':');
            let hour24 = parseInt(hours);
            if (period === 'PM' && hour24 !== 12) hour24 += 12;
            if (period === 'AM' && hour24 === 12) hour24 = 0;
            const startTime = `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
            const endTime = event.duration === '1h' ? `${(hour24 + 1).toString().padStart(2, '0')}:${minutes}:00` : `${hour24}:${parseInt(minutes) + 30}:00`;

            return {
              id: event.id.toString(),
              title: event.title,
              start_time: `${todayISO}T${startTime}Z`,
              end_time: `${todayISO}T${endTime}Z`,
            };
          })}
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TodayPage() {
  // Get current date
  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
            <CardTitle>Daily Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>Your day, already sorted</p>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>No tasks for today</p>
            </div>
          </CardContent>
        </Card>

        {/* Calendar/Events Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Today&apos;s Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>No events scheduled</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

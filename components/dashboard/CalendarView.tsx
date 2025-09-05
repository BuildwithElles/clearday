import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { EventCard } from './EventCard'
import { Event } from '@/types/database'

interface CalendarViewProps {
  date?: string
  events?: Event[]
}

export function CalendarView({ date, events = [] }: CalendarViewProps) {
  const today = date ? new Date(date) : new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = []
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(hour)
  }

  // Filter events for today
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_time).toDateString()
    return eventDate === today.toDateString()
  })

  // Group events by hour
  const eventsByHour = todaysEvents.reduce((acc, event) => {
    const hour = new Date(event.start_time).getHours()
    if (!acc[hour]) acc[hour] = []
    acc[hour].push(event)
    return acc
  }, {} as Record<number, Event[]>)

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return '12 PM'
    return `${hour - 12} PM`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar - {dateString}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {timeSlots.map(hour => {
            const hourEvents = eventsByHour[hour] || []

            return (
              <div key={hour} className="flex gap-3 min-h-[60px]">
                {/* Time slot */}
                <div className="flex-shrink-0 w-16 text-sm text-muted-foreground pt-2">
                  {formatHour(hour)}
                </div>

                {/* Events container */}
                <div className="flex-1 border-l border-muted pl-3">
                  {hourEvents.length > 0 ? (
                    <div className="space-y-1">
                      {hourEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center">
                      <div className="w-full h-px bg-muted" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {todaysEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No events scheduled</p>
            <p className="text-sm">Your calendar is free for the day</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

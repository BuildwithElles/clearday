import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users } from 'lucide-react'
import { Event } from '@/types/database'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const startTime = new Date(event.start_time)
  const endTime = new Date(event.end_time)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) // minutes

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{event.title}</h4>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
            <Badge variant="secondary" className="text-xs">
              {duration}m
            </Badge>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{event.location}</span>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {event.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

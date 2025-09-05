import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, MapPin } from 'lucide-react';
import { EventCard } from './EventCard';

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
}

interface CalendarViewProps {
  events?: Event[];
  date?: string;
  onAddEvent?: () => void;
}

export function CalendarView({ events = [], date, onAddEvent }: CalendarViewProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(timeString);
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get events for a specific time slot
  const getEventsForTimeSlot = (timeSlot: string) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return eventStart.getHours() === slotHour;
    });
  };

  // Calculate event duration in hours
  const getEventDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return Math.max(0.5, durationHours); // Minimum 30 minutes
  };

  const todaysEvents = events.length > 0 ? events : [
    {
      id: '1',
      title: 'Client presentation',
      start_time: '2025-09-05T10:00:00Z',
      end_time: '2025-09-05T11:00:00Z',
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Lunch with team',
      start_time: '2025-09-05T12:30:00Z',
      end_time: '2025-09-05T13:00:00Z'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today&apos;s Schedule
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onAddEvent}>
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {timeSlots.map((timeSlot) => {
            const slotEvents = getEventsForTimeSlot(timeSlot);
            const hasEvents = slotEvents.length > 0;

            return (
              <div
                key={timeSlot}
                className={`flex items-start space-x-3 p-2 rounded-lg transition-colors ${
                  selectedTime === timeSlot ? 'bg-muted' : 'hover:bg-muted/50'
                } ${hasEvents ? 'bg-muted/30' : ''}`}
                onClick={() => setSelectedTime(selectedTime === timeSlot ? null : timeSlot)}
              >
                {/* Time Slot */}
                <div className="w-16 text-xs text-muted-foreground font-mono flex-shrink-0 pt-1">
                  {formatTime(timeSlot)}
                </div>

                {/* Events or Empty Slot */}
                <div className="flex-1 min-w-0">
                  {hasEvents ? (
                    <div className="space-y-2">
                      {slotEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onClick={() => {
                            // Handle event click - could open event details modal
                            console.log('Event clicked:', event);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-8 flex items-center">
                      <div className="w-full border-t border-dashed border-muted-foreground/30"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {todaysEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground mt-4">
            <Calendar className="h-8 w-8 mb-2" />
            <p className="text-sm">No events scheduled for today</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={onAddEvent}>
              <Plus className="h-4 w-4 mr-1" />
              Schedule Event
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

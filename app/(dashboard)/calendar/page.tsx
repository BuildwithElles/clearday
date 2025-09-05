import { CalendarView } from '@/components/dashboard/CalendarView';
import { fetchEvents } from '@/app/actions/events';

export default async function CalendarPage() {
  // Fetch today's events
  const events = await fetchEvents();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View and manage your schedule</p>
      </div>

      <CalendarView events={events.map(event => ({
        ...event,
        location: event.location || undefined,
        description: event.description || undefined
      }))} />
    </div>
  );
}

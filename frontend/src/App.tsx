import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router' // marsrytu // как. мрш. подх.
import { AppLayout } from './app/AppLayout'
import { events as initialEvents } from './data/events'
import { EditEventPage } from './pages/EditEventPage'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { EventsPage } from './pages/EventsPage'
import { NewEventPage } from './pages/NewEventPage'
import { NotFoundPage } from './pages/NotFoundPage'
import type { Event, EventDraft } from './types/event'
import './App.css'

function eventFromDraft(id: string, draft: EventDraft): Event {
  const { rating, ...eventFields } = draft

  return {
    ...eventFields,
    id,
    rating: Number(rating),
  }
}

export default function App() {
  const [events, setEvents] = useState<Event[]>(() =>
    initialEvents.map((event) => ({ ...event })),
  )

  function createEvent(draft: EventDraft): string {
    const id = crypto.randomUUID()
    const event = eventFromDraft(id, draft)

    setEvents((current) => [...current, event])
    return id
  }

  function updateEvent(id: string, draft: EventDraft): void {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? eventFromDraft(event.id, draft) : event,
      ),
    )
  }

  function deleteEvent(id: string): void {
    setEvents((current) => current.filter((event) => event.id !== id))
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/events" replace />} />
        <Route path="events" element={<EventsPage events={events} />} />
        <Route path="events/new" element={<NewEventPage onCreate={createEvent} />} />
        <Route
          path="events/:id"
          element={<EventDetailsPage events={events} onDelete={deleteEvent} />}
        />
        <Route
          path="events/:id/edit"
          element={<EditEventPage events={events} onUpdate={updateEvent} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

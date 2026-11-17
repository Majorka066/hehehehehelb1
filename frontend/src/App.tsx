import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
import { EditEventPage } from './pages/EditEventPage'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { EventsPage } from './pages/EventsPage'
import { NewEventPage } from './pages/NewEventPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { supabase } from './lib/supabase'
import { createEvent, deleteEvent, getEvents, updateEvent } from './services/events'
import type { EventDraft } from './types/event'
import type { EventsLoad } from './types/eventsLoad'
import './App.css'

export default function App() {
  const auth = useAuth() // polych result works huka autorisation
  const [load, setLoad] = useState<EventsLoad>({ status: 'loading' })

  const requestEvents = useCallback(async (userId: string) => {
    try {
      const data = await getEvents()
      setLoad({ status: 'success', data, userId })
    } catch (reason: unknown) {
      setLoad({
        status: 'error',
        message: reason instanceof Error ? reason.message : 'Не удалось загрузить мероприятия.',
      })
    }
  }, [])

  useEffect(() => {
    if (auth.status === 'authenticated') {
      void Promise.resolve().then(() => requestEvents(auth.session.user.id)) // id users
    }
  }, [auth, requestEvents])

  async function handleCreate(draft: EventDraft): Promise<string> {
    const event = await createEvent(draft)
    setLoad((current) => current.status === 'success'
      ? { ...current, data: [event, ...current.data] }
      : current)
    return event.id
  }

  async function handleUpdate(id: string, draft: EventDraft): Promise<void> {
    await updateEvent(id, draft)
    setLoad((current) => current.status === 'success'
      ? {
          ...current,
          data: current.data.map((event) => event.id === id
            ? { ...event, ...draft, rating: Number(draft.rating) }
            : event),
        }
      : current)
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteEvent(id)
    setLoad((current) => current.status === 'success'
      ? { ...current, data: current.data.filter((event) => event.id !== id) }
      : current)
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error
  }

  const userId = auth.status === 'authenticated' ? auth.session.user.id : null
  const currentLoad = load.status === 'success' && load.userId !== userId
    ? { status: 'loading' as const }
    : load
  const events = currentLoad.status === 'success' ? currentLoad.data : []

  function retryEvents() {
    if (!userId) return
    setLoad({ status: 'loading' })
    void requestEvents(userId)
  }
                                              // rt el. requireauth - nelz open
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage auth={auth} />} />
      <Route element={<RequireAuth auth={auth} />}>
        <Route
          element={(
            <AppLayout
              email={auth.status === 'authenticated' ? auth.session.user.email ?? 'Пользователь' : ''}
              onSignOut={handleSignOut}
            />
          )}
        >
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<EventsPage events={events} load={currentLoad} onRetry={retryEvents} />} />
          <Route path="events/new" element={<NewEventPage onCreate={handleCreate} />} />
          <Route path="events/:id" element={<EventDetailsPage events={events} load={currentLoad} onDelete={handleDelete} />} />
          <Route path="events/:id/edit" element={<EditEventPage events={events} load={currentLoad} onUpdate={handleUpdate} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

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
import { createEvent, deleteEvent, updateEvent } from './services/events'
import type { EventDraft } from './types/event'
import './App.css'

export default function App() {
  const auth = useAuth() // polych result works huka autorisation

  async function handleCreate(draft: EventDraft): Promise<string> {
    const saved = await createEvent(draft)
    return saved.id
  }

  async function handleUpdate(id: string, draft: EventDraft): Promise<void> {
    await updateEvent(id, draft)
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteEvent(id)
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage auth={auth} />} />
      <Route element={<RequireAuth auth={auth} />}> {/* rt el. requireauth - nelz open */}
        <Route element={(
          <AppLayout
            email={auth.status === 'authenticated' ? auth.session.user.email ?? 'Пользователь' : ''}
            onSignOut={handleSignOut}
          />
        )}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={auth.status === 'authenticated'
            ? <EventsPage key={auth.session.user.id} userId={auth.session.user.id} />
            : null} />
          <Route path="events/new" element={<NewEventPage onCreate={handleCreate} />} />
          <Route path="events/:id" element={<EventDetailsPage onDelete={handleDelete} />} />
          <Route path="events/:id/edit" element={<EditEventPage onUpdate={handleUpdate} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

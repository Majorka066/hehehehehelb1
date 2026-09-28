import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { EventsPage } from './pages/EventsPage'
import { NewEventPage } from './pages/NewEventPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/events" replace />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/new" element={<NewEventPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

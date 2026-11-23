import { Link, useNavigate, useParams } from 'react-router'
import { EventForm } from '../components/EventForm'
import { useEvent } from '../hooks/useEvent'
import type { EventDraft } from '../types/event'

type EditEventPageProps = {
  onUpdate: (id: string, draft: EventDraft) => Promise<void>
}

function toDateTimeInput(value: string) {
  const date = new Date(value)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

export function EditEventPage({ onUpdate }: EditEventPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const load = useEvent(id)
  const event = load.status === 'success' ? load.data : null

  if (load.status === 'loading') {
    return <p className="request-state" role="status">Загружаем мероприятие…</p>
  }

  if (load.status === 'error') {
    return <p className="form-error" role="alert">{load.message}</p>
  }

  if (!event) {
    return (
      <section className="message-page" aria-labelledby="missing-event-heading">
        <p className="message-page__code">404</p>
        <h1 id="missing-event-heading">Мероприятие не найдено</h1>
        <p>Невозможно открыть редактирование: записи с таким адресом нет.</p>
        <Link className="button" to="/events">К списку мероприятий</Link>
      </section>
    )
  }

  const initialValues: EventDraft = {
    title: event.title,
    description: event.description,
    startDate: toDateTimeInput(event.startDate),
    endDate: toDateTimeInput(event.endDate),
    location: event.location,
    category: event.category,
    status: event.status,
    rating: String(event.rating),
  }

  return (
    <section className="form-page" aria-labelledby="edit-event-heading">
      <p className="eyebrow">Редактирование</p>
      <h1 id="edit-event-heading">Изменение мероприятия</h1>
      <p className="form-page__lead">Изменения попадут в карточку только после сохранения формы.</p>
      <EventForm
        key={event.id}
        initialValues={initialValues}
        onSave={async (draft) => {
          await onUpdate(event.id, draft)
          navigate(`/events/${event.id}`)
        }}
        onCancel={() => navigate(`/events/${event.id}`)}
      />
    </section>
  )
}

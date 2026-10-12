import { useNavigate } from 'react-router'
import { EventForm } from '../components/EventForm'
import type { EventDraft } from '../types/event'

type NewEventPageProps = {
  onCreate: (draft: EventDraft) => string
}

const emptyEvent: EventDraft = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  category: 'education',
  status: 'registration_open',
  rating: '',
}

export function NewEventPage({ onCreate }: NewEventPageProps) {
  const navigate = useNavigate()

  function handleSave(draft: EventDraft) {
    const id = onCreate(draft)
    navigate(`/events/${id}`)
  }

  return (
    <section className="form-page" aria-labelledby="new-event-heading">
      <p className="eyebrow">Новое событие</p>
      <h1 id="new-event-heading">Создание мероприятия</h1>
      <p className="form-page__lead">Заполните данные мероприятия. Они будут доступны до обновления страницы.</p>
      <EventForm
        initialValues={emptyEvent}
        onSave={handleSave}
        onCancel={() => navigate('/events')}
      />
    </section>
  )
}

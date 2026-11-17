import { useNavigate } from 'react-router' // показывает пустую КОГДА ЮЗ НАЖИМ
import { EventForm } from '../components/EventForm'
import type { EventDraft } from '../types/event'

type NewEventPageProps = {
  onCreate: (draft: EventDraft) => Promise<string>
}

const emptyEvent: EventDraft = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  category: '',
  status: 'registration_open',
  rating: '',
}

export function NewEventPage({ onCreate }: NewEventPageProps) {
  const navigate = useNavigate()

  async function handleSave(draft: EventDraft) {
    const id = await onCreate(draft)
    navigate(`/events/${id}`)
  }

  return (
    <section className="form-page" aria-labelledby="new-event-heading">
      <p className="eyebrow">Новое событие</p>
      <h1 id="new-event-heading">Создание мероприятия</h1>
      <p className="form-page__lead">Заполните данные мероприятия. После сохранения оно появится в вашем списке.</p>
      <EventForm
        initialValues={emptyEvent}
        onSave={handleSave}
        onCancel={() => navigate('/events')}
      />
    </section>
  )
}

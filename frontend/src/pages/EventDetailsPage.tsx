import { Link, useNavigate, useParams } from 'react-router'  // просмотр одной
import { eventCategoryLabels, eventStatusLabels } from '../data/events'
import type { Event } from '../types/event'
import { formatEventDate } from '../utils/formatEventDate'

type EventDetailsPageProps = {
  events: Event[]
  onDelete: (id: string) => void
}

export function EventDetailsPage({ events, onDelete }: EventDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = events.find((item) => item.id === id)
  if (!event) {
    return (
      <section className="message-page" aria-labelledby="missing-event-heading">
        <p className="message-page__code">404</p>
        <h1 id="missing-event-heading">Мероприятие не найдено</h1>
        <p>Возможно, оно было удалено или в адресе есть ошибка.</p>
        <Link className="button" to="/events">К списку мероприятий</Link>
      </section>
    )
  }

  return (
    <article className="details-page">
      <Link className="back-link" to="/events">
        <span aria-hidden="true">←</span> Ко всем мероприятиям
      </Link>

      <header className="details-page__header">
        <div className="event-card__meta">
          <span className="eyebrow">{eventCategoryLabels[event.category]}</span>
          <span className={`status status--${event.status}`}>
            {eventStatusLabels[event.status]}
          </span>
        </div>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </header>

      <div className="details-page__actions">
        <Link className="button" to={`/events/${event.id}/edit`}>Редактировать</Link>
        <button
          className="button button--danger"
          type="button"
          onClick={() => {
            if (window.confirm(`Удалить мероприятие «${event.title}»?`)) {
              onDelete(event.id)
              navigate('/events', { replace: true })
            }
          }}
        >
          Удалить
        </button>
      </div>

      <section className="details-panel" aria-label="Информация о мероприятии">
        <dl className="details-list">
          <div>
            <dt>Начало</dt>
            <dd>{formatEventDate(event.startDate)}</dd>
          </div>
          <div>
            <dt>Окончание</dt>
            <dd>{formatEventDate(event.endDate)}</dd>
          </div>
          <div>
            <dt>Место</dt>
            <dd>{event.location}</dd>
          </div>
          <div>
            <dt>Категория</dt>
            <dd>{eventCategoryLabels[event.category]}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd>{eventStatusLabels[event.status]}</dd>
          </div>
          <div>
            <dt>Код мероприятия</dt>
            <dd>{event.id}</dd>
          </div>
          <div>
            <dt>Рейтинг</dt>
            <dd>{event.rating}</dd>
          </div>
        </dl>
      </section>
    </article>
  )
}

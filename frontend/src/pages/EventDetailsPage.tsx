import { Link, useParams } from 'react-router'
import { eventCategoryLabels, events, eventStatusLabels } from '../data/events'
import { formatEventDate } from '../utils/formatEventDate'

export function EventDetailsPage() {
  const { id } = useParams()
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
        </dl>
      </section>
    </article>
  )
}

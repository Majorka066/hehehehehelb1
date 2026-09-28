import { Link } from 'react-router'
import { eventCategoryLabels, eventStatusLabels } from '../data/events'
import type { Event } from '../types/event'
import { formatEventDate } from '../utils/formatEventDate'

type EventCardProps = {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="event-card">
      <div className="event-card__meta">
        <span className="eyebrow">{eventCategoryLabels[event.category]}</span>
        <span className={`status status--${event.status}`}>
          {eventStatusLabels[event.status]}
        </span>
      </div>

      <h2>
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h2>
      <p className="event-card__description">{event.description}</p>

      <dl className="event-card__facts">
        <div>
          <dt>Начало</dt>
          <dd>{formatEventDate(event.startDate)}</dd>
        </div>
        <div>
          <dt>Место</dt>
          <dd>{event.location}</dd>
        </div>
      </dl>

      <Link className="text-link" to={`/events/${event.id}`}>
        Подробнее <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

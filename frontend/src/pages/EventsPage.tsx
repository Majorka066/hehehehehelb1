import { Link } from 'react-router' // билд список. дл каж. карт. ключ. - //
import { EventCard } from '../components/EventCard'  // показ всех карт компон
import { useState } from 'react'
import { eventStatusLabels } from '../data/events'
import type { Event, EventStatus } from '../types/event'
import type { EventsLoad } from '../types/eventsLoad'

type EventsPageProps = {
  events: Event[]
  load: EventsLoad
  onRetry: () => void
}

function isEventStatus(value: string): value is EventStatus {
  return value === 'registration_open' || value === 'few_places' || value === 'registration_closed'
}

export function EventsPage({ events, load, onRetry }: EventsPageProps) {
  const [status, setStatus] = useState<EventStatus | 'all'>('all')
  const visibleEvents = events.filter((event) => status === 'all' || event.status === status)

  return (
    <section aria-labelledby="events-heading">
      <div className="hero">
        <div>
          <p className="eyebrow">{events.length} ближайших событий</p>
          <h1 id="events-heading">Мероприятия, которые стоит посетить</h1>
          <p className="hero__lead">
            Выбирайте лекции, воркшопы и встречи, которые помогают развиваться и
            находить единомышленников.
          </p>
        </div>
        <Link className="button" to="/events/new">Создать мероприятие</Link>
      </div>

      {load.status === 'loading' ? (
        <p className="request-state" role="status">Загружаем ваши мероприятия…</p>
      ) : load.status === 'error' ? (
        <div className="request-state request-state--error" role="alert">
          <p>{load.message}</p>
          <button className="filter-reset" type="button" onClick={onRetry}>Повторить</button>
        </div>
      ) : (
        <>
      <div className="event-filter">
        <label htmlFor="event-status-filter">
          <span>Показать по статусу</span>
          <select
            id="event-status-filter"
            value={status}
            onChange={(event) => {
              const value = event.target.value

              if (value === 'all' || isEventStatus(value)) {
                setStatus(value)
              }
            }}
          >
            <option value="all">Все</option>
            <option value="registration_open">{eventStatusLabels.registration_open}</option>
            <option value="few_places">{eventStatusLabels.few_places}</option>
            <option value="registration_closed">{eventStatusLabels.registration_closed}</option>
          </select>
        </label>
        <button
          className="filter-reset"
          type="button"
          onClick={() => setStatus('all')}
          disabled={status === 'all'}
        >
          Сбросить фильтр
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <h2>Мероприятий пока нет</h2>
          <p>Здесь появятся новые события.</p>
        </div>
      ) : visibleEvents.length === 0 ? (
        <div className="empty-state">
          <h2>Нет мероприятий с выбранным статусом</h2>
          <p>Измените условия отбора или сбросьте фильтр.</p>
        </div>
      ) : (
        <div className="event-list">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
        </>
      )}
    </section>
  )
}

import { Link } from 'react-router'
import { EventCard } from '../components/EventCard'
import { events } from '../data/events'

export function EventsPage() {
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

      {events.length === 0 ? (
        <div className="empty-state">
          <h2>Мероприятий пока нет</h2>
          <p>Здесь появятся новые события.</p>
        </div>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}

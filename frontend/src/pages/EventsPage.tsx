import { useEffect, useState } from 'react'
import { Link } from 'react-router' // билд список. дл каж. карт. ключ. - //
import { EventCard } from '../components/EventCard' // показ всех карт компон
import { EventFiltersForm } from '../components/EventFiltersForm'
import { emptyEventFilters, getEvents } from '../services/events'
import type { EventFilters } from '../services/events'
import type { EventsLoad } from '../types/eventsLoad'

export function EventsPage({ userId }: { userId: string }) {
  const [filters, setFilters] = useState<EventFilters>(emptyEventFilters)
  const [attempt, setAttempt] = useState(0)
  const [load, setLoad] = useState<EventsLoad>({ status: 'loading' })

  useEffect(() => {
    let active = true
    getEvents(filters).then((data) => {
      if (active) setLoad({ status: 'success', data, userId })
    }).catch((reason: unknown) => {
      if (active) setLoad({ status: 'error', message: reason instanceof Error ? reason.message : 'Не удалось загрузить мероприятия.' })
    })
    return () => { active = false }
  }, [filters, attempt, userId])

  function apply(next: EventFilters) {
    setLoad({ status: 'loading' })
    setFilters(next)
  }

  function retry() {
    setLoad({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  const hasFilters = filters.query !== '' || filters.status !== 'all' || filters.categoryId !== 'all'
  const events = load.status === 'success' && load.userId === userId ? load.data : []

  return (
    <section aria-labelledby="events-heading">
      <div className="hero">
        <div>
          <p className="eyebrow">Ваши мероприятия</p>
          <h1 id="events-heading">Мероприятия, которые стоит посетить</h1>
          <p className="hero__lead">Создавайте мероприятия и находите их по названию, статусу и категории.</p>
        </div>
        <Link className="button" to="/events/new">Создать мероприятие</Link>
      </div>

      <EventFiltersForm key={`${filters.query}|${filters.status}|${filters.categoryId}`} value={filters} pending={load.status === 'loading'} onApply={apply} />

      {load.status === 'loading' ? (
        <p className="request-state" role="status">Загружаем ваши мероприятия…</p>
      ) : load.status === 'error' ? (
        <div className="request-state request-state--error" role="alert">
          <p>{load.message}</p>
          <button className="filter-reset" type="button" onClick={retry}>Повторить</button>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          {hasFilters ? (
            <><h2>Совпадений нет</h2><p>Попробуйте другие условия поиска.</p>
              <button className="filter-reset" type="button" onClick={() => apply(emptyEventFilters)}>Сбросить фильтры</button></>
          ) : (
            <><h2>Мероприятий пока нет</h2><p>Создайте первое мероприятие.</p>
              <Link className="button" to="/events/new">Создать мероприятие</Link></>
          )}
        </div>
      ) : (
        <div className="event-list">
          {events.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </section>
  )
}

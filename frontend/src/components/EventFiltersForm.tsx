import { useState } from 'react'
import type { FormEvent } from 'react'
import { eventStatusLabels } from '../data/events'
import { useCategories } from '../hooks/useCategories'
import { emptyEventFilters } from '../services/events'
import type { EventFilters } from '../services/events'

type Props = {
  value: EventFilters
  pending: boolean
  onApply: (filters: EventFilters) => void
}

export function EventFiltersForm({ value, pending, onApply }: Props) {
  const [draft, setDraft] = useState<EventFilters>(value)
  const { load, retry } = useCategories()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply({ ...draft, query: draft.query.trim() })
  }

  function reset() {
    setDraft(emptyEventFilters)
    onApply(emptyEventFilters)
  }

  return (
    <form className="event-filter" onSubmit={submit}>
      <label htmlFor="event-query-filter">
        <span>Поиск по названию</span>
        <input id="event-query-filter" maxLength={100} value={draft.query}
          onChange={(event) => setDraft({ ...draft, query: event.target.value })} />
      </label>
      <label htmlFor="event-status-filter">
        <span>Статус</span>
        <select id="event-status-filter" value={draft.status}
          onChange={(event) => setDraft({ ...draft, status: event.target.value as EventFilters['status'] })}>
          <option value="all">Все</option>
          <option value="registration_open">{eventStatusLabels.registration_open}</option>
          <option value="few_places">{eventStatusLabels.few_places}</option>
          <option value="registration_closed">{eventStatusLabels.registration_closed}</option>
        </select>
      </label>
      <label htmlFor="event-category-filter">
        <span>Категория</span>
        <select id="event-category-filter" value={draft.categoryId}
          disabled={load.status !== 'success'}
          onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
          <option value="all">Все</option>
          {load.status === 'success' && load.data.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      {load.status === 'error' && <div role="alert"><p>{load.message}</p><button className="filter-reset" type="button" onClick={retry}>Повторить</button></div>}
      <button className="button" type="submit" disabled={pending}>{pending ? 'Ищем…' : 'Применить'}</button>
      <button className="filter-reset" type="button" onClick={reset} disabled={pending}>Сбросить</button>
    </form>
  )
}

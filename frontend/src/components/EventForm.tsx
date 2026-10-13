import { useState } from 'react' // форма, для двух
import type { FormEvent } from 'react'
import type { EventCategory, EventDraft, EventStatus } from '../types/event'

type EventFormProps = {
  initialValues: EventDraft
  onSave: (draft: EventDraft) => void
  onCancel: () => void
}

function isEventStatus(value: string): value is EventStatus {
  return value === 'registration_open' || value === 'few_places' || value === 'registration_closed'
}

function isEventCategory(value: string): value is EventCategory {
  return value === 'education' || value === 'technology' || value === 'culture' || value === 'career'
}

export function EventForm({ initialValues, onSave, onCancel }: EventFormProps) {
  const [draft, setDraft] = useState(() => ({ ...initialValues }))
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = draft.title.trim()
    const description = draft.description.trim()
    const location = draft.location.trim()
    const rating = Number(draft.rating)

    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }

    if (!description) {
      setError('Добавьте описание мероприятия.')
      return
    }

    if (!location) {
      setError('Укажите место проведения.')
      return
    }

    if (!draft.startDate || !draft.endDate) {
      setError('Укажите дату и время начала и окончания.')
      return
    }

    if (new Date(draft.endDate) <= new Date(draft.startDate)) {
      setError('Время окончания должно быть позже времени начала.')
      return
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setError('Рейтинг должен быть числом от 1 до 5.')
      return
    }

    setError('')
    onSave({ ...draft, title, description, location })
  }

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      <div className="event-form__grid">
        <label className="event-form__field event-form__field--wide" htmlFor="event-title">
          <span>Название</span>
          <input
            id="event-title"
            value={draft.title}
            required
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
        </label>

        <label className="event-form__field event-form__field--wide" htmlFor="event-description">
          <span>Описание</span>
          <textarea
            id="event-description"
            value={draft.description}
            required
            rows={5}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
        </label>

        <label className="event-form__field" htmlFor="event-start-date">
          <span>Начало</span>
          <input
            id="event-start-date"
            type="datetime-local"
            value={draft.startDate}
            required
            onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
          />
        </label>

        <label className="event-form__field" htmlFor="event-end-date">
          <span>Окончание</span>
          <input
            id="event-end-date"
            type="datetime-local"
            value={draft.endDate}
            required
            onChange={(event) => setDraft({ ...draft, endDate: event.target.value })}
          />
        </label>

        <label className="event-form__field event-form__field--wide" htmlFor="event-location">
          <span>Место проведения</span>
          <input
            id="event-location"
            value={draft.location}
            required
            onChange={(event) => setDraft({ ...draft, location: event.target.value })}
          />
        </label>

        <label className="event-form__field" htmlFor="event-category">
          <span>Категория</span>
          <select
            id="event-category"
            value={draft.category}
            onChange={(event) => {
              const category = event.target.value

              if (isEventCategory(category)) {
                setDraft({ ...draft, category })
              }
            }}
          >
            <option value="education">Образование</option>
            <option value="technology">Технологии</option>
            <option value="culture">Культура</option>
            <option value="career">Карьера</option>
          </select>
        </label>

        <label className="event-form__field" htmlFor="event-status">
          <span>Статус</span>
          <select
            id="event-status"
            value={draft.status}
            onChange={(event) => {
              const status = event.target.value

              if (isEventStatus(status)) {
                setDraft({ ...draft, status })
              }
            }}
          >
            <option value="registration_open">Идёт регистрация</option>
            <option value="few_places">Мало мест</option>
            <option value="registration_closed">Регистрация закрыта</option>
          </select>
        </label>

        <label className="event-form__field" htmlFor="event-rating">
          <span>Рейтинг</span>
          <input
            id="event-rating"
            type="number"
            inputMode="decimal"
            min="1"
            max="5"
            step="0.1"
            value={draft.rating}
            required
            onChange={(event) => setDraft({ ...draft, rating: event.target.value })}
          />
        </label>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="event-form__actions">
        <button className="button" type="submit">Сохранить</button>
        <button className="button button--secondary" type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}

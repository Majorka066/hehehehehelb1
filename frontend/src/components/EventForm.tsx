import { useState } from 'react' // форма, для двух
import type { FormEvent } from 'react'
import { useCategories } from '../hooks/useCategories'
import type { EventDraft, EventStatus } from '../types/event'

type EventFormProps = {
  initialValues: EventDraft
  onSave: (draft: EventDraft) => Promise<void> // 1.
  onCancel: () => void
}

function isEventStatus(value: string): value is EventStatus {
  return value === 'registration_open' || value === 'few_places' || value === 'registration_closed'
}

export function EventForm({ initialValues, onSave, onCancel }: EventFormProps) {
  const [draft, setDraft] = useState(() => ({ ...initialValues }))
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [pending, setPending] = useState(false)
  const { load, retry } = useCategories()
  const categories = load.status === 'success' ? load.data : []
  const selectedCategoryExists = categories.some((category) => category.id === draft.category)
  const canSave = load.status === 'success' && selectedCategoryExists

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSave) {
      setError('Дождитесь справочника и выберите доступную категорию.')
      return
    }

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
    setSubmitError('')
    setPending(true) // zprs start

    try {
      await onSave({ ...draft, title, description, location }) // отв бд
    } catch (reason: unknown) {
      setSubmitError(reason instanceof Error ? reason.message : 'Не удалось сохранить мероприятие.')
    } finally {
      setPending(false)               // snim sost ozhud
    }
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
            required
            disabled={load.status !== 'success' || categories.length === 0}
            onChange={(event) => setDraft({ ...draft, category: event.target.value })}
          >
            <option value="">Выберите категорию</option>
            {draft.category !== '' && !selectedCategoryExists && (
              <option value={draft.category} disabled>
                Текущий код: {draft.category} — выберите доступную категорию
              </option>
            )}
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <div className="event-form__reference-state event-form__field--wide">
          {load.status === 'loading' && <p role="status">Загружаем категории…</p>}
          {load.status === 'error' && (
            <div>
              <p role="alert">{load.message}</p>
              <button className="filter-reset" type="button" onClick={retry}>Повторить</button>
            </div>
          )}
          {load.status === 'success' && categories.length === 0 && (
            <div>
              <p role="status">Категорий пока нет. Сохранение недоступно.</p>
              <button className="filter-reset" type="button" onClick={retry}>Повторить</button>
            </div>
          )}
          {load.status === 'success' && categories.length > 0 && (
            <button className="filter-reset" type="button" onClick={retry}>Обновить справочник</button>
          )}
          {load.status === 'success' && draft.category !== '' && !selectedCategoryExists && (
            <p role="alert">Выберите доступную категорию для сохранения.</p>
          )}
        </div>

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
      {submitError && <p className="form-error" role="alert">{submitError}</p>}

      <div className="event-form__actions">
        <button className="button" type="submit" disabled={!canSave || pending}>
          {pending ? 'Сохраняем…' : 'Сохранить'}
        </button>
        <button className="button button--secondary" type="button" onClick={onCancel} disabled={pending}>Отмена</button>
      </div>
    </form>
  )
}

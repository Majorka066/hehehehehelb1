import { Link } from 'react-router'

export function NewEventPage() {
  return (
    <section className="form-placeholder" aria-labelledby="new-event-heading">
      <p className="eyebrow">Новое событие</p>
      <h1 id="new-event-heading">Создание мероприятия</h1>
      <p>
        Форма с вводом названия, даты, места и описания появится в лабораторной работе № 3.
      </p>
      <p className="form-placeholder__note">
        На этом этапе приложение использует типизированные демонстрационные данные без сохранения.
      </p>
      <Link className="button" to="/events">Вернуться к списку</Link>
    </section>
  )
}

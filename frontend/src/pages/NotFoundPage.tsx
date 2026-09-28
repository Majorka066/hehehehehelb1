import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="message-page" aria-labelledby="not-found-heading">
      <p className="message-page__code">404</p>
      <h1 id="not-found-heading">Страница не найдена</h1>
      <p>Такого адреса в приложении нет. Вернитесь к актуальным событиям.</p>
      <Link className="button" to="/events">К списку мероприятий</Link>
    </section>
  )
}

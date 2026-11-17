import { useState } from 'react'
import { NavLink, Outlet } from 'react-router' // obs obolochka navig/ outlet //

type AppLayoutProps = {
  email: string
  onSignOut: () => Promise<void>
}

export function AppLayout({ email, onSignOut }: AppLayoutProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSignOut() {
    setPending(true)
    setError('')

    try {
      await onSignOut()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Не удалось выйти из аккаунта.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink
          className="brand"
          to="/events"
          aria-label="Планировщик мероприятий - главная"
        >
          <span className="brand__mark" aria-hidden="true">M</span>
          <span>Место встречи</span>
        </NavLink>

        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink to="/events" end>Мероприятия</NavLink>
          <NavLink to="/events/new">Создать</NavLink>
          <span className="account-email">{email}</span>
          <button className="nav-sign-out" type="button" onClick={handleSignOut} disabled={pending}>
            {pending ? 'Выходим…' : 'Выйти'}
          </button>
        </nav>
      </header>

      <p className="memory-notice">
        Мероприятия сохраняются в вашем аккаунте и не видны другим пользователям.
      </p>
      {error && <p className="layout-error" role="alert">{error}</p>}

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>Планируйте события и находите новые точки притяжения.</p>
      </footer>
    </div>
  )
}

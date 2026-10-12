import { NavLink, Outlet } from 'react-router' // obs obolochka navig/ outlet //

export function AppLayout() {
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
        </nav>
      </header>

      <p className="memory-notice">
        Изменения хранятся только до обновления страницы. После обновления вернутся демонстрационные мероприятия.
      </p>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>Планируйте события и находите новые точки притяжения.</p>
      </footer>
    </div>
  )
}

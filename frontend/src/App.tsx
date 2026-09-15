import './App.css'

const appTitle: string = 'Планировщик мероприятий'

export default function App() {
  return (
    <main className="app">
      <h1>{appTitle}</h1>

      <p>
        Планирование мероприятий, просмотр событий и регистрация на них.
      </p>

      <section>
        <h2>Предстоящие мероприятия</h2>

        <p>
          Здесь появится список доступных мероприятий.
        </p>
      </section>
    </main>
  )
}
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import type { AuthState } from '../hooks/useAuth'

type AuthPageProps = {
  auth: AuthState
}

type AuthMode = 'sign-in' | 'sign-up'

function getReturnPath(state: unknown) {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as { from?: unknown }).from
    if (typeof from === 'string' && from.startsWith('/')) return from
  }

  return '/events'
}

export function AuthPage({ auth }: AuthPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (auth.status === 'authenticated') {
    return <Navigate to="/events" replace />
  }

  if (auth.status === 'checking') {
    return <p className="auth-check" role="status">Проверяем вход…</p>
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'sign-up') {
        const { data, error: signUpError } = await supabase.auth.signUp({  //1 create users
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        })

        if (signUpError) throw signUpError

        if (data.session) {
          navigate(getReturnPath(location.state), { replace: true })
        } else {
          setMessage('Проверьте почту и подтвердите регистрацию по ссылке из письма.')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ //2 proverka - create sesion
          email: email.trim(),
          password,
        })

        if (signInError) throw signInError
        navigate(getReturnPath(location.state), { replace: true })
      }
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Не удалось выполнить вход. Повторите попытку.')
    } finally {
      setPending(false)
    }
  }

  const isSignUp = mode === 'sign-up'

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-heading">
        <p className="eyebrow">Планировщик мероприятий</p>
        <h1 id="auth-heading">{isSignUp ? 'Создайте аккаунт' : 'Войдите в аккаунт'}</h1>
        <p className="auth-card__lead">
          {isSignUp
            ? 'После регистрации вы будете видеть и изменять только свои мероприятия.'
            : 'Войдите, чтобы работать со своими мероприятиями.'}
        </p>

        <div className="auth-switch" aria-label="Режим авторизации">
          <button
            className={mode === 'sign-in' ? 'auth-switch__button is-active' : 'auth-switch__button'}
            type="button"
            onClick={() => { setMode('sign-in'); setError(''); setMessage('') }}
          >
            Войти
          </button>
          <button
            className={mode === 'sign-up' ? 'auth-switch__button is-active' : 'auth-switch__button'}
            type="button"
            onClick={() => { setMode('sign-up'); setError(''); setMessage('') }}
          >
            Регистрация
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="auth-email">
            <span>Email</span>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label htmlFor="auth-password">
            <span>Пароль</span>
            <input
              id="auth-password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              required
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {message && <p className="form-success" role="status">{message}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={pending}>
            {pending ? 'Подождите…' : isSignUp ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
      </section>
    </main>
  )
}

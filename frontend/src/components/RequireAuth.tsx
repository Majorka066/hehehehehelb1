import { Navigate, Outlet, useLocation } from 'react-router'
import type { AuthState } from '../hooks/useAuth'

type RequireAuthProps = {
  auth: AuthState
}

export function RequireAuth({ auth }: RequireAuthProps) { // close window for guest
  const location = useLocation()

  if (auth.status === 'checking') {
    return <p className="auth-check" role="status">Проверяем вход…</p>
  }

  if (auth.status === 'guest') {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

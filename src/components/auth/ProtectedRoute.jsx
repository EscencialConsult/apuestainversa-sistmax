import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Guard de rutas: valida sesión y rol contra la ruta solicitada.
 * - Sin sesión → /login (recordando la ruta de origen).
 * - Con sesión pero rol no autorizado → /unauthorized.
 * - allowedRoles vacío = cualquier usuario autenticado.
 *
 * Uso como wrapper de layout: <Route element={<ProtectedRoute />}>...</Route>
 * Uso por ruta: <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><Page /></ProtectedRoute>
 */
const EMPTY_ROLES = []

export function ProtectedRoute({ allowedRoles = EMPTY_ROLES, children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ?? <Outlet />
}

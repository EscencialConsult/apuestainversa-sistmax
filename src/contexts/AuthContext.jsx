import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { signFakeJwt, decodeJwt } from '../utils/fakeJwt'
import { resolveTenantId } from '../config/tenants'
import { ROLES, ROLE_LABELS } from '../config/roles'

const TOKEN_KEY = 'jwt_token'

const AuthContext = createContext(null)

function userFromToken() {
  const payload = decodeJwt(localStorage.getItem(TOKEN_KEY))
  if (!payload) return null
  return {
    id:       payload.sub,
    name:     payload.name,
    email:    payload.email,
    role:     payload.role,
    tenantId: payload.tenant_id,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(userFromToken)

  /**
   * Login simulado: firma un JWT local con tenant_id + rol.
   * Cuando exista backend, este método pasará a llamar a POST /auth/login
   * vía apiClient y guardará el token real — la interfaz no cambia.
   */
  const login = useCallback(async ({ email, name, role }) => {
    const token = signFakeJwt({
      sub:       crypto.randomUUID(),
      email,
      name,
      role,
      tenant_id: resolveTenantId(),
    })
    localStorage.setItem(TOKEN_KEY, token)
    setUser(userFromToken())
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const hasRole = useCallback((role) => {
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  }, [user])

  const hasAnyRole = useCallback((...roles) => roles.some(r => hasRole(r)), [hasRole])

  // Memoizado: este contexto se consume en toda la app; un value inline
  // re-renderizaría cada consumidor en cada render del provider.
  const value = useMemo(() => ({
    user,
    isAuthenticated: user != null,
    login, logout, hasRole, hasAnyRole,
    ROLES, ROLE_LABELS,
  }), [user, login, logout, hasRole, hasAnyRole])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

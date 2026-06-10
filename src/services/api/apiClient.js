import axios from 'axios'
import { resolveTenantId } from '../../config/tenants'

/**
 * Cliente HTTP global. TODA petición al backend pasa por acá.
 * Garantiza el aislamiento multi-tenant inyectando x-tenant-id en cada request.
 */
export const apiClient = axios.create({
  // Vite expone variables de entorno como import.meta.env.VITE_*
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30_000,
})

apiClient.interceptors.request.use((config) => {
  // Aislamiento estricto: el backend revalida este header contra el JWT
  config.headers['x-tenant-id'] = resolveTenantId()

  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Sesión expirada o token inválido → forzar re-login
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

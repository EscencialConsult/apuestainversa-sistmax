import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { ROLES, ROLE_LABELS } from '../../config/roles'
import { useTenant } from '../../contexts/TenantContext'
import { cn } from '../../utils/cn'

export function LoginPage() {
  const { login }    = useAuth()
  const { tenant }   = useTenant()
  const navigate     = useNavigate()
  const location     = useLocation()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  // Selector de rol — solo mientras el login es simulado (sin backend real)
  const [role,     setRole]     = useState(ROLES.ADMIN)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Ingrese email y contraseña.')
      return
    }
    setLoading(true)
    try {
      await login({ email, name: email.split('@')[0], role })
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch {
      setError('No se pudo iniciar sesión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tenant-bg px-4 font-sans">

      {/* Glow decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-tenant-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-tenant-accent/10 blur-3xl" />
      </div>

      <div className={cn(
        'relative w-full max-w-sm flex flex-col gap-6 p-8',
        'rounded-2xl bg-tenant-surface/60 backdrop-blur-glass',
        'border border-tenant-border/40 shadow-panel animate-fade-in',
      )}>

        {/* Marca */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="/imgone/one-logocolor-convertido-de-png.webp"
            alt="ONE"
            className="h-10 w-auto"
          />
          <div>
            <p className="font-display text-base font-bold text-tenant-text tracking-tight">INVERSA.Bid</p>
            <p className="text-xs text-tenant-muted mt-0.5">{tenant?.name ?? 'Sistema de Subastas'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tenant-muted" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl',
                'bg-white/5 border border-tenant-border/40 text-tenant-text',
                'placeholder:text-tenant-muted',
                'focus:outline-none focus:border-tenant-primary/50',
                'focus-visible:ring-2 focus-visible:ring-tenant-primary/40',
              )}
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tenant-muted" aria-hidden="true" />
            <input
              id="login-password"
              type="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl',
                'bg-white/5 border border-tenant-border/40 text-tenant-text',
                'placeholder:text-tenant-muted',
                'focus:outline-none focus:border-tenant-primary/50',
                'focus-visible:ring-2 focus-visible:ring-tenant-primary/40',
              )}
            />
          </div>

          {/* Selector de rol — SOLO desarrollo, se elimina con el backend real */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="login-rol-dev"
              className="text-[10px] uppercase tracking-wider text-tenant-warning font-semibold"
            >
              Simular rol (dev)
            </label>
            <select
              id="login-rol-dev"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={cn(
                'w-full px-3 py-2.5 text-sm rounded-xl',
                'bg-white/5 border border-tenant-border/40 text-tenant-text',
                'focus:outline-none focus:border-tenant-primary/50',
                'focus-visible:ring-2 focus-visible:ring-tenant-primary/40',
              )}
            >
              {Object.values(ROLES).map(r => (
                <option key={r} value={r} className="bg-tenant-surface">{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>

          {error && (
            <p role="alert" className="text-xs text-tenant-danger text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl',
              'bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary',
              'text-sm font-semibold transition-colors shadow-neon',
              'hover:bg-tenant-primary/30',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tenant-primary/60',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {loading
              ? <span className="w-4 h-4 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" aria-hidden="true" />
              : <LogIn className="w-4 h-4" aria-hidden="true" />
            }
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>

        </form>

        <p className="text-[10px] text-tenant-muted text-center">
          Sistema Integral de Subasta Inversa en Línea
        </p>
      </div>
    </div>
  )
}

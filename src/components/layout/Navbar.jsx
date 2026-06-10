import { useState } from 'react'
import { Bell, Menu, LogOut, Settings, ChevronDown, Wifi, WifiOff } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'
import { useAuth } from '../../contexts/AuthContext'

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Nueva oferta en Expediente EXP-2025-0142', time: 'hace 2 min', unread: true },
  { id: 2, text: 'Proveedor "Construcciones SA" aprobó documentación', time: 'hace 15 min', unread: true },
  { id: 3, text: 'Subasta EXP-2025-0139 finalizada', time: 'hace 1h', unread: false },
]

export function Navbar({ onMenuToggle, sidebarCollapsed }) {
  const { tenant } = useTenant()
  const { user, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [isOnline] = useState(true)
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 flex items-center gap-4 px-4',
        'bg-tenant-surface/70 backdrop-blur-glass border-b border-tenant-border/40',
        'transition-all duration-300',
        // Mobile: full width. Desktop: offset según ancho del sidebar.
        'left-0',
        sidebarCollapsed ? 'lg:left-16' : 'lg:left-64',
      )}
    >
      {/* Mobile menu button */}
      <button
        type="button"
        aria-label="Abrir menú de navegación"
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl text-tenant-muted hover:text-tenant-primary hover:bg-tenant-primary/10 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb / Título de la sección */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-tenant-text truncate">
          {tenant.name}
        </h1>
        <p className="text-[11px] text-tenant-muted">Sistema Integral de Subasta Inversa</p>
      </div>

      {/* Status en tiempo real */}
      <div className={cn(
        'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border',
        isOnline
          ? 'border-tenant-success/30 text-tenant-success bg-tenant-success/10'
          : 'border-tenant-danger/30 text-tenant-danger bg-tenant-danger/10',
      )}>
        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {isOnline ? 'En línea' : 'Sin conexión'}
      </div>

      {/* Notificaciones */}
      <div className="relative">
        <button
          type="button"
          aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
          onClick={() => { setNotifOpen(v => !v); setUserOpen(false) }}
          className="relative p-2 rounded-xl text-tenant-muted hover:text-tenant-primary hover:bg-tenant-primary/10 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-tenant-danger text-white text-[9px] font-bold flex items-center justify-center shadow-neon">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-tenant-surface/95 backdrop-blur-glass border border-tenant-border/50 shadow-panel animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-tenant-border/30">
              <p className="text-sm font-semibold text-tenant-text">Notificaciones</p>
            </div>
            {MOCK_NOTIFICATIONS.map(n => (
              <div
                key={n.id}
                className={cn(
                  'px-4 py-3 text-xs border-b border-tenant-border/20 last:border-0 transition-colors hover:bg-white/5',
                  n.unread && 'bg-tenant-primary/5',
                )}
              >
                <p className={cn('leading-snug', n.unread ? 'text-tenant-text' : 'text-tenant-muted')}>{n.text}</p>
                <p className="text-tenant-muted mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          type="button"
          aria-label="Menú de usuario"
          onClick={() => { setUserOpen(v => !v); setNotifOpen(false) }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-tenant-primary/20 border border-tenant-primary/40 flex items-center justify-center">
            <span className="text-[11px] font-bold text-tenant-primary">
              {user?.name?.charAt(0) ?? 'U'}
            </span>
          </div>
          <span className="hidden sm:block text-xs font-medium text-tenant-text max-w-[100px] truncate">
            {user?.name}
          </span>
          <ChevronDown className="w-3 h-3 text-tenant-muted" />
        </button>
        {userOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-tenant-surface/95 backdrop-blur-glass border border-tenant-border/50 shadow-panel animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-tenant-border/30">
              <p className="text-xs font-semibold text-tenant-text">{user?.name}</p>
              <p className="text-[10px] text-tenant-muted capitalize">{user?.role?.replace(/_/g, ' ')}</p>
            </div>
            <button type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-tenant-muted hover:text-tenant-text hover:bg-white/5 transition-all">
              <Settings className="w-4 h-4" /> Configuración
            </button>
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-tenant-danger hover:bg-tenant-danger/10 transition-all"
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

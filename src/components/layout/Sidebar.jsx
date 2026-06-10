import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Zap,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'
import { useAuth } from '../../contexts/AuthContext'
import { filterNavByRole } from '../../config/navigation'

function NavItem({ item, collapsed }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const hasChildren = item.children?.length > 0
  const isActive = location.pathname.startsWith(item.path)
  const Icon = item.icon

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            'hover:bg-tenant-primary/10 hover:text-tenant-primary',
            isActive
              ? 'bg-tenant-primary/15 text-tenant-primary'
              : 'text-tenant-muted',
            collapsed && 'justify-center px-2',
          )}
        >
          <Icon className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="ml-8 mt-1 flex flex-col gap-0.5 animate-fade-in">
            {item.children.map(child => (
              <NavLink
                key={child.id}
                to={child.path}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'text-tenant-primary bg-tenant-primary/10'
                    : 'text-tenant-muted hover:text-tenant-text hover:bg-white/5',
                )}
              >
                {child.label}
                {child.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-tenant-danger/20 text-tenant-danger animate-pulse-slow">
                    {child.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        'hover:bg-tenant-primary/10 hover:text-tenant-primary',
        isActive
          ? 'bg-tenant-primary/15 text-tenant-primary shadow-neon'
          : 'text-tenant-muted',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { tenant } = useTenant()
  const { user } = useAuth()
  const navItems = filterNavByRole(user?.role)

  return (
    <>
      {/* Overlay mobile: button para que sea operable por teclado y lector */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú de navegación"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden cursor-default"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen flex flex-col',
          'bg-tenant-surface/80 backdrop-blur-glass border-r border-tenant-border/50',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
          // Mobile
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo / Brand */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-tenant-border/30',
          collapsed && 'justify-center px-2',
        )}>
          <div className="w-8 h-8 rounded-lg bg-tenant-primary/20 border border-tenant-primary/30 flex items-center justify-center shrink-0 shadow-neon">
            <Zap className="w-4 h-4 text-tenant-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-tenant-primary tracking-widest uppercase">SICST MAX</p>
              <p className="text-[10px] text-tenant-muted truncate">{tenant.shortName}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 flex flex-col gap-1 scrollbar-thin">
          {navItems.map(item => (
            <NavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* User info + Collapse toggle */}
        <div className="border-t border-tenant-border/30 p-2 flex flex-col gap-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
              <div className="w-7 h-7 rounded-full bg-tenant-primary/20 border border-tenant-primary/40 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-tenant-primary">
                  {user?.name?.charAt(0) ?? 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-tenant-text truncate">{user?.name}</p>
                <p className="text-[10px] text-tenant-muted capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-full py-2 rounded-xl text-tenant-muted hover:text-tenant-primary hover:bg-tenant-primary/10 transition-all"
            title={collapsed ? 'Expandir' : 'Colapsar'}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed
              ? <PanelLeftOpen className="w-4 h-4" />
              : <PanelLeftClose className="w-4 h-4" />
            }
          </button>
        </div>
      </aside>
    </>
  )
}

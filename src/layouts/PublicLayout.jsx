import { Outlet } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { useTenant } from '../contexts/TenantContext'
import { cn } from '../utils/cn'

export function PublicLayout() {
  const { tenant } = useTenant()

  return (
    <div className="min-h-screen bg-tenant-bg text-tenant-text flex flex-col">
      {/* Navbar mínimo — identidad del municipio, sin herramientas de gestión */}
      <header className="sticky top-0 z-50 border-b border-tenant-border/30 bg-tenant-bg/80 backdrop-blur-glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          {tenant?.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={`Logo ${tenant.name}`}
              className="h-8 w-auto flex-shrink-0"
            />
          ) : (
            <div className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
              'bg-tenant-accent/20 border border-tenant-accent/40',
            )}>
              <span className="text-[10px] font-black text-tenant-accent tracking-tighter">
                {tenant?.shortName ?? '??'}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-tenant-text leading-tight truncate">
              {tenant?.name ?? 'Municipio'}
            </p>
            <p className="text-[10px] text-tenant-muted leading-tight">
              Portal de Transparencia y Acceso Ciudadano
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-1 w-8 rounded-full bg-tenant-accent/40 shadow-[0_0_6px_rgb(var(--color-accent)/0.5)]" />
            <Globe className="w-4 h-4 text-tenant-accent" />
          </div>
        </div>
      </header>

      {/* Contenido de la ruta activa */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-tenant-border/20 py-4">
        <p className="text-center text-[10px] text-tenant-muted">
          {tenant?.name ?? 'Municipio'} · SICST MAX · Plataforma de Compras Públicas Digitales
        </p>
      </footer>
    </div>
  )
}

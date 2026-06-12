import { Outlet, Link } from 'react-router-dom'
import { useTenant } from '../contexts/TenantContext'
import { cn } from '../utils/cn'

export function PublicLayout() {
  const { tenant } = useTenant()

  return (
    <div className="min-h-screen bg-tenant-bg text-tenant-text flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-tenant-border/30 bg-tenant-bg/80 backdrop-blur-glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Identidad del municipio */}
          <Link to="/" className="flex items-center gap-3 min-w-0 flex-1">
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

            <div className="min-w-0">
              <p className="text-sm font-bold text-tenant-text leading-tight truncate">
                {tenant?.name ?? 'Municipio'}
              </p>
              <p className="text-[10px] text-tenant-muted leading-tight">
                SICST MAX
              </p>
            </div>
          </Link>

          {/* Atribución del operador — ONE */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] text-tenant-muted hidden sm:inline">por</span>
            <img
              src="/imgone/one-iconocolor-convertido-de-png.webp"
              alt="ONE"
              className="h-6 w-auto opacity-80"
            />
          </div>
        </div>
      </header>

      {/* ── Contenido ──────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-tenant-border/20 py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-tenant-muted">
            {tenant?.name ?? 'Municipio'} · Plataforma de Compras Públicas Digitales
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-tenant-muted">Operado por</span>
            <img
              src="/imgone/one-logoletra-convertido-de-png.webp"
              alt="ONE"
              className="h-4 w-auto opacity-60"
            />
          </div>
        </div>
      </footer>

    </div>
  )
}

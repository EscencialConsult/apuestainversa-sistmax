import { useState } from 'react'
import { Search, Globe, FileText, Award, Clock } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'

// Secciones previstas para el Portal Ciudadano (próxima iteración):
//   1. Buscador ciudadano — por objeto, proveedor, expediente
//   2. Grilla de procesos adjudicados (datos de aprobacionService / portalService)
//   3. Descarga de documentos públicos (Resoluciones, Actas)

const SECCIONES = [
  {
    id:          'procesos',
    icon:        Award,
    titulo:      'Procesos Adjudicados',
    descripcion: 'Accedé a todos los contratos y órdenes de compra adjudicadas por este municipio, con sus montos, proveedores y documentación oficial.',
  },
  {
    id:          'documentos',
    icon:        FileText,
    titulo:      'Documentos Públicos',
    descripcion: 'Descargá resoluciones de adjudicación, actas de recepción conforme y todo documento con valor legal generado por la plataforma.',
  },
  {
    id:          'historial',
    icon:        Clock,
    titulo:      'Historial de Contrataciones',
    descripcion: 'Consultá el registro histórico completo de licitaciones, subastas inversas y contrataciones directas desde la apertura del sistema.',
  },
]

export function PortalPage() {
  const { tenant }   = useTenant()
  const [busqueda, setBusqueda] = useState('')

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-10 space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-tenant-accent/15 border border-tenant-accent/30 shadow-[0_0_30px_rgb(var(--color-accent)/0.2)]">
            <Globe className="w-10 h-10 text-tenant-accent" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-tenant-text leading-tight">
            Transparencia en Compras Públicas
          </h1>
          <p className="text-sm text-tenant-muted mt-2 max-w-xl mx-auto leading-relaxed">
            Consultá los procesos de contratación de{' '}
            <span className="font-semibold text-tenant-text">{tenant?.name ?? 'este municipio'}</span>,
            sus adjudicaciones y los documentos de carácter público sin necesidad de iniciar sesión.
          </p>
        </div>
      </section>

      {/* Buscador ciudadano */}
      <section className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tenant-muted pointer-events-none" />
          <input
            type="search"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por objeto, proveedor, número de expediente..."
            aria-label="Buscar procesos de compra"
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-2xl text-sm',
              'bg-tenant-surface/60 border border-tenant-border/40',
              'text-tenant-text placeholder:text-tenant-muted',
              'focus:outline-none focus:border-tenant-accent/50 focus:shadow-neon-accent transition-all',
            )}
          />
        </div>
        {busqueda && (
          <p className="text-center text-xs text-tenant-muted mt-3">
            El buscador ciudadano se implementa en la próxima iteración.
          </p>
        )}
      </section>

      {/* Secciones previstas */}
      <section className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted text-center">
          Contenido disponible
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SECCIONES.map(sec => (
            <div
              key={sec.id}
              className={cn(
                'p-5 rounded-2xl border backdrop-blur-glass space-y-3',
                'bg-tenant-surface/40 border-tenant-border/30',
                'opacity-60 cursor-not-allowed',
              )}
            >
              <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 w-fit">
                <sec.icon className="w-4 h-4 text-tenant-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-tenant-text">{sec.titulo}</p>
                <p className="text-[11px] text-tenant-muted mt-1 leading-snug">{sec.descripcion}</p>
              </div>
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-tenant-surface/60 border border-tenant-border/40 text-tenant-muted">
                Próximamente
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

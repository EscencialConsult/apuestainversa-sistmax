import { Globe, MailPlus, Check } from 'lucide-react'
import { cn } from '../../../utils/cn'

const TIPOS = [
  {
    id: 'abierta',
    icon: Globe,
    nombre: 'Convocatoria Abierta',
    descripcion: 'Cualquier proveedor habilitado del registro puede presentar oferta.',
  },
  {
    id: 'invitacion',
    icon: MailPlus,
    nombre: 'Por Invitación',
    descripcion: 'Solo participan los proveedores seleccionados e invitados expresamente.',
  },
]

export function Paso4Participacion({ participacion, proveedores, loading, errores, onChange, onToggleProveedor }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Tipo de convocatoria */}
      <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Tipo de convocatoria">
        {TIPOS.map(t => {
          const activa = participacion.tipoConvocatoria === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={activa}
              onClick={() => onChange('participacion', 'tipoConvocatoria', t.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl text-left border transition-all duration-200',
                'bg-tenant-surface/60 backdrop-blur-glass',
                activa
                  ? 'border-tenant-primary/60 shadow-neon bg-tenant-primary/10'
                  : 'border-tenant-border/40 hover:border-tenant-primary/30',
              )}
            >
              <div className={cn(
                'p-2 rounded-xl border shrink-0',
                activa
                  ? 'bg-tenant-primary/20 border-tenant-primary/40 text-tenant-primary'
                  : 'bg-white/5 border-tenant-border/30 text-tenant-muted',
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={cn('text-sm font-semibold', activa ? 'text-tenant-primary' : 'text-tenant-text')}>
                  {t.nombre}
                </p>
                <p className="text-xs text-tenant-muted mt-0.5">{t.descripcion}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selección de proveedores — solo en modalidad por invitación */}
      {participacion.tipoConvocatoria === 'invitacion' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-tenant-text">
              Proveedores a invitar <span className="text-tenant-danger">*</span>
            </p>
            <span className="text-[11px] text-tenant-muted">
              {participacion.proveedoresInvitados.length} seleccionados
            </span>
          </div>
          {errores.proveedoresInvitados && (
            <p className="text-[11px] text-tenant-danger">{errores.proveedoresInvitados}</p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {proveedores.map(p => {
                const invitado = participacion.proveedoresInvitados.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="checkbox"
                    aria-checked={invitado}
                    onClick={() => onToggleProveedor(p.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-left border transition-all',
                      invitado
                        ? 'border-tenant-success/50 bg-tenant-success/10'
                        : 'border-tenant-border/40 bg-white/5 hover:border-tenant-primary/30',
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
                      invitado
                        ? 'bg-tenant-success/30 border-tenant-success text-tenant-success'
                        : 'border-tenant-border/50',
                    )}>
                      {invitado && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-tenant-text truncate">{p.razonSocial}</p>
                      <p className="text-[10px] text-tenant-muted font-mono">{p.cuit} · {p.rubro}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

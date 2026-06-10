import { ArrowRight, Clock, Building2, TrendingDown, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { PRIORIDAD } from '../../services/api/aprobacionService'
import { EmptyState } from '../../components/ui/EmptyState'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

const PRIORIDAD_BAR_CLS = {
  [PRIORIDAD.ALTA]:  'bg-tenant-danger',
  [PRIORIDAD.MEDIA]: 'bg-tenant-warning',
  [PRIORIDAD.BAJA]:  'bg-tenant-success',
}

const PRIORIDAD_LABEL = {
  [PRIORIDAD.ALTA]:  'Alta',
  [PRIORIDAD.MEDIA]: 'Media',
  [PRIORIDAD.BAJA]:  'Baja',
}

function tiempoTranscurrido(isoDate) {
  const h = Math.floor((Date.now() - new Date(isoDate).getTime()) / 3_600_000)
  if (h < 1) return 'Hace menos de 1 hora'
  if (h < 24) return `Hace ${h} hora${h > 1 ? 's' : ''}`
  const d = Math.floor(h / 24)
  return `Hace ${d} día${d > 1 ? 's' : ''}`
}

function pctAhorro(base, adj) {
  return (((base - adj) / base) * 100).toFixed(1)
}

function ExpedienteCard({ exp, onSeleccionar }) {
  const ahorroPct = pctAhorro(exp.precioBase, exp.montoAdjudicado)

  return (
    <div className={cn(
      'relative flex rounded-2xl border backdrop-blur-glass overflow-hidden transition-all duration-200',
      exp.firmado
        ? 'bg-tenant-surface/30 border-tenant-border/25 opacity-70'
        : 'bg-tenant-surface/50 border-tenant-border/30 hover:border-tenant-accent/40 hover:shadow-neon',
    )}>
      {/* Barra de prioridad lateral */}
      <div className={cn(
        'w-1 flex-shrink-0',
        exp.firmado ? 'bg-tenant-success/40' : (PRIORIDAD_BAR_CLS[exp.prioridad] ?? 'bg-tenant-border'),
      )} />

      <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
        {/* Header: número + badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-tenant-muted">{exp.expedienteNum}</p>
            <h3 className="text-sm font-semibold text-tenant-text mt-0.5 leading-tight">{exp.titulo}</h3>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {exp.firmado ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-tenant-success/15 border-tenant-success/30 text-tenant-success">
                Firmado
              </span>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-tenant-accent/15 border-tenant-accent/30 text-tenant-accent animate-pulse-slow">
                  Pendiente
                </span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                  exp.prioridad === PRIORIDAD.ALTA
                    ? 'bg-tenant-danger/15 border-tenant-danger/30 text-tenant-danger'
                    : exp.prioridad === PRIORIDAD.MEDIA
                    ? 'bg-tenant-warning/15 border-tenant-warning/30 text-tenant-warning'
                    : 'bg-tenant-success/15 border-tenant-success/30 text-tenant-success',
                )}>
                  Prioridad {PRIORIDAD_LABEL[exp.prioridad]}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Info del expediente */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-tenant-muted">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{exp.area}</span>
          </span>
          <span className="truncate">{exp.modalidad}</span>
          <span className="truncate font-medium text-tenant-text" title={exp.ganador.razonSocial}>
            {exp.ganador.razonSocial}
          </span>
          <span className="font-mono font-bold text-tenant-accent">
            {CURRENCY_FORMAT.format(exp.montoAdjudicado)}
          </span>
        </div>

        {/* Ahorro + tiempo */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-tenant-success font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              Ahorro {ahorroPct}%
              <span className="text-tenant-muted font-normal">
                ({CURRENCY_FORMAT.format(exp.precioBase - exp.montoAdjudicado)})
              </span>
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-tenant-muted">
            <Clock className="w-3 h-3" />
            {tiempoTranscurrido(exp.pendienteDesde)}
          </span>
        </div>

        {/* Etapa actual + botón acción */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-tenant-border/20">
          <p className="text-[10px] text-tenant-muted truncate">{exp.etapaActual}</p>
          {exp.firmado ? (
            <button
              type="button"
              onClick={() => onSeleccionar(exp.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex-shrink-0',
                'bg-tenant-surface/60 border border-tenant-border/40 text-tenant-muted hover:text-tenant-text',
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-tenant-success" />
              Ver detalle
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSeleccionar(exp.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex-shrink-0',
                'bg-tenant-accent/20 border border-tenant-accent/40 text-tenant-accent',
                'hover:bg-tenant-accent/30 shadow-neon-accent',
              )}
            >
              Revisar y Firmar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function BandejaAprobaciones({ expedientes, onSeleccionar, cargando }) {
  if (cargando) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-tenant-primary animate-spin" />
          <p className="text-xs text-tenant-muted">Cargando bandeja...</p>
        </div>
      </div>
    )
  }

  const pendientes = expedientes.filter(e => !e.firmado)
  const firmados   = expedientes.filter(e => e.firmado)

  if (expedientes.length === 0) {
    return (
      <EmptyState
        title="Bandeja al día"
        description="No hay expedientes pendientes de firma en este momento."
      />
    )
  }

  return (
    <div className="space-y-5">
      {pendientes.length > 0 && (
        <section className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted px-1">
            Requieren tu firma — {pendientes.length} expediente{pendientes.length > 1 ? 's' : ''}
          </p>
          {pendientes.map(exp => (
            <ExpedienteCard key={exp.id} exp={exp} onSeleccionar={onSeleccionar} />
          ))}
        </section>
      )}

      {firmados.length > 0 && (
        <section className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted px-1">
            Firmados recientemente — {firmados.length} expediente{firmados.length > 1 ? 's' : ''}
          </p>
          {firmados.map(exp => (
            <ExpedienteCard key={exp.id} exp={exp} onSeleccionar={onSeleccionar} />
          ))}
        </section>
      )}
    </div>
  )
}

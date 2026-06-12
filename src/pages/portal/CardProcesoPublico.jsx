import { Award, Clock, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ESTADO_PORTAL } from '../../services/api/portalService'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})
const FECHA_FORMAT = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' })
const HORA_FORMAT  = new Intl.DateTimeFormat('es-AR', { timeStyle: 'short' })

function pctAhorro(base, adj) {
  return Math.round((1 - adj / base) * 1000) / 10
}

/**
 * Tarjeta pública de proceso de compra — solo lectura.
 *
 * PUBLICADO  → muestra monto base + fecha/hora de subasta.
 * ADJUDICADO → muestra ganador + monto final + porcentaje de ahorro.
 */
export function CardProcesoPublico({ proceso }) {
  const esAdjudicado = proceso.estado === ESTADO_PORTAL.ADJUDICADO
  const fechaSubasta = new Date(proceso.fechaSubasta)

  return (
    <div className={cn(
      'p-5 rounded-2xl border backdrop-blur-glass space-y-4 transition-colors',
      'bg-tenant-surface/40',
      esAdjudicado
        ? 'border-tenant-success/30 hover:border-tenant-success/50'
        : 'border-tenant-primary/30 hover:border-tenant-primary/50',
    )}>
      {/* ── Cabecera: badge de estado + monto ─────────────────────────────── */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        {esAdjudicado ? (
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
            'text-[10px] font-bold uppercase tracking-wider',
            'bg-tenant-success/15 border border-tenant-success/30 text-tenant-success',
          )}>
            <Award className="w-3 h-3" /> Adjudicado
          </span>
        ) : (
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
            'text-[10px] font-bold uppercase tracking-wider',
            'bg-tenant-primary/15 border border-tenant-primary/30 text-tenant-primary',
          )}>
            <Clock className="w-3 h-3" /> Subasta Próxima
          </span>
        )}
        <span className="text-sm font-bold text-tenant-text tabular-nums">
          {CURRENCY_FORMAT.format(esAdjudicado ? proceso.montoAdjudicado : proceso.montoBase)}
        </span>
      </div>

      {/* ── Título del proceso ─────────────────────────────────────────────── */}
      <p className="text-sm font-bold text-tenant-text leading-snug line-clamp-2">
        {proceso.titulo}
      </p>

      {/* ── Metadatos ─────────────────────────────────────────────────────── */}
      <div className="space-y-0.5">
        <p className="text-[11px] text-tenant-muted">{proceso.expedienteNum} · {proceso.area}</p>
        <p className="text-[11px] text-tenant-muted">{proceso.modalidad}</p>
      </div>

      {/* ── Bloque contextual según estado ────────────────────────────────── */}
      {esAdjudicado ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-tenant-success/8 border border-tenant-success/20">
          <Award className="w-4 h-4 text-tenant-success flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-tenant-success truncate">
              {proceso.ganador.razonSocial}
            </p>
            <p className="text-[10px] text-tenant-muted font-mono">
              CUIT {proceso.ganador.cuit}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="flex items-center gap-0.5 text-xs font-bold text-tenant-success justify-end">
              <TrendingDown className="w-3 h-3" />
              {pctAhorro(proceso.montoBase, proceso.montoAdjudicado)}%
            </p>
            <p className="text-[10px] text-tenant-muted">de ahorro</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-tenant-primary/8 border border-tenant-primary/20">
          <Clock className="w-4 h-4 text-tenant-primary flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-tenant-primary">
              {FECHA_FORMAT.format(fechaSubasta)}
            </p>
            <p className="text-[10px] text-tenant-muted">
              a las {HORA_FORMAT.format(fechaSubasta)} · Plataforma SICST MAX
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, ArrowRight, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ESTADOS_ETAPA } from './adjudicacionReducer'

const HORA_FORMAT = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' })

// Estable a nivel módulo — no se reconstruye en cada render de EstadoBadge
const ESTADO_MAP = {
  [ESTADOS_ETAPA.APROBADO]:    { label: 'Aprobado',    cls: 'bg-tenant-success/15 border-tenant-success/40 text-tenant-success' },
  [ESTADOS_ETAPA.RECHAZADO]:   { label: 'Rechazado',   cls: 'bg-tenant-danger/15  border-tenant-danger/40  text-tenant-danger'  },
  [ESTADOS_ETAPA.EN_PROGRESO]: { label: 'En progreso', cls: 'bg-tenant-accent/15  border-tenant-accent/40  text-tenant-accent animate-pulse-slow' },
  [ESTADOS_ETAPA.PENDIENTE]:   { label: 'Pendiente',   cls: 'bg-tenant-surface/60 border-tenant-border/40  text-tenant-muted'   },
}

function EstadoBadge({ estado }) {
  const { label, cls } = ESTADO_MAP[estado] ?? ESTADO_MAP[ESTADOS_ETAPA.PENDIENTE]
  return (
    <span className={cn('px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider', cls)}>
      {label}
    </span>
  )
}

function CirculoEstado({ estado }) {
  const base = 'w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10'
  if (estado === ESTADOS_ETAPA.APROBADO)
    return <div className={cn(base, 'border-tenant-success bg-tenant-success/15 text-tenant-success')}><CheckCircle2 className="w-4 h-4" /></div>
  if (estado === ESTADOS_ETAPA.RECHAZADO)
    return <div className={cn(base, 'border-tenant-danger bg-tenant-danger/15 text-tenant-danger')}><XCircle className="w-4 h-4" /></div>
  if (estado === ESTADOS_ETAPA.EN_PROGRESO)
    return <div className={cn(base, 'border-tenant-accent bg-tenant-accent/15 text-tenant-accent animate-pulse-slow')}><ArrowRight className="w-4 h-4" /></div>
  return <div className={cn(base, 'border-tenant-border bg-tenant-surface/60 text-tenant-muted')}><Clock className="w-4 h-4" /></div>
}

function lineaColor(estado) {
  if (estado === ESTADOS_ETAPA.APROBADO)    return 'bg-tenant-success/40'
  if (estado === ESTADOS_ETAPA.RECHAZADO)   return 'bg-tenant-danger/40'
  if (estado === ESTADOS_ETAPA.EN_PROGRESO) return 'bg-tenant-accent/30'
  return 'bg-tenant-border/25'
}

export function TimelineAprobacion({ circuito, onFirmar, firmando, userRole }) {
  // null  = usar auto-expand (la etapa en progreso)
  // false = usuario cerró explícitamente todo
  // 'id'  = usuario abrió este paso manualmente
  const [override, setOverride] = useState(null)
  const [obs,      setObs]      = useState('')

  // Derivado en render — sin useEffect, sin estado derivado
  const etapaActivaId = circuito.find(e => e.estado === ESTADOS_ETAPA.EN_PROGRESO)?.id ?? null
  const expandida = override === false ? null : (override ?? etapaActivaId)

  const puedesFirmar = (etapa) =>
    etapa.estado === ESTADOS_ETAPA.EN_PROGRESO && userRole === etapa.rol

  const handleFirmar = (etapaId, accion) => {
    onFirmar(etapaId, accion, obs)
    setObs('')
    setOverride(null)  // vuelve al auto-expand para que la próxima etapa activa se abra sola
  }

  const toggle = (id) => {
    setOverride(expandida === id ? false : id)
  }

  return (
    <div className="flex flex-col">
      {circuito.map((etapa, idx) => (
        <div key={etapa.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <CirculoEstado estado={etapa.estado} />
            {idx < circuito.length - 1 && (
              <div className={cn('w-0.5 flex-1 min-h-8 mt-0.5', lineaColor(etapa.estado))} />
            )}
          </div>

          <div className={cn('flex-1 min-w-0', idx < circuito.length - 1 ? 'pb-5' : 'pb-1')}>
            <button
              type="button"
              aria-label={`${etapa.label} — ${ESTADO_MAP[etapa.estado]?.label ?? etapa.estado}`}
              className="w-full text-left flex items-start justify-between gap-2 group"
              onClick={() => toggle(etapa.id)}
            >
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-semibold leading-tight',
                  etapa.estado === ESTADOS_ETAPA.EN_PROGRESO  ? 'text-tenant-accent'
                  : etapa.estado === ESTADOS_ETAPA.APROBADO   ? 'text-tenant-success'
                  : etapa.estado === ESTADOS_ETAPA.RECHAZADO  ? 'text-tenant-danger'
                  : 'text-tenant-muted',
                )}>
                  {etapa.label}
                </p>
                <p className="text-[10px] text-tenant-muted mt-0.5">{etapa.rolLabel}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                <EstadoBadge estado={etapa.estado} />
                {expandida === etapa.id
                  ? <ChevronUp className="w-3.5 h-3.5 text-tenant-muted" />
                  : <ChevronDown className="w-3.5 h-3.5 text-tenant-muted" />}
              </div>
            </button>

            {expandida === etapa.id && (
              <div className="mt-2 space-y-2 animate-fade-in">
                <p className="text-[11px] text-tenant-muted leading-snug">{etapa.descripcion}</p>

                {(etapa.estado === ESTADOS_ETAPA.APROBADO || etapa.estado === ESTADOS_ETAPA.RECHAZADO) && (
                  <div className={cn(
                    'p-2.5 rounded-xl border text-[11px] space-y-1',
                    etapa.estado === ESTADOS_ETAPA.APROBADO
                      ? 'bg-tenant-success/8 border-tenant-success/25'
                      : 'bg-tenant-danger/8 border-tenant-danger/25',
                  )}>
                    <p className="text-tenant-muted">
                      <span className="font-medium text-tenant-text">{etapa.firmante}</span>
                      {' · '}
                      {etapa.fechaFirma ? HORA_FORMAT.format(new Date(etapa.fechaFirma)) : '—'}
                    </p>
                    {etapa.observaciones && (
                      <p className="text-tenant-muted italic">"{etapa.observaciones}"</p>
                    )}
                  </div>
                )}

                {puedesFirmar(etapa) && (
                  <div className="mt-3 space-y-2 p-3 rounded-xl bg-tenant-accent/8 border border-tenant-accent/25">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-tenant-accent">
                      Es tu turno de firmar
                    </p>
                    <textarea
                      aria-label="Observaciones para la firma (opcional)"
                      value={obs}
                      onChange={e => setObs(e.target.value)}
                      placeholder="Observaciones (opcional)..."
                      rows={2}
                      className={cn(
                        'w-full text-xs rounded-lg px-3 py-2 resize-none',
                        'bg-tenant-surface/60 border border-tenant-border/40',
                        'text-tenant-text placeholder:text-tenant-muted',
                        'focus:outline-none focus:border-tenant-accent/60',
                      )}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={firmando}
                        onClick={() => handleFirmar(etapa.id, 'aprobar')}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl',
                          'text-xs font-bold transition-all',
                          'bg-tenant-success/20 border border-tenant-success/40 text-tenant-success',
                          'hover:bg-tenant-success/30 disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        {firmando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Aprobar
                      </button>
                      <button
                        type="button"
                        disabled={firmando}
                        onClick={() => handleFirmar(etapa.id, 'rechazar')}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl',
                          'text-xs font-bold transition-all',
                          'bg-tenant-danger/20 border border-tenant-danger/40 text-tenant-danger',
                          'hover:bg-tenant-danger/30 disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        {firmando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                        Rechazar
                      </button>
                    </div>
                  </div>
                )}

                {etapa.estado === ESTADOS_ETAPA.EN_PROGRESO && !puedesFirmar(etapa) && (
                  <p className="text-[11px] text-tenant-muted italic">
                    Aguardando firma de: <span className="font-medium text-tenant-text">{etapa.rolLabel}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

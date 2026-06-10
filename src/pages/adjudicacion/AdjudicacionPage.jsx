import { useReducer, useEffect, useCallback, useMemo } from 'react'
import { Award, TrendingDown, Building2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../contexts/AuthContext'
import { useTenant } from '../../contexts/TenantContext'
import {
  getExpedienteAdjudicacion,
  getCircuitoAprobacion,
  getPlantillas,
  firmarEtapa,
} from '../../services/api/adjudicacionService'
import { adjudicacionReducer, initialAdjudicacion, ESTADOS_ETAPA } from './adjudicacionReducer'
import { TimelineAprobacion } from './TimelineAprobacion'
import { VisorPlantillas } from './VisorPlantillas'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={cn(
      'flex flex-col gap-1 p-4 rounded-2xl border backdrop-blur-glass',
      accent
        ? 'bg-tenant-success/8 border-tenant-success/25'
        : 'bg-tenant-surface/50 border-tenant-border/30',
    )}>
      <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">{label}</p>
      <p className={cn('text-lg font-bold font-mono tabular-nums', accent ? 'text-tenant-success' : 'text-tenant-text')}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-tenant-muted">{sub}</p>}
    </div>
  )
}

export function AdjudicacionPage() {
  const { user } = useAuth()
  const { tenant, tenantId } = useTenant()
  const [state, dispatch] = useReducer(adjudicacionReducer, initialAdjudicacion)

  useEffect(() => {
    Promise.all([
      getExpedienteAdjudicacion('exp-0142'),
      getCircuitoAprobacion(tenantId),
      getPlantillas(tenantId),
    ]).then(([expediente, circuito, plantillas]) => {
      dispatch({ type: 'DATOS_CARGADOS', payload: { expediente, circuito, plantillas } })
    })
  }, [tenantId])

  const handleFirmar = useCallback(async (etapaId, accion, observaciones) => {
    dispatch({ type: 'SET_FIRMANDO', payload: true })
    const resultado = await firmarEtapa(etapaId, user?.name ?? 'Usuario', observaciones)
    dispatch({
      type: accion === 'aprobar' ? 'APROBAR_ETAPA' : 'RECHAZAR_ETAPA',
      payload: { etapaId, ...resultado },
    })
  }, [user])

  const estadoCircuito = useMemo(() => {
    if (state.circuito.some(e => e.estado === ESTADOS_ETAPA.RECHAZADO)) return 'rechazado'
    if (state.circuito.length > 0 && state.circuito.every(e => e.estado === ESTADOS_ETAPA.APROBADO)) return 'completado'
    return 'en_curso'
  }, [state.circuito])

  const etapasAprobadas = state.circuito.filter(e => e.estado === ESTADOS_ETAPA.APROBADO).length
  const progresoPct = state.circuito.length > 0
    ? (etapasAprobadas / state.circuito.length) * 100
    : 0

  if (state.cargando) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-tenant-primary animate-spin" />
          <p className="text-xs text-tenant-muted">Cargando expediente de adjudicación...</p>
        </div>
      </div>
    )
  }

  const { expediente } = state
  const ahorro = expediente.precioBase - expediente.montoAdjudicado
  const ahorroPct = (ahorro / expediente.precioBase) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera del expediente */}
      <div className="p-5 rounded-2xl bg-tenant-surface/50 border border-tenant-primary/20 backdrop-blur-glass">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon flex-shrink-0">
            <Award className="w-5 h-5 text-tenant-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-tenant-text">Adjudicación</h1>
              <span className="font-mono text-xs text-tenant-muted">{expediente.expedienteNum}</span>
            </div>
            <p className="text-sm text-tenant-muted mt-0.5 leading-snug">{expediente.titulo}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard label="Precio Base" value={CURRENCY_FORMAT.format(expediente.precioBase)} />
          <StatCard label="Monto Adjudicado" value={CURRENCY_FORMAT.format(expediente.montoAdjudicado)} />
          <StatCard label="Ahorro Obtenido" value={CURRENCY_FORMAT.format(ahorro)} sub={`${ahorroPct.toFixed(1)}% sobre base`} accent />
          <div className="flex flex-col gap-1 p-4 rounded-2xl border bg-tenant-surface/50 border-tenant-border/30 backdrop-blur-glass">
            <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">Adjudicatario</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-tenant-primary flex-shrink-0" />
              <p className="text-xs font-semibold text-tenant-text leading-tight truncate">
                {expediente.ganador.razonSocial}
              </p>
            </div>
            <p className="text-[10px] font-mono text-tenant-muted">{expediente.ganador.cuit}</p>
          </div>
        </div>

        {/* Barra de progreso del circuito */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-widest font-bold text-tenant-muted">
              Circuito de aprobación
            </span>
            <span className="font-mono text-tenant-muted">
              {etapasAprobadas}/{state.circuito.length} etapas
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-tenant-surface/60 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                estadoCircuito === 'rechazado' ? 'bg-tenant-danger' : 'bg-tenant-success',
              )}
              style={{ width: `${progresoPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Banner de estado */}
      {estadoCircuito === 'completado' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-tenant-success/10 border border-tenant-success/30 text-tenant-success animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">
            Proceso completado — la adjudicación fue aprobada por todas las instancias. El expediente fue derivado al módulo de Contratos.
          </p>
        </div>
      )}
      {estadoCircuito === 'rechazado' && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-tenant-danger/10 border border-tenant-danger/30 text-tenant-danger animate-fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-semibold">
            El proceso fue rechazado en una etapa del circuito de aprobación. Se requiere revisión por el área responsable.
          </p>
        </div>
      )}

      {/* Contenido principal: timeline + visor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 backdrop-blur-glass p-5">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted mb-4 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5" /> Circuito de Aprobación
          </p>
          <TimelineAprobacion
            circuito={state.circuito}
            onFirmar={handleFirmar}
            firmando={state.firmando}
            userRole={user?.role ?? ''}
          />
        </div>

        {/* Visor de documentos */}
        <div className="lg:col-span-2">
          <VisorPlantillas
            plantillas={state.plantillas}
            expediente={expediente}
            tenant={tenant}
          />
        </div>
      </div>
    </div>
  )
}

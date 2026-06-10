import { useState, useEffect, useCallback, useReducer } from 'react'
import {
  Shield, AlertTriangle, Activity, TrendingDown, Loader2,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'
import { TablaAuditoria } from '../../components/atoms/TablaAuditoria'
import { FiltrosAuditoria } from './FiltrosAuditoria'
import {
  getEventosAuditoria,
  MODULO_LABELS,
  TIPOS,
} from '../../services/api/auditoriaService'

// ── Formatos estables a nivel módulo ──────────────────────────────────────────
const TIMESTAMP_FORMAT = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short', timeStyle: 'short',
})

// ── Estilos estáticos a nivel módulo: no se reconstruyen en cada render ───────
const MODULO_CLS = {
  SISTEMA:      'bg-slate-500/20 border-slate-500/30 text-slate-400',
  USUARIOS:     'bg-tenant-secondary/20 border-tenant-secondary/30 text-tenant-secondary',
  PROVEEDORES:  'bg-tenant-accent/20 border-tenant-accent/30 text-tenant-accent',
  COMPRAS:      'bg-tenant-primary/20 border-tenant-primary/30 text-tenant-primary',
  TRADING:      'bg-tenant-warning/20 border-tenant-warning/30 text-tenant-warning',
  ADJUDICACION: 'bg-tenant-success/20 border-tenant-success/30 text-tenant-success',
  APROBACION:   'bg-violet-500/20 border-violet-500/30 text-violet-400',
}

const TIPO_CLS = {
  [TIPOS.INFO]:        'bg-tenant-muted/15 border-tenant-border/40 text-tenant-muted',
  [TIPOS.EXITO]:       'bg-tenant-success/20 border-tenant-success/30 text-tenant-success',
  [TIPOS.ADVERTENCIA]: 'bg-tenant-warning/20 border-tenant-warning/30 text-tenant-warning',
  [TIPOS.CRITICO]:     'bg-tenant-danger/20 border-tenant-danger/30 text-tenant-danger',
}

const TIPO_LABELS = {
  [TIPOS.INFO]:        'Info',
  [TIPOS.EXITO]:       'Éxito',
  [TIPOS.ADVERTENCIA]: 'Alerta',
  [TIPOS.CRITICO]:     'Crítico',
}

const STAT_VARIANT_CLS = {
  default:  'bg-tenant-surface/50 border-tenant-border/30',
  warning:  'bg-tenant-warning/8 border-tenant-warning/25',
  critical: 'bg-tenant-danger/8 border-tenant-danger/25',
  success:  'bg-tenant-success/8 border-tenant-success/25',
}
const STAT_TEXT_CLS = {
  default:  'text-tenant-text',
  warning:  'text-tenant-warning',
  critical: 'text-tenant-danger',
  success:  'text-tenant-success',
}
const STAT_ICON_CLS = {
  default:  'bg-tenant-primary/15 border-tenant-primary/30 text-tenant-primary',
  warning:  'bg-tenant-warning/15 border-tenant-warning/30 text-tenant-warning',
  critical: 'bg-tenant-danger/15  border-tenant-danger/30  text-tenant-danger',
  success:  'bg-tenant-success/15 border-tenant-success/30 text-tenant-success',
}

// Columnas estables a nivel módulo: referencias inmutables, no recreadas en render
const COLUMNAS = [
  {
    key:    'timestamp',
    label:  'Fecha / Hora',
    render: (v) => (
      <span className="font-mono text-[11px] text-tenant-muted whitespace-nowrap">
        {TIMESTAMP_FORMAT.format(new Date(v))}
      </span>
    ),
  },
  {
    key:    'modulo',
    label:  'Módulo',
    render: (v) => (
      <span className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap',
        MODULO_CLS[v] ?? 'bg-tenant-muted/15 border-tenant-border/40 text-tenant-muted',
      )}>
        {MODULO_LABELS[v] ?? v}
      </span>
    ),
  },
  {
    key:    'tipo',
    label:  'Tipo',
    render: (v) => (
      <span className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap',
        TIPO_CLS[v] ?? '',
      )}>
        {TIPO_LABELS[v] ?? v}
      </span>
    ),
  },
  {
    key:      'accion',
    label:    'Acción',
    sortable: false,
    render:   (v) => <span className="font-mono text-[11px] text-tenant-accent">{v}</span>,
  },
  { key: 'usuario',     label: 'Usuario' },
  { key: 'descripcion', label: 'Descripción', sortable: false },
  {
    key:      'ip',
    label:    'IP',
    sortable: false,
    render:   (v) => <span className="font-mono text-[11px] text-tenant-muted">{v}</span>,
  },
]

const FILTROS_DEFAULT = {
  fechaDesde: '',
  fechaHasta: '',
  modulo:     '',
  tipo:       '',
  busqueda:   '',
}

// ── Reducer para eventos/resumen/cargando: un dispatch = un render ─────────────
const initialData = { eventos: [], resumen: null, cargando: true }

function dataReducer(state, action) {
  if (action.type === 'CARGANDO')  return { ...state, cargando: true }
  if (action.type === 'RESULTADO') return { eventos: action.eventos, resumen: action.resumen, cargando: false }
  return state
}

function StatCard({ icon: Icon, label, value, variant = 'default' }) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-glass',
      STAT_VARIANT_CLS[variant],
    )}>
      <div className={cn('p-2 rounded-xl border flex-shrink-0', STAT_ICON_CLS[variant])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-tenant-muted truncate">{label}</p>
        <p className={cn('text-xl font-bold tabular-nums', STAT_TEXT_CLS[variant])}>{value}</p>
      </div>
    </div>
  )
}

export function AuditoriaPage() {
  const { tenantId }              = useTenant()
  const [filtros,  setFiltros]    = useState(FILTROS_DEFAULT)
  const [data, dispatch]          = useReducer(dataReducer, initialData)

  const { eventos, resumen, cargando } = data

  useEffect(() => {
    let cancelado = false
    dispatch({ type: 'CARGANDO' })
    // Debounce de 300ms para búsqueda de texto; inmediato para selectores/fechas
    const ms = filtros.busqueda ? 300 : 0
    const timer = setTimeout(() => {
      getEventosAuditoria(tenantId, filtros).then(r => {
        if (!cancelado) dispatch({ type: 'RESULTADO', eventos: r.eventos, resumen: r.resumen })
      })
    }, ms)
    return () => { cancelado = true; clearTimeout(timer) }
  }, [tenantId, filtros])

  const handleCambio = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }, [])

  const handleLimpiar = useCallback(() => setFiltros(FILTROS_DEFAULT), [])

  const totalGeneral   = resumen?.totalEventos ?? 0
  const moduloTopLabel = resumen?.moduloTop
    ? (MODULO_LABELS[resumen.moduloTop] ?? resumen.moduloTop)
    : '—'

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon flex-shrink-0">
          <Shield className="w-5 h-5 text-tenant-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-tenant-text">
            Bitácora de Auditoría y Trazabilidad
          </h1>
          <p className="text-xs text-tenant-muted mt-0.5">
            Registro inmutable · Solo lectura · Aislado por municipio
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Activity}      label="Total eventos"    value={cargando ? '…' : totalGeneral}                          />
        <StatCard icon={TrendingDown}  label="Módulo más activo" value={cargando ? '…' : moduloTopLabel} variant="success"     />
        <StatCard icon={AlertTriangle} label="Advertencias"     value={cargando ? '…' : (resumen?.alertas  ?? 0)} variant="warning"  />
        <StatCard icon={Shield}        label="Eventos críticos"  value={cargando ? '…' : (resumen?.criticos ?? 0)} variant="critical" />
      </div>

      {/* Filtros */}
      <FiltrosAuditoria
        filtros={filtros}
        onCambio={handleCambio}
        onLimpiar={handleLimpiar}
        totalFiltrado={totalGeneral}
        totalGeneral={resumen?.totalEventos ?? 0}
      />

      {/* Tabla */}
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-tenant-primary animate-spin" />
            <p className="text-xs text-tenant-muted">Cargando bitácora...</p>
          </div>
        </div>
      ) : (
        <TablaAuditoria
          title="Bitácora de Auditoría"
          columns={COLUMNAS}
          data={eventos}
          emptyMessage="No hay eventos que coincidan con los filtros aplicados."
          loading={false}
        />
      )}
    </div>
  )
}

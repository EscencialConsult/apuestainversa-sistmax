import { TrendingDown, ShoppingCart, Building2, Clock, AlertTriangle, Activity } from 'lucide-react'
import { CardProceso } from '../../components/atoms/CardProceso'
import { BadgeEstado } from '../../components/atoms/BadgeEstado'
import { cn } from '../../utils/cn'

const MOCK_STATS = [
  { label: 'Procesos Activos',    value: '24',       icon: ShoppingCart, color: 'primary', trend: '+3 esta semana' },
  { label: 'Subastas En Vivo',    value: '3',        icon: Activity,     color: 'accent',  trend: 'Ahora mismo', live: true },
  { label: 'Proveedores Activos', value: '187',      icon: Building2,    color: 'secondary', trend: '+12 este mes' },
  { label: 'Ahorro Generado',     value: '$4.2M',    icon: TrendingDown, color: 'success', trend: '18% vs presupuesto' },
  { label: 'Pendientes Aprobac.', value: '7',        icon: Clock,        color: 'warning', trend: '2 urgentes' },
  { label: 'Alertas Documentales',value: '2',        icon: AlertTriangle,color: 'danger',  trend: 'Requieren acción' },
]

const MOCK_PROCESOS = [
  { id: '1', numero: 'EXP-2025-0142', titulo: 'Adquisición de Equipamiento Informático para Dependencias Municipales', estado: 'en_subasta', modalidad: 'Subasta Inversa', presupuesto: 850000, fechaApertura: '2025-07-15', ofertasCount: 12 },
  { id: '2', numero: 'EXP-2025-0138', titulo: 'Servicio de Mantenimiento de Parques y Espacios Verdes', estado: 'adjudicado', modalidad: 'Licitación', presupuesto: 2400000, fechaApertura: '2025-06-28', ofertasCount: 5 },
  { id: '3', numero: 'EXP-2025-0135', titulo: 'Provisión de Insumos de Oficina — Primer Semestre', estado: 'en_revision', modalidad: 'Contratación Directa', presupuesto: 120000, fechaApertura: '2025-07-01', ofertasCount: 3 },
  { id: '4', numero: 'EXP-2025-0130', titulo: 'Obra de Reparación de Calzada — Barrio Norte', estado: 'pendiente', modalidad: 'Subasta Inversa', presupuesto: 6800000, fechaApertura: '2025-07-20', ofertasCount: 0 },
]

const STAT_COLOR_MAP = {
  primary:   'text-tenant-primary bg-tenant-primary/15 border-tenant-primary/20',
  accent:    'text-tenant-accent  bg-tenant-accent/15  border-tenant-accent/20',
  secondary: 'text-tenant-secondary bg-tenant-secondary/15 border-tenant-secondary/20',
  success:   'text-tenant-success bg-tenant-success/15 border-tenant-success/20',
  warning:   'text-tenant-warning bg-tenant-warning/15 border-tenant-warning/20',
  danger:    'text-tenant-danger  bg-tenant-danger/15  border-tenant-danger/20',
}

function StatCard({ stat }) {
  const Icon = stat.icon

  return (
    <div className="relative flex flex-col gap-3 p-5 rounded-2xl bg-tenant-surface/60 backdrop-blur-glass border border-tenant-border/40 hover:border-tenant-primary/30 transition-all group overflow-hidden">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl border', STAT_COLOR_MAP[stat.color])}>
          <Icon className="w-5 h-5" />
        </div>
        {stat.live && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-tenant-danger animate-pulse-slow">
            <span className="w-1.5 h-1.5 rounded-full bg-tenant-danger" />
            LIVE
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-tenant-text">{stat.value}</p>
        <p className="text-xs text-tenant-muted mt-0.5">{stat.label}</p>
      </div>
      <p className="text-[11px] text-tenant-muted border-t border-tenant-border/20 pt-2">{stat.trend}</p>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-tenant-primary/5 to-transparent" />
    </div>
  )
}

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-tenant-text">Panel de Control</h1>
        <p className="text-sm text-tenant-muted mt-1">Resumen operativo del sistema</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {MOCK_STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* Procesos recientes */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-tenant-text">Procesos Recientes</h2>
          <a href="/compras" className="text-xs text-tenant-primary hover:underline">Ver todos</a>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {MOCK_PROCESOS.map(p => <CardProceso key={p.id} proceso={p} />)}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="flex flex-col gap-3 p-5 rounded-2xl bg-tenant-surface/60 backdrop-blur-glass border border-tenant-border/40">
        <h2 className="text-sm font-semibold text-tenant-text">Actividad Reciente</h2>
        <div className="flex flex-col gap-2">
          {[
            // id estable: con WebSockets las filas se insertan arriba y un index key
            // rompería la reconciliación de React
            { id: 'act-1', text: 'Nueva oferta de $720.000 en EXP-2025-0142', time: 'hace 2 min', estado: 'en_subasta' },
            { id: 'act-2', text: 'Proveedor TechSolutions aprobó validación ARCA', time: 'hace 18 min', estado: 'aprobado' },
            { id: 'act-3', text: 'EXP-2025-0135 pasó a revisión documental', time: 'hace 1h', estado: 'en_revision' },
            { id: 'act-4', text: 'Autoridad aprobó EXP-2025-0128', time: 'hace 3h', estado: 'aprobado' },
          ].map((act) => (
            <div key={act.id} className="flex items-center gap-3 py-2 border-b border-tenant-border/20 last:border-0">
              <BadgeEstado estado={act.estado} size="sm" dot={false} className="shrink-0" />
              <p className="text-xs text-tenant-text flex-1">{act.text}</p>
              <span className="text-[10px] text-tenant-muted shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

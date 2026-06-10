import { ArrowLeft, Award, TrendingDown, Building2, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { TimelineAprobacion } from '../adjudicacion/TimelineAprobacion'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

const PCT_FORMAT = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function pctAhorro(base, adj) {
  return PCT_FORMAT.format(((base - adj) / base) * 100)
}

function diffVsGanador(monto, montoGanador) {
  if (monto === montoGanador) return null
  const diff = monto - montoGanador
  const pct  = PCT_FORMAT.format((diff / montoGanador) * 100)
  return { diff, pct }
}

function StatCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div className={cn(
      'flex flex-col gap-1 p-4 rounded-2xl border backdrop-blur-glass',
      accent ? 'bg-tenant-success/8 border-tenant-success/25' : 'bg-tenant-surface/50 border-tenant-border/30',
    )}>
      {Icon && (
        <div className={cn(
          'w-7 h-7 rounded-lg border flex items-center justify-center mb-1',
          accent ? 'bg-tenant-success/15 border-tenant-success/30 text-tenant-success' : 'bg-tenant-primary/15 border-tenant-primary/30 text-tenant-primary',
        )}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">{label}</p>
      <p className={cn('text-base font-bold font-mono tabular-nums leading-tight', accent ? 'text-tenant-success' : 'text-tenant-text')}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-tenant-muted">{sub}</p>}
    </div>
  )
}

function CuadroComparativo({ ofertas, montoGanador }) {
  return (
    <div className="rounded-2xl border border-tenant-border/30 bg-tenant-surface/40 backdrop-blur-glass overflow-hidden">
      <div className="px-4 py-3 border-b border-tenant-border/25">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
          Cuadro Comparativo de Ofertas
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-tenant-border/20 bg-tenant-surface/30">
              <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted w-8">#</th>
              <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Proveedor</th>
              <th scope="col" className="text-right py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Oferta Final</th>
              <th scope="col" className="text-right py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Dif. vs Ganador</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.map(oferta => {
              const diff = diffVsGanador(oferta.monto, montoGanador)
              return (
                <tr
                  key={oferta.puesto}
                  className={cn(
                    'border-b border-tenant-border/15 transition-colors',
                    oferta.esGanador ? 'bg-tenant-success/6' : 'hover:bg-tenant-surface/60',
                  )}
                >
                  <td className="py-3 px-4">
                    {oferta.esGanador
                      ? <Award className="w-4 h-4 text-tenant-success" />
                      : <span className="text-tenant-muted font-mono">{oferta.puesto}</span>
                    }
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn('font-medium', oferta.esGanador ? 'text-tenant-success' : 'text-tenant-text')}>
                      {oferta.razonSocial}
                    </span>
                    {oferta.esGanador && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-tenant-success/15 border border-tenant-success/30 text-tenant-success uppercase tracking-wider">
                        Adjudicado
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-tenant-text">
                    {CURRENCY_FORMAT.format(oferta.monto)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {diff === null ? (
                      <span className="text-tenant-success font-semibold">—</span>
                    ) : (
                      <span className="text-tenant-danger font-mono text-[11px]">
                        +{CURRENCY_FORMAT.format(diff.diff)}
                        <span className="text-tenant-muted ml-1">(+{diff.pct}%)</span>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DetalleAprobacion({ expediente, circuito, firmando, onFirmar, onVolver, userRole, userName, cargando }) {
  if (cargando || !expediente) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 text-tenant-primary animate-spin" />
          <p className="text-xs text-tenant-muted">Cargando expediente...</p>
        </div>
      </div>
    )
  }

  const ahorroPct = pctAhorro(expediente.precioBase, expediente.montoAdjudicado)
  const ahorroAbs = expediente.precioBase - expediente.montoAdjudicado

  return (
    <div className="flex flex-col gap-5">
      {/* Volver */}
      <button
        type="button"
        onClick={onVolver}
        className="flex items-center gap-1.5 text-xs text-tenant-muted hover:text-tenant-text transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la bandeja
      </button>

      {/* Header */}
      <div className="p-4 rounded-2xl bg-tenant-surface/50 border border-tenant-border/30 backdrop-blur-glass space-y-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
              {expediente.expedienteNum}
            </p>
            <h2 className="text-base font-bold text-tenant-text mt-0.5">
              {expediente.titulo}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1 text-[11px] text-tenant-muted">
              <Building2 className="w-3.5 h-3.5" />
              {expediente.area}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tenant-surface/60 border border-tenant-border/40 text-tenant-muted">
              {expediente.modalidad}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-tenant-muted leading-snug">{expediente.descripcion}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Precio base"
          value={CURRENCY_FORMAT.format(expediente.precioBase)}
          sub="Presupuesto oficial"
          icon={Building2}
        />
        <StatCard
          label="Monto adjudicado"
          value={CURRENCY_FORMAT.format(expediente.montoAdjudicado)}
          sub="Mejor oferta final"
          icon={Award}
          accent
        />
        <StatCard
          label="Ahorro logrado"
          value={`${ahorroPct}%`}
          sub={CURRENCY_FORMAT.format(ahorroAbs)}
          icon={TrendingDown}
          accent
        />
        <StatCard
          label="Adjudicatario"
          value={expediente.ganador.razonSocial}
          sub={`CUIT ${expediente.ganador.cuit}`}
        />
      </div>

      {/* Cuadro comparativo */}
      <CuadroComparativo
        ofertas={expediente.ofertas}
        montoGanador={expediente.montoAdjudicado}
      />

      {/* Circuito de aprobación */}
      <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 backdrop-blur-glass">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted mb-4">
          Circuito de Aprobación
          <span className="ml-2 font-normal normal-case text-[10px]">
            — {circuito.length} etapas configuradas para {expediente.modalidad}
          </span>
        </p>
        <TimelineAprobacion
          circuito={circuito}
          onFirmar={onFirmar}
          firmando={firmando}
          userRole={userRole}
          userName={userName}
        />
      </div>
    </div>
  )
}

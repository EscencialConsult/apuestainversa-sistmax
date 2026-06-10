import { TrendingDown, Zap, Clock, Award } from 'lucide-react'
import { cn } from '../../../utils/cn'

const HORA_FORMAT = new Intl.DateTimeFormat('es-AR', { timeStyle: 'medium' })
const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

function duracionSesion(lances) {
  if (lances.length < 2) return '—'
  const inicio = new Date(lances[0].timestamp).getTime()
  const fin    = new Date(lances[lances.length - 1].timestamp).getTime()
  const mins   = Math.round((fin - inicio) / 60_000)
  return `${mins} min`
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className={cn(
      'flex flex-col gap-1 p-4 rounded-2xl border backdrop-blur-glass',
      accent ? 'bg-tenant-success/8 border-tenant-success/25' : 'bg-tenant-surface/50 border-tenant-border/30',
    )}>
      <div className={cn(
        'w-7 h-7 rounded-lg border flex items-center justify-center mb-1',
        accent ? 'bg-tenant-success/15 border-tenant-success/30 text-tenant-success' : 'bg-tenant-primary/15 border-tenant-primary/30 text-tenant-primary',
      )}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">{label}</p>
      <p className={cn('text-base font-bold font-mono tabular-nums', accent ? 'text-tenant-success' : 'text-tenant-text')}>{value}</p>
    </div>
  )
}

export function TabSubasta({ lances, ganador, montoBase, montoAdjudicado }) {
  const ahorroPct = (((montoBase - montoAdjudicado) / montoBase) * 100).toFixed(1)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Zap}        label="Total lances"   value={lances.length}                                    />
        <StatCard icon={Clock}      label="Duración"        value={duracionSesion(lances)}                           />
        <StatCard icon={TrendingDown} label="Ahorro logrado" value={`${ahorroPct}%`}                    accent       />
        <StatCard icon={Award}      label="Precio final"   value={CURRENCY_FORMAT.format(montoAdjudicado)} accent    />
      </div>

      {/* Historial de lances */}
      <div className="rounded-2xl border border-tenant-border/30 bg-tenant-surface/40 backdrop-blur-glass overflow-hidden">
        <div className="px-4 py-3 border-b border-tenant-border/25 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
            Historial de Lances
          </p>
          <p className="text-[10px] text-tenant-muted">
            Base: {CURRENCY_FORMAT.format(montoBase)} · Final: {CURRENCY_FORMAT.format(montoAdjudicado)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-tenant-border/20 bg-tenant-surface/30">
                <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted w-8">#</th>
                <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Hora</th>
                <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Proveedor</th>
                <th scope="col" className="text-right py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Oferta</th>
                <th scope="col" className="text-right py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Reducción</th>
              </tr>
            </thead>
            <tbody>
              {lances.map((lance, idx) => {
                const prev = idx > 0 ? lances[idx - 1].monto : montoBase
                const reduccion = prev - lance.monto
                const esUltimo  = idx === lances.length - 1

                return (
                  <tr
                    key={lance.id}
                    className={cn(
                      'border-b border-tenant-border/15 transition-colors',
                      esUltimo ? 'bg-tenant-success/6' : (lance.esMejorOferta ? 'bg-tenant-accent/4' : 'hover:bg-tenant-surface/60'),
                    )}
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] text-tenant-muted">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-tenant-muted whitespace-nowrap">
                      {HORA_FORMAT.format(new Date(lance.timestamp))}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={cn('font-medium', esUltimo ? 'text-tenant-success' : 'text-tenant-text')}>
                        {lance.razonSocial}
                      </span>
                      {esUltimo && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-tenant-success/15 border border-tenant-success/30 text-tenant-success uppercase">
                          Ganador
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-tenant-text">
                      {CURRENCY_FORMAT.format(lance.monto)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {reduccion > 0 ? (
                        <span className="text-tenant-success font-mono text-[11px] font-semibold">
                          −{CURRENCY_FORMAT.format(reduccion)}
                        </span>
                      ) : (
                        <span className="text-tenant-muted">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ganador */}
      <div className="p-4 rounded-2xl bg-tenant-success/8 border border-tenant-success/25 flex items-center gap-3">
        <Award className="w-6 h-6 text-tenant-success flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-tenant-success">{ganador.razonSocial}</p>
          <p className="text-[10px] text-tenant-muted">
            CUIT {ganador.cuit} · Oferta adjudicada: {CURRENCY_FORMAT.format(montoAdjudicado)}
          </p>
        </div>
      </div>
    </div>
  )
}

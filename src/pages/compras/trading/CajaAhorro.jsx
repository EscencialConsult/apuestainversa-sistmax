import { TrendingDown } from 'lucide-react'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

/**
 * Indicador principal del ahorro: (Precio Base - Mejor Precio Actual)
 * recalculado en tiempo real con cada lance.
 */
export function CajaAhorro({ precioBase, mejorMonto, ahorro, ahorroPct }) {
  return (
    <div className="relative flex flex-col gap-3 p-6 rounded-2xl bg-gradient-to-br from-tenant-success/10 via-tenant-surface/60 to-tenant-surface/60 border border-tenant-success/30 backdrop-blur-glass overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-tenant-success/10 blur-2xl pointer-events-none" />

      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-tenant-muted">
        <TrendingDown className="w-3.5 h-3.5 text-tenant-success" /> Ahorro estimado
      </p>

      <div className="flex items-end gap-3 flex-wrap">
        <p className="font-mono text-4xl font-bold text-tenant-success tabular-nums drop-shadow-[0_0_12px_rgb(var(--color-success)/0.5)]">
          {CURRENCY_FORMAT.format(ahorro)}
        </p>
        <span className="px-2 py-1 rounded-lg bg-tenant-success/15 border border-tenant-success/30 text-tenant-success text-sm font-bold tabular-nums">
          {ahorroPct.toFixed(1)}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-tenant-border/20 pt-3 text-xs">
        <div>
          <p className="text-tenant-muted">Precio base</p>
          <p className="font-mono font-semibold text-tenant-text tabular-nums">{CURRENCY_FORMAT.format(precioBase)}</p>
        </div>
        <div>
          <p className="text-tenant-muted">Mejor oferta</p>
          <p className="font-mono font-semibold text-tenant-primary tabular-nums">{CURRENCY_FORMAT.format(mejorMonto)}</p>
        </div>
      </div>
    </div>
  )
}

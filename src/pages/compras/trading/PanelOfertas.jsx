import { Crown, Activity } from 'lucide-react'
import { cn } from '../../../utils/cn'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

const HORA_FORMAT = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit', minute: '2-digit', second: '2-digit',
})

/** Identidad visible según rol: el funcionario ve razones sociales,
 *  el proveedor ve oferentes anonimizados (salvo sus propios lances). */
function nombreOferente(lance, { verIdentidades, esPropio }) {
  if (esPropio) return 'Tu oferta'
  if (verIdentidades) return lance.razonSocial
  return `Oferente ${lance.oferenteId.slice(-4).toUpperCase()}`
}

/**
 * Historial vivo de lances: la oferta ganadora SIEMPRE arriba destacada,
 * el resto del ranking hacia abajo. Cada fila nueva entra con flash
 * glassmorphism usando el acento del tenant (animate-bid-drop).
 */
export function PanelOfertas({ ranking, verIdentidades, idPropio, enVivo }) {
  return (
    <div className="flex flex-col rounded-2xl bg-tenant-surface/60 border border-tenant-border/40 backdrop-blur-glass overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-tenant-border/30">
        <p className="text-xs font-bold uppercase tracking-widest text-tenant-muted">
          Ranking de lances
        </p>
        {enVivo && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-tenant-danger">
            <Activity className="w-3 h-3 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-tenant-danger animate-pulse" />
            EN VIVO
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[420px] scrollbar-thin">
        {ranking.length === 0 && (
          <p className="px-5 py-12 text-center text-xs text-tenant-muted">
            Aún no se registraron lances. La sala está abierta.
          </p>
        )}

        {ranking.map((lance, i) => {
          const esGanador = i === 0
          const esPropio = lance.oferenteId === idPropio
          return (
            <div
              key={lance.id}
              className={cn(
                'flex items-center gap-3 px-5 py-3 border-b border-tenant-border/15 last:border-0',
                'animate-bid-drop transition-colors',
                esGanador
                  ? 'bg-gradient-to-r from-tenant-primary/15 via-tenant-accent/5 to-transparent shadow-[inset_3px_0_0_rgb(var(--color-primary))]'
                  : esPropio
                    ? 'bg-tenant-secondary/5'
                    : 'hover:bg-white/[0.03]',
              )}
            >
              {/* Posición */}
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold',
                esGanador
                  ? 'bg-tenant-primary/20 border border-tenant-primary/50 text-tenant-primary shadow-neon'
                  : 'bg-white/5 border border-tenant-border/30 text-tenant-muted',
              )}>
                {esGanador ? <Crown className="w-3.5 h-3.5" /> : i + 1}
              </div>

              {/* Oferente */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-xs font-semibold truncate',
                  esGanador ? 'text-tenant-primary' : esPropio ? 'text-tenant-secondary' : 'text-tenant-text',
                )}>
                  {nombreOferente(lance, { verIdentidades, esPropio })}
                </p>
                <p className="text-[10px] text-tenant-muted font-mono">
                  {HORA_FORMAT.format(lance.hora)}
                </p>
              </div>

              {/* Monto */}
              <p className={cn(
                'font-mono text-sm font-bold tabular-nums shrink-0',
                esGanador
                  ? 'text-tenant-primary drop-shadow-[0_0_8px_rgb(var(--color-primary)/0.5)]'
                  : 'text-tenant-text',
              )}>
                {CURRENCY_FORMAT.format(lance.monto)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

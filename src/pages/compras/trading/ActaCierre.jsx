import { useState } from 'react'
import { FileCheck, Crown, Gavel, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../utils/cn'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

const FECHA_FORMAT = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'long', timeStyle: 'short',
})

/**
 * Acta de Cierre automática: se genera al llegar el reloj a cero.
 * Muestra el ranking final con el ganador identificado y habilita la
 * declaración de adjudicación para el funcionario competente.
 */
export function ActaCierre({ config, ranking, ahorro, ahorroPct, puedeAdjudicar }) {
  const [adjudicado, setAdjudicado] = useState(false)
  // Capturada una sola vez al montar: la fecha del acta es la del cierre,
  // no debe mutar con cada re-render
  const [fechaCierre] = useState(() => Date.now())
  const ganador = ranking[0] ?? null

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Cabecera del acta */}
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-tenant-surface/60 border border-tenant-primary/30 backdrop-blur-glass text-center">
        <div className="p-3 rounded-2xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon">
          <FileCheck className="w-8 h-8 text-tenant-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-tenant-text">Acta de Cierre de Subasta</h2>
          <p className="text-xs text-tenant-muted mt-1 font-mono">
            {config.expediente} · {FECHA_FORMAT.format(fechaCierre)}
          </p>
        </div>
        {ganador && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs border-t border-tenant-border/20 pt-3 w-full">
            <span className="text-tenant-muted">
              Mejor oferta: <span className="font-mono font-bold text-tenant-primary">{CURRENCY_FORMAT.format(ganador.monto)}</span>
            </span>
            <span className="text-tenant-muted">
              Ahorro final: <span className="font-mono font-bold text-tenant-success">{CURRENCY_FORMAT.format(ahorro)} ({ahorroPct.toFixed(1)}%)</span>
            </span>
            <span className="text-tenant-muted">
              Lances recibidos: <span className="font-bold text-tenant-text">{ranking.length}</span>
            </span>
          </div>
        )}
      </div>

      {/* Ranking final */}
      <div className="rounded-2xl bg-tenant-surface/50 border border-tenant-border/40 backdrop-blur-glass overflow-hidden">
        <div className="px-5 py-3 border-b border-tenant-border/30">
          <p className="text-xs font-bold uppercase tracking-widest text-tenant-muted">Ranking final de ofertas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-tenant-border/30 bg-white/5 text-left">
                <th className="px-5 py-2.5 font-semibold text-tenant-muted uppercase tracking-wider">#</th>
                <th className="px-5 py-2.5 font-semibold text-tenant-muted uppercase tracking-wider">Oferente</th>
                <th className="px-5 py-2.5 font-semibold text-tenant-muted uppercase tracking-wider text-right">Oferta final</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((lance, i) => (
                <tr
                  key={lance.id}
                  className={cn(
                    'border-b border-tenant-border/15 last:border-0',
                    i === 0 && 'bg-gradient-to-r from-tenant-primary/10 to-transparent',
                  )}
                >
                  <td className="px-5 py-3">
                    {i === 0
                      ? <Crown className="w-4 h-4 text-tenant-primary" />
                      : <span className="text-tenant-muted">{i + 1}</span>}
                  </td>
                  <td className={cn(
                    'px-5 py-3 font-semibold',
                    i === 0 ? 'text-tenant-primary' : 'text-tenant-text',
                  )}>
                    {lance.razonSocial}
                    {i === 0 && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full bg-tenant-primary/15 border border-tenant-primary/30 text-[9px] font-bold uppercase">
                        Ganador
                      </span>
                    )}
                  </td>
                  <td className={cn(
                    'px-5 py-3 font-mono font-bold tabular-nums text-right',
                    i === 0 ? 'text-tenant-primary' : 'text-tenant-text',
                  )}>
                    {CURRENCY_FORMAT.format(lance.monto)}
                  </td>
                </tr>
              ))}
              {ranking.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-tenant-muted">
                    La subasta cerró sin lances registrados — proceso desierto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declaración de adjudicación — solo funcionario competente */}
      {puedeAdjudicar && ganador && (
        adjudicado ? (
          <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-tenant-success/10 border border-tenant-success/30 text-tenant-success text-sm font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5" />
            Adjudicación declarada — el expediente pasó al módulo de Adjudicación.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdjudicado(true)}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-tenant-accent/20 border border-tenant-accent/50 text-tenant-accent text-sm font-bold hover:bg-tenant-accent/30 transition-all shadow-neon-accent"
          >
            <Gavel className="w-4 h-4" />
            Declarar Adjudicación a {ganador.razonSocial}
          </button>
        )
      )}
    </div>
  )
}

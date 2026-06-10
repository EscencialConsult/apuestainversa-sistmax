import { useState } from 'react'
import { Send, Zap, Lock } from 'lucide-react'
import { cn } from '../../../utils/cn'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

/**
 * Panel de oferta del Proveedor habilitado.
 * Validación en vivo: la oferta debe ser ≤ (mejor precio - decremento mínimo).
 * Si no cumple: borde rojo neón + botón deshabilitado.
 * "Envío Rápido" autollena el máximo permitido (mejor - decremento).
 */
export function PanelLance({ mejorMonto, decrementoMinimo, bloqueado, onLance }) {
  const [valor, setValor] = useState('')
  const [feedback, setFeedback] = useState(null) // { tipo: 'ok'|'error', msg }

  const limite = mejorMonto - decrementoMinimo
  const monto = Number(valor)
  const tieneValor = valor !== '' && !Number.isNaN(monto)
  const esValido = tieneValor && monto > 0 && monto <= limite
  const invalido = tieneValor && !esValido

  const enviar = (montoEnviar) => {
    const resultado = onLance(montoEnviar)
    if (resultado.ok) {
      setValor('')
      setFeedback({ tipo: 'ok', msg: `Lance de ${CURRENCY_FORMAT.format(montoEnviar)} registrado.` })
    } else {
      setFeedback({ tipo: 'error', msg: resultado.error })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!esValido || bloqueado) return
    enviar(monto)
  }

  if (bloqueado) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 backdrop-blur-glass text-tenant-muted text-sm">
        <Lock className="w-4 h-4" />
        Subasta finalizada — ofertas cerradas
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-tenant-accent/10 via-tenant-surface/60 to-tenant-surface/60 border border-tenant-accent/30 backdrop-blur-glass"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-tenant-muted">
          Tu próximo lance
        </p>
        <p className="text-[10px] text-tenant-muted">
          Máximo permitido: <span className="font-mono font-bold text-tenant-accent">{CURRENCY_FORMAT.format(limite)}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tenant-muted text-sm font-mono">$</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max={limite}
            step="100"
            placeholder={String(limite)}
            aria-label="Monto de tu oferta"
            aria-invalid={invalido}
            value={valor}
            onChange={(e) => { setValor(e.target.value); setFeedback(null) }}
            className={cn(
              'w-full pl-8 pr-4 py-3 rounded-xl font-mono text-lg font-bold tabular-nums',
              'bg-white/5 text-tenant-text placeholder:text-tenant-muted/40',
              'focus:outline-none transition-all border',
              invalido
                ? 'border-tenant-danger ring-1 ring-tenant-danger/60 shadow-[0_0_12px_rgb(var(--color-danger)/0.4)]'
                : 'border-tenant-border/40 focus:border-tenant-accent/60 focus:ring-1 focus:ring-tenant-accent/40',
            )}
          />
        </div>

        <button
          type="submit"
          disabled={!esValido}
          className={cn(
            'flex items-center gap-2 px-5 rounded-xl text-sm font-bold transition-all',
            'bg-tenant-accent/20 border border-tenant-accent/50 text-tenant-accent',
            'hover:bg-tenant-accent/30 shadow-neon-accent',
            'disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed',
          )}
        >
          <Send className="w-4 h-4" /> Ofertar
        </button>
      </div>

      {invalido && (
        <p className="text-[11px] text-tenant-danger">
          La oferta debe ser menor o igual a {CURRENCY_FORMAT.format(limite)} (mejor precio − decremento mínimo de {CURRENCY_FORMAT.format(decrementoMinimo)}).
        </p>
      )}
      {feedback && (
        <p className={cn(
          'text-[11px]',
          feedback.tipo === 'ok' ? 'text-tenant-success' : 'text-tenant-danger',
        )}>
          {feedback.msg}
        </p>
      )}

      {/* Envío Rápido: autollena el mejor lance posible */}
      <button
        type="button"
        onClick={() => enviar(limite)}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/40 text-tenant-primary text-xs font-bold hover:bg-tenant-primary/25 transition-all shadow-neon"
      >
        <Zap className="w-3.5 h-3.5" />
        Envío Rápido — ofertar {CURRENCY_FORMAT.format(limite)}
      </button>
    </form>
  )
}

import { useState, useEffect, useEffectEvent } from 'react'
import { TimerReset, Timer } from 'lucide-react'
import { cn } from '../../../utils/cn'

const calcularRestante = (finalizaEn) =>
  Math.max(0, Math.ceil((finalizaEn - Date.now()) / 1000))

const formatear = (seg) => {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Reloj de cuenta regresiva AISLADO: su estado muta cada segundo, por eso
 * vive en su propio componente — el tick re-renderiza SOLO este nodo,
 * nunca la lista de ofertas ni el resto del trading dashboard.
 *
 * @param {number} finalizaEn — timestamp de cierre (muta con la regla anti-sniper)
 * @param {Function} onFinalizar — callback estable al llegar a cero
 * @param {number|null} ultimaExtension — timestamp de la última extensión (para el aviso)
 */
export function RelojCuentaRegresiva({ finalizaEn, onFinalizar, ultimaExtension }) {
  const [restante, setRestante] = useState(() => calcularRestante(finalizaEn))

  // Effect Event: siempre ve el onFinalizar más reciente sin ser dependencia
  // del efecto — el intervalo NO se re-suscribe si el padre re-renderiza.
  const notificarCierre = useEffectEvent(() => onFinalizar())

  useEffect(() => {
    // 250ms: precisión visual sin drift acumulado (se recalcula contra
    // Date.now() en cada tick). Tras una extensión anti-sniper el efecto se
    // re-suscribe (cambia finalizaEn) y el primer tick re-sincroniza en ≤250ms.
    const intervalo = setInterval(() => {
      const seg = calcularRestante(finalizaEn)
      setRestante(seg)
      if (seg <= 0) {
        clearInterval(intervalo)
        notificarCierre()
      }
    }, 250)
    return () => clearInterval(intervalo)
  }, [finalizaEn])

  const critico = restante <= 30
  const advertencia = !critico && restante <= 120

  return (
    <div className={cn(
      'relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border backdrop-blur-glass transition-colors duration-500',
      critico
        ? 'bg-tenant-danger/10 border-tenant-danger/40'
        : advertencia
          ? 'bg-tenant-warning/10 border-tenant-warning/40'
          : 'bg-tenant-surface/60 border-tenant-border/40',
    )}>
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-tenant-muted">
        <Timer className="w-3.5 h-3.5" /> Cierre de subasta
      </p>

      <p
        aria-live={critico ? 'assertive' : 'off'}
        className={cn(
          'font-mono text-5xl font-bold tabular-nums transition-colors duration-300',
          critico
            ? 'text-tenant-danger animate-pulse drop-shadow-[0_0_12px_rgb(var(--color-danger)/0.7)]'
            : advertencia
              ? 'text-tenant-warning drop-shadow-[0_0_10px_rgb(var(--color-warning)/0.5)]'
              : 'text-tenant-primary drop-shadow-[0_0_10px_rgb(var(--color-primary)/0.5)]',
        )}
      >
        {formatear(restante)}
      </p>

      {advertencia && (
        <p className="text-[10px] text-tenant-warning">
          Ventana anti-sniper activa: un lance extiende +3:00
        </p>
      )}

      {/* Aviso de extensión anti-sniper: la animación CSS (flash-out) lo
          muestra y desvanece sola — sin estado ni timers en React.
          El key fuerza el remount (y re-animación) en cada extensión. */}
      {ultimaExtension != null && (
        <div
          key={ultimaExtension}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-tenant-accent/20 border border-tenant-accent/50 text-tenant-accent text-[10px] font-bold whitespace-nowrap shadow-neon-accent animate-flash-out pointer-events-none"
        >
          <TimerReset className="w-3 h-3" />
          Tiempo extendido +3:00
        </div>
      )}
    </div>
  )
}

import { Check, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

// Default estable: evita crear un array nuevo por render
const EMPTY_PASOS = []

/**
 * Wizard de pasos genérico con estado visual por paso.
 *
 * Layout horizontal: cada paso es una columna flex-1 cuya fila superior es
 * [media-línea izquierda | círculo | media-línea derecha] con items-center,
 * así el conector queda SIEMPRE centrado verticalmente con el círculo sin
 * márgenes negativos, sin importar el tamaño del nodo.
 *
 * @param {Array}  props.pasos  — [{ id, label, description?, error? }]
 * @param {number} props.pasoActual — índice 0-based del paso activo
 * @param {Function} [props.onPasoClick] — si se provee, los pasos completados son clickeables
 * @param {'horizontal'|'vertical'} [props.variant]
 */
export function WizardPasos({ pasos = EMPTY_PASOS, pasoActual = 0, onPasoClick, variant = 'horizontal', className }) {

  const nodeClasses = (paso, i) => {
    const isCompleted = i < pasoActual
    const isActive    = i === pasoActual
    const isError     = paso.error
    const isClickable = isCompleted && onPasoClick
    return cn(
      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
      'border-2 transition-all duration-200',
      isError && 'border-tenant-danger bg-tenant-danger/20 text-tenant-danger',
      isCompleted && !isError && 'border-tenant-success bg-tenant-success/20 text-tenant-success',
      isActive && !isError && 'border-tenant-primary bg-tenant-primary/20 text-tenant-primary shadow-neon',
      !isCompleted && !isActive && 'border-tenant-border/40 bg-white/5 text-tenant-muted',
      isClickable && 'cursor-pointer hover:scale-105',
    )
  }

  const nodeContent = (paso, i) => {
    if (paso.error) return <AlertCircle className="w-4 h-4" />
    if (i < pasoActual) return <Check className="w-4 h-4" />
    return <span>{i + 1}</span>
  }

  const labelClasses = (i) => cn(
    'font-semibold leading-tight',
    i === pasoActual ? 'text-tenant-primary' : i < pasoActual ? 'text-tenant-success' : 'text-tenant-muted',
  )

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col', className)}>
        {pasos.map((paso, i) => {
          const isCompleted = i < pasoActual
          const isClickable = isCompleted && onPasoClick
          const isLast = i === pasos.length - 1
          return (
            <div key={paso.id} className="flex gap-4">
              {/* Columna nodo + conector vertical */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={isClickable ? () => onPasoClick(i) : undefined}
                  disabled={!isClickable && i !== pasoActual}
                  className={nodeClasses(paso, i)}
                >
                  {nodeContent(paso, i)}
                </button>
                {!isLast && (
                  <div className={cn(
                    'w-0.5 flex-1 min-h-8 rounded-full transition-all duration-500',
                    isCompleted ? 'bg-tenant-success' : 'bg-tenant-border/30',
                  )} />
                )}
              </div>
              {/* Texto */}
              <div className={cn('pt-1.5', !isLast && 'pb-8')}>
                <p className={cn('text-sm', labelClasses(i))}>{paso.label}</p>
                {paso.description && (
                  <p className="text-xs text-tenant-muted mt-0.5">{paso.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Horizontal
  return (
    <div className={cn('flex overflow-x-auto pb-1', className)}>
      {pasos.map((paso, i) => {
        const isCompleted = i < pasoActual
        const isClickable = isCompleted && onPasoClick
        const isFirst = i === 0
        const isLast  = i === pasos.length - 1
        // La media-línea izquierda se "completa" cuando el paso anterior está hecho
        const leftDone  = i <= pasoActual && i > 0 && i - 1 < pasoActual
        const rightDone = i < pasoActual

        return (
          <div key={paso.id} className="flex-1 min-w-[90px] flex flex-col items-center gap-2">
            {/* Fila: línea | círculo | línea — centrado automático con items-center */}
            <div className="w-full flex items-center">
              <div className={cn(
                'h-0.5 flex-1 rounded-full transition-all duration-500',
                isFirst ? 'opacity-0' : leftDone ? 'bg-tenant-success' : 'bg-tenant-border/30',
              )} />
              <button
                type="button"
                onClick={isClickable ? () => onPasoClick(i) : undefined}
                disabled={!isClickable && i !== pasoActual}
                className={cn(nodeClasses(paso, i), 'mx-1')}
              >
                {nodeContent(paso, i)}
              </button>
              <div className={cn(
                'h-0.5 flex-1 rounded-full transition-all duration-500',
                isLast ? 'opacity-0' : rightDone ? 'bg-tenant-success' : 'bg-tenant-border/30',
              )} />
            </div>

            {/* Label */}
            <div className="text-center px-1 max-w-[120px]">
              <p className={cn('text-[11px]', labelClasses(i))}>{paso.label}</p>
              {paso.description && (
                <p className="text-[10px] text-tenant-muted mt-0.5 hidden md:block">{paso.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

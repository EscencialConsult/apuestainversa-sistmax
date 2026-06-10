import { cn } from '../../utils/cn'

/**
 * Controles de formulario estandarizados del design system.
 * Todos heredan la paleta del tenant activo — nunca hardcodear colores acá.
 */

const baseControl = cn(
  'w-full px-3.5 py-2.5 text-sm rounded-xl',
  'bg-white/5 border border-tenant-border/40 text-tenant-text',
  'placeholder:text-tenant-muted',
  'focus:outline-none focus:border-tenant-primary/50 focus:ring-1 focus:ring-tenant-primary/30',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-all',
)

const errorControl = 'border-tenant-danger/60 focus:border-tenant-danger focus:ring-tenant-danger/30'

export function Field({ label, required, error, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-tenant-text">
          {label}
          {required && <span className="text-tenant-danger ml-1">*</span>}
        </label>
      )}
      {children}
      {error
        ? <p className="text-[11px] text-tenant-danger">{error}</p>
        : hint && <p className="text-[11px] text-tenant-muted">{hint}</p>
      }
    </div>
  )
}

export function Input({ error, className, ...props }) {
  return (
    <input
      className={cn(baseControl, error && errorControl, className)}
      {...props}
    />
  )
}

export function Textarea({ error, className, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(baseControl, 'resize-y min-h-[80px]', error && errorControl, className)}
      {...props}
    />
  )
}

export function Select({ error, className, children, ...props }) {
  return (
    <select
      className={cn(baseControl, 'cursor-pointer', error && errorControl, className)}
      {...props}
    >
      {children}
    </select>
  )
}

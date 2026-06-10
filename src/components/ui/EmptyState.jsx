import { AlertTriangle, Inbox, PlusCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Estado vacío parametrizado. Obligatorio cuando el municipio aún no cargó
 * parámetros requeridos para operar (rubros, modalidades, plantillas oficiales).
 *
 * isMandatory=true → estilo de advertencia crítica: el módulo NO puede operar
 * hasta que se complete la carga (restricción de negocio, no decorativa).
 *
 * Nota: los colores usan clases tenant-* (variables CSS del TenantContext).
 * Interpolar valores en clases (bg-[${color}]) no compila en Tailwind JIT.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  isMandatory = false,
  icon: Icon,
  className,
}) {
  const FallbackIcon = isMandatory ? AlertTriangle : Inbox
  const DisplayIcon = Icon || FallbackIcon

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-12 mt-6 rounded-2xl text-center',
      'bg-tenant-surface/40 backdrop-blur-glass border',
      isMandatory ? 'border-tenant-danger/30' : 'border-tenant-border/40 border-dashed',
      className,
    )}>
      <div className={cn(
        'p-4 rounded-full mb-4 border',
        isMandatory
          ? 'bg-tenant-danger/15 text-tenant-danger border-tenant-danger/30'
          : 'bg-tenant-primary/15 text-tenant-primary border-tenant-primary/30',
      )}>
        <DisplayIcon size={32} />
      </div>

      <h3 className="text-xl font-semibold text-tenant-text mb-2">
        {title}
      </h3>

      <p className="text-sm text-tenant-muted max-w-md mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300',
            isMandatory
              ? 'bg-tenant-danger/20 border border-tenant-danger/40 text-tenant-danger hover:bg-tenant-danger/30 shadow-[0_0_15px_rgb(var(--color-danger)/0.4)]'
              : 'bg-tenant-accent/20 border border-tenant-accent/40 text-tenant-accent hover:bg-tenant-accent/30 shadow-neon-accent',
          )}
        >
          <PlusCircle size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

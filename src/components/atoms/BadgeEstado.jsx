import { cn } from '../../utils/cn'

const VARIANTS = {
  activo:      { label: 'Activo',       classes: 'bg-tenant-success/15 text-tenant-success border-tenant-success/30' },
  inactivo:    { label: 'Inactivo',     classes: 'bg-tenant-muted/15 text-tenant-muted border-tenant-muted/30' },
  pendiente:   { label: 'Pendiente',    classes: 'bg-tenant-warning/15 text-tenant-warning border-tenant-warning/30' },
  aprobado:    { label: 'Aprobado',     classes: 'bg-tenant-success/15 text-tenant-success border-tenant-success/30' },
  rechazado:   { label: 'Rechazado',    classes: 'bg-tenant-danger/15 text-tenant-danger border-tenant-danger/30' },
  en_subasta:  { label: 'En Subasta',   classes: 'bg-tenant-primary/15 text-tenant-primary border-tenant-primary/30 animate-pulse-slow' },
  adjudicado:  { label: 'Adjudicado',   classes: 'bg-tenant-accent/15 text-tenant-accent border-tenant-accent/30' },
  borrador:    { label: 'Borrador',     classes: 'bg-tenant-muted/10 text-tenant-muted border-tenant-muted/20' },
  en_revision: { label: 'En Revisión',  classes: 'bg-tenant-warning/15 text-tenant-warning border-tenant-warning/30' },
  cerrado:     { label: 'Cerrado',      classes: 'bg-tenant-muted/15 text-tenant-muted border-tenant-muted/30' },
}

const SIZES = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

const DOT_SIZES = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

/**
 * @param {Object} props
 * @param {'activo'|'inactivo'|'pendiente'|'aprobado'|'rechazado'|'en_subasta'|'adjudicado'|'borrador'|'en_revision'|'cerrado'} props.estado
 * @param {string} [props.label] — override del texto
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.dot] — muestra punto de estado
 */
export function BadgeEstado({ estado, label, size = 'md', dot = true, className }) {
  const variant = VARIANTS[estado] || VARIANTS.borrador

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border',
        SIZES[size],
        variant.classes,
        className,
      )}
    >
      {dot && (
        <span className={cn('rounded-full bg-current', DOT_SIZES[size])} />
      )}
      {label ?? variant.label}
    </span>
  )
}

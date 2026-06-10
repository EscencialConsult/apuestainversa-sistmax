import { Calendar, DollarSign, Tag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { BadgeEstado } from './BadgeEstado'

// Formatters a nivel módulo: construir Intl.* es caro, no se rehace por render
const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})
const formatCurrency = (n) => CURRENCY_FORMAT.format(n)
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })

/**
 * Tarjeta de resumen de un proceso/expediente de compra.
 * @param {Object} props.proceso
 * @param {string} props.proceso.id
 * @param {string} props.proceso.numero — "EXP-2025-0142"
 * @param {string} props.proceso.titulo
 * @param {string} props.proceso.estado
 * @param {string} props.proceso.modalidad — "Subasta Inversa", "Licitación", etc.
 * @param {number} props.proceso.presupuesto
 * @param {string} props.proceso.fechaApertura — ISO date string
 * @param {number} [props.proceso.ofertasCount]
 */
export function CardProceso({ proceso, className }) {
  // <Link> nativo: semántica de <a> real para lectores de pantalla y teclado,
  // sin handlers manuales de onKeyDown
  return (
    <Link
      to={`/compras/${proceso.id}`}
      aria-label={`Ver expediente ${proceso.numero}: ${proceso.titulo}`}
      className={cn(
        'group relative flex flex-col gap-3 p-5 rounded-2xl cursor-pointer',
        'bg-tenant-surface/60 backdrop-blur-glass border border-tenant-border/40',
        'hover:border-tenant-primary/40 hover:shadow-glass hover:bg-tenant-surface/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tenant-primary/60',
        'transition-all duration-200 animate-fade-in',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-tenant-primary/70 mb-1">{proceso.numero}</p>
          <h3 className="text-sm font-semibold text-tenant-text leading-snug line-clamp-2 group-hover:text-tenant-primary transition-colors">
            {proceso.titulo}
          </h3>
        </div>
        <BadgeEstado estado={proceso.estado} size="sm" className="shrink-0 mt-0.5" />
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-3 text-xs text-tenant-muted">
        <span className="flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" />
          {proceso.modalidad}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(proceso.fechaApertura)}
        </span>
        {proceso.ofertasCount != null && (
          <span className="flex items-center gap-1">
            <span className="text-tenant-accent font-semibold">{proceso.ofertasCount}</span> ofertas
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-tenant-border/20 pt-3">
        <div className="flex items-center gap-1 text-sm font-bold text-tenant-text">
          <DollarSign className="w-4 h-4 text-tenant-success" />
          {formatCurrency(proceso.presupuesto)}
        </div>
        <ArrowRight className="w-4 h-4 text-tenant-muted group-hover:text-tenant-primary group-hover:translate-x-1 transition-all" />
      </div>

      {/* Glow hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-tenant-primary/5 to-transparent" />
    </Link>
  )
}

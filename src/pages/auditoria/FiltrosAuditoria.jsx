import { Filter, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { MODULOS, MODULO_LABELS, TIPOS } from '../../services/api/auditoriaService'

const inputBase = cn(
  'text-xs rounded-xl px-3 py-1.5 w-full',
  'bg-tenant-surface/60 border border-tenant-border/40',
  'text-tenant-text placeholder:text-tenant-muted',
  'focus:outline-none focus:border-tenant-primary/50 transition-colors',
)

const labelBase = 'text-[10px] uppercase tracking-wider font-bold text-tenant-muted mb-1 block'

export function FiltrosAuditoria({ filtros, onCambio, onLimpiar, totalFiltrado, totalGeneral }) {
  const hayFiltros = Object.values(filtros).some(v => v !== '')

  return (
    <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 backdrop-blur-glass">
      <div className="flex items-center justify-between mb-3">
        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
          <Filter className="w-3.5 h-3.5" /> Filtros
        </p>
        <div className="flex items-center gap-3">
          {(totalFiltrado !== totalGeneral) && (
            <span className="text-[10px] text-tenant-accent font-semibold">
              {totalFiltrado} de {totalGeneral} eventos
            </span>
          )}
          {hayFiltros && (
            <button
              type="button"
              onClick={onLimpiar}
              className="flex items-center gap-1 text-[10px] text-tenant-muted hover:text-tenant-danger transition-colors"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label className={labelBase}>Desde</label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={e => onCambio('fechaDesde', e.target.value)}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelBase}>Hasta</label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={e => onCambio('fechaHasta', e.target.value)}
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelBase}>Módulo</label>
          <select
            value={filtros.modulo}
            onChange={e => onCambio('modulo', e.target.value)}
            className={inputBase}
          >
            <option value="">Todos los módulos</option>
            {Object.values(MODULOS).map(m => (
              <option key={m} value={m}>{MODULO_LABELS[m]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelBase}>Tipo</label>
          <select
            value={filtros.tipo}
            onChange={e => onCambio('tipo', e.target.value)}
            className={inputBase}
          >
            <option value="">Todos los tipos</option>
            <option value={TIPOS.INFO}>Info</option>
            <option value={TIPOS.EXITO}>Éxito</option>
            <option value={TIPOS.ADVERTENCIA}>Advertencia</option>
            <option value={TIPOS.CRITICO}>Crítico</option>
          </select>
        </div>
        <div>
          <label className={labelBase}>Búsqueda</label>
          <input
            type="search"
            placeholder="Usuario, acción, IP..."
            value={filtros.busqueda}
            onChange={e => onCambio('busqueda', e.target.value)}
            className={inputBase}
          />
        </div>
      </div>
    </div>
  )
}

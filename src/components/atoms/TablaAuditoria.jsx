import { useState } from 'react'
import { ChevronUp, ChevronDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { BadgeEstado } from './BadgeEstado'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

// Defaults estables a nivel módulo: un `= []` inline crea un array nuevo por
// render y rompe cualquier memoización aguas abajo
const EMPTY_COLUMNS = []
const EMPTY_DATA = []

// Montos y cantidades se comparan como números, NUNCA como strings:
// ordenar "$1.000.000" < "$900.000" alfabéticamente es un bug catastrófico
// en un sistema de compras. Solo se trata como número si el valor completo
// es numérico (Number() — parseFloat truncaría CUITs como "30-712..." a 30).
const toNumber = (v) => {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const cleaned = v.replace(/[$\s]/g, '').replace(/\./g, '').replace(',', '.')
    if (cleaned !== '' && !Number.isNaN(Number(cleaned))) return Number(cleaned)
  }
  return null
}

/**
 * Tabla de auditoría genérica con paginación, ordenamiento y búsqueda.
 * @param {Array} props.columns  — [{ key, label, sortable?, render? }]
 * @param {Array} props.data
 * @param {string} [props.emptyMessage]
 * @param {boolean} [props.loading]
 * @param {string} [props.title]
 */
export function TablaAuditoria({ columns = EMPTY_COLUMNS, data = EMPTY_DATA, emptyMessage, loading = false, title, className }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const filtered = data.filter(row =>
    Object.values(row).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase()),
    ),
  )

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortKey] ?? ''
        const bVal = b[sortKey] ?? ''
        const aNum = toNumber(aVal)
        const bNum = toNumber(bVal)
        const cmp = (aNum != null && bNum != null)
          ? aNum - bNum
          : String(aVal).localeCompare(String(bVal), 'es', { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filtered

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  // Exporta el dataset filtrado/ordenado completo (no solo la página visible)
  const handleExport = () => {
    const escapeCsv = (v) => {
      const s = String(v ?? '')
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const header = columns.map(c => escapeCsv(c.label)).join(';')
    const rows = sorted.map(row =>
      columns.map(c => escapeCsv(row[c.key])).join(';'),
    )
    // BOM para que Excel abra los acentos correctamente
    const blob = new Blob(['﻿' + [header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(title || 'export').toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {title && <h2 className="text-sm font-semibold text-tenant-text">{title}</h2>}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tenant-muted" />
            <input
              type="text"
              placeholder="Buscar..."
              aria-label="Buscar en la tabla"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/5 border border-tenant-border/40 text-tenant-text placeholder:text-tenant-muted focus:outline-none focus:border-tenant-primary/50 w-44"
            />
          </div>
          <button
            type="button"
            onClick={handleExport}
            title="Exportar CSV"
            aria-label="Exportar CSV"
            className="p-1.5 rounded-xl border border-tenant-border/40 text-tenant-muted hover:text-tenant-primary hover:border-tenant-primary/40 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-tenant-border/40 overflow-hidden bg-tenant-surface/40 backdrop-blur-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-tenant-border/40 bg-white/5">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={cn(
                      'px-4 py-3 text-left font-semibold text-tenant-muted uppercase tracking-wider whitespace-nowrap',
                      col.sortable !== false && 'cursor-pointer hover:text-tenant-primary transition-colors select-none',
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable !== false && sortKey === col.key && (
                        sortDir === 'asc'
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-tenant-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" />
                      Cargando...
                    </div>
                  </td>
                </tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-tenant-muted">
                    {emptyMessage || 'No hay registros para mostrar.'}
                  </td>
                </tr>
              )}
              {!loading && paginated.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-b border-tenant-border/20 last:border-0 hover:bg-white/5 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-tenant-text">
                      {col.render
                        ? col.render(row[col.key], row)
                        : col.key === 'estado'
                          ? <BadgeEstado estado={row[col.key]} size="sm" />
                          : <span>{row[col.key] ?? '—'}</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-tenant-muted">
        <div className="flex items-center gap-2">
          <span>Filas:</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="bg-white/5 border border-tenant-border/40 rounded-lg px-2 py-1 text-tenant-text"
          >
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span>{filtered.length} registros</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Página anterior"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-3">{page} / {totalPages}</span>
          <button
            type="button"
            aria-label="Página siguiente"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

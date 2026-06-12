import { useReducer, useEffect, useCallback, useRef, useState } from 'react'
import { Search, Globe, FileText, Award, Download, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'
import { getProcesosPublicos, getDocumentosPublicos } from '../../services/api/portalService'
import { CardProcesoPublico } from './CardProcesoPublico'
import { descargarTxt } from '../../utils/descargarTxt'

// ── Formatters estáticos ──────────────────────────────────────────────────────
const FECHA_FORMAT = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' })

// ── Estado de la página ───────────────────────────────────────────────────────
const pageInitial = { procesos: [], documentos: [], cargando: true }

function pageReducer(state, action) {
  if (action.type === 'CARGADO') {
    return { procesos: action.procesos, documentos: action.documentos, cargando: false }
  }
  return state
}

// ── Filtro local de procesos ───────────────────────────────────────────────────
function filtrarProcesos(procesos, q) {
  if (!q.trim()) return procesos
  const lower = q.toLowerCase()
  return procesos.filter(p =>
    p.expedienteNum.toLowerCase().includes(lower) ||
    p.titulo.toLowerCase().includes(lower) ||
    (p.ganador?.razonSocial ?? '').toLowerCase().includes(lower),
  )
}

// ── Mapas de presentación para documentos ─────────────────────────────────────
const TIPO_LABEL = {
  resolucion: 'Resolución de Adjudicación',
  orden:      'Orden de Compra',
  acta:       'Acta de Recepción Conforme',
}

const TIPO_ICON = {
  resolucion: Award,
  orden:      FileText,
  acta:       FileText,
}

// ── Fila de documento descargable ─────────────────────────────────────────────
function FilaDocumento({ doc, esDescargando, onDescargar }) {
  const Icon = TIPO_ICON[doc.tipo] ?? FileText
  const handleClick = useCallback(() => onDescargar(doc), [doc, onDescargar])

  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-tenant-surface/30 hover:bg-tenant-surface/50 transition-colors">
      <div className="flex-shrink-0 p-2 rounded-lg bg-tenant-primary/10 border border-tenant-primary/20">
        <Icon className="w-4 h-4 text-tenant-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-tenant-text truncate">
          {TIPO_LABEL[doc.tipo] ?? doc.tipo}
        </p>
        <p className="text-[10px] text-tenant-muted mt-0.5">
          {doc.expedienteNum} · {FECHA_FORMAT.format(new Date(doc.fechaEmision))}
        </p>
      </div>
      <button
        type="button"
        disabled={esDescargando}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0',
          'bg-tenant-primary/15 border border-tenant-primary/30 text-tenant-primary',
          'hover:bg-tenant-primary/25 shadow-neon disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        <Download className={cn('w-3.5 h-3.5', esDescargando && 'animate-pulse')} />
        {esDescargando ? 'Generando...' : 'Descargar .txt'}
      </button>
    </div>
  )
}

// ── Página principal del Portal Ciudadano ─────────────────────────────────────
export function PortalPage() {
  const { tenant, tenantId }   = useTenant()
  const [data, dispatch]       = useReducer(pageReducer, pageInitial)
  const [busqueda, setBusqueda] = useState('')
  const [descargandoId, setDescargandoId] = useState(null)
  const timerRef = useRef(null)

  // Carga inicial — procesos y documentos en paralelo
  useEffect(() => {
    let cancelado = false
    Promise.all([
      getProcesosPublicos(tenantId),
      getDocumentosPublicos(tenantId),
    ]).then(([procesos, documentos]) => {
      if (!cancelado) dispatch({ type: 'CARGADO', procesos, documentos })
    })
    return () => { cancelado = true }
  }, [tenantId])

  // Buscador ciudadano — debounce 300ms sobre input no controlado
  const handleBusquedaChange = useCallback((e) => {
    const valor = e.target.value
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setBusqueda(valor), 300)
  }, [])

  // Descarga de documento público con BOM para Word/Excel
  const handleDescargar = useCallback((doc) => {
    setDescargandoId(doc.id)
    setTimeout(() => {
      descargarTxt(
        `${(TIPO_LABEL[doc.tipo] ?? doc.tipo).replace(/ /g, '_')}_${doc.expedienteNum}.txt`,
        doc.contenido,
      )
      setDescargandoId(null)
    }, 600)
  }, [])

  // Filtra sin estado adicional — derivado en render
  const procesosFiltrados = filtrarProcesos(data.procesos, busqueda)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <div className="p-3.5 rounded-2xl bg-tenant-accent/15 border border-tenant-accent/30 shadow-[0_0_30px_rgb(var(--color-accent)/0.2)]">
            <Globe className="w-8 h-8 text-tenant-accent" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-tenant-text leading-tight">
            Transparencia en Compras Públicas
          </h1>
          <p className="text-sm text-tenant-muted mt-2 max-w-xl mx-auto leading-relaxed">
            Consultá los procesos de contratación de{' '}
            <span className="font-semibold text-tenant-text">{tenant?.name ?? 'este municipio'}</span>,
            sus adjudicaciones y los documentos oficiales sin necesidad de iniciar sesión.
          </p>
        </div>
      </section>

      {/* ── Buscador ciudadano ─────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tenant-muted pointer-events-none" />
          <input
            type="search"
            defaultValue=""
            onChange={handleBusquedaChange}
            placeholder="Buscar por objeto, empresa adjudicataria, número de expediente..."
            aria-label="Buscar procesos de compra pública"
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-2xl text-sm',
              'bg-tenant-surface/60 border border-tenant-border/40',
              'text-tenant-text placeholder:text-tenant-muted',
              'focus:outline-none focus:border-tenant-accent/50 focus:shadow-neon-accent transition-all',
            )}
          />
        </div>
      </section>

      {/* ── Grilla de procesos ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
            Procesos Públicos
          </p>
          {!data.cargando && (
            <p className="text-[11px] text-tenant-muted">
              {procesosFiltrados.length === data.procesos.length
                ? `${data.procesos.length} proceso${data.procesos.length !== 1 ? 's' : ''} publicado${data.procesos.length !== 1 ? 's' : ''}`
                : `${procesosFiltrados.length} de ${data.procesos.length} coinciden`}
            </p>
          )}
        </div>

        {data.cargando ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-tenant-primary animate-spin" />
          </div>
        ) : procesosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <Search className="w-8 h-8 text-tenant-muted/40" />
            <p className="text-sm font-semibold text-tenant-muted">Sin resultados</p>
            <p className="text-[11px] text-tenant-muted max-w-xs text-center">
              No encontramos procesos que coincidan con la búsqueda. Intentá con otro término.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {procesosFiltrados.map(p => (
              <CardProcesoPublico key={p.id} proceso={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Documentos Públicos ────────────────────────────────────────────── */}
      {!data.cargando && data.documentos.length > 0 && (
        <section className="space-y-4">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
            Documentos Públicos
          </p>
          <div className="divide-y divide-tenant-border/20 rounded-2xl overflow-hidden border border-tenant-border/30">
            {data.documentos.map(doc => (
              <FilaDocumento
                key={doc.id}
                doc={doc}
                esDescargando={descargandoId === doc.id}
                onDescargar={handleDescargar}
              />
            ))}
          </div>
          <p className="text-[10px] text-tenant-muted text-center">
            Documentos en formato .txt · Compatibles con Microsoft Word y Excel
          </p>
        </section>
      )}
    </div>
  )
}

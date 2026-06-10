import { useReducer, useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileSearch, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'
import {
  getExpedienteDetalle,
  getPlantillaConformidad,
  registrarRecepcion,
} from '../../services/api/expedienteService'
import { TabDatosGenerales } from './expediente/TabDatosGenerales'
import { TabProveedores }    from './expediente/TabProveedores'
import { TabSubasta }        from './expediente/TabSubasta'
import { TabAprobacion }     from './expediente/TabAprobacion'
import { TabRecepcion }      from './expediente/TabRecepcion'

// ── Reducer ───────────────────────────────────────────────────────────────────

const pageInitial = { expediente: null, plantillaConformidad: null, cargando: true, enviandoRecepcion: false }

function pageReducer(state, action) {
  switch (action.type) {
    case 'CARGADO':
      return {
        ...state,
        expediente:           action.expediente,
        plantillaConformidad: action.plantillaConformidad,
        cargando:             false,
      }
    case 'SET_ENVIANDO':
      return { ...state, enviandoRecepcion: action.payload }
    case 'RECEPCION_REGISTRADA':
      return {
        ...state,
        enviandoRecepcion: false,
        expediente: { ...state.expediente, recepcion: action.recepcion },
      }
    default:
      return state
  }
}

// ── Definición de tabs (estable a nivel módulo) ───────────────────────────────

const TABS = [
  { id: 'general',     label: 'General'     },
  { id: 'proveedores', label: 'Proveedores' },
  { id: 'subasta',     label: 'Subasta'     },
  { id: 'aprobacion',  label: 'Aprobación'  },
  { id: 'recepcion',   label: 'Recepción'   },
]

// ── Componente ────────────────────────────────────────────────────────────────

export function DetalleCompraPage() {
  const { id }               = useParams()
  const { tenantId, tenant } = useTenant()

  const [state, dispatch]   = useReducer(pageReducer, pageInitial)
  const [tabActiva, setTab] = useState('general')

  // Carga paralela: expediente + plantilla de conformidad
  useEffect(() => {
    let cancelado = false
    Promise.all([
      getExpedienteDetalle(tenantId, id),
      getPlantillaConformidad(tenantId),
    ]).then(([expediente, plantillaConformidad]) => {
      if (!cancelado) dispatch({ type: 'CARGADO', expediente, plantillaConformidad })
    })
    return () => { cancelado = true }
  }, [tenantId, id])

  const handleRegistrarRecepcion = useCallback(async (formData) => {
    dispatch({ type: 'SET_ENVIANDO', payload: true })
    const result = await registrarRecepcion(tenantId, id, formData)
    if (result.ok) {
      dispatch({
        type: 'RECEPCION_REGISTRADA',
        recepcion: { ...formData, numActa: result.numActa, timestamp: result.timestamp },
      })
    }
  }, [tenantId, id])

  if (state.cargando) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon flex-shrink-0">
            <FileSearch className="w-5 h-5 text-tenant-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-tenant-text">Expediente #{id}</h1>
            <p className="text-xs text-tenant-muted mt-0.5">Cargando datos del expediente...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 text-tenant-primary animate-spin" />
        </div>
      </div>
    )
  }

  if (!state.expediente) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-tenant-muted">Expediente no encontrado.</p>
      </div>
    )
  }

  const { expediente, plantillaConformidad, enviandoRecepcion } = state
  const recepcionPendiente = !expediente.recepcion

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon flex-shrink-0">
          <FileSearch className="w-5 h-5 text-tenant-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
            {expediente.expedienteNum}
          </p>
          <h1 className="text-base font-bold text-tenant-text mt-0.5 leading-tight">
            {expediente.titulo}
          </h1>
          <p className="text-xs text-tenant-muted mt-0.5">
            {expediente.area} · {expediente.modalidad}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-tenant-surface/50 border border-tenant-border/30 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              tabActiva === tab.id
                ? 'bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary shadow-neon'
                : 'text-tenant-muted hover:text-tenant-text hover:bg-tenant-surface/80',
            )}
          >
            {tab.label}
            {tab.id === 'recepcion' && recepcionPendiente && (
              <span className="w-1.5 h-1.5 rounded-full bg-tenant-warning animate-pulse-slow" />
            )}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className="animate-fade-in">
        {tabActiva === 'general'     && <TabDatosGenerales expediente={expediente} />}
        {tabActiva === 'proveedores' && <TabProveedores proveedores={expediente.proveedores} />}
        {tabActiva === 'subasta'     && (
          <TabSubasta
            lances={expediente.lances}
            ganador={expediente.ganador}
            montoBase={expediente.montoBase}
            montoAdjudicado={expediente.montoAdjudicado}
          />
        )}
        {tabActiva === 'aprobacion'  && (
          <TabAprobacion
            circuito={expediente.circuito}
            expediente={expediente}
          />
        )}
        {tabActiva === 'recepcion'   && (
          <TabRecepcion
            expediente={expediente}
            plantillaConformidad={plantillaConformidad}
            onRegistrar={handleRegistrarRecepcion}
            enviando={enviandoRecepcion}
            municipio={tenant?.name}
          />
        )}
      </div>
    </div>
  )
}

import { useReducer, useEffect, useCallback, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTenant } from '../../contexts/TenantContext'
import { EmptyState } from '../../components/ui/EmptyState'
import { BandejaAprobaciones } from './BandejaAprobaciones'
import { DetalleAprobacion } from './DetalleAprobacion'
import {
  ESTADOS_ETAPA,
  getConfiguracionJerarquias,
  getExpedientesParaAprobar,
  getDetalleExpediente,
  firmarEtapaAprobacion,
} from '../../services/api/aprobacionService'

// ── Reducer: bandeja (jerarquías + lista de expedientes) ──────────────────────

const bandejaInitial = { jerarquias: null, expedientes: [], cargando: true }

function bandejaReducer(state, action) {
  if (action.type === 'CARGADO') {
    return { jerarquias: action.jerarquias, expedientes: action.expedientes, cargando: false }
  }
  return state
}

// ── Reducer: detalle (circuito + firma) ───────────────────────────────────────

const detalleInitial = { expediente: null, circuito: [], cargando: false, firmando: false }

function detalleReducer(state, action) {
  switch (action.type) {
    case 'CARGANDO_DETALLE':
      return { ...state, cargando: true }

    case 'DETALLE_CARGADO':
      return { ...state, expediente: action.expediente, circuito: action.circuito, cargando: false }

    case 'SET_FIRMANDO':
      return { ...state, firmando: action.payload }

    case 'APROBAR_ETAPA': {
      const { etapaId, firmante, fechaFirma, observaciones } = action.payload
      let circuito = state.circuito.map(e =>
        e.id === etapaId
          ? { ...e, estado: ESTADOS_ETAPA.APROBADO, firmante, fechaFirma, observaciones }
          : e,
      )
      const idx = circuito.findIndex(e => e.id === etapaId)
      if (idx !== -1 && idx + 1 < circuito.length) {
        circuito = circuito.map((e, i) =>
          i === idx + 1 ? { ...e, estado: ESTADOS_ETAPA.EN_PROGRESO } : e,
        )
      }
      return { ...state, circuito, firmando: false }
    }

    case 'RECHAZAR_ETAPA': {
      const { etapaId, firmante, fechaFirma, observaciones } = action.payload
      const circuito = state.circuito.map(e =>
        e.id === etapaId
          ? { ...e, estado: ESTADOS_ETAPA.RECHAZADO, firmante, fechaFirma, observaciones }
          : e,
      )
      return { ...state, circuito, firmando: false }
    }

    default:
      return state
  }
}

// ── Componente ────────────────────────────────────────────────────────────────

export function AprobacionPage() {
  const { user }              = useAuth()
  const { tenantId }          = useTenant()

  const [bandeja,  dispatchBandeja]  = useReducer(bandejaReducer,  bandejaInitial)
  const [detalle,  dispatchDetalle]  = useReducer(detalleReducer,  detalleInitial)
  const [expedienteId, setExpedienteId] = useState(null)

  // ── Carga inicial: jerarquías + lista de expedientes ──────────────────────
  useEffect(() => {
    let cancelado = false
    Promise.all([
      getConfiguracionJerarquias(tenantId),
      getExpedientesParaAprobar(tenantId),
    ]).then(([jerarquias, expedientes]) => {
      if (!cancelado) dispatchBandeja({ type: 'CARGADO', jerarquias, expedientes })
    })
    return () => { cancelado = true }
  }, [tenantId])

  // ── Carga de detalle cuando el usuario selecciona un expediente ───────────
  useEffect(() => {
    if (!expedienteId) return
    let cancelado = false
    dispatchDetalle({ type: 'CARGANDO_DETALLE' })
    getDetalleExpediente(tenantId, expedienteId).then(exp => {
      if (!cancelado && exp) {
        dispatchDetalle({ type: 'DETALLE_CARGADO', expediente: exp, circuito: exp.circuito })
      }
    })
    return () => { cancelado = true }
  }, [tenantId, expedienteId])

  // ── Acción de firma ───────────────────────────────────────────────────────
  const handleFirmar = useCallback(async (etapaId, accion, observaciones) => {
    dispatchDetalle({ type: 'SET_FIRMANDO', payload: true })
    const firmante = user?.name ?? 'Autoridad Aprobadora'
    const result   = await firmarEtapaAprobacion(expedienteId, etapaId, accion, firmante, observaciones)
    if (result.ok) {
      dispatchDetalle({
        type: accion === 'aprobar' ? 'APROBAR_ETAPA' : 'RECHAZAR_ETAPA',
        payload: {
          etapaId,
          firmante:     result.firmante,
          fechaFirma:   result.fechaFirma,
          observaciones: result.observaciones,
        },
      })
    }
  }, [user, expedienteId])

  const handleSeleccionar = useCallback((id) => setExpedienteId(id), [])
  const handleVolver      = useCallback(() => setExpedienteId(null),  [])

  // ── Carga inicial ─────────────────────────────────────────────────────────
  if (bandeja.cargando) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-tenant-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-tenant-text">Aprobación de Compra</h1>
            <p className="text-xs text-tenant-muted mt-0.5">Cargando configuración...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-24">
          <div className="w-7 h-7 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  // ── DIRECTIVA INNEGOCIABLE: sin jerarquías → EmptyState bloqueante ────────
  if (!bandeja.jerarquias) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-tenant-danger/15 border border-tenant-danger/30 flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-tenant-danger" />
          </div>
          <div>
            <h1 className="text-base font-bold text-tenant-text">Aprobación de Compra</h1>
            <p className="text-xs text-tenant-muted mt-0.5">
              Requiere parametrización de jerarquías
            </p>
          </div>
        </div>
        <EmptyState
          isMandatory
          title="Jerarquías de aprobación no configuradas"
          description="El municipio aún no ha parametrizado la estructura de autoridades aprobadoras. El módulo no puede operar hasta que el administrador configure los cargos, rangos de monto y modalidades habilitadas para firma."
          actionLabel="Ir a Configuración"
          onAction={() => {}}
        />
        <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/25 text-[11px] text-tenant-muted space-y-1">
          <p className="font-bold text-tenant-text">¿Por qué aparece este bloqueo?</p>
          <p>Cada municipio debe definir qué cargo puede aprobar contratos de qué monto y modalidad. Sin esa configuración no es posible armar el circuito de firmas ni garantizar la legalidad del acto administrativo.</p>
          <p className="mt-2 font-mono text-[10px] text-tenant-accent">Demo: quitar ?sinJerarquias de la URL para ver la bandeja con expedientes reales.</p>
        </div>
      </div>
    )
  }

  // ── Vista: cabecera compartida ─────────────────────────────────────────────
  const pendientes = bandeja.expedientes.filter(e => !e.firmado).length

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 shadow-neon flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-tenant-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-tenant-text">
              {expedienteId ? 'Detalle de Expediente' : 'Bandeja de Aprobaciones'}
            </h1>
            <p className="text-xs text-tenant-muted mt-0.5">
              {expedienteId
                ? `Circuito de firmas — ${detalle.expediente?.expedienteNum ?? '…'}`
                : `${bandeja.jerarquias.municipio} · ${pendientes} expediente${pendientes !== 1 ? 's' : ''} aguardando firma`
              }
            </p>
          </div>
        </div>
        {!expedienteId && pendientes > 0 && (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-tenant-accent/15 border border-tenant-accent/30 text-tenant-accent animate-pulse-slow flex-shrink-0">
            {pendientes} pendiente{pendientes > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Contenido: bandeja o detalle */}
      {expedienteId ? (
        <DetalleAprobacion
          expediente={detalle.expediente}
          circuito={detalle.circuito}
          firmando={detalle.firmando}
          cargando={detalle.cargando}
          onFirmar={handleFirmar}
          onVolver={handleVolver}
          userRole={user?.role ?? ''}
          userName={user?.name ?? 'Autoridad Aprobadora'}
        />
      ) : (
        <BandejaAprobaciones
          expedientes={bandeja.expedientes}
          onSeleccionar={handleSeleccionar}
          cargando={false}
        />
      )}
    </div>
  )
}

import { ESTADOS_ETAPA } from '../../services/api/adjudicacionService'

export { ESTADOS_ETAPA }

export const initialAdjudicacion = {
  expediente: null,
  circuito:   [],
  plantillas: { contrato: null, orden: null },
  cargando:   true,
  firmando:   false,
}

export function adjudicacionReducer(state, action) {
  switch (action.type) {
    case 'DATOS_CARGADOS':
      return {
        ...state,
        expediente: action.payload.expediente,
        circuito:   action.payload.circuito,
        plantillas: action.payload.plantillas,
        cargando:   false,
      }

    case 'SET_FIRMANDO':
      return { ...state, firmando: action.payload }

    case 'APROBAR_ETAPA': {
      const { etapaId, firmante, fechaFirma, observaciones } = action.payload
      let circuito = state.circuito.map(e =>
        e.id === etapaId
          ? { ...e, estado: ESTADOS_ETAPA.APROBADO, firmante, fechaFirma, observaciones }
          : e,
      )
      // Activa la siguiente etapa pendiente
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

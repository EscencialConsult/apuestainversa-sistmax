/**
 * Estado progresivo del Wizard de Compra Municipal.
 * El payload se construye paso a paso y se publica completo al final.
 */

export const PASOS_COMPRA = [
  { id: 'datos',            label: 'Datos Generales',  description: 'Área, objeto y monto' },
  { id: 'especificaciones', label: 'Especificaciones', description: 'Técnicas y comerciales' },
  { id: 'modalidad',        label: 'Modalidad',        description: 'Contratación y cronograma' },
  { id: 'participacion',    label: 'Participación',    description: 'Proveedores' },
  { id: 'revision',         label: 'Revisión',         description: 'Resumen y publicación' },
]

export const initialCompra = {
  datos: {
    areaSolicitante: '',
    objeto:          '',
    montoEstimado:   '',
    justificacion:   '',
  },
  especificaciones: {
    especTecnicas:   '',
    condComerciales: '',
    plazoEntrega:    '',
    lugarEntrega:    '',
  },
  modalidad: {
    modalidadId:      '',
    fechaPublicacion: '',
    fechaApertura:    '',
  },
  participacion: {
    tipoConvocatoria:      'abierta', // 'abierta' | 'invitacion'
    proveedoresInvitados:  [],
  },
}

export function compraReducer(state, action) {
  switch (action.type) {
    case 'SET_CAMPO':
      return {
        ...state,
        [action.paso]: { ...state[action.paso], [action.campo]: action.valor },
      }
    case 'TOGGLE_PROVEEDOR': {
      const actuales = state.participacion.proveedoresInvitados
      const proveedoresInvitados = actuales.includes(action.id)
        ? actuales.filter(p => p !== action.id)
        : [...actuales, action.id]
      return { ...state, participacion: { ...state.participacion, proveedoresInvitados } }
    }
    case 'RESET':
      return initialCompra
    default:
      return state
  }
}

/**
 * Valida el paso indicado. Devuelve objeto { campo: mensaje }; vacío = válido.
 * El wizard bloquea el avance mientras existan errores.
 */
export function validarPaso(index, compra, { modalidades = [] } = {}) {
  const errores = {}

  if (index === 0) {
    const { areaSolicitante, objeto, montoEstimado } = compra.datos
    if (!areaSolicitante) errores.areaSolicitante = 'Seleccione el área solicitante.'
    if (!objeto || objeto.trim().length < 10) errores.objeto = 'Describa el objeto de la compra (mínimo 10 caracteres).'
    const monto = Number(montoEstimado)
    if (!montoEstimado || Number.isNaN(monto) || monto <= 0) errores.montoEstimado = 'Ingrese un monto estimado mayor a cero.'
  }

  if (index === 1) {
    const { especTecnicas, plazoEntrega } = compra.especificaciones
    if (!especTecnicas || especTecnicas.trim().length < 10) errores.especTecnicas = 'Detalle las especificaciones técnicas (mínimo 10 caracteres).'
    if (!plazoEntrega) errores.plazoEntrega = 'Indique el plazo de entrega.'
  }

  if (index === 2) {
    // Restricción de negocio: sin modalidades parametrizadas no se puede operar
    if (modalidades.length === 0) {
      errores._bloqueante = 'El municipio no tiene modalidades de contratación configuradas.'
      return errores
    }
    const { modalidadId, fechaPublicacion, fechaApertura } = compra.modalidad
    if (!modalidadId) {
      errores.modalidadId = 'Seleccione una modalidad de contratación.'
      return errores
    }
    const modalidad = modalidades.find(m => m.id === modalidadId)
    const monto = Number(compra.datos.montoEstimado)
    if (modalidad) {
      if (modalidad.montoMinimo != null && monto < modalidad.montoMinimo) {
        errores.modalidadId = `Esta modalidad requiere un monto mínimo de $${modalidad.montoMinimo.toLocaleString('es-AR')}.`
      }
      if (modalidad.montoMaximo != null && monto > modalidad.montoMaximo) {
        errores.modalidadId = `Esta modalidad admite hasta $${modalidad.montoMaximo.toLocaleString('es-AR')}.`
      }
      if (modalidad.requiereCronograma) {
        if (!fechaPublicacion) errores.fechaPublicacion = 'Indique la fecha de publicación.'
        if (!fechaApertura) errores.fechaApertura = 'Indique la fecha de apertura.'
        if (fechaPublicacion && fechaApertura && fechaApertura <= fechaPublicacion) {
          errores.fechaApertura = 'La apertura debe ser posterior a la publicación.'
        }
      }
    }
  }

  if (index === 3) {
    const { tipoConvocatoria, proveedoresInvitados } = compra.participacion
    if (tipoConvocatoria === 'invitacion' && proveedoresInvitados.length < 2) {
      errores.proveedoresInvitados = 'Invite al menos 2 proveedores para garantizar competencia.'
    }
  }

  return errores
}

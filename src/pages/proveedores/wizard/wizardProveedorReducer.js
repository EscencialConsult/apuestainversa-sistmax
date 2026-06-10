import { CUIT_REGEX } from '../../../services/api/arcaService'

/**
 * Estado progresivo del Wizard de Registro de Proveedores.
 * El bloque fiscal exige: verificación ARCA exitosa O contingencia manual
 * con constancia PDF cargada (que luego revisa el Evaluador Documental).
 */

export const PASOS_PROVEEDOR = [
  { id: 'fiscal',    label: 'Datos Fiscales',    description: 'CUIT y constancia ARCA' },
  { id: 'comercial', label: 'Datos Comerciales', description: 'Contacto y domicilio' },
  { id: 'rubros',    label: 'Rubros',            description: 'Clasificación' },
  { id: 'revision',  label: 'Revisión',          description: 'Confirmación' },
]

export const ARCA_ESTADOS = {
  PENDIENTE:   'pendiente',
  VERIFICANDO: 'verificando',
  VERIFICADO:  'verificado',
  FALLIDO:     'fallido',
}

export const initialProveedor = {
  fiscal: {
    cuit:            '',
    razonSocial:     '',
    condicionFiscal: '',
    arca: {
      estado:       ARCA_ESTADOS.PENDIENTE,
      verificadoEn: null,
      error:        null,
    },
    // Contingencia manual: habilitada cuando ARCA falla
    contingenciaManual: false,
    constanciaPdf:      null, // { name, size }
  },
  comercial: {
    email:     '',
    telefono:  '',
    direccion: '',
    localidad: '',
    contacto:  '',
    cbu:       '',
  },
  rubros: {
    seleccionados: [],
  },
}

export function proveedorReducer(state, action) {
  switch (action.type) {
    case 'SET_CAMPO':
      return {
        ...state,
        [action.paso]: { ...state[action.paso], [action.campo]: action.valor },
      }
    case 'SET_ARCA':
      return {
        ...state,
        fiscal: { ...state.fiscal, arca: { ...state.fiscal.arca, ...action.arca } },
      }
    case 'ARCA_VERIFICADO':
      // Autocompleta los datos fiscales devueltos por ARCA
      return {
        ...state,
        fiscal: {
          ...state.fiscal,
          razonSocial:     state.fiscal.razonSocial || action.datos.razonSocial,
          condicionFiscal: state.fiscal.condicionFiscal || action.datos.condicionFiscal,
          contingenciaManual: false,
          arca: {
            estado:       ARCA_ESTADOS.VERIFICADO,
            verificadoEn: action.datos.verificadoEn,
            error:        null,
          },
        },
      }
    case 'TOGGLE_CONTINGENCIA':
      return {
        ...state,
        fiscal: {
          ...state.fiscal,
          contingenciaManual: !state.fiscal.contingenciaManual,
          constanciaPdf: state.fiscal.contingenciaManual ? null : state.fiscal.constanciaPdf,
        },
      }
    case 'TOGGLE_RUBRO': {
      const actuales = state.rubros.seleccionados
      const seleccionados = actuales.includes(action.id)
        ? actuales.filter(r => r !== action.id)
        : [...actuales, action.id]
      return { ...state, rubros: { seleccionados } }
    }
    case 'RESET':
      return initialProveedor
    default:
      return state
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Valida el paso indicado. Devuelve { campo: mensaje }; vacío = válido. */
export function validarPasoProveedor(index, proveedor, { rubros = [] } = {}) {
  const errores = {}

  if (index === 0) {
    const { cuit, razonSocial, condicionFiscal, arca, contingenciaManual, constanciaPdf } = proveedor.fiscal
    if (!CUIT_REGEX.test(cuit)) errores.cuit = 'Formato esperado: XX-XXXXXXXX-X.'
    if (!razonSocial?.trim()) errores.razonSocial = 'Ingrese la razón social.'
    if (!condicionFiscal) errores.condicionFiscal = 'Seleccione la condición fiscal.'

    // Regla innegociable: ARCA verificado O contingencia manual con PDF
    const fiscalValidado =
      arca.estado === ARCA_ESTADOS.VERIFICADO ||
      (contingenciaManual && constanciaPdf != null)
    if (!fiscalValidado) {
      errores.arca = contingenciaManual
        ? 'Adjunte la constancia fiscal en PDF para continuar por contingencia.'
        : 'Verifique la constancia en ARCA o active la carga manual de contingencia.'
    }
  }

  if (index === 1) {
    const { email, telefono, direccion, localidad } = proveedor.comercial
    if (!EMAIL_REGEX.test(email)) errores.email = 'Ingrese un email válido.'
    if (!telefono?.trim()) errores.telefono = 'Ingrese un teléfono de contacto.'
    if (!direccion?.trim()) errores.direccion = 'Ingrese el domicilio comercial.'
    if (!localidad?.trim()) errores.localidad = 'Ingrese la localidad.'
  }

  if (index === 2) {
    if (rubros.length === 0) {
      errores._bloqueante = 'El municipio no tiene rubros configurados.'
      return errores
    }
    if (proveedor.rubros.seleccionados.length === 0) {
      errores.rubros = 'Seleccione al menos un rubro de actividad.'
    }
  }

  return errores
}

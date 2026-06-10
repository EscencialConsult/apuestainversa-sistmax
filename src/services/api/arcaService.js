/**
 * Verificación de constancias fiscales contra ARCA.
 * MOCK temporal: con backend pasa a apiClient.get('/arca/constancia/:cuit').
 *
 * DEMO de contingencia: agregar ?arcaCaida a la URL simula la API de ARCA
 * fuera de servicio — la UI debe ofrecer el switch de carga manual.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const CUIT_REGEX = /^\d{2}-\d{8}-\d$/

/**
 * @returns {Promise<{estado: string, razonSocial: string, condicionFiscal: string, verificadoEn: string}>}
 * @throws {Error} si ARCA no responde (code: 'ARCA_NO_DISPONIBLE')
 */
export async function verificarConstanciaArca(cuit) {
  await delay(900)

  if (new URLSearchParams(window.location.search).has('arcaCaida')) {
    const error = new Error('El servicio de ARCA no responde. Intente más tarde o utilice la carga manual de contingencia.')
    error.code = 'ARCA_NO_DISPONIBLE'
    throw error
  }

  if (!CUIT_REGEX.test(cuit)) {
    const error = new Error('CUIT con formato inválido.')
    error.code = 'CUIT_INVALIDO'
    throw error
  }

  return {
    estado:          'activo',
    razonSocial:     `Contribuyente ${cuit.slice(3, 11)} SA`,
    condicionFiscal: 'Responsable Inscripto',
    verificadoEn:    new Date().toISOString(),
  }
}

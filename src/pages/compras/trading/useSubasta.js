import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/**
 * Motor de la Subasta Inversa — reglas de negocio del Trading Room.
 *
 * REGLAS:
 * - Decremento mínimo: todo lance debe ser ≤ (mejor precio actual - decremento).
 * - Anti-sniper: lance válido en los últimos 2 minutos → el reloj se
 *   extiende 3 minutos adicionales para fomentar la competencia.
 * - Cierre automático: al llegar a cero se bloquean los inputs y se
 *   genera el acta con el ranking final.
 *
 * MOCK: un intervalo inyecta lances de oferentes simulados cada ~5s
 * (reemplazar por la suscripción WebSocket/SSE real con el backend).
 * Cada oferente tiene un "piso" (costo) por debajo del cual no ofrece.
 */

export const SUBASTA_CONFIG = {
  expediente:       'EXP-2025-0142',
  titulo:           'Adquisición de Equipamiento Informático para Dependencias Municipales',
  precioBase:       850_000,
  decrementoMinimo: 5_000,
  duracionMs:       5 * 60 * 1000,  // 5 min para la demo
  ventanaSniperMs:  2 * 60 * 1000,  // últimos 2 minutos
  extensionMs:      3 * 60 * 1000,  // +3 minutos por lance tardío
}

export const ID_PROVEEDOR_LOCAL = 'yo'

const OFERENTES_MOCK = [
  { id: 'of-1', razonSocial: 'TechSolutions SA',         piso: 0.62 },
  { id: 'of-2', razonSocial: 'Redes y Cableados SA',     piso: 0.58 },
  { id: 'of-3', razonSocial: 'Distribuidora del Tucumán', piso: 0.68 },
  { id: 'of-4', razonSocial: 'Insumos del Norte SRL',    piso: 0.55 },
]

export const ESTADOS_SUBASTA = {
  EN_CURSO:   'en_curso',
  FINALIZADA: 'finalizada',
}

export function useSubasta() {
  const [lances, setLances] = useState([])
  const [finalizaEn, setFinalizaEn] = useState(() => Date.now() + SUBASTA_CONFIG.duracionMs)
  const [estado, setEstado] = useState(ESTADOS_SUBASTA.EN_CURSO)
  const [ultimaExtension, setUltimaExtension] = useState(null)

  const mejorMonto = lances.length > 0
    ? Math.min(...lances.map(l => l.monto))
    : SUBASTA_CONFIG.precioBase

  // Refs espejo para que el mock socket y registrarLance lean el estado
  // actual sin re-suscribirse. Se sincronizan post-commit (nunca en render).
  const mejorMontoRef = useRef(SUBASTA_CONFIG.precioBase)
  const estadoRef = useRef(estado)
  const finalizaEnRef = useRef(finalizaEn)
  useEffect(() => {
    estadoRef.current = estado
    finalizaEnRef.current = finalizaEn
    mejorMontoRef.current = mejorMonto
  }, [estado, finalizaEn, mejorMonto])

  /** Registra un lance aplicando decremento mínimo y regla anti-sniper. */
  const registrarLance = useCallback((oferente, monto) => {
    if (estadoRef.current !== ESTADOS_SUBASTA.EN_CURSO) {
      return { ok: false, error: 'La subasta ya finalizó.' }
    }
    const limite = mejorMontoRef.current - SUBASTA_CONFIG.decrementoMinimo
    if (monto > limite) {
      return {
        ok: false,
        error: `La oferta debe ser menor o igual a $${limite.toLocaleString('es-AR')} (mejor precio - decremento mínimo).`,
      }
    }

    const lance = {
      id:       crypto.randomUUID(),
      oferenteId: oferente.id,
      razonSocial: oferente.razonSocial,
      monto,
      hora:     Date.now(),
    }
    setLances(prev => [lance, ...prev])

    // Regla anti-sniper: lance en los últimos 2 min → +3 min de reloj
    const restante = finalizaEnRef.current - Date.now()
    if (restante > 0 && restante < SUBASTA_CONFIG.ventanaSniperMs) {
      setFinalizaEn(prev => prev + SUBASTA_CONFIG.extensionMs)
      setUltimaExtension(Date.now())
    }

    return { ok: true }
  }, [])

  /** Llamado por el reloj al llegar a cero — cierre automático. */
  const finalizar = useCallback(() => {
    setEstado(ESTADOS_SUBASTA.FINALIZADA)
  }, [])

  // MockWebSocket: inyecta un lance simulado cada ~5s mientras la subasta
  // esté en curso. TODO backend: reemplazar por suscripción SSE/WebSocket.
  useEffect(() => {
    if (estado !== ESTADOS_SUBASTA.EN_CURSO) return
    const intervalo = setInterval(() => {
      if (estadoRef.current !== ESTADOS_SUBASTA.EN_CURSO) return
      const oferente = OFERENTES_MOCK[Math.floor(Math.random() * OFERENTES_MOCK.length)]
      const decrementos = 1 + Math.floor(Math.random() * 2)
      const monto = mejorMontoRef.current - SUBASTA_CONFIG.decrementoMinimo * decrementos
      const piso = SUBASTA_CONFIG.precioBase * oferente.piso
      // El oferente no baja de su costo: si el precio ya tocó su piso, no ofrece
      if (monto >= piso) {
        registrarLance(oferente, monto)
      }
    }, 5000)
    return () => clearInterval(intervalo)
  }, [estado, registrarLance])

  // Ranking: mejor precio arriba (en subasta inversa gana el menor monto)
  const ranking = useMemo(
    () => [...lances].sort((a, b) => a.monto - b.monto),
    [lances],
  )

  const ahorro = SUBASTA_CONFIG.precioBase - mejorMonto
  const ahorroPct = (ahorro / SUBASTA_CONFIG.precioBase) * 100

  return {
    config: SUBASTA_CONFIG,
    lances,
    ranking,
    mejorMonto,
    ahorro,
    ahorroPct,
    estado,
    finalizaEn,
    ultimaExtension,
    registrarLance,
    finalizar,
  }
}

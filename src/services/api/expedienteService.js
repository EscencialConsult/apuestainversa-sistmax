import { ESTADOS_ETAPA } from './adjudicacionService'
import { logEventoExterno } from './auditoriaService'

export { ESTADOS_ETAPA }

export const ESTADO_PROVEEDOR = {
  INVITADO:         'invitado',
  DOC_APROBADA:     'doc_aprobada',
  TECNICA_APROBADA: 'tecnica_aprobada',
  ADJUDICADO:       'adjudicado',
  DESCALIFICADO:    'descalificado',
}

export const ESTADO_EXPEDIENTE = {
  BORRADOR:            'borrador',
  PUBLICADO:           'publicado',
  SUBASTA_ACTIVA:      'subasta_activa',
  ADJUDICADO:          'adjudicado',
  RECEPCION_PENDIENTE: 'recepcion_pendiente',
  CERRADO:             'cerrado',
}

// ── Plantilla oficial de conformidad de recepción ─────────────────────────────

const PLANTILLA_CONFORMIDAD = `MUNICIPALIDAD DE {{NOMBRE_MUNICIPIO}}
ACTA DE RECEPCIÓN CONFORME N.° {{NUMERO_ACTA}}/{{ANIO}}

En la ciudad de {{NOMBRE_MUNICIPIO}}, a la fecha {{FECHA_RECEPCION}}, el/la funcionario/a {{RESPONSABLE_RECEPCION}}, dependiente del área {{AREA}}, hace constar que:

Se ha recibido conforme y en su totalidad la entrega de bienes/servicios correspondiente al Expediente N.° {{NUMERO_EXPEDIENTE}}, cuyo objeto es "{{OBJETO_CONTRATACION}}".

La provisión fue realizada por la empresa {{RAZON_SOCIAL_GANADOR}}, con CUIT N.° {{CUIT_GANADOR}}, adjudicada por la suma de {{MONTO_ADJUDICADO}}.

Lugar de entrega y recepción: {{LUGAR_RECEPCION}}

Observaciones del receptor: {{OBSERVACIONES_RECEPCION}}

La presente acta certifica la recepción total y conforme de los bienes/servicios contratados, dando inicio al cómputo de los plazos de garantía establecidos en el contrato.

El receptor que suscribe da fe de la conformidad de la entrega.


                    ___________________________
                    {{RESPONSABLE_RECEPCION}}
                    Funcionario Receptor Autorizado
                    {{AREA}}
                    Municipalidad de {{NOMBRE_MUNICIPIO}}, {{ANIO}}`

// ── Circuito de aprobación ya completado (EXP-2025-0142) ─────────────────────

const CIRCUITO_0142_COMPLETO = [
  {
    id: 'ev_tecnica',
    label: 'Evaluación Técnica',
    descripcion: 'Validación técnica del pliego y especificaciones por el área requirente.',
    rol: 'evaluador_tecnico',
    rolLabel: 'Evaluador Técnico',
    estado: ESTADOS_ETAPA.APROBADO,
    firmante: 'Ing. Roberto Peralta',
    fechaFirma: '2026-06-09T10:15:00.000Z',
    observaciones: 'Equipamiento conforme a las especificaciones del pliego técnico.',
  },
  {
    id: 'rev_documental',
    label: 'Revisión Documental',
    descripcion: 'Control de documentación legal y habilitaciones de los proveedores oferentes.',
    rol: 'evaluador_documental',
    rolLabel: 'Evaluador Documental',
    estado: ESTADOS_ETAPA.APROBADO,
    firmante: 'Dra. Carmen Aguirre',
    fechaFirma: '2026-06-09T14:30:00.000Z',
    observaciones: null,
  },
  {
    id: 'firma_autoridad',
    label: 'Firma de Autoridad Aprobadora',
    descripcion: 'Aprobación final de la autoridad competente.',
    rol: 'autoridad_aprobadora',
    rolLabel: 'Autoridad Aprobadora',
    estado: ESTADOS_ETAPA.APROBADO,
    firmante: 'Lic. María López',
    fechaFirma: '2026-06-10T09:45:00.000Z',
    observaciones: 'Ahorro sustancial respecto al presupuesto base. Se aprueba.',
  },
  {
    id: 'imputacion',
    label: 'Imputación Presupuestaria',
    descripcion: 'Registro contable y afectación de créditos presupuestarios.',
    rol: 'admin',
    rolLabel: 'Oficina de Presupuesto',
    estado: ESTADOS_ETAPA.APROBADO,
    firmante: 'Cont. Jorge Medina',
    fechaFirma: '2026-06-10T11:00:00.000Z',
    observaciones: null,
  },
  {
    id: 'publicacion',
    label: 'Publicación y Notificación',
    descripcion: 'Difusión oficial en el Boletín Municipal y notificación al adjudicatario.',
    rol: 'admin',
    rolLabel: 'Secretaría de Gobierno',
    estado: ESTADOS_ETAPA.APROBADO,
    firmante: 'Sistema Automático',
    fechaFirma: '2026-06-10T11:05:00.000Z',
    observaciones: null,
  },
]

// ── Datos de la subasta (continúa la narrativa del Trading Room) ───────────────

const LANCES_0142 = [
  { id: 'l01', timestamp: '2026-06-06T14:00:05.000Z', razonSocial: 'TechSolutions SA',          monto: 840_000, esMejorOferta: true  },
  { id: 'l02', timestamp: '2026-06-06T14:01:20.000Z', razonSocial: 'Distribuidora del Tucumán', monto: 835_000, esMejorOferta: true  },
  { id: 'l03', timestamp: '2026-06-06T14:02:15.000Z', razonSocial: 'Insumos del Norte SRL',     monto: 830_000, esMejorOferta: true  },
  { id: 'l04', timestamp: '2026-06-06T14:03:40.000Z', razonSocial: 'Redes y Cableados SA',      monto: 825_000, esMejorOferta: true  },
  { id: 'l05', timestamp: '2026-06-06T14:05:00.000Z', razonSocial: 'TechSolutions SA',          monto: 820_000, esMejorOferta: false },
  { id: 'l06', timestamp: '2026-06-06T14:07:30.000Z', razonSocial: 'Distribuidora del Tucumán', monto: 815_000, esMejorOferta: false },
  { id: 'l07', timestamp: '2026-06-06T14:09:15.000Z', razonSocial: 'Redes y Cableados SA',      monto: 810_000, esMejorOferta: true  },
  { id: 'l08', timestamp: '2026-06-06T14:11:00.000Z', razonSocial: 'Insumos del Norte SRL',     monto: 805_000, esMejorOferta: false },
  { id: 'l09', timestamp: '2026-06-06T14:13:45.000Z', razonSocial: 'TechSolutions SA',          monto: 765_000, esMejorOferta: true  },
  { id: 'l10', timestamp: '2026-06-06T14:14:52.000Z', razonSocial: 'Redes y Cableados SA',      monto: 760_000, esMejorOferta: true  },
  { id: 'l11', timestamp: '2026-06-06T14:22:01.000Z', razonSocial: 'Redes y Cableados SA',      monto: 643_000, esMejorOferta: true  },
  { id: 'l12', timestamp: '2026-06-06T14:24:55.000Z', razonSocial: 'Redes y Cableados SA',      monto: 638_000, esMejorOferta: true  },
]

// ── Expedientes mock ──────────────────────────────────────────────────────────

const EXPEDIENTES = [
  {
    id: 'exp-0142',
    tenantId: 'sanmiguel',
    expedienteNum: 'EXP-2025-0142',
    titulo: 'Adquisición de Equipamiento Informático',
    descripcion: 'Compra de 35 computadoras portátiles y periféricos para modernización administrativa del municipio. Incluye notebooks, teclados, mouse, monitores y cables de red estructurada.',
    area: 'Secretaría de Modernización',
    modalidad: 'Licitación Pública',
    estado: ESTADO_EXPEDIENTE.RECEPCION_PENDIENTE,
    fechaCreacion:    '2026-06-01T09:00:00.000Z',
    fechaPublicacion: '2026-06-03T08:00:00.000Z',
    fechaCierre:      '2026-06-06T14:25:00.000Z',
    montoBase:        850_000,
    cantidadItems:    35,
    especificaciones: `• 35 notebooks Intel Core i5, 16 GB RAM, 512 GB SSD
• Sistema Operativo: Linux o Windows 11 Pro (licenciado)
• 35 teclados USB retroiluminados
• 35 mouse óptico USB
• 10 monitores 24" FHD
• Cableado de red Cat6 — 500 metros
• Garantía mínima: 12 meses con servicio técnico on-site`,
    autoridad: 'Lic. María López — Intendencia Municipal',
    numeroContrato: '089',
    fechaSubasta: '2026-06-06T14:25:00.000Z',
    ganador: { razonSocial: 'Redes y Cableados SA', cuit: '30-65432197-4' },
    montoAdjudicado: 638_000,
    proveedores: [
      {
        razonSocial: 'Redes y Cableados SA',
        cuit: '30-65432197-4',
        estado: ESTADO_PROVEEDOR.ADJUDICADO,
        montoFinalLance: 638_000,
        observacionDocumental: null,
        observacionTecnica: 'Equipamiento conforme. Garantía extendida incluida.',
      },
      {
        razonSocial: 'TechSolutions SA',
        cuit: '30-72345678-9',
        estado: ESTADO_PROVEEDOR.TECNICA_APROBADA,
        montoFinalLance: 765_000,
        observacionDocumental: null,
        observacionTecnica: null,
      },
      {
        razonSocial: 'Insumos del Norte SRL',
        cuit: '30-81234567-2',
        estado: ESTADO_PROVEEDOR.DOC_APROBADA,
        montoFinalLance: 805_000,
        observacionDocumental: null,
        observacionTecnica: null,
      },
      {
        razonSocial: 'Distribuidora del Tucumán',
        cuit: '30-91234567-0',
        estado: ESTADO_PROVEEDOR.DESCALIFICADO,
        montoFinalLance: 815_000,
        observacionDocumental: 'ARCA: constancia de inscripción vencida. Se descalifica del proceso.',
        observacionTecnica: null,
      },
    ],
    lances: LANCES_0142,
    circuito: CIRCUITO_0142_COMPLETO,
    plantillas: {
      contrato: null,  // cargada vía adjudicacionService
      orden:    null,
    },
    recepcion: null,
  },
]

// ── API pública ───────────────────────────────────────────────────────────────

export async function getExpedienteDetalle(tenantId, expedienteId) {
  await new Promise(r => setTimeout(r, 400))
  const exp = EXPEDIENTES.find(e => e.tenantId === tenantId && e.id === expedienteId)
  if (!exp) return null

  // Inyecta las plantillas reales desde adjudicacionService
  const { getPlantillas } = await import('./adjudicacionService')
  const plantillas = await getPlantillas(tenantId)
  return { ...exp, plantillas }
}

export async function getPlantillaConformidad(tenantId) {
  const sinDoc = new URLSearchParams(window.location.search).has('sinDocConformidad')
  await new Promise(r => setTimeout(r, 200))
  if (sinDoc || tenantId !== 'sanmiguel') return null
  return PLANTILLA_CONFORMIDAD
}

export async function registrarRecepcion(tenantId, expedienteId, datos) {
  await new Promise(r => setTimeout(r, 900))
  const numActa = `${Math.floor(Math.random() * 900) + 100}`
  const timestamp = new Date().toISOString()

  // En producción: POST /api/recepcion + registra silenciosamente en auditoría
  await logEventoExterno(tenantId, {
    modulo: 'APROBACION',
    tipo: 'EXITO',
    accion: 'RECEPCION_REGISTRADA',
    usuario: datos.responsableRecepcion,
    descripcion: `Recepción conforme registrada — Acta N.° ${numActa} — Exp. ${expedienteId}`,
  })

  return { ok: true, numActa, timestamp }
}

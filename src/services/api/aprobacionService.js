import { ESTADOS_ETAPA } from './adjudicacionService'

export { ESTADOS_ETAPA }

export const PRIORIDAD = { ALTA: 'alta', MEDIA: 'media', BAJA: 'baja' }

// ── Circuitos parametrizables por modalidad y monto ───────────────────────────
// En producción: GET /api/jerarquias?tenant={t}&modalidad={m}&monto={n}

function buildCircuito5Etapas() {
  return [
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
      descripcion: 'Aprobación final de la autoridad competente según el monto del expediente.',
      rol: 'autoridad_aprobadora',
      rolLabel: 'Autoridad Aprobadora',
      estado: ESTADOS_ETAPA.EN_PROGRESO,
      firmante: null,
      fechaFirma: null,
      observaciones: null,
    },
    {
      id: 'imputacion',
      label: 'Imputación Presupuestaria',
      descripcion: 'Registro contable y afectación de los créditos presupuestarios correspondientes.',
      rol: 'admin',
      rolLabel: 'Oficina de Presupuesto',
      estado: ESTADOS_ETAPA.PENDIENTE,
      firmante: null,
      fechaFirma: null,
      observaciones: null,
    },
    {
      id: 'publicacion',
      label: 'Publicación y Notificación',
      descripcion: 'Difusión oficial en el Boletín Municipal y notificación al adjudicatario.',
      rol: 'admin',
      rolLabel: 'Secretaría de Gobierno',
      estado: ESTADOS_ETAPA.PENDIENTE,
      firmante: null,
      fechaFirma: null,
      observaciones: null,
    },
  ]
}

function buildCircuito3Etapas() {
  return [
    {
      id: 'rev_documental',
      label: 'Revisión Documental',
      descripcion: 'Control de documentación legal del proveedor seleccionado.',
      rol: 'evaluador_documental',
      rolLabel: 'Evaluador Documental',
      estado: ESTADOS_ETAPA.APROBADO,
      firmante: 'Dra. Carmen Aguirre',
      fechaFirma: '2026-06-10T09:00:00.000Z',
      observaciones: null,
    },
    {
      id: 'firma_autoridad',
      label: 'Firma de Autoridad Aprobadora',
      descripcion: 'Aprobación del titular de la repartición contratante.',
      rol: 'autoridad_aprobadora',
      rolLabel: 'Autoridad Aprobadora',
      estado: ESTADOS_ETAPA.EN_PROGRESO,
      firmante: null,
      fechaFirma: null,
      observaciones: null,
    },
    {
      id: 'registro',
      label: 'Registro y Notificación',
      descripcion: 'Registro en el sistema y notificación al proveedor adjudicado.',
      rol: 'admin',
      rolLabel: 'Mesa de Entradas',
      estado: ESTADOS_ETAPA.PENDIENTE,
      firmante: null,
      fechaFirma: null,
      observaciones: null,
    },
  ]
}

// ── Mock data: 3 expedientes (2 pendientes, 1 firmado) ────────────────────────

const EXPEDIENTES = [
  {
    id: 'exp-0142',
    tenantId: 'sanmiguel',
    expedienteNum: 'EXP-2025-0142',
    titulo: 'Adquisición de Equipamiento Informático',
    descripcion: 'Compra de 35 computadoras portátiles y periféricos para modernización administrativa del municipio.',
    area: 'Secretaría de Modernización',
    modalidad: 'Licitación Pública',
    precioBase: 850_000,
    montoAdjudicado: 638_000,
    prioridad: PRIORIDAD.ALTA,
    pendienteDesde: '2026-06-08T08:00:00.000Z',
    etapaActual: 'Firma de Autoridad Aprobadora',
    ganador: { razonSocial: 'Redes y Cableados SA', cuit: '30-65432197-4' },
    firmado: false,
    ofertas: [
      { puesto: 1, razonSocial: 'Redes y Cableados SA',       monto: 638_000, esGanador: true  },
      { puesto: 2, razonSocial: 'TechSolutions SA',            monto: 645_000, esGanador: false },
      { puesto: 3, razonSocial: 'Insumos del Norte SRL',       monto: 660_000, esGanador: false },
      { puesto: 4, razonSocial: 'Distribuidora del Tucumán',   monto: 682_000, esGanador: false },
    ],
    circuito: buildCircuito5Etapas(),
  },
  {
    id: 'exp-0138',
    tenantId: 'sanmiguel',
    expedienteNum: 'EXP-2025-0138',
    titulo: 'Suministro de Combustible Municipal',
    descripcion: 'Provisión anual de combustible para la flota de vehículos municipales — 80.000 litros nafta super y gasoil.',
    area: 'Secretaría de Obras Públicas',
    modalidad: 'Contratación Directa',
    precioBase: 1_560_000,
    montoAdjudicado: 1_240_000,
    prioridad: PRIORIDAD.ALTA,
    pendienteDesde: '2026-06-10T07:30:00.000Z',
    etapaActual: 'Firma de Autoridad Aprobadora',
    ganador: { razonSocial: 'Combustibles del NOA SA', cuit: '30-71234567-3' },
    firmado: false,
    ofertas: [
      { puesto: 1, razonSocial: 'Combustibles del NOA SA',     monto: 1_240_000, esGanador: true  },
      { puesto: 2, razonSocial: 'Petróleo y Gas Tucumán SRL',  monto: 1_285_000, esGanador: false },
      { puesto: 3, razonSocial: 'Estación Central SC',         monto: 1_340_000, esGanador: false },
    ],
    circuito: buildCircuito3Etapas(),
  },
  {
    id: 'exp-0135',
    tenantId: 'sanmiguel',
    expedienteNum: 'EXP-2025-0135',
    titulo: 'Impresión de Material Gráfico Institucional',
    descripcion: 'Diseño e impresión de folletería, banners y señalización para actos públicos del municipio.',
    area: 'Secretaría de Comunicación',
    modalidad: 'Licitación Privada',
    precioBase: 120_000,
    montoAdjudicado: 95_000,
    prioridad: PRIORIDAD.BAJA,
    pendienteDesde: '2026-06-07T14:00:00.000Z',
    etapaActual: 'Completado',
    ganador: { razonSocial: 'Impresiones Rápidas SRL', cuit: '20-45678901-2' },
    firmado: true,
    ofertas: [
      { puesto: 1, razonSocial: 'Impresiones Rápidas SRL',     monto: 95_000,  esGanador: true  },
      { puesto: 2, razonSocial: 'Gráfica del Sur SA',          monto: 108_000, esGanador: false },
    ],
    circuito: [
      {
        id: 'rev_documental',
        label: 'Revisión Documental',
        descripcion: 'Control de documentación legal del proveedor.',
        rol: 'evaluador_documental',
        rolLabel: 'Evaluador Documental',
        estado: ESTADOS_ETAPA.APROBADO,
        firmante: 'Dra. Carmen Aguirre',
        fechaFirma: '2026-06-07T16:00:00.000Z',
        observaciones: null,
      },
      {
        id: 'firma_autoridad',
        label: 'Firma de Autoridad Aprobadora',
        descripcion: 'Aprobación del titular de la repartición contratante.',
        rol: 'autoridad_aprobadora',
        rolLabel: 'Autoridad Aprobadora',
        estado: ESTADOS_ETAPA.APROBADO,
        firmante: 'Lic. María López',
        fechaFirma: '2026-06-08T10:00:00.000Z',
        observaciones: 'Monto en línea con el presupuesto disponible del área.',
      },
      {
        id: 'registro',
        label: 'Registro y Notificación',
        descripcion: 'Registro en el sistema y notificación al proveedor adjudicado.',
        rol: 'admin',
        rolLabel: 'Mesa de Entradas',
        estado: ESTADOS_ETAPA.APROBADO,
        firmante: 'Sistema Automático',
        fechaFirma: '2026-06-08T10:05:00.000Z',
        observaciones: null,
      },
    ],
  },
]

// ── Configuración de jerarquías de aprobación del municipio ───────────────────
// ?sinJerarquias en la URL → devuelve null → EmptyState isMandatory bloqueante

const JERARQUIAS_CONFIG = {
  municipio: 'San Miguel de Tucumán',
  autoridades: [
    { cargo: 'Intendente Municipal',   montoMaximo: null,    rol: 'autoridad_aprobadora' },
    { cargo: 'Secretario/a de Área',   montoMaximo: 500_000, rol: 'autoridad_aprobadora' },
    { cargo: 'Director/a de Área',     montoMaximo: 100_000, rol: 'autoridad_aprobadora' },
  ],
  modalidades: ['Licitación Pública', 'Licitación Privada', 'Contratación Directa'],
  ultimaActualizacion: '2026-03-15T00:00:00.000Z',
}

// ── API pública ───────────────────────────────────────────────────────────────

export async function getConfiguracionJerarquias(tenantId) {
  const sinJerarquias = new URLSearchParams(window.location.search).has('sinJerarquias')
  await new Promise(r => setTimeout(r, 300))
  if (sinJerarquias || tenantId !== 'sanmiguel') return null
  return JERARQUIAS_CONFIG
}

export async function getExpedientesParaAprobar(tenantId) {
  await new Promise(r => setTimeout(r, 400))
  return EXPEDIENTES
    .filter(e => e.tenantId === tenantId)
    .map(({ id, expedienteNum, titulo, area, modalidad, precioBase, montoAdjudicado,
            prioridad, pendienteDesde, etapaActual, ganador, firmado }) => ({
      id, expedienteNum, titulo, area, modalidad, precioBase, montoAdjudicado,
      prioridad, pendienteDesde, etapaActual, ganador, firmado,
    }))
}

export async function getDetalleExpediente(tenantId, expedienteId) {
  await new Promise(r => setTimeout(r, 300))
  return EXPEDIENTES.find(e => e.tenantId === tenantId && e.id === expedienteId) ?? null
}

export async function firmarEtapaAprobacion(expedienteId, etapaId, accion, firmante, observaciones) {
  await new Promise(r => setTimeout(r, 800))
  return { ok: true, firmante, fechaFirma: new Date().toISOString(), observaciones }
}

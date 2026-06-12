// ── Motor de datos del Portal Ciudadano ──────────────────────────────────────
//
// BARRERA PRIMARIA: tenantId filtra primero — ningún municipio puede ver
// datos de otro, aunque el portal sea de acceso público.
//
// FILTRO DE ESTADO: solo PUBLICADO y ADJUDICADO son visibles al ciudadano.
// Borradores, pendientes de firma y procesos en subasta activa son excluidos.

const delay_ms = ms => new Promise(r => setTimeout(r, ms))

export const ESTADO_PORTAL = {
  PUBLICADO:  'publicado',
  ADJUDICADO: 'adjudicado',
}

// ── Datos mock: solo registros que SUPERARON el proceso ──────────────────────
// Procesos que NO aparecen (excluidos por barrera de estado):
//   EXP-2026-0002  — estado: borrador          → invisible al ciudadano
//   EXP-2026-0003  — estado: pendiente_aprobacion → invisible al ciudadano

const _PROCESOS = [
  {
    id:               'exp-0142',
    tenantId:         'sanmiguel',
    expedienteNum:    'EXP-2025-0142',
    titulo:           'Adquisición de Equipamiento Informático para Área de Modernización',
    area:             'Secretaría de Modernización',
    modalidad:        'Licitación Pública',
    estado:           ESTADO_PORTAL.ADJUDICADO,
    montoBase:        850_000,
    montoAdjudicado:  638_000,
    ganador:          { razonSocial: 'Redes y Cableados SA', cuit: '30-65432197-4' },
    fechaSubasta:     '2026-06-06T17:00:00.000Z',
    fechaAdjudicacion:'2026-06-10T12:45:00.000Z',
  },
  {
    id:               'exp-0138',
    tenantId:         'sanmiguel',
    expedienteNum:    'EXP-2025-0138',
    titulo:           'Suministro de Combustible para Flota Municipal',
    area:             'Secretaría de Obras Públicas',
    modalidad:        'Contratación Directa',
    estado:           ESTADO_PORTAL.ADJUDICADO,
    montoBase:        1_560_000,
    montoAdjudicado:  1_240_000,
    ganador:          { razonSocial: 'Combustibles del NOA SA', cuit: '30-71234567-3' },
    fechaSubasta:     '2026-06-10T17:00:00.000Z',
    fechaAdjudicacion:'2026-06-11T13:00:00.000Z',
  },
  {
    id:               'exp-0135',
    tenantId:         'sanmiguel',
    expedienteNum:    'EXP-2025-0135',
    titulo:           'Impresión de Material Gráfico Institucional',
    area:             'Secretaría de Comunicación Institucional',
    modalidad:        'Licitación Privada',
    estado:           ESTADO_PORTAL.ADJUDICADO,
    montoBase:        120_000,
    montoAdjudicado:  95_000,
    ganador:          { razonSocial: 'Impresiones Rápidas SRL', cuit: '20-45678901-2' },
    fechaSubasta:     '2026-06-07T17:00:00.000Z',
    fechaAdjudicacion:'2026-06-08T13:00:00.000Z',
  },
  {
    id:               'exp-0001-2026',
    tenantId:         'sanmiguel',
    expedienteNum:    'EXP-2026-0001',
    titulo:           'Servicio de Mantenimiento Edilicio de Instalaciones Municipales',
    area:             'Secretaría de Obras Públicas',
    modalidad:        'Licitación Privada',
    estado:           ESTADO_PORTAL.PUBLICADO,
    montoBase:        450_000,
    montoAdjudicado:  null,
    ganador:          null,
    fechaSubasta:     '2026-06-20T13:00:00.000Z',   // 10:00 ART (UTC−3)
    fechaAdjudicacion: null,
  },
]

const _DOCUMENTOS = [
  {
    id:           'doc-res-0142',
    tenantId:     'sanmiguel',
    expedienteNum:'EXP-2025-0142',
    tipo:         'resolucion',
    titulo:       'Resolución de Adjudicación N.º 142/2026',
    fechaEmision: '2026-06-10T12:45:00.000Z',
    contenido: `MUNICIPALIDAD DE SAN MIGUEL DE TUCUMÁN
SECRETARÍA DE MODERNIZACIÓN

RESOLUCIÓN N.º 142/2026

San Miguel de Tucumán, 10 de junio de 2026.

VISTO:
El Expediente N.º EXP-2025-0142 referido a la "Adquisición de Equipamiento Informático
para Área de Modernización", tramitado mediante procedimiento de subasta inversa digital
a través de la plataforma SICST MAX conforme lo dispuesto por la Ordenanza N.º 3.215/2024; y

CONSIDERANDO:
Que el procedimiento licitatorio fue publicado oportunamente conforme lo establecido en
el Reglamento de Compras Públicas Digitales del Municipio de San Miguel de Tucumán;
Que participaron del proceso cuatro (4) proveedores debidamente habilitados;
Que concluida la subasta inversa, la propuesta más conveniente fue presentada por la
firma REDES Y CABLEADOS SA, CUIT 30-65432197-4, por la suma de PESOS SEISCIENTOS
TREINTA Y OCHO MIL ($638.000);
Que dicho importe representa un ahorro del 24,9% respecto del presupuesto oficial
estimado de PESOS OCHOCIENTOS CINCUENTA MIL ($850.000);
Que la Dirección de Compras y Contrataciones ha verificado la documentación presentada,
encontrando todo en regla y ajustado a la normativa vigente;

POR ELLO, la Señora Intendente Municipal, en uso de sus facultades,

RESUELVE:

ARTÍCULO 1°.- Adjudicar la Licitación N.º EXP-2025-0142 a la firma REDES Y CABLEADOS SA,
CUIT 30-65432197-4, por la suma total de PESOS SEISCIENTOS TREINTA Y OCHO MIL ($638.000).

ARTÍCULO 2°.- El plazo de entrega será de diez (10) días hábiles a partir de la
notificación de la presente Resolución.

ARTÍCULO 3°.- La presente Resolución es de acceso público conforme la Ley Provincial
de Transparencia N.º 8.094 y la Ordenanza Municipal N.º 3.215/2024.

ARTÍCULO 4°.- Notifíquese al adjudicatario y al resto de los participantes.
Regístrese. Comuníquese. Publíquese. Cumplido, archívese.

___________________________________
Intendente Municipal
Municipalidad de San Miguel de Tucumán

Resolución N.º 142/2026 — Documento generado por SICST MAX`,
  },
  {
    id:           'doc-res-0138',
    tenantId:     'sanmiguel',
    expedienteNum:'EXP-2025-0138',
    tipo:         'resolucion',
    titulo:       'Resolución de Adjudicación N.º 138/2026',
    fechaEmision: '2026-06-11T13:00:00.000Z',
    contenido: `MUNICIPALIDAD DE SAN MIGUEL DE TUCUMÁN
SECRETARÍA DE OBRAS PÚBLICAS

RESOLUCIÓN N.º 138/2026

San Miguel de Tucumán, 11 de junio de 2026.

VISTO:
El Expediente N.º EXP-2025-0138 referido al "Suministro de Combustible para Flota
Municipal", tramitado mediante procedimiento de contratación directa con subasta inversa
digital a través de la plataforma SICST MAX; y

CONSIDERANDO:
Que el procedimiento fue publicado oportunamente en los términos del reglamento vigente;
Que presentaron oferta tres (3) proveedores habilitados en el rubro Combustibles y Afines;
Que la propuesta adjudicada pertenece a la firma COMBUSTIBLES DEL NOA SA, CUIT
30-71234567-3, por la suma de PESOS UN MILLÓN DOSCIENTOS CUARENTA MIL ($1.240.000);
Que el ahorro obtenido respecto del presupuesto oficial de PESOS UN MILLÓN QUINIENTOS
SESENTA MIL ($1.560.000) asciende al 20,5%;
Que la Dirección de Compras verificó el cumplimiento de los requisitos formales y la
habilitación municipal del proveedor adjudicatario;

POR ELLO, la Señora Intendente Municipal, en uso de sus facultades,

RESUELVE:

ARTÍCULO 1°.- Adjudicar la Contratación N.º EXP-2025-0138 a la firma COMBUSTIBLES DEL
NOA SA, CUIT 30-71234567-3, por la suma total de PESOS UN MILLÓN DOSCIENTOS CUARENTA
MIL ($1.240.000).

ARTÍCULO 2°.- El suministro se realizará en forma mensual durante el ejercicio 2026 en
los depósitos municipales designados por la Secretaría de Obras Públicas.

ARTÍCULO 3°.- La presente Resolución es de acceso público conforme normativa vigente.

ARTÍCULO 4°.- Notifíquese. Regístrese. Publíquese. Archívese.

___________________________________
Intendente Municipal
Municipalidad de San Miguel de Tucumán

Resolución N.º 138/2026 — Documento generado por SICST MAX`,
  },
  {
    id:           'doc-acta-0135',
    tenantId:     'sanmiguel',
    expedienteNum:'EXP-2025-0135',
    tipo:         'acta',
    titulo:       'Acta de Recepción Conforme N.º 35/2026',
    fechaEmision: '2026-06-09T15:30:00.000Z',
    contenido: `MUNICIPALIDAD DE SAN MIGUEL DE TUCUMÁN
DIRECCIÓN DE COMPRAS Y CONTRATACIONES

ACTA DE RECEPCIÓN CONFORME N.º 35/2026

En la ciudad de San Miguel de Tucumán, a los nueve (9) días del mes de junio de 2026,
siendo las 12:30 horas, se labra la presente acta en el marco del Expediente N.º
EXP-2025-0135 caratulado "Impresión de Material Gráfico Institucional".

PARTES INTERVINIENTES:
- Municipalidad de San Miguel de Tucumán, representada por la Lic. Patricia Álvarez,
  Directora de Comunicación Institucional.
- IMPRESIONES RÁPIDAS SRL, CUIT 20-45678901-2, representada por Rodrigo Gutiérrez,
  en carácter de responsable técnico.

DESCRIPCIÓN DE LOS BIENES RECIBIDOS:
Se recibe la totalidad del material gráfico institucional contratado:
  - 5.000 folletos informativos tamaño A4 doble faz, full color.
  - 2.000 afiches institucionales tamaño A2, laminado mate.
  - 500 banners retráctiles 80×200 cm con impresión digital de alta resolución.

CONFORMIDAD:
Los bienes entregados se corresponden en cantidad, calidad y especificaciones con los
requeridos en el Pliego de Bases y Condiciones. El material fue inspeccionado y se
encontró en perfectas condiciones, sin faltantes ni defectos observables.

Monto adjudicado: PESOS NOVENTA Y CINCO MIL ($95.000).

FIRMA DE CONFORMIDAD:

___________________________________         ___________________________________
Lic. Patricia Álvarez                        Rodrigo Gutiérrez
Directora de Comunicación Institucional      IMPRESIONES RÁPIDAS SRL
Municipalidad de San Miguel de Tucumán       CUIT 20-45678901-2

Acta N.º 35/2026 — Documento generado por SICST MAX`,
  },
]

// ── Servicios públicos ────────────────────────────────────────────────────────

/**
 * Retorna los procesos visibles al ciudadano para el tenant indicado.
 * Doble filtro: tenant_id === tenantId AND estado IN [PUBLICADO, ADJUDICADO].
 */
export async function getProcesosPublicos(tenantId) {
  await delay_ms(280)
  return _PROCESOS.filter(
    p => p.tenantId === tenantId &&
         (p.estado === ESTADO_PORTAL.PUBLICADO || p.estado === ESTADO_PORTAL.ADJUDICADO),
  )
}

/**
 * Retorna los documentos de carácter público para el tenant indicado.
 * Solo documentos de procesos ya ADJUDICADOS y cerrados.
 */
export async function getDocumentosPublicos(tenantId) {
  await delay_ms(200)
  return _DOCUMENTOS.filter(d => d.tenantId === tenantId)
}

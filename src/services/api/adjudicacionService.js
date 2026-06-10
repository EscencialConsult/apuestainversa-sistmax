import { ROLES } from '../../config/roles'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export const ESTADOS_ETAPA = {
  PENDIENTE:   'pendiente',
  EN_PROGRESO: 'en_progreso',
  APROBADO:    'aprobado',
  RECHAZADO:   'rechazado',
}

export const TIPOS_PLANTILLA = {
  CONTRATO: 'contrato',
  ORDEN:    'orden',
}

const PLANTILLA_CONTRATO = `MUNICIPALIDAD DE {{NOMBRE_MUNICIPIO}}
SECRETARÍA DE HACIENDA Y ADMINISTRACIÓN

RESOLUCIÓN N.° {{NUMERO_CONTRATO}}/{{ANIO}}
San Miguel de Tucumán, {{FECHA_ADJUDICACION}}

VISTO el Expediente N.° {{NUMERO_EXPEDIENTE}}, relacionado con el proceso de SUBASTA INVERSA ELECTRÓNICA para la contratación de "{{OBJETO_CONTRATACION}}"; y

CONSIDERANDO:

Que el proceso de Subasta Inversa Electrónica fue llevado a cabo mediante la plataforma SICST MAX en cumplimiento de las normativas de contratación pública municipal vigentes.

Que en dicho proceso se obtuvieron propuestas económicas, resultando la oferta más baja ventajosa para los intereses del Estado Municipal.

Que la empresa {{RAZON_SOCIAL_GANADOR}}, con CUIT N.° {{CUIT_GANADOR}}, presentó la oferta más conveniente por la suma de {{MONTO_ADJUDICADO}} ({{MONTO_ADJUDICADO_LETRAS}}).

Que la Evaluación Técnica verificó el cumplimiento de los requisitos técnicos del Pliego de Condiciones Particulares.

Que la Revisión Documental confirmó que el proveedor se encuentra habilitado para contratar con el Estado, con Constancia de Inscripción ARCA en regla.

Por ello, el Intendente Municipal, en ejercicio de sus atribuciones,

RESUELVE:

ARTÍCULO 1°. — ADJUDICAR el proceso de Subasta Inversa Electrónica correspondiente al Expediente N.° {{NUMERO_EXPEDIENTE}} a la empresa {{RAZON_SOCIAL_GANADOR}}, CUIT N.° {{CUIT_GANADOR}}, por la suma total de {{MONTO_ADJUDICADO}} ({{MONTO_ADJUDICADO_LETRAS}}).

ARTÍCULO 2°. — El adjudicatario dispondrá de cinco (5) días hábiles contados desde la notificación de la presente para acreditar la documentación complementaria que se le requiera.

ARTÍCULO 3°. — La presente Resolución será publicada en el Portal Ciudadano de la Municipalidad y notificada electrónicamente al adjudicatario.

ARTÍCULO 4°. — Regístrese, comuníquese y archívese.


                    ___________________________
                    {{AUTORIDAD}}
                    INTENDENTE MUNICIPAL
                    Municipalidad de {{NOMBRE_MUNICIPIO}}`

const PLANTILLA_ORDEN = `MUNICIPALIDAD DE {{NOMBRE_MUNICIPIO}}
DIRECCIÓN GENERAL DE COMPRAS Y CONTRATACIONES

ORDEN DE COMPRA N.° {{NUMERO_CONTRATO}}/{{ANIO}}

Fecha de emisión:    {{FECHA_ADJUDICACION}}
Expediente de origen: {{NUMERO_EXPEDIENTE}}

────────────────────────────────────────────────────────────

DATOS DEL PROVEEDOR
Razón Social:   {{RAZON_SOCIAL_GANADOR}}
CUIT:           {{CUIT_GANADOR}}
Origen:         Proceso de Subasta Inversa Electrónica · SICST MAX

────────────────────────────────────────────────────────────

DETALLE DE LA CONTRATACIÓN
Objeto:         {{OBJETO_CONTRATACION}}
N.° Expediente: {{NUMERO_EXPEDIENTE}}

────────────────────────────────────────────────────────────

IMPORTE TOTAL:  {{MONTO_ADJUDICADO}}
                ({{MONTO_ADJUDICADO_LETRAS}})

────────────────────────────────────────────────────────────

Condiciones de entrega y pago según Pliego de Condiciones
Particulares adjunto. El proveedor deberá remitir factura
original a nombre de la MUNICIPALIDAD DE {{NOMBRE_MUNICIPIO}}.


Firma autorizada:
___________________________
{{AUTORIDAD}}
INTENDENTE MUNICIPAL
Municipalidad de {{NOMBRE_MUNICIPIO}}`

export async function getExpedienteAdjudicacion(expedienteId) {
  await delay(350)
  return {
    id:              expedienteId,
    expedienteNum:   'EXP-2025-0142',
    titulo:          'Adquisición de Equipamiento Informático para Dependencias Municipales',
    precioBase:      850_000,
    montoAdjudicado: 638_000,
    fechaSubasta:    new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    ganador: {
      id:          'of-2',
      razonSocial: 'Redes y Cableados SA',
      cuit:        '30-71234567-8',
    },
    autoridad:     'Dr. Hugo Montero',
    numeroContrato: '0142',
  }
}

export async function getCircuitoAprobacion(tenantId) {
  await delay(250)
  const ahora = Date.now()
  return [
    {
      id:           'evaluacion_tecnica',
      label:        'Evaluación Técnica',
      descripcion:  'Verificación de especificaciones técnicas y cumplimiento del pliego',
      rol:          ROLES.EVAL_TECNICO,
      rolLabel:     'Evaluador Técnico',
      estado:       ESTADOS_ETAPA.APROBADO,
      firmante:     'Ing. Ramírez, Carlos',
      fechaFirma:   new Date(ahora - 8 * 60 * 60 * 1000).toISOString(),
      observaciones:'La oferta cumple con todas las especificaciones técnicas requeridas.',
    },
    {
      id:           'revision_documental',
      label:        'Revisión Documental',
      descripcion:  'Verificación de documentación legal y habilidad para contratar con el Estado',
      rol:          ROLES.EVAL_DOCUMENTAL,
      rolLabel:     'Evaluador Documental',
      estado:       ESTADOS_ETAPA.APROBADO,
      firmante:     'Lic. Torres, Ana',
      fechaFirma:   new Date(ahora - 3 * 60 * 60 * 1000).toISOString(),
      observaciones:'Documentación completa. Constancia ARCA en regla. Sin observaciones.',
    },
    {
      id:           'firma_autoridad',
      label:        'Firma de Autoridad Aprobadora',
      descripcion:  'Aprobación y firma del acto administrativo de adjudicación',
      rol:          ROLES.AUTORIDAD,
      rolLabel:     'Autoridad Aprobadora',
      estado:       ESTADOS_ETAPA.EN_PROGRESO,
      firmante:     null,
      fechaFirma:   null,
      observaciones:null,
    },
    {
      id:           'imputacion_presupuestaria',
      label:        'Imputación Presupuestaria',
      descripcion:  'Registro del compromiso de gasto en el sistema contable-presupuestario',
      rol:          ROLES.COMPRADOR,
      rolLabel:     'Comprador Municipal',
      estado:       ESTADOS_ETAPA.PENDIENTE,
      firmante:     null,
      fechaFirma:   null,
      observaciones:null,
    },
    {
      id:           'publicacion',
      label:        'Publicación y Notificación',
      descripcion:  'Publicación en el portal ciudadano y notificación electrónica al adjudicatario',
      rol:          ROLES.ADMIN,
      rolLabel:     'Administrador del Sistema',
      estado:       ESTADOS_ETAPA.PENDIENTE,
      firmante:     null,
      fechaFirma:   null,
      observaciones:null,
    },
  ]
}

export async function getPlantillas(tenantId) {
  await delay(450)
  // Demo: ?sinPlantillaContrato o ?sinPlantillaOrden simulan falta de parametrización
  const params = new URLSearchParams(window.location.search)
  return {
    contrato: params.has('sinPlantillaContrato') ? null : PLANTILLA_CONTRATO,
    orden:    params.has('sinPlantillaOrden')    ? null : PLANTILLA_ORDEN,
  }
}

export async function firmarEtapa(etapaId, firmante, observaciones) {
  await delay(900)
  return {
    ok:           true,
    firmante,
    fechaFirma:   new Date().toISOString(),
    observaciones,
  }
}

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
SECRETARÃA DE HACIENDA Y ADMINISTRACIÃ“N

RESOLUCIÃ“N N.Â° {{NUMERO_CONTRATO}}/{{ANIO}}
San Miguel de TucumÃ¡n, {{FECHA_ADJUDICACION}}

VISTO el Expediente N.Â° {{NUMERO_EXPEDIENTE}}, relacionado con el proceso de SUBASTA INVERSA ELECTRÃ“NICA para la contrataciÃ³n de "{{OBJETO_CONTRATACION}}"; y

CONSIDERANDO:

Que el proceso de Subasta Inversa ElectrÃ³nica fue llevado a cabo mediante la plataforma INVERSA.Bid en cumplimiento de las normativas de contrataciÃ³n pÃºblica municipal vigentes.

Que en dicho proceso se obtuvieron propuestas econÃ³micas, resultando la oferta mÃ¡s baja ventajosa para los intereses del Estado Municipal.

Que la empresa {{RAZON_SOCIAL_GANADOR}}, con CUIT N.Â° {{CUIT_GANADOR}}, presentÃ³ la oferta mÃ¡s conveniente por la suma de {{MONTO_ADJUDICADO}} ({{MONTO_ADJUDICADO_LETRAS}}).

Que la EvaluaciÃ³n TÃ©cnica verificÃ³ el cumplimiento de los requisitos tÃ©cnicos del Pliego de Condiciones Particulares.

Que la RevisiÃ³n Documental confirmÃ³ que el proveedor se encuentra habilitado para contratar con el Estado, con Constancia de InscripciÃ³n ARCA en regla.

Por ello, el Intendente Municipal, en ejercicio de sus atribuciones,

RESUELVE:

ARTÃCULO 1Â°. â€” ADJUDICAR el proceso de Subasta Inversa ElectrÃ³nica correspondiente al Expediente N.Â° {{NUMERO_EXPEDIENTE}} a la empresa {{RAZON_SOCIAL_GANADOR}}, CUIT N.Â° {{CUIT_GANADOR}}, por la suma total de {{MONTO_ADJUDICADO}} ({{MONTO_ADJUDICADO_LETRAS}}).

ARTÃCULO 2Â°. â€” El adjudicatario dispondrÃ¡ de cinco (5) dÃ­as hÃ¡biles contados desde la notificaciÃ³n de la presente para acreditar la documentaciÃ³n complementaria que se le requiera.

ARTÃCULO 3Â°. â€” La presente ResoluciÃ³n serÃ¡ publicada en el Portal Ciudadano de la Municipalidad y notificada electrÃ³nicamente al adjudicatario.

ARTÃCULO 4Â°. â€” RegÃ­strese, comunÃ­quese y archÃ­vese.


                    ___________________________
                    {{AUTORIDAD}}
                    INTENDENTE MUNICIPAL
                    Municipalidad de {{NOMBRE_MUNICIPIO}}`

const PLANTILLA_ORDEN = `MUNICIPALIDAD DE {{NOMBRE_MUNICIPIO}}
DIRECCIÃ“N GENERAL DE COMPRAS Y CONTRATACIONES

ORDEN DE COMPRA N.Â° {{NUMERO_CONTRATO}}/{{ANIO}}

Fecha de emisiÃ³n:    {{FECHA_ADJUDICACION}}
Expediente de origen: {{NUMERO_EXPEDIENTE}}

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

DATOS DEL PROVEEDOR
RazÃ³n Social:   {{RAZON_SOCIAL_GANADOR}}
CUIT:           {{CUIT_GANADOR}}
Origen:         Proceso de Subasta Inversa ElectrÃ³nica Â· INVERSA.Bid

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

DETALLE DE LA CONTRATACIÃ“N
Objeto:         {{OBJETO_CONTRATACION}}
N.Â° Expediente: {{NUMERO_EXPEDIENTE}}

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

IMPORTE TOTAL:  {{MONTO_ADJUDICADO}}
                ({{MONTO_ADJUDICADO_LETRAS}})

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Condiciones de entrega y pago segÃºn Pliego de Condiciones
Particulares adjunto. El proveedor deberÃ¡ remitir factura
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
    titulo:          'AdquisiciÃ³n de Equipamiento InformÃ¡tico para Dependencias Municipales',
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
      label:        'EvaluaciÃ³n TÃ©cnica',
      descripcion:  'VerificaciÃ³n de especificaciones tÃ©cnicas y cumplimiento del pliego',
      rol:          ROLES.EVAL_TECNICO,
      rolLabel:     'Evaluador TÃ©cnico',
      estado:       ESTADOS_ETAPA.APROBADO,
      firmante:     'Ing. RamÃ­rez, Carlos',
      fechaFirma:   new Date(ahora - 8 * 60 * 60 * 1000).toISOString(),
      observaciones:'La oferta cumple con todas las especificaciones tÃ©cnicas requeridas.',
    },
    {
      id:           'revision_documental',
      label:        'RevisiÃ³n Documental',
      descripcion:  'VerificaciÃ³n de documentaciÃ³n legal y habilidad para contratar con el Estado',
      rol:          ROLES.EVAL_DOCUMENTAL,
      rolLabel:     'Evaluador Documental',
      estado:       ESTADOS_ETAPA.APROBADO,
      firmante:     'Lic. Torres, Ana',
      fechaFirma:   new Date(ahora - 3 * 60 * 60 * 1000).toISOString(),
      observaciones:'DocumentaciÃ³n completa. Constancia ARCA en regla. Sin observaciones.',
    },
    {
      id:           'firma_autoridad',
      label:        'Firma de Autoridad Aprobadora',
      descripcion:  'AprobaciÃ³n y firma del acto administrativo de adjudicaciÃ³n',
      rol:          ROLES.AUTORIDAD,
      rolLabel:     'Autoridad Aprobadora',
      estado:       ESTADOS_ETAPA.EN_PROGRESO,
      firmante:     null,
      fechaFirma:   null,
      observaciones:null,
    },
    {
      id:           'imputacion_presupuestaria',
      label:        'ImputaciÃ³n Presupuestaria',
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
      label:        'PublicaciÃ³n y NotificaciÃ³n',
      descripcion:  'PublicaciÃ³n en el portal ciudadano y notificaciÃ³n electrÃ³nica al adjudicatario',
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
  // Demo: ?sinPlantillaContrato o ?sinPlantillaOrden simulan falta de parametrizaciÃ³n
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


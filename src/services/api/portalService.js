// â”€â”€ Motor de datos del Portal Ciudadano â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// BARRERA PRIMARIA: tenantId filtra primero â€” ningÃºn municipio puede ver
// datos de otro, aunque el portal sea de acceso pÃºblico.
//
// FILTRO DE ESTADO: solo PUBLICADO y ADJUDICADO son visibles al ciudadano.
// Borradores, pendientes de firma y procesos en subasta activa son excluidos.

const delay_ms = ms => new Promise(r => setTimeout(r, ms))

export const ESTADO_PORTAL = {
  PUBLICADO:  'publicado',
  ADJUDICADO: 'adjudicado',
}

// â”€â”€ Datos mock: solo registros que SUPERARON el proceso â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Procesos que NO aparecen (excluidos por barrera de estado):
//   EXP-2026-0002  â€” estado: borrador          â†’ invisible al ciudadano
//   EXP-2026-0003  â€” estado: pendiente_aprobacion â†’ invisible al ciudadano

const _PROCESOS = [
  {
    id:               'exp-0142',
    tenantId:         'sanmiguel',
    expedienteNum:    'EXP-2025-0142',
    titulo:           'AdquisiciÃ³n de Equipamiento InformÃ¡tico para Ãrea de ModernizaciÃ³n',
    area:             'SecretarÃ­a de ModernizaciÃ³n',
    modalidad:        'LicitaciÃ³n PÃºblica',
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
    area:             'SecretarÃ­a de Obras PÃºblicas',
    modalidad:        'ContrataciÃ³n Directa',
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
    titulo:           'ImpresiÃ³n de Material GrÃ¡fico Institucional',
    area:             'SecretarÃ­a de ComunicaciÃ³n Institucional',
    modalidad:        'LicitaciÃ³n Privada',
    estado:           ESTADO_PORTAL.ADJUDICADO,
    montoBase:        120_000,
    montoAdjudicado:  95_000,
    ganador:          { razonSocial: 'Impresiones RÃ¡pidas SRL', cuit: '20-45678901-2' },
    fechaSubasta:     '2026-06-07T17:00:00.000Z',
    fechaAdjudicacion:'2026-06-08T13:00:00.000Z',
  },
  {
    id:               'exp-0001-2026',
    tenantId:         'sanmiguel',
    expedienteNum:    'EXP-2026-0001',
    titulo:           'Servicio de Mantenimiento Edilicio de Instalaciones Municipales',
    area:             'SecretarÃ­a de Obras PÃºblicas',
    modalidad:        'LicitaciÃ³n Privada',
    estado:           ESTADO_PORTAL.PUBLICADO,
    montoBase:        450_000,
    montoAdjudicado:  null,
    ganador:          null,
    fechaSubasta:     '2026-06-20T13:00:00.000Z',   // 10:00 ART (UTCâˆ’3)
    fechaAdjudicacion: null,
  },
]

const _DOCUMENTOS = [
  {
    id:           'doc-res-0142',
    tenantId:     'sanmiguel',
    expedienteNum:'EXP-2025-0142',
    tipo:         'resolucion',
    titulo:       'ResoluciÃ³n de AdjudicaciÃ³n N.Âº 142/2026',
    fechaEmision: '2026-06-10T12:45:00.000Z',
    contenido: `MUNICIPALIDAD DE SAN MIGUEL DE TUCUMÃN
SECRETARÃA DE MODERNIZACIÃ“N

RESOLUCIÃ“N N.Âº 142/2026

San Miguel de TucumÃ¡n, 10 de junio de 2026.

VISTO:
El Expediente N.Âº EXP-2025-0142 referido a la "AdquisiciÃ³n de Equipamiento InformÃ¡tico
para Ãrea de ModernizaciÃ³n", tramitado mediante procedimiento de subasta inversa digital
a travÃ©s de la plataforma INVERSA.Bid conforme lo dispuesto por la Ordenanza N.Âº 3.215/2024; y

CONSIDERANDO:
Que el procedimiento licitatorio fue publicado oportunamente conforme lo establecido en
el Reglamento de Compras PÃºblicas Digitales del Municipio de San Miguel de TucumÃ¡n;
Que participaron del proceso cuatro (4) proveedores debidamente habilitados;
Que concluida la subasta inversa, la propuesta mÃ¡s conveniente fue presentada por la
firma REDES Y CABLEADOS SA, CUIT 30-65432197-4, por la suma de PESOS SEISCIENTOS
TREINTA Y OCHO MIL ($638.000);
Que dicho importe representa un ahorro del 24,9% respecto del presupuesto oficial
estimado de PESOS OCHOCIENTOS CINCUENTA MIL ($850.000);
Que la DirecciÃ³n de Compras y Contrataciones ha verificado la documentaciÃ³n presentada,
encontrando todo en regla y ajustado a la normativa vigente;

POR ELLO, la SeÃ±ora Intendente Municipal, en uso de sus facultades,

RESUELVE:

ARTÃCULO 1Â°.- Adjudicar la LicitaciÃ³n N.Âº EXP-2025-0142 a la firma REDES Y CABLEADOS SA,
CUIT 30-65432197-4, por la suma total de PESOS SEISCIENTOS TREINTA Y OCHO MIL ($638.000).

ARTÃCULO 2Â°.- El plazo de entrega serÃ¡ de diez (10) dÃ­as hÃ¡biles a partir de la
notificaciÃ³n de la presente ResoluciÃ³n.

ARTÃCULO 3Â°.- La presente ResoluciÃ³n es de acceso pÃºblico conforme la Ley Provincial
de Transparencia N.Âº 8.094 y la Ordenanza Municipal N.Âº 3.215/2024.

ARTÃCULO 4Â°.- NotifÃ­quese al adjudicatario y al resto de los participantes.
RegÃ­strese. ComunÃ­quese. PublÃ­quese. Cumplido, archÃ­vese.

___________________________________
Intendente Municipal
Municipalidad de San Miguel de TucumÃ¡n

ResoluciÃ³n N.Âº 142/2026 â€” Documento generado por INVERSA.Bid`,
  },
  {
    id:           'doc-res-0138',
    tenantId:     'sanmiguel',
    expedienteNum:'EXP-2025-0138',
    tipo:         'resolucion',
    titulo:       'ResoluciÃ³n de AdjudicaciÃ³n N.Âº 138/2026',
    fechaEmision: '2026-06-11T13:00:00.000Z',
    contenido: `MUNICIPALIDAD DE SAN MIGUEL DE TUCUMÃN
SECRETARÃA DE OBRAS PÃšBLICAS

RESOLUCIÃ“N N.Âº 138/2026

San Miguel de TucumÃ¡n, 11 de junio de 2026.

VISTO:
El Expediente N.Âº EXP-2025-0138 referido al "Suministro de Combustible para Flota
Municipal", tramitado mediante procedimiento de contrataciÃ³n directa con subasta inversa
digital a travÃ©s de la plataforma INVERSA.Bid; y

CONSIDERANDO:
Que el procedimiento fue publicado oportunamente en los tÃ©rminos del reglamento vigente;
Que presentaron oferta tres (3) proveedores habilitados en el rubro Combustibles y Afines;
Que la propuesta adjudicada pertenece a la firma COMBUSTIBLES DEL NOA SA, CUIT
30-71234567-3, por la suma de PESOS UN MILLÃ“N DOSCIENTOS CUARENTA MIL ($1.240.000);
Que el ahorro obtenido respecto del presupuesto oficial de PESOS UN MILLÃ“N QUINIENTOS
SESENTA MIL ($1.560.000) asciende al 20,5%;
Que la DirecciÃ³n de Compras verificÃ³ el cumplimiento de los requisitos formales y la
habilitaciÃ³n municipal del proveedor adjudicatario;

POR ELLO, la SeÃ±ora Intendente Municipal, en uso de sus facultades,

RESUELVE:

ARTÃCULO 1Â°.- Adjudicar la ContrataciÃ³n N.Âº EXP-2025-0138 a la firma COMBUSTIBLES DEL
NOA SA, CUIT 30-71234567-3, por la suma total de PESOS UN MILLÃ“N DOSCIENTOS CUARENTA
MIL ($1.240.000).

ARTÃCULO 2Â°.- El suministro se realizarÃ¡ en forma mensual durante el ejercicio 2026 en
los depÃ³sitos municipales designados por la SecretarÃ­a de Obras PÃºblicas.

ARTÃCULO 3Â°.- La presente ResoluciÃ³n es de acceso pÃºblico conforme normativa vigente.

ARTÃCULO 4Â°.- NotifÃ­quese. RegÃ­strese. PublÃ­quese. ArchÃ­vese.

___________________________________
Intendente Municipal
Municipalidad de San Miguel de TucumÃ¡n

ResoluciÃ³n N.Âº 138/2026 â€” Documento generado por INVERSA.Bid`,
  },
  {
    id:           'doc-acta-0135',
    tenantId:     'sanmiguel',
    expedienteNum:'EXP-2025-0135',
    tipo:         'acta',
    titulo:       'Acta de RecepciÃ³n Conforme N.Âº 35/2026',
    fechaEmision: '2026-06-09T15:30:00.000Z',
    contenido: `MUNICIPALIDAD DE SAN MIGUEL DE TUCUMÃN
DIRECCIÃ“N DE COMPRAS Y CONTRATACIONES

ACTA DE RECEPCIÃ“N CONFORME N.Âº 35/2026

En la ciudad de San Miguel de TucumÃ¡n, a los nueve (9) dÃ­as del mes de junio de 2026,
siendo las 12:30 horas, se labra la presente acta en el marco del Expediente N.Âº
EXP-2025-0135 caratulado "ImpresiÃ³n de Material GrÃ¡fico Institucional".

PARTES INTERVINIENTES:
- Municipalidad de San Miguel de TucumÃ¡n, representada por la Lic. Patricia Ãlvarez,
  Directora de ComunicaciÃ³n Institucional.
- IMPRESIONES RÃPIDAS SRL, CUIT 20-45678901-2, representada por Rodrigo GutiÃ©rrez,
  en carÃ¡cter de responsable tÃ©cnico.

DESCRIPCIÃ“N DE LOS BIENES RECIBIDOS:
Se recibe la totalidad del material grÃ¡fico institucional contratado:
  - 5.000 folletos informativos tamaÃ±o A4 doble faz, full color.
  - 2.000 afiches institucionales tamaÃ±o A2, laminado mate.
  - 500 banners retrÃ¡ctiles 80Ã—200 cm con impresiÃ³n digital de alta resoluciÃ³n.

CONFORMIDAD:
Los bienes entregados se corresponden en cantidad, calidad y especificaciones con los
requeridos en el Pliego de Bases y Condiciones. El material fue inspeccionado y se
encontrÃ³ en perfectas condiciones, sin faltantes ni defectos observables.

Monto adjudicado: PESOS NOVENTA Y CINCO MIL ($95.000).

FIRMA DE CONFORMIDAD:

___________________________________         ___________________________________
Lic. Patricia Ãlvarez                        Rodrigo GutiÃ©rrez
Directora de ComunicaciÃ³n Institucional      IMPRESIONES RÃPIDAS SRL
Municipalidad de San Miguel de TucumÃ¡n       CUIT 20-45678901-2

Acta N.Âº 35/2026 â€” Documento generado por INVERSA.Bid`,
  },
]

// â”€â”€ Servicios pÃºblicos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
 * Retorna los documentos de carÃ¡cter pÃºblico para el tenant indicado.
 * Solo documentos de procesos ya ADJUDICADOS y cerrados.
 */
export async function getDocumentosPublicos(tenantId) {
  await delay_ms(200)
  return _DOCUMENTOS.filter(d => d.tenantId === tenantId)
}


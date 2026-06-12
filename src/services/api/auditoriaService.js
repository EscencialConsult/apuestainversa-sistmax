/**
 * Servicio de AuditorÃ­a y Trazabilidad
 *
 * DIRECTIVA MULTI-TENANT: `tenant_id` es la primera barrera de filtrado.
 * NingÃºn municipio puede acceder a eventos de otro, ni por error de red.
 *
 * MOCK: los eventos se generan al cargar el mÃ³dulo (Date.now() en scope de
 * mÃ³dulo, no en render). Para producciÃ³n: reemplazar getEventosAuditoria()
 * por una llamada a GET /api/auditoria?tenant_id=...&filtros...
 */

export const MODULOS = {
  SISTEMA:      'SISTEMA',
  USUARIOS:     'USUARIOS',
  PROVEEDORES:  'PROVEEDORES',
  COMPRAS:      'COMPRAS',
  TRADING:      'TRADING',
  ADJUDICACION: 'ADJUDICACION',
  APROBACION:   'APROBACION',
}

export const TIPOS = {
  INFO:        'INFO',
  EXITO:       'EXITO',
  ADVERTENCIA: 'ADVERTENCIA',
  CRITICO:     'CRITICO',
}

export const MODULO_LABELS = {
  [MODULOS.SISTEMA]:      'Sistema',
  [MODULOS.USUARIOS]:     'Usuarios',
  [MODULOS.PROVEEDORES]:  'Proveedores',
  [MODULOS.COMPRAS]:      'Compras',
  [MODULOS.TRADING]:      'Trading',
  [MODULOS.ADJUDICACION]: 'AdjudicaciÃ³n',
  [MODULOS.APROBACION]:   'AprobaciÃ³n',
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))

// Base temporal: Date.now() se llama UNA VEZ al cargar el mÃ³dulo (no en render)
const BASE = Date.now() - 30 * 24 * 3600_000
const h = (n) => new Date(BASE + n * 3600_000).toISOString()

let _seq = 0
const e = (offsetH, tid, modulo, accion, tipo, usuario, descripcion, ip) => ({
  id:          `evt-${tid}-${(++_seq).toString().padStart(4, '0')}`,
  tenant_id:   tid,
  timestamp:   h(offsetH),
  modulo,
  accion,
  tipo,
  usuario,
  descripcion,
  ip,
})
const smt = (offsetH, mod, accion, tipo, usuario, desc, ip = '192.168.1.10') =>
  e(offsetH, 'sanmiguel', mod, accion, tipo, usuario, desc, ip)
const sun = (offsetH, mod, accion, tipo, usuario, desc, ip = '10.20.0.5') =>
  e(offsetH, 'sunchales', mod, accion, tipo, usuario, desc, ip)

const { S, U, P, C, T, A, AP } = {
  S: MODULOS.SISTEMA, U: MODULOS.USUARIOS, P: MODULOS.PROVEEDORES,
  C: MODULOS.COMPRAS, T: MODULOS.TRADING,  A: MODULOS.ADJUDICACION,
  AP: MODULOS.APROBACION,
}
const { I, EX, AD, CR } = { I: TIPOS.INFO, EX: TIPOS.EXITO, AD: TIPOS.ADVERTENCIA, CR: TIPOS.CRITICO }

const EVENTOS_MOCK = [
  // â”€â”€ DÃA 0 â€” ConfiguraciÃ³n inicial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(0,   S, 'INICIO_SISTEMA',    EX, 'sistema',                       'Instancia INVERSA.Bid iniciada correctamente para el tenant sanmiguel'),
  smt(0.1, S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesiÃ³n exitoso',                      '192.168.1.10'),
  smt(0.2, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "comprador@sanmiguel.gob.ar" creado con rol Comprador Municipal'),
  smt(0.3, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "eval.tecnico@sanmiguel.gob.ar" creado con rol Evaluador TÃ©cnico'),
  smt(0.4, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "eval.documental@sanmiguel.gob.ar" creado con rol Evaluador Documental'),
  smt(0.5, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "autoridad@sanmiguel.gob.ar" creado con rol Autoridad Aprobadora'),
  smt(0.6, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "auditor@sanmiguel.gob.ar" creado con rol Auditor',             '192.168.1.10'),
  smt(0.9, S, 'LOGOUT',            I,  'admin@sanmiguel.gob.ar',        'Cierre de sesiÃ³n',                              '192.168.1.10'),

  // â”€â”€ DÃA 1 â€” Primeros logins â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(24,  S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(24.1,S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesiÃ³n exitoso',                      '192.168.1.10'),
  smt(24.5,S, 'CAMBIO_CONFIG',     AD, 'admin@sanmiguel.gob.ar',        'ParÃ¡metro "DECREMENTO_MINIMO" actualizado: $5.000',                      '192.168.1.10'),
  smt(24.6,S, 'CAMBIO_CONFIG',     I,  'admin@sanmiguel.gob.ar',        'ParÃ¡metro "DURACION_SUBASTA_MS" actualizado: 300000ms',                  '192.168.1.10'),
  smt(25,  S, 'LOGOUT',            I,  'comprador@sanmiguel.gob.ar',    'Cierre de sesiÃ³n',                              '192.168.1.15'),

  // â”€â”€ DÃA 3 â€” Registro de proveedores â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(72,  S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(72.1,P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "TechSolutions SA" (CUIT 30-71122334-5) registrado',          '192.168.1.15'),
  smt(72.2,P, 'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK Â· TechSolutions SA Â· InscripciÃ³n activa',                       '192.168.1.15'),
  smt(72.4,P, 'CARGA_DOCUMENTO',   I,  'comprador@sanmiguel.gob.ar',    'PDF de constancia ARCA cargado para TechSolutions SA',                  '192.168.1.15'),
  smt(72.8,P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Redes y Cableados SA" (CUIT 30-71234567-8) registrado',      '192.168.1.15'),
  smt(72.9,P, 'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK Â· Redes y Cableados SA Â· InscripciÃ³n activa',                   '192.168.1.15'),

  smt(73,  P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Distribuidora del TucumÃ¡n" (CUIT 27-65432111-9) registrado', '192.168.1.15'),
  smt(73.1,P, 'VERIFICACION_ARCA', AD, 'comprador@sanmiguel.gob.ar',    'ARCA no disponible Â· Distribuidora del TucumÃ¡n Â· Activada contingencia manual', '192.168.1.15'),
  smt(73.2,P, 'CONTINGENCIA_MANUAL',AD,'comprador@sanmiguel.gob.ar',    'Proveedor "Distribuidora del TucumÃ¡n" ingresado vÃ­a contingencia. Queda en estado "En RevisiÃ³n"', '192.168.1.15'),
  smt(73.3,P, 'CARGA_DOCUMENTO',   I,  'comprador@sanmiguel.gob.ar',    'Constancia AFIP manual cargada para Distribuidora del TucumÃ¡n',         '192.168.1.15'),

  smt(74,  P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Insumos del Norte SRL" (CUIT 30-55098765-1) registrado',     '192.168.1.15'),
  smt(74.1,P, 'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK Â· Insumos del Norte SRL Â· InscripciÃ³n activa',                  '192.168.1.15'),

  // â”€â”€ DÃA 4 â€” EvaluaciÃ³n documental â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(96,  S, 'LOGIN',             I,  'eval.documental@sanmiguel.gob.ar','Inicio de sesiÃ³n exitoso',                    '192.168.1.20'),
  smt(96.1,P, 'REVISION_DOCUMENTAL',EX,'eval.documental@sanmiguel.gob.ar','DocumentaciÃ³n aprobada Â· Distribuidora del TucumÃ¡n Â· Constancia ARCA en regla','192.168.1.20'),
  smt(96.3,P, 'CARGA_DOCUMENTO',   I,  'eval.documental@sanmiguel.gob.ar','Acta de revisiÃ³n documental firmada cargada para Distribuidora del TucumÃ¡n','192.168.1.20'),
  smt(97,  S, 'LOGIN',             I,  'eval.tecnico@sanmiguel.gob.ar',  'Inicio de sesiÃ³n exitoso',                    '192.168.1.22'),
  smt(97.5,P, 'OBSERVACION_DOCUMENTAL',AD,'eval.documental@sanmiguel.gob.ar','Se solicitÃ³ documentaciÃ³n adicional a Insumos del Norte SRL: balances contables','192.168.1.20'),
  smt(98,  P, 'CARGA_DOCUMENTO',   I,  'proveedor4@insumoscn.com',       'Balance contable 2024 cargado por Insumos del Norte SRL',              '200.55.11.22'),
  smt(98.5,P, 'REVISION_DOCUMENTAL',EX,'eval.documental@sanmiguel.gob.ar','DocumentaciÃ³n aprobada Â· Insumos del Norte SRL Â· Sin observaciones',  '192.168.1.20'),

  // â”€â”€ DÃA 5 â€” Alta de expediente de compra â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(120, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(120.2,C,'ALTA_EXPEDIENTE',   EX, 'comprador@sanmiguel.gob.ar',    'Expediente EXP-2025-0142 creado Â· "AdquisiciÃ³n Equipamiento InformÃ¡tico"','192.168.1.15'),
  smt(120.5,C,'CARGA_PLIEGO',      I,  'comprador@sanmiguel.gob.ar',    'Pliego de Condiciones Particulares cargado para EXP-2025-0142',         '192.168.1.15'),
  smt(121,  C,'MODIFICACION_EXPEDIENTE',I,'comprador@sanmiguel.gob.ar', 'Monto base actualizado: $850.000 para EXP-2025-0142',                    '192.168.1.15'),
  smt(121.5,C,'CARGA_ESPECIFICACIONES',I,'eval.tecnico@sanmiguel.gob.ar','Especificaciones tÃ©cnicas cargadas para EXP-2025-0142',                '192.168.1.22'),
  smt(122,  C,'APROBACION_TECNICA_PLIEGO',EX,'eval.tecnico@sanmiguel.gob.ar','Pliego aprobado tÃ©cnicamente para EXP-2025-0142',                  '192.168.1.22'),

  // â”€â”€ DÃA 6 â€” PublicaciÃ³n de subasta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(144, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(144.3,C,'PUBLICACION_SUBASTA',EX,'comprador@sanmiguel.gob.ar',    'Subasta inversa publicada Â· EXP-2025-0142 Â· Inicio programado',         '192.168.1.15'),
  smt(144.4,P,'NOTIFICACION_PROVEEDOR',I,'sistema',                     'NotificaciÃ³n enviada a 4 proveedores habilitados para EXP-2025-0142'),
  smt(145, S, 'LOGOUT',            I,  'comprador@sanmiguel.gob.ar',    'Cierre de sesiÃ³n',                              '192.168.1.15'),

  // â”€â”€ DÃA 8 â€” Intento de login fallido (seguridad) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(192, S, 'LOGIN_FALLIDO',     CR, 'desconocido',                   'Intento de acceso con credenciales invÃ¡lidas (3er intento) Â· IP bloqueada', '203.0.113.45'),
  smt(192.1,S,'BLOQUEO_IP',        CR, 'sistema',                       'IP 203.0.113.45 bloqueada por exceso de intentos fallidos'),
  smt(192.5,S,'LOGIN',             I,  'auditor@sanmiguel.gob.ar',      'Inicio de sesiÃ³n exitoso',                      '192.168.1.30'),
  smt(192.6,C,'CONSULTA_EXPEDIENTE',I, 'auditor@sanmiguel.gob.ar',      'Consulta de expediente EXP-2025-0142',           '192.168.1.30'),

  // â”€â”€ DÃA 10 â€” Acceso anticipado a la sala de trading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(240, S, 'LOGIN',             I,  'proveedor1@techsolutions.com',  'Inicio de sesiÃ³n exitoso',                      '201.45.67.89'),
  smt(240.1,T,'ACCESO_SALA',       I,  'proveedor1@techsolutions.com',  'Ingreso al Trading Room Â· EXP-2025-0142',        '201.45.67.89'),
  smt(240.2,S,'LOGIN',             I,  'proveedor2@redescableados.com', 'Inicio de sesiÃ³n exitoso',                      '200.55.11.22'),
  smt(240.3,T,'ACCESO_SALA',       I,  'proveedor2@redescableados.com', 'Ingreso al Trading Room Â· EXP-2025-0142',        '200.55.11.22'),
  smt(240.4,S,'LOGIN',             I,  'proveedor3@distribuidora.com',  'Inicio de sesiÃ³n exitoso',                      '186.33.44.55'),
  smt(240.5,T,'ACCESO_SALA',       I,  'proveedor3@distribuidora.com',  'Ingreso al Trading Room Â· EXP-2025-0142',        '186.33.44.55'),
  smt(240.6,S,'LOGIN',             I,  'proveedor4@insumoscn.com',      'Inicio de sesiÃ³n exitoso',                      '200.55.11.22'),
  smt(240.7,T,'ACCESO_SALA',       I,  'proveedor4@insumoscn.com',      'Ingreso al Trading Room Â· EXP-2025-0142',        '190.22.33.44'),
  smt(240.8,S,'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso (modo monitoreo)',      '192.168.1.15'),
  smt(240.9,T,'ACCESO_SALA',       I,  'comprador@sanmiguel.gob.ar',    'Ingreso al Trading Room Â· EXP-2025-0142 Â· Modo solo lectura', '192.168.1.15'),

  // â”€â”€ DÃA 10 â€” SesiÃ³n de subasta (Trading Room â€” ~80 eventos en 5min) â”€â”€
  smt(241,    T,'INICIO_SUBASTA',  EX, 'sistema',                       'Subasta inversa iniciada Â· EXP-2025-0142 Â· Base: $850.000'),
  smt(241.083,T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $820.000 (âˆ’$30.000 / âˆ’3.5%)',  '201.45.67.89'),
  smt(241.167,T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $810.000 (âˆ’$10.000 / âˆ’1.2%)',  '200.55.11.22'),
  smt(241.25, T,'LANCE_REGISTRADO',EX, 'Distribuidora del TucumÃ¡n',     'Lance registrado: $800.000 (âˆ’$10.000 / âˆ’1.2%)',  '186.33.44.55'),
  smt(241.33, T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $790.000 (âˆ’$10.000 / âˆ’1.3%)',  '190.22.33.44'),
  smt(241.42, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $775.000 (âˆ’$15.000 / âˆ’1.9%)',  '201.45.67.89'),
  smt(241.5,  T,'LANCE_INVALIDO',  AD, 'Distribuidora del TucumÃ¡n',     'Lance rechazado: $780.000 â€” supera el mÃ­nimo permitido ($770.000)',      '186.33.44.55'),
  smt(241.58, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $760.000 (âˆ’$15.000 / âˆ’1.9%)',  '200.55.11.22'),
  smt(241.67, T,'LANCE_REGISTRADO',EX, 'Distribuidora del TucumÃ¡n',     'Lance registrado: $750.000 (âˆ’$10.000 / âˆ’1.3%)',  '186.33.44.55'),
  smt(241.75, T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $735.000 (âˆ’$15.000 / âˆ’2.0%)',  '190.22.33.44'),
  smt(241.83, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $725.000 (âˆ’$10.000 / âˆ’1.4%)',  '201.45.67.89'),
  smt(241.92, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $715.000 (âˆ’$10.000 / âˆ’1.4%)',  '200.55.11.22'),
  smt(242,    T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $700.000 (âˆ’$15.000 / âˆ’2.1%)',  '190.22.33.44'),
  smt(242.08, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $690.000 (âˆ’$10.000 / âˆ’1.4%)',  '201.45.67.89'),
  smt(242.17, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $680.000 (âˆ’$10.000 / âˆ’1.5%)',  '200.55.11.22'),
  smt(242.25, T,'LANCE_REGISTRADO',EX, 'Distribuidora del TucumÃ¡n',     'Lance registrado: $670.000 (âˆ’$10.000 / âˆ’1.5%)',  '186.33.44.55'),
  smt(242.33, T,'LANCE_INVALIDO',  AD, 'TechSolutions SA',              'Lance rechazado: $675.000 â€” supera el mÃ­nimo permitido ($665.000)',      '201.45.67.89'),
  smt(242.42, T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $660.000 (âˆ’$10.000 / âˆ’1.5%)',  '190.22.33.44'),
  smt(242.5,  T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $650.000 (âˆ’$10.000 / âˆ’1.5%)',  '200.55.11.22'),
  smt(242.58, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $645.000 (âˆ’$5.000 / âˆ’0.8%)',   '201.45.67.89'),
  smt(242.67, T,'EXTENSION_ANTI_SNIPER',AD,'sistema',                   'Lance en ventana anti-sniper Â· Reloj extendido +3:00 min Â· Redes y Cableados SA', '200.55.11.22'),
  smt(242.75, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $638.000 (âˆ’$7.000 / âˆ’1.1%) Â· Lance final',            '200.55.11.22'),
  smt(242.9,  T,'CIERRE_SUBASTA',  EX, 'sistema',                       'Subasta cerrada Â· EXP-2025-0142 Â· Mejor oferta: $638.000 Â· Ahorro: 24.9%'),

  // â”€â”€ DÃA 11 â€” AdjudicaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(264, S, 'LOGIN',             I,  'eval.tecnico@sanmiguel.gob.ar', 'Inicio de sesiÃ³n exitoso',                      '192.168.1.22'),
  smt(264.3,A,'FIRMA_ETAPA',       EX, 'eval.tecnico@sanmiguel.gob.ar', 'Etapa "EvaluaciÃ³n TÃ©cnica" aprobada Â· EXP-2025-0142 Â· Sin observaciones', '192.168.1.22'),
  smt(265,  S,'LOGIN',             I,  'eval.documental@sanmiguel.gob.ar','Inicio de sesiÃ³n exitoso',                    '192.168.1.20'),
  smt(265.3,A,'FIRMA_ETAPA',       EX, 'eval.documental@sanmiguel.gob.ar','Etapa "RevisiÃ³n Documental" aprobada Â· EXP-2025-0142 Â· DocumentaciÃ³n completa', '192.168.1.20'),
  smt(266,  S,'LOGIN',             I,  'autoridad@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '10.0.0.5'),
  smt(266.5,A,'ADJUDICACION_DECLARADA',EX,'autoridad@sanmiguel.gob.ar', 'AdjudicaciÃ³n declarada Â· EXP-2025-0142 Â· Adjudicatario: Redes y Cableados SA Â· $638.000', '10.0.0.5'),

  // â”€â”€ DÃA 12 â€” AprobaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(288, S, 'LOGIN',             I,  'autoridad@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '10.0.0.5'),
  smt(288.3,A,'FIRMA_ETAPA',       EX, 'autoridad@sanmiguel.gob.ar',    'Etapa "Firma de Autoridad" aprobada Â· EXP-2025-0142',                   '10.0.0.5'),
  smt(289,  S,'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(289.3,A,'FIRMA_ETAPA',       EX, 'comprador@sanmiguel.gob.ar',    'Etapa "ImputaciÃ³n Presupuestaria" aprobada Â· EXP-2025-0142',            '192.168.1.15'),
  smt(289.5,A,'DOCUMENTO_GENERADO',EX, 'comprador@sanmiguel.gob.ar',    'ResoluciÃ³n de AdjudicaciÃ³n N.Â° 0142/2026 generada para EXP-2025-0142', '192.168.1.15'),
  smt(289.7,A,'DOCUMENTO_GENERADO',EX, 'comprador@sanmiguel.gob.ar',    'Orden de Compra N.Â° 0142/2026 generada para EXP-2025-0142',            '192.168.1.15'),

  // â”€â”€ DÃA 13 â€” PublicaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(312, S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesiÃ³n exitoso',                      '192.168.1.10'),
  smt(312.3,AP,'APROBACION_FINAL', EX, 'admin@sanmiguel.gob.ar',        'Proceso completado Â· EXP-2025-0142 publicado en Portal Ciudadano',      '192.168.1.10'),
  smt(312.4,AP,'NOTIFICACION_ADJUDICATARIO',EX,'sistema',               'NotificaciÃ³n electrÃ³nica enviada a Redes y Cableados SA â€” adjudicaciÃ³n EXP-2025-0142'),

  // â”€â”€ DÃA 15 â€” Nuevo expediente (segundo proceso en curso) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(360, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(360.3,C,'ALTA_EXPEDIENTE',   EX, 'comprador@sanmiguel.gob.ar',    'Expediente EXP-2025-0143 creado Â· "Servicio de Limpieza Edificios Municipales"', '192.168.1.15'),
  smt(361,  P,'VERIFICACION_ARCA', CR, 'comprador@sanmiguel.gob.ar',    'ARCA caÃ­do Â· 3 proveedores sin validar Â· Se recomienda activar contingencia', '192.168.1.15'),
  smt(361.1,P,'CONTINGENCIA_MANUAL',AD,'comprador@sanmiguel.gob.ar',    'Contingencia manual activada para 3 proveedores sin ARCA por caÃ­da del servicio', '192.168.1.15'),

  // â”€â”€ DÃA 18 â€” Auditor revisando logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(432, S, 'LOGIN',             I,  'auditor@sanmiguel.gob.ar',      'Inicio de sesiÃ³n exitoso',                      '192.168.1.30'),
  smt(432.3,S,'CONSULTA_AUDITORIA',I,  'auditor@sanmiguel.gob.ar',      'Consulta de bitÃ¡cora: filtro Trading Â· EXP-2025-0142',                  '192.168.1.30'),
  smt(432.5,S,'EXPORT_CSV',        I,  'auditor@sanmiguel.gob.ar',      'ExportaciÃ³n CSV generada Â· 80 eventos Â· filtro: TRADING',               '192.168.1.30'),
  smt(433,  S,'LOGOUT',            I,  'auditor@sanmiguel.gob.ar',      'Cierre de sesiÃ³n',                              '192.168.1.30'),

  // â”€â”€ DÃA 20 â€” Cambio de rol â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(480, U, 'CAMBIO_ROL',        AD, 'admin@sanmiguel.gob.ar',        'Rol modificado: usuario "temp@sanmiguel.gob.ar" de Consulta a Comprador Municipal', '192.168.1.10'),

  // â”€â”€ DÃA 25 â€” Nuevo proveedor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(600, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(600.3,P,'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Servicios Integrales Norte SA" registrado (CUIT 30-88765432-1)', '192.168.1.15'),
  smt(600.4,P,'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK Â· Servicios Integrales Norte SA Â· InscripciÃ³n activa',          '192.168.1.15'),
  smt(600.9,S,'LOGOUT',            I,  'comprador@sanmiguel.gob.ar',    'Cierre de sesiÃ³n',                              '192.168.1.15'),

  // â”€â”€ DÃA 28 â€” Actividad reciente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(672, S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesiÃ³n exitoso',                      '192.168.1.10'),
  smt(672.2,U,'BAJA_USUARIO',      CR, 'admin@sanmiguel.gob.ar',        'Usuario "temp@sanmiguel.gob.ar" deshabilitado por inactividad',         '192.168.1.10'),
  smt(672.5,S,'CAMBIO_CONFIG',     AD, 'admin@sanmiguel.gob.ar',        'ConfiguraciÃ³n de plantilla de Orden de Compra actualizada',             '192.168.1.10'),
  smt(673,  S,'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(673.3,C,'ALTA_EXPEDIENTE',   EX, 'comprador@sanmiguel.gob.ar',    'Expediente EXP-2025-0144 creado Â· "Compra de Mobiliario Oficinas Municipales"', '192.168.1.15'),

  // â”€â”€ DÃA 29-30 â€” Actividad de hoy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  smt(696, S, 'LOGIN',             I,  'eval.documental@sanmiguel.gob.ar','Inicio de sesiÃ³n exitoso',                    '192.168.1.20'),
  smt(696.3,P,'REVISION_DOCUMENTAL',EX,'eval.documental@sanmiguel.gob.ar','DocumentaciÃ³n aprobada Â· Servicios Integrales Norte SA',              '192.168.1.20'),
  smt(710, S, 'LOGIN',             I,  'auditor@sanmiguel.gob.ar',      'Inicio de sesiÃ³n exitoso',                      '192.168.1.30'),
  smt(710.2,S,'CONSULTA_AUDITORIA',I,  'auditor@sanmiguel.gob.ar',      'Consulta de bitÃ¡cora: Ãºltimos 30 dÃ­as Â· todos los mÃ³dulos',             '192.168.1.30'),
  smt(715, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesiÃ³n exitoso',                      '192.168.1.15'),
  smt(715.5,C,'MODIFICACION_EXPEDIENTE',I,'comprador@sanmiguel.gob.ar', 'Especificaciones tÃ©cnicas actualizadas para EXP-2025-0144',             '192.168.1.15'),

  // â”€â”€ Tenant SUNCHALES (aislado â€” nunca visible para sanmiguel) â”€â”€â”€â”€â”€â”€â”€â”€â”€
  sun(50,  S,  'LOGIN',             I,  'admin@sunchales.gob.ar',       'Inicio de sesiÃ³n',                              '10.20.0.5'),
  sun(100, P,  'ALTA_PROVEEDOR',    EX, 'comprador@sunchales.gob.ar',   'Proveedor "Acme SRL" registrado',               '10.20.0.6'),
  sun(200, T,  'LANCE_REGISTRADO',  EX, 'proveedor@acme.com',           'Lance $500.000 en subasta sunchales',           '190.88.77.66'),
  sun(300, A,  'ADJUDICACION_DECLARADA',EX,'autoridad@sunchales.gob.ar','AdjudicaciÃ³n EXP-2025-SC-001',                  '10.20.0.9'),
]

// Los eventos estÃ¡n en orden cronolÃ³gico en el array; se devuelven DESC
const TODOS_ORDENADOS = [...EVENTOS_MOCK].sort(
  (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
)

const delay_ms = (ms) => new Promise(res => setTimeout(res, ms))

function aplicarFiltros(eventos, filtros) {
  const { fechaDesde, fechaHasta, modulo, tipo, busqueda } = filtros
  return eventos.filter(ev => {
    if (fechaDesde && ev.timestamp < fechaDesde)   return false
    if (fechaHasta && ev.timestamp > fechaHasta + 'T23:59:59') return false
    if (modulo     && ev.modulo !== modulo)          return false
    if (tipo       && ev.tipo !== tipo)              return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !ev.usuario.toLowerCase().includes(q) &&
        !ev.descripcion.toLowerCase().includes(q) &&
        !ev.accion.toLowerCase().includes(q) &&
        !ev.ip.includes(q)
      ) return false
    }
    return true
  })
}

function calcularResumen(eventos) {
  const conteoModulo = {}
  let alertas = 0
  let criticos = 0
  for (const ev of eventos) {
    conteoModulo[ev.modulo] = (conteoModulo[ev.modulo] ?? 0) + 1
    if (ev.tipo === TIPOS.ADVERTENCIA) alertas++
    if (ev.tipo === TIPOS.CRITICO)     criticos++
  }
  const moduloTop = Object.entries(conteoModulo)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  return { totalEventos: eventos.length, moduloTop, alertas, criticos }
}

/**
 * Retorna eventos de auditorÃ­a filtrados por tenant (barrera primaria)
 * y luego por los filtros adicionales del usuario.
 */
export async function getEventosAuditoria(tenantId, filtros = {}) {
  await delay_ms(300)
  // â”€â”€ BARRERA PRIMARIA: tenant_id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const porTenant = TODOS_ORDENADOS.filter(ev => ev.tenant_id === tenantId)
  const eventos   = aplicarFiltros(porTenant, filtros)
  const resumen   = calcularResumen(eventos)
  return { eventos, resumen }
}

// Stub de escritura para mÃ³dulos que generan eventos (recepciÃ³n, etc.)
// En producciÃ³n: POST /api/auditoria. El mock no persiste (datos hardcodeados).
export async function logEventoExterno(_tenantId, _evento) {
  await delay_ms(50)
  return { ok: true }
}


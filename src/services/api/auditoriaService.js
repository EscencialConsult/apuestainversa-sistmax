/**
 * Servicio de Auditoría y Trazabilidad
 *
 * DIRECTIVA MULTI-TENANT: `tenant_id` es la primera barrera de filtrado.
 * Ningún municipio puede acceder a eventos de otro, ni por error de red.
 *
 * MOCK: los eventos se generan al cargar el módulo (Date.now() en scope de
 * módulo, no en render). Para producción: reemplazar getEventosAuditoria()
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
  [MODULOS.ADJUDICACION]: 'Adjudicación',
  [MODULOS.APROBACION]:   'Aprobación',
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))

// Base temporal: Date.now() se llama UNA VEZ al cargar el módulo (no en render)
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
  // ── DÍA 0 — Configuración inicial ────────────────────────────────────
  smt(0,   S, 'INICIO_SISTEMA',    EX, 'sistema',                       'Instancia SICST MAX iniciada correctamente para el tenant sanmiguel'),
  smt(0.1, S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesión exitoso',                      '192.168.1.10'),
  smt(0.2, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "comprador@sanmiguel.gob.ar" creado con rol Comprador Municipal'),
  smt(0.3, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "eval.tecnico@sanmiguel.gob.ar" creado con rol Evaluador Técnico'),
  smt(0.4, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "eval.documental@sanmiguel.gob.ar" creado con rol Evaluador Documental'),
  smt(0.5, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "autoridad@sanmiguel.gob.ar" creado con rol Autoridad Aprobadora'),
  smt(0.6, U, 'ALTA_USUARIO',      EX, 'admin@sanmiguel.gob.ar',        'Usuario "auditor@sanmiguel.gob.ar" creado con rol Auditor',             '192.168.1.10'),
  smt(0.9, S, 'LOGOUT',            I,  'admin@sanmiguel.gob.ar',        'Cierre de sesión',                              '192.168.1.10'),

  // ── DÍA 1 — Primeros logins ───────────────────────────────────────────
  smt(24,  S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(24.1,S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesión exitoso',                      '192.168.1.10'),
  smt(24.5,S, 'CAMBIO_CONFIG',     AD, 'admin@sanmiguel.gob.ar',        'Parámetro "DECREMENTO_MINIMO" actualizado: $5.000',                      '192.168.1.10'),
  smt(24.6,S, 'CAMBIO_CONFIG',     I,  'admin@sanmiguel.gob.ar',        'Parámetro "DURACION_SUBASTA_MS" actualizado: 300000ms',                  '192.168.1.10'),
  smt(25,  S, 'LOGOUT',            I,  'comprador@sanmiguel.gob.ar',    'Cierre de sesión',                              '192.168.1.15'),

  // ── DÍA 3 — Registro de proveedores ──────────────────────────────────
  smt(72,  S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(72.1,P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "TechSolutions SA" (CUIT 30-71122334-5) registrado',          '192.168.1.15'),
  smt(72.2,P, 'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK · TechSolutions SA · Inscripción activa',                       '192.168.1.15'),
  smt(72.4,P, 'CARGA_DOCUMENTO',   I,  'comprador@sanmiguel.gob.ar',    'PDF de constancia ARCA cargado para TechSolutions SA',                  '192.168.1.15'),
  smt(72.8,P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Redes y Cableados SA" (CUIT 30-71234567-8) registrado',      '192.168.1.15'),
  smt(72.9,P, 'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK · Redes y Cableados SA · Inscripción activa',                   '192.168.1.15'),

  smt(73,  P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Distribuidora del Tucumán" (CUIT 27-65432111-9) registrado', '192.168.1.15'),
  smt(73.1,P, 'VERIFICACION_ARCA', AD, 'comprador@sanmiguel.gob.ar',    'ARCA no disponible · Distribuidora del Tucumán · Activada contingencia manual', '192.168.1.15'),
  smt(73.2,P, 'CONTINGENCIA_MANUAL',AD,'comprador@sanmiguel.gob.ar',    'Proveedor "Distribuidora del Tucumán" ingresado vía contingencia. Queda en estado "En Revisión"', '192.168.1.15'),
  smt(73.3,P, 'CARGA_DOCUMENTO',   I,  'comprador@sanmiguel.gob.ar',    'Constancia AFIP manual cargada para Distribuidora del Tucumán',         '192.168.1.15'),

  smt(74,  P, 'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Insumos del Norte SRL" (CUIT 30-55098765-1) registrado',     '192.168.1.15'),
  smt(74.1,P, 'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK · Insumos del Norte SRL · Inscripción activa',                  '192.168.1.15'),

  // ── DÍA 4 — Evaluación documental ────────────────────────────────────
  smt(96,  S, 'LOGIN',             I,  'eval.documental@sanmiguel.gob.ar','Inicio de sesión exitoso',                    '192.168.1.20'),
  smt(96.1,P, 'REVISION_DOCUMENTAL',EX,'eval.documental@sanmiguel.gob.ar','Documentación aprobada · Distribuidora del Tucumán · Constancia ARCA en regla','192.168.1.20'),
  smt(96.3,P, 'CARGA_DOCUMENTO',   I,  'eval.documental@sanmiguel.gob.ar','Acta de revisión documental firmada cargada para Distribuidora del Tucumán','192.168.1.20'),
  smt(97,  S, 'LOGIN',             I,  'eval.tecnico@sanmiguel.gob.ar',  'Inicio de sesión exitoso',                    '192.168.1.22'),
  smt(97.5,P, 'OBSERVACION_DOCUMENTAL',AD,'eval.documental@sanmiguel.gob.ar','Se solicitó documentación adicional a Insumos del Norte SRL: balances contables','192.168.1.20'),
  smt(98,  P, 'CARGA_DOCUMENTO',   I,  'proveedor4@insumoscn.com',       'Balance contable 2024 cargado por Insumos del Norte SRL',              '200.55.11.22'),
  smt(98.5,P, 'REVISION_DOCUMENTAL',EX,'eval.documental@sanmiguel.gob.ar','Documentación aprobada · Insumos del Norte SRL · Sin observaciones',  '192.168.1.20'),

  // ── DÍA 5 — Alta de expediente de compra ─────────────────────────────
  smt(120, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(120.2,C,'ALTA_EXPEDIENTE',   EX, 'comprador@sanmiguel.gob.ar',    'Expediente EXP-2025-0142 creado · "Adquisición Equipamiento Informático"','192.168.1.15'),
  smt(120.5,C,'CARGA_PLIEGO',      I,  'comprador@sanmiguel.gob.ar',    'Pliego de Condiciones Particulares cargado para EXP-2025-0142',         '192.168.1.15'),
  smt(121,  C,'MODIFICACION_EXPEDIENTE',I,'comprador@sanmiguel.gob.ar', 'Monto base actualizado: $850.000 para EXP-2025-0142',                    '192.168.1.15'),
  smt(121.5,C,'CARGA_ESPECIFICACIONES',I,'eval.tecnico@sanmiguel.gob.ar','Especificaciones técnicas cargadas para EXP-2025-0142',                '192.168.1.22'),
  smt(122,  C,'APROBACION_TECNICA_PLIEGO',EX,'eval.tecnico@sanmiguel.gob.ar','Pliego aprobado técnicamente para EXP-2025-0142',                  '192.168.1.22'),

  // ── DÍA 6 — Publicación de subasta ───────────────────────────────────
  smt(144, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(144.3,C,'PUBLICACION_SUBASTA',EX,'comprador@sanmiguel.gob.ar',    'Subasta inversa publicada · EXP-2025-0142 · Inicio programado',         '192.168.1.15'),
  smt(144.4,P,'NOTIFICACION_PROVEEDOR',I,'sistema',                     'Notificación enviada a 4 proveedores habilitados para EXP-2025-0142'),
  smt(145, S, 'LOGOUT',            I,  'comprador@sanmiguel.gob.ar',    'Cierre de sesión',                              '192.168.1.15'),

  // ── DÍA 8 — Intento de login fallido (seguridad) ─────────────────────
  smt(192, S, 'LOGIN_FALLIDO',     CR, 'desconocido',                   'Intento de acceso con credenciales inválidas (3er intento) · IP bloqueada', '203.0.113.45'),
  smt(192.1,S,'BLOQUEO_IP',        CR, 'sistema',                       'IP 203.0.113.45 bloqueada por exceso de intentos fallidos'),
  smt(192.5,S,'LOGIN',             I,  'auditor@sanmiguel.gob.ar',      'Inicio de sesión exitoso',                      '192.168.1.30'),
  smt(192.6,C,'CONSULTA_EXPEDIENTE',I, 'auditor@sanmiguel.gob.ar',      'Consulta de expediente EXP-2025-0142',           '192.168.1.30'),

  // ── DÍA 10 — Acceso anticipado a la sala de trading ──────────────────
  smt(240, S, 'LOGIN',             I,  'proveedor1@techsolutions.com',  'Inicio de sesión exitoso',                      '201.45.67.89'),
  smt(240.1,T,'ACCESO_SALA',       I,  'proveedor1@techsolutions.com',  'Ingreso al Trading Room · EXP-2025-0142',        '201.45.67.89'),
  smt(240.2,S,'LOGIN',             I,  'proveedor2@redescableados.com', 'Inicio de sesión exitoso',                      '200.55.11.22'),
  smt(240.3,T,'ACCESO_SALA',       I,  'proveedor2@redescableados.com', 'Ingreso al Trading Room · EXP-2025-0142',        '200.55.11.22'),
  smt(240.4,S,'LOGIN',             I,  'proveedor3@distribuidora.com',  'Inicio de sesión exitoso',                      '186.33.44.55'),
  smt(240.5,T,'ACCESO_SALA',       I,  'proveedor3@distribuidora.com',  'Ingreso al Trading Room · EXP-2025-0142',        '186.33.44.55'),
  smt(240.6,S,'LOGIN',             I,  'proveedor4@insumoscn.com',      'Inicio de sesión exitoso',                      '200.55.11.22'),
  smt(240.7,T,'ACCESO_SALA',       I,  'proveedor4@insumoscn.com',      'Ingreso al Trading Room · EXP-2025-0142',        '190.22.33.44'),
  smt(240.8,S,'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso (modo monitoreo)',      '192.168.1.15'),
  smt(240.9,T,'ACCESO_SALA',       I,  'comprador@sanmiguel.gob.ar',    'Ingreso al Trading Room · EXP-2025-0142 · Modo solo lectura', '192.168.1.15'),

  // ── DÍA 10 — Sesión de subasta (Trading Room — ~80 eventos en 5min) ──
  smt(241,    T,'INICIO_SUBASTA',  EX, 'sistema',                       'Subasta inversa iniciada · EXP-2025-0142 · Base: $850.000'),
  smt(241.083,T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $820.000 (−$30.000 / −3.5%)',  '201.45.67.89'),
  smt(241.167,T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $810.000 (−$10.000 / −1.2%)',  '200.55.11.22'),
  smt(241.25, T,'LANCE_REGISTRADO',EX, 'Distribuidora del Tucumán',     'Lance registrado: $800.000 (−$10.000 / −1.2%)',  '186.33.44.55'),
  smt(241.33, T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $790.000 (−$10.000 / −1.3%)',  '190.22.33.44'),
  smt(241.42, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $775.000 (−$15.000 / −1.9%)',  '201.45.67.89'),
  smt(241.5,  T,'LANCE_INVALIDO',  AD, 'Distribuidora del Tucumán',     'Lance rechazado: $780.000 — supera el mínimo permitido ($770.000)',      '186.33.44.55'),
  smt(241.58, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $760.000 (−$15.000 / −1.9%)',  '200.55.11.22'),
  smt(241.67, T,'LANCE_REGISTRADO',EX, 'Distribuidora del Tucumán',     'Lance registrado: $750.000 (−$10.000 / −1.3%)',  '186.33.44.55'),
  smt(241.75, T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $735.000 (−$15.000 / −2.0%)',  '190.22.33.44'),
  smt(241.83, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $725.000 (−$10.000 / −1.4%)',  '201.45.67.89'),
  smt(241.92, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $715.000 (−$10.000 / −1.4%)',  '200.55.11.22'),
  smt(242,    T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $700.000 (−$15.000 / −2.1%)',  '190.22.33.44'),
  smt(242.08, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $690.000 (−$10.000 / −1.4%)',  '201.45.67.89'),
  smt(242.17, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $680.000 (−$10.000 / −1.5%)',  '200.55.11.22'),
  smt(242.25, T,'LANCE_REGISTRADO',EX, 'Distribuidora del Tucumán',     'Lance registrado: $670.000 (−$10.000 / −1.5%)',  '186.33.44.55'),
  smt(242.33, T,'LANCE_INVALIDO',  AD, 'TechSolutions SA',              'Lance rechazado: $675.000 — supera el mínimo permitido ($665.000)',      '201.45.67.89'),
  smt(242.42, T,'LANCE_REGISTRADO',EX, 'Insumos del Norte SRL',         'Lance registrado: $660.000 (−$10.000 / −1.5%)',  '190.22.33.44'),
  smt(242.5,  T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $650.000 (−$10.000 / −1.5%)',  '200.55.11.22'),
  smt(242.58, T,'LANCE_REGISTRADO',EX, 'TechSolutions SA',              'Lance registrado: $645.000 (−$5.000 / −0.8%)',   '201.45.67.89'),
  smt(242.67, T,'EXTENSION_ANTI_SNIPER',AD,'sistema',                   'Lance en ventana anti-sniper · Reloj extendido +3:00 min · Redes y Cableados SA', '200.55.11.22'),
  smt(242.75, T,'LANCE_REGISTRADO',EX, 'Redes y Cableados SA',          'Lance registrado: $638.000 (−$7.000 / −1.1%) · Lance final',            '200.55.11.22'),
  smt(242.9,  T,'CIERRE_SUBASTA',  EX, 'sistema',                       'Subasta cerrada · EXP-2025-0142 · Mejor oferta: $638.000 · Ahorro: 24.9%'),

  // ── DÍA 11 — Adjudicación ─────────────────────────────────────────────
  smt(264, S, 'LOGIN',             I,  'eval.tecnico@sanmiguel.gob.ar', 'Inicio de sesión exitoso',                      '192.168.1.22'),
  smt(264.3,A,'FIRMA_ETAPA',       EX, 'eval.tecnico@sanmiguel.gob.ar', 'Etapa "Evaluación Técnica" aprobada · EXP-2025-0142 · Sin observaciones', '192.168.1.22'),
  smt(265,  S,'LOGIN',             I,  'eval.documental@sanmiguel.gob.ar','Inicio de sesión exitoso',                    '192.168.1.20'),
  smt(265.3,A,'FIRMA_ETAPA',       EX, 'eval.documental@sanmiguel.gob.ar','Etapa "Revisión Documental" aprobada · EXP-2025-0142 · Documentación completa', '192.168.1.20'),
  smt(266,  S,'LOGIN',             I,  'autoridad@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '10.0.0.5'),
  smt(266.5,A,'ADJUDICACION_DECLARADA',EX,'autoridad@sanmiguel.gob.ar', 'Adjudicación declarada · EXP-2025-0142 · Adjudicatario: Redes y Cableados SA · $638.000', '10.0.0.5'),

  // ── DÍA 12 — Aprobación ───────────────────────────────────────────────
  smt(288, S, 'LOGIN',             I,  'autoridad@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '10.0.0.5'),
  smt(288.3,A,'FIRMA_ETAPA',       EX, 'autoridad@sanmiguel.gob.ar',    'Etapa "Firma de Autoridad" aprobada · EXP-2025-0142',                   '10.0.0.5'),
  smt(289,  S,'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(289.3,A,'FIRMA_ETAPA',       EX, 'comprador@sanmiguel.gob.ar',    'Etapa "Imputación Presupuestaria" aprobada · EXP-2025-0142',            '192.168.1.15'),
  smt(289.5,A,'DOCUMENTO_GENERADO',EX, 'comprador@sanmiguel.gob.ar',    'Resolución de Adjudicación N.° 0142/2026 generada para EXP-2025-0142', '192.168.1.15'),
  smt(289.7,A,'DOCUMENTO_GENERADO',EX, 'comprador@sanmiguel.gob.ar',    'Orden de Compra N.° 0142/2026 generada para EXP-2025-0142',            '192.168.1.15'),

  // ── DÍA 13 — Publicación ──────────────────────────────────────────────
  smt(312, S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesión exitoso',                      '192.168.1.10'),
  smt(312.3,AP,'APROBACION_FINAL', EX, 'admin@sanmiguel.gob.ar',        'Proceso completado · EXP-2025-0142 publicado en Portal Ciudadano',      '192.168.1.10'),
  smt(312.4,AP,'NOTIFICACION_ADJUDICATARIO',EX,'sistema',               'Notificación electrónica enviada a Redes y Cableados SA — adjudicación EXP-2025-0142'),

  // ── DÍA 15 — Nuevo expediente (segundo proceso en curso) ─────────────
  smt(360, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(360.3,C,'ALTA_EXPEDIENTE',   EX, 'comprador@sanmiguel.gob.ar',    'Expediente EXP-2025-0143 creado · "Servicio de Limpieza Edificios Municipales"', '192.168.1.15'),
  smt(361,  P,'VERIFICACION_ARCA', CR, 'comprador@sanmiguel.gob.ar',    'ARCA caído · 3 proveedores sin validar · Se recomienda activar contingencia', '192.168.1.15'),
  smt(361.1,P,'CONTINGENCIA_MANUAL',AD,'comprador@sanmiguel.gob.ar',    'Contingencia manual activada para 3 proveedores sin ARCA por caída del servicio', '192.168.1.15'),

  // ── DÍA 18 — Auditor revisando logs ──────────────────────────────────
  smt(432, S, 'LOGIN',             I,  'auditor@sanmiguel.gob.ar',      'Inicio de sesión exitoso',                      '192.168.1.30'),
  smt(432.3,S,'CONSULTA_AUDITORIA',I,  'auditor@sanmiguel.gob.ar',      'Consulta de bitácora: filtro Trading · EXP-2025-0142',                  '192.168.1.30'),
  smt(432.5,S,'EXPORT_CSV',        I,  'auditor@sanmiguel.gob.ar',      'Exportación CSV generada · 80 eventos · filtro: TRADING',               '192.168.1.30'),
  smt(433,  S,'LOGOUT',            I,  'auditor@sanmiguel.gob.ar',      'Cierre de sesión',                              '192.168.1.30'),

  // ── DÍA 20 — Cambio de rol ────────────────────────────────────────────
  smt(480, U, 'CAMBIO_ROL',        AD, 'admin@sanmiguel.gob.ar',        'Rol modificado: usuario "temp@sanmiguel.gob.ar" de Consulta a Comprador Municipal', '192.168.1.10'),

  // ── DÍA 25 — Nuevo proveedor ─────────────────────────────────────────
  smt(600, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(600.3,P,'ALTA_PROVEEDOR',    EX, 'comprador@sanmiguel.gob.ar',    'Proveedor "Servicios Integrales Norte SA" registrado (CUIT 30-88765432-1)', '192.168.1.15'),
  smt(600.4,P,'VERIFICACION_ARCA', EX, 'comprador@sanmiguel.gob.ar',    'ARCA OK · Servicios Integrales Norte SA · Inscripción activa',          '192.168.1.15'),
  smt(600.9,S,'LOGOUT',            I,  'comprador@sanmiguel.gob.ar',    'Cierre de sesión',                              '192.168.1.15'),

  // ── DÍA 28 — Actividad reciente ───────────────────────────────────────
  smt(672, S, 'LOGIN',             I,  'admin@sanmiguel.gob.ar',        'Inicio de sesión exitoso',                      '192.168.1.10'),
  smt(672.2,U,'BAJA_USUARIO',      CR, 'admin@sanmiguel.gob.ar',        'Usuario "temp@sanmiguel.gob.ar" deshabilitado por inactividad',         '192.168.1.10'),
  smt(672.5,S,'CAMBIO_CONFIG',     AD, 'admin@sanmiguel.gob.ar',        'Configuración de plantilla de Orden de Compra actualizada',             '192.168.1.10'),
  smt(673,  S,'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(673.3,C,'ALTA_EXPEDIENTE',   EX, 'comprador@sanmiguel.gob.ar',    'Expediente EXP-2025-0144 creado · "Compra de Mobiliario Oficinas Municipales"', '192.168.1.15'),

  // ── DÍA 29-30 — Actividad de hoy ─────────────────────────────────────
  smt(696, S, 'LOGIN',             I,  'eval.documental@sanmiguel.gob.ar','Inicio de sesión exitoso',                    '192.168.1.20'),
  smt(696.3,P,'REVISION_DOCUMENTAL',EX,'eval.documental@sanmiguel.gob.ar','Documentación aprobada · Servicios Integrales Norte SA',              '192.168.1.20'),
  smt(710, S, 'LOGIN',             I,  'auditor@sanmiguel.gob.ar',      'Inicio de sesión exitoso',                      '192.168.1.30'),
  smt(710.2,S,'CONSULTA_AUDITORIA',I,  'auditor@sanmiguel.gob.ar',      'Consulta de bitácora: últimos 30 días · todos los módulos',             '192.168.1.30'),
  smt(715, S, 'LOGIN',             I,  'comprador@sanmiguel.gob.ar',    'Inicio de sesión exitoso',                      '192.168.1.15'),
  smt(715.5,C,'MODIFICACION_EXPEDIENTE',I,'comprador@sanmiguel.gob.ar', 'Especificaciones técnicas actualizadas para EXP-2025-0144',             '192.168.1.15'),

  // ── Tenant SUNCHALES (aislado — nunca visible para sanmiguel) ─────────
  sun(50,  S,  'LOGIN',             I,  'admin@sunchales.gob.ar',       'Inicio de sesión',                              '10.20.0.5'),
  sun(100, P,  'ALTA_PROVEEDOR',    EX, 'comprador@sunchales.gob.ar',   'Proveedor "Acme SRL" registrado',               '10.20.0.6'),
  sun(200, T,  'LANCE_REGISTRADO',  EX, 'proveedor@acme.com',           'Lance $500.000 en subasta sunchales',           '190.88.77.66'),
  sun(300, A,  'ADJUDICACION_DECLARADA',EX,'autoridad@sunchales.gob.ar','Adjudicación EXP-2025-SC-001',                  '10.20.0.9'),
]

// Los eventos están en orden cronológico en el array; se devuelven DESC
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
 * Retorna eventos de auditoría filtrados por tenant (barrera primaria)
 * y luego por los filtros adicionales del usuario.
 */
export async function getEventosAuditoria(tenantId, filtros = {}) {
  await delay_ms(300)
  // ── BARRERA PRIMARIA: tenant_id ────────────────────────────────────────
  const porTenant = TODOS_ORDENADOS.filter(ev => ev.tenant_id === tenantId)
  const eventos   = aplicarFiltros(porTenant, filtros)
  const resumen   = calcularResumen(eventos)
  return { eventos, resumen }
}

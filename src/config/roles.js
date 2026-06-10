/**
 * Roles del sistema — fuente única de verdad.
 * Vive fuera de AuthContext para que config/navigation.js y otros módulos
 * puedan importarlo sin acoplarse al contexto de React (y sin romper
 * Fast Refresh, que exige que los archivos de componentes solo exporten componentes).
 */
export const ROLES = {
  ADMIN:            'admin',
  COMPRADOR:        'comprador',
  PROVEEDOR:        'proveedor',
  EVAL_DOCUMENTAL:  'evaluador_documental',
  EVAL_TECNICO:     'evaluador_tecnico',
  AUDITOR:          'auditor',
  AUTORIDAD:        'autoridad_aprobadora',
  CONSULTA:         'usuario_consulta',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]:           'Administrador',
  [ROLES.COMPRADOR]:       'Comprador Municipal',
  [ROLES.PROVEEDOR]:       'Proveedor',
  [ROLES.EVAL_DOCUMENTAL]: 'Evaluador Documental',
  [ROLES.EVAL_TECNICO]:    'Evaluador Técnico',
  [ROLES.AUDITOR]:         'Auditor',
  [ROLES.AUTORIDAD]:       'Autoridad Aprobadora',
  [ROLES.CONSULTA]:        'Usuario de Consulta',
}

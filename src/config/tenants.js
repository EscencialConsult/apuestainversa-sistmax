/**
 * Registro de tenants registrados en el sistema.
 * Cada tenant define su identidad visual completa.
 * NUNCA hardcodear colores fuera de este archivo.
 */

export const TENANTS = {
  'san-miguel-tucuman': {
    id:          'san-miguel-tucuman',
    name:        'Municipio de San Miguel de Tucumán',
    shortName:   'SMT',
    logoUrl:     null, // ruta dinámica: /tenants/san-miguel-tucuman/logo.svg
    faviconUrl:  null,
    theme: {
      // Valores en formato "R G B" para composición con alpha en Tailwind
      '--color-primary':   '0 212 255',    // cyan neón
      '--color-secondary': '139 92 246',   // violeta
      '--color-accent':    '236 72 153',   // fucsia
      '--color-success':   '34 197 94',    // verde
      '--color-warning':   '234 179 8',    // amarillo
      '--color-danger':    '239 68 68',    // rojo
      '--color-bg':        '3 7 18',       // negro profundo
      '--color-surface':   '10 18 40',     // azul muy oscuro
      '--color-border':    '30 50 90',     // borde sutil
      '--color-text':      '226 232 240',  // gris claro
      '--color-muted':     '100 116 139',  // gris medio
      '--font-sans':       'Inter',
      '--font-mono':       'JetBrains Mono',
      '--radius-glass':    '1rem',
      '--blur-glass':      '16px',
    },
  },

  'demo': {
    id:          'demo',
    name:        'Municipio Demo',
    shortName:   'DEMO',
    logoUrl:     null,
    faviconUrl:  null,
    theme: {
      '--color-primary':   '52 211 153',   // esmeralda neón
      '--color-secondary': '99 102 241',   // indigo
      '--color-accent':    '251 191 36',   // ámbar
      '--color-success':   '34 197 94',
      '--color-warning':   '234 179 8',
      '--color-danger':    '239 68 68',
      '--color-bg':        '2 8 15',
      '--color-surface':   '8 20 30',
      '--color-border':    '20 40 60',
      '--color-text':      '226 232 240',
      '--color-muted':     '100 116 139',
      '--font-sans':       'Inter',
      '--font-mono':       'JetBrains Mono',
      '--radius-glass':    '0.75rem',
      '--blur-glass':      '12px',
    },
  },
}

export const DEFAULT_TENANT_ID = 'san-miguel-tucuman'

/**
 * Resolución oficial del tenant: por subdominio (ej. smt.sicst.app → "smt").
 * En desarrollo (localhost / IP) cae a: ?tenant=<id> → localStorage dev → default.
 * El backend SIEMPRE revalida el tenant_id; esto es solo para la UI.
 */
export function resolveTenantId() {
  const host = window.location.hostname
  const isLocal = host === 'localhost' || /^[\d.]+$/.test(host)
  const parts = host.split('.')

  if (!isLocal && parts.length >= 3) {
    return parts[0]
  }

  const fromQuery = new URLSearchParams(window.location.search).get('tenant')
  return fromQuery || localStorage.getItem('sicst_tenant_dev') || DEFAULT_TENANT_ID
}

/**
 * Registro de tenants registrados en el sistema.
 * Cada tenant define su identidad visual completa.
 * NUNCA hardcodear colores fuera de este archivo.
 */

export const TENANTS = {
  // Tenant canónico: subdominio 'sanmiguel' en producción (sanmiguel.sicst.app)
  'sanmiguel': {
    id:          'sanmiguel',
    name:        'Municipio de San Miguel de Tucumán',
    shortName:   'SMT',
    logoUrl:     null, // ruta dinámica: /tenants/san-miguel-tucuman/logo.svg
    faviconUrl:  null,
    theme: {
      // Valores en formato "R G B" para composición con alpha en Tailwind
      // Paleta oficial ONE: https://one.com.ar/brand
      '--color-primary':   '107 225 227',  // #6be1e3 — ONE cyan
      '--color-secondary': '225 123 215',  // #e17bd7 — ONE pink/magenta
      '--color-accent':    '228 199 106',  // #e4c76a — ONE gold
      '--color-success':   '74 222 128',   // verde esmeralda
      '--color-warning':   '250 204 21',   // amarillo vivo
      '--color-danger':    '248 113 113',  // rojo suave
      '--color-bg':        '26 24 29',     // #1a181d — ONE dark
      '--color-surface':   '36 33 44',     // ligeramente más claro, leve tinte púrpura
      '--color-border':    '68 64 80',     // borde visible pero sutil
      '--color-text':      '254 254 255',  // #fefeff — ONE near-white
      '--color-muted':     '164 168 192',  // #a4a8c0 — ONE cool gray
      '--font-display':    'Exo 2',
      '--font-subtitle':   'Josefin Sans',
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
      '--color-primary':   '228 199 106',  // #e4c76a — ONE gold como primario para demo
      '--color-secondary': '107 225 227',  // #6be1e3 — ONE cyan
      '--color-accent':    '225 123 215',  // #e17bd7 — ONE pink
      '--color-success':   '74 222 128',
      '--color-warning':   '250 204 21',
      '--color-danger':    '248 113 113',
      '--color-bg':        '26 24 29',     // #1a181d — ONE dark
      '--color-surface':   '36 33 44',
      '--color-border':    '68 64 80',
      '--color-text':      '254 254 255',  // #fefeff
      '--color-muted':     '164 168 192',  // #a4a8c0
      '--font-display':    'Exo 2',
      '--font-subtitle':   'Josefin Sans',
      '--font-sans':       'Inter',
      '--font-mono':       'JetBrains Mono',
      '--radius-glass':    '0.75rem',
      '--blur-glass':      '12px',
    },
  },
}

export const DEFAULT_TENANT_ID = 'sanmiguel'

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

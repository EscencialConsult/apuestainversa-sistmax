/**
 * Simulador de JWT para desarrollo SIN backend.
 * Genera tokens con la estructura real (header.payload.signature) firmando
 * tenant_id + rol, para que el flujo de auth no cambie cuando llegue la API.
 *
 * ⚠️ La "firma" es un placeholder: NO usar en producción.
 */

const b64url = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const b64urlDecode = (str) => {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(decodeURIComponent(escape(atob(padded))))
}

export function signFakeJwt(payload, expMinutes = 480) {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'none', typ: 'JWT' }
  const body = { ...payload, iat: now, exp: now + expMinutes * 60 }
  return `${b64url(header)}.${b64url(body)}.dev-signature`
}

/** Devuelve el payload si el token es válido y no expiró; null en caso contrario. */
export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = b64urlDecode(parts[1])
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

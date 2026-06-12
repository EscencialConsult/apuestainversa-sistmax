import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { ServerOff } from 'lucide-react'
import { TENANTS, resolveTenantId } from '../config/tenants'

const TenantContext = createContext(null)

// URL base de la API — resuelta en build time por Vite desde .env.production
const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

// ── Capa de datos (fetch fuera del efecto — evita race conditions en StrictMode) ──

async function cargarBranding(id) {
  const res = await fetch(`${API_BASE}/tenants/${id}/branding`)
  if (res.status === 404) return { ok: false, status: 404 }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return { ok: true, data }
}

// ── Helpers DOM ───────────────────────────────────────────────────────────────

function applyTheme(theme) {
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => root.style.setProperty(key, value))
}

function applyMeta(data) {
  document.documentElement.classList.add('dark')
  document.title = `INVERSA.Bid — ${data.shortName}`
  if (data.faviconUrl) {
    const link = document.querySelector("link[rel~='icon']")
    if (link) link.href = data.faviconUrl
  }
}

// ── Reducer ───────────────────────────────────────────────────────────────────

const initial = { tenant: null, tenantId: null, estado: 'cargando' }

function reducer(state, action) {
  switch (action.type) {
    case 'CARGADO':      return { tenant: action.tenant, tenantId: action.tenantId, estado: 'ok' }
    case 'NO_ENCONTRADO': return { ...state, tenantId: action.tenantId, estado: 'no_encontrado' }
    default:             return state
  }
}

// ── Pantallas de bloqueo (sin variables CSS del tenant — usan Tailwind base) ──

function TenantLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />
    </div>
  )
}

function TenantNotFound({ tenantId }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#030712] text-slate-200 px-6 text-center">
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
        <ServerOff className="w-10 h-10 text-red-400" />
      </div>
      <h1 className="text-xl font-bold">404 — Tenant No Encontrado</h1>
      <p className="text-sm text-slate-400 max-w-md">
        El municipio <span className="font-mono text-red-400">"{tenantId}"</span> no está
        registrado en esta instancia de INVERSA.Bid. Verificá la URL o contactá al administrador del sistema.
      </p>
    </div>
  )
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function TenantProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    let cancelado = false
    const id = resolveTenantId()

    cargarBranding(id)
      .then(result => {
        if (cancelado) return
        if (!result.ok) {
          // API no tiene el tenant → fallback a config local (dev + previews sin backend)
          if (TENANTS[id]) {
            const local = TENANTS[id]
            applyTheme(local.theme)
            applyMeta(local)
            dispatch({ type: 'CARGADO', tenant: local, tenantId: id })
          } else {
            dispatch({ type: 'NO_ENCONTRADO', tenantId: id })
          }
          return
        }
        applyTheme(result.data.theme)
        applyMeta(result.data)
        dispatch({ type: 'CARGADO', tenant: result.data, tenantId: id })
      })
      .catch(() => {
        if (cancelado) return
        // Red caída o respuesta no-JSON (ej: Netlify redirige /api/* al index.html)
        // → fallback a config local si el tenant existe
        if (TENANTS[id]) {
          const local = TENANTS[id]
          applyTheme(local.theme)
          applyMeta(local)
          dispatch({ type: 'CARGADO', tenant: local, tenantId: id })
        } else {
          dispatch({ type: 'NO_ENCONTRADO', tenantId: id })
        }
      })

    return () => { cancelado = true }
  }, [])

  // Memoizado: un value inline re-renderizaría cada consumidor en cada render del provider
  const value = useMemo(
    () => ({ tenant: state.tenant, tenantId: state.tenantId }),
    [state.tenant, state.tenantId],
  )

  // Directiva arquitectónica: bloquear el App Shell hasta que las variables
  // CSS del tenant estén inyectadas en :root — evita FOUC
  if (state.estado === 'cargando')     return <TenantLoader />
  if (state.estado !== 'ok')           return <TenantNotFound tenantId={state.tenantId ?? '??'} />

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used inside TenantProvider')
  return ctx
}

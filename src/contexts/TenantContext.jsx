import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { ServerOff } from 'lucide-react'
import { TENANTS, resolveTenantId } from '../config/tenants'

const TenantContext = createContext(null)

function applyTheme(theme) {
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

/** Error fatal: el subdominio no corresponde a ningún municipio registrado. */
function TenantNotFound({ tenantId }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#03070f] text-slate-200 px-6 text-center">
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
        <ServerOff className="w-10 h-10 text-red-400" />
      </div>
      <h1 className="text-xl font-bold">404 — Tenant No Encontrado</h1>
      <p className="text-sm text-slate-400 max-w-md">
        El municipio <span className="font-mono text-red-400">"{tenantId}"</span> no está
        registrado en esta instancia de SICST MAX. Verifique la URL o contacte al administrador del sistema.
      </p>
    </div>
  )
}

export function TenantProvider({ children }) {
  // El tenant se resuelve UNA vez al arranque, desde el subdominio.
  const [tenantId, setTenantId] = useState(resolveTenantId)
  const tenant = TENANTS[tenantId] ?? null

  useEffect(() => {
    if (!tenant) return
    applyTheme(tenant.theme)
    document.documentElement.classList.add('dark')
    if (tenant.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']")
      if (link) link.href = tenant.faviconUrl
    }
    document.title = `SICST MAX — ${tenant.shortName}`
  }, [tenant])

  // Solo para desarrollo: en producción el tenant lo fija el subdominio.
  const switchTenant = useCallback((id) => {
    if (!TENANTS[id]) return
    localStorage.setItem('sicst_tenant_dev', id)
    setTenantId(id)
  }, [])

  // Memoizado: controla el theming Neon-Glass de toda la UI; un value inline
  // re-renderizaría cada consumidor en cada render del provider.
  const value = useMemo(
    () => ({ tenant, tenantId, switchTenant, availableTenants: TENANTS }),
    [tenant, tenantId, switchTenant],
  )

  if (!tenant) {
    return <TenantNotFound tenantId={tenantId} />
  }

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

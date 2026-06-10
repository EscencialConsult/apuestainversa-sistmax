import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TenantProvider } from './contexts/TenantContext'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { getAllowedRoles } from './config/navigation'

// Code-splitting por módulo: cada página es un chunk independiente.
// lazy() requiere default export; las páginas usan named exports → .then()
const lazyPage = (loader, name) =>
  lazy(() => loader().then(m => ({ default: m[name] })))

const LoginPage         = lazyPage(() => import('./pages/auth/LoginPage'), 'LoginPage')
const UnauthorizedPage  = lazyPage(() => import('./pages/auth/UnauthorizedPage'), 'UnauthorizedPage')
const NotFoundPage      = lazyPage(() => import('./pages/NotFoundPage'), 'NotFoundPage')
const DashboardPage     = lazyPage(() => import('./pages/dashboard/DashboardPage'), 'DashboardPage')
const UsuariosPage      = lazyPage(() => import('./pages/usuarios/UsuariosPage'), 'UsuariosPage')
const ProveedoresPage   = lazyPage(() => import('./pages/proveedores/ProveedoresPage'), 'ProveedoresPage')
const NuevoProveedorPage= lazyPage(() => import('./pages/proveedores/NuevoProveedorPage'), 'NuevoProveedorPage')
const ArcaPage          = lazyPage(() => import('./pages/proveedores/ArcaPage'), 'ArcaPage')
const ComprasPage       = lazyPage(() => import('./pages/compras/ComprasPage'), 'ComprasPage')
const NuevaCompraPage   = lazyPage(() => import('./pages/compras/NuevaCompraPage'), 'NuevaCompraPage')
const TradingRoomPage   = lazyPage(() => import('./pages/compras/TradingRoomPage'), 'TradingRoomPage')
const DetalleCompraPage = lazyPage(() => import('./pages/compras/DetalleCompraPage'), 'DetalleCompraPage')
const DocumentosPage    = lazyPage(() => import('./pages/documentos/DocumentosPage'), 'DocumentosPage')
const AdjudicacionPage  = lazyPage(() => import('./pages/adjudicacion/AdjudicacionPage'), 'AdjudicacionPage')
const AprobacionPage    = lazyPage(() => import('./pages/aprobacion/AprobacionPage'), 'AprobacionPage')
const AuditoriaPage     = lazyPage(() => import('./pages/auditoria/AuditoriaPage'), 'AuditoriaPage')
const PortalPage        = lazyPage(() => import('./pages/portal/PortalPage'), 'PortalPage')

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" />
    </div>
  )
}

/** Ruta protegida cuyos roles permitidos se derivan de config/navigation.js */
function Guarded({ path, children }) {
  return (
    <ProtectedRoute allowedRoles={getAllowedRoles(path)}>
      {children}
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <TenantProvider>
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Pública */}
                <Route path="/login" element={<LoginPage />} />

                {/* Privadas: requieren sesión; el rol se valida por ruta */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="/usuarios" element={<Guarded path="/usuarios"><UsuariosPage /></Guarded>} />

                    <Route path="/proveedores" element={<Guarded path="/proveedores"><ProveedoresPage /></Guarded>} />
                    <Route path="/proveedores/nuevo" element={<Guarded path="/proveedores/nuevo"><NuevoProveedorPage /></Guarded>} />
                    <Route path="/proveedores/arca" element={<Guarded path="/proveedores/arca"><ArcaPage /></Guarded>} />

                    <Route path="/compras" element={<Guarded path="/compras"><ComprasPage /></Guarded>} />
                    <Route path="/compras/nueva" element={<Guarded path="/compras/nueva"><NuevaCompraPage /></Guarded>} />
                    <Route path="/compras/trading" element={<Guarded path="/compras/trading"><TradingRoomPage /></Guarded>} />
                    <Route path="/compras/:id" element={<Guarded path="/compras"><DetalleCompraPage /></Guarded>} />

                    <Route path="/documentos" element={<Guarded path="/documentos"><DocumentosPage /></Guarded>} />
                    <Route path="/adjudicacion" element={<Guarded path="/adjudicacion"><AdjudicacionPage /></Guarded>} />
                    <Route path="/aprobacion" element={<Guarded path="/aprobacion"><AprobacionPage /></Guarded>} />
                    <Route path="/auditoria" element={<Guarded path="/auditoria"><AuditoriaPage /></Guarded>} />
                    <Route path="/portal" element={<PortalPage />} />

                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    {/* Comodín: cualquier ruta desconocida → 404 amigable */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TenantProvider>
  )
}

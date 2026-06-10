import {
  LayoutDashboard, Users, Building2, ShoppingCart,
  FileText, Award, CheckCircle, Shield, Globe,
} from 'lucide-react'
import { ROLES } from './roles'

/**
 * Fuente ÚNICA de verdad para navegación y permisos por módulo.
 * - El Sidebar la usa para renderizar el menú filtrado por rol.
 * - App.jsx la usa (vía getAllowedRoles) para proteger las rutas.
 * - allowedRoles: [] = cualquier usuario autenticado.
 * - children heredan los roles del padre salvo que declaren los propios.
 */
export const NAV_ITEMS = [
  {
    id:    'dashboard',
    label: 'Panel de Control',
    icon:  LayoutDashboard,
    path:  '/dashboard',
    allowedRoles: [],
  },
  {
    id:    'usuarios',
    label: 'Usuarios y Roles',
    icon:  Users,
    path:  '/usuarios',
    allowedRoles: [ROLES.ADMIN],
  },
  {
    id:    'proveedores',
    label: 'Proveedores',
    icon:  Building2,
    path:  '/proveedores',
    allowedRoles: [ROLES.ADMIN, ROLES.COMPRADOR, ROLES.EVAL_DOCUMENTAL],
    children: [
      { id: 'proveedores-lista', label: 'Listado',            path: '/proveedores' },
      { id: 'proveedores-nuevo', label: 'Alta de Proveedor',  path: '/proveedores/nuevo',
        allowedRoles: [ROLES.ADMIN, ROLES.COMPRADOR] },
      { id: 'proveedores-arca',  label: 'Verificación ARCA',  path: '/proveedores/arca',
        allowedRoles: [ROLES.ADMIN, ROLES.EVAL_DOCUMENTAL] },
    ],
  },
  {
    id:    'compras',
    label: 'Gestión de Compras',
    icon:  ShoppingCart,
    path:  '/compras',
    allowedRoles: [ROLES.ADMIN, ROLES.COMPRADOR],
    children: [
      { id: 'compras-lista',   label: 'Expedientes',  path: '/compras' },
      { id: 'compras-nueva',   label: 'Nueva Compra', path: '/compras/nueva' },
      { id: 'compras-trading', label: 'Trading Room', path: '/compras/trading', badge: 'LIVE' },
    ],
  },
  {
    id:    'documentos',
    label: 'Control Documental',
    icon:  FileText,
    path:  '/documentos',
    allowedRoles: [ROLES.ADMIN, ROLES.COMPRADOR, ROLES.EVAL_DOCUMENTAL],
  },
  {
    id:    'adjudicacion',
    label: 'Adjudicación',
    icon:  Award,
    path:  '/adjudicacion',
    allowedRoles: [ROLES.ADMIN, ROLES.COMPRADOR, ROLES.EVAL_TECNICO],
  },
  {
    id:    'aprobacion',
    label: 'Aprobación de Compra',
    icon:  CheckCircle,
    path:  '/aprobacion',
    allowedRoles: [ROLES.ADMIN, ROLES.AUTORIDAD],
  },
  {
    id:    'auditoria',
    label: 'Auditoría',
    icon:  Shield,
    path:  '/auditoria',
    allowedRoles: [ROLES.ADMIN, ROLES.AUDITOR],
  },
  {
    id:    'portal',
    label: 'Portal Ciudadano',
    icon:  Globe,
    path:  '/portal',
    allowedRoles: [],
  },
]

const roleAllowed = (allowedRoles, role) =>
  !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(role)

/** Filtra recursivamente el árbol de navegación según el rol del usuario. */
export function filterNavByRole(role) {
  return NAV_ITEMS
    .filter(item => roleAllowed(item.allowedRoles, role))
    .map(item => {
      if (!item.children) return item
      return {
        ...item,
        children: item.children.filter(child =>
          roleAllowed(child.allowedRoles ?? item.allowedRoles, role),
        ),
      }
    })
}

/**
 * Roles permitidos para una ruta, derivados del árbol de navegación.
 * Busca la coincidencia más específica (children antes que el padre).
 */
export function getAllowedRoles(path) {
  for (const item of NAV_ITEMS) {
    if (item.children) {
      const child = item.children.find(c => c.path === path)
      if (child) return child.allowedRoles ?? item.allowedRoles ?? []
    }
    if (item.path === path) return item.allowedRoles ?? []
  }
  return []
}

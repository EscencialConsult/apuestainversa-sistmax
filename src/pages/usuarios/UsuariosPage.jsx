import { Users } from 'lucide-react'
import { TablaAuditoria } from '../../components/atoms/TablaAuditoria'

const MOCK_USERS = [
  { id: '1', nombre: 'María González',    email: 'mgonzalez@smt.gob.ar', rol: 'Comprador',    estado: 'activo',   ultimoAcceso: '09/06/2025' },
  { id: '2', nombre: 'Carlos Rodríguez',  email: 'crodriguez@smt.gob.ar', rol: 'Auditor',      estado: 'activo',   ultimoAcceso: '08/06/2025' },
  { id: '3', nombre: 'Ana Pérez',         email: 'aperez@smt.gob.ar',     rol: 'Evaluador Doc',estado: 'inactivo', ultimoAcceso: '01/06/2025' },
  { id: '4', nombre: 'Luis Mamani',       email: 'lmamani@smt.gob.ar',    rol: 'Autoridad',    estado: 'activo',   ultimoAcceso: '09/06/2025' },
]

const COLUMNS = [
  { key: 'nombre',       label: 'Nombre' },
  { key: 'email',        label: 'Email' },
  { key: 'rol',          label: 'Rol' },
  { key: 'estado',       label: 'Estado' },
  { key: 'ultimoAcceso', label: 'Último Acceso' },
]

export function UsuariosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-tenant-text">Usuarios y Roles</h1>
          <p className="text-sm text-tenant-muted mt-1">Gestión de accesos al sistema</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all shadow-neon">
          <Users className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>
      <TablaAuditoria columns={COLUMNS} data={MOCK_USERS} title="Listado de Usuarios" />
    </div>
  )
}

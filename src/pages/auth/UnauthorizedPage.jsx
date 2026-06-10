import { Link } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'

export function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="p-4 rounded-2xl bg-tenant-danger/10 border border-tenant-danger/30">
        <ShieldX className="w-10 h-10 text-tenant-danger" />
      </div>
      <h1 className="text-xl font-bold text-tenant-text">Acceso denegado</h1>
      <p className="text-sm text-tenant-muted max-w-md">
        Su rol no tiene permisos para acceder a este módulo.
        Si cree que es un error, contacte al administrador del sistema.
      </p>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Panel
      </Link>
    </div>
  )
}

import { Building2, ShieldCheck, ShieldX } from 'lucide-react'
import { TablaAuditoria } from '../../components/atoms/TablaAuditoria'

const MOCK_PROVEEDORES = [
  { id: '1', razonSocial: 'TechSolutions SA',       cuit: '30-71234567-9', rubro: 'Informática',      estado: 'aprobado',  arca: true },
  { id: '2', razonSocial: 'Construcciones Norte SRL', cuit: '30-68901234-5', rubro: 'Obra Pública',   estado: 'pendiente', arca: false },
  { id: '3', razonSocial: 'Papelería Central',       cuit: '20-34567890-1', rubro: 'Insumos Oficina',  estado: 'aprobado',  arca: true },
  { id: '4', razonSocial: 'Eco Verde Servicios',     cuit: '30-45678901-2', rubro: 'Espacios Verdes',  estado: 'en_revision', arca: null },
]

const COLUMNS = [
  { key: 'razonSocial', label: 'Razón Social' },
  { key: 'cuit',        label: 'CUIT' },
  { key: 'rubro',       label: 'Rubro' },
  { key: 'arca',        label: 'ARCA', render: (v) => v === true
    ? <span className="flex items-center gap-1 text-tenant-success text-xs"><ShieldCheck className="w-3.5 h-3.5" /> Verificado</span>
    : v === false
      ? <span className="flex items-center gap-1 text-tenant-danger text-xs"><ShieldX className="w-3.5 h-3.5" /> No verificado</span>
      : <span className="text-tenant-muted text-xs">Pendiente</span>
  },
  { key: 'estado', label: 'Estado' },
]

export function ProveedoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-tenant-text">Proveedores</h1>
          <p className="text-sm text-tenant-muted mt-1">Registro de proveedores con validación ARCA</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all shadow-neon">
          <Building2 className="w-4 h-4" /> Nuevo Proveedor
        </button>
      </div>
      <TablaAuditoria columns={COLUMNS} data={MOCK_PROVEEDORES} title="Listado de Proveedores" />
    </div>
  )
}

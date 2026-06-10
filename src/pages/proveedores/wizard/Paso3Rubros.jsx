import { Layers, Check } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useTenant } from '../../../contexts/TenantContext'

export function Paso3Rubros({ rubrosSeleccionados, rubros, loading, errores, onToggleRubro }) {
  const { tenant } = useTenant()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  // RESTRICCIÓN DE NEGOCIO: el nomenclador de rubros es parametrización
  // obligatoria del municipio — sin él no se puede clasificar proveedores.
  if (rubros.length === 0) {
    return (
      <EmptyState
        isMandatory
        icon={Layers}
        title="Nomenclador de rubros no configurado"
        description={`${tenant.name} aún no cargó su nomenclador de rubros de actividad. Un Administrador debe completar esta parametrización antes de poder clasificar proveedores.`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-tenant-text">
          Rubros de actividad <span className="text-tenant-danger">*</span>
        </p>
        <span className="text-[11px] text-tenant-muted">
          {rubrosSeleccionados.length} seleccionados · nomenclador de {tenant.shortName}
        </span>
      </div>
      {errores.rubros && (
        <p className="text-[11px] text-tenant-danger">{errores.rubros}</p>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rubros.map(rubro => {
          const activo = rubrosSeleccionados.includes(rubro.id)
          return (
            <button
              key={rubro.id}
              type="button"
              role="checkbox"
              aria-checked={activo}
              onClick={() => onToggleRubro(rubro.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-left border transition-all',
                activo
                  ? 'border-tenant-primary/50 bg-tenant-primary/10 shadow-neon'
                  : 'border-tenant-border/40 bg-white/5 hover:border-tenant-primary/30',
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
                activo
                  ? 'bg-tenant-primary/30 border-tenant-primary text-tenant-primary'
                  : 'border-tenant-border/50',
              )}>
                {activo && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className={cn(
                'text-xs font-medium',
                activo ? 'text-tenant-primary' : 'text-tenant-text',
              )}>
                {rubro.nombre}
              </span>
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-tenant-muted">
        El proveedor solo recibirá invitaciones de procesos correspondientes a sus rubros declarados.
      </p>
    </div>
  )
}

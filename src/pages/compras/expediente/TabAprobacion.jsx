import { TimelineAprobacion } from '../../adjudicacion/TimelineAprobacion'
import { VisorPlantillas } from '../../adjudicacion/VisorPlantillas'
import { useTenant } from '../../../contexts/TenantContext'

export function TabAprobacion({ circuito, expediente }) {
  const { tenant } = useTenant()

  return (
    <div className="space-y-5">
      {/* Circuito de aprobación — solo lectura */}
      <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 backdrop-blur-glass">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted mb-4">
          Circuito de Aprobación
          <span className="ml-2 font-normal normal-case text-[10px]">
            — {circuito.length} etapas · Solo lectura
          </span>
        </p>
        <TimelineAprobacion
          circuito={circuito}
          onFirmar={() => {}}
          firmando={false}
          userRole=""
          readOnly
        />
      </div>

      {/* Documentos generados */}
      <VisorPlantillas
        plantillas={expediente.plantillas}
        expediente={expediente}
        tenant={tenant}
      />
    </div>
  )
}

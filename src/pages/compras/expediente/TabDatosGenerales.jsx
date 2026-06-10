import { Calendar, Building2, FileText, Hash, Package } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { ESTADO_EXPEDIENTE } from '../../../services/api/expedienteService'

const FECHA_FORMAT = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' })
const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

const ESTADO_CLS = {
  [ESTADO_EXPEDIENTE.BORRADOR]:            'bg-tenant-muted/15 border-tenant-muted/30 text-tenant-muted',
  [ESTADO_EXPEDIENTE.PUBLICADO]:           'bg-tenant-primary/15 border-tenant-primary/30 text-tenant-primary',
  [ESTADO_EXPEDIENTE.SUBASTA_ACTIVA]:      'bg-tenant-warning/15 border-tenant-warning/30 text-tenant-warning',
  [ESTADO_EXPEDIENTE.ADJUDICADO]:          'bg-tenant-accent/15 border-tenant-accent/30 text-tenant-accent',
  [ESTADO_EXPEDIENTE.RECEPCION_PENDIENTE]: 'bg-tenant-success/15 border-tenant-success/30 text-tenant-success',
  [ESTADO_EXPEDIENTE.CERRADO]:             'bg-tenant-success/20 border-tenant-success/40 text-tenant-success',
}

const ESTADO_LABEL = {
  [ESTADO_EXPEDIENTE.BORRADOR]:            'Borrador',
  [ESTADO_EXPEDIENTE.PUBLICADO]:           'Publicado',
  [ESTADO_EXPEDIENTE.SUBASTA_ACTIVA]:      'Subasta activa',
  [ESTADO_EXPEDIENTE.ADJUDICADO]:          'Adjudicado',
  [ESTADO_EXPEDIENTE.RECEPCION_PENDIENTE]: 'Recepción pendiente',
  [ESTADO_EXPEDIENTE.CERRADO]:             'Cerrado',
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="p-1.5 rounded-lg bg-tenant-surface/60 border border-tenant-border/30 flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-tenant-muted" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-tenant-muted">{label}</p>
        <p className="text-xs text-tenant-text mt-0.5 break-words">{value}</p>
      </div>
    </div>
  )
}

export function TabDatosGenerales({ expediente }) {
  return (
    <div className="space-y-5">
      {/* Estado + descripción */}
      <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={cn(
            'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
            ESTADO_CLS[expediente.estado] ?? ESTADO_CLS[ESTADO_EXPEDIENTE.BORRADOR],
          )}>
            {ESTADO_LABEL[expediente.estado] ?? expediente.estado}
          </span>
          <span className="text-[10px] text-tenant-muted">{expediente.modalidad}</span>
        </div>
        <p className="text-xs text-tenant-muted leading-relaxed">{expediente.descripcion}</p>
      </div>

      {/* Datos generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={Hash}      label="Número de expediente" value={expediente.expedienteNum} />
        <InfoRow icon={Building2} label="Área requirente"      value={expediente.area} />
        <InfoRow icon={FileText}  label="Modalidad"            value={expediente.modalidad} />
        <InfoRow icon={Package}   label="Cantidad de ítems"    value={`${expediente.cantidadItems} unidades`} />
        <InfoRow
          icon={Calendar}
          label="Fecha de creación"
          value={FECHA_FORMAT.format(new Date(expediente.fechaCreacion))}
        />
        <InfoRow
          icon={Calendar}
          label="Fecha de publicación"
          value={FECHA_FORMAT.format(new Date(expediente.fechaPublicacion))}
        />
        <InfoRow
          icon={Calendar}
          label="Cierre de subasta"
          value={FECHA_FORMAT.format(new Date(expediente.fechaCierre))}
        />
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-tenant-success/15 border border-tenant-success/30 flex-shrink-0 mt-0.5">
            <Package className="w-3.5 h-3.5 text-tenant-success" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Presupuesto oficial</p>
            <p className="text-xs font-bold font-mono text-tenant-success mt-0.5">
              {CURRENCY_FORMAT.format(expediente.montoBase)}
            </p>
          </div>
        </div>
      </div>

      {/* Especificaciones técnicas */}
      <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 space-y-2">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
          Especificaciones Técnicas
        </p>
        <pre className="text-xs text-tenant-text whitespace-pre-wrap leading-relaxed font-sans">
          {expediente.especificaciones}
        </pre>
      </div>
    </div>
  )
}

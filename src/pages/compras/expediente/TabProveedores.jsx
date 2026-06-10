import { Award } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { ESTADO_PROVEEDOR } from '../../../services/api/expedienteService'

const ESTADO_CLS = {
  [ESTADO_PROVEEDOR.INVITADO]:         'bg-tenant-muted/15 border-tenant-muted/30 text-tenant-muted',
  [ESTADO_PROVEEDOR.DOC_APROBADA]:     'bg-tenant-primary/15 border-tenant-primary/30 text-tenant-primary',
  [ESTADO_PROVEEDOR.TECNICA_APROBADA]: 'bg-tenant-accent/15 border-tenant-accent/30 text-tenant-accent',
  [ESTADO_PROVEEDOR.ADJUDICADO]:       'bg-tenant-success/15 border-tenant-success/30 text-tenant-success',
  [ESTADO_PROVEEDOR.DESCALIFICADO]:    'bg-tenant-danger/15 border-tenant-danger/30 text-tenant-danger',
}

const ESTADO_LABEL = {
  [ESTADO_PROVEEDOR.INVITADO]:         'Invitado',
  [ESTADO_PROVEEDOR.DOC_APROBADA]:     'Doc. Aprobada',
  [ESTADO_PROVEEDOR.TECNICA_APROBADA]: 'Técnica Aprobada',
  [ESTADO_PROVEEDOR.ADJUDICADO]:       'Adjudicado',
  [ESTADO_PROVEEDOR.DESCALIFICADO]:    'Descalificado',
}

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

export function TabProveedores({ proveedores }) {
  return (
    <div className="rounded-2xl border border-tenant-border/30 bg-tenant-surface/40 backdrop-blur-glass overflow-hidden">
      <div className="px-4 py-3 border-b border-tenant-border/25">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
          Proveedores — {proveedores.length} participantes
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-tenant-border/20 bg-tenant-surface/30">
              <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Proveedor</th>
              <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">CUIT</th>
              <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Estado</th>
              <th scope="col" className="text-right py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Oferta Final</th>
              <th scope="col" className="text-left py-2.5 px-4 text-[10px] uppercase tracking-wider font-bold text-tenant-muted">Observación</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr
                key={p.cuit}
                className={cn(
                  'border-b border-tenant-border/15 transition-colors',
                  p.estado === ESTADO_PROVEEDOR.ADJUDICADO
                    ? 'bg-tenant-success/6'
                    : p.estado === ESTADO_PROVEEDOR.DESCALIFICADO
                    ? 'bg-tenant-danger/4 opacity-70'
                    : 'hover:bg-tenant-surface/60',
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {p.estado === ESTADO_PROVEEDOR.ADJUDICADO && (
                      <Award className="w-3.5 h-3.5 text-tenant-success flex-shrink-0" />
                    )}
                    <span className={cn(
                      'font-medium',
                      p.estado === ESTADO_PROVEEDOR.ADJUDICADO ? 'text-tenant-success' : 'text-tenant-text',
                    )}>
                      {p.razonSocial}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-tenant-muted text-[11px]">{p.cuit}</td>
                <td className="py-3 px-4">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap',
                    ESTADO_CLS[p.estado] ?? '',
                  )}>
                    {ESTADO_LABEL[p.estado] ?? p.estado}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-tenant-text">
                  {p.montoFinalLance ? CURRENCY_FORMAT.format(p.montoFinalLance) : '—'}
                </td>
                <td className="py-3 px-4 text-tenant-muted max-w-xs">
                  {p.observacionDocumental && (
                    <p className="text-[10px] text-tenant-danger leading-snug">{p.observacionDocumental}</p>
                  )}
                  {p.observacionTecnica && (
                    <p className="text-[10px] text-tenant-muted leading-snug">{p.observacionTecnica}</p>
                  )}
                  {!p.observacionDocumental && !p.observacionTecnica && (
                    <span className="text-tenant-border">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

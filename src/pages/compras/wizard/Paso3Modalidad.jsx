import { Settings2, CalendarClock } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Field, Input } from '../../../components/ui/FormControls'

const formatMonto = (n) =>
  n == null ? null : `$${n.toLocaleString('es-AR')}`

function RangoMontos({ modalidad }) {
  const min = formatMonto(modalidad.montoMinimo)
  const max = formatMonto(modalidad.montoMaximo)
  if (min && max) return <>De {min} a {max}</>
  if (max) return <>Hasta {max}</>
  if (modalidad.montoMinimo > 0) return <>Desde {min}</>
  return <>Sin tope de monto</>
}

export function Paso3Modalidad({ modalidad, modalidades, loading, errores, onChange }) {
  // RESTRICCIÓN DE NEGOCIO: el municipio DEBE tener modalidades parametrizadas
  // antes de operar. Sin ellas, el wizard bloquea el avance.
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 border-tenant-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (modalidades.length === 0) {
    return (
      <EmptyState
        isMandatory
        icon={Settings2}
        title="Modalidades de contratación no configuradas"
        description="Este municipio aún no cargó las modalidades de contratación vigentes con sus reglas y montos. Un Administrador debe completar la parametrización antes de poder crear procesos de compra."
      />
    )
  }

  const seleccionada = modalidades.find(m => m.id === modalidad.modalidadId)

  return (
    <div className="flex flex-col gap-6">
      {/* Selección de modalidad */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-tenant-text">
          Modalidad de contratación <span className="text-tenant-danger">*</span>
        </p>
        {errores.modalidadId && (
          <p className="text-[11px] text-tenant-danger">{errores.modalidadId}</p>
        )}
        <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Modalidad de contratación">
          {modalidades.map(m => {
            const activa = m.id === modalidad.modalidadId
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={activa}
                onClick={() => onChange('modalidad', 'modalidadId', m.id)}
                className={cn(
                  'flex flex-col gap-2 p-4 rounded-2xl text-left border transition-all duration-200',
                  'bg-tenant-surface/60 backdrop-blur-glass',
                  activa
                    ? 'border-tenant-primary/60 shadow-neon bg-tenant-primary/10'
                    : 'border-tenant-border/40 hover:border-tenant-primary/30',
                )}
              >
                <span className={cn('text-sm font-semibold', activa ? 'text-tenant-primary' : 'text-tenant-text')}>
                  {m.nombre}
                </span>
                <span className="text-xs text-tenant-muted leading-snug">{m.descripcion}</span>
                <span className="text-[11px] font-mono text-tenant-accent mt-auto pt-2 border-t border-tenant-border/20">
                  <RangoMontos modalidad={m} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cronograma — solo si la modalidad lo requiere */}
      {seleccionada?.requiereCronograma && (
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 animate-fade-in">
          <p className="flex items-center gap-2 text-xs font-semibold text-tenant-text">
            <CalendarClock className="w-4 h-4 text-tenant-primary" />
            Cronograma del proceso
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Fecha de publicación" required error={errores.fechaPublicacion}>
              <Input
                type="date"
                value={modalidad.fechaPublicacion}
                onChange={e => onChange('modalidad', 'fechaPublicacion', e.target.value)}
                error={errores.fechaPublicacion}
              />
            </Field>
            <Field label="Fecha de apertura / inicio de subasta" required error={errores.fechaApertura}>
              <Input
                type="date"
                value={modalidad.fechaApertura}
                onChange={e => onChange('modalidad', 'fechaApertura', e.target.value)}
                error={errores.fechaApertura}
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  )
}

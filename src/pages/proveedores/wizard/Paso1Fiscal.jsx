import { ShieldCheck, ShieldAlert, ShieldQuestion, FileUp, Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { Field, Input, Select } from '../../../components/ui/FormControls'
import { CUIT_REGEX } from '../../../services/api/arcaService'
import { ARCA_ESTADOS } from './wizardProveedorReducer'

const CONDICIONES_FISCALES = [
  'Responsable Inscripto',
  'Monotributista',
  'Exento',
  'Consumidor Final',
]

function EstadoArcaBadge({ estado }) {
  if (estado === ARCA_ESTADOS.VERIFICADO) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-tenant-success">
        <ShieldCheck className="w-4 h-4" /> Constancia verificada en ARCA
      </span>
    )
  }
  if (estado === ARCA_ESTADOS.FALLIDO) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-tenant-danger">
        <ShieldAlert className="w-4 h-4" /> ARCA no disponible
      </span>
    )
  }
  if (estado === ARCA_ESTADOS.VERIFICANDO) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-tenant-primary">
        <Loader2 className="w-4 h-4 animate-spin" /> Consultando ARCA...
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-tenant-muted">
      <ShieldQuestion className="w-4 h-4" /> Constancia sin verificar
    </span>
  )
}

export function Paso1Fiscal({ fiscal, errores, onChange, onVerificarArca, onToggleContingencia, onConstanciaPdf }) {
  const set = (campo) => (e) => onChange('fiscal', campo, e.target.value)
  const cuitValido = CUIT_REGEX.test(fiscal.cuit)
  const verificando = fiscal.arca.estado === ARCA_ESTADOS.VERIFICANDO
  const verificado = fiscal.arca.estado === ARCA_ESTADOS.VERIFICADO

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="CUIT" required error={errores.cuit} hint="Formato: XX-XXXXXXXX-X">
          <Input
            placeholder="30-12345678-9"
            value={fiscal.cuit}
            onChange={set('cuit')}
            error={errores.cuit}
            disabled={verificado}
          />
        </Field>

        <Field label="Condición fiscal" required error={errores.condicionFiscal}>
          <Select value={fiscal.condicionFiscal} onChange={set('condicionFiscal')} error={errores.condicionFiscal}>
            <option value="">Seleccione...</option>
            {CONDICIONES_FISCALES.map(c => (
              <option key={c} value={c} className="bg-tenant-surface">{c}</option>
            ))}
          </Select>
        </Field>

        <Field label="Razón social" required error={errores.razonSocial} className="md:col-span-2"
               hint="Se autocompleta al verificar en ARCA">
          <Input
            placeholder="Razón social del proveedor"
            value={fiscal.razonSocial}
            onChange={set('razonSocial')}
            error={errores.razonSocial}
          />
        </Field>
      </div>

      {/* Bloque de verificación ARCA */}
      <div className={cn(
        'flex flex-col gap-4 p-5 rounded-2xl border backdrop-blur-glass transition-all',
        verificado
          ? 'bg-tenant-success/5 border-tenant-success/30'
          : fiscal.arca.estado === ARCA_ESTADOS.FALLIDO
            ? 'bg-tenant-danger/5 border-tenant-danger/30'
            : 'bg-tenant-surface/40 border-tenant-border/30',
      )}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <EstadoArcaBadge estado={fiscal.arca.estado} />
          {!verificado && (
            <button
              type="button"
              onClick={onVerificarArca}
              disabled={!cuitValido || verificando}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-xs font-semibold hover:bg-tenant-primary/30 transition-all shadow-neon disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
              title={!cuitValido ? 'Ingrese un CUIT válido primero' : undefined}
            >
              {verificando && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Verificar en ARCA
            </button>
          )}
        </div>

        {fiscal.arca.error && (
          <p className="text-xs text-tenant-danger">{fiscal.arca.error}</p>
        )}
        {errores.arca && (
          <p className="text-xs text-tenant-danger font-medium">{errores.arca}</p>
        )}

        {/* Switch de contingencia manual — directiva crítica:
            si la API de ARCA falla, se permite la carga tradicional del PDF
            para revisión posterior del Evaluador Documental */}
        {!verificado && (
          <div className="flex flex-col gap-3 border-t border-tenant-border/20 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-tenant-text">
                  Carga manual por contingencia
                </p>
                <p className="text-[11px] text-tenant-muted mt-0.5">
                  Use esta opción solo si la verificación automática de ARCA no está disponible.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={fiscal.contingenciaManual}
                aria-label="Activar carga manual por contingencia"
                onClick={onToggleContingencia}
                className={cn(
                  'relative w-11 h-6 rounded-full border transition-all shrink-0',
                  fiscal.contingenciaManual
                    ? 'bg-tenant-warning/30 border-tenant-warning/60'
                    : 'bg-white/5 border-tenant-border/40',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all duration-200',
                  'w-[18px] h-[18px]',
                  fiscal.contingenciaManual
                    ? 'left-[22px] bg-tenant-warning shadow-[0_0_8px_rgb(var(--color-warning)/0.6)]'
                    : 'left-0.5 bg-tenant-muted',
                )} />
              </button>
            </div>

            {fiscal.contingenciaManual && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <label
                  htmlFor="constancia-pdf"
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-6 rounded-xl border border-dashed cursor-pointer transition-all text-xs',
                    fiscal.constanciaPdf
                      ? 'border-tenant-success/40 bg-tenant-success/5 text-tenant-success'
                      : 'border-tenant-warning/40 bg-tenant-warning/5 text-tenant-warning hover:bg-tenant-warning/10',
                  )}
                >
                  <FileUp className="w-4 h-4" />
                  {fiscal.constanciaPdf
                    ? `${fiscal.constanciaPdf.name} — clic para reemplazar`
                    : 'Adjuntar constancia fiscal (PDF)'}
                </label>
                <input
                  id="constancia-pdf"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onConstanciaPdf({ name: file.name, size: file.size })
                  }}
                />
                <p className="text-[11px] text-tenant-warning/90">
                  ⚠ La constancia cargada manualmente quedará <strong>pendiente de revisión
                  por el Evaluador Documental</strong> antes de habilitar al proveedor.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

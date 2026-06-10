import { Landmark, Phone, Layers, Pencil, ShieldCheck, FileUp } from 'lucide-react'
import { ARCA_ESTADOS } from './wizardProveedorReducer'

function Seccion({ icon: Icon, titulo, pasoIndex, onEditar, children }) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-tenant-surface/50 backdrop-blur-glass border border-tenant-border/40">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-bold text-tenant-primary uppercase tracking-wider">
          <Icon className="w-4 h-4" /> {titulo}
        </p>
        <button
          type="button"
          onClick={() => onEditar(pasoIndex)}
          className="flex items-center gap-1 text-[11px] text-tenant-muted hover:text-tenant-primary transition-colors"
        >
          <Pencil className="w-3 h-3" /> Editar
        </button>
      </div>
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 text-xs">
        {children}
      </dl>
    </div>
  )
}

function Dato({ label, children, full = false }) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <dt className="text-tenant-muted">{label}</dt>
      <dd className="text-tenant-text font-medium mt-0.5">{children || '—'}</dd>
    </div>
  )
}

export function Paso4RevisionProveedor({ proveedor, rubros, onEditar }) {
  const { fiscal, comercial } = proveedor
  const rubrosElegidos = rubros.filter(r => proveedor.rubros.seleccionados.includes(r.id))
  const porContingencia = fiscal.arca.estado !== ARCA_ESTADOS.VERIFICADO && fiscal.contingenciaManual

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-tenant-muted">
        Revise los datos del proveedor antes de enviar el registro.
      </p>

      <Seccion icon={Landmark} titulo="Datos Fiscales" pasoIndex={0} onEditar={onEditar}>
        <Dato label="CUIT">{fiscal.cuit}</Dato>
        <Dato label="Condición fiscal">{fiscal.condicionFiscal}</Dato>
        <Dato label="Razón social" full>{fiscal.razonSocial}</Dato>
        <Dato label="Validación fiscal" full>
          {porContingencia ? (
            <span className="flex items-center gap-1.5 text-tenant-warning">
              <FileUp className="w-3.5 h-3.5" />
              Contingencia manual — {fiscal.constanciaPdf?.name} (pendiente de revisión documental)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-tenant-success">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verificado en ARCA
            </span>
          )}
        </Dato>
      </Seccion>

      <Seccion icon={Phone} titulo="Datos Comerciales" pasoIndex={1} onEditar={onEditar}>
        <Dato label="Email">{comercial.email}</Dato>
        <Dato label="Teléfono">{comercial.telefono}</Dato>
        <Dato label="Domicilio">{comercial.direccion}</Dato>
        <Dato label="Localidad">{comercial.localidad}</Dato>
        {comercial.contacto && <Dato label="Contacto">{comercial.contacto}</Dato>}
        {comercial.cbu && <Dato label="CBU / Alias">{comercial.cbu}</Dato>}
      </Seccion>

      <Seccion icon={Layers} titulo="Rubros" pasoIndex={2} onEditar={onEditar}>
        <Dato label="Rubros declarados" full>
          <span className="flex flex-wrap gap-1.5 mt-1">
            {rubrosElegidos.map(r => (
              <span key={r.id} className="px-2 py-0.5 rounded-full bg-tenant-primary/15 border border-tenant-primary/30 text-tenant-primary text-[10px] font-semibold">
                {r.nombre}
              </span>
            ))}
          </span>
        </Dato>
      </Seccion>
    </div>
  )
}

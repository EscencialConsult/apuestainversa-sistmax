import { FileText, Wrench, Settings2, Users, Pencil } from 'lucide-react'

// Formatter a nivel módulo: construir Intl.NumberFormat es caro
const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})
const formatCurrency = (n) => CURRENCY_FORMAT.format(Number(n) || 0)

const formatDate = (iso) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'

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
      <dd className="text-tenant-text font-medium mt-0.5 whitespace-pre-line">{children || '—'}</dd>
    </div>
  )
}

export function Paso5Revision({ compra, areas, modalidades, proveedores, onEditar }) {
  const area = areas.find(a => a.id === compra.datos.areaSolicitante)
  const modalidad = modalidades.find(m => m.id === compra.modalidad.modalidadId)
  const invitados = proveedores.filter(p => compra.participacion.proveedoresInvitados.includes(p.id))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-tenant-muted">
        Revise el expediente completo antes de publicar. Una vez publicado, el proceso
        queda registrado en la auditoría y visible según la convocatoria elegida.
      </p>

      <Seccion icon={FileText} titulo="Datos Generales" pasoIndex={0} onEditar={onEditar}>
        <Dato label="Área solicitante">{area?.nombre}</Dato>
        <Dato label="Monto estimado">
          <span className="text-tenant-success font-bold">{formatCurrency(compra.datos.montoEstimado)}</span>
        </Dato>
        <Dato label="Objeto" full>{compra.datos.objeto}</Dato>
        {compra.datos.justificacion && <Dato label="Justificación" full>{compra.datos.justificacion}</Dato>}
      </Seccion>

      <Seccion icon={Wrench} titulo="Especificaciones" pasoIndex={1} onEditar={onEditar}>
        <Dato label="Especificaciones técnicas" full>{compra.especificaciones.especTecnicas}</Dato>
        {compra.especificaciones.condComerciales && (
          <Dato label="Condiciones comerciales" full>{compra.especificaciones.condComerciales}</Dato>
        )}
        <Dato label="Plazo de entrega">{compra.especificaciones.plazoEntrega}</Dato>
        <Dato label="Lugar de entrega">{compra.especificaciones.lugarEntrega}</Dato>
      </Seccion>

      <Seccion icon={Settings2} titulo="Modalidad y Cronograma" pasoIndex={2} onEditar={onEditar}>
        <Dato label="Modalidad" full>{modalidad?.nombre}</Dato>
        {modalidad?.requiereCronograma && (
          <>
            <Dato label="Publicación">{formatDate(compra.modalidad.fechaPublicacion)}</Dato>
            <Dato label="Apertura / Inicio de subasta">{formatDate(compra.modalidad.fechaApertura)}</Dato>
          </>
        )}
      </Seccion>

      <Seccion icon={Users} titulo="Participación" pasoIndex={3} onEditar={onEditar}>
        <Dato label="Convocatoria" full>
          {compra.participacion.tipoConvocatoria === 'abierta'
            ? 'Abierta — todos los proveedores habilitados'
            : `Por invitación — ${invitados.length} proveedores`}
        </Dato>
        {invitados.length > 0 && (
          <Dato label="Invitados" full>
            {invitados.map(p => `${p.razonSocial} (${p.cuit})`).join('\n')}
          </Dato>
        )}
      </Seccion>
    </div>
  )
}

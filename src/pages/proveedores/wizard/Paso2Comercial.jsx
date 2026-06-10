import { Field, Input } from '../../../components/ui/FormControls'

export function Paso2Comercial({ comercial, errores, onChange }) {
  const set = (campo) => (e) => onChange('comercial', campo, e.target.value)

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Email de contacto" required error={errores.email}
             hint="Acá llegan las invitaciones a procesos y notificaciones de subasta">
        <Input type="email" placeholder="contacto@empresa.com.ar"
               value={comercial.email} onChange={set('email')} error={errores.email} />
      </Field>

      <Field label="Teléfono" required error={errores.telefono}>
        <Input type="tel" placeholder="0381 412-3456"
               value={comercial.telefono} onChange={set('telefono')} error={errores.telefono} />
      </Field>

      <Field label="Domicilio comercial" required error={errores.direccion}>
        <Input placeholder="Av. Principal 1234"
               value={comercial.direccion} onChange={set('direccion')} error={errores.direccion} />
      </Field>

      <Field label="Localidad" required error={errores.localidad}>
        <Input placeholder="San Miguel de Tucumán"
               value={comercial.localidad} onChange={set('localidad')} error={errores.localidad} />
      </Field>

      <Field label="Persona de contacto">
        <Input placeholder="Nombre y apellido"
               value={comercial.contacto} onChange={set('contacto')} />
      </Field>

      <Field label="CBU / Alias" hint="Para el pago de órdenes de compra adjudicadas">
        <Input placeholder="0000000000000000000000"
               value={comercial.cbu} onChange={set('cbu')} />
      </Field>
    </div>
  )
}

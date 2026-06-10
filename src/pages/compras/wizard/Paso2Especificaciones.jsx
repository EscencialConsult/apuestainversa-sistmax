import { Field, Input, Textarea } from '../../../components/ui/FormControls'

export function Paso2Especificaciones({ especificaciones, errores, onChange }) {
  const set = (campo) => (e) => onChange('especificaciones', campo, e.target.value)

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Especificaciones técnicas" required error={errores.especTecnicas} className="md:col-span-2"
             hint="Características, cantidades y calidades exigidas de los bienes o servicios">
        <Textarea
          rows={6}
          placeholder={'Ej:\n- 20 notebooks core i5, 16GB RAM, SSD 512GB\n- Garantía mínima 24 meses\n- Soporte técnico on-site'}
          value={especificaciones.especTecnicas}
          onChange={set('especTecnicas')}
          error={errores.especTecnicas}
        />
      </Field>

      <Field label="Condiciones comerciales" className="md:col-span-2"
             hint="Forma de pago, mantenimiento de oferta, garantías exigidas">
        <Textarea
          placeholder="Ej: Pago a 30 días de conformada la factura. Mantenimiento de oferta: 60 días."
          value={especificaciones.condComerciales}
          onChange={set('condComerciales')}
        />
      </Field>

      <Field label="Plazo de entrega" required error={errores.plazoEntrega}>
        <Input
          placeholder="Ej: 15 días hábiles desde la orden de compra"
          value={especificaciones.plazoEntrega}
          onChange={set('plazoEntrega')}
          error={errores.plazoEntrega}
        />
      </Field>

      <Field label="Lugar de entrega">
        <Input
          placeholder="Ej: Depósito municipal — Av. Principal 1234"
          value={especificaciones.lugarEntrega}
          onChange={set('lugarEntrega')}
        />
      </Field>
    </div>
  )
}

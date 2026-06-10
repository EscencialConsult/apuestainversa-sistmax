import { Field, Input, Select, Textarea } from '../../../components/ui/FormControls'

export function Paso1DatosGenerales({ datos, areas, errores, onChange }) {
  const set = (campo) => (e) => onChange('datos', campo, e.target.value)

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Área solicitante" required error={errores.areaSolicitante}>
        <Select value={datos.areaSolicitante} onChange={set('areaSolicitante')} error={errores.areaSolicitante}>
          <option value="">Seleccione un área...</option>
          {areas.map(a => (
            <option key={a.id} value={a.id} className="bg-tenant-surface">{a.nombre}</option>
          ))}
        </Select>
      </Field>

      <Field label="Monto estimado (ARS)" required error={errores.montoEstimado}
             hint="Presupuesto oficial estimado del expediente">
        <Input
          type="number"
          min="0"
          step="1000"
          placeholder="0"
          value={datos.montoEstimado}
          onChange={set('montoEstimado')}
          error={errores.montoEstimado}
        />
      </Field>

      <Field label="Objeto de la compra" required error={errores.objeto} className="md:col-span-2">
        <Input
          placeholder="Ej: Adquisición de equipamiento informático para dependencias municipales"
          value={datos.objeto}
          onChange={set('objeto')}
          error={errores.objeto}
        />
      </Field>

      <Field label="Justificación de la necesidad" className="md:col-span-2"
             hint="Opcional en esta etapa — requerida para Contratación Directa">
        <Textarea
          placeholder="Describa la necesidad que origina esta compra..."
          value={datos.justificacion}
          onChange={set('justificacion')}
        />
      </Field>
    </div>
  )
}

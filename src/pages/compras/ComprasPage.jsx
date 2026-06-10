import { ShoppingCart } from 'lucide-react'
import { CardProceso } from '../../components/atoms/CardProceso'

const MOCK_PROCESOS = [
  { id: '1', numero: 'EXP-2025-0142', titulo: 'Adquisición de Equipamiento Informático para Dependencias Municipales', estado: 'en_subasta', modalidad: 'Subasta Inversa', presupuesto: 850000, fechaApertura: '2025-07-15', ofertasCount: 12 },
  { id: '2', numero: 'EXP-2025-0138', titulo: 'Servicio de Mantenimiento de Parques y Espacios Verdes', estado: 'adjudicado', modalidad: 'Licitación', presupuesto: 2400000, fechaApertura: '2025-06-28', ofertasCount: 5 },
  { id: '3', numero: 'EXP-2025-0135', titulo: 'Provisión de Insumos de Oficina — Primer Semestre', estado: 'en_revision', modalidad: 'Contratación Directa', presupuesto: 120000, fechaApertura: '2025-07-01', ofertasCount: 3 },
  { id: '4', numero: 'EXP-2025-0130', titulo: 'Obra de Reparación de Calzada — Barrio Norte', estado: 'pendiente', modalidad: 'Subasta Inversa', presupuesto: 6800000, fechaApertura: '2025-07-20', ofertasCount: 0 },
  { id: '5', numero: 'EXP-2025-0128', titulo: 'Servicio de Limpieza de Edificios Municipales', estado: 'aprobado', modalidad: 'Subasta Inversa', presupuesto: 980000, fechaApertura: '2025-06-10', ofertasCount: 8 },
  { id: '6', numero: 'EXP-2025-0120', titulo: 'Provisión de Combustible para Flota Municipal', estado: 'cerrado', modalidad: 'Contratación Directa', presupuesto: 450000, fechaApertura: '2025-05-30', ofertasCount: 2 },
]

export function ComprasPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-tenant-text">Gestión de Compras</h1>
          <p className="text-sm text-tenant-muted mt-1">Todos los expedientes de contratación</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all shadow-neon">
          <ShoppingCart className="w-4 h-4" /> Nueva Compra
        </button>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_PROCESOS.map(p => <CardProceso key={p.id} proceso={p} />)}
      </div>
    </div>
  )
}

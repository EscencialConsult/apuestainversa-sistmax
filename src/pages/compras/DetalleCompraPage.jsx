import { useParams } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import { ModulePlaceholder } from '../../components/ui/ModulePlaceholder'

export function DetalleCompraPage() {
  const { id } = useParams()
  return (
    <ModulePlaceholder
      title={`Expediente #${id}`}
      description="Detalle del proceso de compra — vista en desarrollo"
      icon={FileSearch}
    />
  )
}

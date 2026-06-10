import { Construction } from 'lucide-react'
import { cn } from '../../utils/cn'

export function ModulePlaceholder({ title, description, icon: Icon = Construction }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-tenant-text">{title}</h1>
        {description && <p className="text-sm text-tenant-muted mt-1">{description}</p>}
      </div>
      <div className={cn(
        'flex flex-col items-center justify-center gap-4 py-24 rounded-2xl',
        'bg-tenant-surface/40 backdrop-blur-glass border border-dashed border-tenant-border/40',
      )}>
        <div className="p-4 rounded-2xl bg-tenant-primary/10 border border-tenant-primary/20">
          <Icon className="w-10 h-10 text-tenant-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-tenant-text">Módulo en desarrollo</p>
          <p className="text-xs text-tenant-muted mt-1 max-w-xs">Este módulo estará disponible en la próxima iteración del sprint.</p>
        </div>
      </div>
    </div>
  )
}

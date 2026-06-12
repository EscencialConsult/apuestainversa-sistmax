import { Component } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

/**
 * Barrera global de errores: evita que un crash de render o un fallo de la
 * API tire abajo toda la UI. Los errores se loguean para auditoría.
 */
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // TODO: enviar a servicio de logging on-premise cuando exista la API
    console.error('[INVERSA.Bid ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-tenant-bg text-tenant-text px-6 text-center font-sans">
        <div className="p-4 rounded-2xl bg-tenant-danger/10 border border-tenant-danger/30">
          <AlertOctagon className="w-10 h-10 text-tenant-danger" />
        </div>
        <h1 className="text-xl font-bold">Algo salió mal</h1>
        <p className="text-sm text-tenant-muted max-w-md">
          Ocurrió un error inesperado en la aplicación. El incidente fue registrado.
          Puede reintentar o contactar al soporte técnico si el problema persiste.
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reintentar
        </button>
      </div>
    )
  }
}

import { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Rocket, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { WizardPasos } from '../../../components/atoms/WizardPasos'
import { getAreasSolicitantes, getModalidades, getProveedoresHabilitados } from '../../../services/api/catalogosService'
import { PASOS_COMPRA, initialCompra, compraReducer, validarPaso } from './wizardCompraReducer'
import { Paso1DatosGenerales } from './Paso1DatosGenerales'
import { Paso2Especificaciones } from './Paso2Especificaciones'
import { Paso3Modalidad } from './Paso3Modalidad'
import { Paso4Participacion } from './Paso4Participacion'
import { Paso5Revision } from './Paso5Revision'

export function NuevaCompraWizard() {
  const navigate = useNavigate()

  // Payload progresivo: se construye paso a paso y se publica completo al final
  const [compra, dispatch] = useReducer(compraReducer, initialCompra)
  const [pasoActual, setPasoActual] = useState(0)
  const [errores, setErrores] = useState({})
  const [publicado, setPublicado] = useState(false)
  const [publicando, setPublicando] = useState(false)

  // Catálogos parametrizables del municipio
  const [areas, setAreas] = useState([])
  const [modalidades, setModalidades] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loadingCatalogos, setLoadingCatalogos] = useState(true)

  useEffect(() => {
    let cancelado = false
    Promise.all([getAreasSolicitantes(), getModalidades(), getProveedoresHabilitados()])
      .then(([a, m, p]) => {
        if (cancelado) return
        setAreas(a)
        setModalidades(m)
        setProveedores(p)
      })
      .finally(() => !cancelado && setLoadingCatalogos(false))
    return () => { cancelado = true }
  }, [])

  const onChange = (paso, campo, valor) => {
    dispatch({ type: 'SET_CAMPO', paso, campo, valor })
    // Limpia el error del campo apenas el usuario lo corrige
    if (errores[campo]) {
      setErrores(prev => {
        const next = { ...prev }
        delete next[campo]
        return next
      })
    }
  }

  const onToggleProveedor = (id) => dispatch({ type: 'TOGGLE_PROVEEDOR', id })

  const esUltimoPaso = pasoActual === PASOS_COMPRA.length - 1
  // Bloqueo de negocio: sin modalidades parametrizadas no se avanza del paso 3
  const bloqueadoPorModalidades = pasoActual === 2 && !loadingCatalogos && modalidades.length === 0

  const handleSiguiente = () => {
    const errs = validarPaso(pasoActual, compra, { modalidades })
    setErrores(errs)
    if (Object.keys(errs).length > 0) return
    setPasoActual(p => p + 1)
  }

  const handleAnterior = () => {
    setErrores({})
    setPasoActual(p => Math.max(0, p - 1))
  }

  const irAPaso = (i) => {
    setErrores({})
    setPasoActual(i)
  }

  const handlePublicar = async () => {
    setPublicando(true)
    try {
      // TODO backend: apiClient.post('/compras', compra)
      await new Promise(r => setTimeout(r, 800))
      setPublicado(true)
    } finally {
      setPublicando(false)
    }
  }

  if (publicado) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center animate-fade-in">
        <div className="p-4 rounded-2xl bg-tenant-success/10 border border-tenant-success/30 shadow-[0_0_24px_rgb(var(--color-success)/0.3)]">
          <CheckCircle2 className="w-12 h-12 text-tenant-success" />
        </div>
        <h2 className="text-xl font-bold text-tenant-text">Expediente publicado</h2>
        <p className="text-sm text-tenant-muted max-w-md">
          El proceso de compra fue registrado y publicado correctamente.
          Quedó asentado en el registro de auditoría del municipio.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate('/compras')}
            className="px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all shadow-neon"
          >
            Ver expedientes
          </button>
          <button
            type="button"
            onClick={() => { dispatch({ type: 'RESET' }); setPasoActual(0); setPublicado(false) }}
            className="px-4 py-2 rounded-xl border border-tenant-border/40 text-tenant-muted text-sm font-semibold hover:text-tenant-text hover:border-tenant-primary/30 transition-all"
          >
            Crear otra compra
          </button>
        </div>
      </div>
    )
  }

  const pasoProps = { errores, onChange }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-tenant-text">Nueva Compra</h1>
        <p className="text-sm text-tenant-muted mt-1">
          Flujo guiado de alta de proceso de compra municipal
        </p>
      </div>

      <WizardPasos
        pasos={PASOS_COMPRA}
        pasoActual={pasoActual}
        onPasoClick={irAPaso}
      />

      {/* Contenido del paso activo */}
      <div className="p-6 rounded-2xl bg-tenant-surface/40 backdrop-blur-glass border border-tenant-border/30 animate-fade-in" key={pasoActual}>
        {pasoActual === 0 && (
          <Paso1DatosGenerales datos={compra.datos} areas={areas} {...pasoProps} />
        )}
        {pasoActual === 1 && (
          <Paso2Especificaciones especificaciones={compra.especificaciones} {...pasoProps} />
        )}
        {pasoActual === 2 && (
          <Paso3Modalidad
            modalidad={compra.modalidad}
            modalidades={modalidades}
            loading={loadingCatalogos}
            {...pasoProps}
          />
        )}
        {pasoActual === 3 && (
          <Paso4Participacion
            participacion={compra.participacion}
            proveedores={proveedores}
            loading={loadingCatalogos}
            onToggleProveedor={onToggleProveedor}
            {...pasoProps}
          />
        )}
        {pasoActual === 4 && (
          <Paso5Revision
            compra={compra}
            areas={areas}
            modalidades={modalidades}
            proveedores={proveedores}
            onEditar={irAPaso}
          />
        )}
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleAnterior}
          disabled={pasoActual === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-tenant-border/40 text-tenant-muted text-sm font-semibold hover:text-tenant-text hover:border-tenant-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>

        {esUltimoPaso ? (
          <button
            type="button"
            onClick={handlePublicar}
            disabled={publicando}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tenant-accent/20 border border-tenant-accent/50 text-tenant-accent text-sm font-bold hover:bg-tenant-accent/30 transition-all shadow-neon-accent disabled:opacity-50"
          >
            {publicando
              ? <span className="w-4 h-4 rounded-full border-2 border-tenant-accent border-t-transparent animate-spin" />
              : <Rocket className="w-4 h-4" />
            }
            Publicar Expediente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSiguiente}
            disabled={bloqueadoPorModalidades}
            title={bloqueadoPorModalidades ? 'Configure las modalidades de contratación para continuar' : undefined}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all',
              'bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary hover:bg-tenant-primary/30 shadow-neon',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
            )}
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

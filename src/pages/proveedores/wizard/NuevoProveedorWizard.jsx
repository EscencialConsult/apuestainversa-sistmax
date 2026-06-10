import { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { WizardPasos } from '../../../components/atoms/WizardPasos'
import { getRubros } from '../../../services/api/catalogosService'
import { verificarConstanciaArca } from '../../../services/api/arcaService'
import {
  PASOS_PROVEEDOR, ARCA_ESTADOS, initialProveedor,
  proveedorReducer, validarPasoProveedor,
} from './wizardProveedorReducer'
import { Paso1Fiscal } from './Paso1Fiscal'
import { Paso2Comercial } from './Paso2Comercial'
import { Paso3Rubros } from './Paso3Rubros'
import { Paso4RevisionProveedor } from './Paso4RevisionProveedor'

export function NuevoProveedorWizard() {
  const navigate = useNavigate()

  const [proveedor, dispatch] = useReducer(proveedorReducer, initialProveedor)
  const [pasoActual, setPasoActual] = useState(0)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [rubros, setRubros] = useState([])
  const [loadingRubros, setLoadingRubros] = useState(true)

  useEffect(() => {
    let cancelado = false
    getRubros()
      .then(r => !cancelado && setRubros(r))
      .finally(() => !cancelado && setLoadingRubros(false))
    return () => { cancelado = true }
  }, [])

  const onChange = (paso, campo, valor) => {
    dispatch({ type: 'SET_CAMPO', paso, campo, valor })
    if (errores[campo]) {
      setErrores(prev => {
        const next = { ...prev }
        delete next[campo]
        return next
      })
    }
  }

  const handleVerificarArca = async () => {
    dispatch({ type: 'SET_ARCA', arca: { estado: ARCA_ESTADOS.VERIFICANDO, error: null } })
    setErrores(prev => { const n = { ...prev }; delete n.arca; return n })
    try {
      const datos = await verificarConstanciaArca(proveedor.fiscal.cuit)
      dispatch({ type: 'ARCA_VERIFICADO', datos })
    } catch (err) {
      // Falla de ARCA → habilita el camino de contingencia manual
      dispatch({ type: 'SET_ARCA', arca: { estado: ARCA_ESTADOS.FALLIDO, error: err.message } })
    }
  }

  const handleToggleContingencia = () => dispatch({ type: 'TOGGLE_CONTINGENCIA' })
  const handleConstanciaPdf = (file) => {
    dispatch({ type: 'SET_CAMPO', paso: 'fiscal', campo: 'constanciaPdf', valor: file })
    setErrores(prev => { const n = { ...prev }; delete n.arca; return n })
  }
  const handleToggleRubro = (id) => dispatch({ type: 'TOGGLE_RUBRO', id })

  const esUltimoPaso = pasoActual === PASOS_PROVEEDOR.length - 1
  const bloqueadoPorRubros = pasoActual === 2 && !loadingRubros && rubros.length === 0

  const handleSiguiente = () => {
    const errs = validarPasoProveedor(pasoActual, proveedor, { rubros })
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

  const handleEnviar = async () => {
    setEnviando(true)
    try {
      // TODO backend: apiClient.post('/proveedores', proveedor)
      await new Promise(r => setTimeout(r, 800))
      setEnviado(true)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    const porContingencia = proveedor.fiscal.contingenciaManual
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center animate-fade-in">
        <div className="p-4 rounded-2xl bg-tenant-success/10 border border-tenant-success/30 shadow-[0_0_24px_rgb(var(--color-success)/0.3)]">
          <CheckCircle2 className="w-12 h-12 text-tenant-success" />
        </div>
        <h2 className="text-xl font-bold text-tenant-text">Proveedor registrado</h2>
        <p className="text-sm text-tenant-muted max-w-md">
          {porContingencia
            ? 'El registro fue enviado con constancia manual: quedará en estado "En Revisión" hasta que el Evaluador Documental valide la documentación.'
            : 'El proveedor fue registrado con constancia fiscal verificada en ARCA.'}
        </p>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate('/proveedores')}
            className="px-4 py-2 rounded-xl bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary text-sm font-semibold hover:bg-tenant-primary/30 transition-all shadow-neon"
          >
            Ver proveedores
          </button>
          <button
            type="button"
            onClick={() => { dispatch({ type: 'RESET' }); setPasoActual(0); setEnviado(false) }}
            className="px-4 py-2 rounded-xl border border-tenant-border/40 text-tenant-muted text-sm font-semibold hover:text-tenant-text hover:border-tenant-primary/30 transition-all"
          >
            Registrar otro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-tenant-text">Alta de Proveedor</h1>
        <p className="text-sm text-tenant-muted mt-1">
          Registro guiado con validación fiscal ARCA
        </p>
      </div>

      <WizardPasos
        pasos={PASOS_PROVEEDOR}
        pasoActual={pasoActual}
        onPasoClick={irAPaso}
      />

      <div className="p-6 rounded-2xl bg-tenant-surface/40 backdrop-blur-glass border border-tenant-border/30 animate-fade-in" key={pasoActual}>
        {pasoActual === 0 && (
          <Paso1Fiscal
            fiscal={proveedor.fiscal}
            errores={errores}
            onChange={onChange}
            onVerificarArca={handleVerificarArca}
            onToggleContingencia={handleToggleContingencia}
            onConstanciaPdf={handleConstanciaPdf}
          />
        )}
        {pasoActual === 1 && (
          <Paso2Comercial comercial={proveedor.comercial} errores={errores} onChange={onChange} />
        )}
        {pasoActual === 2 && (
          <Paso3Rubros
            rubrosSeleccionados={proveedor.rubros.seleccionados}
            rubros={rubros}
            loading={loadingRubros}
            errores={errores}
            onToggleRubro={handleToggleRubro}
          />
        )}
        {pasoActual === 3 && (
          <Paso4RevisionProveedor proveedor={proveedor} rubros={rubros} onEditar={irAPaso} />
        )}
      </div>

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
            onClick={handleEnviar}
            disabled={enviando}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tenant-accent/20 border border-tenant-accent/50 text-tenant-accent text-sm font-bold hover:bg-tenant-accent/30 transition-all shadow-neon-accent disabled:opacity-50"
          >
            {enviando
              ? <span className="w-4 h-4 rounded-full border-2 border-tenant-accent border-t-transparent animate-spin" />
              : <UserCheck className="w-4 h-4" />
            }
            Registrar Proveedor
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSiguiente}
            disabled={bloqueadoPorRubros}
            title={bloqueadoPorRubros ? 'Configure el nomenclador de rubros para continuar' : undefined}
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

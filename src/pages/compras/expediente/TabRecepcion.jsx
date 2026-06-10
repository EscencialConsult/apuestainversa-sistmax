import { useState } from 'react'
import { CheckCircle2, FileCheck, Download, Settings, Loader2, AlertTriangle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { EmptyState } from '../../../components/ui/EmptyState'

const FECHA_FORMAT = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' })
const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

const inputCls = cn(
  'text-xs rounded-xl px-3 py-2 w-full',
  'bg-tenant-surface/60 border border-tenant-border/40',
  'text-tenant-text placeholder:text-tenant-muted',
  'focus:outline-none focus:border-tenant-primary/50 transition-colors',
)
const labelCls = 'text-[10px] uppercase tracking-wider font-bold text-tenant-muted mb-1 block'

// Sustituye {{VARIABLES}} en texto plano (para visor y descarga)
function renderizarConformidad(texto, variables) {
  if (!texto) return null
  const partes = texto.split(/(\{\{[A-Z_]+\}\})/g)
  return partes.map((parte, i) => {
    const match = parte.match(/^\{\{([A-Z_]+)\}\}$/)
    if (!match) return parte
    const clave = `{{${match[1]}}}`
    const valor = variables[clave] ?? parte
    return (
      <mark key={i} className="bg-tenant-accent/20 text-tenant-text rounded px-0.5 not-italic">
        {valor}
      </mark>
    )
  })
}

function sustituirConformidad(texto, variables) {
  return Object.entries(variables).reduce(
    (t, [k, v]) => t.replaceAll(k, v),
    texto,
  )
}

// ── Visor del acta ya firmada ─────────────────────────────────────────────────

function VisorActa({ plantilla, variables, numActa, expedienteNum }) {
  const [descargando, setDescargando] = useState(false)

  const handleDescargar = () => {
    setDescargando(true)
    setTimeout(() => {
      const texto = sustituirConformidad(plantilla, variables)
      const blob  = new Blob(['﻿' + texto], { type: 'text/plain;charset=utf-8' })
      const url   = URL.createObjectURL(blob)
      const a     = document.createElement('a')
      a.href      = url
      a.download  = `Acta_Recepcion_${expedienteNum}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDescargando(false)
    }, 600)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
          Acta N.° {numActa} · Documento de Conformidad
        </p>
        <button
          type="button"
          disabled={descargando}
          onClick={handleDescargar}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
            'bg-tenant-primary/15 border border-tenant-primary/30 text-tenant-primary',
            'hover:bg-tenant-primary/25 shadow-neon disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <Download className={cn('w-3.5 h-3.5', descargando && 'animate-pulse')} />
          {descargando ? 'Generando...' : 'Descargar .txt'}
        </button>
      </div>
      <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-tenant-border/20 shadow-glass overflow-hidden">
        <div className="px-4 py-2 bg-tenant-surface/40 border-b border-tenant-border/20 flex items-center gap-2">
          <FileCheck className="w-3.5 h-3.5 text-tenant-success" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-tenant-muted">
            Acta de Recepción Conforme
          </span>
        </div>
        <pre className="p-6 md:p-8 text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 overflow-x-auto">
          {renderizarConformidad(plantilla, variables)}
        </pre>
      </div>
    </div>
  )
}

// ── Formulario de recepción ───────────────────────────────────────────────────

const FORM_INITIAL = {
  fechaRecepcion:      '',
  lugarRecepcion:      '',
  responsableRecepcion: '',
  observaciones:       '',
}

export function TabRecepcion({ expediente, plantillaConformidad, onRegistrar, enviando, municipio }) {
  const [form, setForm]         = useState(FORM_INITIAL)
  const [formError, setFormError] = useState('')

  // Si ya hay recepción registrada, mostrar el acta
  if (expediente.recepcion) {
    const variables = {
      '{{NUMERO_ACTA}}':            expediente.recepcion.numActa,
      '{{ANIO}}':                   new Date(expediente.recepcion.timestamp).getFullYear().toString(),
      '{{NOMBRE_MUNICIPIO}}':       municipio ?? 'MUNICIPIO',
      '{{NUMERO_EXPEDIENTE}}':      expediente.expedienteNum,
      '{{OBJETO_CONTRATACION}}':    expediente.titulo,
      '{{AREA}}':                   expediente.area,
      '{{RAZON_SOCIAL_GANADOR}}':   expediente.ganador.razonSocial,
      '{{CUIT_GANADOR}}':           expediente.ganador.cuit,
      '{{MONTO_ADJUDICADO}}':       CURRENCY_FORMAT.format(expediente.montoAdjudicado),
      '{{FECHA_RECEPCION}}':        expediente.recepcion.fechaRecepcion,
      '{{RESPONSABLE_RECEPCION}}':  expediente.recepcion.responsableRecepcion,
      '{{LUGAR_RECEPCION}}':        expediente.recepcion.lugarRecepcion,
      '{{OBSERVACIONES_RECEPCION}}': expediente.recepcion.observaciones || 'Sin observaciones.',
    }
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-tenant-success/8 border border-tenant-success/25">
          <CheckCircle2 className="w-5 h-5 text-tenant-success flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-tenant-success">Recepción registrada</p>
            <p className="text-[11px] text-tenant-muted mt-0.5">
              Acta N.° {expediente.recepcion.numActa} · {FECHA_FORMAT.format(new Date(expediente.recepcion.timestamp))}
            </p>
          </div>
        </div>
        <VisorActa
          plantilla={plantillaConformidad}
          variables={variables}
          numActa={expediente.recepcion.numActa}
          expedienteNum={expediente.expedienteNum}
        />
      </div>
    )
  }

  // ── DIRECTIVA INNEGOCIABLE: sin plantilla de conformidad → EmptyState bloqueante
  if (!plantillaConformidad) {
    return (
      <div className="space-y-5">
        <EmptyState
          isMandatory
          icon={Settings}
          title="Modelo de Conformidad no configurado"
          description="El municipio aún no ha cargado el modelo oficial de Acta de Recepción Conforme. No es posible registrar ni cerrar el expediente hasta que el administrador configure esta plantilla."
          actionLabel="Ir a Configuración"
          onAction={() => {}}
        />
        <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/25 text-[11px] text-tenant-muted space-y-1">
          <p className="font-bold text-tenant-text">¿Por qué aparece este bloqueo?</p>
          <p>El sistema requiere una plantilla oficial para generar el Acta de Recepción Conforme con valor legal. Sin ella no se puede emitir el documento de cierre del expediente.</p>
          <p className="mt-2 font-mono text-[10px] text-tenant-accent">Demo: quitar ?sinDocConformidad de la URL para ver el formulario de recepción.</p>
        </div>
      </div>
    )
  }

  // ── Formulario de registro de recepción ───────────────────────────────────

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
    if (formError) setFormError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.fechaRecepcion || !form.lugarRecepcion || !form.responsableRecepcion) {
      setFormError('Completá los campos obligatorios: fecha, lugar y responsable.')
      return
    }
    onRegistrar(form)
  }

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-tenant-surface/40 border border-tenant-border/30 backdrop-blur-glass space-y-4">
        <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
          Registrar Entrega de Bienes/Servicios
        </p>
        <p className="text-[11px] text-tenant-muted">
          Completá el formulario para generar el <strong className="text-tenant-text">Acta de Recepción Conforme</strong>. Este acto da cierre administrativo al expediente.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaRecepcion" className={labelCls}>
                Fecha de recepción <span className="text-tenant-danger">*</span>
              </label>
              <input
                id="fechaRecepcion"
                type="date"
                value={form.fechaRecepcion}
                onChange={e => handleChange('fechaRecepcion', e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label htmlFor="responsableRecepcion" className={labelCls}>
                Funcionario receptor <span className="text-tenant-danger">*</span>
              </label>
              <input
                id="responsableRecepcion"
                type="text"
                value={form.responsableRecepcion}
                onChange={e => handleChange('responsableRecepcion', e.target.value)}
                placeholder="Nombre y cargo del receptor..."
                className={inputCls}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="lugarRecepcion" className={labelCls}>
              Lugar de recepción <span className="text-tenant-danger">*</span>
            </label>
            <input
              id="lugarRecepcion"
              type="text"
              value={form.lugarRecepcion}
              onChange={e => handleChange('lugarRecepcion', e.target.value)}
              placeholder="Ej: Depósito Central — Av. Belgrano 1234, San Miguel de Tucumán"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label htmlFor="observacionesRecepcion" className={labelCls}>Observaciones</label>
            <textarea
              id="observacionesRecepcion"
              value={form.observaciones}
              onChange={e => handleChange('observaciones', e.target.value)}
              placeholder="Condición de los bienes, faltantes, observaciones del receptor..."
              rows={3}
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          {formError && (
            <p className="flex items-center gap-1.5 text-[11px] text-tenant-danger">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className={cn(
              'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
              'text-sm font-bold transition-all',
              'bg-tenant-success/20 border border-tenant-success/40 text-tenant-success',
              'hover:bg-tenant-success/30 shadow-[0_0_15px_rgb(var(--color-success)/0.25)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {enviando
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Registrando acta...</>
              : <><FileCheck className="w-4 h-4" /> Registrar Recepción y Generar Acta</>
            }
          </button>
        </form>
      </div>
    </div>
  )
}

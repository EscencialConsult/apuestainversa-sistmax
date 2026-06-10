import { useState, useMemo } from 'react'
import { FileText, FileCheck, AlertTriangle, Download, Settings } from 'lucide-react'
import { cn } from '../../utils/cn'
import { EmptyState } from '../../components/ui/EmptyState'
import { TIPOS_PLANTILLA } from '../../services/api/adjudicacionService'

const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})
const FECHA_FORMAT = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'long',
})

// Convierte enteros a pesos argentinos en letras (rango 0–9.999.999)
const UNO_19   = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
  'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
const DECENAS  = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
  'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']
const VEINTI = { 21: 'VEINTIÚN', 22: 'VEINTIDÓS', 23: 'VEINTITRÉS', 24: 'VEINTICUATRO',
  25: 'VEINTICINCO', 26: 'VEINTISÉIS', 27: 'VEINTISIETE', 28: 'VEINTIOCHO', 29: 'VEINTINUEVE' }

function grupo3(n) {
  if (n === 0) return ''
  const c = Math.floor(n / 100), r = n % 100
  const centena = c > 0 ? (c === 1 && r === 0 ? 'CIEN' : CENTENAS[c]) : ''
  let rest = ''
  if (r > 0) {
    if (r < 20) rest = UNO_19[r]
    else if (VEINTI[r]) rest = VEINTI[r]
    else { const d = Math.floor(r / 10), u = r % 10; rest = u ? `${DECENAS[d]} Y ${UNO_19[u]}` : DECENAS[d] }
  }
  return [centena, rest].filter(Boolean).join(' ')
}

function montoEnLetras(n) {
  if (n === 0) return 'CERO PESOS'
  const M = Math.floor(n / 1_000_000), m = Math.floor((n % 1_000_000) / 1_000), r = n % 1_000
  const partes = []
  if (M > 0) partes.push(M === 1 ? 'UN MILLÓN' : `${grupo3(M)} MILLONES`)
  if (m > 0) partes.push(m === 1 ? 'MIL' : `${grupo3(m)} MIL`)
  if (r > 0) partes.push(grupo3(r))
  return `${partes.join(' ')} PESOS`
}

// Renderiza el texto de la plantilla en JSX con variables resaltadas
function renderizarPlantilla(texto, variables) {
  const partes = texto.split(/(\{\{[A-Z_]+\}\})/g)
  return partes.map((parte, i) => {
    if (/^\{\{[A-Z_]+\}\}$/.test(parte)) {
      return (
        <mark
          key={i}
          className="bg-tenant-accent/20 text-tenant-accent font-semibold not-italic px-0.5 rounded-sm"
        >
          {variables[parte] ?? parte}
        </mark>
      )
    }
    return parte
  })
}

// Sustituye variables en texto plano (para descarga)
function sustituirVariables(plantilla, variables) {
  return Object.entries(variables).reduce(
    (text, [key, val]) => text.replaceAll(key, val),
    plantilla,
  )
}

const TABS = [
  { key: TIPOS_PLANTILLA.CONTRATO, label: 'Resolución de Adjudicación', icon: FileCheck },
  { key: TIPOS_PLANTILLA.ORDEN,    label: 'Orden de Compra',            icon: FileText  },
]

export function VisorPlantillas({ plantillas, expediente, tenant }) {
  const [tab, setTab] = useState(TIPOS_PLANTILLA.CONTRATO)
  const [descargando, setDescargando] = useState(false)

  const variables = useMemo(() => ({
    '{{NUMERO_EXPEDIENTE}}':    expediente.expedienteNum,
    '{{OBJETO_CONTRATACION}}':  expediente.titulo,
    '{{RAZON_SOCIAL_GANADOR}}': expediente.ganador.razonSocial,
    '{{CUIT_GANADOR}}':         expediente.ganador.cuit,
    '{{MONTO_ADJUDICADO}}':     CURRENCY_FORMAT.format(expediente.montoAdjudicado),
    '{{MONTO_ADJUDICADO_LETRAS}}': montoEnLetras(expediente.montoAdjudicado),
    '{{FECHA_ADJUDICACION}}':   FECHA_FORMAT.format(new Date(expediente.fechaSubasta)),
    '{{NOMBRE_MUNICIPIO}}':     tenant?.name ?? 'MUNICIPIO',
    '{{AUTORIDAD}}':            expediente.autoridad,
    '{{NUMERO_CONTRATO}}':      expediente.numeroContrato,
    '{{ANIO}}':                 new Date(expediente.fechaSubasta).getFullYear().toString(),
  }), [expediente, tenant])

  const plantillaActual = plantillas[tab]
  const tipoLabel = TABS.find(t => t.key === tab)?.label ?? tab

  const handleDescargar = () => {
    if (!plantillaActual) return
    setDescargando(true)
    setTimeout(() => {
      const texto = sustituirVariables(plantillaActual, variables)
      const blob = new Blob(['﻿' + texto], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tipoLabel.replace(/ /g, '_')}_${expediente.expedienteNum}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDescargando(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-tenant-surface/40 border border-tenant-border/30 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              tab === key
                ? 'bg-tenant-primary/20 border border-tenant-primary/40 text-tenant-primary shadow-neon'
                : 'text-tenant-muted hover:text-tenant-text hover:bg-white/5',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Visor */}
      {plantillaActual === null ? (
        <EmptyState
          isMandatory
          icon={Settings}
          title="Modelo oficial no configurado"
          description={`La Municipalidad no ha cargado el modelo oficial de "${tipoLabel}". El documento no puede generarse hasta que el Administrador del Sistema parametrice esta plantilla desde el módulo de Configuración.`}
          actionLabel="Ir a Configuración"
          onAction={() => {}}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {/* Acciones */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
              Vista previa · Las variables resaltadas son datos reales del expediente
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

          {/* Papel del documento */}
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-tenant-border/20 shadow-glass overflow-hidden">
            <div className="px-4 py-2 bg-tenant-surface/40 border-b border-tenant-border/20 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-tenant-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-tenant-muted">
                {tipoLabel}
              </span>
            </div>
            <pre className={cn(
              'p-6 md:p-8 text-xs leading-relaxed whitespace-pre-wrap font-sans',
              'text-slate-800 dark:text-slate-200 overflow-x-auto',
            )}>
              {renderizarPlantilla(plantillaActual, variables)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

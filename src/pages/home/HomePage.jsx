import { Link } from 'react-router-dom'
import {
  Globe, LogIn, ShieldCheck, Zap, FileText,
  Users, Lock, ArrowRight, Award, ChevronRight,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'

// ── Datos estáticos ───────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon:  Zap,
    titulo: 'Subasta inversa en tiempo real',
    desc:   'Reloj regresivo con anti-sniper. Actualizaciones WebSocket en vivo sin recarga de página.',
  },
  {
    icon:  Globe,
    titulo: 'Portal ciudadano público',
    desc:   'Adjudicaciones y documentos oficiales accesibles sin cuenta de usuario.',
  },
  {
    icon:  FileText,
    titulo: 'Documentación automática',
    desc:   'Resoluciones, órdenes de compra y actas conforme generadas con variables reales del expediente.',
  },
  {
    icon:  ShieldCheck,
    titulo: 'Auditoría inmutable',
    desc:   'Bitácora completa que ningún operador puede editar ni eliminar.',
  },
  {
    icon:  Users,
    titulo: 'Control multi-rol (8 perfiles)',
    desc:   'Cada actor accede solo a lo que le corresponde por normativa.',
  },
  {
    icon:  Lock,
    titulo: '100% on-premise',
    desc:   'Instalado en servidores del municipio. Los datos nunca salen de la infraestructura local.',
  },
]

const PASOS = [
  'Registro de proveedores',
  'Expediente de compra',
  'Subasta inversa',
  'Adjudicación',
  'Acta de recepción',
]

// ── Componentes de módulo ─────────────────────────────────────────────────────

function FeatureRow({ icon: Icon, titulo, desc }) {
  return (
    <div className="flex gap-3 py-4">
      <div className="mt-0.5 p-2 rounded-lg bg-tenant-primary/10 border border-tenant-primary/20 w-fit h-fit flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-tenant-primary" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-tenant-text text-balance">{titulo}</p>
        <p className="text-[11px] text-tenant-muted leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { tenant } = useTenant()

  return (
    <div className="space-y-16 pb-8">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="text-center pt-10 pb-2 space-y-5">
        {/* Marca ONE — operador de la plataforma */}
        <div className="flex justify-center">
          <img
            src="/imgone/one-logocolor-convertido-de-png.webp"
            alt="ONE"
            className="h-10 w-auto"
          />
        </div>

        <div className="space-y-2.5">
          <h1
            className="text-5xl sm:text-6xl font-black text-tenant-primary"
            style={{ letterSpacing: '-0.02em' }}
          >
            SICST MAX
          </h1>
          <p className="text-base font-semibold text-tenant-text text-balance">
            Sistema Integral de Compras y Subastas Transparentes
          </p>
          <p className="text-sm text-tenant-muted max-w-md mx-auto leading-relaxed">
            Plataforma oficial de licitaciones públicas de{' '}
            <span className="font-semibold text-tenant-text">
              {tenant?.name ?? 'este municipio'}
            </span>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
          <Link
            to="/login"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-2xl',
              'text-sm font-bold transition-colors',
              'bg-tenant-primary/20 border border-tenant-primary/50 text-tenant-primary',
              'hover:bg-tenant-primary/30 shadow-neon',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tenant-primary/60',
            )}
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Ingresar al Sistema
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            to="/portal"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-2xl',
              'text-sm font-bold transition-colors',
              'bg-tenant-surface/60 border border-tenant-border/40 text-tenant-muted',
              'hover:text-tenant-text hover:border-tenant-border/70',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tenant-border/60',
            )}
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            Portal Ciudadano
          </Link>
        </div>
      </section>

      {/* ── PROCESO + DESCRIPCIÓN ─────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-tenant-text text-balance">
            Digitalización integral del gasto público
          </h2>
          <p className="text-sm text-tenant-muted leading-relaxed">
            SICST MAX conecta todos los actores del proceso licitatorio en una única
            plataforma: proveedores verificados ante ARCA/AFIP, compradores municipales,
            evaluadores, autoridades aprobadoras y ciudadanos. Cada expediente avanza
            por un flujo normado, auditable y sin papel.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-tenant-muted uppercase tracking-widest mb-3">
            Flujo del proceso
          </p>
          <ol className="space-y-0">
            {PASOS.map((paso, i) => (
              <li
                key={paso}
                className="flex items-center gap-3 py-2.5 border-b border-tenant-border/20 last:border-0"
              >
                <span className="text-[11px] font-black text-tenant-primary w-5 flex-shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-tenant-text">{paso}</span>
                {i < PASOS.length - 1 && (
                  <ChevronRight
                    className="w-3 h-3 text-tenant-muted ml-auto flex-shrink-0 opacity-40"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-tenant-text text-balance">
          Todo lo que el municipio necesita
        </h2>
        {/* 2 columnas — cada columna tiene su propio divide-y para evitar grilla de tarjetas idénticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
          <div className="divide-y divide-tenant-border/20">
            {FEATURES.slice(0, 3).map(f => <FeatureRow key={f.titulo} {...f} />)}
          </div>
          <div className="divide-y divide-tenant-border/20 border-t border-tenant-border/20 sm:border-t-0">
            {FEATURES.slice(3).map(f => <FeatureRow key={f.titulo} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── PORTAL CTA ────────────────────────────────────────────────────── */}
      <section className="flex items-start gap-5 p-6 rounded-2xl border border-tenant-accent/20 bg-tenant-accent/[0.06]">
        <div className="p-2.5 rounded-xl bg-tenant-accent/15 border border-tenant-accent/25 flex-shrink-0 mt-0.5">
          <Award className="w-4 h-4 text-tenant-accent" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-tenant-text text-balance">
            Portal de Transparencia Ciudadana
          </h3>
          <p className="text-[11px] text-tenant-muted leading-relaxed">
            Consultá los procesos adjudicados y montos pagados. Descargá documentos
            oficiales sin necesidad de cuenta.
          </p>
          <Link
            to="/portal"
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-bold text-tenant-accent',
              'hover:underline',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tenant-accent/60 rounded',
            )}
          >
            Ver procesos publicados
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </section>

    </div>
  )
}

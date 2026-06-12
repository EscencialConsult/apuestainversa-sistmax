import { Link } from 'react-router-dom'
import {
  Globe, LogIn, ShieldCheck, Zap, FileText, BarChart3,
  Users, Lock, ArrowRight, Award,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'

// ── Datos estáticos ───────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon:  Zap,
    titulo: 'Subasta Inversa en Tiempo Real',
    desc:  'Motor de licitaciones con reloj regresivo, actualizaciones en vivo y mecanismo anti-sniper que extiende automáticamente la sesión ante ofertas de último segundo.',
  },
  {
    icon:  Globe,
    titulo: 'Portal Ciudadano Público',
    desc:  'Cualquier ciudadano puede consultar procesos adjudicados, montos, proveedores ganadores y descargar los documentos oficiales sin necesidad de cuenta.',
  },
  {
    icon:  FileText,
    titulo: 'Documentación Automática',
    desc:  'Resoluciones de adjudicación, órdenes de compra y actas de recepción conforme se generan automáticamente con las variables reales de cada expediente.',
  },
  {
    icon:  ShieldCheck,
    titulo: 'Auditoría Inmutable',
    desc:  'Bitácora completa de cada acción en el sistema. Ningún registro puede modificarse ni eliminarse. Accesible para el rol auditor en tiempo real.',
  },
  {
    icon:  Users,
    titulo: 'Control Multi-Rol',
    desc:  'Ocho roles diferenciados: comprador, proveedor, evaluador, auditor, autoridad aprobadora y más. Cada actor ve y puede hacer exactamente lo que le corresponde.',
  },
  {
    icon:  Lock,
    titulo: '100% On-Premise',
    desc:  'Instalado en los servidores físicos del municipio. Los datos nunca salen de la infraestructura local. Sin dependencias de servicios cloud externos.',
  },
]

const STATS = [
  { valor: '8',    label: 'Roles de usuario' },
  { valor: '100%', label: 'Trazabilidad' },
  { valor: '0',    label: 'Dependencias cloud' },
]

// ── Componentes locales ───────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, titulo, desc }) {
  return (
    <div className={cn(
      'p-5 rounded-2xl border backdrop-blur-glass space-y-3',
      'bg-tenant-surface/40 border-tenant-border/30',
      'hover:border-tenant-primary/40 transition-colors',
    )}>
      <div className="p-2.5 rounded-xl bg-tenant-primary/15 border border-tenant-primary/30 w-fit">
        <Icon className="w-4 h-4 text-tenant-primary" />
      </div>
      <p className="text-sm font-bold text-tenant-text">{titulo}</p>
      <p className="text-[11px] text-tenant-muted leading-relaxed">{desc}</p>
    </div>
  )
}

function StatBadge({ valor, label }) {
  return (
    <div className="text-center px-6 py-4 rounded-2xl bg-tenant-surface/30 border border-tenant-border/20">
      <p className="text-2xl font-black text-tenant-primary">{valor}</p>
      <p className="text-[11px] text-tenant-muted mt-0.5">{label}</p>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { tenant } = useTenant()

  return (
    <div className="space-y-16 pb-8">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="text-center py-12 space-y-6">
        <div className="flex justify-center">
          <div className={cn(
            'p-4 rounded-2xl',
            'bg-tenant-primary/15 border border-tenant-primary/30',
            'shadow-[0_0_40px_rgb(var(--color-primary)/0.25)]',
          )}>
            <BarChart3 className="w-10 h-10 text-tenant-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className={cn(
            'text-4xl sm:text-5xl font-black tracking-tight',
            'bg-gradient-to-r from-tenant-primary via-tenant-secondary to-tenant-accent',
            'bg-clip-text text-transparent',
          )}>
            SICST MAX
          </h1>
          <p className="text-base font-semibold text-tenant-text">
            Sistema Integral de Compras y Subastas Transparentes
          </p>
          <p className="text-sm text-tenant-muted max-w-lg mx-auto leading-relaxed">
            Plataforma oficial de compras públicas digitales de{' '}
            <span className="font-bold text-tenant-text">
              {tenant?.name ?? 'este municipio'}
            </span>.
            Subasta inversa en tiempo real, control documental completo
            y transparencia total para el ciudadano.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          <Link
            to="/login"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-2xl',
              'text-sm font-bold transition-all',
              'bg-tenant-primary/20 border border-tenant-primary/50 text-tenant-primary',
              'hover:bg-tenant-primary/30 shadow-neon',
            )}
          >
            <LogIn className="w-4 h-4" />
            Ingresar al Sistema
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/portal"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-2xl',
              'text-sm font-bold transition-all',
              'bg-tenant-surface/60 border border-tenant-border/40 text-tenant-muted',
              'hover:text-tenant-text hover:border-tenant-border/70',
            )}
          >
            <Globe className="w-4 h-4" />
            Portal Ciudadano
          </Link>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
        {STATS.map(s => <StatBadge key={s.label} valor={s.valor} label={s.label} />)}
      </section>

      {/* ── QUÉ ES ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
            Acerca del sistema
          </p>
          <h2 className="text-xl font-bold text-tenant-text">
            ¿Qué es SICST MAX?
          </h2>
        </div>
        <div className={cn(
          'p-6 rounded-2xl border backdrop-blur-glass',
          'bg-tenant-surface/40 border-tenant-border/30',
          'max-w-2xl mx-auto',
        )}>
          <p className="text-sm text-tenant-muted leading-relaxed text-center">
            SICST MAX digitaliza el proceso completo de adquisición pública: desde el
            registro de proveedores y la verificación automática ante ARCA/AFIP, hasta
            la subasta inversa en tiempo real, el circuito de aprobación con firma
            electrónica y la generación del acta de recepción conforme. Cada paso queda
            registrado en una bitácora inmutable, garantizando la trazabilidad total del
            gasto público y el cumplimiento de la normativa vigente.
          </p>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-tenant-muted">
            Funcionalidades
          </p>
          <h2 className="text-xl font-bold text-tenant-text">
            Todo lo que el municipio necesita
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => <FeatureCard key={f.titulo} {...f} />)}
        </div>
      </section>

      {/* ── PORTAL CIUDADANO CTA ─────────────────────────────────────────────── */}
      <section>
        <div className={cn(
          'p-8 rounded-2xl border backdrop-blur-glass text-center space-y-4',
          'bg-tenant-accent/8 border-tenant-accent/25',
          'shadow-[0_0_40px_rgb(var(--color-accent)/0.1)]',
        )}>
          <div className="flex justify-center">
            <div className="p-3 rounded-xl bg-tenant-accent/15 border border-tenant-accent/30">
              <Award className="w-6 h-6 text-tenant-accent" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-tenant-text">
              ¿Sos ciudadano de {tenant?.shortName ?? 'este municipio'}?
            </h3>
            <p className="text-sm text-tenant-muted mt-1 max-w-md mx-auto">
              Consultá los procesos adjudicados, los montos pagados y descargá los
              documentos oficiales sin necesidad de crear una cuenta.
            </p>
          </div>
          <Link
            to="/portal"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl',
              'text-sm font-bold transition-all',
              'bg-tenant-accent/15 border border-tenant-accent/35 text-tenant-accent',
              'hover:bg-tenant-accent/25',
            )}
          >
            <Globe className="w-4 h-4" />
            Acceder al Portal de Transparencia
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  )
}

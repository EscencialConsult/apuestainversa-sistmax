import { Link } from 'react-router-dom'
import {
  Globe, LogIn, ShieldCheck, Zap, FileText,
  Users, Lock, ArrowRight, Award, ChevronRight,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useTenant } from '../../contexts/TenantContext'

// ── Datos ──────────────────────────────────────────────────────────────────────

const PASOS = [
  'Registro de proveedores',
  'Expediente de compra',
  'Subasta inversa en tiempo real',
  'Adjudicación y firma',
  'Acta de recepción conforme',
]

// 6 features para el bento grid — distintos col-span para romper la grilla idéntica
const BENTO = [
  {
    cols: 'sm:col-span-2',
    icon: Zap,
    titulo: 'Subasta inversa en tiempo real',
    desc:  'Motor de licitaciones con reloj regresivo y mecanismo anti-sniper. Las ofertas llegan vía WebSocket sin recarga de página. La sesión se extiende automáticamente ante posturas de último segundo.',
    featured: true,
  },
  {
    cols: 'sm:col-span-1',
    icon: Globe,
    titulo: 'Portal ciudadano',
    desc:  'Adjudicaciones y documentos accesibles sin cuenta de usuario.',
    featured: false,
    accent: true,
  },
  {
    cols: 'sm:col-span-1',
    icon: FileText,
    titulo: 'Documentación automática',
    desc:  'Resoluciones y OC generadas con los datos reales de cada expediente.',
    featured: false,
  },
  {
    cols: 'sm:col-span-1',
    icon: ShieldCheck,
    titulo: 'Auditoría inmutable',
    desc:  'Bitácora que ningún operador puede editar ni borrar.',
    featured: false,
  },
  {
    cols: 'sm:col-span-1',
    icon: Users,
    titulo: 'Multi-rol (8 perfiles)',
    desc:  'Cada actor accede exactamente a lo que le corresponde por normativa.',
    featured: false,
  },
]

// ── Sub-componentes de módulo ──────────────────────────────────────────────────

function BentoCell({ icon: Icon, titulo, desc, featured, accent }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-5 flex flex-col gap-3 transition-colors',
        featured
          ? 'border-[rgb(var(--color-primary)/0.3)] bg-[rgb(var(--color-primary)/0.07)] hover:border-[rgb(var(--color-primary)/0.45)]'
          : accent
            ? 'border-[rgb(var(--color-accent)/0.25)] bg-[rgb(var(--color-accent)/0.06)] hover:border-[rgb(var(--color-accent)/0.4)]'
            : 'border-[rgb(var(--color-border)/0.6)] bg-[rgb(var(--color-surface)/0.5)] hover:border-[rgb(var(--color-border))]',
      )}
    >
      {/* Background icon for featured cell */}
      {featured && (
        <div
          className="absolute -bottom-6 -right-6 pointer-events-none"
          aria-hidden="true"
          style={{ color: 'rgb(var(--color-primary) / 0.06)' }}
        >
          <Icon className="w-40 h-40" />
        </div>
      )}

      <div
        className={cn(
          'w-fit p-2.5 rounded-lg border',
          featured
            ? 'bg-[rgb(var(--color-primary)/0.15)] border-[rgb(var(--color-primary)/0.3)]'
            : accent
              ? 'bg-[rgb(var(--color-accent)/0.15)] border-[rgb(var(--color-accent)/0.3)]'
              : 'bg-[rgb(var(--color-primary)/0.1)] border-[rgb(var(--color-primary)/0.2)]',
        )}
      >
        <Icon
          className={cn(
            featured ? 'w-5 h-5' : 'w-4 h-4',
          )}
          style={{
            color: featured
              ? 'rgb(var(--color-primary))'
              : accent
                ? 'rgb(var(--color-accent))'
                : 'rgb(var(--color-primary))',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative space-y-1.5">
        <p
          className={cn(
            'font-bold text-balance',
            featured ? 'text-base' : 'text-sm',
          )}
          style={{ color: 'rgb(var(--color-text))' }}
        >
          {titulo}
        </p>
        <p
          className={featured ? 'text-[12px] leading-relaxed' : 'text-[11px] leading-relaxed'}
          style={{ color: 'rgb(var(--color-muted))' }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

// ── Página ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { tenant } = useTenant()

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — full-width, full-viewport-height, ambient glow
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center"
        style={{ minHeight: 'calc(100vh - 3.5rem)', padding: '5rem 1.5rem 4rem' }}
      >
        {/* ── Background effects ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgb(var(--color-text) / 0.04) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Primary glow — centered top */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 110% 65% at 50% -5%, rgb(var(--color-primary) / 0.17) 0%, transparent 65%)',
            }}
          />
          {/* Secondary glow — right */}
          <div
            className="absolute top-1/4 -right-32 w-80 h-80 rounded-full blur-[100px]"
            style={{ background: 'rgb(var(--color-secondary) / 0.14)' }}
          />
          {/* Accent glow — lower left */}
          <div
            className="absolute bottom-1/4 -left-24 w-72 h-72 rounded-full blur-[90px]"
            style={{ background: 'rgb(var(--color-accent) / 0.1)' }}
          />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col items-center gap-7 max-w-3xl mx-auto w-full">

          {/* ONE brand mark */}
          <img
            src="/imgone/one-logocolor-convertido-de-png.webp"
            alt="ONE"
            className="h-11 w-auto"
          />

          {/* Main headline */}
          <div className="space-y-4">
            <h1
              className="font-black text-white leading-none"
              style={{
                fontSize: 'clamp(4rem, 12vw, 7.5rem)',
                letterSpacing: '-0.02em',
                textShadow:
                  '0 0 50px rgb(var(--color-primary) / 0.75), 0 0 120px rgb(var(--color-primary) / 0.35)',
              }}
            >
              SICST MAX
            </h1>
            <p
              className="text-lg sm:text-xl font-semibold text-balance"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Sistema Integral de Compras y Subastas Transparentes
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgb(var(--color-muted))' }}
            >
              Plataforma oficial de licitaciones públicas de{' '}
              <span
                className="font-semibold"
                style={{ color: 'rgb(var(--color-text))' }}
              >
                {tenant?.name ?? 'este municipio'}
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/login"
              className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl',
                'text-sm font-bold transition-colors',
                'border shadow-neon',
                'hover:opacity-90',
                'focus-visible:outline-none focus-visible:ring-2',
              )}
              style={{
                background: 'rgb(var(--color-primary) / 0.18)',
                borderColor: 'rgb(var(--color-primary) / 0.55)',
                color: 'rgb(var(--color-primary))',
              }}
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Ingresar al Sistema
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/portal"
              className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl',
                'text-sm font-bold transition-colors',
                'border',
                'hover:opacity-80',
                'focus-visible:outline-none focus-visible:ring-2',
              )}
              style={{
                background: 'rgb(var(--color-surface) / 0.6)',
                borderColor: 'rgb(var(--color-border) / 0.7)',
                color: 'rgb(var(--color-muted))',
              }}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              Portal Ciudadano
            </Link>
          </div>

        </div>

        {/* Fade-to-bg at bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgb(var(--color-bg)))',
          }}
          aria-hidden="true"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RESTO — contenedor centrado
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-20">

        {/* ── SOBRE EL SISTEMA ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2
              className="text-2xl font-bold text-balance"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Digitalización integral del gasto público
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgb(var(--color-muted))' }}
            >
              SICST MAX conecta todos los actores del proceso licitatorio en una única
              plataforma: proveedores verificados ante ARCA/AFIP, compradores municipales,
              evaluadores, autoridades aprobadoras y ciudadanos. Cada expediente avanza
              por un flujo normado, auditable y sin papel.
            </p>
          </div>

          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: 'rgb(var(--color-muted))' }}
            >
              Flujo del proceso
            </p>
            <ol>
              {PASOS.map((paso, i) => (
                <li
                  key={paso}
                  className="flex items-center gap-3 py-3 border-b last:border-0"
                  style={{ borderColor: 'rgb(var(--color-border) / 0.3)' }}
                >
                  <span
                    className="text-[11px] font-black w-5 flex-shrink-0 tabular-nums"
                    style={{ color: 'rgb(var(--color-primary))' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'rgb(var(--color-text))' }}
                  >
                    {paso}
                  </span>
                  {i < PASOS.length - 1 && (
                    <ChevronRight
                      className="w-3 h-3 ml-auto flex-shrink-0 opacity-30"
                      style={{ color: 'rgb(var(--color-muted))' }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FUNCIONALIDADES — bento grid con jerarquía visual ── */}
        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-balance"
            style={{ color: 'rgb(var(--color-text))' }}
          >
            Todo lo que el municipio necesita
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BENTO.map(cell => (
              <div key={cell.titulo} className={cn('col-span-1', cell.cols)}>
                <BentoCell {...cell} />
              </div>
            ))}
          </div>

          {/* On-premise — franja full-width, no una tarjeta más */}
          <div
            className="flex items-center gap-4 px-5 py-4 rounded-xl border"
            style={{
              borderColor: 'rgb(var(--color-border) / 0.4)',
              background: 'rgb(var(--color-surface) / 0.3)',
            }}
          >
            <div
              className="p-2 rounded-lg border flex-shrink-0"
              style={{
                background: 'rgb(var(--color-primary) / 0.1)',
                borderColor: 'rgb(var(--color-primary) / 0.2)',
              }}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: 'rgb(var(--color-primary))' }} aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                100% on-premise{' '}
              </span>
              <span className="text-sm" style={{ color: 'rgb(var(--color-muted))' }}>
                — instalado en servidores del municipio. Los datos nunca salen de la infraestructura local. Sin cargos de nube externa.
              </span>
            </div>
          </div>
        </section>

        {/* ── PORTAL CTA — horizontal, no una tarjeta adicional ── */}
        <section
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-xl border"
          style={{
            borderColor: 'rgb(var(--color-accent) / 0.25)',
            background: 'rgb(var(--color-accent) / 0.06)',
          }}
        >
          <div
            className="p-3 rounded-xl border flex-shrink-0"
            style={{
              background: 'rgb(var(--color-accent) / 0.15)',
              borderColor: 'rgb(var(--color-accent) / 0.3)',
            }}
          >
            <Award className="w-5 h-5" style={{ color: 'rgb(var(--color-accent))' }} aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-1">
            <h3
              className="text-sm font-bold text-balance"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Portal de Transparencia Ciudadana
            </h3>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgb(var(--color-muted))' }}>
              Consultá procesos adjudicados, montos pagados y descargá documentos
              oficiales sin necesidad de crear una cuenta.
            </p>
          </div>
          <Link
            to="/portal"
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl',
              'text-xs font-bold flex-shrink-0 transition-opacity hover:opacity-80',
              'focus-visible:outline-none focus-visible:ring-2',
            )}
            style={{
              background: 'rgb(var(--color-accent) / 0.15)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgb(var(--color-accent) / 0.3)',
              color: 'rgb(var(--color-accent))',
            }}
          >
            Ver procesos
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </section>

      </div>
    </>
  )
}

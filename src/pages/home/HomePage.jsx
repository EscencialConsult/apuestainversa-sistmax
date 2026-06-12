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

const BENTO = [
  {
    cols: 'sm:col-span-2',
    icon: Zap,
    titulo: 'Subasta inversa en tiempo real',
    desc: 'Motor de licitaciones con reloj regresivo y mecanismo anti-sniper. Las ofertas llegan vía WebSocket sin recarga de página. La sesión se extiende automáticamente ante posturas de último segundo.',
    featured: true,
  },
  {
    cols: 'sm:col-span-1',
    icon: Globe,
    titulo: 'Portal ciudadano',
    desc: 'Adjudicaciones y documentos accesibles sin cuenta de usuario.',
    accent: true,
  },
  {
    cols: 'sm:col-span-1',
    icon: FileText,
    titulo: 'Documentación automática',
    desc: 'Resoluciones y OC generadas con los datos reales de cada expediente.',
  },
  {
    cols: 'sm:col-span-1',
    icon: ShieldCheck,
    titulo: 'Auditoría inmutable',
    desc: 'Bitácora que ningún operador puede editar ni borrar.',
  },
  {
    cols: 'sm:col-span-1',
    icon: Users,
    titulo: 'Multi-rol (8 perfiles)',
    desc: 'Cada actor accede exactamente a lo que le corresponde por normativa.',
  },
]

// ── BentoCell ──────────────────────────────────────────────────────────────────

function BentoCell({ icon: Icon, titulo, desc, featured, accent }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border flex flex-col gap-4 transition-colors',
        featured ? 'p-8 sm:p-10' : 'p-6',
        featured
          ? 'border-[rgb(var(--color-primary)/0.3)] bg-[rgb(var(--color-primary)/0.07)] hover:border-[rgb(var(--color-primary)/0.45)]'
          : accent
            ? 'border-[rgb(var(--color-accent)/0.25)] bg-[rgb(var(--color-accent)/0.06)] hover:border-[rgb(var(--color-accent)/0.4)]'
            : 'border-[rgb(var(--color-border)/0.6)] bg-[rgb(var(--color-surface)/0.5)] hover:border-[rgb(var(--color-border))]',
      )}
    >
      {featured && (
        <div className="absolute -bottom-10 -right-10 pointer-events-none" aria-hidden="true">
          <Icon className="w-56 h-56" style={{ color: 'rgb(var(--color-primary) / 0.04)' }} />
        </div>
      )}

      <div
        className={cn(
          'w-fit rounded-xl border',
          featured ? 'p-3.5' : 'p-3',
          featured
            ? 'bg-[rgb(var(--color-primary)/0.15)] border-[rgb(var(--color-primary)/0.3)]'
            : accent
              ? 'bg-[rgb(var(--color-accent)/0.15)] border-[rgb(var(--color-accent)/0.3)]'
              : 'bg-[rgb(var(--color-primary)/0.1)] border-[rgb(var(--color-primary)/0.2)]',
        )}
      >
        <Icon
          className={featured ? 'w-7 h-7' : 'w-5 h-5'}
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

      <div className="relative space-y-2">
        <p
          className={cn(
            'font-bold text-balance',
            featured ? 'text-xl font-display' : 'text-base',
          )}
          style={{ color: 'rgb(var(--color-text))' }}
        >
          {titulo}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-muted))' }}>
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
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center"
        style={{ minHeight: 'calc(100vh - 4rem)', padding: '5rem 1.5rem 5rem' }}
      >
        {/* Fondo */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgb(var(--color-text) / 0.05) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 110% 65% at 50% -5%, rgb(var(--color-primary) / 0.20) 0%, transparent 62%)',
            }}
          />
          <div
            className="absolute top-1/4 -right-32 w-96 h-96 rounded-full blur-[110px]"
            style={{ background: 'rgb(var(--color-secondary) / 0.16)' }}
          />
          <div
            className="absolute bottom-1/4 -left-24 w-80 h-80 rounded-full blur-[90px]"
            style={{ background: 'rgb(var(--color-accent) / 0.11)' }}
          />
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl mx-auto w-full">

          {/* Logo ONE — protagonista */}
          <img
            src="/imgone/one-logocolor-convertido-de-png.webp"
            alt="ONE"
            className="h-16 sm:h-20 w-auto"
          />

          {/* Headline principal */}
          <div className="space-y-5">
            <h1
              className="font-display font-black text-white leading-none"
              style={{
                fontSize: 'clamp(5rem, 14vw, 10rem)',
                letterSpacing: '-0.025em',
                textShadow:
                  '0 0 60px rgb(var(--color-primary) / 0.80), 0 0 140px rgb(var(--color-primary) / 0.38)',
              }}
            >
              INVERSA.Bid
            </h1>
            <p
              className="font-subtitle text-xl sm:text-2xl font-semibold text-balance"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Sistema Integral de Compras y Subastas Transparentes
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'rgb(var(--color-muted))' }}
            >
              Plataforma oficial de licitaciones públicas de{' '}
              <span className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                {tenant?.name ?? 'este municipio'}
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/login"
              className={cn(
                'inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl',
                'text-base font-bold transition-all hover:opacity-90',
                'border focus-visible:outline-none focus-visible:ring-2',
              )}
              style={{
                background: 'rgb(var(--color-primary) / 0.18)',
                borderColor: 'rgb(var(--color-primary) / 0.5)',
                color: 'rgb(var(--color-primary))',
                boxShadow: '0 0 24px rgb(var(--color-primary) / 0.2)',
              }}
            >
              <LogIn className="w-5 h-5" aria-hidden="true" />
              Ingresar al Sistema
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/portal"
              className={cn(
                'inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl',
                'text-base font-bold transition-all hover:opacity-80',
                'border focus-visible:outline-none focus-visible:ring-2',
              )}
              style={{
                background: 'rgb(var(--color-surface) / 0.6)',
                borderColor: 'rgb(var(--color-border) / 0.8)',
                color: 'rgb(var(--color-muted))',
              }}
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              Portal Ciudadano
            </Link>
          </div>

        </div>

        {/* Fade-to-bg en el borde inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgb(var(--color-bg)))' }}
          aria-hidden="true"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CONTENIDO — contenedor centrado
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-24">

        {/* ── SOBRE EL SISTEMA ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-5">
            <h2
              className="text-3xl sm:text-4xl font-display font-bold text-balance leading-tight"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Digitalización integral del gasto público
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgb(var(--color-muted))' }}>
              INVERSA.Bid conecta todos los actores del proceso licitatorio en una única
              plataforma: proveedores verificados ante ARCA/AFIP, compradores municipales,
              evaluadores, autoridades aprobadoras y ciudadanos. Cada expediente avanza
              por un flujo normado, auditable y sin papel.
            </p>
          </div>

          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: 'rgb(var(--color-muted))' }}
            >
              Flujo del proceso
            </p>
            <ol>
              {PASOS.map((paso, i) => (
                <li
                  key={paso}
                  className="flex items-center gap-4 py-3.5 border-b last:border-0"
                  style={{ borderColor: 'rgb(var(--color-border) / 0.35)' }}
                >
                  <span
                    className="text-sm font-black w-6 flex-shrink-0 tabular-nums"
                    style={{ color: 'rgb(var(--color-primary))' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base" style={{ color: 'rgb(var(--color-text))' }}>
                    {paso}
                  </span>
                  {i < PASOS.length - 1 && (
                    <ChevronRight
                      className="w-4 h-4 ml-auto flex-shrink-0 opacity-25"
                      style={{ color: 'rgb(var(--color-muted))' }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FUNCIONALIDADES — bento grid ── */}
        <section className="space-y-5">
          <h2
            className="text-3xl sm:text-4xl font-display font-bold text-balance leading-tight"
            style={{ color: 'rgb(var(--color-text))' }}
          >
            Todo lo que el municipio necesita
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BENTO.map(cell => (
              <div key={cell.titulo} className={cn('col-span-1', cell.cols)}>
                <BentoCell {...cell} />
              </div>
            ))}
          </div>

          {/* On-premise — franja horizontal, no una tarjeta más */}
          <div
            className="flex items-center gap-5 px-6 py-5 rounded-2xl border"
            style={{
              borderColor: 'rgb(var(--color-border) / 0.45)',
              background: 'rgb(var(--color-surface) / 0.3)',
            }}
          >
            <div
              className="p-3 rounded-xl border flex-shrink-0"
              style={{
                background: 'rgb(var(--color-primary) / 0.1)',
                borderColor: 'rgb(var(--color-primary) / 0.2)',
              }}
            >
              <Lock className="w-5 h-5" style={{ color: 'rgb(var(--color-primary))' }} aria-hidden="true" />
            </div>
            <p className="text-base" style={{ color: 'rgb(var(--color-muted))' }}>
              <span className="font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                100% on-premise
              </span>
              {' '}— instalado en servidores del municipio. Los datos nunca salen de la infraestructura local. Sin cargos de nube externa.
            </p>
          </div>
        </section>

        {/* ── PORTAL CTA ── */}
        <section
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 rounded-2xl border"
          style={{
            borderColor: 'rgb(var(--color-accent) / 0.25)',
            background: 'rgb(var(--color-accent) / 0.06)',
          }}
        >
          <div
            className="p-4 rounded-2xl border flex-shrink-0"
            style={{
              background: 'rgb(var(--color-accent) / 0.15)',
              borderColor: 'rgb(var(--color-accent) / 0.3)',
            }}
          >
            <Award className="w-7 h-7" style={{ color: 'rgb(var(--color-accent))' }} aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-1.5">
            <h3
              className="text-lg font-bold text-balance font-display"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Portal de Transparencia Ciudadana
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-muted))' }}>
              Consultá procesos adjudicados, montos pagados y descargá documentos
              oficiales sin necesidad de crear una cuenta.
            </p>
          </div>
          <Link
            to="/portal"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
              'text-sm font-bold flex-shrink-0 transition-opacity hover:opacity-80',
              'border focus-visible:outline-none focus-visible:ring-2',
            )}
            style={{
              background: 'rgb(var(--color-accent) / 0.15)',
              borderColor: 'rgb(var(--color-accent) / 0.3)',
              color: 'rgb(var(--color-accent))',
            }}
          >
            Ver procesos
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>

      </div>
    </>
  )
}

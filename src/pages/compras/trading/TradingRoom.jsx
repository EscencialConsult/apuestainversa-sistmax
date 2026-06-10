import { Eye } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { ROLES } from '../../../config/roles'
import { BadgeEstado } from '../../../components/atoms/BadgeEstado'
import { useSubasta, ESTADOS_SUBASTA, ID_PROVEEDOR_LOCAL } from './useSubasta'
import { RelojCuentaRegresiva } from './RelojCuentaRegresiva'
import { CajaAhorro } from './CajaAhorro'
import { PanelOfertas } from './PanelOfertas'
import { PanelLance } from './PanelLance'
import { ActaCierre } from './ActaCierre'

/**
 * Sala de Subasta Inversa — Trading Dashboard de alta densidad.
 *
 * Arquitectura anti re-render:
 * - El Reloj tiene su propio estado interno (tick por segundo aislado).
 * - PanelOfertas solo re-renderiza cuando entra un lance.
 * - CajaAhorro deriva del mejor monto, no del tick del reloj.
 *
 * Vistas por rol:
 * - Proveedor: panel de lance validado + envío rápido, oferentes anonimizados.
 * - Funcionario/Auditor: solo-lectura con identidades y ranking completo.
 */
export function TradingRoom() {
  const { user, hasRole } = useAuth()
  const {
    config, ranking, mejorMonto, ahorro, ahorroPct,
    estado, finalizaEn, ultimaExtension,
    registrarLance, finalizar,
  } = useSubasta()

  const esProveedor = hasRole(ROLES.PROVEEDOR)
  const verIdentidades = !esProveedor
  const puedeAdjudicar = hasRole([ROLES.ADMIN, ROLES.COMPRADOR, ROLES.AUTORIDAD])
  const enCurso = estado === ESTADOS_SUBASTA.EN_CURSO
  const finalizada = estado === ESTADOS_SUBASTA.FINALIZADA

  const handleLance = (monto) =>
    registrarLance({ id: ID_PROVEEDOR_LOCAL, razonSocial: user?.name ?? 'Proveedor' }, monto)

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera del expediente */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-tenant-text">Trading Room</h1>
            <BadgeEstado estado={enCurso ? 'en_subasta' : 'cerrado'} size="sm" />
            {!esProveedor && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-tenant-muted px-2 py-0.5 rounded-full border border-tenant-border/40">
                <Eye className="w-3 h-3" /> Modo observación
              </span>
            )}
          </div>
          <p className="text-sm text-tenant-muted mt-1">
            <span className="font-mono text-tenant-primary/80">{config.expediente}</span> — {config.titulo}
          </p>
        </div>
      </div>

      {finalizada ? (
        <ActaCierre
          config={config}
          ranking={ranking}
          ahorro={ahorro}
          ahorroPct={ahorroPct}
          puedeAdjudicar={puedeAdjudicar}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Columna izquierda: reloj + ahorro + panel de lance */}
          <div className="flex flex-col gap-5">
            <RelojCuentaRegresiva
              finalizaEn={finalizaEn}
              onFinalizar={finalizar}
              ultimaExtension={ultimaExtension}
            />
            <CajaAhorro
              precioBase={config.precioBase}
              mejorMonto={mejorMonto}
              ahorro={ahorro}
              ahorroPct={ahorroPct}
            />
            {esProveedor && (
              <PanelLance
                mejorMonto={mejorMonto}
                decrementoMinimo={config.decrementoMinimo}
                bloqueado={!enCurso}
                onLance={handleLance}
              />
            )}
            {!esProveedor && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-tenant-surface/50 border border-tenant-border/40 backdrop-blur-glass">
                  <p className="text-tenant-muted">Decremento mínimo</p>
                  <p className="font-mono font-bold text-tenant-text mt-1 tabular-nums">
                    ${config.decrementoMinimo.toLocaleString('es-AR')}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-tenant-surface/50 border border-tenant-border/40 backdrop-blur-glass">
                  <p className="text-tenant-muted">Oferentes activos</p>
                  <p className="font-mono font-bold text-tenant-text mt-1 tabular-nums">
                    {new Set(ranking.map(l => l.oferenteId)).size}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Columna principal: feed de lances en vivo */}
          <div className="lg:col-span-2">
            <PanelOfertas
              ranking={ranking}
              verIdentidades={verIdentidades}
              idPropio={ID_PROVEEDOR_LOCAL}
              enVivo={enCurso}
            />
          </div>
        </div>
      )}
    </div>
  )
}

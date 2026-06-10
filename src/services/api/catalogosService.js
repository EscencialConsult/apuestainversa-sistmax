/**
 * Catálogos parametrizables del municipio (multi-tenant).
 * MOCK temporal: cuando exista el backend, cada función pasa a ser
 * apiClient.get('/catalogos/...') — las firmas no cambian.
 *
 * DEMO de Empty State obligatorio: agregar ?sinModalidades a la URL
 * simula un municipio que aún no parametrizó sus modalidades.
 */

import { resolveTenantId } from '../../config/tenants'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const AREAS_SOLICITANTES = [
  { id: 'obras',     nombre: 'Secretaría de Obras Públicas' },
  { id: 'salud',     nombre: 'Secretaría de Salud' },
  { id: 'hacienda',  nombre: 'Secretaría de Hacienda' },
  { id: 'ambiente',  nombre: 'Dirección de Ambiente y Espacios Verdes' },
  { id: 'sistemas',  nombre: 'Dirección de Sistemas y Modernización' },
  { id: 'transito',  nombre: 'Dirección de Tránsito y Transporte' },
]

const MODALIDADES = [
  {
    id: 'subasta-inversa',
    nombre: 'Subasta Inversa Electrónica',
    descripcion: 'Los proveedores compiten en tiempo real bajando sus precios. Requiere mínimo 2 oferentes habilitados.',
    montoMinimo: 100_000,
    montoMaximo: null,
    requiereCronograma: true,
  },
  {
    id: 'licitacion-publica',
    nombre: 'Licitación Pública',
    descripcion: 'Convocatoria abierta con apertura de sobres en acto público.',
    montoMinimo: 5_000_000,
    montoMaximo: null,
    requiereCronograma: true,
  },
  {
    id: 'contratacion-directa',
    nombre: 'Contratación Directa',
    descripcion: 'Para montos menores o proveedores exclusivos. Requiere justificación.',
    montoMinimo: 0,
    montoMaximo: 500_000,
    requiereCronograma: false,
  },
]

const PROVEEDORES_HABILITADOS = [
  { id: 'p1', razonSocial: 'TechSolutions SA',        cuit: '30-71234567-9', rubro: 'Informática' },
  { id: 'p2', razonSocial: 'Construcciones Norte SRL', cuit: '30-68901234-5', rubro: 'Obra Pública' },
  { id: 'p3', razonSocial: 'Papelería Central',         cuit: '20-34567890-1', rubro: 'Insumos Oficina' },
  { id: 'p4', razonSocial: 'Eco Verde Servicios',       cuit: '30-45678901-2', rubro: 'Espacios Verdes' },
  { id: 'p5', razonSocial: 'Distribuidora del Tucumán', cuit: '30-55667788-3', rubro: 'Alimentos' },
  { id: 'p6', razonSocial: 'Redes y Cableados SA',      cuit: '30-99887766-1', rubro: 'Informática' },
]

export async function getAreasSolicitantes() {
  await delay(250)
  return AREAS_SOLICITANTES
}

export async function getModalidades() {
  await delay(450)
  // Simula falta de parametrización del municipio (restricción de negocio)
  if (new URLSearchParams(window.location.search).has('sinModalidades')) return []
  return MODALIDADES
}

export async function getProveedoresHabilitados() {
  await delay(350)
  return PROVEEDORES_HABILITADOS
}

// Rubros parametrizados POR TENANT: cada municipio define su propio nomenclador.
// Con backend: apiClient.get('/catalogos/rubros') ya filtrado por x-tenant-id.
const RUBROS_POR_TENANT = {
  'san-miguel-tucuman': [
    { id: 'informatica',    nombre: 'Informática y Tecnología' },
    { id: 'obra-publica',   nombre: 'Obra Pública y Construcción' },
    { id: 'insumos-oficina',nombre: 'Insumos de Oficina' },
    { id: 'espacios-verdes',nombre: 'Espacios Verdes y Paisajismo' },
    { id: 'alimentos',      nombre: 'Alimentos y Catering' },
    { id: 'limpieza',       nombre: 'Limpieza e Higiene Urbana' },
    { id: 'transporte',     nombre: 'Transporte y Logística' },
    { id: 'salud',          nombre: 'Insumos Médicos y Salud' },
  ],
  'demo': [
    { id: 'general',  nombre: 'Rubro General Demo' },
    { id: 'servicios',nombre: 'Servicios Profesionales' },
  ],
}

export async function getRubros() {
  await delay(400)
  // Simula municipio sin nomenclador cargado (restricción de negocio)
  if (new URLSearchParams(window.location.search).has('sinRubros')) return []
  return RUBROS_POR_TENANT[resolveTenantId()] ?? []
}

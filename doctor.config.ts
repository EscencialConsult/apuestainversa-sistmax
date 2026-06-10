/**
 * Configuración de React Doctor — SICST MAX
 *
 * Cada regla ignorada corresponde a un falso positivo TRIAGEADO y APROBADO
 * por el Arquitecto Jefe (revisión Jun 2026). No agregar ignores sin pasar
 * por el mismo proceso: evidencia del archivo + aprobación.
 */
export default {
  ignore: {
    rules: [
      // toSorted() requiere ES2023 (Chrome 110+). Deploy on-premise en máquinas
      // municipales sin control del parque de navegadores → [...arr].sort()
      // es programación defensiva deliberada.
      'react-doctor/js-tosorted-immutable',

      // Migración useContext → use() de React 19: RECHAZADA temporalmente por
      // el Arquitecto hasta después de la entrega (cosmética, sin valor core).
      'react-doctor/no-react19-deprecated-apis',

      // Los useState flagueados son estado de UI independiente (loading, paso
      // actual, catálogos). El payload de negocio ya usa useReducer; agruparlos
      // sería acoplamiento artificial.
      'react-doctor/prefer-useReducer',
    ],
    overrides: [
      {
        // applyTheme en useEffect es sincronización legítima con un sistema
        // externo (variables CSS en document.documentElement) — caso de uso
        // válido según la doc oficial de React.
        files: ['src/contexts/TenantContext.jsx'],
        rules: ['react-doctor/no-event-handler'],
      },
      {
        // El delay() es latencia simulada del mock — desaparece con el backend.
        files: ['src/services/api/catalogosService.js'],
        rules: ['react-doctor/async-defer-await'],
      },
      {
        // El árbol de navegación tiene ~9 ítems fijos: un Map/single-pass
        // sería sobre-ingeniería sin impacto medible.
        files: ['src/config/navigation.js'],
        rules: ['react-doctor/js-index-maps', 'react-doctor/js-combine-iterations'],
      },
    ],
  },
}

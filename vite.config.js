import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Separa vendors del código de la aplicación para maximizar cache hit en re-deploys
    rollupOptions: {
      output: {
        // Vite 8 (rolldown): manualChunks debe ser función
        manualChunks(id) {
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('/lucide-react/')) {
            return 'vendor-ui'
          }
          if (id.includes('/axios/') || id.includes('/clsx/') || id.includes('/tailwind-merge/')) {
            return 'vendor-util'
          }
        },
      },
    },
  },
})

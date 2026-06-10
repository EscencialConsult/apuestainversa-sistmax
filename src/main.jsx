import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fuentes self-hosted: el deploy on-premise puede no tener salida a internet,
// por lo que NO se usan CDNs (Google Fonts) — todo viaja en el bundle.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

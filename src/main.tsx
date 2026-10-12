import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/andika/latin-400.css'
import '@fontsource/andika/latin-700.css'
import './styles.css'
import { createStorage } from './storage'
import { App } from './ui/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App storage={createStorage()} />
  </StrictMode>,
)

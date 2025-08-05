import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Carregando...</div>}>
      <App />
      <Toaster position="top-right" />
    </Suspense>
  </StrictMode>,
)

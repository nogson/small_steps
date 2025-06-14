import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Reset.css'
import './index.css'
import './Common.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
import MaintenanceGate from './components/MaintenanceGate'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <StrictMode>
    <MaintenanceGate>
      <App/>
    </MaintenanceGate>
  </StrictMode>,
)

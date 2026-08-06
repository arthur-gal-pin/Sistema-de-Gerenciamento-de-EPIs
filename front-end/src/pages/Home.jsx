import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopAppBar from './components/TopAppBar'
import Dashboard from './components/Dashboard'

export default function home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar />

      {/* Sidebar mobile (offcanvas simples) */}
      {mobileNavOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 h-100"
          style={{ zIndex: 1050, width: 256 }}
        >
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="position-relative h-100">
            <Sidebar forceVisible />
          </div>
        </div>
      )}

      <div className="flex-grow-1 d-flex flex-column position-relative" style={{ minWidth: 0, height: '100%' }}>
        <TopAppBar onToggleSidebar={() => setMobileNavOpen((open) => !open)} />
        <Dashboard />
      </div>
    </div>
  )
}

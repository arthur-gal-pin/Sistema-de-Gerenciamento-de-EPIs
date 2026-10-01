import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../home/Sidebar';
import TopAppBar from '../home/TopAppBar';

// Mesma estrutura da página Amostras, reaproveitada pelas novas telas.
export default function AppLayout({ title, subtitle, actions, back, children, maxWidth = 1100 }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar />

      {mobileNavOpen && (
        <div className="d-md-none position-fixed top-0 start-0 h-100" style={{ zIndex: 1050, width: 256 }}>
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

        <main className="flex-grow-1 custom-scrollbar" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="p-4 p-lg-5" style={{ maxWidth, margin: '0 auto' }}>
            {back && (
              <Link to={back.to} className="d-inline-flex align-items-center gap-1 text-lab-on-surface-variant text-decoration-none mb-2 font-label">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                {back.label}
              </Link>
            )}
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h2 className="font-headline mb-0" style={{ fontSize: 32 }}>{title}</h2>
                {subtitle && <p className="text-lab-on-surface-variant mb-0 mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="d-flex gap-2">{actions}</div>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

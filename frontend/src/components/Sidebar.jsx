import { navItems } from '../data/dashboardData'

export default function Sidebar({ forceVisible = false }) {
  return (
    <aside
      className={`${forceVisible ? 'd-flex' : 'd-none d-md-flex'} flex-column h-100 border-end p-3 flex-shrink-0`}
      style={{
        width: '256px',
        backgroundColor: 'var(--lab-surface-container-low)',
        borderColor: 'var(--lab-outline-variant)',
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4 px-2 py-1">
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-lab-md"
          style={{ width: 40, height: 40, backgroundColor: 'var(--lab-primary-container)' }}
        >
          <span className="material-symbols-outlined text-lab-on-primary-container">science</span>
        </div>
        <div className="text-truncate">
          <h2 className="font-headline text-lab-primary mb-0 text-truncate" style={{ fontSize: '24px' }}>
            Gestão de Am
          </h2>
          <p className="font-label text-lab-on-surface-variant mb-0 text-truncate">Portal do Técnico</p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-grow-1 d-flex flex-column gap-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`lab-nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-lab-md ${
              item.active ? 'active' : ''
            }`}
          >
            <span className={`material-symbols-outlined ${item.active ? 'icon-fill' : ''}`}>{item.icon}</span>
            <span className="font-label flex-grow-1">{item.label}</span>
            {item.badge && (
              <span
                className="text-lab-on-primary rounded-lab-full px-2 fw-bold"
                style={{ backgroundColor: 'var(--lab-error)', fontSize: '10px' }}
              >
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div className="mt-auto pt-4">
        <button className="lab-cta-btn w-100 d-flex align-items-center justify-content-center gap-2 font-label py-2 rounded-lab-md">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            add
          </span>
          Nova Amostra
        </button>
      </div>
    </aside>
  )
}

import { currentUser } from '../data/dashboardData'

export default function TopAppBar({ onToggleSidebar }) {
  return (
    <header
      className="d-flex justify-content-between align-items-center px-4 py-2 w-100 border-bottom flex-shrink-0"
      style={{ backgroundColor: 'var(--lab-surface)', borderColor: 'var(--lab-outline-variant)' }}
    >
      {/* Toggle mobile */}
      <button
        className="d-md-none btn btn-link text-lab-on-surface-variant me-2 p-1"
        onClick={onToggleSidebar}
        aria-label="Abrir menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="d-flex align-items-center">
        <h1 className="font-headline text-lab-primary mb-0" style={{ fontSize: '24px' }}>
          Laboratório Nacional
        </h1>
      </div>

      {/* Ações e perfil */}
      <div className="d-flex align-items-center gap-3 ms-auto">
        <div className="d-none d-sm-flex align-items-center gap-1">
          <button
            aria-label="Notificações"
            className="btn btn-link text-lab-on-surface-variant rounded-lab-full p-2"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button aria-label="Ajuda" className="btn btn-link text-lab-on-surface-variant rounded-lab-full p-2">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>

        <div
          className="d-none d-sm-block mx-1"
          style={{ height: 32, width: 1, backgroundColor: 'var(--lab-outline-variant)' }}
        />

        <button className="btn btn-link d-flex align-items-center gap-2 rounded-lab-full p-1 pe-3 text-decoration-none">
          <img
            alt="Avatar do usuário"
            src={currentUser.avatar}
            className="rounded-circle"
            style={{ width: 32, height: 32, objectFit: 'cover', backgroundColor: 'var(--lab-surface-variant)' }}
          />
          <div className="d-none d-lg-flex flex-column align-items-start text-start">
            <span className="font-label fw-bold text-lab-on-surface">{currentUser.name}</span>
            <span className="text-lab-on-surface-variant" style={{ fontSize: 12, lineHeight: 1.2 }}>
              {currentUser.role}
            </span>
          </div>
          <span className="material-symbols-outlined d-none d-lg-block text-lab-on-surface-variant" style={{ fontSize: 20 }}>
            arrow_drop_down
          </span>
        </button>
      </div>
    </header>
  )
}

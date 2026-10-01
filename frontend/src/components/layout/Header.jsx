import { mainNavLinks } from '../../data/navigation'

function Header() {
  return (
    <header className="app-header bg-surface">
      <div className="h-100 w-100 px-lg d-flex align-items-center justify-content-between container-fluid">
        {/* Brand */}
        <div className="d-flex align-items-center gap-md">
          <img
            alt="Laboratório Nacional"
            className="d-none d-sm-block"
            style={{ height: 32, width: 'auto', objectFit: 'contain' }}
            src="https://lh3.googleusercontent.com/aida/AEtjO1WrWg3A4xbS3lzAZ5_SNeNU4LWS8PS9r9ssqnbkaYan47HqPDD2u9AP3bJ1fQzf6HHkk_B50lIeRIiDYlQ8WNkO_ezVZF8XXk29QF6BtPizhu-oYUCXPpCtncVhHBQ1S4mTW0N3jAf7SgZWiUNXtFIKKE9kl1brjSIk8A9xpMVT2aquGqXFWKMvqHTBikrIiJhGzoS3BCHSZhUVft3Ky-sLGmnX_Vp24z-Go28q-EBfNaBNEBFkLa6vHbnI"
          />
          <div className="d-flex flex-column">
            <span className="font-headline text-on-surface fw-semibold" style={{ lineHeight: 1.1, fontSize: '1rem' }}>
              Laboratório Nacional
            </span>
            <span className="label-md text-on-surface-variant" style={{ fontSize: '0.7rem', lineHeight: 1 }}>
              Governo Federal
            </span>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="d-none d-lg-flex align-items-center gap-sm">
          {mainNavLinks.map((link) => (
            <a
              key={link.path}
              href={link.href}
              className={`nav-link-brand ${link.path === 'inicio' ? 'active' : ''}`}
              aria-current={link.path === 'inicio' ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="d-flex align-items-center gap-md">
          <button type="button" className="icon-btn" aria-label="Notificações">
            <i className="bi bi-bell" style={{ fontSize: 20 }}></i>
          </button>
          <button type="button" className="icon-btn" aria-label="Ajuda">
            <i className="bi bi-question-circle" style={{ fontSize: 20 }}></i>
          </button>
          <div className="avatar-badge" role="button" aria-label="Perfil do usuário">
            <i className="bi bi-person-fill" style={{ fontSize: 18 }}></i>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

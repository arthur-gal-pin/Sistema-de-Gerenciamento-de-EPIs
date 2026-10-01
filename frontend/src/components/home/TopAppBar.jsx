import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'

const API_URL = import.meta.env.VITE_API_URL

// caminhoImagemPerfil vem como "uploads/images/imagens_perfil/arquivo.jpg" (ou null/"")
const avatarUrl = (path) => (path ? `${API_URL}/${path.replace(/^\/+/, '')}` : null)

function nomeCurto(user) {
  const sobrenome = user.sobrenomeFuncionario?.trim().split(/\s+/).pop() ?? ''
  return `${user.nomeFuncionario} ${sobrenome}`.trim()
}

function Avatar({ user }) {
  const src = avatarUrl(user?.caminhoImagemPerfil)
  const iniciais = user ? `${user.nomeFuncionario?.[0] ?? ''}${user.sobrenomeFuncionario?.[0] ?? ''}`.toUpperCase() : ''

  return src ? (
    <img
      alt={`Foto de ${nomeCurto(user)}`}
      src={src}
      className="rounded-circle"
      style={{ width: 32, height: 32, objectFit: 'cover', backgroundColor: 'var(--lab-surface-variant)' }}
    />
  ) : (
    <span
      className="rounded-circle d-flex align-items-center justify-content-center font-label fw-bold text-lab-on-primary-container"
      style={{ width: 32, height: 32, fontSize: 13, backgroundColor: 'var(--lab-primary-container)' }}
      aria-hidden="true"
    >
      {iniciais || <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>}
    </span>
  )
}

export default function TopAppBar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const { user, loading } = useCurrentUser()

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
          <button aria-label="Notificações" className="btn btn-link text-lab-on-surface-variant rounded-lab-full p-2">
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

        <button
          className="btn btn-link d-flex align-items-center gap-2 rounded-lab-full p-1 pe-3 text-decoration-none"
          onClick={() => navigate('/perfil')}
          disabled={!user}
          aria-label="Abrir meu perfil"
        >
          {loading && !user ? (
            // placeholder enquanto o usuário carrega, evita piscar dados errados
            <span
              className="rounded-circle"
              style={{ width: 32, height: 32, backgroundColor: 'var(--lab-surface-variant)' }}
            />
          ) : (
            <Avatar user={user} />
          )}

          {user && (
            <div className="d-none d-lg-flex flex-column align-items-start text-start" style={{ maxWidth: 200 }}>
              <span className="font-label fw-bold text-lab-on-surface text-truncate w-100">{nomeCurto(user)}</span>
              <span className="text-lab-on-surface-variant text-truncate w-100" style={{ fontSize: 12, lineHeight: 1.2 }}>
                {user.cargo?.nomeCargo}
              </span>
            </div>
          )}

          <span className="material-symbols-outlined d-none d-lg-block text-lab-on-surface-variant" style={{ fontSize: 20 }}>
            arrow_drop_down
          </span>
        </button>
      </div>
    </header>
  )
}
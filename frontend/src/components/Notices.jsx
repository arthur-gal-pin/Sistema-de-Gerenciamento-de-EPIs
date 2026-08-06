import { notices } from '../data/dashboardData'

const variantStyles = {
  tertiary: {
    background: 'var(--lab-surface-container)',
    border: 'var(--lab-tertiary)',
    title: 'text-lab-on-surface',
    footer: 'var(--lab-tertiary)',
  },
  error: {
    background: 'var(--lab-error-container)',
    border: 'var(--lab-error)',
    title: 'text-lab-on-error-container',
    text: 'text-lab-on-error-container',
  },
  secondary: {
    background: 'rgba(219,233,176,0.3)',
    border: 'var(--lab-secondary)',
    title: 'text-lab-on-surface',
  },
}

export default function Notices() {
  return (
    <div
      className="col-lg-4 rounded-lab-lg p-4 shadow-sm d-flex flex-column"
      style={{ backgroundColor: 'var(--lab-surface-container-lowest)', border: '1px solid rgba(193,198,213,0.2)' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="font-headline d-flex align-items-center gap-2 mb-0" style={{ fontSize: '24px' }}>
          <span className="material-symbols-outlined text-lab-secondary">campaign</span>
          Avisos da Instituição
        </h3>
      </div>

      <div className="d-flex flex-column gap-3 flex-grow-1">
        {notices.map((notice) => {
          const style = variantStyles[notice.variant]
          return (
            <div
              key={notice.id}
              className="rounded-lab-md p-3 position-relative overflow-hidden"
              style={{
                backgroundColor: style.background,
                borderLeft: `4px solid ${style.border}`,
              }}
            >
              <h4 className={`font-label fw-bold mb-1 d-flex align-items-center gap-1 ${style.title}`}>
                {notice.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {notice.icon}
                  </span>
                )}
                {notice.title}
              </h4>
              <p className={`mb-2 ${style.text || 'text-lab-on-surface-variant'}`} style={{ fontSize: 14 }}>
                {notice.description}
              </p>

              {notice.footer && (
                <span
                  className="d-inline-flex align-items-center fw-bold"
                  style={{ fontSize: 12, color: style.footer }}
                >
                  <span className="material-symbols-outlined me-1" style={{ fontSize: 14 }}>
                    {notice.footerIcon}
                  </span>
                  {notice.footer}
                </span>
              )}

              {notice.action && (
                <button
                  className="btn btn-link text-lab-secondary fw-bold p-0 d-flex align-items-center gap-1 mt-2"
                  style={{ fontSize: 12 }}
                >
                  {notice.action}
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    arrow_forward
                  </span>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

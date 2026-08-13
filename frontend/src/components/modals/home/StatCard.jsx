export default function StatCard({ stat }) {
  return (
    <div
      className={`lab-card ${stat.bg} rounded-lab-lg p-4 position-relative overflow-hidden d-flex flex-column justify-content-between h-100`}
      style={{ minHeight: 160 }}
    >
      {stat.bgIcon && (
        <div
          className={`position-absolute ${stat.iconColor}`}
          style={{ right: -24, top: -24, opacity: 0.05, pointerEvents: 'none' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 120 }}>
            {stat.bgIcon}
          </span>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-start" style={{ zIndex: 1 }}>
        <div
          className={`d-inline-flex p-2 rounded-lab-md ${stat.iconColor}`}
          style={{ backgroundColor: 'var(--lab-surface)' }}
        >
          <span className="material-symbols-outlined icon-fill">{stat.icon}</span>
        </div>

        {stat.badge && (
          <span
            className="font-label rounded-lab-full px-2 py-1 fw-bold"
            style={{
              backgroundColor: 'var(--lab-secondary-container)',
              color: 'var(--lab-on-secondary-container)',
              fontSize: 12,
            }}
          >
            {stat.badge}
          </span>
        )}

        {stat.pulse && (
          <span className="position-relative d-inline-block" style={{ width: 12, height: 12 }}>
            <span
              className="lab-ping position-absolute rounded-circle"
              style={{ inset: 0, backgroundColor: 'var(--lab-error)', opacity: 0.75 }}
            />
            <span
              className="position-relative rounded-circle d-block"
              style={{ width: 12, height: 12, backgroundColor: 'var(--lab-error)' }}
            />
          </span>
        )}
      </div>

      <div className="mt-3" style={{ zIndex: 1 }}>
        <h3
          className={`font-label mb-1 ${stat.highlighted ? 'text-lab-on-secondary-container' : 'text-lab-on-surface-variant'}`}
        >
          {stat.title}
        </h3>
        <div className="d-flex align-items-baseline gap-2">
          <span
            className={`font-headline ${stat.highlighted ? 'text-lab-on-secondary-container' : 'text-lab-on-surface'}`}
            style={{ fontSize: 32 }}
          >
            {stat.value}
          </span>
          {stat.trend && (
            <span className="d-flex align-items-center font-label" style={{ color: 'var(--lab-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                trending_up
              </span>
              {stat.trend}
            </span>
          )}
          {stat.suffix && (
            <span
              className={`font-label ${stat.highlighted ? 'text-lab-on-secondary-container' : 'text-lab-on-surface-variant'}`}
              style={{ opacity: stat.highlighted ? 0.8 : 1 }}
            >
              {stat.suffix}
            </span>
          )}
        </div>

        {typeof stat.progress === 'number' && (
          <div
            className="rounded-lab-full mt-2 overflow-hidden"
            style={{ height: 6, backgroundColor: 'var(--lab-surface-variant)' }}
          >
            <div
              className="h-100 rounded-lab-full"
              style={{ width: `${stat.progress}%`, backgroundColor: 'var(--lab-primary)' }}
            />
          </div>
        )}

        {stat.alert && (
          <p className="font-label mt-1 mb-0 d-flex align-items-center gap-1" style={{ color: 'var(--lab-error)', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              warning
            </span>
            {stat.alert}
          </p>
        )}
      </div>
    </div>
  )
}

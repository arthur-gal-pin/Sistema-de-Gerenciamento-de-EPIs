import { recentActivities } from '../data/dashboardData'

export default function RecentActivity() {
  return (
    <div
      className="col-lg-8 rounded-lab-lg p-4 shadow-sm d-flex flex-column"
      style={{ backgroundColor: 'var(--lab-surface)', border: '1px solid rgba(193,198,213,0.2)' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="font-headline d-flex align-items-center gap-2 mb-0" style={{ fontSize: '24px' }}>
          <span className="material-symbols-outlined text-lab-primary">history</span>
          Atividades Recentes
        </h3>
        <button className="btn btn-link text-lab-primary font-label p-0">Ver todo o histórico</button>
      </div>

      <div className="flex-grow-1">
        {recentActivities.map((activity, index) => (
          <div key={activity.id} className="position-relative ps-4 py-2">
            {index !== recentActivities.length - 1 && (
              <div
                className="position-absolute"
                style={{
                  left: 11,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: 'rgba(193,198,213,0.3)',
                }}
              />
            )}
            <div
              className="position-absolute rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 24,
                height: 24,
                backgroundColor: 'var(--lab-surface)',
                border: `2px solid ${activity.dotColor}`,
                zIndex: 1,
              }}
            >
              <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: activity.dotColor }} />
            </div>

            <div
              className="rounded-lab-md p-3 ms-2"
              style={{ backgroundColor: 'var(--lab-surface-container-low)' }}
            >
              <div className="d-flex justify-content-between align-items-start mb-1">
                <p className="font-label fw-bold text-lab-on-surface mb-0">{activity.title}</p>
                <span className="text-lab-on-surface-variant font-label" style={{ fontSize: 12 }}>
                  {activity.time}
                </span>
              </div>
              <p className="text-lab-on-surface-variant mb-0" style={{ fontSize: 14 }}>
                {activity.description}
              </p>
              {activity.tag && (
                <div className="mt-2 d-flex gap-2">
                  <span
                    className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-lab fw-bold"
                    style={{
                      backgroundColor: 'rgba(219,233,176,0.5)',
                      color: 'var(--lab-on-secondary-container)',
                      fontSize: 12,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      check_circle
                    </span>
                    {activity.tag}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

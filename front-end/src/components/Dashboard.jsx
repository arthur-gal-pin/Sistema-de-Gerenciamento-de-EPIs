import { statCards } from '../data/dashboardData'
import StatCard from './StatCard'
import RecentActivity from './RecentActivity'
import Notices from './Notices'

export default function Dashboard() {
  const today = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <main className="flex-grow-1 custom-scrollbar position-relative" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
      <div className="p-4 p-lg-5" style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Boas-vindas */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3 mb-4">
          <div>
            <h2 className="font-headline mb-1" style={{ fontSize: 32 }}>
              Visão Geral do Turno
            </h2>
            <p className="text-lab-on-surface-variant mb-0">
              Resumo das operações atuais no polo principal. Status operacional normal.
            </p>
          </div>
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-lab-full text-lab-on-surface"
            style={{ backgroundColor: 'var(--lab-surface-container-high)' }}
          >
            <span className="material-symbols-outlined text-lab-tertiary">calendar_today</span>
            <span className="font-label fw-bold text-capitalize">{today}</span>
          </div>
        </div>

        {/* Cartões de destaque */}
        <div className="row g-3">
          {statCards.map((stat) => (
            <div className="col-12 col-md-6 col-xl-3" key={stat.id}>
              <StatCard stat={stat} />
            </div>
          ))}
        </div>

        {/* Atividades e avisos */}
        <div className="row g-3 mt-1">
          <RecentActivity />
          <Notices />
        </div>
      </div>
    </main>
  )
}

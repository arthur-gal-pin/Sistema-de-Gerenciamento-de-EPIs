import { useState } from 'react'
import { statCards } from '../../data/dashboardData'
import StatCard from './StatCard'
import RecentActivity from './RecentActivity'
import Notices from './Notices'

export default function Dashboard() {
  const [pesquisa, setPesquisa] = useState('')

  const today = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const cardsFiltrados = statCards.filter((stat) => {
    const texto = String(
      stat.title ??
      stat.titulo ??
      stat.label ??
      stat.name ??
      ''
    ).toLowerCase()

    return texto.includes(pesquisa.toLowerCase())
  })

  return (
    <main
      className="flex-grow-1 custom-scrollbar position-relative"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div
        className="p-4 p-lg-5"
        style={{
          maxWidth: 1400,
          margin: '0 auto'
        }}
      >

        {/* Boas-vindas */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-3 mb-4">
          <div>
            <h2
              className="font-headline mb-1"
              style={{ fontSize: 32 }}
            >
              Visão Geral do Turno
            </h2>

            <p className="text-lab-on-surface-variant mb-0">
              Resumo das operações atuais no polo principal. Status operacional normal.
            </p>
          </div>

          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-lab-full text-lab-on-surface"
            style={{
              backgroundColor: 'var(--lab-surface-container-high)'
            }}
          >
            <span className="material-symbols-outlined text-lab-tertiary">
              calendar_today
            </span>

            <span className="font-label fw-bold text-capitalize">
              {today}
            </span>
          </div>
        </div>

        {/* Filtro de pesquisa */}
        <div className="mb-4">
          <div
            className="d-flex align-items-center"
            style={{
              width: '100%',
              maxWidth: 500,
              height: 48,
              backgroundColor: '#ffffff',
              border: '1px solid #d9dfe8',
              borderRadius: 8,
              padding: '0 12px'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 22,
                color: '#666666'
              }}
            >
              search
            </span>

            <input
              type="text"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Pesquisar..."
              className="form-control border-0 shadow-none"
              style={{
                height: 46
              }}
            />

            {pesquisa && (
              <button
                type="button"
                className="btn border-0 p-0"
                onClick={() => setPesquisa('')}
                title="Limpar pesquisa"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    color: '#666666'
                  }}
                >
                  close
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Cartões de destaque */}
        <div className="row g-3">
          {cardsFiltrados.length > 0 ? (
            cardsFiltrados.map((stat) => (
              <div
                className="col-12 col-md-6 col-xl-3"
                key={stat.id}
              >
                <StatCard stat={stat} />
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-lab-on-surface-variant">
                Nenhum resultado encontrado para "{pesquisa}".
              </p>
            </div>
          )}
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
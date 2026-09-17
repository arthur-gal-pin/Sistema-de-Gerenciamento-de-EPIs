import { useState } from 'react'
import Sidebar from '../components/home/Sidebar'
import TopAppBar from '../components/home/TopAppBar'
import SkeletonLoading from '../components/common/SkeletonLoading'
import { ModalCriarAmostra } from '../components/modals/amostras/ModalCriarAmostra'
import { useModal } from '../hooks/useModal'
import { useAmostras } from '../hooks/amostras/useAmostra'

export default function Amostras() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [pesquisa, setPesquisa] = useState('')

  const { amostras, loading } = useAmostras()
  const { isOpen, openModal, closeModal } = useModal()

  // Filtra as amostras pelo nome
  const amostrasFiltradas = amostras.filter((amostra) => {
    const nome = String(
      amostra.nome ?? amostra.nomeAmostra ?? ''
    )

    return nome
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  })

  return (
    <div
      className="d-flex"
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <Sidebar />

      {/* Sidebar mobile */}
      {mobileNavOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 h-100"
          style={{
            zIndex: 1050,
            width: 256
          }}
        >
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)'
            }}
            onClick={() => setMobileNavOpen(false)}
          />

          <div className="position-relative h-100">
            <Sidebar forceVisible />
          </div>
        </div>
      )}

      <div
        className="flex-grow-1 d-flex flex-column position-relative"
        style={{
          minWidth: 0,
          height: '100%'
        }}
      >
        <TopAppBar
          onToggleSidebar={() =>
            setMobileNavOpen((open) => !open)
          }
        />

        <main
          className="flex-grow-1 custom-scrollbar"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <div
            className="p-4 p-lg-5"
            style={{
              maxWidth: 1000,
              margin: '0 auto'
            }}
          >
            {/* Cabeçalho */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2
                className="font-headline mb-0"
                style={{
                  fontSize: 32
                }}
              >
                Amostras
              </h2>

              <button
                className="lab-cta-btn d-flex align-items-center gap-2 font-label px-3 py-2 rounded-lab-md"
                onClick={openModal}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20
                  }}
                >
                  add
                </span>

                Nova Amostra
              </button>
            </div>

            {/* Filtro de pesquisa */}
            <div className="mb-4">
              <div
                className="d-flex align-items-center"
                style={{
                  width: '100%',
                  maxWidth: 500,
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
                  placeholder="Pesquisar amostra..."
                  className="form-control border-0 shadow-none"
                  style={{
                    height: 45
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

            {/* Lista de amostras */}
            {loading ? (
              <SkeletonLoading />
            ) : amostras.length === 0 ? (
              <p className="text-lab-on-surface-variant">
                Nenhuma amostra encontrada.
              </p>
            ) : amostrasFiltradas.length === 0 ? (
              <p className="text-lab-on-surface-variant">
                Nenhuma amostra encontrada para "{pesquisa}".
              </p>
            ) : (
              amostrasFiltradas.map((amostra, index) => (
                <div
                  key={
                    amostra.id ??
                    amostra.idAmostra ??
                    index
                  }
                  className="card p-3 mb-3 shadow-sm"
                >
                  <h5 className="mb-0">
                    {amostra.nome ?? amostra.nomeAmostra}
                  </h5>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Modal para criar amostra */}
      <ModalCriarAmostra
        isOpen={isOpen}
        onClose={closeModal}
      />
    </div>
  )
}
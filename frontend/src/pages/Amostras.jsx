import { useState } from 'react'
import Sidebar from '../components/home/Sidebar'
import TopAppBar from '../components/home/TopAppBar'
import SkeletonLoading from '../components/common/SkeletonLoading'
import { ModalCriarAmostra } from '../components/modals/amostras/ModalCriarAmostra'
import { useModal } from '../hooks/useModal'
import { useAmostras } from '../hooks/amostras/useAmostra'

export default function Amostras() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { amostras, loading } = useAmostras()
  const { isOpen, openModal, closeModal } = useModal()

  return (
    <div className="d-flex" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar />

      {/* Sidebar mobile (offcanvas simples) */}
      {mobileNavOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 h-100"
          style={{ zIndex: 1050, width: 256 }}
        >
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="position-relative h-100">
            <Sidebar forceVisible />
          </div>
        </div>
      )}

      <div className="flex-grow-1 d-flex flex-column position-relative" style={{ minWidth: 0, height: '100%' }}>
        <TopAppBar onToggleSidebar={() => setMobileNavOpen((open) => !open)} />

        <main className="flex-grow-1 custom-scrollbar" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="p-4 p-lg-5" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="font-headline mb-0" style={{ fontSize: 32 }}>Amostras</h2>
              <button className="lab-cta-btn d-flex align-items-center gap-2 font-label px-3 py-2 rounded-lab-md" onClick={openModal}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                Nova Amostra
              </button>
            </div>

            {loading ? (
              <SkeletonLoading />
            ) : amostras.length === 0 ? (
              <p className="text-lab-on-surface-variant">Nenhuma amostra encontrada.</p>
            ) : (
              amostras.map((amostra, index) => (
                <div key={amostra.id ?? amostra.idAmostra ?? index} className="card p-3 mb-3 shadow-sm">
                  <h5 className="mb-0">{amostra.nome ?? amostra.nomeAmostra}</h5>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <ModalCriarAmostra isOpen={isOpen} onClose={closeModal} />
    </div>
  )
}

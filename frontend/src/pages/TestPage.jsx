import { ModalCriarAmostra } from '../components/modals/amostras/ModalCriarAmostra';
import { useModal } from '../hooks/useModal';

export default function TestPage() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Ambiente de Teste do Componente</h1>
      <hr style={{ margin: '20px 0' }} />

      {/* Cenário: abertura/fechamento do modal de criação de amostra */}
      <h2>Modal de Criação de Amostra</h2>
      <button className="btn btn-primary" onClick={openModal}>
        Abrir Modal
      </button>

      <ModalCriarAmostra isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}

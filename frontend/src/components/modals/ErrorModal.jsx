export default function ErrorModal({ isOpen, onClose, message }) {
    // Se não estiver aberto, não renderiza nada na tela
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Ops, algo deu errado!</h3>
                <p>{message}</p>
                <button onClick={onClose}>Tentar novamente</button>
            </div>
        </div>
    );
}
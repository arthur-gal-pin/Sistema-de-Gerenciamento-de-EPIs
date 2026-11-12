import { AlertTriangle, X } from "lucide-react";

/**
 * Modal de confirmação para substituir window.confirm().
 *
 * Props:
 *   open        {boolean}
 *   title       {string}
 *   message     {string}
 *   confirmLabel {string}       – texto do botão de confirmação (padrão: "Excluir")
 *   cancelLabel  {string}       – texto do botão de cancelamento (padrão: "Cancelar")
 *   danger      {boolean}       – usa cor vermelha no botão de confirmar (padrão: true)
 *   onConfirm   {() => void}
 *   onCancel    {() => void}
 */
export default function ConfirmModal({
    open,
    title = "Confirmar ação",
    message,
    confirmLabel = "Excluir",
    cancelLabel = "Cancelar",
    danger = true,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "420px", padding: "28px" }}
            >
                {/* Botão fechar */}
                <button
                    type="button"
                    onClick={onCancel}
                    className="modal-close-btn"
                    style={{ position: "absolute", top: "12px", right: "12px" }}
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* Ícone + Título */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <div
                        style={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: danger ? "var(--danger-light)" : "var(--warning-light)",
                            color: danger ? "var(--danger)" : "var(--warning)",
                        }}
                    >
                        <AlertTriangle size={22} />
                    </div>
                    <h3
                        id="confirm-modal-title"
                        style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text)" }}
                    >
                        {title}
                    </h3>
                </div>

                {/* Mensagem */}
                {message && (
                    <p style={{ color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "24px", paddingLeft: "56px" }}>
                        {message}
                    </p>
                )}

                {/* Ações */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="btn-primary"
                        style={danger ? { background: "var(--danger)", color: "#fff" } : {}}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

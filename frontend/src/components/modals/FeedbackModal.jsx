import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ICONS = {
    success: <CheckCircle2 size={32} />,
    error:   <XCircle size={32} />,
    warning: <AlertTriangle size={32} />,
    info:    <Info size={32} />,
};

const COLORS = {
    success: { icon: "var(--success)",  bg: "var(--success-light)" },
    error:   { icon: "var(--danger)",   bg: "var(--danger-light)"  },
    warning: { icon: "var(--warning)",  bg: "var(--warning-light)" },
    info:    { icon: "var(--secondary)", bg: "var(--secondary-light)" },
};

/**
 * Modal de feedback para substituir alert/inline divs.
 *
 * Props:
 *   open    {boolean}            – controla visibilidade
 *   type    {"success"|"error"|"warning"|"info"}
 *   title   {string}
 *   message {string}
 *   onClose {() => void}
 *   autoClose {number|false}     – ms para fechar automaticamente (padrão: 3000 para success, false para outros)
 */
export default function FeedbackModal({
    open,
    type = "info",
    title,
    message,
    onClose,
    autoClose,
}) {
    const resolvedAutoClose =
        autoClose !== undefined ? autoClose : type === "success" ? 3000 : false;

    useEffect(() => {
        if (!open || !resolvedAutoClose) return;
        const timer = setTimeout(onClose, resolvedAutoClose);
        return () => clearTimeout(timer);
    }, [open, resolvedAutoClose, onClose]);

    if (!open) return null;

    const color = COLORS[type] || COLORS.info;
    const defaultTitle =
        type === "success" ? "Sucesso!"
        : type === "error"   ? "Erro"
        : type === "warning" ? "Atenção"
        : "Informação";

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "420px", textAlign: "center", padding: "32px 28px" }}
            >
                {/* Botão fechar */}
                <button
                    type="button"
                    onClick={onClose}
                    className="modal-close-btn"
                    style={{ position: "absolute", top: "12px", right: "12px" }}
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* Ícone */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: color.bg,
                        color: color.icon,
                        marginBottom: "16px",
                    }}
                >
                    {ICONS[type]}
                </div>

                {/* Título */}
                <h3
                    id="feedback-modal-title"
                    style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "10px", color: "var(--text)" }}
                >
                    {title || defaultTitle}
                </h3>

                {/* Mensagem */}
                {message && (
                    <p style={{ color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "24px" }}>
                        {message}
                    </p>
                )}

                {/* Botão OK */}
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-primary"
                    style={{ minWidth: "120px" }}
                >
                    OK
                </button>

                {/* Barra de progresso para auto-close */}
                {resolvedAutoClose && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: "3px",
                            background: color.icon,
                            borderRadius: "0 0 var(--radius) var(--radius)",
                            animation: `feedbackProgress ${resolvedAutoClose}ms linear forwards`,
                        }}
                    />
                )}
            </div>

            <style>{`
                @keyframes feedbackProgress {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
                .modal-content { position: relative; }
            `}</style>
        </div>
    );
}

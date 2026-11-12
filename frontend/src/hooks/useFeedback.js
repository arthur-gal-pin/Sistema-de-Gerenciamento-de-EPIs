import { useState, useCallback } from "react";

/**
 * Hook que gerencia o estado de um FeedbackModal e de um ConfirmModal.
 *
 * Uso:
 *   const { showSuccess, showError, showWarning, showInfo, feedbackProps,
 *           confirm, confirmProps } = useFeedback();
 *
 *   // No JSX:
 *   <FeedbackModal {...feedbackProps} />
 *   <ConfirmModal  {...confirmProps}  />
 */
export function useFeedback() {
    // ── Feedback (success / error / warning / info) ──────────────────────────
    const [feedback, setFeedback] = useState({
        open: false,
        type: "info",
        title: "",
        message: "",
        autoClose: undefined,
    });

    const closeFeedback = useCallback(() => {
        setFeedback((f) => ({ ...f, open: false }));
    }, []);

    const show = useCallback((type, message, title, autoClose) => {
        setFeedback({ open: true, type, title: title || "", message, autoClose });
    }, []);

    const showSuccess = useCallback((message, title, autoClose) => show("success", message, title, autoClose), [show]);
    const showError   = useCallback((message, title) => show("error",   message, title, false),     [show]);
    const showWarning = useCallback((message, title) => show("warning", message, title, false),     [show]);
    const showInfo    = useCallback((message, title) => show("info",    message, title, false),     [show]);

    const feedbackProps = {
        open:     feedback.open,
        type:     feedback.type,
        title:    feedback.title,
        message:  feedback.message,
        autoClose: feedback.autoClose,
        onClose:  closeFeedback,
    };

    // ── Confirm ──────────────────────────────────────────────────────────────
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        message: "",
        confirmLabel: "Excluir",
        cancelLabel: "Cancelar",
        danger: true,
        resolve: null,
    });

    /**
     * Abre o modal de confirmação e retorna uma Promise<boolean>.
     * Uso: const ok = await confirm({ title, message });
     */
    const confirm = useCallback(({ title, message, confirmLabel, cancelLabel, danger = true }) => {
        return new Promise((resolve) => {
            setConfirmState({
                open: true,
                title: title || "Confirmar ação",
                message,
                confirmLabel: confirmLabel || "Excluir",
                cancelLabel: cancelLabel || "Cancelar",
                danger,
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setConfirmState((s) => { s.resolve?.(true); return { ...s, open: false }; });
    }, []);

    const handleCancel = useCallback(() => {
        setConfirmState((s) => { s.resolve?.(false); return { ...s, open: false }; });
    }, []);

    const confirmProps = {
        open:         confirmState.open,
        title:        confirmState.title,
        message:      confirmState.message,
        confirmLabel: confirmState.confirmLabel,
        cancelLabel:  confirmState.cancelLabel,
        danger:       confirmState.danger,
        onConfirm:    handleConfirm,
        onCancel:     handleCancel,
    };

    return { showSuccess, showError, showWarning, showInfo, feedbackProps, confirm, confirmProps };
}

export function ErrorAlert({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div className="text-center text-lab-on-surface-variant py-5">
      <span className="material-symbols-outlined" style={{ fontSize: 40 }}>{icon}</span>
      <h5 className="mt-2 text-lab-on-surface">{title}</h5>
      {text && <p className="mb-3">{text}</p>}
      {action}
    </div>
  );
}

export function Field({ label, error, hint, children }) {
  return (
    <div className="mb-3">
      <label className="form-label font-label mb-1">{label}</label>
      {children}
      {hint && !error && <div className="form-text">{hint}</div>}
      {error && <div className="text-lab-error small mt-1">{error}</div>}
    </div>
  );
}

export function PrimaryButton({ icon, children, ...props }) {
  return (
    <button type="button" className="lab-cta-btn d-flex align-items-center gap-2 font-label px-3 py-2 rounded-lab-md" {...props}>
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>}
      {children}
    </button>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { FileSearch, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg)",
                padding: "24px",
                textAlign: "center",
            }}
        >
            {/* Ícone */}
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "96px",
                    height: "96px",
                    borderRadius: "50%",
                    background: "var(--secondary-light)",
                    color: "var(--secondary)",
                    marginBottom: "24px",
                }}
            >
                <FileSearch size={48} strokeWidth={1.5} />
            </div>

            {/* Código de erro */}
            <p
                style={{
                    fontSize: "5rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "var(--secondary)",
                    letterSpacing: "-2px",
                    marginBottom: "8px",
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                404
            </p>

            <h1
                style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "12px",
                }}
            >
                Página não encontrada
            </h1>

            <p
                style={{
                    color: "var(--text-muted)",
                    maxWidth: "400px",
                    lineHeight: 1.6,
                    marginBottom: "32px",
                }}
            >
                O endereço{" "}
                <code
                    style={{
                        background: "var(--surface-alt)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.9em",
                        color: "var(--secondary)",
                    }}
                >
                    {location.pathname}
                </code>{" "}
                não existe ou foi movido. Verifique o endereço digitado ou retorne
                à página inicial.
            </p>

            {/* Botões */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <ArrowLeft size={18} />
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                    <Home size={18} />
                    Página Inicial
                </button>
            </div>

            {/* Rodapé discreto */}
            <p
                style={{
                    marginTop: "48px",
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    opacity: 0.6,
                }}
            >
                Sistema de Gerenciamento de EPIs — Fundacentro
            </p>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserRound, LockKeyhole } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import "./LoginPage.css";

export default function LoginPage() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { showError, feedbackProps } = useFeedback();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            await login(cpf, senha);
            navigate("/");
        } catch (error) {
            console.error("Erro no login:", error);
            showError(
                error?.response?.data?.message ||
                "Ops! Ocorreu um erro. Verifique seu CPF e senha.",
                "Falha na Autenticação"
            );
        } finally {
            setEnviando(false);
        }
    };

    const handleForget = (e) => {
        e.preventDefault();
        navigate("/no-login");
    };

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    function formatarCPF(valor) {
        valor = valor.replace(/\D/g, "").slice(0, 11);
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img
                        src="/fundacentro.png"
                        alt="Logo FUNDACENTRO"
                        className="login-logo"
                    />

                    <h1>Bem-vindo!</h1>
                    <p>Faça login para acessar o sistema.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="cpf">CPF: <span>*</span></label>

                        <div className="login-input">
                            <span className="login-icon">
                                <UserRound size={22} />
                            </span>

                            <input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                maxLength={14}
                                required
                                disabled={enviando}
                                onChange={(e) => {
                                    setCpf(formatarCPF(e.target.value));
                                }}
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label htmlFor="senha">Senha: <span>*</span></label>

                        <div className="login-input">
                            <span className="login-icon">
                                <LockKeyhole size={22} />
                            </span>

                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={senha}
                                required
                                disabled={enviando}
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            <button
                                type="button"
                                className="login-eye"
                                onClick={toggleMostrarSenha}
                                tabIndex={-1}
                                title={mostrarSenha ? "Ocultar senha" : "Ver senha"}
                            >
                                {mostrarSenha ? (
                                    <EyeOff size={22} />
                                ) : (
                                    <Eye size={22} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={enviando}>
                        <LockKeyhole size={20} />
                        {enviando ? "ENTRANDO..." : "ENTRAR"}
                    </button>

                    <button
                        type="button"
                        className="login-forgot"
                        onClick={handleForget}
                    >
                        Esqueci minha senha
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Não tem acesso?{" "}
                        <a href="/no-login" onClick={handleForget}>
                            Fale conosco
                        </a>
                    </p>
                </div>
            </div>

            <FeedbackModal {...feedbackProps} />
        </div>
    );
}

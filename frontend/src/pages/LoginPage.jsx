import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserRound, LockKeyhole } from "lucide-react";
import loginService from "../services/auth/loginService";
import "./LoginPage.css";

export default function LoginPage() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mensagemError, setMensagemError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginService(cpf, senha);

            if (response.status !== 200) {
                setMensagemError(
                    response.message || "Erro ao realizar login."
                );
                return;
            }

            navigate("/home-page");
        } catch (error) {
            setMensagemError(
                error?.response?.data?.message ||
                "Ops! Ocorreu um erro. Verifique seu CPF e senha."
            );
            console.log(error);
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
                                <UserRound size={24} />
                            </span>

                            <input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                maxLength={14}
                                required
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
                                <LockKeyhole size={24} />
                            </span>

                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Digite sua senha"
                                value={senha}
                                required
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            <button
                                type="button"
                                className="login-eye"
                                onClick={toggleMostrarSenha}
                            >
                                {mostrarSenha ? (
                                    <EyeOff size={24} />
                                ) : (
                                    <Eye size={24} />
                                )}
                            </button>
                        </div>
                    </div>

                    {mensagemError && (
                        <p className="login-error">{mensagemError}</p>
                    )}

                    <button type="submit" className="login-button">
                        <LockKeyhole size={22} />
                        ENTRAR
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
        </div>
    );
}
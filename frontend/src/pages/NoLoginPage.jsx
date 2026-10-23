import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, CreditCard, Mail, Users, MessageSquare } from "lucide-react";
import SetaVoltar from "../components/SetaVoltar";
import "./NoLoginPage.css";

export default function NoLoginPage() {
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        email: "",
        equipe: "",
        texto: ""
    });

    const [error, setError] = useState(null);
    const [enviado, setEnviado] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);
        setError(null);
        setEnviado(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setEnviado(false);
    };

    const dadosEquipe = [
        {
            id: 1,
            equipe: "gerenciamento",
            lider: "roberto",
            email: "roberto@gmail.com"
        },
        {
            id: 2,
            equipe: "azul",
            lider: "lagarto",
            email: "lagarto@gmail.com"
        }
    ];

    function formatarCPF(valor) {
        valor = valor.replace(/\D/g, "").slice(0, 11);
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return valor;
    }

    return (
        <main className="no-login-page">
            <section className="no-login-card">
                <div className="no-login-back">
                    <SetaVoltar />
                </div>

                <header className="no-login-header">
                    <img
                        src="/fundacentro.png"
                        alt="Logo FUNDACENTRO"
                        className="no-login-logo"
                    />

                    <h1>Solicitar acesso</h1>
                    <p>
                        Preencha os dados abaixo para entrar em contato
                        com o coordenador da sua equipe.
                    </p>
                </header>

                <form className="no-login-form" onSubmit={handleSubmit}>
                    <div className="no-login-field">
                        <label htmlFor="nome">Nome completo *</label>

                        <div className="no-login-input">
                            <span className="no-login-icon">
                                <UserRound size={21} />
                            </span>

                            <input
                                id="nome"
                                type="text"
                                name="nome"
                                placeholder="Ex.: João Silva"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="no-login-field">
                        <label htmlFor="cpf">CPF *</label>

                        <div className="no-login-input">
                            <span className="no-login-icon">
                                <CreditCard size={21} />
                            </span>

                            <input
                                id="cpf"
                                type="text"
                                name="cpf"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                maxLength={14}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        cpf: formatarCPF(e.target.value)
                                    }));
                                    setEnviado(false);
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="no-login-field">
                        <label htmlFor="email">E-mail institucional *</label>

                        <div className="no-login-input">
                            <span className="no-login-icon">
                                <Mail size={21} />
                            </span>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="seuemail@exemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="no-login-field">
                        <label htmlFor="equipe">Sua equipe *</label>

                        <div className="no-login-input">
                            <span className="no-login-icon">
                                <Users size={21} />
                            </span>

                            <select
                                id="equipe"
                                name="equipe"
                                value={formData.equipe}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>
                                    Selecione uma equipe
                                </option>

                                {dadosEquipe.map((item) => (
                                    <option key={item.id} value={item.equipe}>
                                        {item.equipe}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="no-login-field">
                        <label htmlFor="texto">
                            Mensagem para o coordenador *
                        </label>

                        <div className="no-login-textarea">
                            <MessageSquare
                                size={21}
                                className="no-login-textarea-icon"
                            />

                            <textarea
                                id="texto"
                                name="texto"
                                placeholder="Explique por que você precisa de acesso ao sistema..."
                                rows="5"
                                value={formData.texto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="no-login-error">{error}</p>
                    )}

                    {enviado && (
                        <p className="no-login-success">
                            Dados preenchidos! O envio por e-mail ainda
                            precisa ser integrado ao sistema.
                        </p>
                    )}

                    <button type="submit" className="no-login-button">
                        <Mail size={20} />
                        Enviar solicitação
                    </button>

                    <button
                        type="button"
                        className="no-login-back-button"
                        onClick={() => navigate("/")}
                    >
                        Voltar para o login
                    </button>
                </form>

                <footer className="no-login-footer">
                    FUNDACENTRO — Sistema de Gerenciamento de EPIs
                </footer>
            </section>
        </main>
    );
}
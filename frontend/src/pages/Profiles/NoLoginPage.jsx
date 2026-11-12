import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SetaVoltar from "../../components/SetaVoltar";
import { esqueciSenhaService } from "../../services/auth/loginService";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import './NoLoginPage.css';

export default function NoLoginPage() {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        equipe: '',
        texto: ''
    });
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();
    const { showSuccess, showError, feedbackProps } = useFeedback();

    const formatarCPF = (valor) => {
        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const resp = await esqueciSenhaService(formData);
            showSuccess(resp.message || "Solicitação enviada com sucesso!", "Solicitação Enviada");
            setFormData({
                nome: '',
                cpf: '',
                email: '',
                equipe: '',
                texto: ''
            });
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao enviar solicitação.", "Erro no Envio");
        } finally {
            setEnviando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cpf') {
            setFormData((prev) => ({ ...prev, cpf: formatarCPF(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '520px' }}>
                <SetaVoltar />
                <div className="login-header">
                    <h2>Recuperação de Acesso</h2>
                    <p>Notifique o coordenador de sua equipe para recuperar seu acesso</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Nome completo</label>
                        <input
                            type="text"
                            name="nome"
                            placeholder="Ex: João Silva"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>E-mail corporativo / pessoal</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Ex: joaosilva@fundacentro.gov.br"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Equipe</label>
                        <select
                            name="equipe"
                            value={formData.equipe}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Selecione sua equipe</option>
                            <option value="CEPEPI">CEPEPI (Centro de Equipamentos de Proteção Individual)</option>
                            <option value="CLG">CLG (Coordenação de Laboratórios Gerais)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Mensagem para o coordenador</label>
                        <textarea
                            name="texto"
                            placeholder="Descreva o motivo da solicitação..."
                            rows="4"
                            value={formData.texto}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={enviando}>
                        {enviando ? "Enviando solicitação..." : "Enviar solicitação"}
                    </button>
                    <button type="button" className="btn-link" onClick={() => navigate('/login')}>
                        Voltar ao login
                    </button>
                </form>
            </div>

            <FeedbackModal {...feedbackProps} />
        </div>
    );
}

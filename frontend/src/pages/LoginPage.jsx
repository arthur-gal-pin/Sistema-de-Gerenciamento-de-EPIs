import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import loginService from "../services/auth/loginService";

export default function LoginPage() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mensagemError, setMensagemError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginService(cpf, senha);
            if (response.status !== 200) {
                // Se der erro (ex: 400 ou 401), pegamos a mensagem do back-end e abrimos o modal
                setMensagemError(response.message || 'Erro ao realizar login.');
                alert(mensagemError)
                return;
            }
            navigate('/home-page');
        } catch (error) {
            setMensagemError(mensagemError);
            console.log(error);
            alert(mensagemError ? `Ocorreu um erro ao tentar logar. Erro: ${mensagemError}` : 'Ops! Ocorreu um erro, verifique seu cpf e senha, e tente logar novamente');
        }
    }

    const handleForget = (e) => {
        e.preventDefault();
        navigate("/no-login");
    }

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    function formatarCPF(valor) {
        valor = valor.replace(/\D/g, "");

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return valor;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>CPF</label>
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


                <label>Senha</label>
                <input type={mostrarSenha ? 'text' : 'password'} value={senha} onChange={(e) => setSenha(e.target.value)} required></input>

                <button type='button' onClick={(e) => toggleMostrarSenha()}>{mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}</button>

                <button type='submit'>
                    ENTRAR
                </button>
                <button type='submit' onClick={handleForget}>Esqueceu sua senha ou não tem login?</button>
            </form>
        </div>
    )
}
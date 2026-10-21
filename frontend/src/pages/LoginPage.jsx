import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/home-page");
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
            <form>
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

                <button type='submit' onClick={handleSubmit}>
                    ENTRAR
                </button>
                <button type='submit' onClick={handleForget}>Esqueceu sua senha ou não tem login?</button>
            </form>

            <div>
                {error && (
                    <strong>Erro: {error}</strong>
                )}
            </div>
        </div>
    )
}
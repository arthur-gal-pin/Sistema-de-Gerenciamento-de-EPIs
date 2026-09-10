import { useState } from "react";
import axios from "axios";
import PersonModal from "../components/modals/PersonModal";
import "./login.css"
export default function Login() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  function formatarCPF(valor) {
    valor = valor.replace(/\D/g, "");

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return valor;
  }

  async function fazerLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        cpf,
        senha,
      });

      console.log(response.data);
      alert("Login realizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("CPF ou senha inválidos.");
    }
  }

  return (
    <div className="login-page">

      {/* Card de Login */}
      <div className="login-box">

        {/* Logo e apresentação */}
        <div className="text-center mb-4">
          <img
            src="../../public/login/fundacentro.png"
            alt="Fundacentro"
            className="logo"
          />

          <h1>Bem-vindo!</h1>

          <p>
            Faça login para acessar o Sistema de Gerenciamento de EPIs.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={fazerLogin}>

          <div className="mb-3">
            <label htmlFor="cpf">CPF</label>

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

          <div className="mb-4">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              required
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit">
            Entrar
          </button>

        </form>

        {/* Ações adicionais */}
        <div className="acoes-login">

          <button
            type="button"
            className="btn-cadastro"
            onClick={() => setIsRegisterOpen(true)}
          >
            Criar uma conta
          </button>

          <a href="#">
            Esqueci minha senha
          </a>

        </div>

      </div>

      {/* Modal de cadastro */}
      <PersonModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        person={null}
        onSuccess={() => {
          alert("Cadastro realizado com sucesso! Faça seu login.");
        }}
      />

    </div>
  );
}
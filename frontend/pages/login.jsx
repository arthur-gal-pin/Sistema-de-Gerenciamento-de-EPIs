import { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

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

      // Exemplo:
      // localStorage.setItem("token", response.data.token);
      // navigate("/home");

    } catch (error) {
      console.error(error);
      alert("CPF ou senha inválidos.");
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* Lado esquerdo */}
        <div className="col-lg-3 d-none d-lg-block esquerda"></div>

        {/* Centro */}
        <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center fundo">

          <div className="login-box">

            <div className="text-center mb-4">
              <img
                src="/fundacentro.png"
                alt="Fundacentro"
                className="logo img-fluid"
              />

              <h1 className="mt-3">Bem-vindo!</h1>

              <p>Faça login para acessar o Sistema de Gerenciamento de EPIs.</p>
            </div>

            <form onSubmit={fazerLogin}>

              <div className="mb-3">
                <label className="form-label">CPF</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="000.000.000-00"
                  value={cpf}
                  maxLength={14}
                  required
                  onChange={(e) => setCpf(formatarCPF(e.target.value))}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Senha</label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Digite sua senha"
                  value={senha}
                  required
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Entrar
              </button>

            </form>

            <div className="text-center mt-3">
              <a href="#">Esqueci minha senha</a>
            </div>

          </div>

        </div>

        {/* Lado direito */}
        <div className="col-lg-3 d-none d-lg-block direita"></div>

      </div>
    </div>
  );
}
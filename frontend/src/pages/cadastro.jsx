import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const cadastrarUsuario = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    alert("Cadastro realizado com sucesso!");

    navigate("/login");
  };

  return (
    <div className="cadastro-page"> 
      <div className="cadastro-box">

        <h1>CADASTRO DE USUÁRIO</h1>

        <form onSubmit={cadastrarUsuario}>

          <div className="campo">
            <label htmlFor="nome">Nome:</label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail:</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="cpf">CPF:</label>

            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha:</label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="confirmarSenha">
              Confirmar senha:
            </label>

            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-cadastrar"
          >
            Cadastrar
          </button>

        </form>

        <button
          type="button"
          className="btn-voltar"
          onClick={() => navigate("/login")}
        >
          Voltar para o login
        </button>

      </div>
    </div>
  );
}
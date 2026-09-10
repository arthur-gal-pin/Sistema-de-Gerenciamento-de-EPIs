import React, { useState } from 'react';
import PersonModal from '../components/modals/PersonModal';
import './login.css';


export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="login-container">
      {/* Formulário de Login existente */}
      <form>
        {/* Campos CPF e Senha */}
        <button type="submit" className="btn btn-success w-100">Entrar</button>
      </form>

      {/* Botão para abrir o Modal de Cadastro */}
      <div className="text-center mt-3">
        <button 
          type="button" 
          className="btn btn-outline-primary w-100"
          onClick={() => setIsRegisterOpen(true)}
        >
          Criar uma conta
        </button>
      </div>

      {/* Modal de Cadastro de Usuário */}
      <PersonModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        person={null}
        onSuccess={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
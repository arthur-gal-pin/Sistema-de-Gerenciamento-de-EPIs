import React from 'react';
import { ModalCriarAmostra } from '../components/modals/Amostras/ModalCriarAmostra';

export default function TestPage() {

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Ambiente de Teste do Componente</h1>
      <hr style={{ margin: '20px 0' }} />
      
      {/* Cenário 1: Uso padrão */}
      <h2>Cenário 1: Padrão</h2>
      <MeuComponente data={dadosMock} />

      {/* Cenário 2: Estado alternativo / Carregando */}
      <h2 style={{ marginTop: '40px' }}>Cenário 2: Carregando</h2>
      <MeuComponente data={dadosMock} isLoading={true} />
    </div>
  );
}

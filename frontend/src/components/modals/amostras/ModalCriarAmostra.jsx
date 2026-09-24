import React, { useState } from 'react';
import Modal from '../ModalModel';
import useOCPs from '../../../hooks/amostras/useOCPs';
import useEmpresas from '../../../hooks/amostras/useEmpresas';
import { postAmostras } from '../../../services/amostras/amostraService';
import Select from '../Select';

export function ModalCriarAmostra({ isOpen, onClose }) {
  const { opcoes: opcoesOCPs, loading: loadingOCPs } = useOCPs();
  const { opcoes: opcoesEmpresas, loading: loadingEmpresas } = useEmpresas();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [tipoAmostra, setTipoAmostra] = useState('');
  const [situacaoAmostra, setSituacaoAmostra] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [ocpId, setOcpId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nome,
      tipoAmostra,
      situacaoAmostra,
      empresaId,
      ocpId,
    };
    
    console.log("Salvando amostra:", payload);
    postAmostras(payload);
    onClose(); // Fecha após salvar
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Amostra">
      <form onSubmit={handleSubmit} style={formStyle}>
        <div className="form-group d-flex flex-column gap-2">
          <label className="fw-bold">Nome Amostra</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label className="fw-bold">Tipo da Amostra</label>
          <input
            type="text"
            className="form-control"
            value={tipoAmostra}
            onChange={(e) => setTipoAmostra(e.target.value)}
            required
          />

          <label className="fw-bold">Situação Amostra</label>
          <select
            className="form-select"
            value={situacaoAmostra}
            onChange={(e) => setSituacaoAmostra(e.target.value)}
            required
          >
            <option value="" disabled>-- Escolha uma opção --</option>
            <option value="prova">Prova</option>
            <option value="contraprova">Contra-prova</option>
            <option value="testemunha">Testemunha</option>
          </select>

          {/* Componentes Select dinâmicos integrados ao estado pai */}
          <Select 
            label="Empresa Relacionada"
            opcoes={opcoesEmpresas} 
            carregando={loadingEmpresas} 
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
          />

          <Select 
            label="OCP Relacionado"
            opcoes={opcoesOCPs} 
            carregando={loadingOCPs} 
            value={ocpId}
            onChange={(e) => setOcpId(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Salvar Amostra
        </button>
      </form>
    </Modal>
  );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };

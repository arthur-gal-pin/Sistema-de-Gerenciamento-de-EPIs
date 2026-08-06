import React, { useState } from 'react';
import { Modal } from './ModalCreate';
import { SelectOCPs } from './selects/SelectOCPs';

export function ModalCriarAmostra({ isOpen, onClose }) {
    const [nome, setNome] = useState('');
    const [tipoAmostra, setTipoAmostra] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Salvando pessoa:", nome);
        onClose(); // Fecha após salvar
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <form onSubmit={handleSubmit} style={formStyle}>
                <div className="form-group">
                    <label>Nome Amostra</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <input type=""></input>
                    <label>Tipo da Amostra</label>
                    <input
                        type="text"
                        value={tipoAmostra}
                        onChange={(e) => setTipoAmostra(e.target.value)}
                        required
                    />
                    <input type=""></input>
                    <label>Situação Amostra</label>
                    <select
                        id="selectBootstrap"
                        className="form-select" // Classe padrão do Bootstrap para selects
                        value={valorSelecionado}
                        onChange={handleSelectChange}
                    >
                        <option value="" disabled>-- Escolha uma opção --</option>

                        <option key={opcao.id} value="prova">
                            Prova
                        </option>
                        <option key={opcao.id} value="contraprova">
                            ContraProva
                        </option>
                        <option key={opcao.id} value="prova">
                            Testemunha
                        </option>

                    </select>
                    <label>Empresa Relacionada</label>

                    <label>OCP Relacionado</label>
                    <SelectOCPs></SelectOCPs>
                </div>

                <button type="submit">Salvar Pessoa</button>
            </form>
        </Modal>
    );
}

const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };

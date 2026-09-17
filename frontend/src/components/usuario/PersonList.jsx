import React, { useState } from 'react';
import PersonCard from './PersonCard';
import PersonModal from './PersonModal';

export default function PersonList({ persons = [], onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);


  const handleOpenCreateModal = () => {
    setSelectedPerson(null);
    setIsModalOpen(true);
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  return (
    <div className="person-list-container">
      {/* Cabeçalho com Título e Botão de Cadastro */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Usuários</h2>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          + Novo Usuário
        </button>
      </div>

      {/* Listagem dos Cards de Usuários */}
      <div className="person-list">
        {persons.length > 0 ? (
          persons.map((person) => (
            <div key={person.id} onClick={() => handleSelectPerson(person)}>
              <PersonCard person={person} />
            </div>
          ))
        ) : (
          <p>Nenhum usuário cadastrado.</p>
        )}
      </div>

      {/* Modal Reutilizável (Criação e Visualização) */}
      <PersonModal
        isOpen={isModalOpen}
        person={selectedPerson}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh(); 
        }}
      />
    </div>
  );
}
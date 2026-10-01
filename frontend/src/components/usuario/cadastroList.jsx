import React, { useState } from 'react';
import PersonCard from './PersonCard';
import PersonModal from '../modals/PersonModal';

export default function PersonList({ persons = [], onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedPerson(null);
    setIsModalOpen(true);
  };

  return (
    <div className="person-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Usuários</h2>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          + Cadastrar Usuário
        </button>
      </div>

      <div className="person-list">
        {persons.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>

      <PersonModal
        isOpen={isModalOpen}
        person={selectedPerson}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
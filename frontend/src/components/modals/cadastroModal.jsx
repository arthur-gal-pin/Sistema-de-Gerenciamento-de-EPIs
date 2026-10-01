import React, { useState, useEffect } from 'react';
import { createPerson, updatePerson } from '../../services/personService';

export default function PersonModal({ isOpen, onClose, person, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || '',
        email: person.email || '',
        cpf: person.cpf ? formatarCPF(person.cpf) : '',
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        cpf: '',
        password: '',
        confirmPassword: ''
      });
    }
    setError('');
  }, [person, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setFormData((prev) => ({ ...prev, cpf: formatarCPF(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!person || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem!');
        return;
      }
    }

    setLoading(true);

    try {
      if (person?.id) {
        await updatePerson(person.id, {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          ...(formData.password && { password: formData.password })
        });
      } else {
        await createPerson({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          password: formData.password
        });
      }

      alert(person ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title w-100 text-center fw-bold">
              {person ? 'EDITAR USUÁRIO' : 'CADASTRO DE USUÁRIO'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Nome:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">E-mail:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">CPF:</label>
                <input
                  type="text"
                  className="form-control"
                  name="cpf"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {person ? 'Nova Senha (deixe em branco para manter):' : 'Senha:'}
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!person}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar senha:</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!person || !!formData.password}
                />
              </div>
            </div>

            <div className="modal-footer justify-content-center border-0 pb-4">
              <button 
                type="button" 
                className="btn btn-secondary me-2 px-4" 
                onClick={onClose} 
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-5" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : person ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
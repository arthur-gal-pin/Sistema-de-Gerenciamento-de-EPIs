import { useState } from 'react';
import Modal from '../modals/ModalModel';
import { Field, PrimaryButton } from '../common/Feedback';
import { createTipoEnsaio, updateTipoEnsaio } from '../../services/tipoEnsaioService';
import { apiMessage } from '../../utils/apiHelpers';

export const CATEGORIAS = { filtro: 'Filtro', peca: 'Peça facial' };

// Use com key={tipo?.idTipoEnsaio ?? 'novo'}
export default function TipoEnsaioFormModal({ isOpen, onClose, tipo, onSaved }) {
  const [form, setForm] = useState({
    nomeEnsaio: tipo?.nomeEnsaio ?? '',
    categoriaAplicavel: tipo?.categoriaAplicavel ?? 'filtro',
    descricao: tipo?.descricao ?? '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nomeEnsaio.trim()) return setError('Informe o nome do tipo de ensaio.');
    setSaving(true);
    setError('');
    try {
      const saved = tipo ? await updateTipoEnsaio(tipo.idTipoEnsaio, form) : await createTipoEnsaio(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(apiMessage(err, 'Não foi possível salvar o tipo de ensaio.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tipo ? 'Editar tipo de ensaio' : 'Novo tipo de ensaio'}>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Nome">
          <input className="form-control" maxLength={100} value={form.nomeEnsaio}
            onChange={(e) => setForm({ ...form, nomeEnsaio: e.target.value })} />
        </Field>
        <Field label="Aplicável a">
          <select className="form-select" value={form.categoriaAplicavel}
            onChange={(e) => setForm({ ...form, categoriaAplicavel: e.target.value })}>
            {Object.entries(CATEGORIAS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Descrição">
          <textarea className="form-control" rows={3} maxLength={1000} value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </Field>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <PrimaryButton type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar tipo'}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

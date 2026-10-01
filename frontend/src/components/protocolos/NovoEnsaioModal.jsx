import { useState } from 'react';
import Modal from '../modals/ModalModel';
import { Field, PrimaryButton } from '../common/Feedback';
import { createEnsaio } from '../../services/execucaoEnsaioService';
import { apiMessage } from '../../utils/apiHelpers';

export const PAPEIS = { prova: 'Prova', contraprova: 'Contraprova', testemunha: 'Testemunha' };

export default function NovoEnsaioModal({ isOpen, onClose, protocoloId, tipos, onCreated }) {
  const [form, setForm] = useState({ tipoEnsaioId: '', nomeEnsaio: '', papel: 'prova', descricao: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleTipo(e) {
    const tipo = tipos.find((t) => t.idTipoEnsaio === e.target.value);
    // sugere o nome do tipo, sem sobrescrever o que a pessoa já digitou
    setForm((f) => ({ ...f, tipoEnsaioId: e.target.value, nomeEnsaio: f.nomeEnsaio || tipo?.nomeEnsaio || '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.tipoEnsaioId) next.tipoEnsaioId = 'Escolha o tipo de ensaio.';
    if (!form.nomeEnsaio.trim()) next.nomeEnsaio = 'Informe o nome do ensaio.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    setSubmitError('');
    try {
      const ensaio = await createEnsaio({ ...form, protocoloId });
      onCreated(ensaio);
    } catch (err) {
      setSubmitError(apiMessage(err, 'Não foi possível criar o ensaio.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo ensaio">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Tipo de ensaio" error={errors.tipoEnsaioId}>
          <select className="form-select" value={form.tipoEnsaioId} onChange={handleTipo}>
            <option value="">Selecione</option>
            {tipos.map((t) => (
              <option key={t.idTipoEnsaio} value={t.idTipoEnsaio}>{t.nomeEnsaio} ({t.categoriaAplicavel})</option>
            ))}
          </select>
        </Field>
        <Field label="Nome do ensaio" error={errors.nomeEnsaio}>
          <input className="form-control" maxLength={100} value={form.nomeEnsaio}
            onChange={(e) => setForm({ ...form, nomeEnsaio: e.target.value })} />
        </Field>
        <Field label="Papel">
          <select className="form-select" value={form.papel} onChange={(e) => setForm({ ...form, papel: e.target.value })}>
            {Object.entries(PAPEIS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Descrição">
          <textarea className="form-control" rows={2} maxLength={1000} value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </Field>
        {submitError && <div className="alert alert-danger py-2">{submitError}</div>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <PrimaryButton type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar e abrir ensaio'}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

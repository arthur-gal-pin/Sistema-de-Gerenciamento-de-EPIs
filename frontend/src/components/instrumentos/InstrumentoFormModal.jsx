import { useState } from 'react';
import Modal from '../modals/ModalModel';
import { Field, PrimaryButton } from '../common/Feedback';
import { createInstrumento, updateInstrumento } from '../../services/instrumentoService';
import { apiMessage } from '../../utils/apiHelpers';
import { toInputDate } from '../../utils/calibracao';

// Use com key={instrumento?.idInstrumento ?? 'novo'}
export default function InstrumentoFormModal({ isOpen, onClose, instrumento, onSaved }) {
  const [form, setForm] = useState({
    nomeInstrumento: instrumento?.nomeInstrumento ?? '',
    funcaoInstrumento: instrumento?.funcaoInstrumento ?? '',
    ultimaCalibracao: toInputDate(instrumento?.ultimaCalibracao),
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.nomeInstrumento.trim()) next.nomeInstrumento = 'Informe o nome.';
    if (!form.ultimaCalibracao) next.ultimaCalibracao = 'Informe a data da última calibração.';
    else if (new Date(form.ultimaCalibracao) > new Date()) next.ultimaCalibracao = 'A data não pode estar no futuro.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    setSubmitError('');
    try {
      const saved = instrumento
        ? await updateInstrumento(instrumento.idInstrumento, form)
        : await createInstrumento(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setSubmitError(apiMessage(err, 'Não foi possível salvar o instrumento.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={instrumento ? 'Editar instrumento' : 'Novo instrumento'}>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Nome" error={errors.nomeInstrumento}>
          <input className="form-control" maxLength={100} value={form.nomeInstrumento} onChange={set('nomeInstrumento')} />
        </Field>
        <Field label="Função" hint="Ex.: medição de vazão, pesagem, temperatura.">
          <textarea className="form-control" rows={2} maxLength={500} value={form.funcaoInstrumento} onChange={set('funcaoInstrumento')} />
        </Field>
        <Field label="Última calibração" error={errors.ultimaCalibracao}>
          <input type="date" className="form-control" value={form.ultimaCalibracao} onChange={set('ultimaCalibracao')} />
        </Field>
        {submitError && <div className="alert alert-danger py-2">{submitError}</div>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <PrimaryButton type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar instrumento'}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

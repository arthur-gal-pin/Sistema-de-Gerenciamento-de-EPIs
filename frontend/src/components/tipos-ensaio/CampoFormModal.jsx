import { useState } from 'react';
import Modal from '../modals/ModalModel';
import { Field, PrimaryButton } from '../common/Feedback';
import { createCampo, updateCampo } from '../../services/tipoEnsaioService';
import { apiMessage } from '../../utils/apiHelpers';

export const TIPOS_DADO = { number: 'Número', string: 'Texto', date: 'Data', char: 'Caractere único' };

// Use com key={campo?.idCampoEnsaio ?? 'novo'}
export default function CampoFormModal({ isOpen, onClose, idTipoEnsaio, campo, onSaved }) {
  const [form, setForm] = useState({
    nomeCampo: campo?.nomeCampo ?? '',
    unidadeMedida: campo?.unidadeMedida ?? '',
    tipoDado: campo?.tipoDado ?? 'number',
    obrigatoriedade: campo?.obrigatoriedade ?? true,
    descricao: campo?.descricao?.trim() ?? '', // coluna NChar: vem com espaços à direita
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.nomeCampo.trim()) next.nomeCampo = 'Informe o nome do campo.';
    if (!form.unidadeMedida.trim()) next.unidadeMedida = 'Informe a unidade (use "-" se não houver).';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    setSubmitError('');
    try {
      const saved = campo
        ? await updateCampo(campo.idCampoEnsaio, idTipoEnsaio, form)
        : await createCampo(idTipoEnsaio, form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setSubmitError(apiMessage(err, 'Não foi possível salvar o campo.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={campo ? 'Editar campo' : 'Novo campo'}>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Nome do campo" error={errors.nomeCampo}>
          <input className="form-control" maxLength={80} value={form.nomeCampo}
            onChange={(e) => setForm({ ...form, nomeCampo: e.target.value })} />
        </Field>
        <div className="row">
          <div className="col-md-6">
            <Field label="Tipo do dado">
              <select className="form-select" value={form.tipoDado} onChange={(e) => setForm({ ...form, tipoDado: e.target.value })}>
                {Object.entries(TIPOS_DADO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Unidade de medida" error={errors.unidadeMedida}>
              <input className="form-control" maxLength={20} value={form.unidadeMedida}
                onChange={(e) => setForm({ ...form, unidadeMedida: e.target.value })} />
            </Field>
          </div>
        </div>
        <div className="form-check mb-3">
          <input id="obrig" type="checkbox" className="form-check-input" checked={form.obrigatoriedade}
            onChange={(e) => setForm({ ...form, obrigatoriedade: e.target.checked })} />
          <label htmlFor="obrig" className="form-check-label">Preenchimento obrigatório no ensaio</label>
        </div>
        <Field label="Descrição">
          <textarea className="form-control" rows={2} maxLength={1000} value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </Field>
        {submitError && <div className="alert alert-danger py-2">{submitError}</div>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <PrimaryButton type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar campo'}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

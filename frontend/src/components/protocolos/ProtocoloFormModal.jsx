import { useState } from 'react';
import Modal from '../modals/ModalModel';
import { Field, PrimaryButton } from '../common/Feedback';
import { createProtocolo, updateProtocolo } from '../../services/protocoloService';
import { apiMessage } from '../../utils/apiHelpers';
import { toInputDate } from '../../utils/calibracao';

export const TIPOS_PROTOCOLO = {
  inicial: 'Inicial',
  manutencao: 'Manutenção',
  controle_qualidade: 'Controle de qualidade',
};

const empty = {
  nomeProtocolo: '', numeroProtocolo: '', numeroSEI: '', tipoProtocolo: 'inicial',
  ocpId: '', empresaId: '', diaAbertura: '', diaEntrega: '', descricao: '',
};

const fromProtocolo = (p) => ({
  nomeProtocolo: p.nomeProtocolo, numeroProtocolo: p.numeroProtocolo, numeroSEI: p.numeroSEI,
  tipoProtocolo: p.tipoProtocolo, ocpId: p.fkIdOcp, empresaId: p.fkIdEmpresa,
  diaAbertura: toInputDate(p.diaAbertura), diaEntrega: toInputDate(p.diaEntrega), descricao: p.descricao ?? '',
});

// Use com key={protocolo?.idProtocolo ?? 'novo'} para reiniciar o formulário ao trocar o registro.
export default function ProtocoloFormModal({ isOpen, onClose, protocolo, ocps, empresas, onSaved }) {
  const [form, setForm] = useState(protocolo ? fromProtocolo(protocolo) : empty);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const required = ['nomeProtocolo', 'numeroProtocolo', 'numeroSEI', 'ocpId', 'empresaId', 'diaAbertura'];
    const next = {};
    required.forEach((k) => { if (!String(form[k]).trim()) next[k] = 'Campo obrigatório.'; });
    if (form.diaEntrega && form.diaAbertura && form.diaEntrega < form.diaAbertura) {
      next.diaEntrega = 'A entrega não pode ser anterior à abertura.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSubmitError('');
    try {
      const saved = protocolo
        ? await updateProtocolo(protocolo.idProtocolo, form)
        : await createProtocolo(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setSubmitError(apiMessage(err, 'Não foi possível salvar o protocolo.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={protocolo ? 'Editar protocolo' : 'Novo protocolo'}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="col-md-6">
            <Field label="Nº do protocolo" error={errors.numeroProtocolo}>
              <input className="form-control" value={form.numeroProtocolo} onChange={set('numeroProtocolo')} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Nº SEI" error={errors.numeroSEI}>
              <input className="form-control" value={form.numeroSEI} onChange={set('numeroSEI')} />
            </Field>
          </div>
        </div>
        <Field label="Nome" error={errors.nomeProtocolo}>
          <input className="form-control" maxLength={100} value={form.nomeProtocolo} onChange={set('nomeProtocolo')} />
        </Field>
        <div className="row">
          <div className="col-md-4">
            <Field label="Tipo">
              <select className="form-select" value={form.tipoProtocolo} onChange={set('tipoProtocolo')}>
                {Object.entries(TIPOS_PROTOCOLO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
          </div>
          <div className="col-md-4">
            <Field label="Empresa" error={errors.empresaId}>
              <select className="form-select" value={form.empresaId} onChange={set('empresaId')}>
                <option value="">Selecione</option>
                {empresas.map((x) => <option key={x.idEmpresa} value={x.idEmpresa}>{x.nomeEmpresa}</option>)}
              </select>
            </Field>
          </div>
          <div className="col-md-4">
            <Field label="OCP" error={errors.ocpId}>
              <select className="form-select" value={form.ocpId} onChange={set('ocpId')}>
                <option value="">Selecione</option>
                {ocps.map((x) => <option key={x.idOCP} value={x.idOCP}>{x.nomeOCP}</option>)}
              </select>
            </Field>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Field label="Data de abertura" error={errors.diaAbertura}>
              <input type="date" className="form-control" value={form.diaAbertura} onChange={set('diaAbertura')} />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Data de entrega" error={errors.diaEntrega}>
              <input type="date" className="form-control" value={form.diaEntrega} onChange={set('diaEntrega')} />
            </Field>
          </div>
        </div>
        <Field label="Descrição">
          <textarea className="form-control" rows={3} maxLength={1000} value={form.descricao} onChange={set('descricao')} />
        </Field>

        {submitError && <div className="alert alert-danger py-2">{submitError}</div>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <PrimaryButton type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar protocolo'}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

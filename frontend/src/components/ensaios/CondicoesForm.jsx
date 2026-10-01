import { useState } from 'react';
import { Field, PrimaryButton } from '../common/Feedback';
import { statusCalibracao } from '../../utils/calibracao';

// Passo 1: amostra + instrumento + condições ambientais. Use com key={registro?.idAmostraEnsaio ?? 'novo'}
export default function CondicoesForm({ amostras, instrumentos, registros, registro, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    amostraId: registro?.fkIdAmostra ?? '',
    instrumentoId: registro?.fkIdInstrumento ?? '',
    temperatura: registro?.temperatura ?? '',
    umidade: registro?.umidade ?? '',
    pressao: registro?.pressao ?? '',
  });
  const [aceitaVencido, setAceitaVencido] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));
  const jaUsadas = new Set(registros.map((r) => r.fkIdAmostra));
  const instrumento = instrumentos.find((i) => i.idInstrumento === form.instrumentoId);
  const calib = instrumento ? statusCalibracao(instrumento.ultimaCalibracao) : null;
  const vencido = calib?.status === 'vencida';

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.amostraId) next.amostraId = 'Escolha a amostra.';
    if (!form.instrumentoId) next.instrumentoId = 'Escolha o instrumento.';
    if (form.temperatura === '' || Number.isNaN(Number(form.temperatura))) next.temperatura = 'Informe a temperatura.';
    if (form.umidade === '' || Number.isNaN(Number(form.umidade))) next.umidade = 'Informe a umidade.';
    else if (Number(form.umidade) < 0 || Number(form.umidade) > 100) next.umidade = 'A umidade deve ficar entre 0 e 100%.';
    if (form.pressao !== '' && Number.isNaN(Number(form.pressao))) next.pressao = 'Pressão inválida.';
    if (vencido && !aceitaVencido) next.instrumentoId = 'Instrumento com calibração vencida: confirme abaixo para usá-lo.';
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-md-6">
          <Field label="Amostra" error={errors.amostraId}>
            <select className="form-select" value={form.amostraId} onChange={set('amostraId')} disabled={Boolean(registro)}>
              <option value="">Selecione</option>
              {amostras.map((a) => (
                <option key={a.idAmostra} value={a.idAmostra} disabled={!registro && jaUsadas.has(a.idAmostra)}>
                  {a.codigoAmostra} · {a.nomeAmostra}{jaUsadas.has(a.idAmostra) && !registro ? ' (já neste ensaio)' : ''}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="col-md-6">
          <Field label="Instrumento" error={errors.instrumentoId}>
            <select className="form-select" value={form.instrumentoId} onChange={set('instrumentoId')}>
              <option value="">Selecione</option>
              {instrumentos.map((i) => {
                const s = statusCalibracao(i.ultimaCalibracao);
                return <option key={i.idInstrumento} value={i.idInstrumento}>{i.nomeInstrumento}{s.status !== 'ok' ? ` — ${s.label}` : ''}</option>;
              })}
            </select>
          </Field>
        </div>
      </div>

      {calib && calib.status !== 'ok' && (
        <div className={`alert ${vencido ? 'alert-danger' : 'alert-warning'} py-2`}>
          {vencido ? 'A calibração deste instrumento está vencida.' : `A calibração deste instrumento ${calib.label.toLowerCase()}.`}
          {vencido && (
            <div className="form-check mt-1">
              <input id="aceita" type="checkbox" className="form-check-input" checked={aceitaVencido}
                onChange={(e) => setAceitaVencido(e.target.checked)} />
              <label htmlFor="aceita" className="form-check-label">Usar mesmo assim</label>
            </div>
          )}
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          <Field label="Temperatura (°C)" error={errors.temperatura}>
            <input type="number" step="0.01" className="form-control" value={form.temperatura} onChange={set('temperatura')} />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Umidade (%)" error={errors.umidade}>
            <input type="number" step="0.01" className="form-control" value={form.umidade} onChange={set('umidade')} />
          </Field>
        </div>
        <div className="col-md-4">
          <Field label="Pressão (opcional)" error={errors.pressao}>
            <input type="number" step="0.01" className="form-control" value={form.pressao} onChange={set('pressao')} />
          </Field>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>}
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? 'Salvando...' : registro ? 'Salvar condições' : 'Continuar para os dados'}
        </PrimaryButton>
      </div>
    </form>
  );
}

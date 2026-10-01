import { PrimaryButton } from '../common/Feedback';

const INPUT_TYPE = { number: 'number', date: 'date', string: 'text', char: 'text' };

// Passo 2: formulário gerado a partir dos CampoEnsaio do tipo de ensaio.
export default function CamposForm({ campos, valores, errors, saving, onChange, onSubmit }) {
  if (campos.length === 0) {
    return <p className="text-lab-on-surface-variant">Este tipo de ensaio ainda não tem campos. Cadastre-os em Tipos de ensaio.</p>;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>
      <div className="row">
        {campos.map((campo) => {
          const id = campo.idCampoEnsaio;
          const unidade = campo.unidadeMedida && campo.unidadeMedida !== '-' ? campo.unidadeMedida : null;
          return (
            <div className="col-md-6 mb-3" key={id}>
              <label htmlFor={id} className="form-label font-label mb-1">
                {campo.nomeCampo}{campo.obrigatoriedade && <span className="text-lab-error"> *</span>}
              </label>
              <div className="input-group">
                <input
                  id={id}
                  type={INPUT_TYPE[campo.tipoDado] ?? 'text'}
                  step={campo.tipoDado === 'number' ? 'any' : undefined}
                  maxLength={campo.tipoDado === 'char' ? 1 : undefined}
                  className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
                  value={valores[id] ?? ''}
                  onChange={(e) => onChange(id, e.target.value)}
                />
                {unidade && <span className="input-group-text">{unidade}</span>}
              </div>
              {errors[id] && <div className="text-lab-error small mt-1">{errors[id]}</div>}
              {campo.descricao?.trim() && !errors[id] && <div className="form-text">{campo.descricao.trim()}</div>}
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-end">
        <PrimaryButton type="submit" icon="save" disabled={saving}>{saving ? 'Salvando...' : 'Salvar dados'}</PrimaryButton>
      </div>
    </form>
  );
}

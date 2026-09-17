export default function Select({ label, opcoes = [], carregando = false, value, onChange }) {
  return (
    <div className="mb-2">
      {label && <label className="form-label fw-bold mb-1">{label}</label>}
      
      {carregando ? (
        <p className="text-muted fs-7 m-0">Carregando opções...</p>
      ) : (
        <select
          className="form-select"
          value={value}
          onChange={onChange}
        >
          <option value="">-- Escolha uma opção --</option>
          {opcoes.map((opcao) => (
            <option key={opcao.id} value={opcao.id}>
              {opcao.nome}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
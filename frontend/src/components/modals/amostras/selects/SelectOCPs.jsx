import { useOCPs } from "../../../../hooks/useOCPs";

export function SelectOCPs() {
  const {opcoes, carregando} = useOCPs();

  // Função disparada quando o usuário muda a seleção
  const handleSelectChange = (event) => {
    setValorSelecionado(event.target.value);
  };
   return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="mb-3">
        <label htmlFor="selectBootstrap" className="form-label fw-bold">
          Selecione uma Opção
        </label>
        
        {/* Renderização condicional para estados de carregamento */}
        {carregando && <p className="text-muted fs-7">Carregando opções...</p>}

        {!carregando && !erro && (
          <select
            id="selectBootstrap"
            className="form-select" // Classe padrão do Bootstrap para selects
            value={valorSelecionado}
            onChange={handleSelectChange}
          >
            <option value="" disabled>-- Escolha uma opção --</option>
            
            {/* Percorre o array de opções e renderiza cada tag <option> */}
            {opcoes.map((opcao) => (
              <option key={opcao.id} value={opcao.id}>
                {opcao.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      {valorSelecionado && (
        <div className="alert alert-success mt-3 py-2">
          <strong>{valorSelecionado}</strong>
        </div>
      )}
    </div>
  );
}
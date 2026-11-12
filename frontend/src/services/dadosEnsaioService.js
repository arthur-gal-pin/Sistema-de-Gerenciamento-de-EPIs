import api from "./api";

// Busca os campos dinâmicos definidos para determinado Tipo de Ensaio
export async function getCamposDoTipoEnsaio(idTipoEnsaio) {
    try {
        const response = await api.get(`/campo-ensaio/tipoEnsaio/${idTipoEnsaio}`);
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar campos do tipo de ensaio:", error);
        return [];
    }
}

// Busca os dados já salvos de uma Amostra específica dentro do Ensaio
export async function getDadosDaAmostraEnsaio(idAmostraEnsaio) {
    try {
        const response = await api.get(`/dados-ensaio/amostraEnsaio/${idAmostraEnsaio}`);
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar dados da amostra no ensaio:", error);
        return [];
    }
}

// Salva um dado dinâmico
export async function salvarDadoEnsaio(payload) {
    const response = await api.post("/dados-ensaio", payload);
    return response.data;
}

// Atualiza um dado dinâmico existente
export async function atualizarDadoEnsaio(id, payload) {
    const response = await api.patch(`/dados-ensaio/${id}`, payload);
    return response.data;
}

// Atualiza dados ambientais da Amostra no Ensaio (temperatura, umidade, pressao, instrumento)
export async function atualizarAmostraEnsaio(idAmostraEnsaio, payload) {
    const response = await api.patch(`/ensaios/amostras/${idAmostraEnsaio}`, payload);
    return response.data;
}

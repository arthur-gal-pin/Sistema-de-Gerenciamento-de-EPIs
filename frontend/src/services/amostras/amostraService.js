import api from "../api";

export async function getAllAmostras() {
    try {
        const response = await api.get("/amostras/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar dados de Amostras: ", error);
        return [];
    }
}

export async function getAmostrasPorProtocolo(idProtocolo) {
    try {
        const response = await api.get(`/amostras/protocolo/${idProtocolo}`);
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar amostras do protocolo: ", error);
        return [];
    }
}

export async function getAmostraPorId(id) {
    const response = await api.get(`/amostras/id/${id}`);
    return response.data?.data;
}

export async function createAmostra(payload) {
    const response = await api.post("/amostras", {
        FK_idProtocolo: payload.FK_idProtocolo,
        codigoAmostra: payload.codigoAmostra,
        nomeAmostra: payload.nomeAmostra,
        situacaoAmostra: payload.situacaoAmostra,
        classificacaoAmostra: payload.classificacaoAmostra,
        subclassificacaoAmostra: payload.subclassificacaoAmostra,
        descricao: payload.descricao || "Sem descrição"
    });
    return response.data;
}

export async function updateAmostra(id, payload) {
    const response = await api.patch(`/amostras/id/${id}`, payload);
    return response.data;
}

export async function deleteAmostra(id) {
    const response = await api.delete(`/amostras/id/${id}`);
    return response.data;
}

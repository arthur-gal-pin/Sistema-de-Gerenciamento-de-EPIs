import api from "./api";

export async function getEnsaiosPorProtocolo(idProtocolo) {
    try {
        const response = await api.get(`/ensaios/protocolo/${idProtocolo}`);
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar ensaios do protocolo:", error);
        return [];
    }
}

export async function getEnsaioById(id) {
    const response = await api.get(`/ensaios/id/${id}`);
    return response.data?.data;
}

export async function createEnsaio(payload) {
    const response = await api.post("/ensaios", payload);
    return response.data;
}

export async function updateEnsaio(id, payload) {
    const response = await api.patch(`/ensaios/${id}`, payload);
    return response.data;
}

export async function deleteEnsaio(id) {
    const response = await api.delete(`/ensaios/${id}`);
    return response.data;
}

// Amostras associadas ao Ensaio (AmostraEnsaio)
export async function getAmostrasDoEnsaio(idEnsaio) {
    try {
        const response = await api.get(`/ensaios/amostras/ensaio/${idEnsaio}`);
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar amostras do ensaio:", error);
        return [];
    }
}

export async function vincularAmostraAoEnsaio(payload) {
    const response = await api.post("/ensaios/amostras", payload);
    return response.data;
}

export async function desvincularAmostraDoEnsaio(idAmostraEnsaio) {
    const response = await api.delete(`/ensaios/amostras/${idAmostraEnsaio}`);
    return response.data;
}

// Funcionários executores associados ao Ensaio (FuncionarioEnsaio)
export async function getFuncionariosDoEnsaio(idEnsaio) {
    try {
        const response = await api.get(`/ensaios/funcionarios/ensaio/${idEnsaio}`);
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar executores do ensaio:", error);
        return [];
    }
}

export async function vincularFuncionarioAoEnsaio(payload) {
    const response = await api.post("/ensaios/funcionarios", payload);
    return response.data;
}

export async function desvincularFuncionarioDoEnsaio(idFuncionarioEnsaio) {
    const response = await api.delete(`/ensaios/funcionarios/${idFuncionarioEnsaio}`);
    return response.data;
}

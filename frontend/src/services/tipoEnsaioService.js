import api from "./api";

export async function getAllTiposEnsaio() {
    try {
        const response = await api.get("/tipo-ensaio/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar tipos de ensaio:", error);
        return [];
    }
}

export async function createTipoEnsaio(payload) {
    const response = await api.post("/tipo-ensaio", payload);
    return response.data;
}

export async function updateTipoEnsaio(id, payload) {
    const response = await api.put(`/tipo-ensaio/${id}`, payload);
    return response.data;
}

export async function deleteTipoEnsaio(id) {
    const response = await api.delete(`/tipo-ensaio/${id}`);
    return response.data;
}

export async function getAllCamposEnsaio() {
    try {
        const response = await api.get("/campo-ensaio/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar campos de ensaio:", error);
        return [];
    }
}

export async function createCampoEnsaio(payload) {
    const response = await api.post("/campo-ensaio", payload);
    return response.data;
}

export async function deleteCampoEnsaio(id) {
    const response = await api.delete(`/campo-ensaio/${id}`);
    return response.data;
}

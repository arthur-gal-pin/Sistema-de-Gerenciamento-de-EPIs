import api from "./api";

export async function getAllInstrumentos() {
    try {
        const response = await api.get("/instrumentos/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar instrumentos:", error);
        return [];
    }
}

export async function createInstrumento(payload) {
    const response = await api.post("/instrumentos", payload);
    return response.data;
}

export async function updateInstrumento(id, payload) {
    const response = await api.patch(`/instrumentos/${id}`, payload);
    return response.data;
}

export async function deleteInstrumento(id) {
    const response = await api.delete(`/instrumentos/${id}`);
    return response.data;
}

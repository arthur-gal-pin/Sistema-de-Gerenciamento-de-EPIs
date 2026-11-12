import api from "./api";

export async function getAllProtocolos() {
    try {
        const response = await api.get("/protocolos/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar protocolos:", error);
        return [];
    }
}

export async function getProtocoloById(id) {
    const response = await api.get(`/protocolos/id/${id}`);
    return response.data?.data;
}

export async function createProtocolo(payload) {
    const response = await api.post("/protocolos", payload);
    return response.data;
}

export async function updateProtocolo(id, payload) {
    const response = await api.patch(`/protocolos/${id}`, payload);
    return response.data;
}

export async function deleteProtocolo(id) {
    const response = await api.delete(`/protocolos/${id}`);
    return response.data;
}

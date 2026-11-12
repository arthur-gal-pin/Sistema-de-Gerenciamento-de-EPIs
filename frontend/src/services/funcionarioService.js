import api from "./api";

export async function getAllFuncionarios() {
    try {
        const response = await api.get("/funcionarios/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar funcionários:", error);
        return [];
    }
}

export async function getFuncionarioById(id) {
    const response = await api.get(`/funcionarios/id/${id}`);
    return response.data?.data;
}

export async function createFuncionario(formData) {
    // Pode ser FormData (com foto) ou objeto JSON
    const response = await api.post("/funcionarios", formData);
    return response.data;
}

export async function updateFuncionario(id, formData) {
    const response = await api.patch(`/funcionarios/id/${id}`, formData);
    return response.data;
}

export async function deleteFuncionario(id) {
    const response = await api.delete(`/funcionarios/id/${id}`);
    return response.data;
}

export async function getAllCargos() {
    try {
        const response = await api.get("/cargos/all");
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar cargos:", error);
        return [];
    }
}

export async function createCargo(payload) {
    const response = await api.post("/cargos", payload);
    return response.data;
}

export async function createTelefone(payload) {
    const response = await api.post("/telefones", payload);
    return response.data;
}

export async function deleteTelefone(id) {
    const response = await api.delete(`/telefones/${id}`);
    return response.data;
}

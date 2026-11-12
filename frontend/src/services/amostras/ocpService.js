import api from "../api";

export async function getAllOcps() {
    try {
        const response = await api.get("/ocps/all");
        const ocps = response.data?.data ?? [];

        return ocps.map((ocp) => ({
            id: ocp.idOCP ?? ocp.idOcp ?? ocp.id,
            idOCP: ocp.idOCP ?? ocp.idOcp ?? ocp.id,
            nome: ocp.nomeOCP ?? ocp.nomeOcp ?? ocp.razaoSocial ?? ocp.nome,
            nomeOCP: ocp.nomeOCP ?? ocp.nomeOcp ?? ocp.razaoSocial ?? ocp.nome,
        }));
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar dados de OCPs: ", error);
        return [];
    }
}

export async function createOcp(nomeOCP) {
    const response = await api.post("/ocps", { nomeOCP });
    return response.data;
}

export async function updateOcp(id, nomeOCP) {
    const response = await api.patch(`/ocps/id/${id}`, { nomeOCP });
    return response.data;
}

export async function deleteOcp(id) {
    const response = await api.delete(`/ocps/id/${id}`);
    return response.data;
}

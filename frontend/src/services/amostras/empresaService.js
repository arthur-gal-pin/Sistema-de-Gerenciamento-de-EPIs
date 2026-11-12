import api from "../api";

export async function getAllEmpresas() {
    try {
        const response = await api.get("/empresas/all");
        const empresas = response.data?.data ?? [];

        return empresas.map((empresa) => ({
            id: empresa.idEmpresa ?? empresa.id,
            idEmpresa: empresa.idEmpresa ?? empresa.id,
            nome: empresa.nomeEmpresa ?? empresa.razaoSocial ?? empresa.nome,
            nomeEmpresa: empresa.nomeEmpresa ?? empresa.razaoSocial ?? empresa.nome,
            cnpj: empresa.cnpj,
            emailEmpresa: empresa.emailEmpresa
        }));
    } catch (error) {
        if (error.response?.status === 404) return [];
        console.error("Erro ao buscar dados de Empresas: ", error);
        return [];
    }
}

export async function createEmpresa(dados) {
    const response = await api.post("/empresas", dados);
    return response.data;
}

export async function updateEmpresa(id, dados) {
    const response = await api.patch(`/empresas/id/${id}`, dados);
    return response.data;
}

export async function deleteEmpresa(id) {
    const response = await api.delete(`/empresas/id/${id}`);
    return response.data;
}

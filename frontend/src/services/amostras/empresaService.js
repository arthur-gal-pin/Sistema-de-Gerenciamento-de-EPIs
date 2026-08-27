import api from "../api";

export async function getAllEmpresas() {
    try {
        const response = await api.get("/empresas/all");
        const empresas = response.data?.data ?? [];

        return empresas.map((empresa) => ({
            id: empresa.idEmpresa ?? empresa.id,
            nome: empresa.nomeEmpresa ?? empresa.razaoSocial ?? empresa.nome,
        }));

    } catch (error) {
        console.error("Erro ao buscar dados de Empresas: ", error);

        return [];
    }
}

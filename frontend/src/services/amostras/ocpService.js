import api from "../api";

export async function getAllOcps() {
    try {
        const response = await api.get("/ocps/all");
        const ocps = response.data?.data ?? [];

        return ocps.map((ocp) => ({
            id: ocp.idOcp ?? ocp.id,
            nome: ocp.nomeOcp ?? ocp.razaoSocial ?? ocp.nome,
        }));

    } catch (error) {
        console.error("Erro ao buscar dados de OCPs: ", error);

        return [];
    }
}

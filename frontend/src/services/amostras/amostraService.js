import api from "../api";

export async function getAllAmostras() {
    try {
        const response = await api.get("/amostras/all");
        const amostras = response.data?.data ?? [];

        return amostras.map((amostra) => ({
            id: amostra.idAmostra ?? amostra.id,
            nome: amostra.nomeAmostra ?? amostra.nome,
        }));

    } catch (error) {
        console.error("Erro ao buscar dados de Amostras: ", error);

        return [];
    }
}

export async function postAmostras(payload) {
    try {
        const response = await api.post("/amostras", {
            FK_idOCP: payload.ocpId,
            FK_idEmpresa: payload.empresaId,
            nomeAmostra: payload.nome,
            tipoAmostra: payload.tipoAmostra,
            situacaoAmostra: payload.situacaoAmostra
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao enviar dados de Amostras: ", error);

        return;
    }
}

import { api_proprietaria } from "./api";

export async function getAllAmostras() {
    try {

        const response = await api_proprietaria.get("/amostras/all")

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar dados de Amostras: ", error);

        return [];
    }
}

export async function postAmostras(payload) {
    try {
        const response = await api_proprietaria.post("/amostras", {
            FK_idOCP: payload.ocpId,
            FK_idEmpresa: payload.empresaId,
            nomeAmostra: payload.nome,
            tipoAmostra: payload.tipoAmostra,
            situacaoAmostra: payload.situacaoAmostra
        })

        return response.data;
    } catch (error) {
        console.error("Erro ao enviar dados de Amostras")

        return;
    }

} 
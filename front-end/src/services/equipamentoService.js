import { apiFundacentro} from "./api";

export async function getEquipamentos() {
    try {
        const response = await apiFundacentro.get("/equipamento");

        return response.data

    } catch (error) {
        console.error("Erro ao buscar dados do equipamento: ", error);
        return [];
    }
}
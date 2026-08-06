import { apiFundacentro} from "./api";

export async function getEquipes() {
    try {
        const response = await apiFundacentro.get("/equipe");

        return response.data

    } catch (error) {
        console.error("Erro ao buscar dados da equipe: ", error);
        return [];
    }
}
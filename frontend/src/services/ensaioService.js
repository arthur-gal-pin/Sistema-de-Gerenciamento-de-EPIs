import { apiFundacentro} from "./api";

export async function getEnsaios() {
    try {
        const response = await apiFundacentro.get("/ensaio");

        return response.data

    } catch (error) {
        console.error("Erro ao buscar dados dos ensaios: ", error);
        return [];
    }
}
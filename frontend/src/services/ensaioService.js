import api from "./api";

export async function getEnsaios() {
    try {
        const response = await api.get("/ensaio");

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar dados dos ensaios: ", error);
        return [];
    }
}

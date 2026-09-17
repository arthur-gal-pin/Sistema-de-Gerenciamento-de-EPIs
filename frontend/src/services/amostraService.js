import api from "./api";

export async function getAmostras() {
    try {
        const response = await api.get("/amostras");

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar dados de amostras: ", error);
        return [];
    }
}

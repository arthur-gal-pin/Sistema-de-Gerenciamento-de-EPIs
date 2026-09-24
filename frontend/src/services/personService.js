import { api_jsonfake } from "./api";

export async function getPersons() {
    try {
        
        const response = await api_jsonfake.get("/users");

        return response.data;

    } catch (error) {
        console.error("Erro ao buscar dados de pessoas:", error);

        return [];
    }
}
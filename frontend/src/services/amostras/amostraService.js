import { api_proprietaria } from "./api";

export async function getAllAmostras(){
    try{

        const response = await api_proprietaria.get("/amostras/all")

        return response.data;

    }catch(error){
        console.error("Erro ao buscar dados de OCPs: ", error);

        return[];
    }
}
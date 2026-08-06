import { api_proprietaria } from "./api";

export async function getAllOcps(){
    try{

        const response = await api_proprietaria.get("/ocps/all")

        return response.data;

    }catch(error){
        console.error("Erro ao buscar dados de OCPs: ", error);

        return[];
    }
}
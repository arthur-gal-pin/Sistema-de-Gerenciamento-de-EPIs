import { api_proprietaria } from "./api";

export async function getAllEmpresas(){
    try{

        const response = await api_proprietaria.get("/empresas/all")

        return response.data;

    }catch(error){
        console.error("Erro ao buscar dados de OCPs: ", error);

        return[];
    }
}
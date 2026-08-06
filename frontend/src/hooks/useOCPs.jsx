import {useEffect, useState} from "react";
import { getAllOcps } from "../services/amostras/ocpService";

export function useOCPs (){
    const [opcoes, setOpcoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadOcps() {
            try {
                const data = await getAllOcps();

                setOpcoes(data);

            } catch (error) {

                console.log("Erro ao buscar pessoas", error);
            } finally{

                setLoading(false);
            }
        }

        loadOcps();

    }, []);

    return {opcoes, loading};
}
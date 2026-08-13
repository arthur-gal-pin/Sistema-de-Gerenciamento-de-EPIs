import {useEffect, useState} from "react";
import { getAllEmpresas } from "../services/amostras/empresaService";

export default function useEmpresas (){
    const [opcoes, setOpcoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadEmpresas() {
            try {
                const data = await getAllEmpresas();

                setOpcoes(data);

            } catch (error) {

                console.log("Erro ao buscar pessoas", error);
            } finally{

                setLoading(false);
            }
        }

        loadEmpresas();

    }, []);

    return {opcoes, loading};
}
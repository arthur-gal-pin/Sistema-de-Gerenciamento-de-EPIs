import { useEffect, useState } from "react";
import { getEquipes } from "../services/equipeService";

export function useEquipes() {
    const [equipes, setEquipes] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        
        async function loadEquipes() {
            try {
                
                const data = await getEquipes(); // Faz a consulta na api
                setEquipes(data); // Retorna tudo o que vem da api

            } catch (error) {

                console.log("erro ao carregar equipes:", error);

            } finally{

                setLoading(false);
                // O finally serve para, caso o try dê sucesso, ele será executado e finalizará a execução.
                
            }
        }

        loadEquipes(); // chamar a função após terminá-la

    }, []); // o colchete vazio significa que quando o hook for chamado, ele carregará apenas uma única vez

    return {equipes, loading}
}
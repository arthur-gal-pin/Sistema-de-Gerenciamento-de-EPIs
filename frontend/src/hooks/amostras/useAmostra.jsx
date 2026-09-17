import { useEffect, useState } from "react";
import { getAmostras } from "../../services/amostraService";

export function useAmostras() {
    const [amostras, setAmostras] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        
        async function loadAmostras() {
            try {
                
                const data = await getAmostras(); // Faz a consulta na api
                setAmostras(data); // Retorna tudo o que vem da api

            } catch (error) {

                console.log("erro ao carregar amostras:", error);

            } finally{

                setLoading(false);
                // O finally serve para, caso o try dê sucesso, ele será executado e finalizará a execução.
                
            }
        }

        loadAmostras(); // chamar a função após terminá-la

    }, []); // o colchete vazio significa que quando o hook for chamado, ele carregará apenas uma única vez

    return {amostras, loading}
}
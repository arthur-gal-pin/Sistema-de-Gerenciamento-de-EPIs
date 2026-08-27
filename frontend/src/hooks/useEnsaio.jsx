import { useEffect, useState } from "react";
import { getEnsaios } from "../services/ensaioService";

export function useEnsaios() {
    const [ensaios, setEnsaios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadEnsaios() {
            try {

                const data = await getEnsaios(); // Faz a consulta na api
                setEnsaios(data); // Retorna tudo o que vem da api

            } catch (error) {

                console.log("erro ao carregar ensaios:", error);

            } finally {

                setLoading(false);

            }
        }

        loadEnsaios();

    }, []);

    return { ensaios, loading };
}

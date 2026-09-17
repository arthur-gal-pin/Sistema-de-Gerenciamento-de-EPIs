import { useEffect, useState } from "react";
import { getEquipamentos } from "../services/equipamentoService";

export function useEquipamentos() {
    const [equipamentos, setEquipamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadEquipamentos() {
            try {

                const data = await getEquipamentos(); // Faz a consulta na api
                setEquipamentos(data); // Retorna tudo o que vem da api

            } catch (error) {

                console.log("erro ao carregar equipamentos:", error);

            } finally {

                setLoading(false);

            }
        }

        loadEquipamentos();

    }, []);

    return { equipamentos, loading };
}

import { useEffect, useState } from "react";
import { getAllAmostras } from "../../services/amostras/amostraService";

export function useAmostras() {
    const [amostras, setAmostras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAmostras() {
            try {
                const data = await getAllAmostras();
                setAmostras(data);
            } catch (error) {
                console.error("Erro ao carregar amostras:", error);
            } finally {
                setLoading(false);
            }
        }

        loadAmostras();
    }, []);

    return { amostras, loading };
}

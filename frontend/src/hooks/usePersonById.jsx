import { useEffect, useState } from "react";
import { getPersonById } from "../services/personService";
import { data } from "react-router-dom";

export function usePersonById(id) {
    const [person, setPerson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadPerson() {
            try {
                const data = await getPersonById();

                setPerson(data);

            } catch (error) {

                console.error("Erro ao buscar pessoas", error);
                setError(error)

            } finally {

                setLoading(false)
            }
        }

        if(id) loadPerson();

    }, [id])

    return {person, loading, error};
}
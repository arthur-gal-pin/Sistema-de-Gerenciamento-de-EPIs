import axios from "axios"

export const apiFundacentro = axios.create(
    {
        baseURL: 'http://localhost:3030',
        timeout: 5000
    }
);
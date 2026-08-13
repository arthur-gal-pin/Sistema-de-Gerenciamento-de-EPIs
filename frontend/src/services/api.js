<<<<<<< HEAD
import axios from "axios";

const TOKEN = 'asl'

const api_proprietaria = axios.create(
    {
        baseURL: "http://localhost:3360",
        timeout: 5000
    }
);

api_proprietaria.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

export default api_proprietaria;
=======
import axios from "axios"

export const apiFundacentro = axios.create(
    {
        baseURL: 'http://localhost:3030',
        timeout: 5000
    }
);
>>>>>>> feat/Tela-Home

import axios from "axios";

export const api_proprietaria = axios.create(
    {
        baseURL: "http://localhost:3030",
        timeout: 5000
    }
);
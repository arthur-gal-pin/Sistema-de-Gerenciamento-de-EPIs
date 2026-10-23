import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3500", //Mudar quando entrar em produção
  timeout: 5000,
});

api.defaults.withCredentials = true;

export default api;
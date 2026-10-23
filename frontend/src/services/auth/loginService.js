import api from "../api";

export default async function loginService(cpf, senha){
    const response = await api.post("/login", {cpf, senha});
    return response;
}
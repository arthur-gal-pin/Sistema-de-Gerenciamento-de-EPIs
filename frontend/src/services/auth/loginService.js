import api from "../api";

export async function loginService(cpf, senha) {
    const response = await api.post("/login", { cpf, senha });
    return response.data;
}

export async function meService() {
    const response = await api.get("/profile/meu-perfil");
    return response.data;
}

export async function logoutService() {
    const response = await api.post("/profile/logout");
    return response.data;
}
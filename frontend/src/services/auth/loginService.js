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
    const response = await api.post("/logout");
    return response.data;
}

export async function esqueciSenhaService(dados) {
    const response = await api.post("/esqueci-senha", dados);
    return response.data;
}

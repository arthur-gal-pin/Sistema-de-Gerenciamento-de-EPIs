import api from "./api";

export async function getMeuPerfil() {
    const response = await api.get("/profile/meu-perfil");
    return response.data?.data;
}

export async function updatePerfilInfo(payload) {
    const response = await api.patch("/profile/meu-perfil/change-info", payload);
    return response.data;
}

export async function updatePerfilPassword(payload) {
    const response = await api.patch("/profile/meu-perfil/change-password", payload);
    return response.data;
}

export async function updatePerfilPfp(formData) {
    const response = await api.post("/profile/meu-perfil/change-pfp", formData);
    return response.data;
}

export async function removePerfilPfp() {
    const response = await api.patch("/profile/meu-perfil/remove-pfp");
    return response.data;
}

import api from "./api";
export const getCurrentUser = async () => (await api.get('/profile/meu-perfil')).data.data;
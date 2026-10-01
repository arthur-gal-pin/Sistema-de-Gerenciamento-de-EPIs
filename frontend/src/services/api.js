import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// 1. Interceptor de REQUISIÇÃO (Anexa o token em cada chamada)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de RESPOSTA (Captura tokens expirados)
api.interceptors.response.use(
  (response) => {
    // Se a requisição deu certo (status 2xx), apenas retorna a resposta normalmente
    return response;
  },
  (error) => {
    // Se a API respondeu com status 401 (Não autorizado / Token Expirado)
    if (error.response && error.response.status === 401) {
      // Limpa o token inválido/expirado
      localStorage.removeItem("token");

      // Redireciona o usuário para a página de login
      // (caso ele ainda não esteja na página de login)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
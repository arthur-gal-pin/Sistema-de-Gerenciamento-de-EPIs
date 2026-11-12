import axios from "axios";

export const API_BASE_URL = "http://localhost:3500";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.defaults.withCredentials = true;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/no-login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

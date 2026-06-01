import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const TOKEN_KEY = "sgoha_token";

/** Eventos custom para que el AuthContext reaccione al perder/cambiar sesión. */
export const AUTH_EVENTS = {
  invalid: "sgoha:auth-invalid", // 401: token no válido / expirado
  forbidden: "sgoha:auth-forbidden", // 403: rol insuficiente
};

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  // Siempre tomamos el token vigente en disco (puede haber cambiado en otra pestaña).
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;
    const isAuthEndpoint = url.includes("/auth/login");

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.invalid));
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.forbidden));
    }

    return Promise.reject(error);
  }
);

export const getData = (response) => response.data?.data ?? response.data;

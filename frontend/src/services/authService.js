import { api, getData, TOKEN_KEY } from "../config/api.js";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  getMe: () => api.get("/auth/me").then(getData),

  /** Edita el propio nombre/correo. */
  updateMyProfile: (data) => api.put("/auth/me", data).then(getData),

  /** Cambia la propia contraseña. */
  changeMyPassword: (currentPassword, newPassword) =>
    api
      .put("/auth/me/password", { currentPassword, newPassword })
      .then(getData),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

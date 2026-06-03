import { api, getData } from "../config/api.js";

/** Administración de usuarios (solo ADMIN). */
export const userService = {
  list: (params = {}) => api.get("/users", { params }).then(getData),
  get: (id) => api.get(`/users/${id}`).then(getData),
  create: (data) => api.post("/users", data).then(getData),
  update: (id, data) => api.put(`/users/${id}`, data).then(getData),
  remove: (id) => api.delete(`/users/${id}`).then(getData),
  toggle: (id) => api.patch(`/users/${id}/toggle`).then(getData),
  resetPassword: (id, password) =>
    api.put(`/users/${id}/password`, { password }).then(getData),
};

import { api, getData } from "../config/api.js";

export const timeslotService = {
  list: (params = {}) =>
    api.get("/timeslots", { params }).then(getData),
  create: (body) => api.post("/timeslots", body).then(getData),
  update: (id, body) => api.put(`/timeslots/${id}`, body).then(getData),
  remove: (id) => api.delete(`/timeslots/${id}`).then(getData),
  /** Regenera/sincroniza las 126 franjas oficiales HORALV. */
  syncOfficial: () => api.post("/timeslots/sync-official").then(getData),
};

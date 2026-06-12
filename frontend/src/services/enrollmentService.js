import { api, getData } from "../config/api.js";

export const enrollmentService = {
  getEnrollments: (params = {}) =>
    api.get("/enrollments", { params }).then(getData),
  getEnrollmentById: (id) => api.get(`/enrollments/${id}`).then(getData),
  createEnrollment: (data) => api.post("/enrollments", data).then(getData),
  updateEnrollment: (id, data) => api.put(`/enrollments/${id}`, data).then(getData),
  validateEnrollment: (id) =>
    api.post(`/enrollments/${id}/validate`).then(getData),
  confirmEnrollment: (id) =>
    api.post(`/enrollments/${id}/confirm`).then(getData),
  rejectEnrollment: (id, reason = "") =>
    api.post(`/enrollments/${id}/reject`, { reason }).then(getData),
  observeEnrollment: (id, note = "") =>
    api.post(`/enrollments/${id}/observe`, { note }).then(getData),

  // Alias retrocompatibles
  list: (params) => enrollmentService.getEnrollments(params),
  get: (id) => enrollmentService.getEnrollmentById(id),
  create: (data) => enrollmentService.createEnrollment(data),
  update: (id, data) => enrollmentService.updateEnrollment(id, data),
  validate: (id) => enrollmentService.validateEnrollment(id),
  confirm: (id) => enrollmentService.confirmEnrollment(id),
  reject: (id, reason) => enrollmentService.rejectEnrollment(id, reason),
  observe: (id, note) => enrollmentService.observeEnrollment(id, note),
};

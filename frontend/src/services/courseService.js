import { api, getData } from "../config/api.js";

export const courseService = {
  getCourses: (params = {}) =>
    api.get("/courses", { params }).then(getData),

  getCourseById: (id) => api.get(`/courses/${id}`).then(getData),

  createCourse: (data) => api.post("/courses", data).then(getData),

  updateCourse: (id, data) => api.put(`/courses/${id}`, data).then(getData),

  deleteCourse: (id) => api.delete(`/courses/${id}`).then(getData),

  // Alias para compatibilidad
  list: (params) => courseService.getCourses(params),
  get: (id) => courseService.getCourseById(id),
  create: (data) => courseService.createCourse(data),
  update: (id, data) => courseService.updateCourse(id, data),
  remove: (id) => courseService.deleteCourse(id),
};

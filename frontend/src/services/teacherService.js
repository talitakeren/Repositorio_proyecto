import { api, getData } from "../config/api.js";

export const teacherService = {
  getTeachers: (params = {}) =>
    api.get("/teachers", { params }).then(getData),

  getTeacherById: (id) => api.get(`/teachers/${id}`).then(getData),

  createTeacher: (data) => api.post("/teachers", data).then(getData),

  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data).then(getData),

  deleteTeacher: (id) => api.delete(`/teachers/${id}`).then(getData),

  updateTeacherAvailability: (id, availability) =>
    api.put(`/teachers/${id}/availability`, { availability }).then(getData),

  updateTeacherCourses: (id, availableCourses) =>
    api.put(`/teachers/${id}/courses`, { availableCourses }).then(getData),

  list: (params) => teacherService.getTeachers(params),
  get: (id) => teacherService.getTeacherById(id),
  create: (data) => teacherService.createTeacher(data),
  update: (id, data) => teacherService.updateTeacher(id, data),
  remove: (id) => teacherService.deleteTeacher(id),
  setAvailability: (id, availability) =>
    teacherService.updateTeacherAvailability(id, availability),
  setCourses: (id, availableCourses) =>
    teacherService.updateTeacherCourses(id, availableCourses),
};

import { api, getData } from "../config/api.js";

export const studentService = {
  getStudents: (params = {}) =>
    api.get("/students", { params }).then(getData),

  getStudentById: (id) => api.get(`/students/${id}`).then(getData),

  createStudent: (data) => api.post("/students", data).then(getData),

  updateStudent: (id, data) =>
    api.put(`/students/${id}`, data).then(getData),

  deleteStudent: (id) => api.delete(`/students/${id}`).then(getData),

  /**
   * Actualiza el historial académico del estudiante.
   * approvedCourses será usado para validar prerrequisitos en matrícula.
   */
  updateApprovedCourses: (id, approvedCourses) =>
    api
      .put(`/students/${id}/approved-courses`, { approvedCourses })
      .then(getData),

  // Aliases retro-compatibles.
  list: (params) => studentService.getStudents(params),
  get: (id) => studentService.getStudentById(id),
  create: (data) => studentService.createStudent(data),
  update: (id, data) => studentService.updateStudent(id, data),
  remove: (id) => studentService.deleteStudent(id),
};

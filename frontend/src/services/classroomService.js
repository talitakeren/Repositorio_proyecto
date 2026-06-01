import { api, getData } from "../config/api.js";

export const classroomService = {
  getClassrooms: (params = {}) =>
    api.get("/classrooms", { params }).then(getData),

  getClassroomById: (id) => api.get(`/classrooms/${id}`).then(getData),

  createClassroom: (data) => api.post("/classrooms", data).then(getData),

  updateClassroom: (id, data) =>
    api.put(`/classrooms/${id}`, data).then(getData),

  deleteClassroom: (id) => api.delete(`/classrooms/${id}`).then(getData),

  // Aliases retro-compatibles.
  list: (params) => classroomService.getClassrooms(params),
  get: (id) => classroomService.getClassroomById(id),
  create: (data) => classroomService.createClassroom(data),
  update: (id, data) => classroomService.updateClassroom(id, data),
  remove: (id) => classroomService.deleteClassroom(id),
};

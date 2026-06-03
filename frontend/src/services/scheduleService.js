import { api, getData } from "../config/api.js";

export const scheduleService = {
  getSchedulePrecheck: () => api.get("/schedules/precheck").then(getData),

  generateSchedule: (period = "2026-1") =>
    api.post("/schedules/generate", { period }).then(getData),

  getLatestSchedule: () => api.get("/schedules/latest").then(getData),

  getSchedules: () => api.get("/schedules").then(getData),

  getScheduleById: (id) => api.get(`/schedules/${id}`).then(getData),

  getStudentSchedule: (studentId) =>
    api.get(`/schedules/student/${studentId}`).then(getData),

  getTeacherSchedule: (teacherId) =>
    api.get(`/schedules/teacher/${teacherId}`).then(getData),

  getClassroomSchedule: (classroomId) =>
    api.get(`/schedules/classroom/${classroomId}`).then(getData),

  // Aliases retro-compatibles
  list: () => scheduleService.getSchedules(),
  generate: (period) => scheduleService.generateSchedule(period),
  byStudent: (id) => scheduleService.getStudentSchedule(id),
  byTeacher: (id) => scheduleService.getTeacherSchedule(id),
  byClassroom: (id) => scheduleService.getClassroomSchedule(id),
};

import { api, getData } from "../config/api.js";

/**
 * Servicios para el portal del docente autenticado.
 * Usan los endpoints /me del backend (vinculados al usuario logueado).
 */
export const teacherPortalService = {
  getMyProfile: () => api.get("/teachers/me").then(getData),

  getMyAvailability: async () => {
    const me = await teacherPortalService.getMyProfile();
    return me?.availability || [];
  },

  updateMyAvailability: (availability) =>
    api
      .put("/teachers/me/availability", { availability })
      .then(getData),

  getMyCourses: async () => {
    const me = await teacherPortalService.getMyProfile();
    return me?.availableCourses || [];
  },

  /** Alias semántico para la vista "Mis cursos". */
  getTeacherCourses: async () => {
    const me = await teacherPortalService.getMyProfile();
    return me?.availableCourses || [];
  },

  getMySchedule: () => api.get("/schedules/me/teacher").then(getData),

  /** Resumen calculado a partir del perfil y horario real. */
  getMySummary: async () => {
    const [me, schedule] = await Promise.all([
      teacherPortalService.getMyProfile().catch(() => null),
      teacherPortalService.getMySchedule().catch(() => []),
    ]);
    const assignments = Array.isArray(schedule) ? schedule : [];
    return {
      teacher: me,
      coursesCount: me?.availableCourses?.length || 0,
      blocksCount: me?.availability?.length || 0,
      hasAvailability: (me?.availability?.length || 0) > 0,
      scheduleBlocks: assignments.length,
      scheduleStatus:
        assignments.length > 0 ? "Generado" : "Pendiente",
    };
  },
};

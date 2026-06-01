import { api, getData } from "../config/api.js";

/**
 * Servicios para el portal del alumno autenticado.
 * Usan los endpoints /me del backend.
 */
export const studentPortalService = {
  getMyProfile: () => api.get("/students/me").then(getData),

  getMyEnrollment: () => api.get("/enrollments/me").then(getData),

  saveMySelection: (courseIds) =>
    api.put("/enrollments/me", { courseIds }).then(getData),

  validateMySelection: (courseIds) =>
    api.post("/enrollments/me/validate", { courseIds }).then(getData),

  /** Confirma la matrícula previamente guardada y validada. */
  confirmMyEnrollment: () =>
    api.post("/enrollments/me/confirm").then(getData),

  getMySchedule: () => api.get("/schedules/me/student").then(getData),

  /** Resumen para la home. */
  getMySummary: async () => {
    const [profile, enrollmentBundle, schedule] = await Promise.all([
      studentPortalService.getMyProfile().catch(() => null),
      studentPortalService.getMyEnrollment().catch(() => null),
      studentPortalService.getMySchedule().catch(() => []),
    ]);
    const enrollment = enrollmentBundle?.enrollment || null;
    const assignments = Array.isArray(schedule) ? schedule : [];
    return {
      student: profile || enrollmentBundle?.student || null,
      enrollment,
      totalCredits: enrollment?.totalCredits || 0,
      coursesCount: enrollment?.courses?.length || 0,
      status: enrollment?.status || null,
      scheduleBlocks: assignments.length,
      scheduleStatus:
        assignments.length > 0 ? "Generado" : "Pendiente",
    };
  },
};

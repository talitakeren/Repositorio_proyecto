/**
 * Matrículas que el motor de horarios puede programar.
 * - CONFIRMED: confirmadas por administración
 * - VALIDATED: validadas por administración (listas para confirmar)
 * - VALID: flujo alumno legado con validación automática exitosa
 */
export const SCHEDULE_ENROLLMENT_STATUSES = ["CONFIRMED", "VALIDATED", "VALID"];

export function isScheduleEligibleEnrollment(enrollment) {
  return SCHEDULE_ENROLLMENT_STATUSES.includes(enrollment?.status);
}

export function scheduleEligibleEnrollmentQuery() {
  return { status: { $in: SCHEDULE_ENROLLMENT_STATUSES } };
}

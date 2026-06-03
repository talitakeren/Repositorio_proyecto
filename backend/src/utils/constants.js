export const ROLES = ["ADMIN", "TEACHER", "STUDENT"];
export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
export const CLASSROOM_TYPES = ["STANDARD", "LAB", "COMPUTER_ROOM"];
export const CLASSROOM_STATUSES = [
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "INACTIVE",
];
/**
 * Estados de matrícula:
 * - VALID/INVALID: legado (flujo alumno existente)
 * - PENDING/VALIDATED/OBSERVED/REJECTED: flujo administrativo
 */
export const ENROLLMENT_STATUS = [
  "DRAFT",
  "PENDING",
  "VALID",
  "VALIDATED",
  "INVALID",
  "CONFIRMED",
  "OBSERVED",
  "REJECTED",
];
/** Estado administrativo de matrícula visible en la ficha del estudiante. */
export const STUDENT_ENROLLMENT_STATUSES = [
  "PENDING",
  "VALIDATED",
  "CONFIRMED",
  "REJECTED",
];
export const SCHEDULE_STATUS = ["GENERATED", "PARTIAL", "FAILED"];

/** Re-exportado desde scheduleEnrollment.js para documentación en catálogo. */
export { SCHEDULE_ENROLLMENT_STATUSES } from "./scheduleEnrollment.js";

export const DAY_LABELS = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export const MIN_CREDITS = 20;
export const MAX_CREDITS = 22;

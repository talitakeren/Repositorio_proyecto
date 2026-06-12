/**
 * Etiquetas, opciones y mapeos visuales del módulo de estudiantes.
 */

export const STUDENT_ENROLLMENT_STATUS_OPTIONS = [
  { value: "PENDING", label: "Matrícula pendiente" },
  { value: "VALIDATED", label: "Matrícula validada" },
  { value: "CONFIRMED", label: "Matrícula confirmada" },
  { value: "REJECTED", label: "Matrícula rechazada" },
];

export const STUDENT_ENROLLMENT_STATUS_LABELS = {
  PENDING: "Pendiente",
  VALIDATED: "Validada",
  CONFIRMED: "Confirmada",
  REJECTED: "Rechazada",
};

export const STUDENT_ENROLLMENT_STATUS_BADGE = {
  PENDING: "warning",
  VALIDATED: "success",
  CONFIRMED: "info",
  REJECTED: "error",
};

/** Programas académicos sugeridos para el filtro y el formulario. */
export const SUGGESTED_PROGRAMS = [
  "Ingeniería de Sistemas e Informática",
  "Ingeniería Industrial",
  "Administración",
  "Contabilidad",
  "Derecho",
  "Psicología",
  "Otro",
];

export function getStudentEnrollmentLabel(status) {
  return (
    STUDENT_ENROLLMENT_STATUS_LABELS[status] || status || "—"
  );
}

/**
 * Suma los créditos de la lista de cursos aprobados.
 * Funciona tanto con cursos poblados (objetos) como con IDs (devuelve 0).
 */
export function getApprovedCreditsTotal(approvedCourses = []) {
  return approvedCourses.reduce((sum, c) => {
    if (typeof c !== "object" || c === null) return sum;
    return sum + (Number(c.credits) || 0);
  }, 0);
}

/**
 * Determina si un estudiante debe tratarse como nuevo (sin restricciones de
 * prerrequisitos / créditos previos). Es nuevo si el flag está activo o si
 * todavía no tiene historial académico registrado.
 *
 * El módulo de matrícula debe consumir esto para omitir validaciones en la
 * PRIMERA matrícula del alumno.
 */
export function isNewStudent(student) {
  if (!student) return true;
  if (student.isNewStudent === true) return true;
  if (student.isNewStudent === false) return false;
  return (student.approvedCourses?.length || 0) === 0;
}

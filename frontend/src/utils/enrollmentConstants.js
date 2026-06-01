/** Reglas académicas para validación de matrícula (RF-03). */
export const MIN_CREDITS = 20;
export const MAX_CREDITS = 22;

export const ENROLLMENT_STATUS_LABEL = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  VALID: "Válida",
  VALIDATED: "Validada",
  INVALID: "Inválida",
  CONFIRMED: "Confirmada",
  OBSERVED: "Observada",
  REJECTED: "Rechazada",
};

export const ENROLLMENT_STATUS_BADGE = {
  DRAFT: "neutral",
  PENDING: "neutral",
  VALID: "success",
  VALIDATED: "success",
  INVALID: "error",
  CONFIRMED: "info",
  OBSERVED: "warning",
  REJECTED: "error",
};

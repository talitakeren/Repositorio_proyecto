/**
 * Etiquetas, opciones y mapeos visuales del módulo de aulas.
 * Centraliza la representación de `type` y `status` para que cualquier
 * pantalla (lista, formulario, horario) muestre la misma terminología.
 */

export const CLASSROOM_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Aula estándar" },
  { value: "LAB", label: "Laboratorio" },
  { value: "COMPUTER_ROOM", label: "Sala de cómputo" },
];

export const CLASSROOM_TYPE_LABELS = {
  STANDARD: "Aula estándar",
  LAB: "Laboratorio",
  COMPUTER_ROOM: "Sala de cómputo",
};

export const CLASSROOM_TYPE_BADGE = {
  STANDARD: "info",
  LAB: "warning",
  COMPUTER_ROOM: "success",
};

export const CLASSROOM_STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "IN_USE", label: "En uso" },
  { value: "MAINTENANCE", label: "Mantenimiento" },
  { value: "INACTIVE", label: "Inactiva" },
];

export const CLASSROOM_STATUS_LABELS = {
  AVAILABLE: "Disponible",
  IN_USE: "En uso",
  MAINTENANCE: "Mantenimiento",
  INACTIVE: "Inactiva",
};

export const CLASSROOM_STATUS_BADGE = {
  AVAILABLE: "success",
  IN_USE: "info",
  MAINTENANCE: "warning",
  INACTIVE: "neutral",
};

export const CAPACITY_RANGES = [
  { value: "ALL", label: "Cualquier capacidad" },
  { value: "1", label: "1 - 20", min: 1, max: 20 },
  { value: "21", label: "21 - 40", min: 21, max: 40 },
  { value: "41", label: "41 - 60", min: 41, max: 60 },
  { value: "61", label: "Más de 60", min: 61, max: Infinity },
];

export function getClassroomTypeLabel(type) {
  return CLASSROOM_TYPE_LABELS[type] || type || "—";
}

export function getClassroomStatusLabel(status) {
  return CLASSROOM_STATUS_LABELS[status] || status || "—";
}

/** Encuentra el rango de capacidad por su valor "min". */
export function findCapacityRange(value) {
  return CAPACITY_RANGES.find((r) => r.value === value) || CAPACITY_RANGES[0];
}

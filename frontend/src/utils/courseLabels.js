export const CLASSROOM_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Aula estándar" },
  { value: "LAB", label: "Laboratorio" },
  { value: "COMPUTER_ROOM", label: "Sala de cómputo" },
];

export const CLASSROOM_TYPE_LABELS = {
  STANDARD: "Estándar",
  LAB: "Laboratorio",
  COMPUTER_ROOM: "Sala de cómputo",
};

export const CLASSROOM_TYPE_BADGE = {
  STANDARD: "info",
  LAB: "warning",
  COMPUTER_ROOM: "success",
};

export function getClassroomLabel(type) {
  return CLASSROOM_TYPE_LABELS[type] || type;
}

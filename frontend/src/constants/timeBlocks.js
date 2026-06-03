/**
 * Bloques académicos oficiales HORALV (frontend).
 * Espejo de `backend/src/constants/timeBlocks.js`.
 * Fuente única de verdad: 18 franjas por día × 7 días = 126 franjas semanales.
 * No calcular ni modificar minutos — usar exactamente esta lista.
 */
export const TIME_BLOCKS = [
  { startTime: "07:00", endTime: "07:44", label: "07:00 - 07:44" },
  { startTime: "07:45", endTime: "08:29", label: "07:45 - 08:29" },
  { startTime: "08:40", endTime: "09:24", label: "08:40 - 09:24" },
  { startTime: "09:25", endTime: "10:09", label: "09:25 - 10:09" },
  { startTime: "10:20", endTime: "11:04", label: "10:20 - 11:04" },
  { startTime: "11:05", endTime: "11:49", label: "11:05 - 11:49" },
  { startTime: "12:00", endTime: "12:44", label: "12:00 - 12:44" },
  { startTime: "12:45", endTime: "13:29", label: "12:45 - 13:29" },
  { startTime: "14:00", endTime: "14:44", label: "14:00 - 14:44" },
  { startTime: "14:45", endTime: "15:29", label: "14:45 - 15:29" },
  { startTime: "15:40", endTime: "16:24", label: "15:40 - 16:24" },
  { startTime: "16:25", endTime: "17:09", label: "16:25 - 17:09" },
  { startTime: "17:20", endTime: "18:04", label: "17:20 - 18:04" },
  { startTime: "18:05", endTime: "18:49", label: "18:05 - 18:49" },
  { startTime: "19:00", endTime: "19:44", label: "19:00 - 19:44" },
  { startTime: "19:45", endTime: "20:29", label: "19:45 - 20:29" },
  { startTime: "20:30", endTime: "21:14", label: "20:30 - 21:14" },
  { startTime: "21:15", endTime: "21:59", label: "21:15 - 21:59" },
];

export const DAYS = [
  { key: "MONDAY", label: "Lun", fullLabel: "Lunes" },
  { key: "TUESDAY", label: "Mar", fullLabel: "Martes" },
  { key: "WEDNESDAY", label: "Mié", fullLabel: "Miércoles" },
  { key: "THURSDAY", label: "Jue", fullLabel: "Jueves" },
  { key: "FRIDAY", label: "Vie", fullLabel: "Viernes" },
  { key: "SATURDAY", label: "Sáb", fullLabel: "Sábado" },
  { key: "SUNDAY", label: "Dom", fullLabel: "Domingo" },
];

/** Etiquetas largas por clave. */
export const DAY_FULL_LABEL = DAYS.reduce((acc, d) => {
  acc[d.key] = d.fullLabel;
  return acc;
}, {});

/** Duración del bloque académico (minutos). */
export const BLOCK_MINUTES = 44;

/** Total de franjas semanales oficiales. */
export const WEEKLY_SLOT_COUNT = DAYS.length * TIME_BLOCKS.length;

/** ID estable de una franja. */
export function slotKey(day, startTime, endTime) {
  return `${day}|${startTime}|${endTime}`;
}

/**
 * Estadísticas precisas a partir de una lista de slots seleccionados.
 */
export function countAvailabilityStats(availability = []) {
  const blocks = availability.length;
  const minutes = blocks * BLOCK_MINUTES;
  const hours = Math.round((minutes / 60) * 100) / 100;
  return { blocks, minutes, hours };
}

/** Texto legible de horas disponibles. */
export function formatAvailabilityDuration(availability = []) {
  const { blocks, minutes } = countAvailabilityStats(availability);
  if (blocks === 0) return "0 h disponibles";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} h disponibles`;
  return `${h} h ${m} min disponibles`;
}

/**
 * Agrupación visual de franjas (3 turnos). No altera TIME_BLOCKS.
 * Mañana incluye 07:00–13:29; receso 13:29→14:00 sin franja.
 */
export const TIME_GROUPS = [
  {
    key: "MORNING",
    label: "Mañana",
    startTimes: [
      "07:00",
      "07:45",
      "08:40",
      "09:25",
      "10:20",
      "11:05",
      "12:00",
      "12:45",
    ],
  },
  {
    key: "AFTERNOON",
    label: "Tarde",
    startTimes: ["14:00", "14:45", "15:40", "16:25"],
  },
  {
    key: "NIGHT",
    label: "Noche",
    startTimes: ["17:20", "18:05", "19:00", "19:45", "20:30", "21:15"],
  },
];

/** Alias usado por AvailabilityGrid y acciones rápidas. */
export const AVAILABILITY_SHIFTS = TIME_GROUPS.map((g) => ({
  id: g.key,
  label: g.label,
  startTimes: g.startTimes,
}));

/** Bloques HORALV que pertenecen a un turno. */
export function blocksForShift(shiftId) {
  const shift = TIME_GROUPS.find((s) => s.key === shiftId);
  if (!shift) return [];
  const allowed = new Set(shift.startTimes);
  return TIME_BLOCKS.filter((b) => allowed.has(b.startTime));
}

/** Separadores en WeeklyGrid: solo Mañana (inicio), Tarde y Noche. */
export const GRID_TURN_LABELS = [
  { afterIndex: 8, label: "Tarde" },
  { afterIndex: 12, label: "Noche" },
];

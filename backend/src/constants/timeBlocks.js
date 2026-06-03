/**
 * Bloques académicos oficiales HORALV.
 * Fuente única de verdad del backend. Espejo de `frontend/src/constants/timeBlocks.js`.
 * 18 franjas por día × 7 días = 126 franjas semanales.
 * El salto 13:29 → 14:00 es intencional (receso).
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

export const DAY_KEYS = DAYS.map((d) => d.key);

/** Duración exacta del bloque académico (minutos). */
export const BLOCK_MINUTES = 44;

export const WEEKLY_SLOT_COUNT = DAYS.length * TIME_BLOCKS.length;

/** ID estable de una franja a partir de día + horario. */
export function slotKey(day, startTime, endTime) {
  return `${day}|${startTime}|${endTime}`;
}

/**
 * Combinaciones completas día × bloque (126).
 * Usado por seed, sync y validación CSP.
 */
export function buildAllTimeSlots() {
  const all = [];
  for (const day of DAYS) {
    for (const block of TIME_BLOCKS) {
      all.push({
        day: day.key,
        startTime: block.startTime,
        endTime: block.endTime,
        label: `${day.fullLabel} ${block.label}`,
      });
    }
  }
  return all;
}

/** Set de claves válidas (day|start|end) para validar entradas. */
export const VALID_SLOT_KEYS = new Set(
  buildAllTimeSlots().map((s) => slotKey(s.day, s.startTime, s.endTime))
);

/** Filtra disponibilidad/docentes a solo franjas oficiales activas. */
export function sanitizeAvailabilitySlots(availability = []) {
  return (availability || []).filter((a) =>
    VALID_SLOT_KEYS.has(slotKey(a.day, a.startTime, a.endTime))
  );
}

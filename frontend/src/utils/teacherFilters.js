/**
 * Filtros de turno sobre disponibilidad (RF-02) usando los bloques HORALV.
 * Mañana: 07:00 a 13:29 (inicia antes de 14:00).
 * Tarde:  14:00 a 17:09.
 * Noche:  17:20 a 21:59.
 * Fin de semana: sábado o domingo con al menos un bloque.
 */

export function matchesShiftFilter(availability = [], shift) {
  if (!shift || shift === "ALL") return true;
  if (!availability?.length) return false;

  const hasMorning = availability.some((s) => s.startTime < "14:00");
  const hasAfternoon = availability.some(
    (s) => s.startTime >= "14:00" && s.startTime < "17:20"
  );
  const hasNight = availability.some((s) => s.startTime >= "17:20");
  const hasWeekend = availability.some(
    (s) => s.day === "SATURDAY" || s.day === "SUNDAY"
  );

  switch (shift) {
    case "MORNING":
      return hasMorning;
    case "AFTERNOON":
      return hasAfternoon;
    case "NIGHT":
      return hasNight;
    case "WEEKEND":
      return hasWeekend;
    default:
      return true;
  }
}

export function computeTeacherSummary(teachers = []) {
  const active = teachers.filter((t) => t.active !== false);
  const inactive = teachers.filter((t) => t.active === false);
  const totalBlocks = teachers.reduce(
    (sum, t) => sum + (t.availability?.length || 0),
    0
  );
  const withoutAvailability = active.filter(
    (t) => !t.availability?.length
  ).length;
  const withoutCourses = active.filter(
    (t) => !t.availableCourses?.length
  ).length;

  return {
    totalActive: active.length,
    totalInactive: inactive.length,
    totalBlocks,
    withoutAvailability,
    withoutCourses,
  };
}

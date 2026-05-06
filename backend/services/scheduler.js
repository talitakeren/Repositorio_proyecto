/**
 * scheduler.js
 * Algoritmo de generación de horarios académicos con restricciones formales
 * y función objetivo medible.
 *
 * MODELO DE TIMETABLING:
 * ─────────────────────────────────────────────────────────────────────────
 * Variables de decisión:
 *   X(curso, docente, aula, día, bloque) ∈ {0, 1}
 *
 * Dominio:
 *   - días    ∈ { Lunes, Martes, Miércoles, Jueves, Viernes }
 *   - bloques ∈ { 8-10, 10-12, 14-16, 16-18 }
 *
 * Restricciones DURAS (hard constraints) — deben cumplirse siempre:
 *   HC1: Un docente no puede estar en dos cursos al mismo tiempo (mismo día+bloque).
 *   HC2: Un aula no puede tener dos cursos al mismo tiempo (mismo día+bloque).
 *   HC3: Solo se asigna un docente cuya availability incluya el bloque solicitado.
 *
 * Restricciones BLANDAS (soft constraints) — se maximizan, no son obligatorias:
 *   SC1: Preferir bloques indicados en preferences[] del docente.
 *   SC2: Distribuir la carga de cursos uniformemente entre los días de la semana.
 *
 * Función objetivo (FO):
 *   objectiveScore = 0.7 * (cursosAsignados / totalCursos)
 *                  + 0.3 * (preferencesMet / max(cursosAsignados, 1))
 *   Rango: [0, 1]  →  1.0 = solución óptima perfecta
 * ─────────────────────────────────────────────────────────────────────────
 */

const DAYS   = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const BLOCKS = ["8-10", "10-12", "14-16", "16-18"];

/**
 * Genera el horario académico aplicando backtracking con restricciones.
 *
 * @param {Array} courses    - { name, code, credits, classroomType }
 * @param {Array} teachers   - { name, availability: ["Lunes-8-10",...], preferences: [...] }
 * @param {Array} classrooms - { code, capacity, type }
 * @returns {Object} { schedule, totalAssigned, conflicts, unassigned, preferencesMet, objectiveScore }
 */
export function generateSchedule(courses, teachers, classrooms) {

  // ── Validación de entrada ─────────────────────────────────────────────
  if (!courses.length || !teachers.length || !classrooms.length) {
    return {
      schedule:       [],
      totalAssigned:  0,
      conflicts:      0,
      unassigned:     [],
      preferencesMet: 0,
      objectiveScore: 0,
    };
  }

  // ── Estructuras para rastrear ocupación (HC1, HC2) ───────────────────
  const busyTeacher   = {};   // "docente|día|bloque" → true
  const busyClassroom = {};   // "aula|día|bloque"    → true
  const coursesPerDay = { Lunes: 0, Martes: 0, Miércoles: 0, Jueves: 0, Viernes: 0 };

  const schedule     = [];
  const unassigned   = [];
  let preferencesMet = 0;

  // ── Backtracking por cada curso ───────────────────────────────────────
  for (const course of courses) {
    let assigned = false;

    // SC2: ordenar días por menor carga primero
    const orderedDays = [...DAYS].sort(
      (a, b) => coursesPerDay[a] - coursesPerDay[b]
    );

    outer:
    for (const day of orderedDays) {
      for (const block of BLOCKS) {
        const slotKey = `${day}-${block}`;

        for (const teacher of teachers) {
          // HC3: verificar disponibilidad del docente
          const isAvailable =
            teacher.availability && teacher.availability.includes(slotKey);
          if (!isAvailable) continue;

          // HC1: verificar que el docente no esté ocupado en este bloque
          const teacherKey = `${teacher.name}|${day}|${block}`;
          if (busyTeacher[teacherKey]) continue;

          for (const classroom of classrooms) {
            // HC2: verificar que el aula no esté ocupada en este bloque
            const classroomKey = `${classroom.code}|${day}|${block}`;
            if (busyClassroom[classroomKey]) continue;

            // ── ASIGNACIÓN VÁLIDA ENCONTRADA ─────────────────────────
            busyTeacher[teacherKey]     = true;
            busyClassroom[classroomKey] = true;
            coursesPerDay[day]++;

            // SC1: registrar si el bloque coincide con preferencia del docente
            const meetsPreference =
              teacher.preferences && teacher.preferences.includes(slotKey);
            if (meetsPreference) preferencesMet++;

            schedule.push({
              course:         course.name,
              courseCode:     course.code || "",
              teacher:        teacher.name,
              classroom:      classroom.code,
              day,
              block,
              meetsPreference,
            });

            assigned = true;
            break outer;
          }
        }
      }
    }

    if (!assigned) {
      unassigned.push(course.name);
    }
  }

  // ── Función objetivo ──────────────────────────────────────────────────
  const totalCourses   = courses.length;
  const totalAssigned  = schedule.length;
  const conflicts      = unassigned.length;

  const assignmentRate = totalAssigned / totalCourses;
  const preferenceRate = totalAssigned > 0 ? preferencesMet / totalAssigned : 0;
  const objectiveScore = parseFloat(
    (0.7 * assignmentRate + 0.3 * preferenceRate).toFixed(4)
  );

  return {
    schedule,
    totalAssigned,
    conflicts,
    unassigned,
    preferencesMet,
    objectiveScore,
  };
}
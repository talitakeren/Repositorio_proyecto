/**
 * Catálogo de restricciones del motor CSP (solo consulta; no editable en UI).
 */
export const RESTRICTIONS_CATALOG = [
  {
    id: "teacher-no-overlap",
    name: "No solapamiento de docentes",
    type: "HARD",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "UserRound",
    description:
      "Un docente no puede dictar dos cursos en la misma franja horaria.",
    validation:
      "teacher + day + startTime + endTime no debe repetirse.",
    impact: "Evita cruces en el horario docente.",
  },
  {
    id: "classroom-no-overlap",
    name: "No solapamiento de aulas",
    type: "HARD",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "Building2",
    description:
      "Un aula no puede ser usada por dos cursos en la misma franja horaria.",
    validation:
      "classroom + day + startTime + endTime no debe repetirse.",
    impact: "Evita doble ocupación de ambientes físicos.",
  },
  {
    id: "student-no-overlap",
    name: "No solapamiento de estudiantes",
    type: "HARD",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "Users",
    description:
      "Un estudiante no puede tener dos cursos en la misma franja horaria.",
    validation:
      "student + day + startTime + endTime no debe repetirse.",
    impact: "Evita cruces en el horario del alumno.",
  },
  {
    id: "course-classroom-type",
    name: "Compatibilidad curso-aula",
    type: "HARD",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "BookOpen",
    description:
      "El tipo de aula requerida por el curso debe coincidir con el tipo de aula asignada.",
    validation: "course.classroomTypeRequired === classroom.type",
    impact:
      "Evita asignar cursos de laboratorio o cómputo a aulas no compatibles.",
    examples: "STANDARD → Aula estándar · LAB → Laboratorio · COMPUTER_ROOM → Sala de cómputo",
  },
  {
    id: "classroom-capacity",
    name: "Capacidad suficiente del aula",
    type: "HARD",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "Building2",
    description:
      "El aula asignada debe tener capacidad igual o mayor al número de estudiantes matriculados en el curso.",
    validation:
      "classroom.capacity >= cantidad de estudiantes matriculados en el curso.",
    impact: "Evita asignar aulas pequeñas a grupos grandes.",
  },
  {
    id: "confirmed-enrollments",
    name: "Matrículas listas para horarios",
    type: "HARD",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "CalendarCheck",
    description:
      "Solo las matrículas confirmadas, validadas o válidas se consideran para la generación de horarios.",
    validation:
      "Enrollment.status ∈ { CONFIRMED, VALIDATED, VALID }",
    impact:
      "Evita generar horarios con matrículas incompletas o no validadas.",
  },
  {
    id: "teacher-availability",
    name: "Disponibilidad docente",
    type: "OPERATIONAL",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "Clock",
    description:
      "El curso solo debe asignarse en franjas donde el docente haya marcado disponibilidad.",
    validation:
      "La franja asignada debe existir en teacher.availability.",
    impact: "Respeta el horario disponible del docente.",
  },
  {
    id: "official-timeslots",
    name: "Franjas oficiales",
    type: "OPERATIONAL",
    status: "ACTIVE",
    priority: "HIGH",
    icon: "CalendarClock",
    description:
      "El sistema solo puede generar horarios dentro de las franjas oficiales configuradas.",
    validation: "timeSlot ∈ TIME_BLOCKS oficiales (VALID_SLOT_KEYS).",
    impact: "Evita horarios fuera de la estructura académica.",
    showTimeBlocks: true,
  },
  {
    id: "classroom-available",
    name: "Aula activa y disponible",
    type: "OPERATIONAL",
    status: "ACTIVE",
    priority: "MEDIUM",
    icon: "Building2",
    description:
      "El sistema solo debe asignar aulas activas y disponibles.",
    validation: "classroom.active === true && classroom.status === AVAILABLE",
    impact:
      "Evita usar aulas inactivas, en mantenimiento o no habilitadas.",
  },
  {
    id: "teacher-active",
    name: "Docente activo",
    type: "OPERATIONAL",
    status: "ACTIVE",
    priority: "MEDIUM",
    icon: "UserRound",
    description: "El sistema solo debe considerar docentes activos.",
    validation: "teacher.active === true",
    impact: "Evita asignar cursos a docentes inactivos.",
  },
  {
    id: "course-active",
    name: "Curso activo",
    type: "OPERATIONAL",
    status: "ACTIVE",
    priority: "MEDIUM",
    icon: "BookOpen",
    description: "El sistema solo debe considerar cursos activos.",
    validation: "course.active === true",
    impact: "Evita programar cursos deshabilitados.",
  },
];

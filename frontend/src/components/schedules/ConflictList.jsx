import { AlertTriangle } from "lucide-react";

const CONFLICT_META = {
  NO_TEACHER_AVAILABLE: {
    title: "Sin docente disponible",
    recommendation:
      "Asigne un docente al curso y registre su disponibilidad en franjas HORALV.",
  },
  NO_CLASSROOM_COMPATIBLE: {
    title: "Sin aula compatible",
    recommendation:
      "Registre un aula del tipo requerido por el curso o ajuste el tipo en el catálogo.",
  },
  CLASSROOM_CAPACITY_INSUFFICIENT: {
    title: "Capacidad insuficiente",
    recommendation:
      "Use un aula con mayor capacidad o reduzca el grupo de estudiantes matriculados.",
  },
  CLASSROOM_ALREADY_ASSIGNED: {
    title: "Aula ocupada",
    recommendation: "Elija otra franja u otra aula para ese bloque horario.",
  },
  TEACHER_ALREADY_ASSIGNED: {
    title: "Docente ocupado",
    recommendation:
      "Cambie la franja del curso o asigne otro docente habilitado.",
  },
  STUDENT_TIME_CONFLICT: {
    title: "Conflicto de estudiante",
    recommendation:
      "Revise matrículas confirmadas: un alumno tiene dos cursos en la misma franja.",
  },
  NO_TIMESLOT_AVAILABLE: {
    title: "Sin franja disponible",
    recommendation:
      "Active más franjas oficiales o libere docentes y aulas en ese horario.",
  },
  UNASSIGNED_COURSE: {
    title: "Curso sin asignar",
    recommendation:
      "Revise docentes, aulas compatibles, disponibilidad y franjas HORALV activas.",
  },
};

function courseLabel(conflict) {
  const c = conflict.course;
  if (!c) return "—";
  if (typeof c === "object") return c.code || c.name || "Curso";
  return "Curso";
}

export default function ConflictList({ conflicts = [] }) {
  if (!conflicts.length) return null;

  return (
    <ul className="space-y-3">
      {conflicts.map((c, i) => {
        const meta = CONFLICT_META[c.type] || {
          title: c.type || "Conflicto",
          recommendation:
            "Revise matrículas, docentes, aulas y franjas antes de volver a generar.",
        };
        return (
          <li
            key={i}
            className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-amber-900">{meta.title}</p>
              <p className="mt-0.5 text-amber-800">
                <span className="font-medium">Curso:</span> {courseLabel(c)}
              </p>
              <p className="mt-1 text-amber-900/90">{c.message}</p>
              <p className="mt-2 text-xs text-amber-700">
                <span className="font-semibold">Recomendación:</span>{" "}
                {meta.recommendation}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

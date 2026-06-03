import { Plus, X, Ban, CheckCircle2, Search } from "lucide-react";

/**
 * Calcula el estado de un curso para un estudiante dado y una selección.
 * - APPROVED → ya está en el historial académico
 * - SELECTED → ya está en la selección actual
 * - BLOCKED  → faltan prerrequisitos (sólo si el alumno no es nuevo)
 * - AVAILABLE → se puede agregar
 *
 * NOTA: la validación oficial (que respeta isNewStudent y créditos) corre en
 * el backend con `validateMySelection`. Esta función solo se usa para el UI.
 */
export function deriveCourseState({
  course,
  approvedSet,
  selectedSet,
  isNewStudent,
}) {
  const id = String(course._id);
  if (approvedSet.has(id)) return { state: "APPROVED", missing: [] };
  if (selectedSet.has(id)) return { state: "SELECTED", missing: [] };
  const missing = (course.prerequisites || [])
    .map((p) => (typeof p === "object" ? p : { _id: p }))
    .filter((p) => !approvedSet.has(String(p._id)));
  if (missing.length && !isNewStudent) {
    return { state: "BLOCKED", missing };
  }
  return { state: "AVAILABLE", missing };
}

export default function CourseSelectionTable({
  courses,
  approvedSet,
  selectedSet,
  isNewStudent,
  onToggle,
  search,
  onSearchChange,
}) {
  const filtered = (courses || []).filter((c) => {
    if (!search?.trim()) return true;
    const term = search.trim().toLowerCase();
    return (
      c.code?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar curso por código o nombre..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-sm text-slate-500">
          {courses?.length
            ? "No hay cursos que coincidan con tu búsqueda."
            : "No hay cursos disponibles en el catálogo."}
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto rounded-xl border border-slate-100 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Curso</th>
                  <th className="px-4 py-3">Créditos</th>
                  <th className="px-4 py-3">Prerrequisito</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <CourseRow
                    key={c._id}
                    course={c}
                    info={deriveCourseState({
                      course: c,
                      approvedSet,
                      selectedSet,
                      isNewStudent,
                    })}
                    onToggle={onToggle}
                    isNewStudent={isNewStudent}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-2 lg:hidden">
            {filtered.map((c) => (
              <CourseCard
                key={c._id}
                course={c}
                info={deriveCourseState({
                  course: c,
                  approvedSet,
                  selectedSet,
                  isNewStudent,
                })}
                onToggle={onToggle}
                isNewStudent={isNewStudent}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CourseRow({ course, info, onToggle, isNewStudent }) {
  return (
    <tr className="hover:bg-slate-50/60">
      <td className="px-4 py-3 align-top">
        <p className="font-semibold text-slate-900">{course.name}</p>
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-sgoha-primary">{course.code}</span>
          {course.classroomTypeRequired && (
            <>
              <span className="mx-1.5 text-slate-300">·</span>
              {course.classroomTypeRequired === "LAB"
                ? "Laboratorio"
                : course.classroomTypeRequired === "COMPUTER_ROOM"
                  ? "Sala de cómputo"
                  : "Aula estándar"}
            </>
          )}
        </p>
      </td>
      <td className="px-4 py-3 align-top font-medium text-slate-700">
        {course.credits}
      </td>
      <td className="px-4 py-3 align-top">
        <PrerequisiteCell info={info} prerequisites={course.prerequisites} />
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex justify-end">
          <ActionButton info={info} onToggle={() => onToggle(course._id)} isNewStudent={isNewStudent} />
        </div>
      </td>
    </tr>
  );
}

function CourseCard({ course, info, onToggle, isNewStudent }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{course.name}</p>
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-sgoha-primary">{course.code}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            {course.credits} créditos
          </p>
        </div>
        <ActionButton info={info} onToggle={() => onToggle(course._id)} isNewStudent={isNewStudent} />
      </div>
      <div className="mt-2 text-xs">
        <span className="font-semibold uppercase tracking-wide text-slate-400">
          Prerrequisito:
        </span>{" "}
        <PrerequisiteCell info={info} prerequisites={course.prerequisites} inline />
      </div>
    </article>
  );
}

function PrerequisiteCell({ info, prerequisites = [], inline = false }) {
  if (!prerequisites.length) {
    return <span className={inline ? "italic text-slate-500" : "italic text-slate-400"}>Ninguno</span>;
  }
  const allCodes = prerequisites
    .map((p) => (typeof p === "object" ? p.code : p))
    .join(", ");
  if (info.state === "BLOCKED" && info.missing.length) {
    const codes = info.missing.map((p) => p.code || p._id).join(", ");
    return (
      <span className={`text-red-600 ${inline ? "font-medium" : "font-semibold"}`}>
        {codes}
      </span>
    );
  }
  return <span className="text-slate-600">{allCodes}</span>;
}

function ActionButton({ info, onToggle, isNewStudent }) {
  if (info.state === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Ya aprobado
      </span>
    );
  }
  if (info.state === "BLOCKED") {
    return (
      <button
        type="button"
        disabled
        title={
          isNewStudent
            ? "Estudiante nuevo: omite prerrequisitos"
            : "Faltan prerrequisitos"
        }
        className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500"
      >
        <Ban className="h-3.5 w-3.5" />
        Bloqueado
      </button>
    );
  }
  if (info.state === "SELECTED") {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        <X className="h-3.5 w-3.5" />
        Quitar
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1 rounded-lg bg-sgoha-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-900"
    >
      <Plus className="h-3.5 w-3.5" />
      Agregar
    </button>
  );
}

import { Sparkles, UserSearch } from "lucide-react";
import Badge from "../ui/Badge.jsx";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

/**
 * Card del Paso 1 — identificación del estudiante autenticado.
 *
 * IMPORTANTE: en producción los datos provienen de
 * `studentPortalService.getMyProfile()`. Si el alumno aún no está vinculado al
 * User, mostrar el placeholder.
 */
export default function StudentInfoCard({ student }) {
  if (!student) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-center text-sm text-slate-500">
        <UserSearch className="mx-auto mb-2 h-6 w-6 text-slate-400" />
        No se encontró un perfil de alumno vinculado a tu usuario. Contacta al
        administrador para completar tu registro.
      </div>
    );
  }

  const approved = student.approvedCourses || [];
  const visible = approved.slice(0, 2);
  const rest = approved.length - visible.length;

  return (
    <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sgoha-primary text-base font-bold text-white">
          {getInitials(student.fullName) || "·"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              {student.fullName}
            </h3>
            {student.isNewStudent && (
              <Badge variant="info">
                <Sparkles className="mr-1 inline h-3 w-3" />
                Nuevo
              </Badge>
            )}
            <Badge variant={student.active !== false ? "success" : "neutral"}>
              {student.active !== false ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            <span className="font-semibold text-slate-700">{student.code}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            {student.email}
          </p>
          {student.program && (
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              {student.program}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {visible.length === 0 ? (
              <span className="text-xs italic text-slate-400">
                Sin cursos aprobados aún
              </span>
            ) : (
              visible.map((c) => (
                <span
                  key={c._id || c.code}
                  className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700"
                >
                  {c.code}
                </span>
              ))
            )}
            {rest > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                +{rest} aprobados
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs font-medium text-blue-800">
        {student.isNewStudent
          ? "Estudiante nuevo: en esta primera matrícula no se aplican restricciones de prerrequisitos ni créditos previos."
          : "Este historial será usado para validar prerrequisitos."}
      </p>
    </div>
  );
}

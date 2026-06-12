import { Link } from "react-router-dom";
import { Gauge, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import Drawer from "../ui/Drawer.jsx";
import Badge from "../ui/Badge.jsx";
import EnrollmentStatusBadge from "./EnrollmentStatusBadge.jsx";

const MIN_CREDITS = 20;
const MAX_CREDITS = 22;

function normalizeValidationResult(v = {}) {
  return {
    prerequisitesValid: v.prerequisitesValid,
    creditsValid: v.creditsValid,
    coursesAvailable: v.coursesAvailable,
    duplicatedCourses: v.duplicatedCourses,
    alreadyApprovedCourses: v.alreadyApprovedCourses,
  };
}

function creditMessage(total) {
  if (total < MIN_CREDITS) {
    return `Faltan ${MIN_CREDITS - total} créditos para el mínimo requerido.`;
  }
  if (total > MAX_CREDITS) {
    return `Excede por ${total - MAX_CREDITS} créditos el máximo permitido.`;
  }
  return "Créditos dentro del rango permitido.";
}

export default function EnrollmentDetailDrawer({ enrollment, open, onClose }) {
  if (!enrollment) return null;
  const student = enrollment.student || {};
  const courses = enrollment.courses || [];
  const total = enrollment.totalCredits || 0;
  const vr = normalizeValidationResult(enrollment.validationResults);
  const progress = Math.min(100, Math.round((total / MAX_CREDITS) * 100));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Detalle de matrícula"
      footer={
        <p className="text-xs text-slate-500">
          La validación y confirmación la realiza el alumno en su portal. Este
          panel es solo de consulta para administración.
        </p>
      }
    >
      <div className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{student.fullName || "—"}</p>
              <p className="text-xs text-slate-500">{student.code || "—"} · {student.email || "—"}</p>
              <p className="text-xs text-slate-500">{student.program || "—"}</p>
            </div>
            <EnrollmentStatusBadge status={enrollment.status} />
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Cursos seleccionados</h3>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Curso</th>
                  <th className="px-3 py-2">Créditos</th>
                  <th className="px-3 py-2">Prerrequisitos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c._id || c.code}>
                    <td className="px-3 py-2 font-semibold text-sgoha-primary">{c.code}</td>
                    <td className="px-3 py-2 text-slate-700">{c.name}</td>
                    <td className="px-3 py-2 text-slate-700">{c.credits}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {(c.prerequisites || []).length
                        ? (c.prerequisites || []).map((p) => (typeof p === "object" ? p.code : p)).join(", ")
                        : "Sin prerrequisitos"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Gauge className="h-4 w-4" />
            Resumen de créditos
          </div>
          <p className="text-2xl font-bold text-slate-900">{total} créditos</p>
          <p className="text-xs text-slate-500">Rango permitido: 20 - 22</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full ${
                total < MIN_CREDITS
                  ? "bg-amber-500"
                  : total > MAX_CREDITS
                    ? "bg-red-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-600">{creditMessage(total)}</p>
        </section>

        <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ValidationRow label="Prerrequisitos" ok={vr.prerequisitesValid} />
          <ValidationRow label="Créditos" ok={vr.creditsValid} />
          <ValidationRow label="Cursos activos" ok={vr.coursesAvailable} />
          <ValidationRow label="Sin cursos repetidos" ok={!vr.duplicatedCourses} />
          <ValidationRow label="Sin cursos ya aprobados" ok={!vr.alreadyApprovedCourses} />
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Mensajes de validación</h3>
          {!enrollment.validationMessages?.length ? (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Sin mensajes registrados.</p>
          ) : (
            enrollment.validationMessages.map((msg, idx) => (
              <p key={`${idx}-${msg}`} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                • {msg}
              </p>
            ))
          )}
        </section>

        <p className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
          Solo las matrículas confirmadas serán consideradas para generar horarios.
        </p>

        <div className="pt-1">
          <Link
            to="/students"
            className="text-xs font-semibold text-sgoha-primary hover:underline"
          >
            Ver ficha del estudiante
          </Link>
        </div>
      </div>
    </Drawer>
  );
}

function ValidationRow({ label, ok }) {
  const valid = ok === true;
  const invalid = ok === false;
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
      <span className="text-slate-600">{label}</span>
      {valid ? (
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Correcto
        </span>
      ) : invalid ? (
        <span className="inline-flex items-center gap-1 font-semibold text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" /> Error
        </span>
      ) : (
        <Badge variant="neutral">No validado</Badge>
      )}
    </div>
  );
}

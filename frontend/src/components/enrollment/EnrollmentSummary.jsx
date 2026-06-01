import { ShieldCheck, CheckCircle2, Eraser } from "lucide-react";
import Badge from "../ui/Badge.jsx";
import {
  MIN_CREDITS,
  MAX_CREDITS,
  ENROLLMENT_STATUS_LABEL,
  ENROLLMENT_STATUS_BADGE,
} from "../../utils/enrollmentConstants.js";

/**
 * Panel lateral de resumen. Muestra la selección actual, total de créditos
 * con barra de progreso contra el rango permitido (MIN/MAX), estado de
 * validación y acciones (Validar / Confirmar / Limpiar).
 */
export default function EnrollmentSummary({
  selectedCourses = [],
  totalCredits,
  validation,
  enrollmentStatus,
  canConfirm,
  onValidate,
  onConfirm,
  onClear,
  validating,
  confirming,
  saving,
}) {
  const isEmpty = selectedCourses.length === 0;
  const status = enrollmentStatus || validation?.status || "INVALID";
  const statusLabel = ENROLLMENT_STATUS_LABEL[status] || "Incompleto";
  const statusVariant = ENROLLMENT_STATUS_BADGE[status] || "neutral";

  let progressTone = "bg-amber-400";
  let progressMessage = "Aún no has seleccionado cursos.";
  if (totalCredits > 0 && totalCredits < MIN_CREDITS) {
    progressTone = "bg-amber-400";
    progressMessage = `Faltan ${MIN_CREDITS - totalCredits} créditos para el mínimo requerido.`;
  } else if (totalCredits >= MIN_CREDITS && totalCredits <= MAX_CREDITS) {
    progressTone = "bg-emerald-500";
    progressMessage = "Créditos dentro del rango permitido.";
  } else if (totalCredits > MAX_CREDITS) {
    progressTone = "bg-red-500";
    progressMessage = `Superas el máximo permitido por ${totalCredits - MAX_CREDITS} créditos.`;
  }

  const progressWidth = Math.min(
    100,
    Math.round((totalCredits / MAX_CREDITS) * 100)
  );

  return (
    <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Resumen</h2>
        <Badge variant={statusVariant}>{statusLabel.toUpperCase()}</Badge>
      </header>

      <section>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Cursos seleccionados
        </p>
        {isEmpty ? (
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-3 text-xs italic text-slate-500">
            Aún no agregaste cursos a tu matrícula.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {selectedCourses.map((c) => (
              <li
                key={c._id}
                className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{c.code}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-slate-700">
                  {c.credits} cr.
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Total créditos
            </p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">
              {totalCredits}
              <span className="ml-1 text-xs font-medium text-slate-500">
                créditos
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Rango permitido
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-700">
              {MIN_CREDITS} - {MAX_CREDITS}
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full transition-all ${progressTone}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        <p
          className={`mt-2 text-xs ${
            totalCredits >= MIN_CREDITS && totalCredits <= MAX_CREDITS
              ? "text-emerald-700"
              : totalCredits > MAX_CREDITS
                ? "text-red-700"
                : "text-amber-700"
          }`}
        >
          {progressMessage}
        </p>
      </section>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onValidate}
          disabled={validating || saving || isEmpty}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sgoha-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {validating ? "Validando..." : "Validar matrícula"}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm || confirming}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
        >
          <CheckCircle2 className="h-4 w-4" />
          {confirming ? "Confirmando..." : "Confirmar matrícula"}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={isEmpty || saving}
          className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          <Eraser className="h-3.5 w-3.5" />
          Limpiar selección
        </button>
      </div>

      {status === "CONFIRMED" && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          Matrícula confirmada. Si cambias cursos, valida y confirma de nuevo.
        </p>
      )}
    </aside>
  );
}

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ListChecks,
  GaugeCircle,
} from "lucide-react";
import {
  MIN_CREDITS,
  MAX_CREDITS,
} from "../../utils/enrollmentConstants.js";

function isInformationalPrereqMessage(message) {
  const lower = String(message).toLowerCase();
  return (
    lower.includes("estudiante nuevo") ||
    lower.includes("omitidos") ||
    lower.includes("primera matrícula")
  );
}

function isPrerequisiteErrorMessage(message) {
  const lower = String(message).toLowerCase();
  if (isInformationalPrereqMessage(message)) return false;
  return (
    lower.includes("no cumple prerrequisito") ||
    lower.includes("ya aprobó") ||
    lower.includes("repetidos")
  );
}

/**
 * Resultado del Paso 3 — prerrequisitos, créditos y disponibilidad.
 */
export default function ValidationResults({
  validation,
  totalCredits,
  isNewStudent = false,
}) {
  if (!validation) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center text-sm text-slate-500">
        Presiona{" "}
        <span className="font-semibold text-slate-700">Validar matrícula</span>{" "}
        para verificar tu selección actual.
      </div>
    );
  }

  const messages = validation.messages || [];
  const total =
    typeof totalCredits === "number"
      ? totalCredits
      : validation.totalCredits || 0;

  const prereqErrors = messages.filter(isPrerequisiteErrorMessage);
  const skipPrereqs =
    validation.validationResults?.newStudentPrereqsSkipped === true ||
    isNewStudent;

  let prereqStatus = "ok";
  let prereqDescription = "Prerrequisitos cumplidos";

  if (skipPrereqs) {
    prereqDescription =
      "Estudiante nuevo: no se exigen prerrequisitos en la primera matrícula";
  } else if (prereqErrors.length > 0) {
    prereqStatus = "error";
    prereqDescription = prereqErrors.join(" · ");
  }

  let creditsStatus = "ok";
  let creditsMessage = "Créditos dentro del rango permitido";
  if (total === 0) {
    creditsStatus = "warn";
    creditsMessage = "Aún no has seleccionado cursos";
  } else if (total < MIN_CREDITS) {
    creditsStatus = "warn";
    creditsMessage = `Debe alcanzar mínimo ${MIN_CREDITS} créditos (faltan ${MIN_CREDITS - total})`;
  } else if (total > MAX_CREDITS) {
    creditsStatus = "error";
    creditsMessage = `Supera el máximo de ${MAX_CREDITS} créditos en ${total - MAX_CREDITS}`;
  }

  const availabilityMessages = messages.filter((m) =>
    String(m).toLowerCase().includes("no existen")
  );
  const availabilityStatus = availabilityMessages.length === 0 ? "ok" : "error";

  return (
    <div className="space-y-2.5">
      <ResultRow
        icon={ShieldCheck}
        status={prereqStatus}
        title="Prerrequisitos"
        description={prereqDescription}
      />
      <ResultRow
        icon={GaugeCircle}
        status={creditsStatus}
        title="Créditos dentro del rango"
        description={creditsMessage}
      />
      <ResultRow
        icon={ListChecks}
        status={availabilityStatus}
        title="Cursos disponibles"
        description={
          availabilityStatus === "ok"
            ? "Todos los cursos seleccionados están activos"
            : availabilityMessages.join(" · ")
        }
      />
    </div>
  );
}

function ResultRow({ status, title, description }) {
  const palette =
    status === "ok"
      ? {
          ring: "border-emerald-200 bg-emerald-50",
          icon: "bg-emerald-100 text-emerald-700",
          label: "CORRECTO",
          labelClass: "text-emerald-700 bg-emerald-100",
          IconStatus: CheckCircle2,
        }
      : status === "warn"
        ? {
            ring: "border-amber-200 bg-amber-50",
            icon: "bg-amber-100 text-amber-800",
            label: "ADVERTENCIA",
            labelClass: "text-amber-800 bg-amber-100",
            IconStatus: AlertTriangle,
          }
        : {
            ring: "border-red-200 bg-red-50",
            icon: "bg-red-100 text-red-700",
            label: "ERROR",
            labelClass: "text-red-700 bg-red-100",
            IconStatus: XCircle,
          };
  const { IconStatus } = palette;
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 ${palette.ring}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${palette.icon}`}
        >
          <IconStatus className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
      </div>
      <span
        className={`shrink-0 self-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${palette.labelClass}`}
      >
        {palette.label}
      </span>
    </div>
  );
}

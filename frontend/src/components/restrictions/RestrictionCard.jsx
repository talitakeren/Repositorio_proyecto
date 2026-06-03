import {
  UserRound,
  Building2,
  Users,
  BookOpen,
  Clock,
  CalendarCheck,
  CalendarClock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Badge from "../ui/Badge.jsx";

const ICONS = {
  UserRound,
  Building2,
  Users,
  BookOpen,
  Clock,
  CalendarCheck,
  CalendarClock,
  ShieldCheck,
};

const TYPE_LABEL = { HARD: "Dura", OPERATIONAL: "Operativa" };
const TYPE_VARIANT = { HARD: "error", OPERATIONAL: "info" };
const PRIORITY_VARIANT = { HIGH: "warning", MEDIUM: "neutral" };

export default function RestrictionCard({ restriction, timeBlocks = [] }) {
  const Icon = ICONS[restriction.icon] || ShieldCheck;
  const isHard = restriction.type === "HARD";

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        isHard ? "border-red-100" : "border-blue-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isHard ? "bg-red-50 text-red-700" : "bg-blue-50 text-sgoha-primary"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">{restriction.name}</h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge variant={TYPE_VARIANT[restriction.type]}>
                {TYPE_LABEL[restriction.type]}
              </Badge>
              <Badge variant="success">
                <CheckCircle2 className="mr-1 inline h-3 w-3" />
                Activa
              </Badge>
              <Badge variant={PRIORITY_VARIANT[restriction.priority]}>
                Prioridad {restriction.priority === "HIGH" ? "alta" : "media"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">{restriction.description}</p>

      {restriction.examples && (
        <p className="mt-2 text-xs text-slate-500">{restriction.examples}</p>
      )}

      <dl className="mt-4 space-y-2 rounded-xl bg-slate-50/80 p-3 text-xs">
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-400">
            Validación
          </dt>
          <dd className="mt-0.5 font-mono text-slate-700">
            {restriction.validation}
          </dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wide text-slate-400">
            Impacto
          </dt>
          <dd className="mt-0.5 text-slate-700">{restriction.impact}</dd>
        </div>
      </dl>

      {restriction.showTimeBlocks && timeBlocks.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Franjas oficiales ({timeBlocks.length} por día)
          </p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {timeBlocks.map((b) => (
              <li
                key={b.label}
                className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-600"
              >
                {b.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

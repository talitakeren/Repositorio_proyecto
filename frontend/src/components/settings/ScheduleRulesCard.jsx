import { Link } from "react-router-dom";
import { Clock, Lock } from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { DAY_FULL_LABEL } from "../../constants/timeBlocks.js";

export default function ScheduleRulesCard({ scheduleRules, timeBlocks }) {
  const dayLabels = (scheduleRules?.activeDays || []).map(
    (key) => DAY_FULL_LABEL[key] || key
  );

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        Parámetros de horarios
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Las franjas horarias oficiales son usadas por la disponibilidad docente,
        la matrícula y el motor CSP.
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-400">
            Días activos
          </dt>
          <dd className="mt-1 text-slate-800">{dayLabels.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-400">
            Franjas por día
          </dt>
          <dd className="mt-1 text-lg font-bold text-slate-900">
            {scheduleRules?.blocksPerDay ?? 18}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-400">
            Total semanal
          </dt>
          <dd className="mt-1 text-lg font-bold text-slate-900">
            {scheduleRules?.totalWeeklySlots ?? 126}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Clock className="h-4 w-4" />
          Franjas oficiales HORALV
        </p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {timeBlocks.map((block) => (
            <li
              key={block.label}
              className="rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-700"
            >
              {block.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 text-sm text-amber-900">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Las franjas oficiales están protegidas para evitar inconsistencias
            en la generación de horarios.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" disabled>
            Editar franjas
          </Button>
          <Link to="/timeslots">
            <Button type="button" variant="primary" size="sm">
              Ver franjas horarias
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

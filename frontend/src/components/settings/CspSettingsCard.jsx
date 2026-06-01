import { Link } from "react-router-dom";
import { Cpu, Ban, CalendarDays } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

const ACTIVE_RULES = [
  "No solapamiento de docentes.",
  "No solapamiento de aulas.",
  "No solapamiento de estudiantes.",
  "Compatibilidad curso-aula.",
  "Capacidad suficiente del aula.",
  "Disponibilidad docente.",
  "Solo matrículas confirmadas.",
];

const ALGORITHM_LABELS = {
  CSP_BASIC_BACKTRACKING: "CSP básico por backtracking",
};

export default function CspSettingsCard({ csp }) {
  const enabled = csp?.enabled !== false;
  const algorithm =
    ALGORITHM_LABELS[csp?.algorithm] || "CSP básico por backtracking";

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Motor de generación CSP
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Parámetros del motor que asigna horarios respetando restricciones
            duras y operativas.
          </p>
        </div>
        <Badge variant={enabled ? "success" : "neutral"}>
          {enabled ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      <dl className="mt-5 space-y-4 text-sm">
        <div className="rounded-xl bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase text-slate-400">
            Algoritmo
          </dt>
          <dd className="mt-1 flex items-center gap-2 font-medium text-slate-800">
            <Cpu className="h-4 w-4 text-sgoha-primary" />
            {algorithm}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-400">
            Criterio de asignación de aulas
          </dt>
          <dd className="mt-1 text-slate-600">
            El sistema asigna aulas compatibles según el tipo requerido por el
            curso, capacidad y disponibilidad.
          </dd>
        </div>
        <div>
          <dt className="mb-2 text-xs font-semibold uppercase text-slate-400">
            Reglas activas
          </dt>
          <ul className="space-y-1.5">
            {ACTIVE_RULES.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 text-slate-700"
              >
                <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/restrictions">
          <Button type="button" variant="secondary" size="sm">
            Ir a restricciones
          </Button>
        </Link>
        <Link to="/schedules">
          <Button type="button" variant="primary" size="sm">
            <CalendarDays className="h-4 w-4" />
            Ir a horarios
          </Button>
        </Link>
      </div>
    </Card>
  );
}

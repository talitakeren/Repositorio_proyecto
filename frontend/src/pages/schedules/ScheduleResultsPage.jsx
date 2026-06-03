import { useEffect, useState } from "react";
import { scheduleService } from "../../services/scheduleService.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function ScheduleResultsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    scheduleService.list().then(setItems);
  }, []);

  const latest = items[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resultados del horario"
        subtitle="Última generación registrada en el sistema."
      />

      {!latest ? (
        <Card className="p-8 text-center text-slate-500">
          No hay horarios generados.
        </Card>
      ) : (
        <Card className="space-y-4 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-400">Periodo</p>
              <p className="mt-1 font-medium text-slate-900">{latest.period}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-400">Estado</p>
              <div className="mt-1">
                <Badge variant="info">{latest.status}</Badge>
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-slate-400">Asignaciones</p>
              <p className="mt-1 font-medium text-slate-900">
                {latest.assignments?.length ?? 0}
              </p>
            </div>
          </div>
          {latest.conflicts?.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">Conflictos</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
                {latest.conflicts.map((c, i) => (
                  <li key={i}>{c.message}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

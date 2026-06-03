import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info, CalendarDays, Loader2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import RestrictionSummaryCards from "../../components/restrictions/RestrictionSummaryCards.jsx";
import RestrictionCard from "../../components/restrictions/RestrictionCard.jsx";
import SystemPrecheckPanel from "../../components/restrictions/SystemPrecheckPanel.jsx";
import CspFlowMap from "../../components/restrictions/CspFlowMap.jsx";
import { restrictionService } from "../../services/restrictionService.js";

export default function RestrictionsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [hard, setHard] = useState([]);
  const [operational, setOperational] = useState([]);
  const [precheck, setPrecheck] = useState(null);
  const [timeBlocks, setTimeBlocks] = useState([]);

  useEffect(() => {
    Promise.all([
      restrictionService.getRestrictions(),
      restrictionService.getRestrictionsSummary(),
      restrictionService.getSystemPrecheck(),
    ])
      .then(([catalog, sum, pre]) => {
        setHard(catalog.hard || []);
        setOperational(catalog.operational || []);
        setSummary(sum);
        setPrecheck(pre.precheck);
        setTimeBlocks(pre.timeBlocks || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando restricciones...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Restricciones"
        subtitle="Consulta las reglas que utiliza el motor CSP para generar horarios académicos sin conflictos."
      />

      <Card className="flex flex-col gap-4 border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sgoha-primary" />
          <p className="text-sm text-blue-900">
            Estas restricciones son aplicadas por el motor CSP al generar
            horarios. Si alguna condición no se cumple, el sistema puede generar
            conflictos o impedir la generación.
          </p>
        </div>
        <Link
          to="/schedules"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sgoha-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900"
        >
          <CalendarDays className="h-4 w-4" />
          Ir a horarios
        </Link>
      </Card>

      <RestrictionSummaryCards
        totalActive={summary?.totalActive ?? 0}
        hardCount={summary?.hardCount ?? 0}
        operationalCount={summary?.operationalCount ?? 0}
        motorStatus={summary?.motorStatus ?? "—"}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Restricciones duras
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Obligatorias. Si no se cumplen, no se puede generar un horario válido.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {hard.map((r) => (
            <RestrictionCard
              key={r.id}
              restriction={r}
              timeBlocks={timeBlocks}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Restricciones operativas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Condiciones que mejoran la calidad de la asignación y evitan
            configuraciones inviables.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {operational.map((r) => (
            <RestrictionCard
              key={r.id}
              restriction={r}
              timeBlocks={r.showTimeBlocks ? timeBlocks : []}
            />
          ))}
        </div>
      </section>

      <SystemPrecheckPanel precheck={precheck} loading={false} />

      <CspFlowMap />
    </div>
  );
}

import { useState } from "react";
import { Zap } from "lucide-react";
import { scheduleService } from "../../services/scheduleService.js";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function ScheduleGenerationPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const data = await scheduleService.generate("2026-1");
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generar horario"
        subtitle="Motor CSP básico — requiere matrículas confirmadas, docentes, aulas y franjas activas."
      />

      <Card className="p-5 sm:p-6">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sgoha-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 disabled:opacity-60 sm:w-auto"
        >
          <Zap className="h-4 w-4" />
          {loading ? "Generando..." : "Generar horario"}
        </button>
      </Card>

      {result && (
        <Card className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Estado:</span>
            <Badge variant={result.status === "OPTIMAL" ? "success" : "warning"}>
              {result.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            <strong>Asignaciones:</strong> {result.assignments?.length ?? 0}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Conflictos:</strong> {result.conflicts?.length ?? 0}
          </p>
        </Card>
      )}
    </div>
  );
}

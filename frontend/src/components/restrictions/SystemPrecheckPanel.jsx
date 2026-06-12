import { AlertTriangle } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";

function statusBadge(status) {
  if (status === "ok") return { text: "Correcto", variant: "success" };
  if (status === "warning") return { text: "Advertencia", variant: "warning" };
  if (status === "error") return { text: "Pendiente", variant: "error" };
  return { text: "Sin datos", variant: "neutral" };
}

export default function SystemPrecheckPanel({ precheck, loading }) {
  if (loading) {
    return (
      <Card className="p-6 text-center text-sm text-slate-500">
        Cargando prevalidación del sistema...
      </Card>
    );
  }

  if (!precheck) {
    return (
      <Card className="border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        No se pudo cargar la prevalidación. Verifique que el backend esté activo.
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Prevalidación del sistema
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Estado actual de los datos necesarios para generar horarios con el
            motor CSP.
          </p>
        </div>
        <Badge variant={precheck.canGenerate ? "success" : "warning"}>
          {precheck.canGenerate ? "Listo para generar" : "Revisar datos"}
        </Badge>
      </div>

      <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        {precheck.items.map((item) => {
          const st = statusBadge(item.status);
          return (
            <li
              key={item.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">{item.label}</p>
                <p className="text-sm text-slate-500">{item.message}</p>
              </div>
              <Badge variant={st.variant}>{st.text}</Badge>
            </li>
          );
        })}
      </ul>

      {precheck.warnings?.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Advertencias
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {precheck.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

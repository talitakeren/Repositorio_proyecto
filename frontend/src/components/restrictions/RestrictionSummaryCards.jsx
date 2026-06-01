import { ShieldCheck, Ban, Settings2, Cpu } from "lucide-react";
import Card from "../ui/Card.jsx";

export default function RestrictionSummaryCards({
  totalActive = 0,
  hardCount = 0,
  operationalCount = 0,
  motorStatus = "—",
}) {
  const motorReady = motorStatus === "Listo";

  const cards = [
    {
      label: "Restricciones activas",
      value: totalActive,
      icon: ShieldCheck,
      accent: "text-sgoha-primary bg-blue-50",
    },
    {
      label: "Restricciones duras",
      value: hardCount,
      icon: Ban,
      accent: "text-red-700 bg-red-50",
    },
    {
      label: "Restricciones operativas",
      value: operationalCount,
      icon: Settings2,
      accent: "text-amber-800 bg-amber-50",
    },
    {
      label: "Estado del motor",
      value: motorStatus,
      icon: Cpu,
      accent: motorReady
        ? "text-emerald-700 bg-emerald-50"
        : "text-amber-800 bg-amber-50",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, accent, isText }) => (
        <Card key={label} className="flex items-start gap-3 p-4 sm:p-5">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p
              className={`mt-1 font-bold text-slate-900 ${
                isText ? "text-lg" : "text-2xl"
              }`}
            >
              {value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
